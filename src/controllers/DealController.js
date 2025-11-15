const Deal = require('../models/DealModel');
const { AppError } = require('../utils/error');

/**
 * 
 * @param {import("express").Request} req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 * @returns 
 */
const GetDeals = async (req , res ) =>{
    const deals = await  Deal.find();
    if (!deals){
        throw new AppError("Can't find deals or empty", 500);
    }
    res.status(200).json({
        success: "true",
    })
};