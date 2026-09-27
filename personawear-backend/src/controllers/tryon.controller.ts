import { Request, Response } from 'express';

interface AuthRequest extends Request {
  user?: any;
}

export const generateTryOn = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { personImage, garmentImage, garmentDescription } = req.body;

    if (!personImage || !garmentImage) {
      res.status(400).json({ error: 'Both a person image and a garment image are required.' });
      return;
    }

    console.log('🧪 Virtual Try-On: Connecting to HuggingFace IDM-VTON...');

    // Dynamic import because @gradio/client is ESM-only
    const { Client, handle_file } = await import('@gradio/client');

    const client = await Client.connect("yisol/IDM-VTON");

    // Convert base64 data URIs to Blobs for the Gradio API
    const personBlob = base64ToBlob(personImage);
    const garmentBlob = base64ToBlob(garmentImage);

    console.log('🧪 Virtual Try-On: Sending images to AI model (this may take 30-90s)...');

    const result = await client.predict("/tryon", {
      dict: {
        "background": personBlob,
        "layers": [],
        "composite": null
      },
      garm_img: garmentBlob,
      garment_des: garmentDescription || "A high-quality clothing garment",
      is_checked: true,
      is_checked_crop: true,
      denoise_steps: 30,
      seed: Math.floor(Math.random() * 10000), // Randomize seed for better variations
    });

    console.log('🧪 Virtual Try-On: AI generation complete!');

    // The result contains generated images
    const data = result.data as any[];
    
    if (data && data.length > 0) {
      // The first element is typically the try-on result image
      const resultImage = data[0];
      let imageUrl: string;

      if (typeof resultImage === 'object' && resultImage.url) {
        imageUrl = resultImage.url;
      } else if (typeof resultImage === 'string') {
        imageUrl = resultImage;
      } else {
        throw new Error('Unexpected response format from AI model');
      }

      res.status(200).json({ 
        status: 'success', 
        data: { imageUrl } 
      });
    } else {
      throw new Error('No image was returned from the AI model');
    }

  } catch (error: any) {
    console.error('Try-On Error:', error);
    
    let message = 'Virtual try-on failed. Please try again.';
    if (error.message?.includes('queue')) {
      message = 'The AI model is currently busy. Please wait a moment and try again.';
    } else if (error.message?.includes('connect')) {
      message = 'Could not connect to the AI model service. Please try again later.';
    }
    
    res.status(500).json({ error: message });
  }
};

/**
 * Convert a base64 data URI string to a Blob object.
 */
function base64ToBlob(base64DataUri: string): Blob {
  // Remove the data URI prefix (e.g., "data:image/png;base64,")
  const parts = base64DataUri.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const binaryString = Buffer.from(parts[1], 'base64');
  return new Blob([binaryString], { type: mime });
}
