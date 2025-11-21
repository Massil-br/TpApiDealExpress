const express =require('express');
const router = express.Router();
const {registerController, loginController, profileController}  = require('../controllers/AuthController');
const { createUserValidation, loginValidation } = require('../validators/AuthValidation');
const { validate } = require('../models/UserModel');
const {authenticateUser} = require('../middlewares/authMiddleware');

router.post('/register',createUserValidation, registerController, validate );
router.post('/login',loginValidation, loginController, validate);
router.get('/me',authenticateUser,profileController);

module.exports = router;

