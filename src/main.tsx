import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Analytics loads after first paint so the app itself stays lean.
const loadAnalytics = () =>
  import('posthog-js').then(({ default: posthog }) => {
    posthog.init('phc_oTd3HcDMFXU65oc4vhfT4uvXm3vVeWReubc2QnWysCW7', {
      api_host: 'https://eu.i.posthog.com',
      person_profiles: 'identified_only',
      capture_pageleave: true,
      disable_external_dependency_loading: true,
    });
  });
const idle = (window as Window & { requestIdleCallback?: (cb: () => void) => void }).requestIdleCallback;
if (idle) idle(loadAnalytics); else setTimeout(loadAnalytics, 1500);

ReactDOM.createRoot(document.getElementById('root')!).render(<React.StrictMode><App /></React.StrictMode>);
