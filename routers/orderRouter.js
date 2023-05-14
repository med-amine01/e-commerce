const express = require('express');
const router = express.Router();
const { Order, validateOrder } = require('../models/order');

// Get all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email').populate('items.item', 'name price');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get a specific order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email').populate('items.item', 'name price');
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a new order
router.post('/', async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const order = new Order(req.body);
    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update an existing order
router.put('/:id', async (req, res) => {
  const { error } = validateOrder(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete an order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndRemove(req.params.id);
    if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
      res.json({ message: 'Order deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  

 // Update the status and quantity of an order
router.patch('/:id', async (req, res) => {
    const { id } = req.params;
    const { status, items } = req.body;
  
    try {
      const order = await Order.findById(id);
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      // Update the order status
      if (status) {
        order.status = status;
      }
  
      // Update the quantity in the store collection
      if (items) {
        for (const { item, quantity } of items) { // Updated line: use 'item' instead of 'itemId'
          const itemToUpdate = await Item.findById(item);
          if (!itemToUpdate) {
            return res.status(404).json({ error: `Item with ID ${item} not found` });
          }
  
          // Calculate the difference in quantity
          const quantityDifference = quantity - itemToUpdate.quantity;
  
          // Update the item quantity in the store collection
          itemToUpdate.quantity = quantity;
          await itemToUpdate.save();
  
          // Adjust the overall store quantity
          const store = await Store.findOneAndUpdate({}, { $inc: { quantity: quantityDifference } }, { new: true });
          if (!store) {
            return res.status(404).json({ error: 'Store not found' });
          }
        }
      }
  
      // Save the updated order
      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } catch (error) {
      res.status(500).json({ error: 'Internal server error ' + error.message });
    }
  });
  
  module.exports = router;
  
