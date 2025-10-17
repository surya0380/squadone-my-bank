interface Beneficiary {
    accountNumber: string;
    name: string;
    mobile: string;
    email: string;
}

interface OTPData {
    otp: string;
    sessionId: string;
    method: 'sms' | 'email';
    timestamp: number;
    attempts: number;
    recipient: string;
}

interface OTPResponse {
    success: boolean;
    sessionId?: string;
    message?: string;
    demoOTP?: string;
    error?: string;
    transactionId?: string;
}

interface APIConfig {
    twilioAccountSid: string;
    twilioAuthToken: string;
    twilioPhoneNumber: string;
    emailJSServiceId: string;
    emailJSTemplateId: string;
    emailJSPublicKey: string;
}

// Constants for better maintainability
const OTP_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const MAX_OTP_ATTEMPTS = 3;

// Default beneficiaries data - moved outside for better organization
const DEFAULT_BENEFICIARIES: Beneficiary[] = [
    {
        accountNumber: "5676569090",
        name: "Surya Prakash",
        mobile: "+916361820140",
        email: "surya0380@gmail.com"
    },
    {
        accountNumber: "1234567890",
        name: "Anushka Sahoo",
        mobile: "+919876543210",
        email: "demo@mybank.com"
    }
];

// Utility functions - pure functions for better testability
const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const createSessionId = (): string => `session_${Date.now()}`;

const isOTPExpired = (timestamp: number): boolean => {
    return Date.now() - timestamp > OTP_EXPIRY_TIME;
};

const createSuccessMessage = (method: 'sms' | 'email', beneficiary: Beneficiary): string => {
    return method === 'sms'
        ? `OTP sent to ${beneficiary.mobile.slice(-4)} (${beneficiary.name})`
        : `OTP sent to ${beneficiary.email} (${beneficiary.name})`;
};

