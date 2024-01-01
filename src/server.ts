import express, { Express, Request, Response } from "express";
import bodyParser = require("body-parser");
import { dbConection } from "./connections/db";
import user from "./model/user";
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

// Database connection----
dbConection();

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is Running!!");
});

// Your existing code for /generateOTP route
app.post("/generateOTP", async (req: Request, res: Response) => {
  try {
    registeredPhoneNumber = req.body.phoneNumber;

    // Generate a random 4-digit OTP
    generatedOTP = Math.floor(1000 + Math.random() * 9000).toString();

    const isUniquePhone = await user.findOne({
      phoneNumber: registeredPhoneNumber,
    });

    if (isUniquePhone) {
      // Send an otp to the client
      try {
        // await sendSMS(from, phoneNumber, generatedOTP);
        console.log("generatedOTP", generatedOTP);
        res.status(200).json({
          success: true,
          message: `Welcome Back  ${registeredPhoneNumber}.`,
        });
      } catch (error) {
        res
          .status(401)
          .json({ success: false, message: "some error occured!" });
      }
    } else {
      // Send an otp to the client
      try {
        // await sendSMS(from, phoneNumber, generatedOTP);
        console.log("generatedOTP", generatedOTP);
        res
          .status(200)
          .json({ success: true, message: "OTP generated successfully." });
      } catch (error) {
        res
          .status(401)
          .json({ success: false, message: "some error occured!" });
      }
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Add logic for /verifyOTP route
app.post("/verifyOTP", async (req: Request, res: Response) => {
  try {
    const { phoneNumber, enteredOTP } = req.body;

    // Compare enteredOTP with storedOTP
    if (enteredOTP === generatedOTP && registeredPhoneNumber === phoneNumber) {
      const isOldUser = await user.find({ phoneNumber });
      if (isOldUser.length >= 1) {
        res.status(200).json({
          loggedUser: isOldUser,
          success: true,
          message: "OTP verified & loggedIn old",
        });
      } else {
        const loggedUser = await user.create({
          phoneNumber,
        });
        res.status(200).json({
          loggedUser,
          success: true,
          message: "OTP verified & loggedIn new",
        });
      }
    } else {
      res.status(401).json({ success: false, message: "Invalid OTP." });
    }
  } catch (error) {
    // Send an error response to the client
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
