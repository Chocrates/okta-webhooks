# Okta Webhook handler

This project utilizes expressjs to listen for a single okta request (group.user_membership.add) and add's a user to your github server when it is found

## Setup

-   Copy `.env.example` to `.env` and fill out the information
-   Clone the repository
-   Install the dependencies
    -   `npm install`
-   Finally run the server
    -   `node index.js`
    -   _Note:_ Okta requires ssl enabled so you may have to setup your certificates first. See [Let's Encrypt](https://certbot.eff.org/instructions?ws=other&os=ubuntufocal) for a fast solution.
