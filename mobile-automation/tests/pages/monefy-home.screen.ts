import { $ } from '@wdio/globals';

export class MonefyHomeScreen {
    private readonly keyBoardActionButton = 'id=com.monefy.app.lite:id/keyboard_action_button';
    private readonly balanceAmount = 'id=com.monefy.app.lite:id/balance_amount';
    private readonly digitOneButton = 'id=com.monefy.app.lite:id/buttonKeyboard1';

    private amountDigit(digit: string) {
        return $(`id=com.monefy.app.lite:id/buttonKeyboard${digit}`);
    }

    private expenseOrIncomeCategory(categoryName: string) {
        return $(
            `//android.widget.TextView[@resource-id="com.monefy.app.lite:id/textCategoryName" and @text="${categoryName}"]/ancestor::android.widget.FrameLayout[1]`
        );
    }

    private listedCategory(categoryName: string) {
        return $(
            `//android.widget.TextView[@resource-id="com.monefy.app.lite:id/textViewCategoryName" and @text="${categoryName}"]/ancestor::android.widget.RelativeLayout[1]`
        );
    }
    private firstTransactionItem() {
        return $(
            '(//android.widget.TextView[@resource-id="com.monefy.app.lite:id/textViewTransactionAmount"]/ancestor::android.widget.LinearLayout[1])[1]'
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
            'id=com.monefy.app.lite:id/action_edit',
            'id=com.monefy.app.lite:id/menu_edit',
            'id=com.monefy.app.lite:id/amount_text',
            'id=com.monefy.app.lite:id/amount_input',
            'id=com.monefy.app.lite:id/amount'
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
        await $('id=com.monefy.app.lite:id/expense_button').click();
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
        const incomeButton = await $('id=com.monefy.app.lite:id/income_button');
        await incomeButton.waitForDisplayed({ timeout: 5000 });
        await incomeButton.click();
    }

    async selectIncomeCategory(incomeCategoryName: string): Promise<void> {
        await this.submitAmountAndSelectCategory(incomeCategoryName);
    }

    async verifyNewBalanceUpdated(expectedNewBalance: string): Promise<void> {
        await this.assertBalanceContains(expectedNewBalance);
    }

    async tapBalance(): Promise<void> {
        await $('id=com.monefy.app.lite:id/balance_container').click();
    }

    async tapOnCategoryName(firstCategoryName: string): Promise<void> {
        const category = await this.listedCategory(firstCategoryName);
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
        for (let i = 0; i < 3; i += 1) {
            await $('id=com.monefy.app.lite:id/buttonKeyboardClear').click();
        }
        await this.enterAmountDigits(amount);
        await $(this.keyBoardActionButton).click();
        const changesSavedText = await $('//*[@text="Changes saved"]');
        await changesSavedText.waitForDisplayed({ timeout: 5000 });
    }

    
        
    
}

