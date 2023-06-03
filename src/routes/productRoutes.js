const express = require('express');
const router = express.Router();
const Product = require('../models/Product');




//get all products
router.get('/product/all', async (req, res) => {

  
     try {
          const products = await Product.find();
    
    
         res.status(200).json(products);
     } catch(error) {
          res.status(200).json({ message: error });
     }
     }
);

//get a specific product
router.get('/product/update/:productId', async (req, res) => {

        try {
            const product = await Product.findById(req.params.productId).exec();
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
                }

            console.log(product);
            res.status(200).json(product);
        } catch(error) {
            return res.status(500).res.json({ message: error });
        }
        }
    );







// Create a product
router.post('/product/create', async (req, res) => {



const { product_name, product_price, product_description, product_image, product_category, product_quantity, user_id, moq } = req.body;


    const product = new Product({
        product_name: product_name,
        product_price: product_price,
        product_description: product_description,
        product_image: product_image,
        product_category: product_category,
        product_quantity: product_quantity,
        moq: moq,
        user: user_id,
        visible: true,

    });


    try {

        const savedProduct = await product.save();
        res.status(200).json(savedProduct);
    }
    catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Failed to create product' });
    }




    


});



// Update a product

router.put('/product/update/:productId', async (req, res) => {
    const productId = req.params.productId;

    const { product_name, product_price, product_description, product_image, product_category, product_quantity, user_id, visible, moq } = req.body;

    try {
    
        const updatedProduct = await Product.findByIdAndUpdate(productId, {product_name, product_price, product_description, product_image, product_category, product_quantity, user_id, visible, moq}, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch(error) {
        return res.status(500).res.json({ message: error });
    }
    }
);




// Delete a product

router.delete('/product/:productId', async (req, res) => {
    const productId = req.params.productId;

    try {

        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' })
    } catch(error) {
        return res.status(500).res.json({ message: error });
    }
    }
);







module.exports = router;
