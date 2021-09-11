const router = require('express').Router()

const userCtrl = require('../../controllers/user.controller')
const authCtrl = require('../../controllers/auth.controller')

router.route('/').get(userCtrl.list).post(userCtrl.create)

router
  .route('/:id')
  .all(authCtrl.requireSignIn, authCtrl.hasAuthorization)
  .get(userCtrl.read)
  .patch(userCtrl.update)
  .delete(userCtrl.remove)

router.param('id', userCtrl.getById)

module.exports = router
