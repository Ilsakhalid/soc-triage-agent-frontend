import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { Search, Link as LinkIcon, Globe, Fingerprint, Mail, LogOut, ShieldAlert } from 'lucide-react';
import { useRef, useEffect } from 'react';
import {Link } from 'react-router-dom';


const TABS = [
  { id: 'ip', label: 'IP' },
  { id: 'url', label: 'URL' },
  { id: 'domain', label: 'DOMAIN' },
  { id: 'hash', label: 'HASH' },
  { id: 'email', label: 'EMAIL' },
];

const tabIcon = {
  ip: <Globe size={40} className="text-red-400" />,
  url: <LinkIcon size={40} className="text-red-400" />,
  domain: <Globe size={40} className="text-red-400" />,
  hash: <Fingerprint size={40} className="text-red-400" />,
  email: <Mail size={40} className="text-red-400" />,
};

const placeholder = {
  ip: 'Enter an IP address (e.g. 8.8.8.8)',
  url: 'Enter a URL (e.g. http://example.com)',
  domain: 'Enter a domain (e.g. example.com)',
  hash: 'Enter a file hash (SHA256)',
  email: 'Paste the raw email content here.',
};


function detectType(input) {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return 'url';
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(trimmed)) return 'ip';
  if (/^[a-f0-9]{32}$|^[a-f0-9]{40}$|^[a-f0-9]{64}$/i.test(trimmed)) return 'hash';
  if (/From:/i.test(trimmed) || trimmed.includes('\n')) return 'email';
  return 'domain';
}

async function computeFileHash(file){
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b)=> b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

