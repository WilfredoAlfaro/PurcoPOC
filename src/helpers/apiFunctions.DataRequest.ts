import { APIRequestContext, APIResponse } from '@playwright/test'
import { faker } from '@faker-js/faker';
import fs from 'fs';
import claimData from '../data/claimData.json';
import cDemand from '../data/cDemand.json';
import renterBody from '../data/renterBody.json';
import constants from '../data/constants.json';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();




class ApiFunctions {
  readonly request: APIRequestContext;
  

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * @function getHeaders Request header for all API request 
   * @returns Headers for API request
   */
  getHeaders() {
    try {
      const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      };
      const cookie = process.env.COOKIE;
      if (!cookie) {
        throw new Error('Cookie token error');
      }
      headers['Cookie'] = cookie;
      return headers;
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * @function usersHeaders Request header for all API request 
   * @returns Headers for API request
   */
  usersHeaders(userToken: string) {
    try {
      const headers: { [key: string]: string } = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-MailboxToken': userToken
      };
      return headers;
    } catch (error: any) {
      throw error;
    }
  }


  /**
   * @function updateData Updates claim creation json and renters body json
   */
  updateData() {
    try {
      // Path to the JSON file
      const claimDataPath = path.join(__dirname, '../data/claimData.json');
      const renterBodyPath = path.join(__dirname, '../data/renterBody.json');

      // Update the claimData object with random email, first and last name
      claimData.json.renterEmail = faker.internet.email();
      claimData.json.renterFirstName = faker.person.firstName();
      claimData.json.renterLastName = faker.person.lastName();

      // Update renterBody object email, first and last name
      renterBody.json.firstName = claimData.json.renterFirstName;
      renterBody.json.lastName = claimData.json.renterLastName;
      renterBody.json.emailAddresses = [claimData.json.renterEmail];

      // Write the updated claim Data and renters Data object to the JSON file
      fs.writeFileSync(claimDataPath, JSON.stringify(claimData, null, 2));
      fs.writeFileSync(renterBodyPath, JSON.stringify(renterBody, null, 2));
    } catch (error: any) {
      throw error;
    }
  }

  /**
   * @function claimCreationPostRequest API post request to create a new claim
   */
  async claimCreationPostRequest(url: string): Promise<any> {
    try {
      this.updateData();
      //Post request 
      const response: APIResponse = await this.request.post(url, {
        headers: this.getHeaders(),
        data: JSON.parse(JSON.stringify(claimData)),
      });
      // Check the status of the response
      if (response.status() !== 200) {
        throw new Error(`POST request failed with status ${response.status()}`);
      }

      // JSON response from the body of the response
      const responseData = await response.json();

      // Update the claim id on the constants json file
      constants.testScriptsConstants.claimId = responseData.result.data.json.id;

      // Change the claim number from the constants with the new created claim number for testing
      constants.testScriptsConstants.claimNumber = responseData.result.data.json.claimNumber;

      // Change the renter email from the constants with the new created claim that includes the renter email for testing
      constants.testScriptsConstants.renterEmail = claimData.json.renterEmail;

      // Update the renters URL with the new claim number
      constants.testScriptsConstants.renterClaimUrl = `https://staging-purco-cms.herokuapp.com/claims/${encodeURIComponent(responseData.result.data.json.claimNumber)}/overview`;

    } catch (error: any) {
      throw error; // Rethrow the error after logging it
    }
  }

  /**
   * @function claimInvolParGet Get involve partie Id 
   */
  async claimInvolParGet(): Promise<void> {
    try {
      const claimId = constants.testScriptsConstants.claimId;
      const url = `https://staging-purco-cms.herokuapp.com/api/trpc/involvedParties.list?input=%7B%22json%22%3A%7B%22claimId%22%3A%22${encodeURIComponent(claimId)}%22%7D%7D`;
      
      //GET request
      const response = await this.request.get(url, {
        headers: this.getHeaders(),
      });
      const responseData = await response.json();

      //Validate the status code of the reponse
      if (response.status() !== 200) {
        throw new Error(`GET request failed with status ${response.status()}`);
      }
      //Update involve partie Id on the constants file
      constants.testScriptsConstants.involvedPartieId = responseData.result.data.json[0].id;
    } catch (error: any) {
      throw error; // Rethrow the error after logging it
    }
  }

