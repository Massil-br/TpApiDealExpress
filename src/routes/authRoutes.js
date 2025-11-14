const express =require('express');
const router = express.Router();
const {registerController, loginController, profileController}  = require('../controllers/AuthController');
const { createUserValidation, loginValidation } = require('../validators/AuthValidation');
const { validate } = require('../models/UserModel');
const {authenticateUser} = require('../middlewares/authMiddleware');

router.post('/register', registerController, createUserValidation, validate );
router.post('/login', loginController, loginValidation,validate);
router.get('/me',authenticateUser,profileController);

module.exports = router;

