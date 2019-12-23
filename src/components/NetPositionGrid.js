import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

function NetPositionGrid(props) {
    const {stocks} = props;
    return (
        <TableContainer component={Paper}>
            <Table className="net-position-grid" aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Company</TableCell>
                        <TableCell align="right">Total</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {stocks.length > 0 ? stocks.map(row => (
                        <TableRow key={row.stock_name}>
                            <TableCell component="th" scope="row">
                                {row.stock_name}
                            </TableCell>
                            <TableCell align="right">{row.net_position}</TableCell>
                        </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell component="th" scope="row">
                                <em>No data to display. Please add a new trade from the below form.</em>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default NetPositionGrid;
