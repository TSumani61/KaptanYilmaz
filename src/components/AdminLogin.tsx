'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || 'Giriş başarısız');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-900">
      <form onSubmit={handleLogin} className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md dark:bg-zinc-800">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900 dark:text-zinc-100">Yönetici Girişi</h2>
        {error && <p className="mb-4 text-sm text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">Kullanıcı Adı</label>
          <input
            type="text"
            className="w-full appearance-none rounded border px-3 py-2 leading-tight text-zinc-700 shadow focus:outline-none dark:bg-zinc-700 dark:text-zinc-100"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="mb-2 block text-sm font-bold text-zinc-700 dark:text-zinc-300">Şifre</label>
          <input
            type="password"
            className="w-full appearance-none rounded border px-3 py-2 leading-tight text-zinc-700 shadow focus:outline-none dark:bg-zinc-700 dark:text-zinc-100"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
        >
          Giriş Yap
        </button>
      </form>
    </div>
  );
}
