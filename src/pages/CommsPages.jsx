import { useState } from 'react';

export function MessagesPage({ conversations, onSend, onNewMsg, showToast }) {
    const [active, setActive] = useState(0);
    const [text, setText] = useState('');
    const [newRecip, setNewRecip] = useState('');
    const [newBody, setNewBody] = useState('');

    return (
        <div className="flex gap-4 h-[calc(100vh-140px)]">
            {/* Sidebar */}
            <div className="w-64 bg-[#161b22] rounded-xl border border-[#30363d] flex flex-col overflow-hidden">
                <div className="p-3 border-b border-[#30363d] text-[11px] font-bold text-[#8b949e] uppercase tracking-wider">Conversations</div>
                <div className="flex-1 overflow-y-auto">
                    {conversations.map((c, i) => (
                        <div key={c.id} onClick={() => setActive(i)}
                            className={`p-3 cursor-pointer border-b border-[#30363d] hover:bg-[#1c2128] transition-colors ${active === i ? 'bg-[#1c2128] border-l-2 border-l-cyan-400' : ''}`}>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-xs font-bold">
                                    {c.name[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-[12px] font-semibold truncate">{c.name}</div>
                                    <div className="text-[10px] text-[#8b949e] truncate">{c.last}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat area */}
            <div className="flex-1 bg-[#161b22] rounded-xl border border-[#30363d] flex flex-col overflow-hidden">
                {conversations.length > 0 ? (
                    <>
                        <div className="p-3 border-b border-[#30363d] font-semibold">{conversations[active]?.name}</div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {conversations[active]?.msgs.map((m, i) => (
                                <div key={i} className={`flex ${m.sent ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-xs px-3 py-2 rounded-xl text-[12px] ${m.sent ? 'bg-cyan-500/20 text-cyan-300' : 'bg-[#21262d] text-[#e6edf3]'}`}>
                                        {m.text}
                                        <div className="text-[10px] text-[#8b949e] mt-1">{m.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-3 border-t border-[#30363d] flex gap-2">
                            <input value={text} onChange={e => setText(e.target.value)}
                                onKeyDown={e => { if (e.key === 'Enter' && text.trim()) { onSend(active, text.trim()); setText(''); } }}
                                placeholder="Type a message..." className="flex-1 bg-[#21262d] border border-[#30363d] rounded-lg px-3 py-2 text-[12px] outline-none focus:border-cyan-400" />
                            <button onClick={() => { if (text.trim()) { onSend(active, text.trim()); setText(''); } }}
                                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg text-[12px] font-semibold transition-colors">Send</button>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center text-[#8b949e]">No conversations yet</div>
                )}
            </div>
        </div>
    );
}

export function SettingsPage({ profile, onSave, showToast }) {
    const [form, setForm] = useState({ ...profile });

    return (
        <div className="max-w-xl space-y-4">
            <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-5">
                <div className="text-[14px] font-bold mb-4" style={{ fontFamily: 'Rajdhani, sans-serif' }}>⚙️ General Settings</div>
                {[['Full Name', 'name'], ['Designation', 'desig'], ['Email', 'email'], ['Phone', 'phone']].map(([label, key]) => (
                    <div key={key} className="mb-3">
                        <label className="text-[11px] text-[#8b949e] uppercase tracking-wider block mb-1">{label}</label>
                        <input value={form[key] || ''} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
                            className="w-full bg-[#21262d] border border-[#30363d] rounded-lg px-3 py-2 text-[12px] outline-none focus:border-cyan-400" />
                    </div>
                ))}
                <button onClick={() => { onSave(form); showToast('✅ Settings saved!'); }}
                    className="mt-2 px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-black rounded-lg text-[12px] font-semibold transition-colors">
                    💾 Save Changes
                </button>
            </div>
        </div>
    );
}