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
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
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
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});


Router.route('stockAreasSettings', {
  path: '/settings/stock-areas',
  template: "stockAreas",
  waitOn: function () {
    return Meteor.subscribe('allStockAreas', HospoHero.getCurrentAreaId(Meteor.userId()));
  }
});