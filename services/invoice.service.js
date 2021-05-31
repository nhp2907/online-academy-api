const { Op } = require('sequelize');
const Coupon = require('../models/coupon');
const Course = require('../models/course');
const Instructor = require('../models/instructor');
const Invoice = require('../models/invoice');
const InvoiceCourse = require('../models/invoice-course');
const InvoiceStatus = require('../models/invoice-status');
const PaymentType = require('../models/payment-type');
const User = require('../models/user');
const UserCourse = require('../models/user-course');

module.exports = {
    async getUnPaymentInvoice(userid) {
        const invoice = await Invoice.findOne({
            attributes: ['id','totalPrice'],
            include:[{
                model: Course,
                attributes: ['id','image','price','prePrice','name'],
                include:{
                    model: Instructor,
                    as: 'instructor',
                    attributes: ['id'],
                    include: {
                        model: User,
                        as: 'basicInfo',
                        attributes: ['id', 'firstName', 'lastName']
                    }
                }
            },{
                model: Coupon,
                attributes: ['id','name','percentDiscount','amountDiscount','endDate'],
                where: {}
            },{
                model: PaymentType,
                attributes: [],
                where: {
                    id: 8
                }
            },{
                model: User,
                attributes: [],
                where: {
                    id: userid
                }
            },{
                model: InvoiceStatus,
                attributes: [],
                where: {
                    id: 1
                }
            }]
            }
        )
        if(invoice === null) return null;
        return invoice.toJSON();
    },

    async updateInvoice(invoiceid, orderdate, refunddate, invoicestatus, user, paymenttype, coupon) {
        var updateParams = {};
        if(orderdate !== null) updateParams['orderDate'] = orderdate;
        if(refunddate !== null) updateParams['refundDate'] = refunddate;
        if(invoicestatus !== null) updateParams['invoiceStatusId'] = invoicestatus;
        if(user !== null) updateParams['userId'] = user;
        if(paymenttype !== null) updateParams['paymentTypeId'] = paymenttype;
        if(coupon !== null) updateParams['couponId'] = coupon;

        const updateResult = await Invoice.update(
            updateParams,
            { 
                where: { 
                    id: invoiceid
                } 
            }
        );
        if(updateResult === null) return null;
        return updateResult;
    },

    async createNewInvoice(userid){
        try{
            const invoice =  await Invoice.build({
                userId: userid
            }).save();
            return invoice.toJSON();
        }catch(error){
            throw error;
        }
        
    },

    async addCourseInvoice(invoiceid, courseid){
        
        const courseInvoice = await InvoiceCourse.create({
                invoiceId: invoiceid,
                courseId: courseid
            });
        if(courseInvoice == null) return null;
        return courseInvoice.toJSON();
    },

    async addCourseUser(userid, courseid){
        
        const userCourse = await UserCourse.create({
                userId: userid,
                courseId: courseid
            });
        if(userCourse == null) return null;
        return userCourse.toJSON();
    },

    async getInvoiceCourses(invoiceid){
        
        const userCourses = await InvoiceCourse.findAll({
            attributes: ['courseId'],
            where: {
                invoiceId: invoiceid
            }
        });
        return userCourses.map(invoiceCourse => invoiceCourse.toJSON());
    }
}