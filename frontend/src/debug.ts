// Utility di debug per analizzare i problemi dell'applicazione
// Da importare nella console del browser con import('/src/debug.ts')

import React from 'react';
import ReactDOM from 'react-dom';
import { store } from './store';

// Controlla la versione di React
const checkReactVersion = () => {
  console.log('React version:', React.version);
  return React.version;
};

// Controlla lo stato di Redux
const checkReduxState = () => {
  const state = store.getState();
  console.log('Redux state:', state);
  return state;
};

// Controlla gli errori di rendering di React
const checkRenderPerformance = () => {
  console.log('React DOM:', ReactDOM);
  return 'Check console for React DOM info';
};

// Diagnostica i problemi più comuni
const diagnoseCommonIssues = () => {
  console.log('Checking for common issues...');
  
  // Verifica problemi con React 19
  const reactIssues = [];
  if (React.version.startsWith('19')) {
    reactIssues.push('Using React 19, which may have compatibility issues with some libraries');
  }
  
  // Verifica problemi con Redux
  try {
    const state = store.getState();
    if (!state) {
      reactIssues.push('Redux store is empty or not properly initialized');
    }
  } catch (e) {
    reactIssues.push(`Redux store error: ${e instanceof Error ? e.message : String(e)}`);
  }
  
  // Verifica problemi con React Router
  try {
    if (!window.location) {
      reactIssues.push('Window location is not available');
    }
  } catch (e) {
    reactIssues.push(`Router error: ${e instanceof Error ? e.message : String(e)}`);
  }
  
  console.log('Diagnosis results:', reactIssues.length ? reactIssues : 'No common issues found');
  return reactIssues;
};

// Verifica il caricamento delle risorse
const checkResourceLoading = () => {
  // Controlla il caricamento di CSS
  const cssLoaded = document.querySelectorAll('link[rel="stylesheet"]').length;
  
  // Controlla il caricamento di JS
  const jsLoaded = document.querySelectorAll('script').length;
  
  // Controlla le risorse caricate
  const resourceSummary: {
    cssFiles: number;
    jsFiles: number;
    failedResources: Array<{name: string; duration: number}>;
  } = {
    cssFiles: cssLoaded,
    jsFiles: jsLoaded,
    failedResources: []
  };
  
  // Controlla se ci sono risorse fallite
  if (window.performance) {
    const resources = window.performance.getEntriesByType('resource');
    resources.forEach(resource => {
      if (resource.duration > 5000) { // risorse che hanno richiesto più di 5 secondi
        resourceSummary.failedResources.push({
          name: resource.name,
          duration: resource.duration
        });
      }
    });
  }
  
  console.log('Resource loading check:', resourceSummary);
  return resourceSummary;
};

// Esegui tutte le diagnostiche
const runAllDiagnostics = () => {
  console.group('WTF We Watching - Debug Diagnostics');
  console.log('Starting diagnostics...');
  
  const results = {
    reactVersion: checkReactVersion(),
    reduxState: checkReduxState(),
    renderPerformance: checkRenderPerformance(),
    commonIssues: diagnoseCommonIssues(),
    resources: checkResourceLoading()
  };
  
  console.log('Diagnostics complete!', results);
  console.groupEnd();
  
  return results;
};

// Esporta le funzioni di debug
export {
    checkReactVersion,
    checkReduxState,
    checkRenderPerformance, checkResourceLoading, diagnoseCommonIssues, runAllDiagnostics
};

// Auto-esegui i controlli se eseguito direttamente
runAllDiagnostics();

// Messaggio per la console
console.log(
  '%c WTF We Watching - Debug Mode Attivo ',
  'background: #5046e5; color: white; font-size: 14px; padding: 5px 10px; border-radius: 4px;'
);

export default {
  runAllDiagnostics,
  checkReactVersion,
  checkReduxState,
  checkRenderPerformance,
  diagnoseCommonIssues,
  checkResourceLoading
}; 