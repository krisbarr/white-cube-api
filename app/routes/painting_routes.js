const express = require('express')
const router = express.Router()
const customErrors = require('../../lib/custom_errors')
const passport = require('passport')
const requireToken = passport.authenticate('bearer', { session: false })
const handle404 = customErrors.handle404
const requireOwnership = customErrors.requireOwnership
const removeBlanks = require('../../lib/remove_blank_fields')
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
  .then(handle404)
  //if there are respond with 201 and paintings object
  .then(paintings => res.status(201).json({ paintings }))
  //continue down the middleware chain
  .catch(next)
})

//PATCH -update- paintings
router.patch('/paintings/:id', requireToken, (req, res,next) => {
  //access painting ID so correct painting can be found
  const paintingId = req.params.id
  //access painting data to be used for update
  const paintingData = req.body.painting
  //access user ID to compare to owner ID
  const userId = req.user.id
  delete paintingData.owner
  //find painting by ID
  Painting.findById(paintingId)
    .then(handle404)
    .then(painting => {
      requireOwnership(req, painting)
      return painting.updateOne(paintingData)
    })
    .then(() => res.sendStatus(204))
    .catch(next)
  })
// DELETE -destroy- paintings
router.delete('/paintings/:id', requireToken, (req, res, next) => {
  const paintingId = req.params.id
  Painting.findById(paintingId)
  .then(handle404)
  .then(painting => {
    requireOwnership(req, painting)
    painting.deleteOne()
  })
  .then(() => res.sendStatus(204))
  .catch(next)
})

module.exports = router
