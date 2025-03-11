import type { Event, User } from '@sentry/node';

import { MonitoringService } from '@kit/monitoring-core';

const DSN = import.meta.env.VITE_SENTRY_DSN;

/**
 * @class
 * @implements {MonitoringService}
 * ServerSentryMonitoringService is responsible for capturing exceptions and
 * identifying users using the Sentry monitoring service.
 */
export class SentryServerMonitoringService implements MonitoringService {
  private readonly readyPromise: Promise<unknown>;
  private readyResolver?: (value?: unknown) => void;

  constructor() {
    this.readyPromise = new Promise(
      (resolve) => (this.readyResolver = resolve),
    );

    void this.initialize();
  }

  async initialize() {
    await this.initializeSentryServerClient();

    this.readyResolver?.();
  }

  async ready() {
    return this.readyPromise;
  }

  async captureException(error: Error | null) {
    await this.initialize();

    const { captureException } = await import('@sentry/node').catch();

    return captureException(error);
  }

  async captureEvent<Extra extends Event>(event: string, extra?: Extra) {
    await this.initialize();

    const { captureEvent } = await import('@sentry/node').catch();

    return captureEvent({
      message: event,
      ...(extra ?? {}),
    });
  }

  async identifyUser(user: User) {
    await this.initialize();

    const { setUser } = await import('@sentry/node').catch();

    setUser(user);
  }

  private async initializeSentryServerClient() {
    const { init } = await import('@sentry/node').catch();

    init({
      dsn: DSN,
    });
  }
}
