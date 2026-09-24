import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ShieldAlert } from "lucide-react";
import { API_URL } from '../config';

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await axios.post('h${API_URL}/signup', { email, password });
      navigate('/');
    } catch (err) {
      setError('Sorry, could not sign up.');
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
          autoComplete="new-password"
          className="w-full p-3 mb-6 bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-500 transition"
        />

        <button
          onClick={handleSignup}
          className="w-full p-3 bg-red-600 hover:bg-red-700 text-white font-semibold tracking-wide transition"
        >
          SIGN UP
        </button>

        <p className="text-zinc-500 text-sm text-center mt-6">
          Already have an account?{' '}
          <Link to="/" className="text-red-400 hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  );
}

export default SignupPage;