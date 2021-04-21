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

module.exports = router
