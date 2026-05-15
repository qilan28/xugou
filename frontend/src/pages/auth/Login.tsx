import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    if (location.state?.message) {
      setMessage(location.state.message);
    }
  }, [location.state]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login({ username, password });
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message);
      }
    } catch (err: any) {
      setError(err.message || t('login.error'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Flex justify="center" align="center" style={{ minHeight: 'calc(100vh - 130px)', padding: '2rem 0' }}>
        <Card className="auth-card" style={{ width: '400px', padding: '2.5rem 2rem 2rem' }}>
          <Flex direction="column" gap="4">
            <Heading align="center" size="6" mb="1">{t('login.title')}</Heading>

            {message && (
              <Text color="green" align="center" size="2" style={{
                background: 'var(--green-2)',
                padding: '8px 12px',
                borderRadius: '8px',
              }}>{message}</Text>
            )}

            {error && (
              <Text color="red" align="center" size="2" style={{
                background: 'var(--red-2)',
                padding: '8px 12px',
                borderRadius: '8px',
              }}>{error}</Text>
            )}

            <form onSubmit={handleSubmit}>
              <Flex direction="column" gap="3">
                <div className="input-wrapper">
                  <input
                    placeholder={t('login.username')}
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="text-input"
                  />
                </div>

                <div className="input-wrapper">
                  <input
                    placeholder={t('login.password')}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="text-input"
                  />
                </div>

                <Button type="submit" disabled={isLoading} style={{
                  background: 'linear-gradient(135deg, var(--accent-9), var(--accent-8))',
                  marginTop: '4px',
                }}>
                  {isLoading ? t('common.loading') : t('login.button')}
                </Button>
              </Flex>
            </form>

            <Text align="center" size="2" style={{ color: 'var(--gray-9)' }}>
              {t('register.loginLink')} <Link to="/register" style={{ color: 'var(--accent-9)', fontWeight: 600 }}>{t('register.title')}</Link>
            </Text>
          </Flex>
        </Card>
      </Flex>
    </div>
  );
};

export default Login;
