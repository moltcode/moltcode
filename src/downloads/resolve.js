const DOWNLOADS = {
  macos: {
    manifestUrl: 'https://assets.moltcode.com/release/mac-app-archive.json',
    assetNames: ['MoltCode-compose-darwin-arm.dmg'],
  },
  linux: {
    manifestUrl: 'https://assets.moltcode.com/release/app-archive-linux.json',
    assetNames: ['Molt-linux-x86_64.AppImage', 'MoltCode-compose-linux-x86_64.AppImage'],
  },
};

const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

function manifestItemFor(manifest, platform) {
  if (!manifest || !Array.isArray(manifest.items) || manifest.items.length !== 1) {
    return null;
  }

  const item = manifest.items[0];
  if (
    !item
    || item.platform !== platform
    || typeof item.version !== 'string'
    || !VERSION_PATTERN.test(item.version)
    || typeof item.url !== 'string'
  ) {
    return null;
  }

  return item;
}

function validatedAssetUrl(item, download) {
  let url;
  try {
    url = new URL(item.url);
  } catch {
    return null;
  }

  if (url.protocol !== 'https:' || url.hostname !== 'github.com' || url.search || url.hash) {
    return null;
  }

  const releasePath = `/moltcode/moltcode/releases/download/v${item.version}/`;
  const matches = download.assetNames.some((name) => url.pathname === releasePath + name);
  return matches ? url.toString() : null;
}

export function validatedDownloadUrl(manifest, platform) {
  const download = DOWNLOADS[platform];
  if (!download) return null;

  const item = manifestItemFor(manifest, platform);
  return item ? validatedAssetUrl(item, download) : null;
}

export async function resolveDownloadUrl(platform, fallbackUrl, fetchManifest = fetch) {
  const download = DOWNLOADS[platform];
  if (!download) return fallbackUrl;

  try {
    const response = await fetchManifest(download.manifestUrl, {
      headers: { accept: 'application/json' },
    });
    if (!response.ok) return fallbackUrl;

    return validatedDownloadUrl(await response.json(), platform) ?? fallbackUrl;
  } catch {
    return fallbackUrl;
  }
}

export function manifestUrlFor(platform) {
  return DOWNLOADS[platform]?.manifestUrl ?? null;
}
