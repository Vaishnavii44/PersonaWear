import { Router } from 'express';
import { uploadClothing, getWardrobe, deleteCollection, deleteItem, toggleFavorite, saveOutfit, getOutfits, deleteOutfit } from '../controllers/wardrobe.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// Protect these routes so only logged-in users can upload/view their closet
router.post('/upload', authenticate, uploadClothing);
router.get('/', authenticate, getWardrobe);
router.delete('/collection/:name', authenticate, deleteCollection);
router.delete('/item/:id', authenticate, deleteItem);
router.patch('/item/:id/favorite', authenticate, toggleFavorite);
router.post('/outfits', authenticate, saveOutfit);
router.get('/outfits', authenticate, getOutfits);
router.delete('/outfits/:id', authenticate, deleteOutfit);

export default router;