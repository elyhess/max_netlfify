import { spawnSync } from 'node:child_process';

const STAGING_SITE_ID =
  process.env.NETLIFY_STAGING_SITE_ID ?? 'e5fd3895-00e9-47a2-b766-bec99cda4b42';

const command = process.argv[2];

const commandArgs = {
  deploy: [
    'deploy',
    '--site',
    STAGING_SITE_ID,
    '--build',
    '--alias',
    'staging',
    '--context',
    'deploy-preview',
    '--message',
    'staging deploy',
  ],
  disable: [
    'api',
    'disableSite',
    '--data',
    JSON.stringify({
      site_id: STAGING_SITE_ID,
      reason: 'staging-disabled-by-owner',
    }),
  ],
  enable: [
    'api',
    'enableSite',
    '--data',
    JSON.stringify({
      site_id: STAGING_SITE_ID,
    }),
  ],
  status: [
    'api',
    'getSite',
    '--data',
    JSON.stringify({
      site_id: STAGING_SITE_ID,
    }),
  ],
};

if (!commandArgs[command]) {
  console.error('Usage: node ./scripts/netlify-staging.mjs <deploy|disable|enable|status>');
  process.exit(1);
}

const result = spawnSync('npx', ['netlify', ...commandArgs[command]], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

if (result.error) {
  throw result.error;
}

process.exit(result.status ?? 0);
