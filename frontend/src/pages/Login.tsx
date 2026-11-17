import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../hooks/useStore';
import toast from 'react-hot-toast';
import { Radio, Lock, Mail, ArrowRight } from 'lucide-react';

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    login({
      id: `usr_${Date.now()}`,
      name: email.split('@')[0],
      email,
    });

    toast.success('Welcome back!');
    navigate('/account');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-16 bg-neutral-50/50 text-brand-navy">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 border border-neutral-200/80 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-brand-navy flex items-center justify-center text-white mx-auto shadow-sm">
            <Radio className="w-6 h-6 text-brand-teal" />
          </div>
          <h1 className="text-2xl font-extrabold text-brand-navy">Welcome to Smart Choice</h1>
          <p className="text-xs text-neutral-500">Sign in to manage your orders & custom NFC keychains</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal text-xs"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-semibold text-neutral-700">Password</label>
              <a href="#" className="text-[11px] text-brand-teal hover:underline">Forgot password?</a>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-brand-navy hover:bg-neutral-800 text-white font-semibold rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
          >
            <span>Sign In to Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-2 border-t border-neutral-100 text-xs text-neutral-500">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-teal hover:underline">
            Register now
          </Link>
        </div>
      </div>
    </div>
  );
};
export default Login;
