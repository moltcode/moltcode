import { config } from '../config';

const DISTINCT_ID_STORAGE_KEY = 'moltcode_analytics_distinct_id';
const POSTHOG_API_KEY = 'phc_tnmwkQgSYVUCiuFRngqatwM5HFSGu2rpJ9dpDuWtXSqw';
const POSTHOG_CAPTURE_URL = 'https://us.i.posthog.com/i/v0/e/';
const DOWNLOAD_CLICKED_EVENT = 'download_cta_clicked';
const ATTRIBUTION_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];

function isProductionWebsite() {
  return window.location.origin === 'https://moltcode.com'
    || window.location.origin === 'https://www.moltcode.com';
}

function createDistinctId() {
  return window.crypto?.randomUUID?.()
    ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getDistinctId() {
  try {
    const stored = window.localStorage.getItem(DISTINCT_ID_STORAGE_KEY);
    if (stored) return stored;
    const created = createDistinctId();
    window.localStorage.setItem(DISTINCT_ID_STORAGE_KEY, created);
    return created;
  } catch {
    return createDistinctId();
  }
}

function getSource() {
  const params = new URLSearchParams(window.location.search);
  const explicitSource = params.get('source') ?? params.get('utm_source');
  if (explicitSource) return explicitSource;
  if (!document.referrer) return 'direct';
  try {
    return new URL(document.referrer).hostname || 'direct';
  } catch {
    return 'direct';
  }
}

function getAttribution() {
  const params = new URLSearchParams(window.location.search);
  return Object.fromEntries(
    ATTRIBUTION_KEYS.flatMap((key) => {
      const value = params.get(key)?.trim();
      return value ? [[key, value]] : [];
    }),
  );
}

function captureDownloadClick(link: HTMLAnchorElement, distinctId: string) {
  void window.fetch(POSTHOG_CAPTURE_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: POSTHOG_API_KEY,
      event: DOWNLOAD_CLICKED_EVENT,
      distinct_id: distinctId,
      properties: {
        app_surface: 'website',
        app_version: config.version,
        platform: link.dataset.downloadPlatform ?? 'unknown',
        architecture: link.dataset.downloadArchitecture ?? 'unknown',
        cta_placement: link.dataset.ctaPlacement ?? 'unknown',
        referrer: document.referrer,
        source: getSource(),
        page_path: window.location.pathname,
        destination_url: link.href,
        '$process_person_profile': false,
        ...getAttribution(),
      },
      timestamp: new Date().toISOString(),
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export function initWebsiteAnalytics() {
  if (!isProductionWebsite()) return;

  const distinctId = getDistinctId();
  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('[data-track-download]');
    if (!link) return;
    captureDownloadClick(link, distinctId);
  });
}
