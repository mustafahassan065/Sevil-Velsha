import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { track } from '../lib/api';

// Router ke andar ek baar lagao. Har public page view count hota hai (admin pages nahi).
export default function PageTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (!pathname.startsWith('/admin')) track('page_view');
  }, [pathname]);
  return null;
}