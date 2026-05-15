import { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 transition-all">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2"/></svg>
        {currentLanguage === 'zh-CN' ? '中文' : 'EN'}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-32 z-20 glass py-1 animate-fade-in">
            <button onClick={() => { changeLanguage('zh-CN'); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                currentLanguage === 'zh-CN' ? 'text-blue-500 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
              中文 {currentLanguage === 'zh-CN' && <span className="text-blue-500">✓</span>}
            </button>
            <button onClick={() => { changeLanguage('en-US'); setOpen(false); }}
              className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-white/5 transition-colors ${
                currentLanguage === 'en-US' ? 'text-blue-500 font-semibold' : 'text-slate-700 dark:text-slate-300'}`}>
              English {currentLanguage === 'en-US' && <span className="text-blue-500">✓</span>}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default LanguageSelector;
