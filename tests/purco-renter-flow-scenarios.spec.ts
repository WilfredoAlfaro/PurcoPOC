import { test } from '../src/helpers/claimCreation.api.fixtures';
import RenterLogin from '../src/page-objects/login.page';
import constants from '../src/data/constants.json';
import RenterClaimOverview from '../src/page-objects/homepage.renter.page';
import PaymentRenter from '../src/page-objects/paymentpage.renter.page';

test.describe('Purco_Renter_Login_Page_Scenarios: Negative', () => {
    test.beforeEach(async ({ setupApiFunction }) => {
        // Execute setup function before each test
        await setupApiFunction();
    });

    test.afterEach(async ({ postTestFunction }) => {
        await postTestFunction();
    });

    test('PUR-REN-NEG-001: SUBMIT EMPTY RENTER EMAIL @SmokeTest', async ({ page }) => {
        const renterLoginPage = new RenterLogin(page);
        await renterLoginPage.navigatgetoLoginPage();
        await renterLoginPage.isLoginLabelValid();
        await renterLoginPage.isPurcoLogoVisible();
        await renterLoginPage.clickLoginButton();
        await renterLoginPage.isNoEmailLabelTextValid();
        await page.close();
    });

    test('PUR-REN-NEG-002: SUBMIT INVALID RENTER EMAIL @SmokeTest', async ({ page }) => {
        const renterLoginPage = new RenterLogin(page);
        await renterLoginPage.navigatgetoLoginPage();
        await renterLoginPage.isLoginLabelValid();
        await renterLoginPage.isPurcoLogoVisible();
        await renterLoginPage.addRentersEmail(constants.testScriptsConstants.invalidEmail);
        await renterLoginPage.clickLoginButton();
        await renterLoginPage.isInvalidEmailLabelValid();
        await page.close();
    });


});

test.describe('Purco_Renter_Login_Page_Scenarios: POSITIVE', () => {
    test.beforeEach(async ({ setupApiFunction }) => {
        // Execute setup function before each test
        await setupApiFunction();
    });

    test.afterEach(async ({ postTestFunction }) => {
        await postTestFunction();
    });

    test('PUR-REN-POS-001: SUBMIT VALID RENTER EMAIL AND CLAIM NUMBER @SmokeTest', async ({ page }) => {
        const renterLoginPage = new RenterLogin(page);
        const claimoverview = new RenterClaimOverview(page);
        await renterLoginPage.navigatgetoLoginPage();
        await renterLoginPage.isLoginLabelValid();
        await renterLoginPage.isPurcoLogoVisible();
        await renterLoginPage.addRentersEmail(constants.testScriptsConstants.renterEmail);
        await renterLoginPage.clickLoginButton();
        await renterLoginPage.isClaimLabelValid();
        await renterLoginPage.addClaimNumber(constants.testScriptsConstants.claimNumber);
        await renterLoginPage.clickClaimButton();
        await claimoverview.claimoverviewUrlValidation(constants.testScriptsConstants.renterClaimUrl);
        await page.close();
    });
});

