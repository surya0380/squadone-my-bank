import React, { useState, useEffect } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import './FundTransfer.css';
import { otpService } from '../services/otpService';


interface TransferFormData {
    accountNumber: string;
    beneficiaryName: string;
    amount: string;
    remarks: string;
    otpMethod: 'sms' | 'email';
}

interface OTPFormData {
    otp: string;
}

const VALIDATION_RULES = {
    accountNumber: {
        required: 'Account number is required',
        minLength: {
            value: 10,
            message: 'Account number must be at least 10 digits'
        },
        maxLength: {
            value: 16,
            message: 'Account number cannot exceed 16 digits'
        },
        pattern: {
            value: /^[0-9]+$/,
            message: 'Account number can only contain numbers'
        }
    },
    amount: {
        required: 'Amount is required',
        min: {
            value: 1,
            message: 'Amount must be greater than ₹0'
        },
        max: {
            value: 1000000,
            message: 'Amount cannot exceed ₹10,00,000'
        },
        pattern: {
            value: /^\d+(\.\d{1,2})?$/,
            message: 'Enter valid amount (e.g., 1000 or 1000.50)'
        }
    },
    otp: {
        required: 'OTP is required',
        minLength: {
            value: 6,
            message: 'OTP must be 6 digits'
        },
        maxLength: {
            value: 6,
            message: 'OTP must be 6 digits'
        },
        pattern: {
            value: /^[0-9]{6}$/,
            message: 'OTP can only contain 6 numbers'
        }
    }
};

