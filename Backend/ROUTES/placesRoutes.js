const express = require('express')
const router = express.Router()
const PlacesControllers = require('../controllers/placesControllers')
const {check} = require('express-validator')
const mongoDB = require('../mongoDB')

router.get('/:id',PlacesControllers.getPlacesByPlaceId)
router.get('/user/:uid',PlacesControllers.getPlacesByUserId)
router.get('/',PlacesControllers.form)

router.post('/addPlaces',
[
    check('title')
    .not()
    .isEmpty(),
    check('info')
    .not()
    .isEmpty(),

    check('desc')
    .not()
    .isEmpty(),
    
    check('user')
    .not()
    .isEmpty()
]
,PlacesControllers.addPlaces)

router.patch('/update/:pid',PlacesControllers.updateById)
router.delete('/delete/:pid',PlacesControllers.deletePlace)





module.exports = router