// ===== BADGE =====
export const Badge = ({ color = 'cyan', children, className = '' }) => {
    const colors = {
        green: 'bg-green-500/15 text-green-400 border border-green-500/30',
        red: 'bg-red-500/15 text-red-400 border border-red-500/30',
        orange: 'bg-orange-500/15 text-orange-400 border border-orange-500/30',
        cyan: 'bg-cyan-500/12 text-cyan-400 border border-cyan-500/25',
        gold: 'bg-yellow-500/12 text-yellow-400 border border-yellow-500/25',
        purple: 'bg-purple-500/12 text-purple-400 border border-purple-500/25',
    };
    return (
        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold whitespace-nowrap ${colors[color] || colors.cyan} ${className}`}>
            {children}
        </span>
    );
};

// ===== BUTTON =====
export const Btn = ({ variant = 'primary', size = 'md', onClick, children, className = '', disabled = false }) => {
    const variants = {
        primary: 'bg-cyan-400 text-black hover:opacity-85',
        outline: 'bg-transparent border border-[#30363d] text-[#8b949e] hover:border-cyan-400 hover:text-cyan-400',
        success: 'bg-green-500/15 text-green-400 border border-green-500/30 hover:opacity-85',
        danger: 'bg-red-500/15 text-red-400 border border-red-500/30 hover:opacity-85',
        gold: 'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30 hover:opacity-85',
    };
    const sizes = {
        xs: 'px-2 py-1 text-[10px]',
        sm: 'px-3 py-1.5 text-[11px]',
        md: 'px-4 py-2 text-[12px]',
    };
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`inline-flex items-center gap-1 rounded-lg font-semibold cursor-pointer transition-all duration-150 ${variants[variant]} ${sizes[size]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {children}
        </button>
    );
};

// ===== CARD =====
export const Card = ({ children, className = '', style = {} }) => (
    <div className={`rounded-xl p-4 ${className}`} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-primary)', ...style }}>
        {children}
    </div>
);

// ===== CARD TITLE =====
export const CardTitle = ({ children, className = '' }) => (
    <div className={`font-bold text-sm mb-3 flex items-center gap-1.5 ${className}`} style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>
        {children}
    </div>
);

// ===== STAT CARD =====
export const StatCard = ({ icon, value, label, change, changeType, color = '#00d4ff' }) => (
    <div className="rounded-xl p-4 text-center" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}>
        <div className="text-[22px] mb-1.5">{icon}</div>
        <div className="text-[26px] font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color }}>{value}</div>
        <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted-text)' }}>{label}</div>
        {change && (
            <div className={`text-[10px] mt-1 ${changeType === 'up' ? 'text-green-400' : 'text-red-400'}`}>{change}</div>
        )}
    </div>
);

// ===== FORM INPUT =====
export const Input = ({ value, onChange, placeholder, type = 'text', className = '', readOnly = false }) => (
    <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 transition-all ${readOnly ? 'opacity-60' : ''} ${className}`}
        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--input-text)' }}
    />
);

// ===== SELECT =====
export const Select = ({ value, onChange, children, className = '' }) => (
    <select
        value={value}
        onChange={onChange}
        className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none focus:border-cyan-400 cursor-pointer ${className}`}
        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--input-text)' }}
    >
        {children}
    </select>
);

