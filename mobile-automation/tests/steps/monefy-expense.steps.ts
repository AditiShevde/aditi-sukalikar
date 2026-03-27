import { When, Then } from '@wdio/cucumber-framework';
import { MonefyHomeScreen } from '../pages/monefy-home.screen.js';

const home = new MonefyHomeScreen();

When('I tap expense', async () => {
    await home.tapExpense();
});

Then('I enter the amount {string}', async (amount: string) => {
    await home.enterAmount(amount);
});

Then('I select category {string}', async (categoryName: string) => {
    await home.selectCategory(categoryName);
});

Then('the balance should update on home screen {string}', async (expectedBalance: string) => {
    await home.verifyBalanceUpdated(expectedBalance);
});

When('I tap income', async () => {
    await home.tapIncome();
});

When('I enter the income amount {string}', async (amount: string) => {
    await home.enterAmount(amount);
});

Then('I select the income category {string}', async (categoryName: string) => {
    await home.selectCategory(categoryName);
});

Then('the balance should update on dashboard {string}', async (expectedBalance: string) => {
    await home.verifyBalanceUpdated(expectedBalance);
});

When('I tap balance', async () => {
    await home.tapBalance();
});

Then('I tap on {string}', async (categoryName: string) => {
    await home.tapOnCategoryName(categoryName);
});

Then('I tap on first transaction item', async () => {
    await home.tapOnFirstTransactionItem();
});

Then('I expect balance to be {string}', async (expectedBalance: string) => {
    await home.verifyBalanceUpdated(expectedBalance);
});

Then('I edit amount as {string} and save', async (amount: string) => {
    await home.editAmountInTransaction(amount);
});

Then('I tap on delete', async () => {
    await home.tapOnDelete();
});
