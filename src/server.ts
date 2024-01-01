import express, { Express, Request, Response } from "express";
import bodyParser = require("body-parser");
import { dbConection } from "./connections/db";
const routes = require("./routes/route");
const { Vonage } = require("@vonage/server-sdk");
const vonage = new Vonage({
  apiKey: "b87000d3",
  apiSecret: "txALRC096s7nVVOf",
});

require("dotenv").config();

// console.log("dotev", process.env.DB_URL);

let generatedOTP = "";
let registeredPhoneNumber = "";
const from = "openstore";
const to = "919102227592";
const text = "A text message sent using the Vonage SMS API";

async function sendSMS(
  from: String,
  phoneNumber: String,
  generatedOTP: String
) {
  await vonage.sms.send({
    to: phoneNumber,
    from,
    text: ` your openstore OTP  is -  ${generatedOTP}`,
  });
}

const app: Express = express();
const port = process.env.PORT || 5500;
app.use(bodyParser.json());
app.use(routes);

// Database connection----
dbConection();

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
