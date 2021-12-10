const express = require("express");
const app = express();
app.use(express.json());
const port = 3000;

const membership_add = async (data, res) => {
    console.log("membership_add found");
    console.log(data);
    res.sendStatus(200);
};

const event_hook = async (req, res) => {
    const data = req.body.data;
    for (let event of data.events) {
        switch (event.eventType) {
            case "group.user_membership.add":
                membership_add(data, res);
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
