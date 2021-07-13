const InvoiceModel = require("../schemas/invoice.schema");

const verifyInvoice = (req, res, next) => {
    const user = res.locals.user;
    let courseId;
    let userId = user.id;

    switch (req.method.toLowerCase()) {
        case 'get':
            courseId = req.query.courseId;
            break;
        default:
            courseId = req.body.courseId;
    }

    InvoiceModel.findOne({courseId, userId}).exec()
        .then(invoice => {
            if (!invoice) {
                res.status(400).send({
                    message: "Invoice not found in mdw"
                })
                return;
            }
            next()
        })
}

module.exports = {
    verifyInvoice
}