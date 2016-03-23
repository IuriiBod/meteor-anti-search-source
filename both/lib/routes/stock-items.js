// ---------------------INGREDIENTS
Router.route('/stocklist', {
  name: "ingredientsList",
  path: '/stocklist',
  template: "listOfStocksMasterMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('allIngredientsInArea', currentAreaId, null),
      Meteor.subscribe("ingredientsRelatedJobs")
    ];
  }
});


Router.route('/stocklist/:type', {
  name: "ingredientsListType",
  path: '/stocklist/:type',
  template: "listOfStocksMasterMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('ingredientsRelatedJobs'),
      Meteor.subscribe('allIngredientsInArea', currentAreaId, 'archived')
    ];
  }
});