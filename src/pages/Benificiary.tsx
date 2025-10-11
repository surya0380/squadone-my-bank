// File: SimpleTable.tsx
import React, { useState } from 'react';
import axios from 'axios';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Container
} from '@mui/material';

// Sample data type
interface User {
    id: number;
    name: string;
    accountNumber: number;
    remarks: string;
}

const SimpleTable: React.FC = () => {

    const [users, setUsers] = useState<User[]>([
        { id: 1, name: 'Alice', accountNumber: 12345, remarks: 'friend' },
        { id: 2, name: 'Bob', accountNumber: 67890, remarks: 'school' },
        { id: 3, name: 'Charlie', accountNumber: 23423, remarks: 'testing' },
    ]);

    let [beneficiaryData, setBeneficiaryData] = useState({
        name: '',
        accountNumber: '',
        remarks: ''
    });

    const handleOnChange = (e) => {
        console.log(e)
        setBeneficiaryData({
            ...beneficiaryData,
            [e.target.name]: e.target.value
        })
        console.log(beneficiaryData)
    }

    const addBeneficiarySubmit = async (event: any) => {
        console.log(beneficiaryData);
        event.preventDefault();
        const newUser: User = {
            id: users.length + 1,
            name: beneficiaryData.name,
            accountNumber: parseInt(beneficiaryData.accountNumber),
            remarks: beneficiaryData.remarks,
        };

        setUsers([...users, newUser]); // update state => triggers table re-render

        setBeneficiaryData({ name: '', accountNumber: '', remarks: '' });
        await axios.post('https://localhost:3000/my-bank/add-beneficiary', {
            id: users.length + 1,
            name: beneficiaryData.name,
            accountNumber: parseInt(beneficiaryData.accountNumber),
            remarks: beneficiaryData.remarks,
        }).then(response => console.log(response))
        .catch(error => console.error('There was an error!', error));
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <div>
                <Typography
                    variant="h4"
                    align="center"
                    gutterBottom
                    sx={{ fontWeight: 700, mb: 3 }}
                >
                    Beneficiaries
                </Typography>
                <form
                    onSubmit={addBeneficiarySubmit}
                    style={{
                        display: 'flex',
                        alignItems: 'flex-end', // aligns all items along the bottom
                        gap: '15px',
                    }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Name:</label>
                        <input type="text" name="name" required onChange={handleOnChange} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Account Number:</label>
                        <input type="text" name="accountNumber" required onChange={handleOnChange} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <label>Remarks:</label>
                        <input type="text" name="remarks" onChange={handleOnChange} />
                    </div>

                    <button
                        type="submit"
                        style={{
                            height: '38px',      // match typical input height
                            alignSelf: 'flex-end' // align with bottom of inputs
                        }}
                    >
                        Submit
                    </button>
                </form>

                <TableContainer component={Paper} style={{ maxWidth: 600, margin: '20px auto' }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Account No.</TableCell>
                                <TableCell>Remarks</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.accountNumber}</TableCell>
                                    <TableCell>{user.remarks}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
    );
};

export default SimpleTable;
