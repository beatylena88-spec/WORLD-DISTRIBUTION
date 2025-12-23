import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        companyName: '',
        country: '',
        region: 'EU',
        streetAddress: '',
        city: '',
        postalCode: '',
        phone: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setLoading(true);
        try {
            await register({
                email: formData.email,
                password: formData.password,
                companyName: formData.companyName,
                country: formData.country,
                region: formData.region,
                streetAddress: formData.streetAddress,
                city: formData.city,
                postalCode: formData.postalCode,
                phone: formData.phone,
            });
            toast.success('Account created successfully!');
            navigate('/products');
        } catch (error) {
            toast.error(error instanceof Error ? error.message : 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1A1A1D] noise-texture grid-pattern flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-3 mb-4">
                        <Building2 className="w-10 h-10 text-[#06FFA5]" />
                    </div>
                    <h1 className="text-display text-4xl text-[#F5F1E8] mb-2">
                        Create Account
                    </h1>
                    <p className="text-accent text-lg text-[#F5F1E8]/70">
                        Join the B2B Commerce Platform
                    </p>
                </div>

                <Card className="bg-[#F5F1E8] border-[#003049]/20 shadow-2xl">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-display text-2xl text-[#1A1A1D]">
                            Register Your Business
                        </CardTitle>
                        <CardDescription className="text-mono text-[#1A1A1D]/70">
                            Fill in your company and delivery information
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Account Information */}
                            <div className="space-y-4 pb-4 border-b border-[#003049]/10">
                                <h3 className="text-mono font-semibold text-[#1A1A1D]">Account Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-mono text-[#1A1A1D]">
                                        Email Address *
                                    </Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="buyer@company.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="password" className="text-mono text-[#1A1A1D]">
                                            Password *
                                        </Label>
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword" className="text-mono text-[#1A1A1D]">
                                            Confirm Password *
                                        </Label>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="••••••••"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Company Information */}
                            <div className="space-y-4 pb-4 border-b border-[#003049]/10">
                                <h3 className="text-mono font-semibold text-[#1A1A1D]">Company Information</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="companyName" className="text-mono text-[#1A1A1D]">
                                        Company Name *
                                    </Label>
                                    <Input
                                        id="companyName"
                                        name="companyName"
                                        type="text"
                                        placeholder="Your Company Ltd."
                                        value={formData.companyName}
                                        onChange={handleChange}
                                        required
                                        className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="country" className="text-mono text-[#1A1A1D]">
                                            Country *
                                        </Label>
                                        <Input
                                            id="country"
                                            name="country"
                                            type="text"
                                            placeholder="France"
                                            value={formData.country}
                                            onChange={handleChange}
                                            required
                                            className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="region" className="text-mono text-[#1A1A1D]">
                                            Region *
                                        </Label>
                                        <select
                                            id="region"
                                            name="region"
                                            value={formData.region}
                                            onChange={handleChange}
                                            required
                                            className="w-full h-10 px-3 rounded-md text-mono bg-white border border-[#003049]/20 focus:border-[#06FFA5] focus:outline-none focus:ring-2 focus:ring-[#06FFA5]/20"
                                        >
                                            <option value="EU">Europe (EU)</option>
                                            <option value="NA">North America</option>
                                            <option value="ASIA">Asia</option>
                                            <option value="OTHER">Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Delivery Address */}
                            <div className="space-y-4">
                                <h3 className="text-mono font-semibold text-[#1A1A1D]">Delivery Address</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="streetAddress" className="text-mono text-[#1A1A1D]">
                                        Street Address
                                    </Label>
                                    <Input
                                        id="streetAddress"
                                        name="streetAddress"
                                        type="text"
                                        placeholder="123 Main Street"
                                        value={formData.streetAddress}
                                        onChange={handleChange}
                                        className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="city" className="text-mono text-[#1A1A1D]">
                                            City
                                        </Label>
                                        <Input
                                            id="city"
                                            name="city"
                                            type="text"
                                            placeholder="Paris"
                                            value={formData.city}
                                            onChange={handleChange}
                                            className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="postalCode" className="text-mono text-[#1A1A1D]">
                                            Postal Code
                                        </Label>
                                        <Input
                                            id="postalCode"
                                            name="postalCode"
                                            type="text"
                                            placeholder="75001"
                                            value={formData.postalCode}
                                            onChange={handleChange}
                                            className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone" className="text-mono text-[#1A1A1D]">
                                        Phone Number
                                    </Label>
                                    <Input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        placeholder="+33 1 23 45 67 89"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#06FFA5] hover:bg-[#06FFA5]/90 text-[#1A1A1D] text-mono font-semibold py-6 text-base transition-all hover:scale-[0.98]"
                                disabled={loading}
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </Button>

                            <div className="pt-4 border-t border-[#003049]/10 text-center">
                                <Link
                                    to="/login"
                                    className="inline-flex items-center gap-2 text-sm text-[#003049] hover:text-[#06FFA5] text-mono transition-colors"
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                    Already have an account? Sign in
                                </Link>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
