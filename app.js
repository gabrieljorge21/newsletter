const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
  extended: true
}));

//main page
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html")
});

//it triggers when a post is requested
//in this case clicking the signup button
app.post("/", function(req, res) {
  const firstName = req.body.fname;
  const lastName = req.body.lname;
  const email = req.body.email;

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: firstName,
        LNAME: lastName
      }
    }]
  };

  //converting the json file to string
  const jsonData = JSON.stringify(data);

  //parameters
  const url = "https://us18.api.mailchimp.com/3.0/lists/17f4cb4dee";

  const options = {
    method: "POST",
    auth: "gabo1:ac5dac039f20b04527064b00f6cadb3e-us18"
  }

  //requesting
  const request = https.request(url, options, function(response) {

    //200 code -> OK
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }

    response.on("data", function(data) {
      console.log(JSON.parse(data));
      console.log(response.statusCode);

    })
  })

  //sending to api
  request.write(jsonData);
  request.end();

});

//for try again button
app.post("/failure", function(req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

//ac5dac039f20b04527064b00f6cadb3e-us18
//17f4cb4dee
