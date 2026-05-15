import { Flex, Heading, Text, Button } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: 'calc(100vh - 200px)' }} gap="3">
        <div className="not-found-404">404</div>
        <Heading size="6" mb="1">{t('notFound.title')}</Heading>
        <Text align="center" style={{ maxWidth: '500px', color: 'var(--gray-10)' }}>
          {t('notFound.message')}
        </Text>
        <Button size="3" mt="4" asChild style={{
          background: 'linear-gradient(135deg, var(--accent-9), var(--accent-8))',
          boxShadow: '0 2px 8px var(--accent-6)',
        }}>
          <Link to="/">{t('notFound.button')}</Link>
        </Button>
      </Flex>
    </div>
  );
};

export default NotFound;
