const { validateCollection, Collection } = require('../models/collection');
const express = require('express');
const authenticate = require('../middleware/authenticate');
const router = express.Router();
const verifyOwner = require('../middleware/verifyOwner');

router.get('/', verifyOwner, async (req, res) => {
    const collections = await Collection.find({ owner: req.body.owner}).sort('name');
    res.send(collections);
});

router.get('/:name', verifyOwner, async (req, res) => {
  const collections = await Collection.find({ name: req.body.name});
  res.send(collections);
});

router.post('/', [authenticate, verifyOwner], async (req, res) => {
    const { error } = validateCollection(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    try {
        const collection = new Collection(req.body);
        await collection.save();
        res.send(collection);
    } catch (error) {
        await res.status(400).send(error.message);
    }
});

router.put('/:name', [authenticate, verifyOwner], async (req, res) => {

  //Luego cambiar esto para usar los metodos de mongoose (FindByIdAndUpdate, UpdateOne, etc) para ver cuál sirve más en esta situación revisando la doc.

    try {
      const collection = await Collection.find({ name: req.body.name });
      const items = collection.items;
      console.log(items);
      res.send(200);
    } catch (error) {
      await res.status(400).send(error.message);
    }
});



module.exports = router;