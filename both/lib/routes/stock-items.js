// ---------------------INGREDIENTS
Router.route('/stocklist', {
  name: "ingredientsList",
  path: '/stocklist',
  template: "listOfStocksMasterMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId),
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
      Meteor.subscribe('ingredients', null, currentAreaId, 'archived')
    ]
  },
  data: function () {
    if (!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});