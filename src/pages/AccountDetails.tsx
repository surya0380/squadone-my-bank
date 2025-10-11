// src/pages/AccountDetails.tsx
import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Beneficiary from './Benificiary';

type Transaction = {
  date: string;
  type: string;
  amount: number | string;
  remarks?: string;
};

export default function AccountDetails(): JSX.Element {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [openAccountDetails, setOpenAccountDetails] = useState(true);
  const [openBeneficiaries, setOpenBeneficiaries] = useState(false);

  // Prepopulated account data (read-only display)
  const [account] = useState({
    id: 1,
    name: 'Poornima G S',
    type: 'Savings',
    email: 'poornimagswork@gmail.com',
    accountNo: '123456789012',
    creationDate: '2020-01-15',
    phone: '+91 8095356111',
  });

  // Sample transactions
  const [transactions] = useState<Transaction[]>([
    { id: 1, date: '2025-10-10', type: 'Debit', amount: 100, remarks: 'ATM' },
    { id: 2, date: '2025-10-08', type: 'Credit', amount: 2500, remarks: 'Salary' },
    { id: 3, date: '2025-10-02', type: 'Debit', amount: 45.75, remarks: 'Coffee' },
    { id: 4, date: '2025-09-28', type: 'Debit', amount: 120.5, remarks: 'Groceries' },
    { id: 5, date: '2025-09-25', type: 'Credit', amount: 300, remarks: 'Gift' },
    { id: 6, date: '2025-09-20', type: 'Debit', amount: 60, remarks: 'Gas' }
  ]);

  const handleTabChange = (_e: React.SyntheticEvent, value: number) => setActiveTab(value);

  const handleBeneficiary = () => {
    setOpenAccountDetails(false);
    setOpenBeneficiaries(true);
  }
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Paper variant="outlined" sx={{ p: 3, borderColor: '#6b4f5f' }}>
        {/* Header */}
        {openAccountDetails && <div>
          <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, mb: 3 }}
        >
          Account Details
        </Typography>

        {/* Top small nav / tabs */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} textColor="primary" indicatorColor="primary">
            <Tab label="Account Details" />
            <Tab label="View Beneficiaries" onClick={() => handleBeneficiary()}/>
            <Tab label="Fund Transfer" />
          </Tabs>
        </Box>

        {/* Account fields: two stacked rows with consistent alignment and a red outline */}
        <Box sx={{ my: 2 }}>
            <Grid container spacing={2} alignItems="center">
              {/* Row 1 */}
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 160, fontSize: 18 }}>Name:</Typography>
                <Box sx={{ ml: 1, width: 260, border: '1px solid #6b4f5f', borderRadius: 1, px: 2, py: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={account.name}>{account.name}</Box>
              </Grid>

              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 160, fontSize: 18 }}>Type:</Typography>
                <Box sx={{ ml: 1, width: 260, border: '1px solid #6b4f5f', borderRadius: 1, px: 2, py: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={account.type}>{account.type}</Box>
              </Grid>

              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 160, fontSize: 18 }}>Email ID:</Typography>
                <Box sx={{ ml: 1, width: 260, border: '1px solid #6b4f5f', borderRadius: 1, px: 2, py: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={account.email}>{account.email}</Box>
              </Grid>

              {/* Row 2 */}
              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 160, fontSize: 18 }}>Account No.:</Typography>
                <Box sx={{ ml: 1, width: 260, border: '1px solid #6b4f5f', borderRadius: 1, px: 2, py: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={account.accountNo}>{account.accountNo}</Box>
              </Grid>

              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 160, fontSize: 18 }}>Creation Date:</Typography>
                <Box sx={{ ml: 1, width: 260, border: '1px solid #6b4f5f', borderRadius: 1, px: 2, py: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={account.creationDate}>{account.creationDate}</Box>
              </Grid>

              <Grid item xs={12} md={4} sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography sx={{ width: 160, fontSize: 18 }}>Phone:</Typography>
                <Box sx={{ ml: 1, width: 260, border: '1px solid #6b4f5f', borderRadius: 1, px: 2, py: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={account.phone}>{account.phone}</Box>
              </Grid>
            </Grid>
        </Box>

        {/* Transactions table (matches the bottom area of the attachment) */}
        <Box sx={{ mt: 3 }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#0076b6' }}>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Transaction Date</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Transaction Type</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Amount</TableCell>
                  <TableCell sx={{ color: '#fff', fontWeight: 700 }}>Remarks</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {transactions.map((tx) => (
                  <TableRow key={tx.id} hover>
                    <TableCell>{tx.date}</TableCell>
                    <TableCell>{tx.type}</TableCell>
                    <TableCell>{tx.amount}</TableCell>
                    <TableCell>{tx.remarks}</TableCell>
                  </TableRow>
                ))}

                {/* empty rows to match the visual spacing (optional) */}
                {[...Array(3)].map((_, i) => (
                  <TableRow key={`empty-${i}`}>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                    <TableCell>&nbsp;</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        </div>}

        {openBeneficiaries && <Beneficiary/>}
      </Paper>
    </Container>
  );
}
