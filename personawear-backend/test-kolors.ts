import { Client } from "@gradio/client";

async function testKolors() {
  try {
    console.log("Connecting to Kwai-Kolors/Kolors-Virtual-Try-On...");
    const client = await Client.connect("Kwai-Kolors/Kolors-Virtual-Try-On");
    
    console.log("Connected! Fetching test images...");
    const personResponse = await fetch("https://upload.wikimedia.org/wikipedia/commons/a/af/White_T-Shirt.png");
    const personBlob = await personResponse.blob();
    
    const garmentResponse = await fetch("https://upload.wikimedia.org/wikipedia/commons/2/24/Blue_Tshirt.png");
    const garmentBlob = await garmentResponse.blob();

    console.log("Predicting (this might take 30-60s on free tier)...");
    
    // Most VTON spaces expect (person_img, garment_img, seed, randomize_seed)
    // Let's check endpoints first
    const endpoints = client.view_api();
    console.log("Endpoints:", endpoints);

    const result = await client.predict("/tryon", [ 
        {"background":personBlob,"layers":[],"composite":null}, // person image
        garmentBlob, // garment image
        "A blue t-shirt", // prompt/description
        true, // is_checked
        false, // is_checked_crop
        30, // denoise_steps
        42, // seed
    ]);

    console.log("Result:", result.data);
  } catch (error) {
    console.error("Gradio Kolors Error:", error);
  }
}

testKolors();
