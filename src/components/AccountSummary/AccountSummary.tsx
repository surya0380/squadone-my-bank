
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Link
} from '@mui/material';

const rows = [
  { name: '', type: '', accountNo: '', balance: '' },
  { name: '', type: '', accountNo: '', balance: '' },
  { name: '', type: '', accountNo: '', balance: '' },
];

export default function BankAccountSummary() {
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
                  <Link href="#" underline="none">View</Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