// API functions - separated for better organization and testing
const sendSMSOTP = async (
    mobile: string,
    otp: string,
    config: APIConfig
): Promise<{ success: boolean; fallbackOTP?: string }> => {
    try {
        const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`, {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${btoa(`${config.twilioAccountSid}:${config.twilioAuthToken}`)}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                To: mobile,
                From: config.twilioPhoneNumber,
                Body: `Your MyBank OTP is: ${otp}. Valid for 5 minutes.`
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            console.error('SMS API failed with status:', response.status);
            return { success: false, fallbackOTP: otp };
        }
    } catch (error) {
        console.error('SMS sending error (CORS/Network):', error);
        return { success: false, fallbackOTP: otp };
    }
};

const sendEmailOTP = async (
    email: string,
    otp: string,
    config: APIConfig
): Promise<{ success: boolean; fallbackOTP?: string }> => {
    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                service_id: config.emailJSServiceId,
                template_id: config.emailJSTemplateId,
                user_id: config.emailJSPublicKey,
                template_params: {
                    to_email: email,
                    otp_code: otp,
                    bank_name: 'MyBank'
                }
            })
        });

        if (response.ok) {
            return { success: true };
        } else {
            console.error('Email API failed with status:', response.status);
            return { success: false, fallbackOTP: otp };
        }
    } catch (error) {
        console.error('Email sending error (CORS/Network):', error);
        return { success: false, fallbackOTP: otp };
    }
};

// Optimized OTP Service using composition over inheritance
class OTPService {
    private readonly otpStorage = new Map<string, OTPData>();
    private readonly beneficiaries = new Map<string, Beneficiary>();
    private config: APIConfig;
    private cleanupInterval: number | null = null;

    constructor() {
        this.config = {
            twilioAccountSid: '',
            twilioAuthToken: '',
            twilioPhoneNumber: '',
            emailJSServiceId: '',
            emailJSTemplateId: '',
            emailJSPublicKey: ''
        };
        this.initializeBeneficiaries();
        this.startCleanupTimer();
    }

    private initializeBeneficiaries(): void {
        DEFAULT_BENEFICIARIES.forEach(beneficiary => {
            this.beneficiaries.set(beneficiary.accountNumber, beneficiary);
        });
    }

    private startCleanupTimer(): void {
        // Clean up expired OTPs every 2 minutes
        this.cleanupInterval = window.setInterval(() => {
            const cleaned = this.clearExpiredOTPs();
            if (cleaned > 0) {
                console.log(`Cleaned up ${cleaned} expired OTPs`);
            }
        }, 2 * 60 * 1000); // 2 minutes
    }

    private stopCleanupTimer(): void {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }

    getBeneficiary(accountNumber: string): Beneficiary | null {
        return this.beneficiaries.get(accountNumber) ?? null;
    }

    addBeneficiary(beneficiary: Beneficiary): void {
        this.beneficiaries.set(beneficiary.accountNumber, beneficiary);
    }

    generateOTP(): string {
        return generateOTP();
    }

    // Delegate to pure functions for better testability and maintainability
    private async sendSMSOTP(mobile: string, otp: string): Promise<{ success: boolean; fallbackOTP?: string }> {
        return await sendSMSOTP(mobile, otp, this.config);
    }

    private async sendEmailOTP(email: string, otp: string): Promise<{ success: boolean; fallbackOTP?: string }> {
        return await sendEmailOTP(email, otp, this.config);
    }

    async sendOTP(accountNumber: string, method: 'sms' | 'email' = 'sms'): Promise<OTPResponse> {
        try {
            const beneficiary = this.getBeneficiary(accountNumber);
            if (!beneficiary) {
                return {
                    success: false,
                    error: 'Beneficiary not found. Please check the account number.'
                };
            }

            const otp = generateOTP();
            const sessionId = createSessionId();
            const recipient = method === 'sms' ? beneficiary.mobile : beneficiary.email;

            // Store OTP data
            // Store OTP data
            this.otpStorage.set(accountNumber, {
                otp,
                sessionId,
                method,
                timestamp: Date.now(),
                attempts: 0,
                recipient
            });

            // Simulate network delay
            // Simulate network delay
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Send OTP via chosen method
            // Send OTP via chosen method
            const apiResponse = method === 'sms'
                ? await this.sendSMSOTP(beneficiary.mobile, otp)
                : await this.sendEmailOTP(beneficiary.email, otp);

            // Generate success message
            // Generate success message
            const message = createSuccessMessage(method, beneficiary);

            return {
                success: true,
                sessionId,
                message,
                demoOTP: apiResponse.fallbackOTP // Show OTP in alert if API failed
            };

        } catch (error) {
            console.error('OTP Send Error:', error);
            return {
                success: false,
                error: 'Failed to send OTP. Please try again.'
            };
        }
    }

    async verifyOTP(accountNumber: string, enteredOTP: string): Promise<OTPResponse> {
        try {
            const storedData = this.otpStorage.get(accountNumber);

            // Check if OTP exists
            // Check if OTP exists
            if (!storedData) {
                return {
                    success: false,
                    error: 'No OTP found. Please request a new one.'
                };
            }

            // Check if OTP has expired
            if (isOTPExpired(storedData.timestamp)) {
                this.otpStorage.delete(accountNumber);
                return {
                    success: false,
                    error: 'OTP has expired. Please request a new one.'
                };
            }

            // Check if too many attempts
            if (storedData.attempts >= MAX_OTP_ATTEMPTS) {
                this.otpStorage.delete(accountNumber);
                return {
                    success: false,
                    error: 'Too many invalid attempts. Please request a new OTP.'
                };
            }

            // Verify OTP
            if (storedData.otp === enteredOTP) {
                // Clean up and return success
                this.otpStorage.delete(accountNumber);
                await new Promise(resolve => setTimeout(resolve, 500));

                return {
                    success: true,
                    message: 'OTP verified successfully!',
                    transactionId: `TXN_${Date.now()}`
                };
            } else {
                // Increment attempts and return error
                const updatedData = { ...storedData, attempts: storedData.attempts + 1 };
                this.otpStorage.set(accountNumber, updatedData);

                const remainingAttempts = MAX_OTP_ATTEMPTS - updatedData.attempts;
                return {
                    success: false,
                    error: `Invalid OTP. ${remainingAttempts} attempts remaining.`
                };
            }

        } catch (error) {
            console.error('OTP Verification Error:', error);
            return {
                success: false,
                error: 'OTP verification failed. Please try again.'
            };
        }
    }

    async resendOTP(accountNumber: string, method: 'sms' | 'email'): Promise<OTPResponse> {
        // Clear existing OTP and generate new one
        this.otpStorage.delete(accountNumber);
        return await this.sendOTP(accountNumber, method);
    }

    getDemoOTP(accountNumber: string): string | null {
        const storedData = this.otpStorage.get(accountNumber);
        return storedData?.otp ?? null;
    }

    setConfig(config: Partial<APIConfig>): void {
        this.config = { ...this.config, ...config };
    }

    getAllBeneficiaries(): Beneficiary[] {
        return Array.from(this.beneficiaries.values());
    }

    // Additional utility methods for better service management
    clearExpiredOTPs(): number {
        let clearedCount = 0;
        for (const [accountNumber, otpData] of this.otpStorage.entries()) {
            if (isOTPExpired(otpData.timestamp)) {
                this.otpStorage.delete(accountNumber);
                clearedCount++;
            }
        }
        return clearedCount;
    }

    getActiveOTPCount(): number {
        return this.otpStorage.size;
    }

    // Method to check service health
    isConfigured(): boolean {
        return Boolean(
            this.config.twilioAccountSid &&
            this.config.twilioAuthToken &&
            this.config.emailJSServiceId
        );
    }

    // Cleanup method for proper service shutdown
    destroy(): void {
        this.stopCleanupTimer();
        this.otpStorage.clear();
    }
}

export const otpService = new OTPService();
export type { Beneficiary, OTPResponse };