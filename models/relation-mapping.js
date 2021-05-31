const Instructor = require("./instructor");
const User = require("./user");
const Course = require("./course");
const CourseChapter = require("./course-chapter");
const CourseChapterSection = require("./course-chapter-section");
const CategoryLink = require("./category-link");
const Level = require("./level");
const Advancement = require("./advancement");
const SubCategory = require("./sub-category");
const Category = require("./category");
const CourseReview = require("./course-review");
const UserCourse = require("./user-course");
const Invoice = require("./invoice");
const Coupon = require("./coupon");
const InvoiceStatus = require("./invoice-status");
const PaymentType = require("./payment-type");
const InvoiceCourse = require("./invoice-course");

Instructor.hasOne(User, {
    as: 'basicInfo',
    foreignKey: 'id',
});

User.belongsTo(Instructor, {foreignKey: 'id'});

Course.belongsTo(Instructor);
Instructor.hasMany(Course);
CourseChapter.belongsTo(Course);
Course.hasMany(CourseChapter, {as: 'chapters'});

CourseChapterSection.belongsTo(CourseChapter);
CourseChapter.hasMany(CourseChapterSection, {as: 'sections' , foreignKey: 'courseChapterId'});

CategoryLink.hasMany(Course, {as: 'courses'});
Course.belongsTo(CategoryLink, {as: "categoryLink", foreignKey: 'categoryLinkId'});

Level.hasMany(Course, {as: 'courses'});
Course.belongsTo(Level, {as: "level", foreignKey: "levelId"});

Advancement.hasMany(Course, {as: 'courses'});
Course.belongsTo(Advancement, {as: "advancement", foreignKey: "advancementId"});

Course.hasMany(CourseReview, {as: 'reviews'});
CourseReview.belongsTo(Course);

User.hasMany(CourseReview, {as: 'reviews'});
CourseReview.belongsTo(User);

SubCategory.belongsToMany(Category, {through: CategoryLink,as: 'categories', foreignKey: 'subCategoryId'});
Category.belongsToMany(SubCategory, {through: CategoryLink,as: 'subCategories', foreignKey: 'categoryId'});

Category.hasMany(CategoryLink, {as: 'categoryLinks'});
CategoryLink.belongsTo(Category, {as: 'category', foreignKey: 'categoryId'});
SubCategory.hasMany(CategoryLink,{as: 'categoryLinks'});
CategoryLink.belongsTo(SubCategory, {as: 'subCategory', foreignKey: 'subCategoryId'});

Course.hasMany(UserCourse);
UserCourse.belongsTo(Course);

User.hasMany(UserCourse);
UserCourse.belongsTo(User);

Coupon.hasMany(Invoice);
Invoice.belongsTo(Coupon);

InvoiceStatus.hasMany(Invoice);
Invoice.belongsTo(InvoiceStatus);

PaymentType.hasMany(Invoice);
Invoice.belongsTo(PaymentType);

User.hasMany(Invoice);
Invoice.belongsTo(User);

Invoice.hasMany(InvoiceCourse, {as: 'courses'});
InvoiceCourse.belongsTo(Invoice);
Course.hasMany(InvoiceCourse, {as: 'invoices'});
InvoiceCourse.belongsTo(Course);

Invoice.belongsToMany(Course, {through: InvoiceCourse});
Course.belongsToMany(Invoice, {through: InvoiceCourse});

CourseReview.belongsTo(User, {as: 'user'});