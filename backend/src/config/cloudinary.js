import dotenv from "dotenv";
dotenv.config(); 

import { v2 as cloudinary } from "cloudinary";

// console.log("CLOUD:", process.env.CLOUD_NAME);
// console.log("KEY:", process.env.API_KEY);
// console.log("SECRET:", process.env.API_SECRET);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

export default cloudinary;