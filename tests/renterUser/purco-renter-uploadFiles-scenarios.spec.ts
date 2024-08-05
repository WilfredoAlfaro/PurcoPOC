import { test } from '../../src/helpers/dataCreation.api.fixtures';
import UserLogin from '../../src/page-objects/login.page';
import constants from '../../src/data/constants.json';
import RenterClaimOverview from '../../src/page-objects/homepage.renter.page';



test.describe('Purco_Renter_Files_Page_Scenarios: POSITIVE', () => {

    test.beforeEach(async ({ setupApiFunction }) => {
        // Execute setup function before each test
        await setupApiFunction();
    });

    test.afterEach(async ({ postTestFunction }) => {
        await postTestFunction();
    });

    test('REN-PAY-POS-002: UPLOAD A FILE', async ({ page }) => {
        const UserLoginPage = new UserLogin(page);
        const claimoverview = new RenterClaimOverview(page);
        await UserLoginPage.navigatgetoLoginPage();
        await UserLoginPage.isLoginLabelValid();
        await UserLoginPage.isPurcoLogoVisible();
        await UserLoginPage.addRentersEmail(constants.testScriptsConstants.renterEmail);
        await UserLoginPage.clickLoginButton();
        await UserLoginPage.isClaimLabelValid();
        await UserLoginPage.addClaimNumber(constants.testScriptsConstants.claimNumber);
        await UserLoginPage.clickClaimButton();
        await claimoverview.claimoverviewUrlValidation(constants.testScriptsConstants.renterClaimUrl);
        
        await page.close();

    });

});    




