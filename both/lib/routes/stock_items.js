// ---------------------INGREDIENTS
Router.route('/stocklist', {
  name: "ingredientsList",
  path: '/stocklist',
  template: "listOfStocksMasterMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('allSuppliers', HospoHero.getCurrentAreaId(Meteor.userId())),
      //Meteor.subscribe("ingredients", null, 'active'),
      //Meteor.subscribe("ingredientsRelatedJobs"),
      Meteor.subscribe('ingredients', null, HospoHero.getCurrentAreaId(Meteor.userId()))
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/stocklist/:type', {
  name: "ingredientsListType",
  path: '/stocklist/:type',
  template: "listOfStocksMasterMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('allSuppliers', HospoHero.getCurrentAreaId(Meteor.userId())),
      Meteor.subscribe("ingredientsRelatedJobs"),
      Meteor.subscribe('ingredients', null, HospoHero.getCurrentAreaId(Meteor.userId()), 'archived')
    ]
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});