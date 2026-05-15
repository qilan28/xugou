import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError(t('register.error.passwordMismatch')); return; }
    setIsLoading(true);
    try {
      const result = await register({ username, password, email });
      if (result.success) {
        navigate('/login', { state: { message: t('register.success.message') } });
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || t('register.error.usernameExists'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 flex items-center justify-center min-h-[calc(100vh-130px)]">
      <div className="w-full glass p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
        <h2 className="text-2xl font-bold text-center mb-6 text-slate-900 dark:text-white">{t('register.title')}</h2>

        {error && <div className="bg-red-500/10 text-red-500 text-sm px-4 py-2 rounded-lg mb-4 text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input placeholder={t('register.username')} value={username} onChange={e => setUsername(e.target.value)}
            required className="input-modern" />
          <input placeholder={t('register.email')} type="email" value={email} onChange={e => setEmail(e.target.value)}
            required className="input-modern" />
          <input placeholder={t('register.password')} type="password" value={password} onChange={e => setPassword(e.target.value)}
            required className="input-modern" />
          <input placeholder={t('register.confirmPassword')} type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            required className="input-modern" />
          <button type="submit" disabled={isLoading}
            className="btn-gradient py-2.5 text-sm mt-1 disabled:opacity-60">
            {isLoading ? t('common.loading') : t('register.button')}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500 mt-5">
          {t('register.loginLink')} <Link to="/login" className="text-blue-500 hover:text-blue-400 font-semibold">{t('navbar.login')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
