import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import authService from '@/services/authService';
import { z } from 'zod';

const emailSchema = z.object({
    email: z.string().email('Please enter a valid email address'),
});

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Validate email
            const result = emailSchema.safeParse({ email });
            if (!result.success) {
                setError(result.error.errors[0].message);
                setLoading(false);
                return;
            }

            // Send OTP request
            const response = await authService.forgotPassword(email);

            toast({
                title: 'OTP Sent Successfully',
                description: response.message || 'Please check your email for the OTP code.',
            });

            // Navigate to OTP verification page with email
            navigate('/verify-otp', { state: { email } });
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Failed to send OTP. Please try again.';
            setError(errorMessage);
            toast({
                title: 'Error',
                description: errorMessage,
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-secondary/30 px-4">
            <div className="w-full max-w-md">
                <div className="bg-card rounded-2xl shadow-soft p-8">
                    <div className="text-center mb-8">
                        <h1 className="font-heading text-3xl font-bold mb-2">
                            Forgot Password?
                        </h1>
                        <p className="text-muted-foreground">
                            Enter your email address and we'll send you an OTP to reset your password
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setError('');
                                    }}
                                    className="pl-10"
                                    required
                                />
                            </div>
                            {error && (
                                <p className="text-sm text-destructive">{error}</p>
                            )}
                        </div>

                        <Button type="submit" className="w-full" size="lg" disabled={loading}>
                            {loading ? 'Sending OTP...' : 'Send OTP'}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Link
                            to="/auth"
                            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                        >
                            <ArrowLeft size={16} />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
