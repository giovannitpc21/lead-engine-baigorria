import { usePageviewTracking } from '@/hooks/useAnalytics';

// Componente para tracking automático de pageviews
export const PageTracker = ({ pageName, metadata }: { pageName: string; metadata?: Record<string, unknown> }) => {
  usePageviewTracking(pageName, metadata);
  return null;
};

// Componente para tracking de clics en botones
export const TrackableButton = ({ 
  children, 
  eventName, 
  metadata,
  onClick,
  ...props 
}: { 
  children: React.ReactNode; 
  eventName: string; 
  metadata?: Record<string, unknown>;
  onClick?: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const handleClick = () => {
    // Track event
    if (typeof window !== 'undefined') {
      // Usar el hook de analytics si está disponible
      const event = new CustomEvent('analytics:track', {
        detail: { eventName, metadata }
      });
      window.dispatchEvent(event);
    }
    onClick?.();
  };

  return (
    <button onClick={handleClick} {...props}>
      {children}
    </button>
  );
};

// Declaración para TypeScript
declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}