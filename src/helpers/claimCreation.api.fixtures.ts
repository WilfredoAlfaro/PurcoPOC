import { test as base, Page } from '@playwright/test'
import ApiFunctions from './apiFunctions.DataRequest'
import constants from '../../data/constants.json';

const claimCreationEndpoint = constants.testScriptsConstants.createClaimEndpoint;
const updateCdemandEndpoint = constants.testScriptsConstants.UpdateClaimDemanEndpoint;
const involvePartieEndpoint = constants.testScriptsConstants.involvePartiUpdateEndpoint;
const deleteClaimEndpoint = constants.testScriptsConstants.deleteclaimEndpoint;

type DataCreation = {
    page: Page;
    setupApiFunction: () => Promise<void>;
    postTestFunction: () => Promise<void>;
};

const test = base.extend<DataCreation>({
    setupApiFunction: async ({ request }, use) => {
        const apiFunction = new ApiFunctions(request);

        //Perform setup actions in a setup function
        const setupFunction = async () => {
            await apiFunction.claimCreationPostRequest(claimCreationEndpoint);
            await apiFunction.claimInvolParGet();
            await apiFunction.claimDemandListGet();
            await apiFunction.updateClaimDemandPost(updateCdemandEndpoint);
            await apiFunction.publishClaimDemandPost(updateCdemandEndpoint);
            await apiFunction.giveSystemAccess(involvePartieEndpoint);
            console.log("Test Claim creation Function executed");
        };
        // Provide the setup function to tests
        await use(setupFunction);
    },

    postTestFunction: async ({ request }, use) => {
        const apiFunction = new ApiFunctions(request);
        // Function to remove the test data created for the test
        const postTestFunction = async () => {
            await apiFunction.deleteClaim(deleteClaimEndpoint);
            console.log("Test data cleaner executed");
        };
        // Provide the post-test function to tests
        await use(postTestFunction);
    }
});

export { test };
