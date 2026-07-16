"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  LogOut, Plus, Pencil, Trash2, Image as ImageIcon, X, AlertCircle, CheckCircle2,
  Upload, Eye, MessageSquare, Calendar, Layers, Globe, Star, Search,
  LayoutDashboard, FolderKanban, Settings, ChevronLeft, ChevronRight, Menu
} from 'lucide-react';
import Image from 'next/image';

const CATEGORIES = [
  { value: 'landing_page', label: 'Landing Page' },
  { value: 'portfolio', label: 'Portfolio' },
  { value: 'ecommerce', label: 'E-commerce' },
  { value: 'dashboard', label: 'Dashboard' },
  { value: 'web_app', label: 'Web App' },
  { value: 'other', label: 'Khác' },
];

const STATUS_OPTIONS = [
  { value: 'published', label: 'Đã xuất bản', color: 'text-[#3DDC97]', bg: 'bg-[#3DDC97]/10' },
  { value: 'coming_soon', label: 'Sắp ra mắt', color: 'text-[#5B8CFF]', bg: 'bg-[#5B8CFF]/10' },
  { value: 'draft', label: 'Bản nháp', color: 'text-[#F5B942]', bg: 'bg-[#F5B942]/10' },
];

const PROJECT_LABELS = [
  { value: '', label: 'Không có nhãn' },
  { value: 'Independent Project', label: 'Independent Project' },
  { value: 'Personal Build', label: 'Personal Build' },
  { value: 'Concept Redesign', label: 'Concept Redesign' },
  { value: 'Speculative Concept', label: 'Speculative Concept' },
  { value: 'Client Project', label: 'Client Project' },
];

// Helper to parse/stringify structured descriptions
const parseDescription = (desc) => {
  if (!desc) return { signal: '', response: '', outcome: '' };
  if (desc.includes('[SIGNAL]')) {
    const signal = desc.match(/\[SIGNAL\]([\s\S]*?)\[RESPONSE\]/)?.[1]?.trim() || '';
    const response = desc.match(/\[RESPONSE\]([\s\S]*?)\[OUTCOME\]/)?.[1]?.trim() || '';
    const outcome = desc.match(/\[OUTCOME\]([\s\S]*)/)?.[1]?.trim() || '';
    return { signal, response, outcome };
  }
  const parts = desc.split('. ');
  return {
    signal: parts[0] + (parts.length > 1 ? '.' : ''),
    response: parts.slice(1).join('. '),
    outcome: ''
  };
};

const stringifyDescription = ({ signal, response, outcome }) => {
  return `[SIGNAL] ${signal || ''}\n[RESPONSE] ${response || ''}\n[OUTCOME] ${outcome || ''}`;
};

