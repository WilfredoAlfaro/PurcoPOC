import{expect,type Locator, type Page} from '@playwright/test';
import { takeScreenshot } from '../helpers/errorFunctions.ts';


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
    try{
      await expect(this.signInButton).toBeVisible();
      await this.signInButton.click();
    }catch(error){
      console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'Login button');
            throw error; // Re-throw the error to ensure the test fails
    }
    
   }

   async addRentersEmail(username : string): Promise<void>{
    try{
      await expect(this.emailInput).toBeVisible();
      await this.emailInput.fill(username);
    }catch(error){
      console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'Add renter email');
            throw error; // Re-throw the error to ensure the test fails
    }
    
   }

   async validateLogovisibility(): Promise<void>{
    try{
      await expect(this.purcoLogo).toBeVisible();
    }catch(error){
      console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'purco logo');
            throw error; // Re-throw the error to ensure the test fails
    }
   }

   async validateLoginLabel(): Promise<void>{
     try{
      await expect(this.signInLabel).toBeVisible();
      expect(await this.signInLabel.textContent()).toEqual('Sign in to PurCo');
     }catch(error){
      console.error('Test failed:', error);
      // Take a screenshot if the test fails
      await takeScreenshot(this.page, 'Login Label');
      throw error; // Re-throw the error to ensure the test fails
     }
   }

   async validateNoEmailLabel(): Promise<void>{
    await expect(this.noEmailLabel).toBeVisible();
      expect(await this.noEmailLabel.textContent()).toEqual('Invalid email');
      try{

      }catch(error){
        console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'purco logo');
            throw error; // Re-throw the error to ensure the test fails
      }
   }

   async navigatgetoLoginPage(): Promise<void>{
    await this.page.goto(this.loginUrl);
    try{

    }catch(error){
      console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'purco logo');
            throw error; // Re-throw the error to ensure the test fails
    }
   }

   async validateInvalidEmailLabel(): Promise<void>{
    await expect(this.invalidEmailLabel).toBeVisible();
    expect(await this.invalidEmailLabel.textContent()).toEqual('We could not find an account with the provided information');
    try{

    }catch(error){
      
    }
   }


   async validateClaimLabel(): Promise<void>{
    try{
      await expect(this.claimnNumberLabel).toBeVisible();
    expect(await this.claimnNumberLabel.textContent()).toEqual('Enter your PurCo Claim Number');
    }catch(error){
      console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'Claim label');
            throw error; // Re-throw the error to ensure the test fails
    }
   }

   async addClaimNumber(claim : any): Promise<void>{
    try{
      await expect(this.claimNumberInput).toBeVisible();
      console.log(claim);
      await this.claimNumberInput.fill(claim.toString());
    }catch(error){
      console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'Add a claim input');
            throw error; // Re-throw the error to ensure the test fails
    }
   }

   async clickClaimButton(): Promise<void>{
    await expect(this.confirmClaimButton).toBeVisible();
    await this.confirmClaimButton.click();
    try{

    }catch(error){
      console.error('Test failed:', error);
            // Take a screenshot if the test fails
            await takeScreenshot(this.page, 'Claim button');
            throw error; // Re-throw the error to ensure the test fails
    }
   }








}

export default RenterLogin