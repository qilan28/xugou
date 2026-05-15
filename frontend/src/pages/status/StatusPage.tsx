import { useState, useEffect, useRef } from 'react';
import { getStatusPageData, StatusAgent } from '../../api/status';
import { Monitor } from '../../api/monitors';
import ClientResourceSection from '../../components/ClientResourceSection';
import MonitorCard from '../../components/MonitorCard';
import { useTranslation } from 'react-i18next';

const StatusPage = () => {
  const { t } = useTranslation();
  const [data, setData] = useState<{ monitors: Monitor[], agents: StatusAgent[] }>({ monitors: [], agents: [] });
  const [loading, setLoading] = useState(false);
  const [pageTitle, setPageTitle] = useState(t('statusPage.title'));
  const [pageDescription, setPageDescription] = useState(t('statusPage.allOperational'));
  const [error, setError] = useState<string | null>(null);
  const reqRef = useRef(false);
  const ctrlRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (reqRef.current && ctrlRef.current) ctrlRef.current.abort();
      reqRef.current = true;
      ctrlRef.current = new AbortController();
      const signal = ctrlRef.current.signal;
      try {
        setLoading(true);
        const res = await getStatusPageData();
        if (signal.aborted) return;
        if (res.success && res.data) {
          setPageTitle(res.data.title || t('statusPage.title'));
          setPageDescription(res.data.description || t('statusPage.allOperational'));
          setData({ monitors: res.data.monitors || [], agents: res.data.agents || [] });
        } else {
          setError(res.message || t('statusPage.fetchError'));
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') setError(t('statusPage.fetchError'));
      } finally {
        reqRef.current = false;
        ctrlRef.current = null;
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 60000);
    return () => { clearInterval(interval); if (ctrlRef.current) ctrlRef.current.abort(); };
  }, [t]);

  if (error) return <div className="flex justify-center items-center min-h-[50vh]"><span className="text-red-500">{error}</span></div>;
  if (loading) return <div className="flex justify-center items-center min-h-[50vh]"><span className="text-slate-500">{t('common.loading')}</span></div>;

  const allUp = data.monitors.every(m => m.status === 'up') && data.agents.every(a => a.status === 'active');

  return (
    <div>
      {/* Header */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-blue-500/15 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-4xl mx-auto px-4 py-16 flex flex-col items-center gap-4 text-center">
          <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium ${
            allUp ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
          }`}>
            <span className={`w-2 h-2 rounded-full ${allUp ? 'bg-emerald-500 animate-pulse-dot' : 'bg-amber-500'}`} />
            {allUp ? t('statusPage.allOperational') : t('statusPage.someIssues')}
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white">{pageTitle}</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl">{pageDescription}</p>
          <span className="text-xs text-slate-400 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">
            {t('statusPage.lastUpdated')}: {t('statusPage.justNow')}
          </span>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 pb-16">
        {data.monitors.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white section-heading mb-4">{t('statusPage.apiServices')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.monitors.map(m => <MonitorCard key={m.id} monitor={m} />)}
            </div>
          </section>
        )}

        {data.agents.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white section-heading mb-4">{t('statusPage.agentStatus')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.agents.map(agent => (
                <div key={agent.id} className="glass glass-hover relative overflow-hidden group">
                  <div className={`absolute top-0 left-0 w-1 h-full rounded-r-sm bg-gradient-to-b ${
                    agent.status === 'active' ? 'from-emerald-500 to-cyan-400' : 'from-slate-500 to-slate-400'
                  }`} />
                  <div className="p-4 pl-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-sm text-slate-900 dark:text-white">{agent.name}</h3>
                        <p className="text-xs text-slate-500">{agent.hostname}{agent.ip_address && ` (${agent.ip_address})`}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                        agent.status === 'active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-500/10 text-slate-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'active' ? 'bg-emerald-500 animate-pulse-dot shadow-[0_0_6px_rgba(34,197,94,0.6)]' : 'bg-slate-400'}`} />
                        {agent.status === 'active' ? t('agent.status.online') : t('agent.status.offline')}
                      </span>
                    </div>

                    {(agent.cpu !== undefined && agent.memory !== undefined) ? (
                      <ClientResourceSection cpuUsage={agent.cpu || 0} memoryUsage={agent.memory || 0} diskUsage={agent.disk || 0} networkRx={agent.network_rx || 0} networkTx={agent.network_tx || 0} />
                    ) : (
                      <div className="p-3 rounded-lg bg-slate-100 dark:bg-white/5 border border-white/[0.06]">
                        <h4 className="text-xs font-semibold mb-2 text-slate-700 dark:text-slate-300">{t('agent.systemInfo')}</h4>
                        <div className="grid grid-cols-2 gap-1.5 text-xs">
                          <span className="text-slate-500">{t('agent.os')}:</span><span>{agent.os || t('common.unknown')}</span>
                          <span className="text-slate-500">{t('agent.version')}:</span><span>{agent.version || t('common.unknown')}</span>
                          <span className="text-slate-500">{t('agent.hostname')}:</span><span>{agent.hostname || t('common.unknown')}</span>
                          <span className="text-slate-500">{t('agent.ipAddress')}:</span><span>{agent.ip_address || t('common.unknown')}</span>
                        </div>
                      </div>
                    )}

                    {agent.updated_at && (
                      <p className="text-xs text-slate-500 mt-3">{t('agent.lastUpdated')}: {new Date(agent.updated_at).toLocaleString()}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StatusPage;
