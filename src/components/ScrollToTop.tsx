import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Also scroll the main container if it's scrollable
    const mainMain = document.querySelector('main');
    if (mainMain) {
      mainMain.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
