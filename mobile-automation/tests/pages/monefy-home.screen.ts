import { $ } from '@wdio/globals';
import { monefyId, monefyResourceId } from '../config/monefy-app.js';

export class MonefyHomeScreen {
    private readonly keyBoardActionButton = monefyId('keyboard_action_button');
    private readonly balanceAmount = monefyId('balance_amount');
    private readonly digitOneButton = monefyId('buttonKeyboard1');

    private amountDigit(digit: string) {
        return $(monefyId(`buttonKeyboard${digit}`));
    }

    private expenseOrIncomeCategory(categoryName: string) {
        const rid = monefyResourceId('textCategoryName');
        return $(
            `//android.widget.TextView[@resource-id="${rid}" and @text="${categoryName}"]/ancestor::android.widget.FrameLayout[1]`
        );
    }

    private listedCategory(categoryName: string) {
        const rid = monefyResourceId('textViewCategoryName');
        return $(
            `//android.widget.TextView[@resource-id="${rid}" and @text="${categoryName}"]/ancestor::android.widget.RelativeLayout[1]`
        );
    }

    private firstTransactionItem() {
        const rid = monefyResourceId('textViewTransactionAmount');
        return $(
            `(//android.widget.TextView[@resource-id="${rid}"]/ancestor::android.widget.LinearLayout[1])[1]`
        );
    }

    private async enterAmountDigits(amount: string): Promise<void> {
        for (const digit of amount) {
            const button = await this.amountDigit(digit);
            await button.waitForDisplayed({ timeout: 5000 });
            await button.click();
        }
    }

    private async ensureAmountKeyboardVisible(): Promise<void> {
        const digitButton = await $(this.digitOneButton);
        if (await digitButton.isDisplayed()) {
            return;
        }

        const selectorsToTry = [
            monefyId('action_edit'),
            monefyId('menu_edit'),
            monefyId('amount_text'),
            monefyId('amount_input'),
            monefyId('amount')
        ];

        for (const selector of selectorsToTry) {
            const candidate = await $(selector);
            if (await candidate.isDisplayed()) {
                await candidate.click();
                if (await digitButton.waitForDisplayed({ timeout: 2000, reverse: false })) {
                    return;
                }
            }
        }

        await digitButton.waitForDisplayed({ timeout: 5000 });
    }

    private async submitAmountAndSelectCategory(categoryName: string): Promise<void> {
        await $(this.keyBoardActionButton).click();
        const category = await this.expenseOrIncomeCategory(categoryName);
        await category.waitForDisplayed({ timeout: 5000 });
        await category.click();
    }

    private async assertBalanceContains(expectedBalance: string): Promise<void> {
        const balance = await $(this.balanceAmount);
        await balance.waitForDisplayed({ timeout: 10000 });
        const balanceText = await balance.getText();
        const normalizedBalance = balanceText.replace('₹', '').replace(' ', '');
        expect(normalizedBalance).toContain(expectedBalance);
    }

    async tapExpense(): Promise<void> {
        await $(monefyId('expense_button')).click();
    }

    async enterAmount(amount: string): Promise<void> {
        await this.enterAmountDigits(amount);
    }

    async selectCategory(categoryName: string): Promise<void> {
        await this.submitAmountAndSelectCategory(categoryName);
    }

    async verifyBalanceUpdated(expectedBalance: string): Promise<void> {
        await this.assertBalanceContains(expectedBalance);
    }

    async tapIncome(): Promise<void> {
        const incomeButton = await $(monefyId('income_button'));
        await incomeButton.waitForDisplayed({ timeout: 5000 });
        await incomeButton.click();
    }

    async tapBalance(): Promise<void> {
        await $(monefyId('balance_container')).click();
    }

    async tapOnCategoryName(categoryName: string): Promise<void> {
        const category = await this.listedCategory(categoryName);
        await category.waitForDisplayed({ timeout: 5000 });
        await category.click();
    }

    async tapOnFirstTransactionItem(): Promise<void> {
        const firstTransactionItem = await this.firstTransactionItem();
        await firstTransactionItem.waitForDisplayed({ timeout: 5000 });
        await firstTransactionItem.click();
    }

    async editAmountInTransaction(amount: string): Promise<void> {
        await this.ensureAmountKeyboardVisible();
        await $(monefyId('buttonKeyboardClear')).longPress();
        await this.enterAmountDigits(amount);
        await $('//android.widget.ImageButton[@content-desc="Navigate up"]').click();
    }

    async tapOnDelete(): Promise<void> {
        await $('//android.widget.Button[@content-desc="Delete"]').click();
    }
}
