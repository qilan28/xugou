import { useState, useEffect } from 'react';
import { Box, Flex, Heading, Text, Grid, Button, Container, Theme } from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon, ClockIcon, GlobeIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Link } from 'react-router-dom';
import { getAllMonitors, Monitor } from '../api/monitors';
import { getAllAgents, Agent } from '../api/agents';
import StatusSummaryCard from '../components/StatusSummaryCard';
import MonitorCard from '../components/MonitorCard';
import AgentCard from '../components/AgentCard';
import '../styles/components.css';
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const [monitors, setMonitors] = useState<Monitor[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [monitorsResponse, agentsResponse] = await Promise.all([
          getAllMonitors(),
          getAllAgents()
        ]);

        if (monitorsResponse.success && monitorsResponse.monitors) {
          setMonitors(monitorsResponse.monitors);
        } else {
          console.error('获取监控数据失败:', monitorsResponse.message);
        }

        if (agentsResponse.success && agentsResponse.agents) {
          setAgents(agentsResponse.agents);
        } else {
          console.error('获取客户端数据失败:', agentsResponse.message);
        }
      } catch (err) {
        console.error('获取数据错误:', err);
        setError(t('common.error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => clearInterval(intervalId);
  }, [t]);

  if (loading) {
    return (
      <Box className="dashboard-container">
        <Container size="3">
          <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
            <Text size="3" style={{ color: 'var(--gray-9)' }}>{t('common.loading')}</Text>
          </Flex>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="dashboard-container">
        <Container size="3">
          <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
            <Flex direction="column" align="center" gap="3">
              <Text size="3" style={{ color: 'var(--red-9)' }}>{error}</Text>
              <Button variant="soft" onClick={() => window.location.reload()}>
                {t('dashboard.refresh')}
              </Button>
            </Flex>
          </Flex>
        </Container>
      </Box>
    );
  }

  const apiMonitorItems = [
    {
      icon: <CheckCircledIcon width="16" height="16" />,
      label: t('monitors.status.up'),
      value: monitors.filter(m => m.status === 'up').length,
      bgColor: 'var(--green-3)',
      iconColor: 'var(--green-9)'
    },
    {
      icon: <CrossCircledIcon width="16" height="16" />,
      label: t('monitors.status.down'),
      value: monitors.filter(m => m.status === 'down').length,
      bgColor: 'var(--red-3)',
      iconColor: 'var(--red-9)'
    },
    {
      icon: <ClockIcon width="16" height="16" />,
      label: t('dashboard.totalMonitors'),
      value: monitors.length,
      bgColor: 'var(--gray-3)',
      iconColor: 'var(--gray-9)'
    }
  ];

  const agentStatusItems = [
    {
      icon: <GlobeIcon width="16" height="16" />,
      label: t('agent.status.online'),
      value: agents.filter(a => a.status === 'active').length,
      bgColor: 'var(--green-3)',
      iconColor: 'var(--green-9)'
    },
    {
      icon: <ExclamationTriangleIcon width="16" height="16" />,
      label: t('agent.status.offline'),
      value: agents.filter(a => a.status === 'inactive').length,
      bgColor: 'var(--amber-3)',
      iconColor: 'var(--amber-9)'
    },
    {
      icon: <GlobeIcon width="16" height="16" />,
      label: t('dashboard.totalMonitors'),
      value: agents.length,
      bgColor: 'var(--gray-3)',
      iconColor: 'var(--gray-9)'
    }
  ];

  return (
    <Theme appearance="light" accentColor="blue">
      <Box className="dashboard-container">
        <Container size="3" py="5">
          <Box>
            {/* 状态摘要 */}
            <Box pb="6">
              <Heading size="6" mb="1">{t('dashboard.summary')}</Heading>
              <Text size="2" mb="5" as="div" style={{ color: 'var(--gray-9)' }}>
                {t('dashboard.summary')}
              </Text>

              <Flex gap="4" justify="between" direction={{ initial: 'column', sm: 'row' }} style={{ width: '100%' }} mt="4">
                <Box style={{ flex: 1 }}>
                  <StatusSummaryCard title={t('navbar.apiMonitors')} items={apiMonitorItems} />
                </Box>
                <Box style={{ flex: 1 }}>
                  <StatusSummaryCard title={t('navbar.agentMonitors')} items={agentStatusItems} />
                </Box>
              </Flex>
            </Box>

            {/* API监控状态 */}
            <Box py="5">
              <Flex justify="between" align="center" mb="4">
                <Heading size="5" className="dashboard-section-title">{t('navbar.apiMonitors')}</Heading>
                <Button variant="soft" asChild>
                  <Link to="/monitors">{t('monitors.title')}</Link>
                </Button>
              </Flex>
              {monitors.length === 0 ? (
                <Flex direction="column" align="center" py="6" gap="3" style={{
                  background: 'var(--gray-1)',
                  borderRadius: '12px',
                  border: '1px dashed var(--gray-4)',
                }}>
                  <Text size="2" style={{ color: 'var(--gray-9)' }}>{t('monitors.title')}</Text>
                  <Button variant="soft" asChild size="2">
                    <Link to="/monitors/create">{t('monitors.create')}</Link>
                  </Button>
                </Flex>
              ) : (
                <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4">
                  {monitors.slice(0, 3).map(monitor => (
                    <MonitorCard key={monitor.id} monitor={monitor} />
                  ))}
                </Grid>
              )}
            </Box>

            {/* 客户端状态 */}
            <Box py="5">
              <Flex justify="between" align="center" mb="4">
                <Heading size="5" className="dashboard-section-title">{t('navbar.agentMonitors')}</Heading>
                <Button variant="soft" asChild>
                  <Link to="/agents">{t('agents.title')}</Link>
                </Button>
              </Flex>
              {agents.length === 0 ? (
                <Flex direction="column" align="center" py="6" gap="3" style={{
                  background: 'var(--gray-1)',
                  borderRadius: '12px',
                  border: '1px dashed var(--gray-4)',
                }}>
                  <Text size="2" style={{ color: 'var(--gray-9)' }}>{t('agents.title')}</Text>
                  <Button variant="soft" asChild size="2">
                    <Link to="/agents/create">{t('agents.create')}</Link>
                  </Button>
                </Flex>
              ) : (
                <Grid columns={{ initial: '1', sm: '2', lg: '3' }} gap="4">
                  {agents.slice(0, 3).map((agent) => (
                    <AgentCard key={agent.id} agent={agent} />
                  ))}
                </Grid>
              )}
            </Box>
          </Box>
        </Container>
      </Box>
    </Theme>
  );
};

export default Dashboard;
