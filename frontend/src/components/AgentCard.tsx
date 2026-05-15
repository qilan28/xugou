import { Box, Card, Flex, Text, Badge } from '@radix-ui/themes';
import { GlobeIcon } from '@radix-ui/react-icons';
import { Agent } from '../api/agents';
import ClientResourceSection from './ClientResourceSection';
import '../styles/components.css';
import { useTranslation } from 'react-i18next';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const { t } = useTranslation();

  let cpuUsage = 0;
  let memoryUsage = 0;
  let diskUsage = 0;
  let networkRx = 0;
  let networkTx = 0;

  try {
    if (agent.cpu_usage !== null && agent.memory_total && agent.memory_used && agent.disk_total && agent.disk_used) {
      cpuUsage = Math.round(agent.cpu_usage);
      memoryUsage = Math.round((agent.memory_used / agent.memory_total) * 100);
      diskUsage = Math.round((agent.disk_used / agent.disk_total) * 100);
      networkRx = agent.network_rx || 0;
      networkTx = agent.network_tx || 0;
    }
  } catch (e) {
    console.error(t('agentCard.resourceError'), e);
  }

  const agentStatus = agent.status || 'inactive';

  const statusColors: { [key: string]: string } = {
    'active': 'green',
    'inactive': 'gray',
    'connecting': 'amber'
  };

  const statusText: { [key: string]: string } = {
    'active': t('agentCard.status.active'),
    'inactive': t('agentCard.status.inactive'),
    'connecting': t('agentCard.status.connecting')
  };

  const statusBarClass = agentStatus === 'active' ? 'status-bar-active' : agentStatus === 'connecting' ? 'status-bar-connecting' : 'status-bar-inactive';

  return (
    <Card className="agent-card">
      <Box className={statusBarClass} />
      <Box p="4" pl="5">
        <Flex justify="between" align="center" mb="3">
          <Flex direction="column" gap="1">
            <Flex align="center" gap="2">
              <Box style={{ color: agentStatus === 'active' ? 'var(--green-9)' : 'var(--gray-9)' }}>
                <GlobeIcon width="16" height="16" />
              </Box>
              <Text weight="medium">{agent.name}</Text>
            </Flex>
          </Flex>
          <Badge color={statusColors[agentStatus] as any} style={{
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
              backgroundColor: agentStatus === 'active' ? 'var(--green-9)' : agentStatus === 'connecting' ? 'var(--amber-9)' : 'var(--gray-7)',
              animation: agentStatus === 'active' ? 'pulse 2s infinite' : agentStatus === 'connecting' ? 'breathe 1.5s infinite' : 'none',
              boxShadow: agentStatus === 'active' ? '0 0 4px var(--green-6)' : 'none',
            }} />
            {statusText[agentStatus] || agentStatus}
          </Badge>
        </Flex>

        <ClientResourceSection
          cpuUsage={cpuUsage}
          memoryUsage={memoryUsage}
          diskUsage={diskUsage}
          networkRx={networkRx}
          networkTx={networkTx}
        />
      </Box>
    </Card>
  );
};

export default AgentCard;
