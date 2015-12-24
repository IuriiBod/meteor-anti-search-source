var MenuItemDocument = Match.Where(function (menuItem) {
  check(menuItem, {

    name: String,
    category: HospoHero.checkers.MongoId,
    salesPrice: Number,
    status: Match.OneOf('archived', 'active', 'ideas'),

    //optional properties
    _id: HospoHero.checkers.OptionalMongoId,
    instructions: Match.Optional(String),
    ingredients: Match.Optional([{_id: HospoHero.checkers.MongoId, quantity: Number}]),
    jobItems: Match.Optional([{_id: HospoHero.checkers.MongoId, quantity: Number}]),
    image: Match.Optional(String),
    createdBy: HospoHero.checkers.OptionalNullableMongoId,
    editedBy: HospoHero.checkers.OptionalNullableMongoId,
    createdOn: Match.Optional(Number),
    editedOn: Match.Optional(Number),
    relations: Match.Optional(HospoHero.checkers.Relations),
    posNames: Match.Optional([String]),
    isNotSyncedWithPos: Match.Optional(Boolean)
  });

  var checkerHelper = new HospoHero.checkerUtils.DocumentCheckerHelper(menuItem, MenuItems);

  checkerHelper.checkProperty('name', function () {
    if (!!MenuItems.findOne({ name: menuItem.name, 'relations.areaId': menuItem.relations.areaId })) {
      logger.error('The menu item with the same name already exists!');
      throw new Meteor.Error("The menu item the same name already exists!");
    }
  });

  return true;
});

Namespace('HospoHero.checkers', {
  /**
   * MenuItem document checker
   */
  MenuItemDocument: MenuItemDocument
});