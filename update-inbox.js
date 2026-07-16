const fs = require('fs');

let content = fs.readFileSync('src/app/admin/dashboard/page.js', 'utf8');

// 1. Add state variable
if (!content.includes('const [expandedMessageId')) {
    content = content.replace(
        "const [sidebarOpen, setSidebarOpen] = useState(false);",
        "const [sidebarOpen, setSidebarOpen] = useState(false);\n  const [expandedMessageId, setExpandedMessageId] = useState(null);"
    );
}

// 2. Replace messages rendering block
const oldMessagesBlock = `                   <div className="divide-y divide-[#D6D1C4]">
                     {messages.map(msg => (
                       <div key={msg.id} className={\`p-6 transition-colors \${msg.status === 'unread' ? 'bg-[#F0EBE0]/50' : 'hover:bg-[#F0EBE0]'}\`}>
                         <div className="flex flex-col md:flex-row justify-between gap-4 mb-3">
                           <div className="flex items-start gap-3">
                             {msg.status === 'unread' && <div className="w-2 h-2 rounded-full bg-[#3867FF] mt-1.5 shadow-[0_0_8px_rgba(56,103,255,0.6)]" />}
                             <div>
                               <div className={\`text-sm \${msg.status === 'unread' ? 'font-bold text-[#111318]' : 'font-medium text-[#4A505C]'}\`}>{msg.name}</div>
                               <div className="text-xs text-[#828A9A] mt-0.5">{msg.email}</div>
                             </div>
                           </div>
                           <div className="text-[10px] text-[#828A9A] font-mono whitespace-nowrap">
                             {new Date(msg.created_at).toLocaleString('vi-VN')}
                           </div>
                         </div>
                         <div className="pl-0 md:pl-5">
                           <h4 className={\`text-sm mb-2 \${msg.status === 'unread' ? 'font-semibold text-[#111318]' : 'font-medium text-[#111318]'}\`}>{msg.subject}</h4>
                           <p className="text-sm text-[#4A505C] whitespace-pre-wrap leading-relaxed bg-[#F5F2EA] p-4 rounded border border-[#D6D1C4]">{msg.message}</p>
                           
                           <div className="flex gap-3 mt-4 pt-4 border-t border-[#D6D1C4]/50">
                             {msg.status === 'unread' && (
                               <button onClick={() => handleMarkAsRead(msg.id)} className="text-xs font-medium text-[#3867FF] hover:text-[#111318] transition-colors">Đánh dấu đã đọc</button>
                             )}
                             <a href={\`mailto:\${msg.email}?subject=Re: \${msg.subject}\`} className="text-xs font-medium text-[#4A505C] hover:text-[#111318] transition-colors">Phản hồi</a>
                             <button onClick={() => handleDeleteMessage(msg.id)} className="text-xs font-medium text-[#FF5D68] hover:text-[#111318] transition-colors ml-auto">Xóa tin nhắn</button>
                           </div>
                         </div>
                       </div>
                     ))}
                   </div>`;

const newMessagesBlock = `                   <div className="divide-y divide-[#D6D1C4]">
                     {messages.map(msg => {
                       const isExpanded = expandedMessageId === msg.id;
                       return (
                       <div key={msg.id} className={\`transition-colors \${msg.status === 'unread' && !isExpanded ? 'bg-[#FFFFFF] hover:bg-[#F5F2EA]' : 'bg-[#F0EBE0]/30 hover:bg-[#F0EBE0]/50'}\`}>
                         {/* Header / Clickable row */}
                         <div 
                           onClick={() => {
                             if (isExpanded) {
                               setExpandedMessageId(null);
                             } else {
                               setExpandedMessageId(msg.id);
                               if (msg.status === 'unread') {
                                 handleMarkAsRead(msg.id);
                               }
                             }
                           }}
                           className="p-4 px-6 flex items-center justify-between gap-4 cursor-pointer"
                         >
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
                         
                         {/* Expanded Content */}
                         {isExpanded && (
                           <div className="px-6 pb-6 pt-2 md:ml-10">
                             <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#D6D1C4]/50">
                               <div>
                                 <div className="text-sm font-semibold text-[#111318]">{msg.name}</div>
                                 <div className="text-xs text-[#828A9A]">{msg.email}</div>
                               </div>
                               <div className="text-xs text-[#828A9A] font-mono">
                                 {new Date(msg.created_at).toLocaleString('vi-VN')}
                               </div>
                             </div>
                             
                             <p className="text-sm text-[#4A505C] whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                             
                             <div className="flex gap-3 mt-6 pt-4 border-t border-[#D6D1C4]/50">
                               <a href={\`mailto:\${msg.email}?subject=Re: \${msg.subject}\`} className="px-4 py-2 bg-[#F0EBE0] hover:bg-[#D6D1C4] border border-[#D6D1C4] rounded text-sm font-medium text-[#111318] transition-colors">Phản hồi</a>
                               <button onClick={(e) => { e.stopPropagation(); handleDeleteMessage(msg.id); }} className="px-4 py-2 border border-[#FF5D68]/30 hover:bg-[#FF5D68]/10 rounded text-sm font-medium text-[#FF5D68] transition-colors ml-auto">Xóa tin nhắn</button>
                             </div>
                           </div>
                         )}
                       </div>
                     )})}
                   </div>`;

if (content.includes(oldMessagesBlock)) {
    content = content.replace(oldMessagesBlock, newMessagesBlock);
    fs.writeFileSync('src/app/admin/dashboard/page.js', content);
    console.log('Update successful.');
} else {
    console.log('Old block not found');
}
