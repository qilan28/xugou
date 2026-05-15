import { Box, Flex, Heading, Text, Button, Card, Grid } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { ActivityLogIcon, LightningBoltIcon, MixerHorizontalIcon, DesktopIcon, GitHubLogoIcon } from '@radix-ui/react-icons';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

const iconStyles = [
  { bg: 'var(--blue-3)', color: 'var(--blue-9)' },
  { bg: 'var(--green-3)', color: 'var(--green-9)' },
  { bg: 'var(--amber-3)', color: 'var(--amber-9)' },
  { bg: 'var(--indigo-3)', color: 'var(--indigo-9)' },
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();

  const features = [
    { icon: <ActivityLogIcon width="24" height="24" />, title: t('home.features.monitoring'), desc: t('home.features.monitoring.desc') },
    { icon: <DesktopIcon width="24" height="24" />, title: t('home.features.dashboard'), desc: t('home.features.dashboard.desc') },
    { icon: <LightningBoltIcon width="24" height="24" />, title: t('home.features.alerts'), desc: t('home.features.alerts.desc') },
    { icon: <MixerHorizontalIcon width="24" height="24" />, title: t('home.features.statusPage'), desc: t('home.features.statusPage.desc') },
  ];

  return (
    <Box>
      {/* 英雄区域 */}
      <Box className="hero-section">
        <div className="page-container">
          <Flex direction="column" align="center" justify="center" py="9" gap="5">
            <Heading size="9" align="center">
              {t('home.title')}
            </Heading>
            <Text size="5" align="center" style={{ maxWidth: '800px', color: 'var(--gray-10)' }}>
              {t('home.subtitle')}
            </Text>

            <Flex justify="center" py="2">
              <a href="https://github.com/zaunist/xugou" target="_blank" rel="noopener noreferrer"
                style={{ color: 'var(--gray-11)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--gray-12)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--gray-11)'}
              >
                <GitHubLogoIcon width="28" height="28" />
              </a>
            </Flex>

            <Flex gap="4" mt="4">
              {isAuthenticated ? (
                <Button size="3" asChild style={{
                  background: 'linear-gradient(135deg, var(--accent-9), var(--accent-8))',
                  boxShadow: '0 2px 8px var(--accent-6)',
                }}>
                  <Link to="/dashboard">{t('home.getStarted')}</Link>
                </Button>
              ) : (
                <>
                  <Button size="3" asChild style={{
                    background: 'linear-gradient(135deg, var(--accent-9), var(--accent-8))',
                    boxShadow: '0 2px 8px var(--accent-6)',
                  }}>
                    <Link to="/login">{t('home.getStarted')}</Link>
                  </Button>
                  <Button size="3" variant="outline" asChild style={{ borderColor: 'var(--gray-6)' }}>
                    <a href="https://github.com/zaunist/xugou" target="_blank" rel="noopener noreferrer">{t('home.learnMore')}</a>
                  </Button>
                </>
              )}
            </Flex>
          </Flex>
        </div>
      </Box>

      {/* 特性区域 */}
      <Box py="9">
        <div className="page-container">
          <Heading size="6" mb="2" align="center">
            {t('home.features.title')}
          </Heading>
          <Text size="3" align="center" mb="6" as="div" style={{ color: 'var(--gray-9)' }}>
            {t('home.subtitle')}
          </Text>
          <Grid columns={{ initial: '1', sm: '2', md: '4' }} gap="5" mt="5">
            {features.map((feature, idx) => (
              <Card key={idx} className="feature-card" size="3">
                <Flex direction="column" gap="3" align="center" p="4">
                  <Box className="feature-icon-circle" style={{
                    background: `linear-gradient(135deg, ${iconStyles[idx].bg}, transparent)`,
                    color: iconStyles[idx].color,
                  }}>
                    {feature.icon}
                  </Box>
                  <Heading size="4" align="center">{feature.title}</Heading>
                  <Text align="center" size="2" style={{ color: 'var(--gray-10)' }}>
                    {feature.desc}
                  </Text>
                </Flex>
              </Card>
            ))}
          </Grid>
        </div>
      </Box>
    </Box>
  );
};

export default Home;
