import { Box, Card, Flex, Heading, Text } from '@radix-ui/themes';
import { ReactNode } from 'react';
import '../styles/components.css';

interface StatusItem {
  icon: ReactNode;
  label: string;
  value: number;
  bgColor?: string;
  iconColor?: string;
}

interface StatusSummaryCardProps {
  title: string;
  items: StatusItem[];
}

const StatusSummaryCard = ({ title, items }: StatusSummaryCardProps) => {

  return (
    <Card className="status-summary-card" style={{ position: 'relative', overflow: 'hidden' }}>
      <Box style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '3px',
        height: '100%',
        background: 'linear-gradient(180deg, var(--accent-7), var(--accent-9), var(--accent-7))',
        borderRadius: '0 2px 2px 0',
      }} />
      <Box p="4">
        <Heading size="4" mb="2" style={{ color: 'var(--gray-12)' }}>{title}</Heading>
        <Flex direction="column" gap="2" mt="2">
          {items.map((item, index) => (
            <Flex key={index} justify="between" align="center" style={{
              padding: '10px 12px',
              borderRadius: '8px',
              backgroundColor: item.bgColor || 'var(--gray-2)',
              transition: 'transform 0.15s ease',
            }}>
              <Flex align="center" gap="2">
                <Box
                  className="status-icon-container"
                  style={{
                    background: 'rgba(255,255,255,0.6)',
                    color: item.iconColor,
                  }}
                >
                  {item.icon}
                </Box>
                <Text size="2" weight="medium">{item.label}</Text>
              </Flex>
              <Heading size="6" style={{ color: item.iconColor || 'var(--gray-12)', fontWeight: 700 }}>
                {item.value}
              </Heading>
            </Flex>
          ))}
        </Flex>
      </Box>
    </Card>
  );
};

export default StatusSummaryCard;
