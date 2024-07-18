# PurcoPOC
Automation implementation with Playwright
## Environment Variables

To set up the environment variables, follow these steps:

1. Copy the .env.template file:

Create a new file named .env in the root directory of your project by copying the contents of the .env.template file.

cp .env.template .env

2. Get the Cookie Token:
Log in to the Purco app.
Retrieve the session token from the response header.

3. Set the Cookie in the .env File:
Open the .env file and set the COOKIE variable with the session token obtained in the previous step. Your .env file should look like this:

# .env file
COOKIE="paste your cookie here"
