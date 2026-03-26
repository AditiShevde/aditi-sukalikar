import { $ } from '@wdio/globals';

export class MonefyOnboardingScreen {
    private get continueButton() {
        return $('id=com.monefy.app.lite:id/buttonContinue');
    }

    private get claimOfferButton() {
        return $('id=com.monefy.app.lite:id/buttonPurchase');
    }

    private get closeButton() {
        return $('id=com.monefy.app.lite:id/buttonClose');
    }

    async tapContinue(): Promise<void> {
        await (await this.continueButton).click();
    }

    async tapContinueTimes(count: number): Promise<void> {
        for (let index = 0; index < count; index += 1) {
            await this.tapContinue();
        }
    }

    async waitForClaimOffer(): Promise<void> {
        await (await this.claimOfferButton).waitForDisplayed();
    }

    async closeOffer(): Promise<void> {
        await (await this.closeButton).click();
    }
}

