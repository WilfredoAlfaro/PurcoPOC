import{expect,selectors,type Locator, type Page} from '@playwright/test';

class RenterClaimOverview{
    readonly page : Page
    readonly makeaPaymentButton : Locator;
    


    constructor(page : Page){
        this.page = page
        this.makeaPaymentButton = page.getByText('Make a Payment');
    }

    async clickMakeaPaymentButton(): Promise<void>{
        await expect(this.makeaPaymentButton).toBeVisible();
        await this.makeaPaymentButton.click();
    }

    async claimoverviewUrlValidation(url : string): Promise<void>{
        await expect(this.page).toHaveURL(url);
    }




}
export default RenterClaimOverview