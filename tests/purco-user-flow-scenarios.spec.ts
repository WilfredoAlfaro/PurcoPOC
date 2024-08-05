import { test } from '../src/helpers/dataCreation.api.fixtures';
import UserLogin from '../src/page-objects/login.page';
import dotenv from 'dotenv';
dotenv.config();
const saEmailName: string = process.env.superAdminEmailName as string;
const saEmailToken: string = process.env.superAdminEmailToken as string;
const saUserEmail: string = process.env.superAdminEmail as string;
const spEmailName: string = process.env.specialistEmailName as string;
const spEmailToken: string = process.env.specialistEmailToken as string;
const spUserEmail: string = process.env.specialistEmail as string;
const aEmailName: string = process.env.adminEmailName as string;
const aEmailToken: string = process.env.adminEmailToken as string;
const aUserEmail: string = process.env.adminEmail as string;

test.describe('Purco_Users_Login_Page_Scenarios: POSITIVE', () =>{


    test('PUR-USLP-POS-001: LOGIN AS SUPER ADMIN USER @SmokeTest', async ({ page, userEmailfunction, cleanMailBox}) => {
        const UserLoginPage = new UserLogin(page);
        await UserLoginPage.navigatgetoLoginPage();
        await UserLoginPage.isLoginLabelValid();
        await UserLoginPage.isPurcoLogoVisible();
        await UserLoginPage.addRentersEmail(saUserEmail);
        await UserLoginPage.clickLoginButton(); //added a time out
        await UserLoginPage.fillinput(await userEmailfunction(saEmailName, saEmailToken));
        await page.close();
        await cleanMailBox(saEmailName, saEmailToken);
        
    });

    test('PUR-USLP-POS-001: LOGIN AS ADMIN USER @SmokeTest', async ({ page, userEmailfunction, cleanMailBox}) => {
        const UserLoginPage = new UserLogin(page);
        await UserLoginPage.navigatgetoLoginPage();
        await UserLoginPage.isLoginLabelValid();
        await UserLoginPage.isPurcoLogoVisible();
        await UserLoginPage.addRentersEmail(aUserEmail);
        await UserLoginPage.clickLoginButton(); //added a time out
        await UserLoginPage.fillinput(await userEmailfunction(aEmailName, aEmailToken));
        await page.close();
        await cleanMailBox(aEmailName, aEmailToken);
        
    });

    test('PUR-USLP-POS-001: LOGIN AS SPECIALIST USER @SmokeTest', async ({ page, userEmailfunction, cleanMailBox}) => {
        const UserLoginPage = new UserLogin(page);
        await UserLoginPage.navigatgetoLoginPage();
        await UserLoginPage.isLoginLabelValid();
        await UserLoginPage.isPurcoLogoVisible();
        await UserLoginPage.addRentersEmail(spUserEmail);
        await UserLoginPage.clickLoginButton(); //added a time out
        await UserLoginPage.fillinput(await userEmailfunction(spEmailName, spEmailToken));
        await page.close();
        await cleanMailBox(spEmailName, spEmailToken);
        
    });







});