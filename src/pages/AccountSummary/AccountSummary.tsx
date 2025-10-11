
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Link
} from '@mui/material';
import { useState } from 'react';


const rows = [
  { name: 'Mybank1', type: 'current', accountNo: '123456', balance: '100000' },
  { name: 'Mybank2', type: 'savings', accountNo: '678901', balance: '200000' },
  { name: 'Mybank3', type: 'Joint', accountNo: '2345678', balance: '300000' },
];



export default function BankAccountSummary() {
  const[showAcctDetails,setShowAcctDetails] = useState(false);
  //const {showAcctDetails,setShowAcctDetails} = useContext(AccountsummaryContext)

  function onViewClick(){
  setShowAcctDetails(true)
}
  return (
    <Paper
      sx={{
        width: 500,
        margin: 'auto',
        border: '1px solid #6f6f6f',
        textAlign: 'center',
        paddingBottom: 1,
      }}
      elevation={0}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 'bold', marginTop: 1 }}
      >
        My Bank Account Summary
      </Typography>

      <TableContainer>
        <Table sx={{ minWidth: 450, marginTop: 1 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#0073b1' }}>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Account Holder Name</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Account Type</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Account No.</TableCell>
              <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Balance</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.type}</TableCell>
                <TableCell>{row.accountNo}</TableCell>
                <TableCell>{row.balance}</TableCell>
                <TableCell align="right">
                  <Link href="#" underline="none" onClick={onViewClick}>View</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
