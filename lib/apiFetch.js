// Global API helper for authenticated requests
export async function apiFetch(url, options = {}) {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
  };
  if (accessToken) {
    headers['Authorization'] = 'Bearer ' + accessToken;
  }
  const opts = { ...options, headers };
  return fetch(url, opts);
}
