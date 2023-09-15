export function isClient() {
 return typeof window !== 'undefined';
}

export function isMobileDevice() {
 if (isClient()) {
  return window.innerWidth <= 500;
 }
 return false;
}