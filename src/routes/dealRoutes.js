const express =require('express');
const { GetDealsController, SearchDealsController,GetDealByIdController,AddDealController,ModifyDealByIdController,DeleteDealByIdController } = require('../controllers/dealController');
const {authenticateUser} = require("../middlewares/authMiddleware");
const {CreateDealValidation,SearchDealValidation, ModifyDealValidation} = require('../validators/dealValidation');
const { validate } = require('../models/userModel');
const router = express.Router();


router.get("/", GetDealsController);
router.get("/search",SearchDealValidation,SearchDealsController, validate);
router.get("/:id", authenticateUser, GetDealByIdController);
router.post("/",CreateDealValidation,authenticateUser,  AddDealController, validate );
router.put("/:id",authenticateUser, ModifyDealValidation ,ModifyDealByIdController, validate);
router.delete("/:id", authenticateUser, DeleteDealByIdController);


module.exports = router;