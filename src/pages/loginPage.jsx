import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { API_URL } from '../config';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post('${API_URL}/login', { email, password });
      const token = response.data.token;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <ShieldAlert className="text-red-500 mb-4" size={48} />
      <h1 className="text-2xl font-bold text-white mb-8 tracking-wide">SOC TRIAGE AGENT</h1>

      <div className="w-full max-w-sm">
        {error && <p className="text-red-400 text-sm mb-4 text-center">{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="w-full p-3 mb-4 bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-500 transition"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          className="w-full p-3 mb-6 bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-500 transition"
        />

        <button
          onClick={handleLogin}
          className="w-full p-3 bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide transition"
        >
          LOGIN
        </button>

        <p className="text-zinc-500 text-sm text-center mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-red-400 hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;