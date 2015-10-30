// ---------------------INGREDIENTS
Router.route('/stocklist', {
  name: "ingredientsList",
  path: '/stocklist',
  template: "listOfStocksMasterMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe("allSuppliers"),
      //Meteor.subscribe("ingredients", null, 'active'),
      //Meteor.subscribe("ingredientsRelatedJobs"),
      Meteor.subscribe("ingredients")
    ];
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});

Router.route('/stocklist/:type', {
  name: "ingredientsListType",
  path: '/stocklist/:type',
  template: "listOfStocksMasterMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe("allSuppliers"),
      Meteor.subscribe("ingredientsRelatedJobs"),
      Meteor.subscribe("ingredients", null, 'archived')
    ]
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  }
});