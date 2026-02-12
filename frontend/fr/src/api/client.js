// Simple API client tailored to backend Flask routes
// Base: http://localhost:5000/api unless overridden by VITE_API_BASE
const API_BASE = import.meta.env?.VITE_API_BASE || 'http://localhost:5000/api';


async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const resp = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await resp.json();
  } catch {
    data = null;
  }

  if (!resp.ok) {
    const error = data?.error || data?.message || `HTTP ${resp.status}`;
    return { ok: false, status: resp.status, error, data };
  }
  return { ok: true, status: resp.status, data };
}

export async function signup(team_name, password) {
  return request('/auth/signup', {
    method: 'POST',
    body: { team_name, password },
  });
}

export async function login(team_name, password) {
  return request('/auth/login', {
    method: 'POST',
    body: { team_name, password },
  });
}

export async function getTeamActivity(token) {
  return request('/leaderboard/activity', { method: 'GET', token });
}

export async function submitFlag(flag, token) {
  return request('/game/submit-flag', {
    method: 'POST',
    body: { flag },
    token,
  });
}

export async function submitAnswer(avenger, answer, token) {
  return request('/game/submit-answer', {
    method: 'POST',
    body: { avenger, answer },
    token,
  });
}

export const api = { signup, login, getTeamActivity, submitFlag, submitAnswer };
