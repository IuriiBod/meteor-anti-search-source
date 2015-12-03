var SupplierChecker = Match.Where(function (supplier) {
  check(supplier, {
    name: String,
    email: Match.Where(function (email) {
      return /.+@(.+){2,}\.(.+){2,}/.test(email);
    }),
    minimumOrderAmount: Match.Where(function (amount) {
      check(amount, Number);

      return amount > 0;
    }),
    deliveryDay: Match.OneOf('sunday', 'monday', 'tuesday',
      'wednesday', 'thursday', 'friday', 'saturday'),
    deliveryTime: Date,
    contactName: String,
    customerNumber: String,

    _id: HospoHero.checkers.OptionalMongoId,
    phone: Match.Optional(String),
    createdBy: HospoHero.checkers.OptionalNullableMongoId,
    relations: Match.Optional(HospoHero.checkers.Relations),
    active: Match.Optional(Boolean),
    createdOn: Match.Optional(Date),
    priceList: Match.Optional(PriceListsChecker)
  });

  var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(supplier, Suppliers);

  return true;
});

var PriceListsChecker = Match.Where(function (priceList) {
  check(priceList, [Object]);
  priceList.forEach(function (list) {
    check(list, {
      url: String,
      name: String,
      uploadedAt: Date
    });
  });
  return true;
});

Namespace('HospoHero.checkers', {
  /**
   * Suppliers document checker
   */
  SupplierChecker: SupplierChecker,
  PriceListsChecker: PriceListsChecker
});