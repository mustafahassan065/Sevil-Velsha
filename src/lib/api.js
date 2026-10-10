const BASE = import.meta.env.VITE_API_BASE || '/api';

export class ApiError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function request(path, { method = 'GET', body, form } = {}) {
  const options = { method, credentials: 'include', headers: {} };
  if (form) {
    options.body = form; // FormData (browser khud Content-Type lagata hai)
  } else if (body !== undefined) {
    options.headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(body);
  }

  let res;
  try {
    res = await fetch(BASE + path, options);
  } catch {
    throw new ApiError('Cannot reach the server. Please try again.', 0);
  }

  let data = null;
  try {
    data = await res.json();
  } catch {
    /* body nahi hai */
  }
  if (!res.ok) throw new ApiError(data?.error || 'Something went wrong.', res.status, data?.code);
  return data;
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: body ?? {} }),
  patch: (path, body) => request(path, { method: 'PATCH', body }),
  put: (path, body) => request(path, { method: 'PUT', body }),
  del: (path) => request(path, { method: 'DELETE' }),
  postForm: (path, form) => request(path, { method: 'POST', form }),
  putForm: (path, form) => request(path, { method: 'PUT', form }),
};

export const API_BASE = BASE;

// Simple analytics event (fail ho to koi farq nahi)
export function track(name) {
  try {
    fetch(`${BASE}/analytics/event`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, path: window.location.pathname }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    /* ignore */
  }
}