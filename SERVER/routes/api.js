var express = require('express');
var router = express.Router();
const { protect } = require('../middleware/auth');

// Sample data
const data = {
  items: [
    { id: 1, name: 'Item 1', description: 'First item description' },
    { id: 2, name: 'Item 2', description: 'Second item description' },
    { id: 3, name: 'Item 3', description: 'Third item description' }
  ]
};

/* GET API data - public route */
router.get('/data', function(req, res) {
  res.json(data);
});

/* POST new item - protected route */
router.post('/data', protect, function(req, res) {
  const newItem = {
    id: data.items.length + 1,
    name: req.body.name || 'New Item',
    description: req.body.description || 'No description provided'
  };
  
  data.items.push(newItem);
  res.status(201).json(newItem);
});

/* GET single item */
router.get('/data/:id', function(req, res) {
  const id = parseInt(req.params.id);
  const item = data.items.find(item => item.id === id);
  
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  res.json(item);
});

/* DELETE item - protected route */
router.delete('/data/:id', protect, function(req, res) {
  const id = parseInt(req.params.id);
  const itemIndex = data.items.findIndex(item => item.id === id);
  
  if (itemIndex === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }
  
  const deletedItem = data.items.splice(itemIndex, 1)[0];
  res.json({ message: 'Item deleted', item: deletedItem });
});

module.exports = router;
