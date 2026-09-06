export function registerServiceWorker() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

  navigator.serviceWorker.register('/sw.js').then((reg) => {
    console.log('✅ Service Worker registered:', reg);
  }).catch((err) => {
    console.log('Service Worker registration failed:', err);
  });
}
