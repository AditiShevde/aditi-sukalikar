import { $ } from '@wdio/globals';
import { monefyId } from '../config/monefy-app.js';

export class MonefyOnboardingScreen {
    private get continueButton() {
        return $(monefyId('buttonContinue'));
    }

    private get claimOfferButton() {
        return $(monefyId('buttonPurchase'));
    }

    private get closeButton() {
        return $(monefyId('buttonClose'));
    }

    async tapContinue(): Promise<void> {
        await this.continueButton.click();
    }

    async tapContinueTimes(count: number): Promise<void> {
        for (let index = 0; index < count; index += 1) {
            await this.tapContinue();
        }
    }

    async waitForClaimOffer(): Promise<void> {
        await this.claimOfferButton.waitForDisplayed();
    }

    async closeOffer(): Promise<void> {
        await this.closeButton.click();
    }
}
