import{APIRequestContext} from '@playwright/test'
import fs from 'fs';
import constants from '../../data/constants.json';



class ApiFunctions{
    readonly request : APIRequestContext;
    readonly claimId : string = 'idClaim.tx';
    readonly authtoken : string;

    constructor(request : APIRequestContext){
        this.request = request;
        this.authtoken = constants.testScriptsConstants.authToken;
    } 

    headers(){
        return{
            'Accept': 'application/json',
            'Cookie': '__Secure-next-auth.session-token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMjU2R0NNIn0..XqduJE7UiITBYrtt.ONR9OhNQgoipxlMHqe2fgEF46QQpR_jldqwpm3z2OjQmpkT3oc-Mm-LStSsDRVM8kjcUos4W18dLvId5eQMeE6JMS3IqxMba-y7JLt3ngEdluvh4aOrsOyGcLUlc7TkjLQu6-5zc9S0MRF5sgiP9oavBDm8F-vaJbATxVpcR3VpM-ER3V-2aU2kEKsnSafChrQOOZI2UCRo-4_mopy3HbzGkkKmDe5uPBQ7vOBv1hyOa5ilK4D95sAizTwXxPAhdVQV8852GyzC1VdAqlwmdD0pwOKbDfSfH4JqR9O_rZYofHdUBpIeRn4uLiD74Uxn_8uqzpJfyvKQ2RUXfx6mdx3QuX7nivM9GxClDp3lcSRT2SiVyLA4shYH8OJTGHJZVbglJHPVz0K95nlODf-TGAdQ2AE9MjJDty6R5N0TgHsftb2O2VAMJMUDL2QJUS2NHW34r7gkMwArjqnaNMSTDYSjzsiOwlXxyXGr2Vo76RWx8ihj8mOlO-ZIK5aHbrhBKPtpQ9gyVMQX7hob0AS4jfMnKeKnWuGV5IpOmZQOTgt_Y0sKiU7s_30y5tAugUa2S1rkVQXwhR2qMgS_s0Kins5y0gbwhw_o7lEAfvVeDagyTYGCR155DXLo00FP-jsQLk61TCWAWMljgzUspJk2K0-TWPOLZDFuCYzmh78PFgceLMCh3wEbO7hAx6Xy3zH-1tS-YYq9cuTpIva-Q73xnPaXDVqc3FApqUFN9pVqZyUsafgutVQgVQbRZTCPK62c4yZ_pJiXmhrDO1JRNqfvHrE4Onqc1Wa5-vctfl_3L3dImbgEU7KJ8F4tlGTog2dhKvaRUWTVLZOf_tK3hSPvu_V-VGCZ5to8MbtO8FHIvXKhjvZ_4BeNwxkL6vTPBNao8TCHzm1KE9o1VQ_y9nWH19ntD2VYJCZyDkV4Um9PYhx82WtHrwyLE951vCN9UkftK7pGBn0LVcNxzdn77aEz0ZgiSd0iqKrHAywd6XMEMzEHEc8UMya484Q_ecfAi-C1rMV6FJ3UOFP2X8WEC0di-PfFhq8P08LU.0jMKuGmgwtJeiGakrwBxYg',
            'Content-Type': 'application/json'
        }
    }

    async getAuth(){
      console.log(this.headers());
      const response = await this.request.get('https://staging-purco-cms.herokuapp.com/api/auth/session',{
        headers: this.headers()
      });

      console.log(response.json());
      console.log(response.status());
    }

    async claimCreationPostRequest(url: string, body: object) {
        const response = await this.request.post(url, {
          headers: this.headers(),
          data: JSON.stringify(body),
        });
        
        if (response.status() !== 200) {
          console.error(`POST request failed with status ${response.status()}`);
          console.error(await response.text());
        }

        const responseData = await response.json();
        // Write the updated data back to the JSON file
        console.log("Headers "+response.headers());
        console.log("Body "+response.body())
        console.log(response.status());
        console.log(responseData);
       fs.writeFileSync(this.claimId, responseData.id.trim());
        constants.testScriptsConstants.claimNumber = responseData.claimNumber;
        console.log("new claim number was added");
        constants.testScriptsConstants.renterEmail = responseData.renterEmail;
        console.log("new claim email was added");
        return responseData;
      }

      async claimInvolParGet(url: string){
        const response = await this.request.get(url,{
            headers: this.headers(),
        });

        const responseData = await response.json();

        return responseData;
      }

      async InvolveParAccessPost(url: string, body: Object){
        const response = await this.request.post(url, {
            headers: this.headers(), 
            data: body,
        });

        const responseData = await response.json();
        return responseData;
      }

      // Method to combine GET and POST requests
        async processInvolvedParties(getUrl: string, postUrl: string) {
    // Perform GET request
        const getResponseData = await this.claimInvolParGet(getUrl);

    // Modify the response data
        getResponseData.hasSystemAccess = true;

    // Perform POST request with modified data
        const postResponseData = await this.InvolveParAccessPost(postUrl, getResponseData);

        return postResponseData;
    }

      generateUrl(): string {
        const claimId = fs.readFileSync(this.claimId, 'utf-8').trim();
        return `https://staging-purco-cms.herokuapp.com/api/trpc/involvedParties.list?input=%7B%22json%22%3A%7B%22claimId%22%3A%22${encodeURIComponent(claimId)}%22%7D%7D`;
      }

      

}
export default ApiFunctions