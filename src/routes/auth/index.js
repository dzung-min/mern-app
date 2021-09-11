const router = require('express').Router()

const authCtrl = require('../../controllers/auth.controller')

router.post('/signin', authCtrl.signin)
router.get('/signout', authCtrl.signout)

module.exports = router
