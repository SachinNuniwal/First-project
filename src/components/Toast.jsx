import { useEffect } from 'react';

export default function Toast({ message, onHide }) {
    useEffect(() => {
        if (!message) return;
        const t = setTimeout(onHide, 3000);
        return () => clearTimeout(t);
    }, [message, onHide]);

    if (!message) return null;

    return (
        <div className="fixed bottom-6 right-6 bg-[#1c2333] border border-cyan-400 text-[#e6edf3] px-4 py-3 rounded-xl text-[13px] z-[9999] shadow-2xl animate-[slideUp_0.3s_ease]">
            {message}
        </div>
    );
}