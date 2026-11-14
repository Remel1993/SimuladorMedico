import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-xl bg-amber-950/95 border border-amber-500/70 px-3 py-2 text-xs font-semibold text-amber-100 shadow-xl backdrop-blur-sm">
      <WifiOff className="w-3.5 h-3.5 text-amber-400 shrink-0" />
      <span>Modo Offline Activo — Motor clínico y datos locales funcionando</span>
    </div>
  );
};