// ===== TEXTAREA =====
export const Textarea = ({ value, onChange, placeholder, className = '' }) => (
    <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-lg px-3 py-2 text-[13px] outline-none focus:border-cyan-400 resize-y min-h-[80px] transition-all ${className}`}
        style={{ background: 'var(--input-bg)', border: '1px solid var(--input-border)', color: 'var(--input-text)' }}
    />
);

// ===== FORM GROUP =====
export const FormGroup = ({ label, children }) => (
    <div className="mb-3">
        {label && <div className="text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: 'var(--muted-text)' }}>{label}</div>}
        {children}
    </div>
);

// ===== MODAL =====
export const Modal = ({ id, open, onClose, title, children, size = 'md' }) => {
    if (!open) return null;
    const sizes = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl' };
    return (
        <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[999] flex items-center justify-center p-5"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className={`rounded-2xl p-6 w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`} style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)', color: 'var(--text-primary)' }}>
                <div className="text-lg font-bold mb-5" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>{title}</div>
                {children}
            </div>
        </div>
    );
};

// ===== MODAL FOOTER =====
export const ModalFooter = ({ children }) => (
    <div className="flex gap-2 justify-end mt-5">{children}</div>
);

// ===== SEARCH BAR =====
export const SearchBar = ({ value, onChange, placeholder }) => (
    <div className="flex items-center gap-2 rounded-lg px-3 py-2 mb-3.5" style={{ background: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
        <span>🔍</span>
        <input
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-transparent border-none text-[13px] flex-1 outline-none"
            style={{ color: 'var(--text-primary)' }}
        />
    </div>
);

// ===== SECTION HEADER =====
export const SectionHeader = ({ title, subtitle, children }) => (
    <div className="flex items-start justify-between mb-5">
        <div>
            <div className="text-xl font-bold" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)' }}>{title}</div>
            <div className="text-[11px] mt-0.5" style={{ color: 'var(--muted-text)' }}>{subtitle}</div>
        </div>
        <div className="flex gap-2">{children}</div>
    </div>
);

// ===== TABS =====
export const Tabs = ({ tabs, activeTab, onChange }) => (
    <div className="flex border-b mb-4 overflow-x-auto" style={{ borderColor: 'var(--card-border)' }}>
        {tabs.map(tab => (
            <button
                key={tab.key}
                onClick={() => onChange(tab.key)}
                className={`px-4 py-2 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-all ${activeTab === tab.key
                        ? 'text-cyan-400 border-cyan-400'
                        : 'border-transparent hover:text-cyan-300'
                    }`}
                style={{ color: activeTab === tab.key ? undefined : 'var(--muted-text)' }}
            >
                {tab.label}
            </button>
        ))}
    </div>
);

// ===== PROGRESS BAR =====
export const ProgressBar = ({ value, color = '#00d4ff', height = 6 }) => (
    <div className="rounded-full overflow-hidden" style={{ height, background: 'var(--card-bg)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, value)}%`, background: color }} />
    </div>
);

// ===== CHAT BUBBLE =====
export const ChatBubble = ({ msg }) => (
    <div className={`max-w-[75%] px-3 py-2 rounded-xl text-[12px] leading-relaxed ${msg.sent
            ? 'border self-end rounded-br-sm ml-auto'
            : 'border self-start rounded-bl-sm'
        }`} style={{ background: msg.sent ? 'rgba(56,189,248,0.15)' : 'var(--card-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}>
        {msg.text}
        <div className="text-[10px] mt-1 text-right" style={{ color: 'var(--muted-text)' }}>{msg.time}</div>
    </div>
);

// ===== TABLE WRAPPER =====
export const TableWrap = ({ children }) => (
    <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ color: 'var(--text-primary)' }}>{children}</table>
    </div>
);

export const THead = ({ cols }) => (
    <thead>
        <tr>
            {cols.map((c, i) => (
                <th key={i} className="text-left px-2.5 py-2 text-[11px] font-bold uppercase tracking-wide whitespace-nowrap" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--muted-text)', borderBottom: '1px solid var(--card-border)' }}>
                    {c}
                </th>
            ))}
        </tr>
    </thead>
);

export const TRow = ({ children }) => (
    <tr style={{ borderBottom: '1px solid var(--card-border)' }} className="last:border-0 transition-colors hover:bg-[var(--hover-bg)]">{children}</tr>
);

export const TD = ({ children, className = '' }) => (
    <td className={`px-2.5 py-2.5 text-[12px] align-middle ${className}`} style={{ color: 'var(--text-primary)' }}>{children}</td>
);