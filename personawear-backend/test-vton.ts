import { Client } from "@gradio/client";

async function testVton() {
  try {
    console.log("Connecting to yisol/IDM-VTON...");
    const client = await Client.connect("yisol/IDM-VTON");
    console.log("Connected! Checking endpoints...");
    
    // We would need to pass a human image and a garment image.
    // For now, let's just see if we can connect without throwing a 500 NameError.
    const endpoints = client.view_api();
    console.log("Endpoints:", endpoints);
    
    console.log("Successfully connected to IDM-VTON Space!");
  } catch (error) {
    console.error("Gradio Connection Error:", error);
  }
}

testVton();
