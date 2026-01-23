import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, ArrowLeft, RotateCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import authService from '@/services/authService';

export default function VerifyOTP() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [resending, setResending] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    // Redirect if no email in state
    useEffect(() => {
        if (!email) {
            toast({
                title: 'Error',
                description: 'Please start from the forgot password page.',
                variant: 'destructive',
            });
            navigate('/forgot-password');
        }
    }, [email, navigate]);

    // Countdown timer
    useEffect(() => {
        if (timeLeft <= 0) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate OTP
            if (otp.length !== 6 || !/^\d+$/.test(otp)) {
                setError('Please enter a valid 6-digit OTP');
                setLoading(false);
                return;
            }

            // Verify OTP
            await authService.verifyOTP(email, otp);

            toast({
                title: 'OTP Verified',
                description: 'You can now reset your password.',
            });

            // Navigate to reset password page
            navigate('/reset-password', { state: { email, otp } });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Invalid or expired OTP. Please try again.';
            setError(errorMessage);
            toast({
                title: 'Verification Failed',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOTP = async () => {
        setResending(true);
        setError('');

        try {
            await authService.forgotPassword(email);

            toast({
                title: 'OTP Resent',
                description: 'A new OTP has been sent to your email.',
            });

            // Reset timer
            setTimeLeft(600);
            setOtp('');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to resend OTP. Please try again.';
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setResending(false);
        }
    };

    if (!email) return null;

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl shadow-soft p-8">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                            <Shield className="text-primary" size={32} />
                        </div>
                        <h1 className="font-heading text-3xl font-bold mb-2">
                            Verify OTP
                        </h1>
                        <p className="text-muted-foreground">
                            Enter the 6-digit code sent to
                        </p>
                        <p className="text-foreground font-medium mt-1">{email}</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="otp">OTP Code</Label>
                            <Input
                                id="otp"
                                name="otp"
                                type="text"
                                placeholder="000000"
                                value={otp}
                                onChange={(e) => {
                                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                                    setOtp(value);
                                    setError('');
                                }}
                                className="text-center text-2xl tracking-widest font-mono"
                                maxLength={6}
                                required
                            />
                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                        </div>

                        <div className="text-center text-sm">
                            {timeLeft > 0 ? (
                                <p className="text-muted-foreground">
                                    OTP expires in <span className="font-semibold text-foreground">{formatTime(timeLeft)}</span>
                                </p>
                            ) : (
                                <p className="text-destructive font-medium">OTP has expired</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading || timeLeft <= 0}>
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-3">
                        <p className="text-sm text-muted-foreground">
                            Didn't receive the code?
                        </p>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleResendOTP}
                            disabled={resending}
                            className="w-full"
                        >
                            <RotateCw className={`mr-2 ${resending ? 'animate-spin' : ''}`} size={16} />
                            {resending ? 'Resending...' : 'Resend OTP'}
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            to="/forgot-password"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft size={16} />
                            Back to Forgot Password
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
