import { test as base, Page } from '@playwright/test';
import ApiFunctions from './apiFunctions.DataRequest';
import constants from '../data/constants.json';


const claimCreationEndpoint = constants.testScriptsConstants.createClaimEndpoint;
const updateCdemandEndpoint = constants.testScriptsConstants.UpdateClaimDemanEndpoint;
const involvePartieEndpoint = constants.testScriptsConstants.involvePartiUpdateEndpoint;
const deleteClaimEndpoint = constants.testScriptsConstants.deleteclaimEndpoint;

type DataCreation = {
    page: Page;
    apiFunction : ApiFunctions;
    setupApiFunction: () => Promise<void>;
    postTestFunction: () => Promise<void>;
    userEmailfunction: (emailName: string, token: string) => Promise<string>;
    cleanMailBox: (emailName: string, token: string) => Promise<void>;
};

const test = base.extend<DataCreation>({
    apiFunction: async ({ request }, use) => {
        const apiFunction = new ApiFunctions(request);
        await use(apiFunction);
    },
    setupApiFunction: async ({ apiFunction }, use) => {
        const setupFunction = async () => {
            await apiFunction.claimCreationPostRequest(claimCreationEndpoint);
            await apiFunction.claimInvolParGet();
            await apiFunction.claimDemandListGet();
            await apiFunction.updateClaimDemandPost(updateCdemandEndpoint);
            await apiFunction.publishClaimDemandPost(updateCdemandEndpoint);
            await apiFunction.giveSystemAccess(involvePartieEndpoint);
            console.log("Test Claim creation Function executed");
        };
        await use(setupFunction);
    },
    postTestFunction: async ({ apiFunction }, use) => {
        const postTestFunction = async () => {
            await apiFunction.deleteClaim(deleteClaimEndpoint);
            console.log("Test data cleaner executed");
        };
        await use(postTestFunction);
    },
    userEmailfunction: async ({ apiFunction }, use) => {
        const userEmailfunction = async (emailName: string, token: string) =>  {
            console.log("fixture email name " + emailName);
            const emailId = await apiFunction.fetchEmailList(emailName,token);
            const emailCode = await apiFunction.listEmailsReq(emailName,token,emailId);
            return emailCode;
        };
        await use(userEmailfunction);
    },
    cleanMailBox: async ({apiFunction}, use) => {
        const cleanMailBox = async (emailName: string, token: string) => {
        await apiFunction.cleanMailBox(emailName,token);    
    };
    await use(cleanMailBox)
    }

});

export { test };
