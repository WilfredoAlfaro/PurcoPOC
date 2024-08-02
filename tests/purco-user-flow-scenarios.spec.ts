import { test } from '../src/helpers/dataCreation.api.fixtures';
import UserLogin from '../src/page-objects/login.page';
import dotenv from 'dotenv';
dotenv.config();
const emailName: string = process.env.specialistEmailName as string;
const emailToken: string = process.env.specialistEmailToken as string;
const userEmail: string = process.env.specialistEmail as string;

test.describe('Purco_SuperAdmin_Login_Page_Scenarios: POSITIVE', () =>{


    test('PUR-USPA-NEG-001: LOGIN AS SUPER ADMIN @SmokeTest', async ({ page, userEmailfunction, cleanMailBox}) => {
        const UserLoginPage = new UserLogin(page);
        await UserLoginPage.navigatgetoLoginPage();
        await UserLoginPage.isLoginLabelValid();
        await UserLoginPage.isPurcoLogoVisible();
        await UserLoginPage.addRentersEmail(userEmail);
        await UserLoginPage.clickLoginButton(); //added a time out
        await UserLoginPage.fillinput(await userEmailfunction(emailName, emailToken));
        await page.close();
        await cleanMailBox(emailName, emailToken);
        
    });







});