import { ReactNode } from 'react';
import Navbar from './Navbar';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const currentYear = new Date().getFullYear();
  const { t } = useTranslation();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1 w-full animate-fade-in">
        {children}
      </main>
      <footer className="w-full py-4 mt-auto border-t border-white/[0.06]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col items-center gap-2 py-3">
            <span className="text-xs text-slate-500">
              {t('footer.copyright', { year: currentYear })}
            </span>
            <div className="flex gap-4">
              <a href="https://zaunist.com" target="_blank" rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-blue-400 transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"/></svg>
                {t('footer.blog')}
              </a>
              <a href="https://www.youtube.com/@zaunist" target="_blank" rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2.3C.172 2.3 0 3.174 0 10s.172 7.7 10 7.7 10-.874 10-7.7-.172-7.7-10-7.7zm3.205 8.034l-4.49 2.615c-.3.175-.715-.037-.715-.373V6.424c0-.336.415-.548.715-.373l4.49 2.615c.3.175.3.593 0 .768z"/></svg>
                {t('footer.youtube')}
              </a>
              <a href="https://mail.mdzz.uk" target="_blank" rel="noopener noreferrer"
                className="text-xs text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                {t('footer.tempMail')}
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