const EMPTY_FORM = {
  title_vi: '', title_en: '',
  signal_vi: '', response_vi: '', outcome_vi: '',
  signal_en: '', response_en: '', outcome_en: '',
  category: 'landing_page',
  technologies: '',
  thumbnail_url: '', demo_url: '', github_url: '',
  status: 'draft', featured: false, project_label: '',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('overview'); // overview, projects, messages
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewingMessage, setViewingMessage] = useState(null);
  
  // Editor State
  const [showEditor, setShowEditor] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const fileRef = useRef(null);

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  // UI Feedback State
  const [toast, setToast] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState(null); // { title, message, onConfirm, destructive }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && viewingMessage) {
        setViewingMessage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingMessage]);


  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [projRes, msgRes] = await Promise.all([
        fetch(`/api/projects?all=true&t=${Date.now()}`).catch(() => ({ json: () => ({ data: [] }) })),
        fetch(`/api/messages?t=${Date.now()}`).catch(() => ({ json: () => ({ data: [] }) }))
      ]);
      const projData = await (projRes.ok ? projRes.json() : { data: [] });
      const msgData = await (msgRes.ok ? msgRes.json() : { data: [] });
      setProjects(projData.data || []);
      setMessages(msgData.data || []);
    } catch { showToast('Lỗi tải dữ liệu', 'error'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setIsDirty(false);
    setShowEditor(true);
  };

  const openEditForm = (project) => {
    const descVi = parseDescription(project.description_vi);
    const descEn = parseDescription(project.description_en);
    setEditingId(project.id);
    setForm({
      title_vi: project.title_vi || '',
      title_en: project.title_en || '',
      signal_vi: descVi.signal, response_vi: descVi.response, outcome_vi: descVi.outcome,
      signal_en: descEn.signal, response_en: descEn.response, outcome_en: descEn.outcome,
      category: project.category || 'landing_page',
      technologies: (project.technologies || []).join(', '),
      thumbnail_url: project.thumbnail_url || '',
      demo_url: project.demo_url || '',
      github_url: project.github_url || '',
      status: project.status || 'draft',
      featured: project.featured || false,
      project_label: project.project_label || '',
    });
    setIsDirty(false);
    setShowEditor(true);
  };

  const closeEditor = () => {
    if (isDirty) {
      setConfirmDialog({
        title: 'Cảnh báo',
        message: 'Bạn có thay đổi chưa được lưu. Xác nhận đóng?',
        destructive: true,
        onConfirm: () => {
          setShowEditor(false);
          setConfirmDialog(null);
        }
      });
    } else {
      setShowEditor(false);
    }
  };

  const handleDelete = (id, title) => {
    setConfirmDialog({
      title: 'Xác nhận xóa',
      message: `Bạn sắp xóa dự án "${title}". Hành động này không thể hoàn tác.`,
      destructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setProjects(p => p.filter(x => x.id !== id));
            showToast('Đã xóa dự án');
          } else showToast('Xóa thất bại', 'error');
        } catch { showToast('Lỗi đường truyền', 'error'); }
        setConfirmDialog(null);
      }
    });
  };

  const updateMessageStatus = async (id, newStatus) => {
    // Save original state for rollback
    const originalMessages = [...messages];
    
    // Optimistic UI Update
    setMessages(m => m.map(x => x.id === id ? { ...x, status: newStatus } : x));
    
    try {
      const res = await fetch(`/api/messages/${id}`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) {
        throw new Error('API failed');
      }
    } catch (err) {
      // Rollback on error
      setMessages(originalMessages);
      showToast('Lỗi kết nối khi cập nhật trạng thái', 'error');
    }
  };

  const handleOpenMessage = (msg) => {
    setViewingMessage(msg);
    if (msg.status === 'unread') {
      updateMessageStatus(msg.id, 'read');
      setViewingMessage({ ...msg, status: 'read' });
    }
  };

  const handleDeleteMessage = (id) => {
    setConfirmDialog({
      title: 'Xác nhận xóa',
      message: `Xóa tín hiệu/tin nhắn này vĩnh viễn?`,
      destructive: true,
      onConfirm: async () => {
        try {
          const res = await fetch(`/api/messages/${id}`, { method: 'DELETE' });
          if (res.ok) {
            setMessages(m => m.filter(x => x.id !== id));
            showToast('Đã xóa tin nhắn');
          }
        } catch { showToast('Lỗi đường truyền', 'error'); }
        setConfirmDialog(null);
      }
    });
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
        setIsDirty(true);
        setUploadProgress('done');
        showToast('Tải ảnh lên thành công');
      } else {
        setUploadProgress(null);
        showToast(data.error || 'Upload thất bại', 'error');
      }
    } catch {
      setUploadProgress(null);
      showToast('Lỗi đường truyền', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        description_vi: stringifyDescription({ signal: form.signal_vi, response: form.response_vi, outcome: form.outcome_vi }),
        description_en: stringifyDescription({ signal: form.signal_en, response: form.response_en, outcome: form.outcome_en }),
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
        showToast(editingId ? 'Đã lưu thay đổi' : 'Dự án đã được tạo');
        setShowEditor(false);
        setIsDirty(false);
        fetchData();
      } else {
        const data = await res.json();
        showToast(typeof data.error === 'string' ? data.error : 'Có lỗi hệ thống', 'error');
      }
    } catch { showToast('Lỗi đường truyền', 'error'); }
    finally { setSaving(false); }
  };

  // Filtered Projects
  const filteredProjects = projects
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => filterCategory === 'all' || p.category === filterCategory)
    .filter(p => (p.title_vi || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                 (p.title_en || '').toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Dashboard Metrics
  const metrics = {
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    drafts: projects.filter(p => p.status === 'draft' || p.status === 'coming_soon').length,
    featured: projects.filter(p => p.featured).length,
    unread: messages.filter(m => m.status === 'unread').length,
  };

  return (
    <div className="flex h-screen bg-[#F5F2EA] text-[#111318] font-sans overflow-hidden selection:bg-[#3867FF]/30">
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-4 py-3 rounded-md shadow-2xl border animate-fade-up ${
          toast.type === 'error' ? 'bg-[#FF5D68]/10 border-[#FF5D68]/30 text-[#FF5D68]' : 'bg-[#FFFFFF] border-[#D6D1C4] text-white'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={16} /> : <div className="w-2 h-2 bg-[#3DDC97] rotate-45" />}
          <span className="text-sm font-medium">{toast.msg}</span>
        </div>
      )}

      {/* Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#FFFFFF] border border-[#D6D1C4] rounded-lg shadow-2xl w-full max-w-sm overflow-hidden animate-slide-down">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-[#111318] mb-2">{confirmDialog.title}</h3>
              <p className="text-sm text-[#4A505C]">{confirmDialog.message}</p>
            </div>
            <div className="flex gap-3 px-6 py-4 bg-[#EBE6DA] border-t border-[#D6D1C4] justify-end">
              <button 
                onClick={() => setConfirmDialog(null)}
                className="px-4 py-2 text-sm font-medium text-[#4A505C] hover:text-[#111318] transition-colors"
              >
                Hủy
              </button>
              <button 
                onClick={confirmDialog.onConfirm}
                className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
                  confirmDialog.destructive 
                    ? 'bg-[#FF5D68]/10 text-[#FF5D68] hover:bg-[#FF5D68] hover:text-white border border-[#FF5D68]/20' 
                    : 'bg-[#3867FF] text-white hover:bg-[#3867FF]/80'
                }`}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-[#EBE6DA] border-r border-[#D6D1C4] flex flex-col transition-transform duration-200 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 h-16 px-6 border-b border-[#D6D1C4]">
          <div className="w-4 h-4 bg-[#3867FF] rotate-45 shadow-[0_0_10px_rgba(56,103,255,0.5)]" />
          <div>
            <div className="font-semibold text-sm tracking-wide">Tee Field Console</div>
            <div className="text-[10px] text-[#828A9A] uppercase tracking-widest font-mono mt-0.5">Portfolio Admin</div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {[
            { id: 'overview', icon: LayoutDashboard, label: 'Tổng quan' },
            { id: 'projects', icon: FolderKanban, label: 'Dự án', count: projects.length },
            { id: 'messages', icon: MessageSquare, label: 'Tin nhắn', count: metrics.unread, badge: metrics.unread > 0 },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setSidebarOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-[#3867FF]/10 text-[#3867FF]' 
                  : 'text-[#4A505C] hover:text-[#111318] hover:bg-[#F0EBE0]'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon size={18} className={activeTab === item.id ? 'text-[#3867FF]' : 'text-[#828A9A]'} />
                {item.label}
              </div>
              {item.count !== undefined && (
                <div className={`text-xs px-2 py-0.5 rounded-full ${item.badge ? 'bg-[#3867FF] text-white' : 'bg-[#F0EBE0] text-[#828A9A]'}`}>
                  {item.count}
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#D6D1C4] space-y-2">
          <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-3 py-2 text-sm text-[#4A505C] hover:text-[#111318] transition-colors rounded-md hover:bg-[#F0EBE0]">
            <Eye size={16} /> Xem trang thực tế
          </a>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-[#FF5D68] hover:bg-[#FF5D68]/10 transition-colors rounded-md">
            <LogOut size={16} /> Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F5F2EA]">
        {/* Top Command Bar */}
        <header className="h-16 flex items-center justify-between px-4 lg:px-8 border-b border-[#D6D1C4] bg-[#F5F2EA]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-[#4A505C] hover:text-[#111318]">
              <Menu size={20} />
            </button>
            <h1 className="text-lg font-semibold text-[#111318]">
              {activeTab === 'overview' ? 'Tổng quan' : activeTab === 'projects' ? 'Quản lý Dự án' : 'Hộp thư Tín hiệu'}
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            {activeTab === 'projects' && (
              <button onClick={openAddForm} className="flex items-center gap-2 bg-[#3867FF] hover:bg-[#3867FF]/90 text-white px-4 py-2 rounded-md text-sm font-semibold transition-colors shadow-lg shadow-[#3867FF]/20">
                <Plus size={16} /> Thêm dự án
              </button>
            )}
            {activeTab === 'messages' && metrics.unread > 0 && (
              <span className="hidden sm:inline-flex items-center gap-2 text-xs font-mono text-[#5B8CFF] bg-[#5B8CFF]/10 px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-[#5B8CFF] animate-pulse" /> {metrics.unread} chưa đọc
              </span>
            )}
          </div>
        </header>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          
          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="max-w-[1400px] mx-auto space-y-8 animate-fade-in">
              {/* Metrics Strip */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {[
                  { label: 'Tổng dự án', value: metrics.total, color: 'text-[#111318]' },
                  { label: 'Đã xuất bản', value: metrics.published, color: 'text-[#3DDC97]' },
                  { label: 'Sắp ra/Nháp', value: metrics.drafts, color: 'text-[#F5B942]' },
                  { label: 'Nổi bật', value: metrics.featured, color: 'text-[#5B8CFF]' },
                  { label: 'Tin nhắn mới', value: metrics.unread, color: 'text-[#FF5D68]' },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#FFFFFF] border border-[#D6D1C4] rounded-lg p-4 flex flex-col justify-between">
                    <span className="text-[#828A9A] text-[10px] font-mono uppercase tracking-wider mb-2">{stat.label}</span>
                    <span className={`text-3xl font-display font-medium ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#FFFFFF] border border-[#D6D1C4] rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#D6D1C4] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#111318]">Dự án cập nhật gần đây</h2>
                    <button onClick={() => setActiveTab('projects')} className="text-[#3867FF] text-xs hover:underline">Xem tất cả</button>
                  </div>
                  <div className="divide-y divide-[#D6D1C4]">
                    {projects.slice(0, 4).map(p => (
                      <div key={p.id} className="p-4 px-6 flex items-center justify-between hover:bg-[#F0EBE0] transition-colors">
                        <div>
                          <div className="text-sm font-medium text-[#111318]">{p.title_vi}</div>
                          <div className="text-xs text-[#828A9A] mt-1">{p.category} • {new Date(p.created_at).toLocaleDateString('vi-VN')}</div>
                        </div>
                        <span className={`text-[10px] font-mono px-2 py-1 rounded ${STATUS_OPTIONS.find(s=>s.value===p.status)?.bg} ${STATUS_OPTIONS.find(s=>s.value===p.status)?.color}`}>
                          {STATUS_OPTIONS.find(s=>s.value===p.status)?.label}
                        </span>
                      </div>
                    ))}
                    {projects.length === 0 && <div className="p-8 text-center text-[#828A9A] text-sm">Chưa có dự án nào</div>}
                  </div>
                </div>

                <div className="bg-[#FFFFFF] border border-[#D6D1C4] rounded-lg overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#D6D1C4] flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-[#111318]">Tín hiệu chưa đọc</h2>
                    <button onClick={() => setActiveTab('messages')} className="text-[#3867FF] text-xs hover:underline">Hộp thư</button>
                  </div>
                  <div className="divide-y divide-[#D6D1C4]">
                    {messages.filter(m => m.status === 'unread').slice(0, 4).map(m => (
                      <div key={m.id} className="p-4 px-6 hover:bg-[#F0EBE0] transition-colors">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-[#111318]">{m.name}</span>
                          <span className="text-[10px] text-[#828A9A] font-mono">{new Date(m.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="text-xs text-[#4A505C] truncate">{m.subject}</div>
                      </div>
                    ))}
                    {messages.filter(m => m.status === 'unread').length === 0 && (
                      <div className="p-8 text-center text-[#828A9A] text-sm flex items-center justify-center gap-2">
                        <CheckCircle2 size={16} /> Đã kiểm tra hết tín hiệu
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: PROJECTS */}
          {activeTab === 'projects' && (
            <div className="max-w-[1400px] mx-auto space-y-6 animate-fade-in">
              {/* Toolbar */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-4 rounded-lg border border-[#D6D1C4]">
                <div className="relative flex-1 max-w-sm">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#828A9A]" />
                  <input 
                    type="text" placeholder="Tìm kiếm dự án..." 
                    value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                    className="w-full bg-[#F0EBE0] border border-[#D6D1C4] rounded-md py-2 pl-10 pr-4 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <select 
                    value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
                    className="bg-[#F0EBE0] border border-[#D6D1C4] rounded-md py-2 px-3 text-sm text-[#4A505C] focus:outline-none focus:border-[#3867FF]"
                  >
                    <option value="all">Tất cả danh mục</option>
                    {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                  <select 
                    value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    className="bg-[#F0EBE0] border border-[#D6D1C4] rounded-md py-2 px-3 text-sm text-[#4A505C] focus:outline-none focus:border-[#3867FF]"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    {STATUS_OPTIONS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Data Table / Cards */}
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-20 bg-[#FFFFFF] border border-[#D6D1C4] rounded-lg animate-pulse" />)}
                </div>
              ) : filteredProjects.length === 0 ? (
                <div className="text-center py-20 border border-[#D6D1C4] rounded-lg bg-[#FFFFFF] border-dashed">
                  <FolderKanban size={32} className="mx-auto text-[#828A9A] mb-4" />
                  <p className="text-[#4A505C] text-sm">Không tìm thấy dự án nào phù hợp.</p>
                  <button onClick={() => {setSearchTerm(''); setFilterCategory('all'); setFilterStatus('all');}} className="mt-4 text-[#3867FF] text-sm hover:underline">
                    Xóa bộ lọc
                  </button>
                </div>
              ) : (
                <div className="bg-[#FFFFFF] border border-[#D6D1C4] rounded-lg overflow-hidden shadow-sm">
                  {/* Desktop Table */}
                  <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-[#D6D1C4] bg-[#EBE6DA]">
                          <th className="py-3 px-4 text-xs font-semibold text-[#828A9A] uppercase tracking-wider w-16">Preview</th>
                          <th className="py-3 px-4 text-xs font-semibold text-[#828A9A] uppercase tracking-wider">Dự án</th>
                          <th className="py-3 px-4 text-xs font-semibold text-[#828A9A] uppercase tracking-wider">Phân loại</th>
                          <th className="py-3 px-4 text-xs font-semibold text-[#828A9A] uppercase tracking-wider text-center">Trạng thái</th>
                          <th className="py-3 px-4 text-xs font-semibold text-[#828A9A] uppercase tracking-wider text-center w-16">Nổi bật</th>
                          <th className="py-3 px-4 text-xs font-semibold text-[#828A9A] uppercase tracking-wider text-right w-32">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D6D1C4]">
                        {filteredProjects.map((p, idx) => {
                          const status = STATUS_OPTIONS.find(s => s.value === p.status) || STATUS_OPTIONS[2];
                          return (
                            <tr key={p.id} className="hover:bg-[#F0EBE0] transition-colors group">
                              <td className="py-3 px-4">
                                <div className="w-12 h-9 bg-[#F0EBE0] border border-[#D6D1C4] rounded overflow-hidden relative flex items-center justify-center">
                                  {p.thumbnail_url ? (
                                    <Image src={p.thumbnail_url} alt="" fill className="object-cover" sizes="48px" />
                                  ) : (
                                    <ImageIcon size={14} className="text-[#828A9A]" />
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="font-medium text-[#111318] text-sm">{p.title_vi}</div>
                                <div className="text-[10px] text-[#828A9A] font-mono mt-0.5">{p.id.split('-')[0]}</div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-xs text-[#4A505C]">{CATEGORIES.find(c=>c.value===p.category)?.label || p.category}</span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide ${status.bg} ${status.color} border border-current/20`}>
                                  {status.label}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-center">
                                {p.featured ? <Star size={16} className="mx-auto text-[#5B8CFF] fill-[#5B8CFF]" /> : <Star size={16} className="mx-auto text-[#D6D1C4]" />}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
                                  <button onClick={() => openEditForm(p)} className="p-1.5 bg-[#F0EBE0] border border-[#D6D1C4] rounded hover:border-[#3867FF] hover:text-[#3867FF] text-[#4A505C] transition-colors" title="Chỉnh sửa">
                                    <Pencil size={14} />
                                  </button>
                                  <button onClick={() => handleDelete(p.id, p.title_vi)} className="p-1.5 bg-[#F0EBE0] border border-[#D6D1C4] rounded hover:border-[#FF5D68] hover:text-[#FF5D68] hover:bg-[#FF5D68]/10 text-[#4A505C] transition-colors" title="Xóa">
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Mobile Cards */}
                  <div className="md:hidden divide-y divide-[#D6D1C4]">
                    {filteredProjects.map((p) => {
                       const status = STATUS_OPTIONS.find(s => s.value === p.status) || STATUS_OPTIONS[2];
                       return (
                         <div key={p.id} className="p-4 space-y-3">
                           <div className="flex justify-between items-start">
                             <div>
                               <div className="font-medium text-[#111318] text-sm">{p.title_vi}</div>
                               <div className="text-[10px] text-[#828A9A] font-mono mt-0.5">{CATEGORIES.find(c=>c.value===p.category)?.label}</div>
                             </div>
                             <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wide ${status.bg} ${status.color}`}>
                                {status.label}
                             </span>
                           </div>
                           <div className="flex justify-between items-center pt-2 border-t border-[#D6D1C4]/50">
                             <div>{p.featured && <Star size={14} className="text-[#5B8CFF] fill-[#5B8CFF]" />}</div>
                             <div className="flex gap-2">
                               <button onClick={() => openEditForm(p)} className="px-3 py-1.5 text-xs bg-[#F0EBE0] border border-[#D6D1C4] rounded text-[#4A505C]">Sửa</button>
                               <button onClick={() => handleDelete(p.id, p.title_vi)} className="px-3 py-1.5 text-xs bg-[#F0EBE0] border border-[#D6D1C4] rounded text-[#FF5D68]">Xóa</button>
                             </div>
                           </div>
                         </div>
                       );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="max-w-[1400px] mx-auto animate-fade-in">
               <div className="bg-[#FFFFFF] border border-[#D6D1C4] rounded-lg overflow-hidden shadow-sm">
                 <div className="px-6 py-4 border-b border-[#D6D1C4] bg-[#EBE6DA]">
                   <h2 className="text-sm font-semibold text-[#4A505C] uppercase tracking-wider">Hộp thư đến</h2>
                 </div>
                 {loading ? (
                   <div className="p-6 space-y-4">
                     {[1,2].map(i => <div key={i} className="h-24 bg-[#F0EBE0] animate-pulse rounded" />)}
                   </div>
                 ) : messages.length === 0 ? (
                   <div className="text-center py-20">
                     <MessageSquare size={32} className="mx-auto text-[#828A9A] mb-4" />
                     <p className="text-[#4A505C] text-sm">Không có tin nhắn nào.</p>
                   </div>
                 ) : (
                   <div className="divide-y divide-[#D6D1C4]">
                     {messages.map(msg => (
                       <div 
                         key={msg.id} 
                         onClick={() => handleOpenMessage(msg)}
                         className={`transition-colors cursor-pointer ${msg.status === 'unread' ? 'bg-[#FFFFFF] hover:bg-[#F5F2EA]' : 'bg-[#F0EBE0]/30 hover:bg-[#F0EBE0]/50'}`}
                       >
                         {/* Header / Clickable row */}
                         <div className="p-4 px-6 flex items-center justify-between gap-4">
                           <div className="flex items-center gap-4 flex-1 min-w-0">
                             {/* Unread indicator */}
                             <div className="w-2 flex-shrink-0 flex justify-center">
                               {msg.status === 'unread' && <div className="w-2 h-2 rounded-full bg-[#3867FF]" />}
                             </div>
                             
                             <div className={`w-32 md:w-48 truncate text-sm ${msg.status === 'unread' ? 'font-bold text-[#111318]' : 'font-medium text-[#4A505C]'}`}>
                               {msg.name}
                             </div>
                             
                             <div className={`flex-1 truncate text-sm ${msg.status === 'unread' ? 'font-semibold text-[#111318]' : 'text-[#4A505C]'}`}>
                               {msg.subject}
                               <span className="font-normal text-[#828A9A] ml-2 hidden md:inline">
                                 - {msg.message.length > 50 ? msg.message.substring(0, 50) + '...' : msg.message}
                               </span>
                             </div>
                           </div>
                           
                           <div className={`text-[11px] font-mono whitespace-nowrap ${msg.status === 'unread' ? 'font-bold text-[#111318]' : 'text-[#828A9A]'}`}>
                             {new Date(msg.created_at).toLocaleDateString('vi-VN')}
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
               </div>
            </div>
          )}
        </div>
      </main>

      
      {/* Message Detail Panel */}
      {viewingMessage && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-fade-in"
          onClick={() => setViewingMessage(null)}
        >
          <div 
            className="bg-[#F5F2EA] w-full max-w-2xl h-full border-l border-[#D6D1C4] shadow-2xl flex flex-col animate-slide-left"
            onClick={e => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="h-16 flex items-center justify-between px-6 md:px-8 border-b border-[#D6D1C4] bg-[#EBE6DA] shrink-0">
              <h2 className="text-sm font-semibold text-[#111318] uppercase tracking-wider">Chi tiết tin nhắn</h2>
              <button 
                onClick={() => setViewingMessage(null)} 
                className="p-2 text-[#828A9A] hover:text-[#111318] transition-colors rounded-md hover:bg-[#F0EBE0]"
                aria-label="Đóng"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar bg-[#FFFFFF]">
              <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-[#111318]">{viewingMessage.name}</h3>
                    <a 
                      href={`mailto:${viewingMessage.email}`} 
                      className="text-sm font-mono text-[#3867FF] hover:underline"
                    >
                      {viewingMessage.email}
                    </a>
                  </div>
                  <div className="text-xs text-[#828A9A] font-mono whitespace-nowrap bg-[#F0EBE0] px-3 py-1.5 rounded-full border border-[#D6D1C4]">
                    {new Date(viewingMessage.created_at).toLocaleString('vi-VN')}
                  </div>
                </div>

                <div className="pt-6 border-t border-[#D6D1C4]">
                  <h4 className="text-sm font-semibold text-[#4A505C] mb-4 uppercase tracking-wide">Chủ đề: {viewingMessage.subject}</h4>
                  <div className="text-[15px] text-[#111318] whitespace-pre-wrap leading-loose font-sans p-6 bg-[#F5F2EA] border border-[#D6D1C4] rounded-lg">
                    {viewingMessage.message}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-6 md:p-8 border-t border-[#D6D1C4] bg-[#EBE6DA] flex flex-wrap items-center justify-between gap-4 shrink-0">
              <a 
                href={`mailto:${viewingMessage.email}?subject=Re: ${viewingMessage.subject}`} 
                className="px-6 py-2.5 bg-[#3867FF] text-white hover:bg-[#3867FF]/90 rounded-md text-sm font-medium transition-colors shadow-lg shadow-[#3867FF]/20"
              >
                Trả lời qua email
              </a>
              
              <div className="flex gap-3 ml-auto">
                {viewingMessage.status === 'read' ? (
                  <button 
                    onClick={() => {
                      updateMessageStatus(viewingMessage.id, 'unread');
                      setViewingMessage({ ...viewingMessage, status: 'unread' });
                    }} 
                    className="px-4 py-2 bg-[#F0EBE0] border border-[#D6D1C4] hover:border-[#4A505C] text-[#4A505C] rounded-md text-sm font-medium transition-colors"
                  >
                    Đánh dấu chưa đọc
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      updateMessageStatus(viewingMessage.id, 'read');
                      setViewingMessage({ ...viewingMessage, status: 'read' });
                    }} 
                    className="px-4 py-2 bg-[#F0EBE0] border border-[#D6D1C4] hover:border-[#3867FF] text-[#3867FF] rounded-md text-sm font-medium transition-colors"
                  >
                    Đánh dấu đã đọc
                  </button>
                )}
                
                <button 
                  onClick={() => {
                    handleDeleteMessage(viewingMessage.id);
                    setViewingMessage(null);
                  }} 
                  className="px-4 py-2 border border-[#FF5D68]/30 bg-[#FFFFFF] hover:bg-[#FF5D68]/10 text-[#FF5D68] rounded-md text-sm font-medium transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Editor Modal (Two-Column Workspace) */}
      {showEditor && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-0 md:p-6 animate-fade-in">
          <div className="bg-[#F5F2EA] md:border border-[#D6D1C4] md:rounded-xl w-full max-w-6xl h-full md:h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-slide-down">
            
            {/* Editor Header */}
            <div className="h-16 flex items-center justify-between px-6 border-b border-[#D6D1C4] bg-[#EBE6DA]">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-[#3867FF] rotate-45" />
                <h2 className="text-sm font-semibold text-[#111318] uppercase tracking-wider">
                  {editingId ? 'Chỉnh sửa Dự án' : 'Tạo Dự án Mới'}
                </h2>
              </div>
              <button onClick={closeEditor} className="p-2 text-[#828A9A] hover:text-[#111318] transition-colors rounded-md hover:bg-[#F0EBE0]">
                <X size={20} />
              </button>
            </div>

            {/* Editor Body */}
            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
              {/* Main Column */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Tên dự án (VI) <span className="text-[#FF5D68]">*</span></label>
                    <input 
                      type="text" required value={form.title_vi}
                      onChange={e => {setForm(p => ({...p, title_vi: e.target.value})); setIsDirty(true);}}
                      className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-4 py-2.5 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Project Name (EN)</label>
                    <input 
                      type="text" value={form.title_en}
                      onChange={e => {setForm(p => ({...p, title_en: e.target.value})); setIsDirty(true);}}
                      className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-4 py-2.5 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-px bg-[#D6D1C4]" />
                    <span className="text-[10px] font-mono text-[#828A9A] uppercase tracking-widest">Nội dung case study (không bắt buộc)</span>
                    <div className="flex-1 h-px bg-[#D6D1C4]" />
                  </div>
                  <p className="text-[11px] text-[#4A505C] italic text-center -mt-2">
                    Dùng để giải thích vấn đề, cách thực hiện và giá trị của dự án trên portfolio. Có thể bổ sung sau.
                  </p>

                  {/* Structured Content Fields */}
                  {[
                    { key: 'signal', label: 'Vấn đề / Nhu cầu', placeholder: 'Ví dụ: Khách chưa có nơi xem menu, vị trí và gửi yêu cầu đặt bàn.' },
                    { key: 'response', label: 'Giải pháp thực hiện', placeholder: 'Ví dụ: Thiết kế website giới thiệu thương hiệu, menu trực quan và form đặt bàn.' },
                    { key: 'outcome', label: 'Giá trị mang lại', placeholder: 'Ví dụ: Giúp khách tìm thông tin nhanh hơn và gửi yêu cầu liên hệ từ một nơi.' }
                  ].map((field) => (
                    <div key={field.key} className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-lg bg-[#EBE6DA] border border-[#D6D1C4]/50">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A505C] mb-2 tracking-wide">
                          {field.label} (VI)
                        </label>
                        <textarea 
                          rows={3} value={form[`${field.key}_vi`]} placeholder={field.placeholder}
                          onChange={e => {setForm(p => ({...p, [`${field.key}_vi`]: e.target.value})); setIsDirty(true);}}
                          className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors resize-y min-h-[80px] placeholder:text-[#828A9A]"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#828A9A] mb-2 tracking-wide">
                          {field.label} (EN)
                        </label>
                        <textarea 
                          rows={3} value={form[`${field.key}_en`]} placeholder={`English: ${field.placeholder}`}
                          onChange={e => {setForm(p => ({...p, [`${field.key}_en`]: e.target.value})); setIsDirty(true);}}
                          className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors resize-y min-h-[80px] placeholder:text-[#828A9A]"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Công nghệ (cách nhau bởi dấu phẩy)</label>
                  <input 
                    type="text" value={form.technologies} placeholder="React, Next.js, Tailwind..."
                    onChange={e => {setForm(p => ({...p, technologies: e.target.value})); setIsDirty(true);}}
                    className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-4 py-2.5 text-sm font-mono text-[#5B8CFF] focus:outline-none focus:border-[#3867FF] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Demo URL</label>
                    <input 
                      type="url" value={form.demo_url} placeholder="https://"
                      onChange={e => {setForm(p => ({...p, demo_url: e.target.value})); setIsDirty(true);}}
                      className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-4 py-2.5 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Repository URL</label>
                    <input 
                      type="url" value={form.github_url} placeholder="https://github.com/..."
                      onChange={e => {setForm(p => ({...p, github_url: e.target.value})); setIsDirty(true);}}
                      className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-4 py-2.5 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Ảnh Cover</label>
                  <div className="flex gap-3">
                    <input 
                      type="text" value={form.thumbnail_url} placeholder="URL ảnh..."
                      onChange={e => {setForm(p => ({...p, thumbnail_url: e.target.value})); setIsDirty(true);}}
                      className="flex-1 bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-4 py-2.5 text-sm text-[#4A505C] focus:outline-none focus:border-[#3867FF] transition-colors"
                    />
                    <button 
                      type="button" onClick={() => fileRef.current?.click()}
                      disabled={uploadProgress === 'uploading'}
                      className="px-4 py-2 bg-[#F0EBE0] border border-[#D6D1C4] hover:border-[#4A505C] text-[#111318] rounded-md text-sm font-medium transition-colors flex items-center gap-2"
                    >
                      {uploadProgress === 'uploading' ? '...' : <><Upload size={16}/> Tải lên</>}
                    </button>
                    <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e.target.files?.[0])} />
                  </div>
                  {form.thumbnail_url && (
                    <div className="mt-4 relative w-full max-w-sm aspect-[4/3] rounded-lg overflow-hidden border border-[#D6D1C4]">
                      <Image src={form.thumbnail_url} alt="Cover Preview" fill className="object-cover" />
                    </div>
                  )}
                </div>

              </div>

              {/* Sidebar Panel (Publishing) */}
              <div className="w-full md:w-80 bg-[#EBE6DA] border-t md:border-t-0 md:border-l border-[#D6D1C4] p-6 flex flex-col">
                <h3 className="text-xs font-mono text-[#828A9A] uppercase tracking-widest mb-6">Thiết lập xuất bản</h3>
                
                <div className="space-y-6 flex-1">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Trạng thái</label>
                    <select 
                      value={form.status} 
                      onChange={e => {setForm(p => ({...p, status: e.target.value})); setIsDirty(true);}}
                      className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2.5 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF]"
                    >
                      {STATUS_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Phân loại chính</label>
                    <select 
                      value={form.category} 
                      onChange={e => {setForm(p => ({...p, category: e.target.value})); setIsDirty(true);}}
                      className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2.5 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF]"
                    >
                      {CATEGORIES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A505C] mb-2 uppercase tracking-wide">Nhãn phụ (Tùy chọn)</label>
                    <select 
                      value={form.project_label || ''} 
                      onChange={e => {setForm(p => ({...p, project_label: e.target.value})); setIsDirty(true);}}
                      className="w-full bg-[#FFFFFF] border border-[#D6D1C4] rounded-md px-3 py-2.5 text-sm text-[#111318] focus:outline-none focus:border-[#3867FF]"
                    >
                      {PROJECT_LABELS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-4 rounded-lg border border-[#D6D1C4] bg-[#FFFFFF] hover:border-[#3867FF]/50 transition-colors">
                    <input 
                      type="checkbox" checked={form.featured}
                      onChange={e => {setForm(p => ({...p, featured: e.target.checked})); setIsDirty(true);}}
                      className="mt-1 w-4 h-4 rounded-sm bg-[#F0EBE0] border-[#D6D1C4] text-[#3867FF] focus:ring-0 focus:ring-offset-0 cursor-pointer"
                    />
                    <div>
                      <div className="text-sm font-medium text-[#111318]">Dự án nổi bật</div>
                      <div className="text-xs text-[#828A9A] mt-1">Gắn sao và ưu tiên hiển thị</div>
                    </div>
                  </label>
                </div>

                <div className="mt-8 space-y-3 pt-6 border-t border-[#D6D1C4]">
                  <button 
                    onClick={handleSave} disabled={saving || !form.title_vi}
                    className="w-full py-2.5 bg-[#3867FF] hover:bg-[#3867FF]/90 text-white rounded-md text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-[#3867FF]/20"
                  >
                    {saving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    {saving ? 'Đang lưu...' : (editingId ? 'Cập nhật Dự án' : 'Lưu Dự án')}
                  </button>
                  <button onClick={closeEditor} className="w-full py-2.5 bg-[#F0EBE0] hover:bg-[#D6D1C4] text-[#111318] border border-[#D6D1C4] rounded-md text-sm font-medium transition-colors">
                    Hủy bỏ
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #D6D1C4; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3867FF; }
      `}</style>
    </div>
  );
}