  /**
   * @function claimDemandListGet request to retrive claim demand id of the claim from all the list of claim demands
   */
  async claimDemandListGet(): Promise<void> {
    try {
      const claimId = constants.testScriptsConstants.claimId;
      const url = `https://staging-purco-cms.herokuapp.com/api/trpc/claimDemands.list?input=%7B%22json%22%3A%7B%22claimId%22%3A%22${encodeURIComponent(claimId)}%22%7D%7D`;

      //Get request 
      const response = await this.request.get(url, { headers: this.getHeaders() });
      const responseData = await response.json();
      const claimDemands = responseData.result.data.json.claimDemands;

      // Update cDemand with the retrieved claim id 
      cDemand.json.claimDemandId = claimDemands[0].cdId;

      //Update claim demand line items with new claim line items id 
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
        throw new Error("InvolvedPartieId is not defined!");
      }
    } catch (error: any) {
      throw error; // Rethrow the error after logging it
    }
  }

  /**
   * @function updateClaimDemandPost updates claim Demand from claim created
   */
  async updateClaimDemandPost(url: string): Promise<void> {
    try {
      //POST request
      const response = await this.request.post(url, {
        headers: this.getHeaders(),
        data: JSON.parse(JSON.stringify(cDemand)),
      });

      //Validate the status code of the reponse
      if (response.status() !== 200) {
        throw new Error(`POST request failed with status ${response.status()}`);
      }
    } catch (error: any) {
      throw error; // Rethrow the error after logging it
    }
  }

  /**
   * @function publishClaimDemandPost Request to publish claim demand
   */
  async publishClaimDemandPost(url: string): Promise<void> {
    try {
      const claimDemandId = cDemand.json.claimDemandId;
      //POST request
      const response = await this.request.post(url, {
        headers: this.getHeaders(),
        data: {
          "json": {
            "claimDemandId": claimDemandId,
            "publish": true
          }
        }
      });
      //Validate the status code of the reponse
      if (response.status() !== 200) {
        throw new Error(`POST request failed with status ${response.status()}`);
      }
    } catch (error: any) {
      throw error; // Rethrow the error after logging it
    }
  }

  /**
   * @function giveSystemAccess POST request to give renter access
   */
  async giveSystemAccess(url: string): Promise<void> {
    try {
      //Update Renters body request 
      const involvePartieId = constants.testScriptsConstants.involvedPartieId;
      renterBody.json.id = involvePartieId;
      renterBody.json.addresses[0].id = involvePartieId;
      renterBody.json.addresses[0].involvedPartyId = involvePartieId;

      //POST request
      const response = await this.request.post(url, {
        headers: this.getHeaders(),
        data: JSON.parse(JSON.stringify(renterBody))
      });
       //Validate the status code of the reponse
       if (response.status() !== 200) {
        throw new Error(`POST request failed with status ${response.status()}`);
      }
    } catch (error: any) {
      throw error; // Rethrow the error after logging it
    }
  }

  /**
   * @function deleteClaim Deletes  the created test Claim 
   */
  async deleteClaim(url: string): Promise<void> {
    try {
      //POST request 
      const response = await this.request.post(url, {
        headers: this.getHeaders(),
        data: {
          "json": {
            "id": constants.testScriptsConstants.claimId
          }
        }
      });
      //Validate the status code of the reponse
      console.log("claim to be deleted " + constants.testScriptsConstants.claimId)
      if (response.status() !== 200) {
        throw new Error(`POST request failed with status ${response.status()}`);
      }
    } catch (error: any) {
      throw error; // Rethrow the error after logging it
    }
  }

  /**
   * @function listEmailsReq Requesto for login to user
   * @returns String with the user code
   */

  async listEmailsReq(emailName: string, userToken: string, emailId: string): Promise<string> {
    const url = `https://www.developermail.com/api/v1/mailbox/${encodeURIComponent(emailName)}/messages/${encodeURIComponent(emailId)}`;
    let userCode: string;
    try {
      const response = await this.request.get(url, {
        headers: this.usersHeaders(userToken),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseData = await response.json();
      const result = responseData.result as string;
      // Find the start of the email body
      const bodyStartIndex = result.indexOf("\r\n\r\n") + 4;
      const emailBody = result.substring(bodyStartIndex);
      // Regular expression to match the specific <p> tag
      const regex = /<p[^>]*>(.*?)<\/p>/;
      const codeMatch = emailBody.match(regex);
      if (codeMatch && codeMatch[1]) {
        userCode = codeMatch[1];
        console.log('Extracted Code:', userCode);
        return userCode;
      } else {
        throw new Error('Code not found in the email body.');
      }
    } catch (error: any) {
      throw Error('Error:', error);
    }
  }

/**
   * @function fetchEmailList makes a request to the user mailbox and 
   * @returns String with the email id 
   */

  async fetchEmailList(emailName: string, userToken: string): Promise<string> {
    const url = `https://www.developermail.com/api/v1/mailbox/${encodeURIComponent(emailName)}`;

    try {
      // Wait for a specified time before making the request (e.g., 10 seconds)
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Fetch list of message IDs present in the mailbox
      const response = await this.request.get(url, {
        headers: this.usersHeaders(userToken),
      });

      const responseData = await response.json();

      // Check if result is present and is an array
      const result = responseData.result;

      if (!Array.isArray(result) || result.length !== 1) {
        throw new Error("Expected exactly one email ID, but found none or multiple.");
      }

      // Return the only email ID in the result array
      return result[0];
    } catch (error: any) {
      // Handle or rethrow the error as needed
      throw new Error(`Failed to fetch email list: ${error.message}`);
    }
  }

/**
   * @function cleanMailBox makes a request to the user mailbox and removes the email id to always have 0 emails inside the mailbox
   */
  async cleanMailBox(emailName: string, userToken: string): Promise<void> {
    const urlMailbox = `https://www.developermail.com/api/v1/mailbox/${encodeURIComponent(emailName)}`;

    try {
      // Fetch list of message IDs present in the mailbox
      const mailBoxResponse = await this.request.get(urlMailbox, {
        headers: this.usersHeaders(userToken),
      });
      const mailboxData = await mailBoxResponse.json();
      const result = mailboxData.result;

      if (!Array.isArray(result) || result.length === 0) {
        throw new Error("No emails to delete.");
      }
      // Delete all messages in the mailbox
      const deletionPromises = result.map(async (element: string) => {
        const cleanMailboxUrl = `https://www.developermail.com/api/v1/mailbox/${encodeURIComponent(emailName)}/messages/${encodeURIComponent(element)}`;
        try {
          await this.request.delete(cleanMailboxUrl, {
            headers: this.usersHeaders(userToken),
          });
        } catch (error: any) {
          throw new Error(`Failed to delete email ID: ${element}`, error);
        }
      });

      // Wait for all deletions to complete
      await Promise.all(deletionPromises);
    } catch (error: any) {
      throw Error('Error:', error);

    }
  }



}
export default ApiFunctions