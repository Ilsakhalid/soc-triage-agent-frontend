import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, LogOut, ArrowLeft } from 'lucide-react';
import { API_URL } from '../config';

function HistoryPage() {
  const [checks, setChecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('${API_URL}/history', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setChecks(response.data);
      } catch (err) {
        console.log('Failed to load history');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const riskColor = {
    low: 'text-green-400',
    medium: 'text-yellow-400',
    high: 'text-orange-400',
    critical: 'text-red-500',
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-red-500/20">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-500" size={28} />
          <span className="font-bold text-lg tracking-wide">SOC TRIAGE AGENT</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-zinc-300 hover:text-red-400 transition"
        >
          <LogOut size={16} /> Logout
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <Link to="/dashboard" className="flex items-center gap-2 text-zinc-400 hover:text-red-400 text-sm mb-6 w-fit">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>

        <h1 className="text-2xl font-bold mb-6">Check History</h1>

        {loading ? (
          <p className="text-zinc-500">Loading...</p>
        ) : checks.length === 0 ? (
          <p className="text-zinc-500">No checks yet.</p>
        ) : (
          <div className="border border-zinc-800">
            {checks.map((check) => (
              <div
                key={check.id}
                className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 last:border-b-0"
              >
                <div>
                  <span className="text-zinc-500 text-xs uppercase mr-3">{check.indicator_type}</span>
                  <span className="text-white text-sm">{check.indicator_value}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-sm font-semibold ${riskColor[check.verdict.risk_level] || 'text-zinc-400'}`}>
                    {check.verdict.risk_level.toUpperCase()}
                  </span>
                  <span className="text-zinc-600 text-xs">
                    {new Date(check.created_at).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default HistoryPage;