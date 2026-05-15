import { Agent } from '../api/agents';
import ClientResourceSection from './ClientResourceSection';
import { useTranslation } from 'react-i18next';

interface AgentCardProps {
  agent: Agent;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  const { t } = useTranslation();

  let cpuUsage = 0, memoryUsage = 0, diskUsage = 0, networkRx = 0, networkTx = 0;
  try {
    if (agent.cpu_usage !== null && agent.memory_total && agent.memory_used && agent.disk_total && agent.disk_used) {
      cpuUsage = Math.round(agent.cpu_usage);
      memoryUsage = Math.round((agent.memory_used / agent.memory_total) * 100);
      diskUsage = Math.round((agent.disk_used / agent.disk_total) * 100);
      networkRx = agent.network_rx || 0;
      networkTx = agent.network_tx || 0;
    }
  } catch (e) { /* ignore */ }

  const agentStatus = agent.status || 'inactive';

  const statusConfig: Record<string, { bg: string; text: string; dot: string; bar: string }> = {
    active: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-600 dark:text-emerald-400',
      dot: 'bg-emerald-500 shadow-[0_0_6px_rgba(34,197,94,0.6)] animate-pulse-dot',
      bar: 'from-emerald-500 to-cyan-400',
    },
    connecting: {
      bg: 'bg-amber-500/10',
      text: 'text-amber-600 dark:text-amber-400',
      dot: 'bg-amber-500 shadow-[0_0_6px_rgba(245,158,11,0.6)]',
      bar: 'from-amber-500 to-yellow-400',
    },
    inactive: {
      bg: 'bg-slate-500/10',
      text: 'text-slate-500',
      dot: 'bg-slate-400',
      bar: 'from-slate-500 to-slate-400',
    },
  };

  const config = statusConfig[agentStatus] || statusConfig.inactive;
  const statusText: Record<string, string> = {
    active: t('agentCard.status.active'),
    inactive: t('agentCard.status.inactive'),
    connecting: t('agentCard.status.connecting'),
  };

  return (
    <div className="glass glass-hover relative overflow-hidden group">
      <div className={`absolute top-0 left-0 w-1 h-full bg-gradient-to-b ${config.bar} rounded-r-sm`} />
      <div className="p-4 pl-5">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <span className={`${agentStatus === 'active' ? 'text-emerald-500' : 'text-slate-400'}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" strokeWidth="2"/></svg>
            </span>
            <span className="font-semibold text-sm text-slate-900 dark:text-white">{agent.name}</span>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {statusText[agentStatus] || agentStatus}
          </span>
        </div>

        <ClientResourceSection cpuUsage={cpuUsage} memoryUsage={memoryUsage} diskUsage={diskUsage} networkRx={networkRx} networkTx={networkTx} />
      </div>
    </div>
  );
};

export default AgentCard;
