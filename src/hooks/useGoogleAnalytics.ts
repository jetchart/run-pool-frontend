import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ReactGA from 'react-ga4';

const GA_MEASUREMENT_ID = import.meta.env.VITE_GOOGLE_GA4_MEASUREMENT_ID;

// Inicializar Google Analytics
export const initializeGA = () => {
  ReactGA.initialize(GA_MEASUREMENT_ID);
};

// Configurar el userId para tracking cross-session
export const setUserId = (userId: string) => {
  ReactGA.set({ user_id: userId });
};

// Limpiar el userId (por ejemplo, al hacer logout)
export const clearUserId = () => {
  ReactGA.set({ user_id: null });
};

// Hook para tracking de páginas automático
export const usePageTracking = (userId?: string) => {
  const location = useLocation();

  useEffect(() => {
    const pageviewData: any = {
      hitType: 'pageview',
      page: location.pathname + location.search,
      title: document.title
    };
    if (userId) {
      pageviewData.user_id = userId;
    }
    ReactGA.send(pageviewData);
  }, [location, userId]);
};

// Hook para tracking de eventos personalizados
export const useGoogleAnalytics = () => {
  const trackEvent = (
    action: string,
    category: string,
    label?: string,
    value?: number
  ) => {
    ReactGA.event({
      action,
      category,
      label,
      value,
    });
  };

  const trackPageView = (page_path: string, page_title?: string) => {
    ReactGA.send({ 
      hitType: 'pageview', 
      page: page_path,
      title: page_title 
    });
  };

  const trackTiming = (
    name: string,
    value: number,
    category?: string,
    label?: string
  ) => {
    ReactGA.event({
      action: 'timing_complete',
      category: category || 'Performance',
      label: label || name,
      value,
    });
  };

  return {
    trackEvent,
    trackPageView,
    trackTiming,
  };
};

// Funciones utilitarias para eventos comunes
export const trackUserAction = (action: string, userId?: string, details?: any) => {
  ReactGA.event({
    action,
    category: 'user_interaction',
    user_id: userId,
    ...details,
  });
};

export const trackTripAction = (action: string, tripId?: string, userId?: string, details?: any) => {
  ReactGA.event({
    action,
    category: 'trip_management',
    label: tripId,
    user_id: userId,
    ...details,
  });
};

export const trackRaceAction = (action: string, raceId?: string, userId?: string, details?: any) => {
  ReactGA.event({
    action,
    category: 'race_interaction',
    label: raceId,
    user_id: userId,
    ...details,
  });
};