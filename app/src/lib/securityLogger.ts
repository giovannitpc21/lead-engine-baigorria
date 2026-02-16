// src/lib/securityLogger.ts

import { supabase } from './supabase';

type EventType = 
  | 'rate_limit_exceeded'
  | 'invalid_input'
  | 'xss_attempt'
  | 'sql_injection_attempt'
  | 'suspicious_activity'
  | 'captcha_failed'
  | 'unauthorized_access'
  | 'form_spam';

type Severity = 'low' | 'medium' | 'high' | 'critical';

interface SecurityEvent {
  type: EventType;
  severity: Severity;
  details?: Record<string, unknown>;
}

class SecurityLogger {
  async log(event: SecurityEvent) {
    try {
      const fingerprint = this.getFingerprint();
      const userAgent = navigator.userAgent;

      await supabase.from('security_logs').insert({
        event_type: event.type,
        severity: event.severity,
        details: event.details || {},
        user_fingerprint: fingerprint,
        user_agent: userAgent,
        timestamp: new Date().toISOString()
      });

      // Log en consola en desarrollo
      if (import.meta.env.DEV) {
        console.warn('🔒 Security Event:', event);
      }
    } catch (error) {
      console.error('Error logging security event:', error);
    }
  }

  private getFingerprint(): string {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      let canvasData = '';
      
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '14px Arial';
        ctx.fillText('fp', 2, 2);
        canvasData = canvas.toDataURL();
      }
      
      const fingerprint = [
        navigator.userAgent,
        navigator.language,
        screen.colorDepth,
        screen.width + 'x' + screen.height,
        new Date().getTimezoneOffset(),
        canvasData.slice(0, 100)
      ].join('|');

      let hash = 0;
      for (let i = 0; i < fingerprint.length; i++) {
        const char = fingerprint.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
      }
      
      return Math.abs(hash).toString(36);
    } catch {
      return 'unknown';
    }
  }
}

export const securityLogger = new SecurityLogger();

// Helpers específicos
export const logRateLimitExceeded = (action: string) => {
  securityLogger.log({
    type: 'rate_limit_exceeded',
    severity: 'medium',
    details: { action }
  });
};

export const logInvalidInput = (field: string, value: string) => {
  securityLogger.log({
    type: 'invalid_input',
    severity: 'low',
    details: { field, value: value.slice(0, 100) }
  });
};

export const logXssAttempt = (input: string) => {
  securityLogger.log({
    type: 'xss_attempt',
    severity: 'high',
    details: { input: input.slice(0, 200) }
  });
};

export const logSqlInjectionAttempt = (input: string) => {
  securityLogger.log({
    type: 'sql_injection_attempt',
    severity: 'critical',
    details: { input: input.slice(0, 200) }
  });
};

export const logCaptchaFailed = () => {
  securityLogger.log({
    type: 'captcha_failed',
    severity: 'medium'
  });
};