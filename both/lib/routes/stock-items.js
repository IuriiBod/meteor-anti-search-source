// ---------------------INGREDIENTS
Router.route('ingredientsList', {
  path: '/stocklist',
  template: 'listOfStocksMasterMainView',
  onBeforeAction: function () {
    this.redirect('ingredientsListType', {status: 'active'});
  }
});


Router.route('ingredientsListType', {
  path: '/stocklist/:status',
  template: 'listOfStocksMasterMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('ingredientsRelatedJobs'),
      Meteor.subscribe('allIngredientsInArea', currentAreaId, this.params.status)
    ];
  },
  data: function () {
    return {
      status: this.params.status
    };
  }
});