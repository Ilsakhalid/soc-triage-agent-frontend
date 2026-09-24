const envUrl = import.meta.env.VITE_API_URL;

// Ensures API_URL only uses VITE_API_URL if it is a valid http(s) link
export const API_URL = (envUrl && envUrl.startsWith('http')) 
  ? envUrl 
  : 'https://soc-triage-agent-backend.vercel.app';