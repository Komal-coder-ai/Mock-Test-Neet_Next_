// Common authenticated API utility for all pages
export type AuthApiOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  url: string;
  data?: any;
  headers?: Record<string, string>;
};

export async function authApi<T = any>({ method = 'GET', url, data, headers = {} }: AuthApiOptions): Promise<T> {
  const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  const allHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };
  if (accessToken) {
    allHeaders['Authorization'] = 'Bearer ' + accessToken;
  }
  const opts: RequestInit = {
    method,
    headers: allHeaders,
  };
  if (data) {
    opts.body = typeof data === 'string' ? data : JSON.stringify(data);
  }
  const res = await fetch(url, opts);
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw error;
  }
  return res.json();
}
