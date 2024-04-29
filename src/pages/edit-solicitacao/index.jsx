import React, { useContext, useEffect, useState } from "react";
import { Container, IconButton, Typography } from "@material-ui/core";
import { ArrowBack, Add, Delete } from "@material-ui/icons";
import { Link, useRouteMatch, useParams } from "react-router-dom";
import { getFormulary } from "../../store/reducers/formulary";
import { getFields, getActivitiesCompleted } from "../../store/reducers/report";
import ReportHeader from "../../components/ReportHeader";

import { GlobalStateContext } from "../../store";
import { CircularProgress, Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { getLevels, getRoles } from "../../store/reducers/common";
import EditTable from "../../components/EditTable";

const EditSolicitacao = () => {
  const [state, dispatch] = useContext(GlobalStateContext);
  const params = useParams();

  useEffect(() => {
    async function fetchCommonData() {
      getLevels(dispatch);
      getRoles(dispatch);
    }
    fetchCommonData();

    async function fetchData() {
      let formulary = await getFormulary(params.formularyId, dispatch).catch(
        console.log
      );
      await getFields(dispatch);

      let answers = (formulary || {}).dbFormularyAnswers || [];
      await getActivitiesCompleted(answers, dispatch);
    }

    fetchData();
  }, []);

  return (
    <Container>
      {state.formulary.loading && (
        <div
          style={{
            width: "100%",
            height: "100%",
            zIndex: 3001,
            top: 0,
            left: 0,
            position: "fixed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "rgba(0,0,0,.3)",
          }}
        >
          <CircularProgress />
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center" }}>
        <Link to="/">
          <IconButton edge="start" aria-label="voltar">
            <ArrowBack />
          </IconButton>
        </Link>
        <Typography variant="h6">Edite sua Progressão</Typography>
      </div>
      <ReportHeader />
      <EditTable />
    </Container>
  );
};

export default EditSolicitacao;
