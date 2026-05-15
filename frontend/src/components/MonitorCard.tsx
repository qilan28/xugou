import { Box, Card, Flex, Text, Badge } from '@radix-ui/themes';
import { CheckCircledIcon, CrossCircledIcon, QuestionMarkCircledIcon } from '@radix-ui/react-icons';
import { Monitor } from '../api/monitors';
import HeartbeatGrid from './HeartbeatGrid';
import '../styles/components.css';
import { useTranslation } from 'react-i18next';

interface MonitorCardProps {
  monitor: Monitor;
}

const MonitorCard = ({ monitor }: MonitorCardProps) => {
  const { t } = useTranslation();

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'up':
        return <CheckCircledIcon width="16" height="16" color="var(--green-9)" />;
      case 'pending':
        return <QuestionMarkCircledIcon width="16" height="16" color="var(--amber-9)" />;
      case 'down':
      default:
        return <CrossCircledIcon width="16" height="16" color="var(--red-9)" />;
    }
  };

  const statusColors: { [key: string]: string } = {
    'up': 'green',
    'down': 'red',
    'pending': 'amber'
  };

  const statusText: { [key: string]: string } = {
    'up': t('monitorCard.status.up'),
    'down': t('monitorCard.status.down'),
    'pending': t('monitorCard.status.pending')
  };

  const currentStatus = monitor.status || 'pending';

  return (
    <Card className={`monitor-card status-${currentStatus}`}>
      <Flex justify="between" align="start" p="4" gap="2" direction="column">
        <Flex justify="between" align="center" style={{ width: '100%' }}>
          <Flex align="center" gap="2">
            <StatusIcon status={currentStatus} />
            <Text weight="medium">{monitor.name}</Text>
          </Flex>
          <Badge color={statusColors[currentStatus] as any} style={{
            borderRadius: '10px',
            padding: '2px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '12px',
          }}>
            <Box style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: currentStatus === 'up' ? 'var(--green-9)' : currentStatus === 'down' ? 'var(--red-9)' : 'var(--amber-9)',
              animation: currentStatus === 'up' ? 'pulse 2s infinite' : 'none',
            }} />
            {statusText[currentStatus]}
          </Badge>
        </Flex>

        <Flex align="center" gap="2" style={{ width: '100%', minHeight: '8px' }}>
          <Text size="1" color="gray">
            {t('monitorCard.responseTime')}: {monitor.response_time || t('monitorCard.unknown')}ms
          </Text>
        </Flex>

        <Box pt="2" style={{ width: '100%' }}>
          <HeartbeatGrid
            uptime={monitor.uptime}
            history={monitor.history}
          />
        </Box>
      </Flex>
    </Card>
  );
};

export default MonitorCard;
