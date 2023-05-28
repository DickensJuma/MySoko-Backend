const express = require('express');
const router = express.Router();

const Order = require('../models/Order');

// Get all orders
router.get('/order/all', async (req, res) => {
    try {
        const orders = await Order.find().populate('products').populate('user').exec();
        res.status(200).json(orders);
    } catch(error) {
        console.error('Error retrieving orders:', error);
        res.status(500).json({ message: 'Failed to retrieve orders' });
    }
    }
);

// Get a specific order
router.get('/order/:orderId', async (req, res) => {

    try {
        const order = await Order.findById(req.params.orderId).exec();
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
          }
      
          console.log(order);
        res.json(order);
    } catch(error) {
        res.status(500).json({ message: 'Failed to retrieve order' });

    }
    }

);

//get user orders
router.get('/order/user/:userId', async (req, res) => {

    try {
        const orders = await Order.find({user: req.params.userId}).populate('products').populate('user').exec();
        if (!orders) {
            return res.status(404).json({ message: 'Order not found' });
            }

            console.log("USER ORDERS NO",orders.length);
        res.status(200).json(orders);
    } catch(error) {
        res.status(500).json({ message: 'Failed to retrieve order' });

    }
    }

);


// Create an order
router.post('/order/create', async (req, res) => {
    
        const { products, total, quantity, size, color, user , status} = req.body;
        console.log("REQ BODY", req.body)
    
        const order = new Order({
            products: products,
            total: total,
            quantity: quantity,
            size: size,
            color: color,
            user: user,
            status: status,
        });
    
        try {
            const savedOrder = await order.save();
            res.status(200).json(savedOrder);
        } catch(error) {
            console.error('Error creating order:', error);
            res.status(500).json({ message: 'Failed to create order' });
        }
    }   
);

// Update an order
router.put('/order/update/:orderId', async (req, res) => {
    const { products, total, quantity, size, color, user, status } = req.body;
    console.log("I WASS CALLED")
    console.log(req.params.orderId)
    console.log(products, total, quantity, size, color, user, status)
    try {
        const updatedOrder = await Order.updateOne(
            { _id: req.params.orderId },
            { $set: { total, products, total, quantity, size, color, user, status } }
        );
        res.status(200).json(updatedOrder);
    } catch(error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({ message: 'Failed to update order' });
    }
    }
);

// Delete an order
router.delete('/order/:orderId', async (req, res) => {

    try {
        const removedOrder = await Order.remove({ _id: req.params.orderId });
        res.status(200).json(removedOrder);
    } catch(error) {
        console.error('Error retrieving order:', error);
        res.status(500).json({ message: 'Failed to delete order' });
    }
    }
);

module.exports = router;
