// FILE: services/avatar.service.ts
import { v2 as cloudinary } from 'cloudinary';



export async function generateAvatarFromImage(imageBase64: string): Promise<string> {
  console.log('Step 1: Uploading image to Cloudinary and removing background...');
  
  // We explicitly want to block/wait for the Cloudinary AI background removal to finish
  // before returning the URL so the frontend can immediately display the 2D cutout.
  // The 'background_removal: cloudinary_ai' option enforces eager synchronous processing.
  
  const dataUri = imageBase64.startsWith('data:')
    ? imageBase64
    : `data:image/jpeg;base64,${imageBase64}`;

  console.log('Uploading original image to Cloudinary (this may take 5-15s for AI removal)...');
  const result = await cloudinary.uploader.upload(dataUri, {
    folder: 'personawear-avatars',
    resource_type: 'image',
    background_removal: 'cloudinary_ai',
  });

  console.log('Applying Cloudinary transformations: e_background_removal, e_trim...');
  // Generate the trimmed PNG URL (background is already removed by the AI add-on)
  const transparentImageUrl = cloudinary.url(result.public_id, {
    transformation: [
      { effect: 'background_removal' },
      { effect: 'trim' }
    ],
    format: 'png',
    secure: true
  });
  
  console.log('2D Digital Replica ready:', transparentImageUrl);

  return transparentImageUrl;
}
