import {test as base, Page} from '@playwright/test'
import ApiFunctions from './apiFunctions.DataRequest'
import constants from '../../data/constants.json';
import claimData from '../../data/claimData.json';
import fs from 'fs';

type DataCreation = {
    page: Page;
    setupApiFunction: () => Promise<void>;
};

const test = base.extend<DataCreation>({
    setupApiFunction: async ({ request }, use) => {
        const apiFunction = new ApiFunctions(request);

        // Example: Perform setup actions in a setup function
        const setupFunction = async () => {
            await apiFunction.getAuth();
            await apiFunction.claimCreationPostRequest(constants.testScriptsConstants.createClaimEndpoint, readJsonFile('data/claimData.json'));
            await apiFunction.processInvolvedParties(apiFunction.generateUrl(), constants.testScriptsConstants.involvePartiUpdateEndpoint);
            console.log("Setup function executed");
        };

        // Provide the setup function to tests
        await use(setupFunction);
    }
});

async function readJsonFile(filePath: string): Promise<any> {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
}

export { test };
