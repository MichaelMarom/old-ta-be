const sql = require('mssql');

const Discounts = {
    id: sql.UniqueIdentifier,
    MutiStudentHourlyRate: sql.Decimal(5, 2),
    CancellationPolicy: sql.Int,
    ActivateSubscriptionOption: sql.Bit,
    SubscriptionPlan: sql.VarChar(255),
    AcademyId: sql.VarChar(200),
    DiscountCode: sql.VarChar(100),
    CodeShareable: sql.Bit,
    MultiStudent: sql.Bit,
    IntroSessionDiscount: sql.Bit,
    CodeSubject: sql.VarChar(255),
    CodeStatus: sql.VarChar(50),
};

module.exports = Discounts;
