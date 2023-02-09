import type { PlaywrightTestConfig } from '@playwright/test'

export default <PlaywrightTestConfig>{
  use: {
    launchOptions: {
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
  },
  webServer: {
    command: 'yarn workspace headlessui-float-example-react-ts dev --port=3031',
    port: 3031,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
}
