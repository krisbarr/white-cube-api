const express = require('express')
const router = express.Router()
const errors = require('../../lib/custom_errors')
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
//require models
const Painting = require('../models/painting')

//POST -create- /paintings
router.post('/paintings', requireToken, (req, res, next) => {
  //access data from request using req.body
  const paintingData = req.body.painting
  //set owner key to the user's ID
  paintingData.owner = req.user.id
  //create new painting with request data
  Painting.create(paintingData)
    //respond with 201 and new painting object
    .then(painting => res.status(201).json({ painting: painting }))
    //continue down the middleware chain
    .catch(next)
})

//GET -index- /paintings
router.get('/paintings', requireToken, (req, res, next) => {
  // access owner ID with req.user
  const ownerId = req.user.id
  //find paintings owned by that user
  Painting.find({ owner: ownerId})
  //if there is no paintings for that owner, send error
  .then(errors)
  //if there are respond with 201 and paintings object
  .then(paintings => res.status(201).json({ paintings }))
  //continue down the middleware chain
  .catch(next)
})
module.exports = router
