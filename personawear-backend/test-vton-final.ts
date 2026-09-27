import { Client, handle_file } from "@gradio/client";
import fs from "fs";
import https from "https";

// Helper to download image to local temp file
function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function testVtonFinal() {
  try {
    console.log("Downloading test images...");
    const personPath = "./temp_person.png";
    const garmentPath = "./temp_garment.png";
    
    await downloadFile("https://upload.wikimedia.org/wikipedia/commons/a/af/White_T-Shirt.png", personPath);
    await downloadFile("https://upload.wikimedia.org/wikipedia/commons/2/24/Blue_Tshirt.png", garmentPath);

    console.log("Connecting to yisol/IDM-VTON...");
    const client = await Client.connect("yisol/IDM-VTON");

    console.log("Predicting...");
    
    // We use array style as the Gradio client expects
    const result = await client.predict("/tryon", [
        {
            background: handle_file(personPath),
            layers: [],
            composite: null
        },
        handle_file(garmentPath),
        "A blue t-shirt", // garment_des
        true, // is_checked
        false, // is_checked_crop
        30, // denoise_steps
        42 // seed
    ]);

    console.log("Result:", JSON.stringify(result.data, null, 2));

    // Cleanup
    fs.unlinkSync(personPath);
    fs.unlinkSync(garmentPath);
    
  } catch (error) {
    console.error("Final Gradio Error:", error);
  }
}

testVtonFinal();
