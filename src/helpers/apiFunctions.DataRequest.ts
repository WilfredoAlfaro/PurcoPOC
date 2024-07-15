import { APIRequestContext, expect } from '@playwright/test'
import { faker } from '@faker-js/faker';
import fs from 'fs';
import path from 'path';
import constants from '../../data/constants.json';
import claimData from '../../data/claimData.json';
import cDemand from '../../data/cDemand.json';
import renterBody from '../../data/renterBody.json';




class ApiFunctions {
  readonly request: APIRequestContext;
  readonly claimId: string = 'idClaim.tx';
  readonly authtoken: string;
  readonly phisicalDamage: string;
  readonly lou: string;
  readonly adminFee: string;


  constructor(request: APIRequestContext) {
    this.request = request;
    this.authtoken = constants.testScriptsConstants.authToken;
  }

  //Request header for Private API request
  headers() {
    return {
      'Accept': 'application/json',
      'Cookie': this.authtoken,
      'Content-Type': 'application/json'
    }
  }
  //Post request to private API in order to create a fresh new claim 
  async claimCreationPostRequest(url: string,) {

    // Path to the JSON file
    const claimDataPath = path.join(__dirname, '../../data/claimData.json');
    const renterBodyPath = path.join(__dirname, '../../data/renterBody.json');
    // Update the claimData object
    claimData.json.renterEmail = faker.internet.email();
    claimData.json.renterFirstName = faker.person.firstName();
    claimData.json.renterLastName = faker.person.lastName();

    //Update renterBody object
    renterBody.json.firstName = claimData.json.renterFirstName;
    renterBody.json.lastName = claimData.json.renterLastName;
    renterBody.json.emailAddresses = [claimData.json.renterEmail];

    // Write the updated claimData object to the JSON file
    fs.writeFileSync(claimDataPath, JSON.stringify(claimData, null, 2));
    fs.writeFileSync(renterBodyPath, JSON.stringify(renterBody, null, 2));

    try{
    //post request to create a new claim
    const response = await this.request.post(url, {
      headers: this.headers(),
      data: JSON.parse(JSON.stringify(claimData)),
    });
    //json reponse from the body of the response 
    const responseData = await response.json();

    //Write the new created claim id to the txt file  
    fs.writeFileSync(this.claimId, responseData.result.data.json.id);
    constants.testScriptsConstants.claimId = responseData.result.data.json.id;

    //Change the claim number from the constants with the new created claim number for testing
    constants.testScriptsConstants.claimNumber = responseData.result.data.json.claimNumber;

    //Change the renter email from the contants with the new created claim that includes the renter email for testing
    constants.testScriptsConstants.renterEmail = claimData.json.renterEmail;

    //Upadate the renters url
    constants.testScriptsConstants.renterClaimUrl =  `https://staging-purco-cms.herokuapp.com/claims/${encodeURIComponent(responseData.result.data.json.claimNumber)}/overview`;

    console.log("New claim was created " )
    console.log("New claim Number: " +  constants.testScriptsConstants.claimNumber)
    return responseData;

  }catch (response){
    //Validate the status code of the reponse
    if (response.status() !== 200) {
    console.error(`POST request failed with status ${response.status()}`);
  }
  }
  }

  //Function to get the involved parties from the new claim created
  async claimInvolParGet() {
    const claimId = constants.testScriptsConstants.claimId;
    const url = `https://staging-purco-cms.herokuapp.com/api/trpc/involvedParties.list?input=%7B%22json%22%3A%7B%22claimId%22%3A%22${encodeURIComponent(claimId)}%22%7D%7D`;
    const response = await this.request.get(url, {
      headers: this.headers(),
    });
    const responseData = await response.json();
    //Validate the status code of the reponse
    if (response.status() !== 200) {
      console.error(`GET request failed with status ${response.status()}`);
    }

    //Update involve partie Id on the constants file
    constants.testScriptsConstants.involvedPartieId = responseData.result.data.json[0].id;
    return responseData;
  }



  //Function to get a all the claim demand list
  async claimDemandListGet() {
    const claimId = constants.testScriptsConstants.claimId;
    const url = `https://staging-purco-cms.herokuapp.com/api/trpc/claimDemands.list?input=%7B%22json%22%3A%7B%22claimId%22%3A%22${encodeURIComponent(claimId)}%22%7D%7D`;
    const response = await this.request.get(url, { headers: this.headers() });
    const responseData = await response.json();

    const claimDemands = responseData.result.data.json.claimDemands;

    // Update cDemand with the retrieved data
    cDemand.json.claimDemandId = claimDemands[0].cdId;
  
    cDemand.json.items[0].claimDemandLineItemId = claimDemands[6].cdlisClaimDemandLineItemId;  
    cDemand.json.items[1].claimDemandLineItemId = claimDemands[0].cdlisClaimDemandLineItemId;
    cDemand.json.items[2].claimDemandLineItemId = claimDemands[3].cdlisClaimDemandLineItemId;
    
    // Adding involved parties to claim demand line items
    // Verify and assign involved parties
    const involvedPartieId = constants.testScriptsConstants.involvedPartieId;
    if (involvedPartieId) {
      cDemand.json.items.forEach(item => {
        item.applicableParties = [involvedPartieId.trim()]; // Ensure no extra spaces
      });
    } else {
      console.error("InvolvedPartieId is not defined!");
    }
  }

  // Function to update claim demand
  async updateClaimDemandPost(url: string) {
    const response = await this.request.post(url, {
      headers: this.headers(),
      data: JSON.parse(JSON.stringify(cDemand)),
    });

    console.log('Response status:', response.status);
    const responseData = await response.json();
  }



  async publishClaimDemandPost(url: string) {
    const claimDemandId = cDemand.json.claimDemandId;
    const response = await this.request.post(url, {
      headers: this.headers(),
      data: {
        "json": {
          "claimDemandId": claimDemandId,
          "publish": true
        }
      }
    });

    console.log(response.status);
    const responseData = await response.json();
  }

  async giveSystemAccess(url: string) {
    const involvePartieId = constants.testScriptsConstants.involvedPartieId;
    renterBody.json.id = involvePartieId;
    renterBody.json.addresses[0].id = involvePartieId;
    renterBody.json.addresses[0].involvedPartyId = involvePartieId;
    const response = await this.request.post(url, {
      headers: this.headers(),
      data: JSON.parse(JSON.stringify(renterBody))
    })

  }

  async deleteClaim(url: string) {
    const reponse = this.request.post(url, {
      headers: this.headers(),
      data: {
        "json": {
          "id": constants.testScriptsConstants.claimId
        }
      }
    })
    console.log((await reponse).status)
  }

}
export default ApiFunctions