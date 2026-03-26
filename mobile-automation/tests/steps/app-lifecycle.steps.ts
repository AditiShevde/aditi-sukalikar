import { Given, Then } from '@wdio/cucumber-framework';
import { expect, browser } from '@wdio/globals';

Given('the Android app has launched', async () => {
    await browser.waitUntil(
        async () => {
            const pkg = await browser.getCurrentPackage();
            return Boolean(pkg && pkg.length > 0);
        },
        {
            timeout: 30000,
            timeoutMsg:
                'No foreground package reported — check ANDROID_APP_PATH / package+activity and device connection.'
        }
    );
});

Then('the app package should be {string}', async (expectedPackage: string) => {
    await expect(await browser.getCurrentPackage()).toBe(expectedPackage);
});