const FundTransfer: React.FC = () => {
    const {
        register: registerTransfer,
        handleSubmit: handleTransferSubmit,
        formState: { errors: transferErrors, isValid: isTransferValid },
        reset: resetTransferForm,
        getValues: getTransferValues,
        setValue: setTransferValue,
        watch: watchTransfer
    } = useForm<TransferFormData>({
        mode: 'onChange',
        defaultValues: {
            accountNumber: '',
            beneficiaryName: '',
            amount: '',
            remarks: '',
            otpMethod: 'sms'
        }
    });

    const {
        register: registerOTP,
        handleSubmit: handleOTPSubmit,
        formState: { errors: otpErrors, isValid: isOTPValid },
        reset: resetOTPForm
    } = useForm<OTPFormData>({
        mode: 'onChange',
        defaultValues: {
            otp: ''
        }
    });

    const [activeStep, setActiveStep] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [demoOTP, setDemoOTP] = useState('');

    const steps = ['Transfer Details', 'OTP Verification', 'Confirmation'];

    const watchedAccountNumber = watchTransfer('accountNumber');

    useEffect(() => {
        if (watchedAccountNumber && watchedAccountNumber.length >= 10) {
            const beneficiary = otpService.getBeneficiary(watchedAccountNumber);
            if (beneficiary) {
                setTransferValue('beneficiaryName', beneficiary.name);
            } else {
                setTransferValue('beneficiaryName', '');
            }
        }
    }, [watchedAccountNumber, setTransferValue]);

    const onTransferSubmit: SubmitHandler<TransferFormData> = async (data) => {
        setLoading(true);
        try {
            const response = await otpService.sendOTP(data.accountNumber, data.otpMethod);

            if (response.success) {
                setDemoOTP(response.demoOTP || '');
                setActiveStep(1);
                setError('');

                if (response.demoOTP) {
                    alert(`API Failed (CORS/Network Error)\n\nFor Demo Purpose, Your OTP is: ${response.demoOTP}\n\nNote: Check Network tab to see the API call was attempted.`);
                }
            } else {
                setError(response.error || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const onOTPSubmit: SubmitHandler<OTPFormData> = async (data) => {
        setLoading(true);
        try {
            const transferData = getTransferValues();
            const response = await otpService.verifyOTP(transferData.accountNumber, data.otp);

            if (response.success) {
                setActiveStep(2);
                setError('');
                console.log('Transaction ID:', response.transactionId);
            } else {
                setError(response.error || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('OTP verification failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setLoading(true);
        try {
            const transferData = getTransferValues();
            const response = await otpService.resendOTP(transferData.accountNumber, transferData.otpMethod);

            if (response.success) {
                setDemoOTP(response.demoOTP || '');
                setError('');

                if (response.demoOTP) {
                    alert(`API Failed (CORS/Network Error)\n\nFor Demo Purpose, Your New OTP is: ${response.demoOTP}\n\nNote: Check Network tab to see the API call was attempted.`);
                }
            } else {
                setError(response.error || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('Failed to resend OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleTransferComplete = () => {
        resetTransferForm();
        resetOTPForm();
        setActiveStep(0);
        setError('');
        setDemoOTP('');
    };

    const renderTransferForm = () => (
        <form onSubmit={handleTransferSubmit(onTransferSubmit)} className="transfer-form">
            <div className="input-group">
                <label htmlFor="accountNumber">Transfer Fund To *</label>
                <input
                    id="accountNumber"
                    type="text"
                    {...registerTransfer('accountNumber', VALIDATION_RULES.accountNumber)}
                    placeholder="Enter account number"
                    className={transferErrors.accountNumber ? 'error' : ''}
                />
                {transferErrors.accountNumber && (
                    <span className="field-error">{transferErrors.accountNumber.message}</span>
                )}
            </div>

            <div className="input-group">
                <label htmlFor="beneficiaryName">Beneficiary Name</label>
                <input
                    id="beneficiaryName"
                    type="text"
                    {...registerTransfer('beneficiaryName')}
                    placeholder="Auto-filled from beneficiary list"
                />
            </div>

            <div className="input-group">
                <label htmlFor="amount">Amount *</label>
                <input
                    id="amount"
                    type="number"
                    step="0.01"
                    {...registerTransfer('amount', VALIDATION_RULES.amount)}
                    placeholder="Enter amount"
                    className={transferErrors.amount ? 'error' : ''}
                />
                {transferErrors.amount && (
                    <span className="field-error">{transferErrors.amount.message}</span>
                )}
            </div>

            <div className="input-group">
                <label htmlFor="remarks">Remarks (Optional)</label>
                <textarea
                    id="remarks"
                    {...registerTransfer('remarks')}
                    placeholder="Enter remarks"
                    rows={3}
                />
            </div>

            <div className="otp-section">
                <h3>Send OTP through</h3>
                <div className="radio-group">
                    <label>
                        <input
                            type="radio"
                            value="sms"
                            {...registerTransfer('otpMethod')}
                        />
                        SMS
                    </label>
                    <label>
                        <input
                            type="radio"
                            value="email"
                            {...registerTransfer('otpMethod')}
                        />
                        Email
                    </label>
                </div>
            </div>

            <button
                type="submit"
                className="btn-primary"
                disabled={loading || !isTransferValid}
            >
                {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
        </form>
    );

    const renderOTPForm = () => {
        const transferData = getTransferValues();

        return (
            <form onSubmit={handleOTPSubmit(onOTPSubmit)} className="otp-form">
                <div className="otp-icon">🔐</div>
                <h3>OTP sent to your {transferData.otpMethod === 'sms' ? 'phone' : 'email'}</h3>
                <p>Enter the 6-digit code to complete your transfer</p>

                {demoOTP && (
                    <div className="demo-otp-display">
                        <p><strong>Your OTP is: {demoOTP}</strong></p>
                    </div>
                )}

                <div className="input-group">
                    <label htmlFor="otp">Enter OTP</label>
                    <input
                        id="otp"
                        type="text"
                        {...registerOTP('otp', VALIDATION_RULES.otp)}
                        maxLength={6}
                        className={`otp-input ${otpErrors.otp ? 'error' : ''}`}
                        placeholder="000000"
                    />
                    {otpErrors.otp && (
                        <span className="field-error">{otpErrors.otp.message}</span>
                    )}
                </div>

                <div className="resend-section">
                    <p>Didn't receive OTP? </p>
                    <button
                        type="button"
                        className="resend-btn"
                        onClick={handleResendOTP}
                        disabled={loading}
                    >
                        Resend OTP
                    </button>
                </div>

                <div className="button-group">
                    <button
                        type="button"
                        className="btn-secondary"
                        onClick={() => setActiveStep(0)}
                    >
                        Back
                    </button>
                    <button
                        type="submit"
                        className="btn-primary"
                        disabled={loading || !isOTPValid}
                    >
                        {loading ? 'Verifying...' : 'Verify & Transfer'}
                    </button>
                </div>
            </form>
        );
    };

    const renderSuccess = () => {
        const transferData = getTransferValues();

        return (
            <div className="success-form">
                <div className="success-icon">✅</div>
                <h3>Transfer Successful!</h3>

                <div className="transaction-details">
                    <h4>Transaction Details</h4>
                    <p><strong>To:</strong> {transferData.accountNumber}</p>
                    <p><strong>Amount:</strong> ₹{transferData.amount}</p>
                    <p><strong>Remarks:</strong> {transferData.remarks || 'N/A'}</p>
                    <p><strong>Transaction ID:</strong> TXN{Date.now()}</p>
                </div>

                <button
                    className="btn-primary"
                    onClick={handleTransferComplete}
                >
                    Make Another Transfer
                </button>
            </div>
        );
    };

    return (
        <div className="fund-transfer-container">
            <div className="fund-transfer-header">
                <h2>MyBank NetBanking - Fund Transfer</h2>
            </div>
            <div className="fund-transfer-content">
                <div className="transfer-card">
                    <h1>Fund Transfer</h1>

                    <div className="stepper">
                        {steps.map((label, index) => (
                            <div key={label} className={`step ${index <= activeStep ? 'active' : ''}`}>
                                <div className="step-number">{index + 1}</div>
                                <span>{label}</span>
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {activeStep === 0 && renderTransferForm()}
                    {activeStep === 1 && renderOTPForm()}
                    {activeStep === 2 && renderSuccess()}
                </div>
            </div>
        </div>
    );
};

export default FundTransfer;
