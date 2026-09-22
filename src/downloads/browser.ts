import { resolveDownloadUrl } from './resolve.js';

const RESOLUTION_TIMEOUT_MS = 4_000;
const RESOLVED_PLATFORMS = new Set(['macos', 'linux']);

function isPlainPrimaryClick(event: MouseEvent) {
  return event.button === 0
    && !event.altKey
    && !event.ctrlKey
    && !event.metaKey
    && !event.shiftKey;
}

async function resolveAndNavigate(link: HTMLAnchorElement, platform: string) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), RESOLUTION_TIMEOUT_MS);

  try {
    const downloadUrl = await resolveDownloadUrl(
      platform,
      link.href,
      (url: string, options: RequestInit) => window.fetch(url, {
        ...options,
        signal: controller.signal,
      }),
    );
    window.location.assign(downloadUrl);
  } finally {
    window.clearTimeout(timeout);
  }
}

export function initDownloadResolver() {
  document.addEventListener('click', (event) => {
    if (!(event instanceof MouseEvent) || event.defaultPrevented || !isPlainPrimaryClick(event)) {
      return;
    }
    if (!(event.target instanceof Element)) return;

    const link = event.target.closest<HTMLAnchorElement>('a[data-track-download]');
    if (!link || (link.target && link.target !== '_self')) return;

    const platform = link.dataset.downloadPlatform;
    if (!platform || !RESOLVED_PLATFORMS.has(platform)) return;

    event.preventDefault();
    if (link.dataset.downloadResolving === 'true') return;

    link.dataset.downloadResolving = 'true';
    link.setAttribute('aria-busy', 'true');
    void resolveAndNavigate(link, platform).finally(() => {
      delete link.dataset.downloadResolving;
      link.removeAttribute('aria-busy');
    });
  });
}
