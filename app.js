const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const md5 = require('md5')

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})


app.post("/", (req, res) => {
    const fname = req.body.firstName;
    const lname = req.body.lastName;
    const email = req.body.emailAddress;

    //Autheticating the api call
    mailchimp.setConfig({
        apiKey: "7dc6951670037d904092baa22d733aa5-us12",
        server: "us12"
    });

    async function run() {
        const response = await mailchimp.ping.get();
        console.log(response);
    }

    run();


    // Subscribed the user to the batch list

    // let flag = 0;
    // const listId = "0144c1e053";
    // const subscribingUser = {
    //     firstName: fname,
    //     lastName: lname,
    //     email: email
    // };

    // async function addUser() {
    //     const response = await mailchimp.lists.addListMember(listId, {
    //         email_address: subscribingUser.email,
    //         status: "subscribed",
    //         merge_fields: {
    //             FNAME: subscribingUser.firstName,
    //             LNAME: subscribingUser.lastName
    //         }
    //     });

    //     console.log(
    //         `Successfully added contact as an audience member. The contact's id is ${response.id
    //         }.`
    //     );
    // }

    // addUser();

    const md5 = require("md5");

    const listId = "0144c1e053";
    const subscriberHash = md5(email.toLowerCase());

    async function verify() {
    try {
        const response = await mailchimp.lists.getListMember(
        listId,
        subscriberHash
        );

        res.send(`This user's subscription status is ${response.status}.`);
    } catch (e) {
        if (e.status === 404) {
            console.error(`This email is not subscribed to this list`, e.status);
            res.send(`This email is not subscribed to this list`);
        }
    }
    }
    verify();

});

//Api Key
// 7dc6951670037d904092baa22d733aa5-us12

//listid
//0144c1e053


app.listen(3000, function () {
    console.log("Server is running of port 3000.");
})