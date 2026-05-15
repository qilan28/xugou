import { useState, useEffect, useRef } from 'react';
import { Box, Flex, Heading, Text, Card, Grid, Badge } from '@radix-ui/themes';
import { getStatusPageData, StatusAgent } from '../../api/status';
import { Monitor } from '../../api/monitors';
import ClientResourceSection from '../../components/ClientResourceSection';
import MonitorCard from '../../components/MonitorCard';
import { useTranslation } from 'react-i18next';

const cardStyles = {
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '10px',
  boxShadow: '0 1px 4px rgba(0, 0, 0, 0.04)',
  border: '1px solid var(--gray-3)',
  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
} as const;

const cardHoverStyles = {
  transform: 'translateY(-2px)',
  boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)'
} as const;

const StatusPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<{monitors: Monitor[], agents: StatusAgent[]}>({
    monitors: [],
    agents: []
  });
  const [loading, setLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState<string>(t('statusPage.title'));
  const [pageDescription, setPageDescription] = useState<string>(t('statusPage.allOperational'));
  const [error, setError] = useState<string | null>(null);
  const requestInProgressRef = useRef(false);
  const fetchControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (requestInProgressRef.current && fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }

      requestInProgressRef.current = true;
      fetchControllerRef.current = new AbortController();
      const signal = fetchControllerRef.current.signal;

      try {
        setLoading(true);
        const response = await getStatusPageData();

        if (signal.aborted) {
          return;
        }

        if (response.success && response.data) {
          const statusData = response.data;

          setPageTitle(statusData.title || t('statusPage.title'));
          setPageDescription(statusData.description || t('statusPage.allOperational'));

          setData({
            monitors: statusData.monitors || [],
            agents: statusData.agents || []
          });
        } else {
          setError(response.message || t('statusPage.fetchError'));
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          setError(t('statusPage.fetchError'));
        }
      } finally {
        requestInProgressRef.current = false;
        fetchControllerRef.current = null;
        setLoading(false);
      }
    };

    fetchData();

    const intervalId = setInterval(() => {
      fetchData();
    }, 60000);

    return () => {
      clearInterval(intervalId);
      if (fetchControllerRef.current) {
        fetchControllerRef.current.abort();
      }
    };
  }, [t]);

  if (error) {
    return (
      <Box>
        <div className="page-container">
          <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
            <Text size="3" style={{ color: 'var(--red-9)' }}>{error}</Text>
          </Flex>
        </div>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box>
        <div className="page-container">
          <Flex justify="center" align="center" style={{ minHeight: '50vh' }}>
            <Text size="3" style={{ color: 'var(--gray-9)' }}>{t('common.loading')}</Text>
          </Flex>
        </div>
      </Box>
    );
  }

  const allUp = data.monitors.every(m => m.status === 'up') && data.agents.every(a => a.status === 'active');
  const statusBadgeColor = allUp ? 'green' : 'amber';

  return (
    <Box>
      {/* 状态页标题区域 */}
      <Box className="status-page-header">
        <div className="page-container">
          <Flex direction="column" align="center" justify="center" py="9" gap="4">
            <Badge size="2" color={statusBadgeColor as any} style={{
              padding: '4px 14px',
              borderRadius: '12px',
              fontSize: '13px',
            }}>
              {allUp ? t('statusPage.allOperational') : t('statusPage.someIssues')}
            </Badge>
            <Heading size="9" align="center">{pageTitle}</Heading>
            <Text size="5" align="center" style={{ maxWidth: '800px', color: 'var(--gray-10)' }}>
              {pageDescription}
            </Text>
            <Badge size="2" color="gray" variant="soft" style={{ borderRadius: '8px' }}>
              {t('statusPage.lastUpdated')}: {t('statusPage.justNow')}
            </Badge>
          </Flex>
        </div>
      </Box>

      <div className="page-container">
        {/* API服务状态 */}
        {data.monitors.length > 0 && (
          <Box py="6">
            <Heading size="5" mb="4" className="dashboard-section-title">{t('statusPage.apiServices')}</Heading>
            <Grid columns={{ initial: '1', md: '2' }} gap="4">
              {data.monitors.map(monitor => (
                <MonitorCard key={monitor.id} monitor={monitor} />
              ))}
            </Grid>
          </Box>
        )}

        {/* 客户端监控状态 */}
        {data.agents.length > 0 && (
          <Box py="6">
            <Heading size="5" mb="4" className="dashboard-section-title">{t('statusPage.agentStatus')}</Heading>
            <Grid columns={{ initial: '1', md: '2', lg: '3' }} gap="4">
              {data.agents.map(agent => (
                <Card
                  key={agent.id}
                  style={cardStyles}
                  className="agent-card"
                  onMouseEnter={(e) => {
                    Object.assign(e.currentTarget.style, cardHoverStyles);
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = '';
                    e.currentTarget.style.boxShadow = cardStyles.boxShadow as string;
                  }}
                >
                  <Box style={{
                    position: 'absolute',
                    top: '0',
                    left: '0',
                    width: '3px',
                    height: '100%',
                    background: agent.status === 'active'
                      ? 'linear-gradient(to bottom, var(--green-8), var(--green-9), var(--cyan-8))'
                      : 'linear-gradient(to bottom, var(--gray-6), var(--gray-7))',
                    borderRadius: '0 2px 2px 0',
                  }} />

                  <Box p="4" pl="5">
                    <Flex justify="between" align="start" mb="3">
                      <Box>
                        <Heading as="h3" size="3" mb="1">{agent.name}</Heading>
                        <Text as="div" size="2" color="gray">
                          {agent.hostname}
                          {agent.ip_address && ` (${agent.ip_address})`}
                        </Text>
                      </Box>
                      <Badge
                        color={agent.status === 'active' ? 'green' : 'gray'}
                        style={{
                          padding: '2px 10px',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '12px',
                        }}
                      >
                        <Box
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: agent.status === 'active' ? 'var(--green-9)' : 'var(--gray-7)',
                            animation: agent.status === 'active' ? 'pulse 2s infinite' : 'none',
                            boxShadow: agent.status === 'active' ? '0 0 4px var(--green-6)' : 'none',
                          }}
                        />
                        {agent.status === 'active' ? t('agent.status.online') : t('agent.status.offline')}
                      </Badge>
                    </Flex>

                    <Box mt="3">
                      {(agent.cpu !== undefined && agent.memory !== undefined) ? (
                        <ClientResourceSection
                          cpuUsage={agent.cpu || 0}
                          memoryUsage={agent.memory || 0}
                          diskUsage={agent.disk || 0}
                          networkRx={agent.network_rx || 0}
                          networkTx={agent.network_tx || 0}
                        />
                      ) : (
                        <Box style={{
                          padding: '12px',
                          backgroundColor: 'var(--gray-1)',
                          borderRadius: '8px',
                          border: '1px solid var(--gray-3)',
                        }}>
                          <Heading size="2" mb="2">{t('agent.systemInfo')}</Heading>
                          <Grid columns="2" gap="2">
                            <Text size="2" style={{ color: 'var(--gray-9)' }}>{t('agent.os')}:</Text>
                            <Text size="2">{agent.os || t('common.unknown')}</Text>

                            <Text size="2" style={{ color: 'var(--gray-9)' }}>{t('agent.version')}:</Text>
                            <Text size="2">{agent.version || t('common.unknown')}</Text>

                            <Text size="2" style={{ color: 'var(--gray-9)' }}>{t('agent.hostname')}:</Text>
                            <Text size="2">{agent.hostname || t('common.unknown')}</Text>

                            <Text size="2" style={{ color: 'var(--gray-9)' }}>{t('agent.ipAddress')}:</Text>
                            <Text size="2">{agent.ip_address || t('common.unknown')}</Text>
                          </Grid>
                        </Box>
                      )}
                    </Box>

                    {agent.updated_at && (
                      <Text size="2" color="gray" mt="2" as="div">
                        {t('agent.lastUpdated')}: {new Date(agent.updated_at).toLocaleString()}
                      </Text>
                    )}
                  </Box>
                </Card>
              ))}
            </Grid>
          </Box>
        )}
      </div>
    </Box>
  );
};

export default StatusPage;
