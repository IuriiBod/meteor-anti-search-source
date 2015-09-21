// ---------------------INGREDIENTS
Router.route('/stocklist', {
  name: "ingredientsList",
  path: '/stocklist',
  template: "listOfStocksMasterMainView",
  waitOn: function() {
    var cursors = [];

    cursors.push(subs.subscribe("allSuppliers"));
    return cursors;
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
    var cursors = [];

    cursors.push(subs.subscribe("allSuppliers"));
    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});