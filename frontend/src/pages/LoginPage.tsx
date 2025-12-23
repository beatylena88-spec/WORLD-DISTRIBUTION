import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2, Globe } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      console.error('Login failed', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1D] noise-texture grid-pattern flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-6">
            <Building2 className="w-12 h-12 text-[#06FFA5]" />
          </div>
          <h1 className="text-display text-5xl text-[#F5F1E8] mb-3">
            WORLD DISTRIBUTION
          </h1>
          <p className="text-accent text-xl text-[#F5F1E8]/70">
            Enterprise B2B Commerce Platform
          </p>
        </div>

        <Card className="bg-[#F5F1E8] border-[#003049]/20 shadow-2xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-display text-2xl text-[#1A1A1D]">
              Client Portal Login
            </CardTitle>
            <CardDescription className="text-mono text-[#1A1A1D]/70">
              Enter your credentials to access wholesale platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-mono text-[#1A1A1D]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="buyer@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-mono text-[#1A1A1D]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="text-mono bg-white border-[#003049]/20 focus:border-[#06FFA5]"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-[#003049] hover:bg-[#003049]/90 text-[#F5F1E8] text-mono font-semibold py-6 text-base transition-all hover:scale-[0.98]"
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Access Platform'}
              </Button>

              <div className="pt-4 border-t border-[#003049]/10">
                <div className="flex items-center gap-2 text-xs text-[#1A1A1D]/60 text-mono">
                  <Globe className="w-4 h-4" />
                  <span>Geographic payment routing enabled</span>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>

        <p className="text-center mt-6 text-xs text-[#F5F1E8]/50 text-mono">
          Demo credentials: any email / any password
        </p>
      </div>
    </div>
  );
}
