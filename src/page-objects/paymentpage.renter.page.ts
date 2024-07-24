import{expect,type Locator, type Page} from '@playwright/test';

class PaymentRenter{
    readonly page : Page
    readonly radioCustomAmountButton : Locator;
    readonly radioFullAmountButton : Locator;
    readonly amountinput : Locator;
    readonly cancelButton : Locator;
    readonly nextStepButton : Locator;
    readonly crecidtCardButton: Locator;
    readonly bankAccountButton : Locator;
    readonly cardNumberInput : Locator;
    readonly expDateInput : Locator;
    readonly cvcInput : Locator;
    readonly countryDropdown : Locator;
    readonly confirmAndPayButton : Locator;
    readonly backbutton : Locator;
    readonly backToClaimButton : Locator;
    readonly paymentConfirmation : Locator;



    constructor(page : Page){
        this.page = page
        this.radioCustomAmountButton = page.locator('[value="Custom Amount"]');
        this.radioFullAmountButton = page.locator('[value="Full Amount"]');
        this.amountinput = page.locator('//div[@class="mantine-Input-wrapper mantine-NumberInput-wrapper mantine-12sbrde"]//input');
        this.cancelButton = page.getByText('Cancel');
        this.nextStepButton = page.getByText('Next step');
        this.bankAccountButton = page.frameLocator('(//div[@class="__PrivateStripeElement"]//iframe)[1]').locator('#us_bank_account-tab');
        this.crecidtCardButton = page.frameLocator('(//div[@class="__PrivateStripeElement"]//iframe)[1]').getByTestId('card');
        this.cardNumberInput = page.frameLocator('(//div[@class="__PrivateStripeElement"]//iframe)[1]').getByPlaceholder('1234 1234 1234 1234');
        this.expDateInput = page.frameLocator('(//div[@class="__PrivateStripeElement"]//iframe)[1]').getByPlaceholder('MM / YY');
        this.cvcInput = page.frameLocator('(//div[@class="__PrivateStripeElement"]//iframe)[1]').getByPlaceholder('CVC');
        this.countryDropdown = page.frameLocator('(//div[@class="__PrivateStripeElement"]//iframe)[1]').locator('//select[@id="Field-countryInput"]');
        this.confirmAndPayButton = page.getByText('Confirm and Pay');
        this.backbutton = page.getByText('Back');
        this.backToClaimButton = page.getByText('Back to Claim');
        this.paymentConfirmation = page.locator('(//table[@class="mantine-Table-root mantine-vzx44b"]//td//div)[2]');
       

    }

    //Payment screen functions
    //Function to select full amount radio button
    async fullAmountSelection(): Promise<void> {
        try {
            await expect(this.radioFullAmountButton).toBeVisible();
            if (await this.radioFullAmountButton.isChecked() != true) {
                await this.radioFullAmountButton.check();
            }
        } catch (error: any) {
            error.message = `Test failed, can't select full payment amount option - ${error.message}`;
            throw error;
        }

    }

    //Function to select the customa amount radio button
    async customAmountSelections(): Promise<void> {
        try {
            await expect(this.radioCustomAmountButton).toBeVisible();
            await this.radioCustomAmountButton.check();
        } catch (error: any) {
            error.message = `Test failed, can't select custom payment amount option - ${error.message}`;
            throw error;
        }
    }

    //Function to click on the next step button should move to payment information screen
    async nextStepClick(): Promise<void> {
        try {
            await expect(this.nextStepButton).toBeVisible();
            await this.nextStepButton.click();
        } catch (error: any) {
            error.message = `Test failed, issue with the next step button - ${error.message}`;
            throw error;
        }
    } 

    //Function to click on the cancel button on the amount selection screen
    async cancelButtonClick(): Promise<void> {
        try {
            await expect(this.cancelButton).toBeVisible();
            await this.cancelButton.click();
        } catch (error: any) {
            error.message = `Test failed, issue with the cancel payment button - ${error.message}`;
            throw error;
        }
    }

    //Function to select the card option on the payment information screen
    async cardOptionSelection(): Promise<void> {
        try {
            await expect(this.crecidtCardButton).toBeVisible();
            await this.crecidtCardButton.click();
        } catch (error: any) {
            error.message = `Test failed, issue selecting credit card - ${error.message}`;
            throw error;
        }
    }

    //Function to  add card information to the input    
    async addCardInformation(card: string): Promise<void> {
        try {
            await expect(this.cardNumberInput).toBeVisible();
            await this.cardNumberInput.fill(card);
        } catch (error: any) {
            error.message = `Test failed, issue adding credit card number - ${error.message}`;
            throw error;
        }
    }

    //Function to  add card date to the input
    async addDateCardInformation(cardDate: string): Promise<void> {
        try {
            await expect(this.expDateInput).toBeVisible();
            await this.expDateInput.fill(cardDate);
        } catch (error: any) {
            error.message = `Test failed, issue adding credit card date - ${error.message}`;
            throw error;
        }
    }

    //Function to add the cvc number of the card to the input
    async addCvcnumber(cvc: string): Promise<void> {
        try {
            await expect(this.cvcInput).toBeVisible();
            await this.cvcInput.fill(cvc);
        } catch (error: any) {
            error.message = `Test failed, issue adding credit card cvc - ${error.message}`;
            throw error;
        }

    }

    //Function to bank account selection option
    async bankOptionSelection(): Promise<void> {
        try {
            await expect(this.bankAccountButton).toBeVisible();
            await this.bankAccountButton.click();
        } catch (error: any) {
            error.message = `Test failed, issue select a bank account option for payment - ${error.message}`;
            throw error;
        }
    }

     //Function to click on the confirmation payment button
     async confirmPaymentClick(): Promise<void>{
        await expect(this.confirmAndPayButton).toBeVisible();
        await this.confirmAndPayButton.click();
        try{
            
        }catch(error: any){
            error.message = `Test failed, login button not clickable - ${error.message}`;
            throw error;
        }
     }

     //Function to click on the button to go back to the claim overview screen
     async backToClaimOverview(): Promise<void>{
        await expect(this.backToClaimButton).toBeVisible();
        await this.backToClaimButton.click();
        try{
            
        }catch(error: any){
            error.message = `Test failed, login button not clickable - ${error.message}`;
            throw error;
        }
     }

    //Function to validate the result label after the payment is made, it should equal to 'Succeeded' if the payment is process correctly
    async isPaymentConfirmationValid(): Promise<void> {
        try {
            await expect(this.paymentConfirmation).toBeVisible();
            expect(await this.paymentConfirmation.textContent()).toEqual('Succeeded');
        } catch (error: any) {
            error.message = `Test failed, login button not clickable - ${error.message}`;
            throw error;
        }
    }

    ////Function to add a custom amout to pay when custom amount is selected
    async addCustomAmount(amount: string): Promise<void> {
        try {
            await expect(this.amountinput).toBeVisible()
            await expect(this.amountinput).toBeEnabled()
            await this.amountinput.clear();
            await this.amountinput.fill(amount);
        } catch (error: any) {
            error.message = `Test failed, Issue adding a custom payment amount - ${error.message}`;
            throw error;
        }
    }
    
}
export default PaymentRenter