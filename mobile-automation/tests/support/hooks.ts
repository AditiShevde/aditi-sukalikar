import { addAttachment } from '@wdio/allure-reporter';
import { browser } from '@wdio/globals';
import { isAbsolute, resolve } from 'node:path';

/**
 * Runs after each Cucumber scenario (via wdio.conf `afterScenario`).
 * On failure, captures a screenshot and attaches it to the Allure report.
 */
export async function afterScenario(
    _world: unknown,
    result: { passed: boolean },
    _context: unknown
): Promise<void> {
    if (result.passed) {
        return;
    }

    try {
        const pngBase64 = await browser.takeScreenshot();
        await addAttachment('Screenshot on failure', Buffer.from(pngBase64, 'base64'), 'image/png');
    } catch {
        // Session may already be invalid after a hard failure.
    }
}

export function buildAndroidAppCapabilities(): WebdriverIO.Capabilities {
    const androidAppPath = process.env.ANDROID_APP_PATH;
    const androidPackage = process.env.ANDROID_APP_PACKAGE;
    const androidActivity = process.env.ANDROID_APP_ACTIVITY;

    if (!androidAppPath && !(androidPackage && androidActivity)) {
        throw new Error(
            [
                'Native Android: create mobile-automation/.env (see .env.example) or export vars:',
                'ANDROID_APP_PATH to a .apk, or ANDROID_APP_PACKAGE + ANDROID_APP_ACTIVITY if the app is installed.',
                'Optional: ANDROID_UDID (required if multiple devices/emulators), ANDROID_DEVICE_NAME, ANDROID_PLATFORM_VERSION, ANDROID_NO_RESET=1',
                'Shell exports override .env when the same variable is set in both.'
            ].join('\n')
        );
    }

    const caps: WebdriverIO.Capabilities = {
        platformName: 'Android',
        'appium:automationName': 'UiAutomator2',
        'appium:deviceName': process.env.ANDROID_DEVICE_NAME ?? 'Android device',
        'appium:platformVersion': process.env.ANDROID_PLATFORM_VERSION ?? '16',
        'appium:autoGrantPermissions': true,
        'appium:noReset': process.env.ANDROID_NO_RESET === '1'
    };

    const udid = process.env.ANDROID_UDID;
    if (udid) {
        caps['appium:udid'] = udid;
    }

    if (androidAppPath) {
        caps['appium:app'] = isAbsolute(androidAppPath)
            ? androidAppPath
            : resolve(process.cwd(), androidAppPath);
    } else {
        caps['appium:appPackage'] = androidPackage!;
        caps['appium:appActivity'] = androidActivity!;
    }

    return caps;
}
