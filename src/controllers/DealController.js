const { AppError } = require('../utils/error');
const {DEAL_STATUS,Deal} = require('../models/DealModel');
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
        throw new AppError("Can't Process deals", 500);
    }
    const approvedDeals = [];
    deals.forEach(deal => {
        if (deal.status = DEAL_STATUS.APPROVED){
            approvedDeals.push(deal);
        }
    });
    res.status(200).json({
        success: "true",
        approvedDeals
    })
};



module.exports = {
    GetDeals,
}