import { Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { GlobalStateContext } from "../../store";

const Comission = ({ list }) => {
  return (
    <>
      {list.map((comis, idx) => (
        <Typography
          variant="body2"
          color="textPrimary"
          key={idx + comis.professorName}
          style={{
            fontSize: 12,
            border: "1px solid #ebebeb",
            padding: "2px 4px",
            marginBottom: "6px",
          }}
        >
          {`${comis.professorName}, ${comis.institute}, ${comis.department}`}
        </Typography>
      ))}
    </>
  );
};

export default function ReportHeader() {
  const [state, dispatch] = useContext(GlobalStateContext);

  const getTotal = () => {
    return state.report.allActivities.reduce((soma, next) => {
      soma += Number(next.points);
      return soma;
    }, 0);
  };

  let comissao =
    ((state.formulary.data || {}).dbFormulary || {}).comission || [];

  let solicitacaoLabel = {
    Progressao: "Progressão",
    Promocao: "Promoção",
  };

  const getRole = () => {
    let role = state.common.roles.filter(
      (r) => r.id === ((state.formulary.data || {}).dbFormulary || {}).roleId
    );

    let name = "N/A";

    if (!!role.length) {
      name = role.map((r) => {
        return r.name;
      });
    }

    return name;
  };

  const getLevel = () => {
    let level = state.common.levels.filter(
      (r) => r.id === ((state.formulary.data || {}).dbFormulary || {}).levelId
    );

    let name = "N/A";

    if (!!level.length) {
      name = level.map((r) => {
        return r.name;
      });
    }

    return name;
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "start",
        padding: "10px 0 8px 0",
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "start",
        }}
      >
        <div style={{ marginRight: "26px" }}>
          <Typography
            variant="body1"
            color="textSecondary"
            style={{ fontSize: 12 }}
          >
            Tipo de Solicitação:{" "}
            <span className="fnt-color-black">
              {((state.formulary.data || {}).dbFormulary || {}).type || "N/A"}
            </span>
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            className="fnt-normal"
            style={{ marginTop: "10px" }}
          >
            Interstício:{" "}
            <span className="fnt-color-black fnt-normal">{`${new Date(
              ((state.formulary.data || {}).dbFormulary || {}).from
            ).toLocaleDateString()} a ${new Date(
              ((state.formulary.data || {}).dbFormulary || {}).to
            ).toLocaleDateString()}`}</span>
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <Typography
              variant="body1"
              color="textSecondary"
              className="fnt-normal"
              style={{ marginTop: "10px", marginRight: "10px" }}
            >
              Perfil: <span className="fnt-color-black">{getRole()}</span>
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              className="fnt-normal"
              style={{ marginTop: "10px", marginRight: "10px" }}
            >
              Classe: <span className="fnt-color-black">{getLevel()}</span>
            </Typography>
            <Typography
              variant="body1"
              color="textSecondary"
              className="fnt-normal"
              style={{ marginTop: "10px", marginBottom: "15px" }}
            >
              Nível:{" "}
              <span className="fnt-color-black">
                {((state.formulary.data || {}).dbFormulary || {}).classId ||
                  "N/A"}
              </span>
            </Typography>
          </div>
        </div>
        <div style={{ marginLeft: "20px" }}>
          <div style={{ display: "flex" }}>
            <Typography
              variant="body1"
              color="textSecondary"
              className="fnt-normal"
            >
              Comissão:
            </Typography>
            <div style={{ marginLeft: "8px" }}>
              {comissao.length ? (
                <Comission list={comissao} />
              ) : (
                <Typography variant="body1" color="textSecondary">
                  &nbsp;N/A
                </Typography>
              )}
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: "0px", marginLeft: "auto" }}>
        <Typography
          color="textSecondary"
          className="fnt-color-black fnt-normal"
        >
          Pontuação Total{" "}
        </Typography>
        <Typography variant="h3" color="primary" style={{ textAlign: "right" }}>
          {getTotal()}
        </Typography>
      </div>
    </div>
  );
}
