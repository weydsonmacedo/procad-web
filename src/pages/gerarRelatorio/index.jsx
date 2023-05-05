import React, { useContext, useState, useEffect } from 'react'
import { GlobalStateContext } from '../../store';
import moment from 'moment';
import './style.css';
import { useHistory, useParams } from "react-router-dom";
import { getFormulary } from '../../store/reducers/formulary';
import { getActivitiesCompleted } from '../../store/reducers/report';
import { sendEmail } from '../../store/reducers/report';
/*import * as puppeteer from 'puppeteer';*/

export default function GerarRelatorio() {

    const [state, dispatch] = useContext(GlobalStateContext);

    const params = useParams();

    const history = useHistory();



    useEffect(() => {

        async function fetchData() {
            let formulary = await getFormulary(params.formularyId, dispatch).catch(console.log);
            let answers = (formulary || {}).dbFormularyAnswers || [];
            let dbUser =  (formulary || {}).dbUser || [];
            getActivitiesCompleted(answers, dispatch);
        }

        fetchData();
    }, [])

    const [user, setUser] = useState({
        firstName: localStorage.getItem("firstName") || "User",
        lastName: localStorage.getItem("lastName") || "Name",
        siape: localStorage.getItem("siape") || "XXXXXXX",
        email: state.formulary.data.dbUser[0].email,

    });

    const { type = "N/A", comission = [], from, to } = ((state.formulary.data || {}).dbFormulary || {});

    let dates = {
        p1: moment(from),
        p2: moment(from).add(6, "months"),
        p3: moment(from).add(12, "months"),
        p4: moment(from).add(18, "months"),
    }

    let intersticio = {
        period1: `${dates.p1.year()}.${dates.p1.month() < 7 ? 1 : 2}`,
        period2: `${dates.p2.year()}.${dates.p2.month() < 7 ? 1 : 2}`,
        period3: `${dates.p3.year()}.${dates.p3.month() < 7 ? 1 : 2}`,
        period4: `${dates.p4.year()}.${dates.p4.month() < 7 ? 1 : 2}`,

    }

    const printPage = () => {
        window.print();
    }

    async function generatePdfFromHtml() {
      
        let completeName = user.firstName + " " + user.lastName;
       let mail = {
            userName: completeName,
            html: '<html>' + document.getElementById('relatorio-content').outerHTML + '</html>',
            mailSetting: {
                to: user.email,
            }
        };
        sendEmail(mail, dispatch);
    }

    const goBack = () => {
        history.goBack()
    }

    const downloadCSVFile = (csv, filename) => {
        var csv_file, download_link;

        csv_file = new Blob(["\uFEFF" + csv], {
            type: 'text/csv; charset=utf-8'
        });

        download_link = document.createElement("a");

        download_link.download = filename;

        download_link.href = window.URL.createObjectURL(csv_file);

        download_link.style.display = "none";

        document.body.appendChild(download_link);

        download_link.click();

    }

    const htmlToCSV = (filename) => {
        var data = [];
        var rows = document.querySelectorAll("table tr");

        for (var i = 0; i < rows.length; i++) {
            var row = [], cols = rows[i].querySelectorAll("td, th");

            for (var j = 0; j < cols.length; j++) {
                row.push(cols[j].innerText);
            }

            data.push(row.join(";"));
        }

        downloadCSVFile(data.join("\n"), filename);
    }

    function getRelatorio() {

        let relatorio = [];

        const { dbFormularyAnswers = [] } = ((state.formulary.data || {}));

        let result = dbFormularyAnswers.reduce(function (r, a) {

            r[a.fieldId] = r[a.fieldId] || [];

            let activity = state.report.allActivities.find(acti => acti.id === a.activityId) || {};

            let atividadeDto = { ...a, ...activity };

            atividadeDto.detailedAnswer = {
                period1: {
                    quantity: 0,
                    points: 0
                },
                period2: {
                    quantity: 0,
                    points: 0
                },
                period3: {
                    quantity: 0,
                    points: 0
                },
                period4: {
                    quantity: 0,
                    points: 0
                },
            };

            atividadeDto.answer.forEach(ans => {

                let dto = Number(ans.quantity / atividadeDto.peso);

                let soma = Number((dto * atividadeDto.pontos).toFixed(2));

                let ansDto = {
                    ...ans,
                    points: soma
                }

                switch (ans.semester) {
                    case intersticio.period1:
                        atividadeDto.detailedAnswer.period1 = ansDto
                        break;

                    case intersticio.period2:
                        atividadeDto.detailedAnswer.period2 = ansDto
                        break;

                    case intersticio.period3:
                        atividadeDto.detailedAnswer.period3 = ansDto
                        break;

                    case intersticio.period4:
                        atividadeDto.detailedAnswer.period4 = ansDto
                        break;

                    default:
                        break;
                }

            });

            r[a.fieldId].push(atividadeDto);

            return r;

        }, Object.create(null));

        for (const key in result) {
            if (result[key]) {
                relatorio.push({
                    campo: result[key][0].campo,
                    campoDetailed:
                    {
                        period1: result[key].reduce(function (sum, current) {
                            return sum + current.detailedAnswer.period1.points;
                        }, 0),
                        period2: result[key].reduce(function (sum, current) {
                            return sum + current.detailedAnswer.period2.points;
                        }, 0),
                        period3: result[key].reduce(function (sum, current) {
                            return sum + current.detailedAnswer.period3.points;
                        }, 0),
                        period4: result[key].reduce(function (sum, current) {
                            return sum + current.detailedAnswer.period4.points;
                        }, 0),
                        total: result[key].reduce(function (sum, current) {
                            return sum + current.points;
                        }, 0),
                    },
                    atividades: result[key]
                })
            }
        }

        return relatorio;
    }

    getRelatorio();

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>

            <div className="gerar-relatorio-action">
                <button className="btn-gerar-relatorio" onClick={goBack}>Voltar</button>
                <button className="btn-gerar-relatorio" onClick={printPage}>Imprimir Relatório (PDF)</button>
                <button className="btn-gerar-relatorio" onClick={() => htmlToCSV('Relatorio.csv')}>Download CSV</button>
                <button className="btn-gerar-relatorio" onClick={() =>generatePdfFromHtml()}>Enviar por Email (PDF)</button>
            </div>

            <div style={{ marginLeft: '20%', marginRight: '20%' }}>
                <main id="relatorio-content">
                    <table width="100%">
                        <tbody>
                            <tr>
                                <td colSpan={6}>
                                    <b style={{ fontWeight: 'bolder' }}>DOCENTE: </b>
                                    {user.firstName + " " + user.lastName}
                                </td>

                                <td colSpan={5}>
                                    <b style={{ fontWeight: 'bolder' }}>SIAPE: </b>
                                    {user.siape}
                                </td>
                            </tr>

                            <tr>
                                <td style={{ fontWeight: 'bolder' }}>SOLICITAÇÃO:</td>
                                <td style={{ fontWeight: 'bolder' }} align="center" colSpan={5}>PROMOÇÃO({type === "Promoção" ? 'X' : ''})</td>
                                <td style={{ fontWeight: 'bolder' }} align="center" colSpan={5}>PROGRESSÃO({type === "Progressão" ? 'X' : ''})</td>
                            </tr>

                            <tr>
                                <td style={{ fontWeight: 'bolder' }} colSpan={11}>COMISSÃO:</td>
                            </tr>

                            {comission.map(comis =>
                                <tr>
                                    <td style={{ paddingLeft: '80px' }} colSpan={11}>{`Prof. ${comis.professorName} - Departamento ${comis.department} - Instituto ${comis.institute}.`}</td>
                                </tr>
                            )}

                            <tr>
                                <td style={{ fontWeight: 'bolder' }}>DETALHE DA SOLICITAÇÃO:</td>
                                <td colSpan={10} align="center">
                                    <b style={{ fontWeight: 'bolder' }}>INTERSTÍCIO: </b>
                                    {`${moment(from).format("DD/MM/yyyy")} a ${moment(to).format("DD/MM/yyyy")}`}
                                </td>
                            </tr>

                            <tr>
                                <th style={{ fontWeight: 'bolder' }}>CAMPO</th>
                                <th>&nbsp;</th>
                                <th style={{ fontWeight: 'bolder' }} colSpan={4} align="center">OCORRÊNCIA</th>
                                <th>&nbsp;</th>
                                <th style={{ fontWeight: 'bolder' }} colSpan={4} align="center">PONTUAÇÃO DETALHADA</th>
                            </tr>

                            {
                                getRelatorio().map(rel => (<>
                                    <tr>
                                        <th>{rel.campo}</th>
                                        <th style={{ fontWeight: 'bolder' }}>PONTOS</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period1}</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period2}</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period3}</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period4}</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">TOTAL</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period1}</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period2}</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period3}</th>
                                        <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period4}</th>
                                    </tr>
                                    {rel.atividades.map(ativ => (
                                        <tr>
                                            <td>{ativ.atividade}</td>
                                            <td>{ativ.label}</td>
                                            <td align="center">{ativ.detailedAnswer.period1.quantity}</td>
                                            <td align="center">{ativ.detailedAnswer.period2.quantity}</td>
                                            <td align="center">{ativ.detailedAnswer.period3.quantity}</td>
                                            <td align="center">{ativ.detailedAnswer.period4.quantity}</td>
                                            <td align="center">{ativ.points}</td>
                                            <td align="center">{ativ.detailedAnswer.period1.points}</td>
                                            <td align="center">{ativ.detailedAnswer.period2.points}</td>
                                            <td align="center">{ativ.detailedAnswer.period3.points}</td>
                                            <td align="center">{ativ.detailedAnswer.period4.points}</td>
                                        </tr>
                                    ))}
                                </>)
                                )
                            }

                            <tr>
                                <td style={{ fontWeight: 'bolder' }} colSpan={11} align="center">RESUMO DE PONTUAÇÃO POR SEMESTRE</td>
                            </tr>
                            <tr>
                                <th style={{ fontWeight: 'bolder' }} colSpan={6} align="center">ATIVIDADES</th>
                                <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period1}</th>
                                <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period2}</th>
                                <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period3}</th>
                                <th style={{ fontWeight: 'bolder' }} align="center">{intersticio.period4}</th>
                                <th style={{ fontWeight: 'bolder' }} align="center">TOTAL</th>
                            </tr>

                            {
                                getRelatorio().map(rel => (<>
                                    <tr>
                                        <th colSpan={6}>{rel.campo}</th>
                                        <th align="center">{rel.campoDetailed.period1}</th>
                                        <th align="center">{rel.campoDetailed.period2}</th>
                                        <th align="center">{rel.campoDetailed.period3}</th>
                                        <th align="center">{rel.campoDetailed.period4}</th>
                                        <th align="center">{rel.campoDetailed.total}</th>
                                    </tr>
                                </>)
                                )
                            }
                        </tbody>
                    </table>
                </main>
            </div>
        </div>
    )
}