test.describe('Purco_Renter_Payment_Page_Scenarios: POSITIVE', () => {

    test.beforeEach(async ({ setupApiFunction }) => {
        // Execute setup function before each test
        await setupApiFunction();
    });

    test.afterEach(async ({ postTestFunction }) => {
        await postTestFunction();
    });

    test('REN-PAY-POS-001: PROCESS A PARTIAL PAYMENT @SmokeTest', async ({ page, }) => {
        const renterLoginPage = new RenterLogin(page);
        const claimoverview = new RenterClaimOverview(page);
        const paymentProcess = new PaymentRenter(page);
        await renterLoginPage.navigatgetoLoginPage();
        await renterLoginPage.isLoginLabelValid();
        await renterLoginPage.isPurcoLogoVisible();
        await renterLoginPage.addRentersEmail(constants.testScriptsConstants.renterEmail);
        await renterLoginPage.clickLoginButton();
        await renterLoginPage.isClaimLabelValid();
        await renterLoginPage.addClaimNumber(constants.testScriptsConstants.claimNumber);
        await renterLoginPage.clickClaimButton();
        await claimoverview.claimoverviewUrlValidation(constants.testScriptsConstants.renterClaimUrl);
        await claimoverview.clickMakeaPaymentButton();
        await paymentProcess.customAmountSelections();
        await paymentProcess.addCustomAmount(constants.testScriptsConstants.customAmount);
        await paymentProcess.nextStepClick();
        await paymentProcess.cardOptionSelection();
        await paymentProcess.addCardInformation(constants.testScriptsConstants.cardNumber);
        await paymentProcess.addDateCardInformation(constants.testScriptsConstants.expCardDate);
        await paymentProcess.addCvcnumber(constants.testScriptsConstants.cvcNumber);
        await paymentProcess.confirmPaymentClick();
        await paymentProcess.isPaymentConfirmationValid();
        await paymentProcess.backToClaimOverview();
        await page.close();

    });

    test('REN-PAY-POS-002: PROCESS A FULL PAYMENT', async ({ page }) => {
        const renterLoginPage = new RenterLogin(page);
        const claimoverview = new RenterClaimOverview(page);
        const paymentProcess = new PaymentRenter(page);
        await renterLoginPage.navigatgetoLoginPage();
        await renterLoginPage.page.waitForTimeout(3000);
        await renterLoginPage.isLoginLabelValid();
        await renterLoginPage.isPurcoLogoVisible();
        await renterLoginPage.addRentersEmail(constants.testScriptsConstants.renterEmail);
        await renterLoginPage.clickLoginButton();
        await renterLoginPage.page.waitForTimeout(1000);
        await renterLoginPage.isClaimLabelValid();
        await renterLoginPage.addClaimNumber(constants.testScriptsConstants.claimNumber);
        await renterLoginPage.clickClaimButton();
        await renterLoginPage.page.waitForTimeout(3000);
        await claimoverview.claimoverviewUrlValidation(constants.testScriptsConstants.renterClaimUrl);
        await claimoverview.page.waitForTimeout(1000);
        await claimoverview.clickMakeaPaymentButton();
        await paymentProcess.page.waitForTimeout(1000);
        await paymentProcess.fullAmountSelection();
        await paymentProcess.nextStepClick();
        await paymentProcess.page.waitForTimeout(1000);
        await paymentProcess.cardOptionSelection();
        await paymentProcess.addCardInformation(constants.testScriptsConstants.cardNumber);
        await paymentProcess.addDateCardInformation(constants.testScriptsConstants.expCardDate);
        await paymentProcess.addCvcnumber(constants.testScriptsConstants.cvcNumber);
        await paymentProcess.confirmPaymentClick();
        await paymentProcess.isPaymentConfirmationValid();
        await paymentProcess.backToClaimOverview();
        await page.close();
    });



});

test.describe('Purco_Renter_Notes_Page_Scenarios: POSITIVE', () => {

    test.beforeEach(async ({ setupApiFunction }) => {
        // Execute setup function before each test
        await setupApiFunction();
    });

    test.afterEach(async ({ postTestFunction }) => {
        await postTestFunction();
    });

    test('REN-PAY-POS-002: PROCESS A FULL PAYMENT', async ({ page }) => {
        const renterLoginPage = new RenterLogin(page);
        const claimoverview = new RenterClaimOverview(page);
        await renterLoginPage.navigatgetoLoginPage();
        await renterLoginPage.isLoginLabelValid();
        await renterLoginPage.isPurcoLogoVisible();
        await renterLoginPage.addRentersEmail(constants.testScriptsConstants.renterEmail);
        await renterLoginPage.clickLoginButton();
        await renterLoginPage.isClaimLabelValid();
        await renterLoginPage.addClaimNumber(constants.testScriptsConstants.claimNumber);
        await renterLoginPage.clickClaimButton();
        await claimoverview.claimoverviewUrlValidation(constants.testScriptsConstants.renterClaimUrl);
        await claimoverview.clickNotesButton();
        await claimoverview.notesDrawerAddNote();
        await claimoverview.isNewNoteCreated();
        await page.close();

    });

});    




