const express = require('express')
const router = express.Router()
const UserController = require('../controllers/userControllers')
const {check} = require('express-validator')

router.get('/:userId',UserController.getUserById)
router.get('/get/AllUsers',UserController.findAll)
// router.use()
router.post('/login',
[
    check('email')
    .not()
    .isEmpty(),
    check('password')
    .not()
    .isEmpty()
]
,UserController.login)
router.post('/',[
    check('name')
    .not()
    .isEmpty(),
    check('email')
    .not()
    .isEmpty(),
    check('password')
    .not()
    .isEmpty()
]
,UserController.addUser)

module.exports = router