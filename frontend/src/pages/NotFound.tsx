import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-lg mx-auto px-4 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center gap-4">
      <div className="text-[10rem] font-black leading-none bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
        404
      </div>
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('notFound.title')}</h2>
      <p className="text-slate-500 dark:text-slate-400 max-w-md">{t('notFound.message')}</p>
      <Link to="/" className="btn-gradient px-8 py-3 mt-4 animate-glow">
        {t('notFound.button')}
      </Link>
    </div>
  );
};

export default NotFound;
