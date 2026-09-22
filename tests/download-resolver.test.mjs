import assert from 'node:assert/strict';
import test from 'node:test';

import {
  manifestUrlFor,
  resolveDownloadUrl,
  validatedDownloadUrl,
} from '../src/downloads/resolve.js';

const macUrl =
  'https://github.com/moltcode/moltcode/releases/download/v1.2.3/MoltCode-compose-darwin-arm.dmg';
const linuxUrl =
  'https://github.com/moltcode/moltcode/releases/download/v1.2.2/MoltCode-compose-linux-x86_64.AppImage';

test('resolves the current macOS asset from its updater manifest', async () => {
  const requested = [];
  const result = await resolveDownloadUrl('macos', 'https://fallback.invalid/mac.dmg', async (url) => {
    requested.push(url);
    return new Response(JSON.stringify({
      items: [{ version: '1.2.3', platform: 'macos', url: macUrl }],
    }), { status: 200 });
  });

  assert.equal(result, macUrl);
  assert.deepEqual(requested, [manifestUrlFor('macos')]);
});

test('resolves Linux independently from its updater manifest', async () => {
  const result = await resolveDownloadUrl('linux', 'https://fallback.invalid/linux', async () =>
    new Response(JSON.stringify({
      items: [{ version: '1.2.2', platform: 'linux', url: linuxUrl }],
    }), { status: 200 }));

  assert.equal(result, linuxUrl);
});

test('uses the pinned fallback when the manifest request fails', async () => {
  const fallback = 'https://github.com/example/fallback.dmg';
  const result = await resolveDownloadUrl('macos', fallback, async () =>
    new Response(null, { status: 503 }));

  assert.equal(result, fallback);
});

test('rejects a manifest URL outside the public release repository', () => {
  assert.equal(validatedDownloadUrl({
    items: [{
      version: '1.2.3',
      platform: 'macos',
      url: 'https://example.com/not-the-release.dmg',
    }],
  }, 'macos'), null);
});
