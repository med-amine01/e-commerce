const express = require('express');
const router = express.Router();
const { Item, validateItem } = require('../models/item');
const  mongoose = require('mongoose');


// Querying items with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Current page (default: 1)
    const limit = parseInt(req.query.limit) || 10; // Number of items per page (default: 10)
  
    try {
      const totalItems = await Item.countDocuments({});
      const totalPages = Math.ceil(totalItems / limit);
      const skip = (page - 1) * limit;
  
      const items = await Item.find({})
        .skip(skip)
        .limit(limit);
  
      res.status(200).json({
        items,
        currentPage: page,
        totalPages,
      });
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  

// Add item
router.post('/', async (req, res) => {
  const { error } = validateItem(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const newItem = new Item(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get item by ID
router.get('/:id', async (req, res) => {
  try {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given ID is not an ObjectId')
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update item by ID
router.put('/:id', async (req, res) => {
    
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(400).send('Given ID is not an ObjectId')

  const { error } = validateItem(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Delete item by ID
router.delete('/:id', async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.status(204).json();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
