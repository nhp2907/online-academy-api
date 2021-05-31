const { Op } = require('sequelize');
const Coupon = require('../models/coupon');

module.exports = {
    async getCouponByCode(code) {
        const coupon = await Coupon.findOne({
            attributes: ['id','name','percentDiscount','amountDiscount','endDate', 'code'],
            where: {
                code: code
            }
            }
        )
        if(coupon === null) return null;
        return coupon.toJSON();
    },
}