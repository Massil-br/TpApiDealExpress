const express =require('express');
const { GetDealsController, SearchDealsController,GetDealByIdController,AddDealController,ModifyDealByIdController,DeleteDealByIdController } = require('../controllers/DealController');
const {authenticateUser} = require("../middlewares/authMiddleware");
const {CreateDealValidation,SearchDealValidation, ModifyDealValidation} = require('../validators/dealValidation');
const { validate } = require('../models/userModel');
const router = express.Router();
const {VoteValidation} = require('../validators/voteValidation');
const {VoteController}= require('../controllers/voteController');


//Deal routes
router.get("/", GetDealsController);
router.get("/search",SearchDealValidation,SearchDealsController, validate);
router.get("/:id", authenticateUser, GetDealByIdController);
router.post("/",CreateDealValidation,authenticateUser,  AddDealController, validate );
router.put("/:id",authenticateUser, ModifyDealValidation ,ModifyDealByIdController, validate);
router.delete("/:id", authenticateUser, DeleteDealByIdController);


//Vote routes
router.post("/:id/vote", authenticateUser,VoteValidation,VoteController,validate);


module.exports = router;