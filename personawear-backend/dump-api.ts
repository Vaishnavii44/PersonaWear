import { Client } from "@gradio/client";
import fs from "fs";

async function dumpApi() {
  try {
    const client = await Client.connect("yisol/IDM-VTON");
    const endpoints = await client.view_api();
    fs.writeFileSync("vton-api.json", JSON.stringify(endpoints, null, 2));
    console.log("Dumped API spec to vton-api.json");
  } catch(e) {
    console.error(e);
  }
}
dumpApi();
