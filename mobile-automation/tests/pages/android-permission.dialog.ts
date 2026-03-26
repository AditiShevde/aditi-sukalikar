import { $ } from '@wdio/globals';

export class AndroidPermissionDialog {
    private readonly permissionDialogTimeoutMs = 3000;

    private get allowButton() {
        return $('id=com.android.permissioncontroller:id/permission_allow_button');
    }

    async allowIfShown(): Promise<void> {
        const btn = await this.allowButton;
        const isVisible = await btn.isDisplayed().catch(() => false);
        if (!isVisible) {
            return;
        }

        await btn.waitForDisplayed({ timeout: this.permissionDialogTimeoutMs });
        if (await btn.isDisplayed()) {
            await btn.click();
        }
    }
}

