"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, Plus, Pencil, Trash2, Image as ImageIcon, X, CheckCircle2,
  AlertCircle, Upload, Eye, EyeOff, Layers, Star, Globe, MessageSquare, Check, Calendar
} from 'lucide-react';

const CATEGORIES = [
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'web_app', label: 'Web App' },
  { value: 'other', label: 'Khác' },
];

const STATUS_OPTIONS = [
  { value: 'published', label: '✅ Đã ra mắt' },
  { value: 'coming_soon', label: '🔜 Sắp ra mắt' },
  { value: 'draft', label: '📝 Bản nháp' },
];

const EMPTY_FORM = {
  title_vi: '', title_en: '',
  description_vi: '', description_en: '',
  category: 'landing_page',
  technologies: '',
  thumbnail_url: '', demo_url: '', github_url: '',
  status: 'coming_soon', featured: false,
};

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(null);
  const fileRef = useRef(null);
  
  // Messages state
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'messages'
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/projects');
      const json = await res.json();
      setProjects(json.data || []);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, []);

  const fetchMessages = useCallback(async () => {
    setLoadingMessages(true);
    try {
      const res = await fetch('/api/messages');
      const json = await res.json();
      setMessages(json.data || []);
    } catch { /* ignore */ }
    finally { setLoadingMessages(false); }
  }, []);

  useEffect(() => { 
    fetchProjects(); 
    fetchMessages();
  }, [fetchProjects, fetchMessages]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (project) => {
    setEditingId(project.id);
    setForm({
      title_vi: project.title_vi || '',
      title_en: project.title_en || '',
      description_vi: project.description_vi || '',
      description_en: project.description_en || '',
      category: project.category || 'landing_page',
      technologies: (project.technologies || []).join(', '),
      thumbnail_url: project.thumbnail_url || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      status: project.status || 'coming_soon',
      featured: project.featured || false,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Xác nhận xóa dự án này?')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects(p => p.filter(x => x.id !== id));
        showToast('Đã xóa dự án');
      } else {
        showToast('Xóa thất bại', 'error');
      }
    } catch { showToast('Lỗi kết nối', 'error'); }
  };

  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(`/api/messages/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      });
      if (res.ok) {
        setMessages(m => m.map(x => x.id === id ? { ...x, status: 'read' } : x));
        showToast('Đã đánh dấu đã đọc');
      }
    } catch { showToast('Lỗi kết nối', 'error'); }
  };

  const handleDeleteMessage = async (id) => {
    if (!confirm('Xác nhận xóa tin nhắn này?')) return;
    try {
      const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setMessages(m => m.filter(x => x.id !== id));
        showToast('Đã xóa tin nhắn');
      }
    } catch { showToast('Lỗi kết nối', 'error'); }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploadProgress('uploading');
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (res.ok) {
        setForm(f => ({ ...f, thumbnail_url: data.url }));
        setUploadProgress('done');
        showToast('Tải ảnh thành công');
      } else {
        setUploadProgress(null);
        showToast(data.error || 'Upload thất bại', 'error');
      }
    } catch {
      setUploadProgress(null);
      showToast('Lỗi upload', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        technologies: form.technologies.split(',').map(s => s.trim()).filter(Boolean),
        featured: Boolean(form.featured),
      };
      const url = editingId ? `/api/projects/${editingId}` : '/api/projects';
      const method = editingId ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        showToast(editingId ? 'Đã cập nhật dự án' : 'Đã thêm dự án mới');
        setShowForm(false);
        fetchProjects();
      } else {
        const data = await res.json();
        showToast(typeof data.error === 'string' ? data.error : 'Có lỗi xảy ra', 'error');
      }
    } catch { showToast('Lỗi kết nối', 'error'); }
    finally { setSaving(false); }
  };

  const stats = [
    { label: 'Tổng dự án', value: projects.length, icon: Layers },
    { label: 'Đã ra mắt', value: projects.filter(p => p.status === 'published').length, icon: Globe },
    { label: 'Tin nhắn chưa đọc', value: messages.filter(m => m.status === 'unread').length, icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300" style={{ fontFamily: 'var(--font-sans)' }}>
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-xl border animate-slide-down ${
          toast.type === 'error'
            ? 'bg-red-950 border-red-800 text-red-300'
            : 'bg-slate-800 border-slate-700 text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} className="text-green-400" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-sm">T</div>
            <div>
              <h1 className="text-white font-bold text-sm">Admin Dashboard</h1>
              <p className="text-slate-500 text-[10px]">Portfolio Manager</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white text-xs rounded-lg transition-colors border border-slate-700">
              <Eye size={12} />
              Xem trang
            </a>
            <button onClick={handleLogout} className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-400 text-xs rounded-lg transition-colors border border-red-900/40">
              <LogOut size={12} />
              Đăng xuất
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
              <div className="flex items-center gap-2 text-slate-500 text-xs mb-2">
                <Icon size={12} />{label}
              </div>
              <div className="text-2xl font-bold text-white">{value}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 border-b border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('projects')}
            className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'projects' ? 'border-blue-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Dự án ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 px-1 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'messages' ? 'border-blue-500 text-white' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            Tin nhắn
            {messages.filter(m => m.status === 'unread').length > 0 && (
              <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {messages.filter(m => m.status === 'unread').length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'projects' && (
          <>
            {/* Projects Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-base">Danh sách dự án</h2>
          <button onClick={openAddForm} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg transition-colors">
            <Plus size={14} />
            Thêm dự án
          </button>
        </div>

        {/* Projects Table */}
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-14 skeleton bg-slate-800 rounded-xl" />)}
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
            <Layers size={28} className="text-slate-700 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Chưa có dự án nào. Hãy thêm dự án đầu tiên!</p>
          </div>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="border-b border-slate-800 bg-slate-900/50">
                  <tr>
                    {['Tên dự án', 'Loại', 'Trạng thái', 'Nổi bật', 'Thao tác'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-slate-500 font-semibold uppercase tracking-widest text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {projects.map(project => (
                    <tr key={project.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-slate-200">{project.title_vi || project.title_en}</div>
                        <div className="text-slate-500 text-[10px] mt-0.5">{project.title_en}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-slate-400 font-mono">{project.category}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          project.status === 'published' ? 'bg-green-950 text-green-400 border border-green-900' :
                          project.status === 'draft' ? 'bg-slate-800 text-slate-400' :
                          'bg-blue-950 text-blue-400 border border-blue-900'
                        }`}>
                          {project.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {project.featured ? <Star size={12} className="text-amber-500 fill-amber-500" /> : <span className="text-slate-700">—</span>}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEditForm(project)} className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg transition-colors border border-slate-700 text-[10px] font-medium">
                            <Pencil size={10} />Sửa
                          </button>
                          <button onClick={() => handleDelete(project.id)} className="flex items-center gap-1 px-2.5 py-1 bg-red-950/50 hover:bg-red-950 text-red-500 rounded-lg transition-colors border border-red-900/30 text-[10px] font-medium">
                            <Trash2 size={10} />Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
          </>
        )}

        {activeTab === 'messages' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
            {loadingMessages ? (
              <div className="p-6 space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-20 skeleton bg-slate-800 rounded-xl" />)}
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-16">
                <MessageSquare size={28} className="text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Chưa có tin nhắn nào từ khách hàng.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-slate-800 bg-slate-900/50">
                    <tr>
                      <th className="text-left px-5 py-3 text-slate-500 font-semibold uppercase tracking-widest text-[10px] w-1/4">Người gửi</th>
                      <th className="text-left px-5 py-3 text-slate-500 font-semibold uppercase tracking-widest text-[10px] w-2/4">Nội dung</th>
                      <th className="text-left px-5 py-3 text-slate-500 font-semibold uppercase tracking-widest text-[10px] w-1/4">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.map(msg => (
                      <tr key={msg.id} className={`border-b border-slate-800/50 transition-colors ${msg.status === 'unread' ? 'bg-slate-800/50' : 'hover:bg-slate-800/20'}`}>
                        <td className="px-5 py-4 align-top">
                          <div className={`font-semibold ${msg.status === 'unread' ? 'text-white' : 'text-slate-300'}`}>{msg.name}</div>
                          <div className="text-slate-500 mt-1">{msg.email}</div>
                          <div className="text-slate-600 text-[10px] mt-2 flex items-center gap-1">
                            <Calendar size={10} />
                            {new Date(msg.created_at).toLocaleDateString('vi-VN', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-5 py-4 align-top">
                          <div className={`font-medium mb-1 ${msg.status === 'unread' ? 'text-white' : 'text-slate-300'}`}>{msg.subject}</div>
                          <p className="text-slate-400 whitespace-pre-wrap">{msg.message}</p>
                        </td>
                        <td className="px-5 py-4 align-top">
                          <div className="flex gap-2">
                            {msg.status === 'unread' && (
                              <button onClick={() => handleMarkAsRead(msg.id)} className="flex items-center gap-1 px-2.5 py-1 bg-blue-950/50 hover:bg-blue-900 text-blue-400 rounded-lg transition-colors border border-blue-900/30 text-[10px] font-medium">
                                <Check size={10} />Đã đọc
                              </button>
                            )}
                            <button onClick={() => handleDeleteMessage(msg.id)} className="flex items-center gap-1 px-2.5 py-1 bg-red-950/50 hover:bg-red-950 text-red-500 rounded-lg transition-colors border border-red-900/30 text-[10px] font-medium">
                              <Trash2 size={10} />Xóa
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800">
              <h2 className="text-white font-bold text-sm">
                {editingId ? 'Chỉnh sửa dự án' : 'Thêm dự án mới'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white transition-colors">
                <X size={16} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSave} className="p-6 space-y-5">
              {/* Titles */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { key: 'title_vi', label: 'Tên dự án (Tiếng Việt)', ph: 'Website quán cà phê' },
                  { key: 'title_en', label: 'Project Name (English)', ph: 'Coffee Shop Website' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">{f.label}</label>
                    <input
                      type="text" value={form[f.key]} placeholder={f.ph} required
                      onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all"
                    />
                  </div>
                ))}
              </div>

              {/* Descriptions */}
              {[
                { key: 'description_vi', label: 'Mô tả (Tiếng Việt)' },
                { key: 'description_en', label: 'Description (English)' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">{f.label}</label>
                  <textarea
                    rows={3} value={form[f.key]} required
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/30 transition-all resize-none"
                  />
                </div>
              ))}

              {/* Category + Status */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Loại dự án</label>
                  <input
                    list="category-options"
                    value={form.category}
                    onChange={e => setForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                    placeholder="Chọn hoặc nhập mới..."
                  />
                  <datalist id="category-options">
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </datalist>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Trạng thái</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-all"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Technologies */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">
                  Công nghệ <span className="text-slate-600 font-normal">(cách nhau bởi dấu phẩy)</span>
                </label>
                <input
                  type="text" value={form.technologies}
                  placeholder="React, Tailwind CSS, Node.js"
                  onChange={e => setForm(p => ({ ...p, technologies: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">Ảnh thumbnail</label>
                <div className="flex gap-3">
                  <input
                    type="text" value={form.thumbnail_url} placeholder="URL ảnh hoặc tải lên bên dưới"
                    onChange={e => setForm(p => ({ ...p, thumbnail_url: e.target.value }))}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploadProgress === 'uploading'}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 text-xs rounded-lg transition-colors border border-slate-600"
                  >
                    {uploadProgress === 'uploading' ? (
                      <span className="w-3.5 h-3.5 border-2 border-slate-400/30 border-t-slate-300 rounded-full animate-spin" />
                    ) : (
                      <Upload size={12} />
                    )}
                    {uploadProgress === 'uploading' ? 'Uploading...' : 'Tải lên'}
                  </button>
                  <input
                    ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={e => handleFileUpload(e.target.files?.[0])}
                  />
                </div>
                {form.thumbnail_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <ImageIcon size={11} className="text-green-500" />
                    <span className="text-[10px] text-green-500 truncate">{form.thumbnail_url}</span>
                  </div>
                )}
              </div>

              {/* URLs */}
              {[
                { key: 'demo_url', label: 'Demo URL', ph: 'https://yourproject.com' },
                { key: 'github_url', label: 'GitHub URL', ph: 'https://github.com/...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1.5">{f.label}</label>
                  <input
                    type="url" value={form[f.key]} placeholder={f.ph}
                    onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-all"
                  />
                </div>
              ))}

              {/* Featured */}
              <label className="flex items-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox" checked={form.featured}
                    onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 rounded-full bg-slate-700 peer-checked:bg-blue-600 transition-colors" />
                  <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
                </div>
                <span className="text-xs text-slate-300 font-medium">Đánh dấu là dự án nổi bật</span>
              </label>

              {/* Buttons */}
              <div className="flex gap-3 pt-2 border-t border-slate-800">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg transition-colors border border-slate-700">
                  Hủy
                </button>
                <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-60 text-white text-sm font-semibold rounded-lg transition-colors">
                  {saving ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : null}
                  {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật' : 'Thêm dự án')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
