import{expect,type Locator, type Page} from '@playwright/test';


class RenterLogin{
    readonly page : Page
    readonly signInLabel : Locator;
    readonly purcoLogo : Locator;
    readonly emailInput : Locator
    readonly signInButton : Locator;
    readonly noEmailLabel : Locator;
    readonly loginUrl : string;
    readonly invalidEmailLabel : Locator;
    readonly claimnNumberLabel: Locator;
    readonly claimNumberInput: Locator;
    readonly confirmClaimButton: Locator;


    constructor(page : Page){
        this.page = page
        this.signInLabel = page.getByText('Sign in to PurCo');
        this.purcoLogo = page.getByAltText('PurCo logo');
        this.emailInput = page.getByPlaceholder('name@email.com');
        this.signInButton = page.getByRole('button').filter({hasText: 'Sign in'});
        this.noEmailLabel = page.getByText('Invalid email');
        this.loginUrl = '/';
        this.invalidEmailLabel = page.getByText('We could not find an account with the provided information');
        this.claimnNumberLabel = page.getByText('Enter your PurCo Claim Number');
        this.claimNumberInput = page.getByPlaceholder('Claim #');
        this.confirmClaimButton = page.getByText('Confirm');
    }

    //Functions
   async clickLoginButton(): Promise<void>{
    await this.signInButton.click();
   }

   async addRentersEmail(username : string): Promise<void>{
    await this.emailInput.fill(username);
   }

   async validateLogovisibility(): Promise<void>{
    await expect(this.purcoLogo).toBeVisible();
   }

   async validateLoginLabel(): Promise<void>{
    await expect(this.signInLabel).toBeVisible();
     expect(await this.signInLabel.textContent()).toEqual('Sign in to PurCo');
   }

   async validateNoEmailLabel(): Promise<void>{
    await expect(this.noEmailLabel).toBeVisible();
      expect(await this.noEmailLabel.textContent()).toEqual('Invalid email');
   }

   async navigatgetoLoginPage(): Promise<void>{
    await this.page.goto(this.loginUrl);
   }

   async validateInvalidEmailLabel(): Promise<void>{
    await expect(this.invalidEmailLabel).toBeVisible();
    expect(await this.invalidEmailLabel.textContent()).toEqual('We could not find an account with the provided information');
   }


   async validateClaimLabel(): Promise<void>{
    await expect(this.claimnNumberLabel).toBeVisible();
    expect(await this.claimnNumberLabel.textContent()).toEqual('Enter your PurCo Claim Number');
   }

   async addClaimNumber(claim : string): Promise<void>{
    await expect(this.claimNumberInput).toBeVisible();
    await this.claimNumberInput.fill(claim);
   }

   async clickClaimButton(): Promise<void>{
    await expect(this.confirmClaimButton).toBeVisible();
    await this.confirmClaimButton.click();
   }








}

export default RenterLogin