function DashboardPage() {

  const [activeTab, setActiveTab] = useState('ip');
  const [value, setValue] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [notFoundMsg, setNotFoundMsg] = useState('');
  const resultRef = useRef(null);
  const messageRef = useRef(null);

useEffect(() => {
  if (result && resultRef.current) {
    resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if ((error || notFoundMsg) && messageRef.current) {
    messageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}, [result, error, notFoundMsg]);

  const [navValue, setNavValue] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const switchTab = (id) => {
    setActiveTab(id);
    setValue('');
    setResult(null);
    setError('');
    setNotFoundMsg('');
  };

  const runCheck = async (type, input) => {
  setLoading(true);
  setError('');
  setNotFoundMsg('');
  setResult(null);

  try {
    let response;
    if (type === 'email') {
      response = await api.post('/check-email', { email: input });
    } else {
      let url = '';
      if (type === 'ip') url = `/check-ip/${input}`;
      if (type === 'domain') url = `/check-domain/${input}`;
      if (type === 'hash') url = `/check-hash/${input}`;
      if (type === 'url') url = `/check-url?url=${encodeURIComponent(input)}`;

      response = await api.get(url);
    }
    setResult(response.data);
  } catch (err) {
      if (err.response?.status === 404 && err.response?.data?.notFound) {
        setNotFoundMsg(err.response.data.error || 'No record found for this indicator.');
      }
        else if (err.response?.status === 503) {
  setNotFoundMsg(err.response?.data?.error || 'AI analysis is temporarily unavailable due to high demand.');
    }
        else if (err.response?.status === 429) {
  setNotFoundMsg(err.response?.data?.error || 'Rate limit reached. Please wait a moment and try again.');
} 
        else {
        setError('Check failed. Please verify the input and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = () => runCheck(activeTab, value);

  const handleNavSearch = (e) => {
    if (e.key === 'Enter' && navValue.trim()) {
      const detectedType = detectType(navValue);
      runCheck(detectedType, navValue);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <nav className="flex items-center justify-between px-8 py-4 border-b border-red-500/20">
        <div className="flex items-center gap-2">
          <ShieldAlert className="text-red-500" size={28} />
          <span className="font-bold text-lg tracking-wide">SOC TRIAGE AGENT</span>
        </div>

        <div className="flex-1 max-w-md mx-8 hidden md:block">
          <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
            <Search size={16} className="text-zinc-500 mr-2" />
            <input
              type="text"
              placeholder="Type IP, URL, domain, hash... & press Enter"
              value={navValue}
              onChange={(e) => setNavValue(e.target.value)}
              onKeyDown={handleNavSearch}
              className="bg-transparent outline-none text-sm w-full text-zinc-300 placeholder-zinc-600"
            />
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/history" className="text-sm text-zinc-300 hover:text-red-400 transition">History</Link>
          <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-sm text-zinc-300 hover:text-red-400 transition">
          <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <div className="flex flex-col items-center pt-16 pb-10 px-4">
        <ShieldAlert className="text-red-500 mb-4" size={64} />
        <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-center">
          SOC TRIAGE <span className="text-red-500">AGENT</span>
        </h1>
        <p className="text-zinc-400 text-center max-w-xl">
          Investigate suspicious IPs, URLs, domains, file hashes and emails using live threat
          intelligence, reasoned by AI, for faster analyst triage.
        </p>
      </div>

      <div className="max-w-2xl mx-auto px-4">
        <div className="flex border-b border-zinc-800 justify-center gap-8">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => switchTab(tab.id)}
              className={`pb-3 text-sm font-semibold tracking-wide transition ${
                activeTab === tab.id
                  ? 'text-red-400 border-b-2 border-red-500'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center mt-10 mb-6">
          {tabIcon[activeTab]}

          <div className="w-full mt-6">
            {activeTab === 'email' ? (
              <textarea
                rows={6}
                placeholder={placeholder[activeTab]}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-500 transition resize-none"
              />
            ) : (
              <input
                type="text"
                placeholder={placeholder[activeTab]}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-4 rounded-lg bg-zinc-900 border border-zinc-800 text-white outline-none focus:border-red-500 transition"
              />
            )
            }
            {activeTab === 'hash' && (
  <div className="mt-3">
    <label className="text-zinc-400 text-sm cursor-pointer hover:text-red-400 transition">
      Or upload a file to compute its hash automatically
      <input
        type="file"
        onChange={async (e) => {
          const file = e.target.files[0];
          if (file) {
            const hash = await computeFileHash(file);
            setValue(hash);
          }
        }}
        className="hidden"
      />
    </label>
  </div>
)}

            <button
              onClick={handleCheck}
              disabled={loading || !value}
              className="w-full mt-4 p-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-semibold transition"
            >
              {loading ? 'Checking...' : 'Check'}
            </button>
          </div>
        </div>

        <p className="text-zinc-600 text-xs text-center mb-10">
          Checks are logged to your SOC audit trail. Verdicts are AI-generated — always confirm before acting.
        </p>

          {(error || notFoundMsg) && (
          <div ref={messageRef}>
            {error && <p className="text-red-400 mb-6 text-center">{error}</p>}
            {notFoundMsg && (
              <p className="text-zinc-400 mb-6 text-center">
                {notFoundMsg} — this usually just means it hasn't been scanned by VirusTotal yet.
              </p>
            )}
          </div>
        )}

        {result && (
  <div ref={resultRef} className="bg-zinc-900 border border-red-500/20 p-6 rounded-xl shadow-lg mb-10">
            {result.senderDomain !== undefined ? (
              <>
                <h2 className="text-lg font-bold mb-4">
                  Sender Domain: <span className="text-red-400">{result.senderDomain || 'Not found'}</span>
                </h2>
                {result.domainResult && (
                  <div className="mb-4">
                    <p className="text-sm text-zinc-400 mb-1">Domain Verdict:</p>
                    <p className="font-semibold text-red-400">{result.domainResult.verdict.risk_level.toUpperCase()}</p>
                    <p className="text-zinc-300 text-sm">{result.domainResult.verdict.explanation}</p>
                  </div>
                )}
                {result.urlResults?.map((r, i) => (
                  <div key={i} className="mb-4 border-t border-zinc-800 pt-4">
                    <p className="text-sm text-zinc-400 mb-1">Link: {r.summary.url}</p>
                    <p className="font-semibold text-red-400">{r.verdict.risk_level.toUpperCase()}</p>
                    <p className="text-zinc-300 text-sm">{r.verdict.explanation}</p>
                  </div>
                ))}
              </>
            ) : (
              <>
                <h2 className="text-xl font-bold mb-4">
                  Risk Level: <span className="text-red-400">{result.verdict.risk_level.toUpperCase()}</span>
                </h2>
                <p className="text-zinc-300 mb-4">{result.verdict.explanation}</p>
                <p className="font-semibold">
                  Recommended Action: <span className="text-red-400">{result.verdict.recommended_action}</span>
                </p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;