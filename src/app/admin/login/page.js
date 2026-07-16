"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Lock, User, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ username: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [status, setStatus] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setStatus('error');
      setErrorMsg('Vui lòng điền đầy đủ thông tin');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        router.push('/admin/dashboard');
      } else {
        setStatus('error');
        setErrorMsg(data.error || 'Đăng nhập thất bại');
      }
    } catch {
      setStatus('error');
      setErrorMsg('Lỗi kết nối. Vui lòng thử lại.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 font-mono">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blue-600/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="w-6 h-6 border border-blue-600 rotate-45 flex items-center justify-center bg-blue-600/10">
              <div className="w-2 h-2 bg-blue-500" />
            </div>
          </div>
          <h1 className="text-2xl text-white uppercase tracking-widest mb-2">System Auth</h1>
          <p className="text-slate-500 text-xs uppercase tracking-widest">Identify to access Field Notes</p>
        </div>

        {/* Error */}
        {status === 'error' && errorMsg && (
          <div className="flex items-center gap-2 p-3 bg-red-950/20 border border-red-900/40 rounded-none mb-6 text-red-400 text-xs">
            <AlertCircle size={14} className="shrink-0" />
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">
              ID Người dùng
            </label>
            <div className="relative">
              <input
                type="text"
                value={form.username}
                onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-slate-800 py-2 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="admin"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-widest text-slate-500 mb-2">
              Mã bảo mật
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-transparent border-0 border-b border-slate-800 py-2 pr-10 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="••••••••"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-600 hover:text-slate-300 transition-colors"
              >
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full group flex items-center justify-center gap-3 py-4 bg-slate-900 hover:bg-blue-600 border border-slate-800 hover:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs uppercase tracking-widest transition-all duration-300 mt-4"
          >
            {status === 'loading' ? (
              'Authenticating...'
            ) : (
              <>
                Truy cập
                <div className="w-1.5 h-1.5 bg-white rotate-45 group-hover:scale-125 transition-transform" />
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[10px] text-slate-700 mt-12 uppercase tracking-widest">
          <a href="/" className="hover:text-blue-500 transition-colors flex items-center justify-center gap-2">
            <span>←</span> Về trang chủ
          </a>
        </p>
      </div>
    </div>
  );
}
