import { Client, handle_file } from '@gradio/client';
import fs from 'fs';

async function testTrellis() {
  try {
    console.log("Connecting to Stable Fast 3D space...");
    const app = await Client.connect("stabilityai/stable-fast-3d");
    
    // Print predict details
    const endpoints = app.config!.dependencies.map((d: any) => d.api_name);
    console.log("Available endpoints:", endpoints);
    
  } catch (err) {
    console.error("Test failed:", err);
  }
}

testTrellis();
