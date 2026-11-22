/** Send the browser to a URL (including app links). Kept separate so tests can stand in for it. */
export const navigateTo = (url: string): void => {
  window.location.href = url;
};
