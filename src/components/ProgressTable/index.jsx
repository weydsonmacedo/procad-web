import * as React from 'react';
import { styled } from '@material-ui/core';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Link, useHistory } from "react-router-dom";
import { IconButton } from '@material-ui/core'
import { Delete } from '@material-ui/icons';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function ProgressTable({ list, onDeleteClick }) {    
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left">Atividade</StyledTableCell>
            <StyledTableCell align="center">Pontuação</StyledTableCell>
            <StyledTableCell align="center">Ações</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((row, idx) => (

            <StyledTableRow key={idx} >
              <StyledTableCell align="left">{row.atividade}</StyledTableCell>
              <StyledTableCell align="center">{row.points}</StyledTableCell>
              <StyledTableCell align="center">
                <IconButton edge="start" aria-label="Deletar" title='Deletar Atividade' onClick={() => onDeleteClick(row.formularyAnswerId)}>
                  <Delete />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>

          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}