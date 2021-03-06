const express = require('express');

const Property = require('../models/property');

const router = express.Router();

//default route
router.get('/', async (req, res) => {
  return res.status(200).json({
    success: true,
  });
});

//make a room
//on */rooms
router.post('/room', async (req, res) => {
  try {
    const room = await Property.create(req.body);
    return res.status(201).json({
      success: true,
      data: room,
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'This store already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

//finde all the rooms
//on */rooms
router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Property.find();

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

//find rooms in redius of 50km where center is given location
// */rooms/kota
router.get('/rooms/:loc', async (req, res) => {
  const location = req.params.loc;
  const geoloc = await geocoder.geocode(location);
  let coords = [geoloc[0].longitude, geoloc[0].latitude];

  try {
    const rooms = await Property.find({
      location: { $geoWithin: { $centerSphere: [coords, 50 / 6378] } },
    });

    return res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
