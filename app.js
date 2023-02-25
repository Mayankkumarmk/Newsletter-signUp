const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.get("/", function(req, res){
  res.sendFile(__dirname+"/sign.html")
});

app.post("/", function(req, res){
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;
  const data ={
    members:[
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fName,
          LNAME: lName
        }
      }
    ]
  }
  const jsonData = JSON.stringify(data);

  const url = "https://us14.api.mailchimp.com/3.0/lists/94d50f1534";
  const options = {
    method: "POST",
    auth: "Mayank1:93337366d9701aa138dc5736468f3a45-us14"
  }
  const request = https.request(url, options, function(response){


    response.on("data", function(data){
      console.log(JSON.parse(data));
      // console.log(response.statusCode);
    })

    if(response.statusCode === 200 ){
      res.sendFile(__dirname+"/success.html");
    }else{
      res.sendFile(__dirname+"/failure.html");
    }

  });

  request.write(jsonData);
  request.end();


});

app.post("/failure", function(req, res){
  res.redirect("/")
})


 app.listen(process.env.PORT ||3000, function(){
   console.log("server is running");
 });
