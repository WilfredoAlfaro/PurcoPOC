import{expect,type Locator, type Page} from '@playwright/test';
import {takeScreenshot} from '../helpers/errorFunctions';


class UserLogin{
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
    readonly userCode1 : Locator;


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
        this.userCode1 = page.locator("//input[@id='mantine-r1']");

    }

    //Functions
   async clickLoginButton(): Promise<void>{
    try{
      await expect(this.signInButton).toBeVisible();
      await this.signInButton.click();
    }catch(error: any){
        error.message = `Test failed, login button not clickable - ${error.message}`;
        throw error;
    }
    
   }

   async addRentersEmail(username : string): Promise<void>{
    try{
      await expect(this.emailInput).toBeVisible();
      await this.emailInput.fill(username);
    }catch(error:any){
      error.message = `Test failed, while adding email on renters input - ${error.message}`;
      throw error;
    }
    
   }

   async isPurcoLogoVisible(): Promise<void>{
    try{
      await expect(this.purcoLogo).toBeVisible();
    }catch(error:any){
      error.message = `Test failed, Purco logo is not visible - ${error.message}`;
        throw error;
    }
   }

   async isLoginLabelValid(): Promise<void>{
     try{
      await expect(this.signInLabel).toBeVisible();
      expect(await this.signInLabel.textContent()).toEqual('Sign in to PurCo');
     }catch(error:any){
      error.message = `Test failed, Purco login label not visible or with invalid text - ${error.message}`;
        throw error;
     }
   }

   async isNoEmailLabelTextValid(): Promise<void>{
      try{
        await expect(this.noEmailLabel).toBeVisible();
        expect(await this.noEmailLabel.textContent()).toEqual('Invalid email');
      }catch(error:any){
        error.message = `Test failed, Purco no email label not visible or invalid text - ${error.message}`;
          throw error;
      }
   }

   async navigatgetoLoginPage(): Promise<void>{
      await this.page.goto(this.loginUrl);
   }

   async isInvalidEmailLabelValid(): Promise<void>{
    try{
      await expect(this.invalidEmailLabel).toBeVisible();
      expect(await this.invalidEmailLabel.textContent()).toEqual('We could not find an account with the provided information');
    }catch(error:any){
      error.message = `Test failed, login invalid email label not visible or invalid text - ${error.message}`;
        throw error;
      
    }
   }


   async isClaimLabelValid(): Promise<void>{
    try{
      await expect(this.claimnNumberLabel).toBeVisible();
    expect(await this.claimnNumberLabel.textContent()).toEqual('Enter your PurCo Claim Number');
    }catch(error:any){
      error.message = `Test failed, login claim label is not visible or invalid text - ${error.message}`;
        throw error;
    }
   }

   async addClaimNumber(claim : any): Promise<void>{
    try{
      await expect(this.claimNumberInput).toBeVisible();
      await this.claimNumberInput.fill(claim.toString());
    }catch(error:any){
      error.message = `Test failed, claim number input not visible  - ${error.message}`;
        throw error;
    }
   }

   async clickClaimButton(): Promise<void>{
    try{
      await expect(this.confirmClaimButton).toBeVisible();
      await this.confirmClaimButton.click();
    }catch(error:any){
      error.message = `Test failed, login claim button not visible - ${error.message}`;
        throw error;
    }
   }


   async fillinput(emailCode : string): Promise<void>{
    try{
      await expect(this.userCode1).toBeEditable();
      await this.userCode1.fill(emailCode);
    }catch(error:any){
      error.message = `Test failed, user code error - ${error.message}`;
        throw error;

    }
   }

}

export default UserLogin