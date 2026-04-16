'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background accent blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[300px] h-[300px] rounded-full bg-primary/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-[400px] px-4">
        {/* Logo */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-md">
            <Brain className="text-white" size={20} />
          </div>
          <div>
            <div className="font-bold text-sm tracking-widest uppercase text-foreground">Doc Intelligence</div>
            <div className="text-[10px] tracking-widest uppercase text-muted-foreground">AI Platform</div>
          </div>
        </div>

        <Card className="shadow-lg border-border">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl font-bold text-foreground">Create account</CardTitle>
            <CardDescription className="text-muted-foreground text-sm">
              Get started with Doc Intelligence for free
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <p className="text-xs text-destructive bg-destructive/5 border border-destructive/20 rounded-md px-3 py-2">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full mt-2 font-semibold tracking-wider uppercase text-xs"
                isLoading={loading}
              >
                Create Account
              </Button>
            </form>

            <p className="text-center text-xs text-muted-foreground mt-5">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                Login here
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
