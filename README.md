# Okta Webhook handler

This project utilizes expressjs to listen for a single okta request (group.user_membership.add) and add's a user to your github server when it is found

## Setup
Setup involves a few pieces.  Firstly you a machine somewhere to run this code.  Second you need to set up Okta to send webhooks to that server.
### Express Server 
-   Clone the repository
-   Install the dependencies
    -   `npm install`
-   Copy `.env.example` to `.env` and fill out the information  

| Environment Variable  | Description     | 
|-----------------------|--------------------------------------------------------------------------------|
| PORT                  | Port to listen for events     | 
| PRIVATE_KEY_PATH      | SSL Private Key path  |
| CERTIFICATE_PATH      | SSL Private Key Certificate Path |
| GROUP                 | Okta group on which we are adding users |
| BASE_URL              | Base URL for your github instance in the form "https://<instance url>/api/v3" |
| PAT                   | Personal Access Token of the user making requests to the GitHub API | 

-   Finally run the server
    -   `node index.js`
    -   _Note:_ Okta requires ssl enabled so you may have to setup your certificates first. See [Let's Encrypt](https://certbot.eff.org/instructions?ws=other&os=ubuntufocal) for a fast solution.

### Okta Webhooks
- Open the Okta Event Webhooks page
![Screen Shot 2021-12-16 at 2 38 29 PM](https://user-images.githubusercontent.com/1758164/146445685-299885c4-2d6b-4773-bb04-3b31e35bc8fb.png)
- Add a new webhook
![Screen Shot 2021-12-16 at 2 39 20 PM](https://user-images.githubusercontent.com/1758164/146445750-7d3462fb-db3c-43cc-9319-58b6f6b20697.png)
- Add the DNS entry to your webhook and select `user added to group` event to listen to
![Screen Shot 2021-12-16 at 2 40 30 PM](https://user-images.githubusercontent.com/1758164/146445907-c4a9ed87-5f2c-429c-b640-b6a26d61b2a6.png)
- Click `Save and Continue`
- Finally select `Verify`
  - This sends a verification event to the server and will immediately respond that the server is verified
![Screen Shot 2021-12-16 at 2 43 07 PM](https://user-images.githubusercontent.com/1758164/146446186-de9af25d-e7db-45e4-ad72-407fa1f035cb.png)
