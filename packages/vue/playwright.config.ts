import type { PlaywrightTestConfig } from '@playwright/test'

export default <PlaywrightTestConfig>{
  use: {
    launchOptions: {
      ignoreDefaultArgs: ['--hide-scrollbars'],
    },
  },
  webServer: {
    command: 'yarn workspace headlessui-float-example-vue-ts dev --port=3032',
    port: 3032,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
}
