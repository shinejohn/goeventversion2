import { MonitoringContext } from '@kit/monitoring-core';

import { SentryClientMonitoringService } from '../services/sentry-client-monitoring.service';

const sentry = new SentryClientMonitoringService();

export function SentryProvider({ children }: React.PropsWithChildren) {
  return <MonitoringProvider>{children}</MonitoringProvider>;
}

function MonitoringProvider(props: React.PropsWithChildren) {
  return (
    <MonitoringContext.Provider value={sentry}>
      {props.children}
    </MonitoringContext.Provider>
  );
}
