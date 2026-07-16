const fs = require('fs');

let content = fs.readFileSync('src/app/admin/dashboard/page.js', 'utf8');

// 1. Add `viewingMessage` state and remove `expandedMessageId`
if (content.includes('const [expandedMessageId')) {
    content = content.replace(
        'const [expandedMessageId, setExpandedMessageId] = useState(null);',
        'const [viewingMessage, setViewingMessage] = useState(null);'
    );
}

// 2. Add Escape key handler
if (!content.includes('Escape key handler for message modal')) {
    const useEffectBlock = `
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && viewingMessage) {
        setViewingMessage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewingMessage]);
`;
    // Insert after const [confirmDialog...]
    content = content.replace(
        "const [confirmDialog, setConfirmDialog] = useState(null); // { title, message, onConfirm, destructive }",
        "const [confirmDialog, setConfirmDialog] = useState(null); // { title, message, onConfirm, destructive }\n" + useEffectBlock
    );
}

// 3. Update handleMarkAsRead and add handleMarkAsUnread with Optimistic UI
const oldHandleMarkAsRead = `  const handleMarkAsRead = async (id) => {
    try {
      const res = await fetch(\`/api/messages/\${id}\`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' })
      });
      if (res.ok) setMessages(m => m.map(x => x.id === id ? { ...x, status: 'read' } : x));
    } catch { showToast('Lỗi kết nối', 'error'); }
  };`;

const newMessageHandlers = `  const updateMessageStatus = async (id, newStatus) => {
    // Save original state for rollback
    const originalMessages = [...messages];
    
    // Optimistic UI Update
    setMessages(m => m.map(x => x.id === id ? { ...x, status: newStatus } : x));
    
    try {
      const res = await fetch(\`/api/messages/\${id}\`, { 
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
  };`;

if (content.includes(oldHandleMarkAsRead)) {
    content = content.replace(oldHandleMarkAsRead, newMessageHandlers);
} else if (content.includes('const updateMessageStatus')) {
    // Already applied
}

// 4. Update the MESSAGES tab UI
const oldMessagesBlockRegex = /\{\/\* TAB: MESSAGES \*\/\}([\s\S]*?)<\/div>\s*\}\)\}\s*<\/div>\s*\}\s*<\/div>\s*<\/div>\s*\)\}/m;

const newMessagesBlock = `{/* TAB: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="max-w-[1400px] mx-auto animate-fade-in">
               <div className="bg-[#FFFFFF] border border-[#D6D1C4] rounded-lg overflow-hidden shadow-sm">
                 <div className="px-6 py-4 border-b border-[#D6D1C4] bg-[#EBE6DA]">
                   <h2 className="text-sm font-semibold text-[#4A505C] uppercase tracking-wider">Hộp thư đến</h2>
                 </div>
                 {loading ? (
                   <div className="p-6 space-y-4">
                     {[1,2].map(i => <div key={i} className="h-16 bg-[#F0EBE0] animate-pulse rounded" />)}
                   </div>
                 ) : messages.length === 0 ? (
                   <div className="text-center py-20">
                     <MessageSquare size={32} className="mx-auto text-[#828A9A] mb-4" />
                     <p className="text-[#4A505C] text-sm">Không có tin nhắn nào.</p>
                   </div>
                 ) : (
                   <div className="divide-y divide-[#D6D1C4]">
                     {messages.map(msg => {
                       return (
                       <div 
                         key={msg.id} 
                         onClick={() => handleOpenMessage(msg)}
                         className={\`transition-colors cursor-pointer \${msg.status === 'unread' ? 'bg-[#FFFFFF] hover:bg-[#F5F2EA]' : 'bg-[#F0EBE0]/30 hover:bg-[#F0EBE0]/50'}\`}
                       >
                         {/* Header / Clickable row */}
                         <div className="p-4 px-6 flex items-center justify-between gap-4">
                           <div className="flex items-center gap-4 flex-1 min-w-0">
                             {/* Unread indicator */}
                             <div className="w-2 flex-shrink-0 flex justify-center">
                               {msg.status === 'unread' && <div className="w-2 h-2 rounded-full bg-[#3867FF]" />}
                             </div>
                             
                             <div className={\`w-32 md:w-48 truncate text-sm \${msg.status === 'unread' ? 'font-bold text-[#111318]' : 'font-medium text-[#4A505C]'}\`}>
                               {msg.name}
                             </div>
                             
                             <div className={\`flex-1 truncate text-sm \${msg.status === 'unread' ? 'font-semibold text-[#111318]' : 'text-[#4A505C]'}\`}>
                               {msg.subject}
                               <span className="font-normal text-[#828A9A] ml-2 hidden md:inline">
                                 - {msg.message.length > 50 ? msg.message.substring(0, 50) + '...' : msg.message}
                               </span>
                             </div>
                           </div>
                           
                           <div className={\`text-[11px] font-mono whitespace-nowrap \${msg.status === 'unread' ? 'font-bold text-[#111318]' : 'text-[#828A9A]'}\`}>
                             {new Date(msg.created_at).toLocaleDateString('vi-VN')}
                           </div>
                         </div>
                       </div>
                     )})}
                   </div>
                 )}
               </div>
            </div>
          )}`;

const replacedMessages = content.replace(oldMessagesBlockRegex, newMessagesBlock);
if (replacedMessages !== content) {
    content = replacedMessages;
} else {
    console.log("Could not find old messages block to replace using regex.");
}

// 5. Add Message Detail Modal right before Editor Modal
const editorModalStart = "{/* Editor Modal (Two-Column Workspace) */}";
const messageModalCode = `
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
                      href={\`mailto:\${viewingMessage.email}\`} 
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
                href={\`mailto:\${viewingMessage.email}?subject=Re: \${viewingMessage.subject}\`} 
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
`;

if (!content.includes('Message Detail Panel')) {
    content = content.replace(editorModalStart, messageModalCode + '\n      ' + editorModalStart);
}

fs.writeFileSync('src/app/admin/dashboard/page.js', content);
console.log('Update complete.');
