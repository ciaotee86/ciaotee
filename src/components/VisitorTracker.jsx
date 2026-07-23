'use client';

import { useEffect } from 'react';

export default function VisitorTracker() {
  useEffect(() => {
    // Track visit once per session
    const hasVisitedSession = sessionStorage.getItem('tee_portfolio_visited');
    const hasVisitedEver = localStorage.getItem('tee_portfolio_visitor');

    const isNewVisitor = !hasVisitedEver;

    fetch('/api/views', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isNewVisitor }),
    })
      .then(res => res.json())
      .then(() => {
        sessionStorage.setItem('tee_portfolio_visited', 'true');
        localStorage.setItem('tee_portfolio_visitor', 'true');
      })
      .catch(() => {});
  }, []);

  return null;
}
