import express from 'express';
import {ProductController} from '../controllers/ProductsController.js';
import { checkRole } from '../midlewares/auth.js';

const router = express.Router();



router.get('/', ProductController.getProducts);


router.get('/:pid', ProductController.getProductById);


router.post('/',  checkRole(['admin']), ProductController.createProduct );

router.delete('/:pid', checkRole(['admin']),ProductController.deleteProduct);


router.put('/:pid', checkRole(['admin']), ProductController.updateProduct);

export default router;



export { router as ProductRouter }