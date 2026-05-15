import ResourceBar from './ResourceBar';
import { useTranslation } from 'react-i18next';

interface ClientResourceSectionProps {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkRx: number;
  networkTx: number;
}

const formatNetworkSpeed = (value: number): { text: string, percent: number } => {
  if (value < 1024) {
    return {
      text: `${value.toFixed(2)} KB/s`,
      percent: Math.min(value / 51.2, 100)
    };
  } else {
    const valueMB = value / 1024;
    return {
      text: `${valueMB.toFixed(2)} MB/s`,
      percent: Math.min(value / 51.2, 100)
    };
  }
};

const ClientResourceSection = ({
  cpuUsage = 0, memoryUsage = 0, diskUsage = 0, networkRx = 0, networkTx = 0
}: ClientResourceSectionProps) => {
  const { t } = useTranslation();
  const rxFormatted = formatNetworkSpeed(networkRx);
  const txFormatted = formatNetworkSpeed(networkTx);

  const ResourceItem = ({ label, value, color, unit = '%', indicatorColor }: { label: string; value: number; color: string; unit?: string; indicatorColor: string }) => (
    <div>
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${indicatorColor}`} />
          <span className="text-xs text-slate-500">{label}</span>
        </div>
        <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{value.toFixed(1)}{unit}</span>
      </div>
      <ResourceBar value={value} color={color} height={6} />
    </div>
  );

  return (
    <div className="flex flex-col gap-3">
      <ResourceItem label={t('clientResource.cpu')} value={cpuUsage} color="green" indicatorColor="bg-emerald-500" />
      <ResourceItem label={t('clientResource.memory')} value={memoryUsage} color="blue" indicatorColor="bg-blue-500" />
      <ResourceItem label={t('clientResource.disk')} value={diskUsage} color="amber" indicatorColor="bg-amber-500" />

      {/* Network */}
      <div>
        <div className="mb-1">
          <span className="text-xs text-slate-500">{t('clientResource.network')}</span>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-500" />
                <span className="text-xs text-slate-500">{t('clientResource.download')}</span>
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{rxFormatted.text}</span>
            </div>
            <ResourceBar value={rxFormatted.percent} color="cyan" height={6} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span className="text-xs text-slate-500">{t('clientResource.upload')}</span>
              </div>
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">{txFormatted.text}</span>
            </div>
            <ResourceBar value={txFormatted.percent} color="indigo" height={6} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientResourceSection;
