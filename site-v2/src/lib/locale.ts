export const isRussian = window.location.pathname.startsWith('/ru/');
export function localPath(href: string) {
  const translated = ['/', '/learn/', '/learn/tide/', '/faq/', '/status/', '/pilot/', '/trust/', '/audit/', '/developers/', '/feedback/'];
  return isRussian && translated.includes(href) ? `/ru${href}` : href;
}
