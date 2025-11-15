const express =require('express');
const { GetDeals } = require('../controllers/DealController');
const router = express.Router();


router.get("/", GetDeals);



module.exports = router;