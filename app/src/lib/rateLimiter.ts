// src/lib/rateLimiter.ts
import { logRateLimitExceeded } from './securityLogger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

class RateLimiter {
  private requests: Map<string, number[]> = new Map();

  isAllowed(identifier: string, config: RateLimitConfig): boolean {
    const now = Date.now();
    const userRequests = this.requests.get(identifier) || [];
    
    // Filtrar requests dentro de la ventana de tiempo
    const recentRequests = userRequests.filter(
      time => now - time < config.windowMs
    );

    // Si supera el límite, bloquear
    if (recentRequests.length >= config.maxRequests) {
      return false;
    }

    // Agregar el request actual
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    // Limpiar requests viejos cada 5 minutos
    if (Math.random() < 0.01) {
      this.cleanup();
    }

    return true;
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, requests] of this.requests.entries()) {
      const recent = requests.filter(time => now - time < 300000); // 5 min
      if (recent.length === 0) {
        this.requests.delete(key);
      } else {
        this.requests.set(key, recent);
      }
    }
  }

  reset(identifier: string) {
    this.requests.delete(identifier);
  }

  getRequests(): Map<string, number[]> {
    return this.requests;
  }
}

export const rateLimiter = new RateLimiter();

// Hook para usar en componentes React
export const useRateLimit = (
  action: string, 
  maxRequests = 5, 
  windowMs = 60000
) => {
  const checkLimit = (): { allowed: boolean; remaining: number } => {
    const identifier = `${getFingerprint()}_${action}`;
    const allowed = rateLimiter.isAllowed(identifier, { maxRequests, windowMs });
    
    if (!allowed) {
      logRateLimitExceeded(action);
    }

    // Calcular requests restantes
    const now = Date.now();
    const userRequests = rateLimiter.getRequests().get(identifier) || [];
    const recent = userRequests.filter((time: number) => now - time < windowMs);
    const remaining = Math.max(0, maxRequests - recent.length);

    return { allowed, remaining };
  };

  const reset = () => {
    const identifier = `${getFingerprint()}_${action}`;
    rateLimiter.reset(identifier);
  };

  return { checkLimit, reset };
};

// Función para obtener un "fingerprint" del usuario
function getFingerprint(): string {
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

    // Hash simple
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  } catch {
    // Fallback si falla
    return 'anonymous_' + Date.now();
  }
}

// Configuraciones predefinidas
export const RATE_LIMITS = {
  FORM_SUBMIT: { maxRequests: 3, windowMs: 60000 }, // 3 por minuto
  TASACION: { maxRequests: 5, windowMs: 300000 },   // 5 cada 5 min
  API_CALL: { maxRequests: 10, windowMs: 60000 },   // 10 por minuto
  LOGIN: { maxRequests: 5, windowMs: 900000 },      // 5 cada 15 min
};