var SupplierChecker = Match.Where(function (supplier) {
    console.log(supplier);

    check(supplier, {
        name: String,
        email: Match.Where(function (email) {
            return /.+@(.+){2,}\.(.+){2,}/.test(email);
        }),
        phone: String,
        minimumOrderAmount: Match.Where(function (amount) {
            check(amount, Number);

            return amount > 0;
        }),
        deliveryDay: Match.OneOf('monday', 'sunday', 'monday', 'tuesday',
            'wednesday', 'thursday', 'friday', 'saturday'),
        deliveryTime: Date,
        contactName: String,
        customerNumber: String,

        _id: HospoHero.checkers.OptionalMongoId,
        createdBy: HospoHero.checkers.OptionalNullableMongoId,
        relations: Match.Optional(HospoHero.checkers.Relations),
        active: Match.Optional(Boolean),
        createdOn: Match.Optional(Date)
    });

    var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(supplier, Suppliers);

    return true;
});

Namespace('HospoHero.checkers', {
    /**
     * Suppliers document checker
     */
    SupplierChecker: SupplierChecker
});