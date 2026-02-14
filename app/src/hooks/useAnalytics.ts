import { useCallback, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

// Generar session ID único
const generateSessionId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Obtener o crear session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('gb_session_id');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('gb_session_id', sessionId);
  }
  return sessionId;
};

// Tipos de eventos
export type AnalyticsEventType = 
  | 'pageview' 
  | 'click' 
  | 'form_start' 
  | 'form_submit' 
  | 'conversion' 
  | 'exit';

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  eventName: string;
  pagePath?: string;
  metadata?: Record<string, any>;
  leadId?: string;
  propertyId?: string;
}

export const useAnalytics = () => {
  const sessionId = useRef(getSessionId());

  // Track event
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      const { error } = await supabase.rpc('track_analytics_event', {
        p_event_type: event.eventType,
        p_event_name: event.eventName,
        p_page_path: event.pagePath || window.location.pathname,
        p_session_id: sessionId.current,
        p_user_agent: navigator.userAgent,
        p_referrer: document.referrer,
        p_metadata: event.metadata || {}
      });

      if (error) {
        console.error('Error tracking event:', error);
      }
    } catch (err) {
      // Silenciar errores de tracking en producción
      console.debug('Analytics error:', err);
    }
  }, []);

  // Track pageview
  const trackPageview = useCallback((pageName: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: 'pageview',
      eventName: pageName,
      metadata
    });
  }, [trackEvent]);

  // Track click
  const trackClick = useCallback((elementName: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: 'click',
      eventName: elementName,
      metadata
    });
  }, [trackEvent]);

  // Track form start
  const trackFormStart = useCallback((formName: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: 'form_start',
      eventName: formName,
      metadata
    });
  }, [trackEvent]);

  // Track form submit
  const trackFormSubmit = useCallback((formName: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: 'form_submit',
      eventName: formName,
      metadata
    });
  }, [trackEvent]);

  // Track conversion
  const trackConversion = useCallback((conversionName: string, metadata?: Record<string, any>) => {
    trackEvent({
      eventType: 'conversion',
      eventName: conversionName,
      metadata
    });
  }, [trackEvent]);

  // Track exit intent
  useEffect(() => {
    const handleBeforeUnload = () => {
      trackEvent({
        eventType: 'exit',
        eventName: 'page_exit',
        metadata: {
          timeOnPage: Date.now() - performance.timing.navigationStart
        }
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [trackEvent]);

  return {
    trackEvent,
    trackPageview,
    trackClick,
    trackFormStart,
    trackFormSubmit,
    trackConversion,
    sessionId: sessionId.current
  };
};

// Hook para tracking automático de pageviews
export const usePageviewTracking = (pageName: string, metadata?: Record<string, any>) => {
  const { trackPageview } = useAnalytics();

  useEffect(() => {
    trackPageview(pageName, metadata);
  }, [pageName, metadata, trackPageview]);
};
