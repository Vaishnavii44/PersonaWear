import { Client } from "@gradio/client";

async function testVtonPrediction() {
  try {
    console.log("Connecting to yisol/IDM-VTON...");
    const client = await Client.connect("yisol/IDM-VTON");
    
    // We need to fetch an image to pass to the client
    const personUrl = "https://upload.wikimedia.org/wikipedia/commons/a/af/White_T-Shirt.png"; // just a placeholder
    const garmentUrl = "https://upload.wikimedia.org/wikipedia/commons/2/24/Blue_Tshirt.png";
    
    // Convert to Blobs
    const personResponse = await fetch(personUrl);
    const personBlob = await personResponse.blob();
    
    const garmentResponse = await fetch(garmentUrl);
    const garmentBlob = await garmentResponse.blob();

    console.log("Predicting...");
    const result = await client.predict("/tryon", [
        {"background":personBlob,"layers":[],"composite":null}, 
        garmentBlob, 
        "A blue t-shirt", 
        true, 
        false, 
        30, 
        42
    ]);

    console.log("Result:", result.data);
  } catch (error) {
    console.error("Gradio Prediction Error:", error);
  }
}

testVtonPrediction();
