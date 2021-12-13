const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");
const https = require("https");
const { createAppAuth } = require("@octokit/auth-app");
const { Octokit } = require("@octokit/rest");
require("dotenv").config();

const main = async () => {
    const baseUrl = process.env.BASE_URL
        ? process.env.BASE_URL
        : "https://api.github.com";
    const installationOctokit = new Octokit({
        // authStrategy: createAppAuth,
        // auth: {
        //     appId: process.env.APP_ID,
        //     privateKey: fs.readFileSync(process.env.APP_PRIVATE_KEY, "utf8"),
        //     installationId: process.env.INSTALLATION_ID,
        // },
        baseUrl,
        auth: `token ${process.env.PAT}`,
    });

    const private_key = fs.readFileSync(process.env.PRIVATE_KEY_PATH, "utf8");
    const certificate = fs.readFileSync(process.env.CERTIFICATE_PATH, "utf8");

    const port = process.env.PORT;
    const GROUP = process.env.GROUP;

    let options = {
        key: private_key,
        cert: certificate,
    };

    https.createServer(options, app).listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

    const membership_add = async (event, res) => {
        try {
            console.log("membership_add found");
            console.log(event);
            let user;
            let group;
            // basically assumes only two targets in this array but doesn't care about order
            for (let target of event.target) {
                if (target.type === "User") {
                    user = target.alternateId;
                } else if (target.type === "UserGroup") {
                    group = target.displayName;
                }
            }
            console.log("Group membership add found");
            console.log(user);
            console.log(group);

            // create user
            if (group.toLowerCase() === GROUP.toLowerCase()) {
                installationOctokit.request("POST /admin/users", {
                    login: user.split("@")[0],
                    email: user,
                });
            }

            res.sendStatus(200);
        } catch (err) {
            console.log(err);
            res.sendStatus(500);
        }
    };

    const event_hook = async (req, res) => {
        const data = req.body.data;
        for (let event of data.events) {
            switch (event.eventType) {
                case "group.user_membership.add":
                    membership_add(event, res);
                    break;
                default:
                    console.log("No event type found");
                    res.sendStatus(404);
            }
        }
    };

    app.post("/", (req, res) => {
        if (req.body.eventType) {
            switch (req.body.eventType) {
                case "com.okta.event_hook":
                    event_hook(req, res);
                    break;
                default:
                    console.log("Unknown event type");
            }
        }
    });

    // Verification
    app.get("/", (req, res) => {
        res.send({
            verification: req.headers["x-okta-verification-challenge"],
        });
    });
};

main();
