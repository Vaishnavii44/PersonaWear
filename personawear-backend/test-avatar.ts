import dotenv from 'dotenv';
dotenv.config();

import { generateAvatarFromImage } from './src/services/avatar.service';
import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
  try {
    // Create a dummy base64 image (a tiny valid 1x1 transparent PNG)
    const base64Image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";
    console.log("Running avatar generation test...");
    const result = await generateAvatarFromImage(base64Image);
    console.log("Success! GLB URL:", result);
  } catch (error: any) {
    console.error("Test Failed with Error:", error.message);
  }
}

run();
