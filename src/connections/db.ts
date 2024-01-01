import mongoose from "mongoose";
require("dotenv").config();

export const dbConection = async () => {
  await mongoose
    .connect(process.env.DB_URL as string)
    .then((res) => {
      console.log("db connected successfully");
    })
    .catch((error: Error) => {
      console.log("error to connect Database", error);
    });
};
