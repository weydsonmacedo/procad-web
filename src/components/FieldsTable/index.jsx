import * as React from 'react';
import { styled } from '@material-ui/core';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useHistory, useRouteMatch } from "react-router-dom";
import { ArrowForward } from '@material-ui/icons';


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
  cursor: 'pointer',
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

export default function FieldsTable({list, performedNumber}) {

  const history = useHistory();
  const match = useRouteMatch();

  const handleClick = (campo) => {
    history.push(`${match.url}/campo/${campo}`)
  }

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="left" >CAMPO</StyledTableCell>
            {/* <StyledTableCell align="left" >REALIZADAS</StyledTableCell> */}
            <StyledTableCell align="center" >REALIZADAS</StyledTableCell>
            
          </TableRow>
        </TableHead>
        {/* <div style={{maxHeight: '420px', overflowY: 'auto', minWidth: '100%', display: 'block', flex: 1}}> */}
        <TableBody >
            
          {list.map((row) => (
            
              <StyledTableRow key={row.id} onClick={() => handleClick(row.id)} style={{flex: 1, width: '100%'}}>
                <StyledTableCell align="left">{row.campo}</StyledTableCell>
                {/* <StyledTableCell align="center">{0}</StyledTableCell> */}
                <StyledTableCell align="center">{performedNumber(row.id)}</StyledTableCell>
                

                {/* <StyledTableCell align="left">{new Date(row.createdAt).toLocaleDateString()}</StyledTableCell>
                <StyledTableCell align="left">{new Date(row.from).toLocaleDateString()}</StyledTableCell> */}
              </StyledTableRow>
            
          ))}
        </TableBody>
        
        {/* </div> */}
      </Table>
    </TableContainer>
  );
}