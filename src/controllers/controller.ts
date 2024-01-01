import { Request, Response } from "express";
import user from "../model/user";
import { validateIndianPhoneNumber } from "../common/common";

const Home = (req: Request, res: Response) => {
  res.send("Express + TypeScript Server is Running!!");
};

let generatedOTP = "";
let registeredPhoneNumber = "";

const generateOTP = async (req: Request, res: Response) => {
  try {
    registeredPhoneNumber = req.body.phoneNumber;

    if (!validateIndianPhoneNumber(registeredPhoneNumber)) {
      res.status(400).json({
        success: true,
        message: `invalid phone number!!`,
      });
    } else {
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
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

const verifyOTP = async (req: Request, res: Response) => {
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
};
module.exports = { Home, generateOTP, verifyOTP };
