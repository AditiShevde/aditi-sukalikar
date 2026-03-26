import { Then, When } from '@wdio/cucumber-framework';
import { AndroidPermissionDialog } from '../pages/android-permission.dialog.js';
import { MonefyOnboardingScreen } from '../pages/monefy-onboarding.screen.js';

const onboarding = new MonefyOnboardingScreen();
const permissions = new AndroidPermissionDialog();

When('I finish onboarding', async () => {
    await onboarding.tapContinueTimes(3);
    await permissions.allowIfShown();
    await onboarding.tapContinue();
    await onboarding.waitForClaimOffer();
});

When('I continue the onboarding', async () => {
    await onboarding.tapContinueTimes(3);
});

When('I tap continue on onboarding', async () => {
    await onboarding.tapContinue();
});

When('I click on Get started button', async () => {
    await onboarding.tapContinue();
});

Then('I should see Amazing button and click on it', async () => {
    await onboarding.tapContinue();
});

Then('I should see Yes Please button and click on it', async () => {
    await onboarding.tapContinue();
});

When('I allow notification permission', async () => {
    await permissions.allowIfShown();
});

Then("I should see I'm ready button and click on it", async () => {
    await onboarding.tapContinue();
});

Then('I should see Claim My Offer button', async () => {
    await onboarding.waitForClaimOffer();
});

Then('I click on close icon', async () => {
    await onboarding.closeOffer();
});

When('I close the offer', async () => {
    await onboarding.closeOffer();
});

