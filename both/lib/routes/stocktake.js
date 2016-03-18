Router.route('stocktakeList', {
  path: '/stocktake',
  template: 'stocktakesList',
  waitOn: function () {
    return Meteor.subscribe('stocktakeList', HospoHero.getCurrentAreaId());
  }
});

Router.route('stocktakeCounting', {
  path: '/stocktake/:_id',
  template: 'stocktakeCounting',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allStockAreas', currentAreaId),
      Meteor.subscribe('stocktakes', this.params._id),
      Meteor.subscribe('ordersPlaced', this.params._id),
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('allIngredientsInArea', currentAreaId, 'active')
    ];
  },
  data: function () {
    return Stocktakes.findOne({_id: this.params._id});
  }
});

Router.route('orderReceive', {
  path: '/stocktake/order/receive/:_id',
  template: 'orderReceiveMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('fullOrderInfo', this.params._id),
      Meteor.subscribe('allIngredientsInArea', currentAreaId, null),
      Meteor.subscribe('allSuppliers', currentAreaId)
    ];
  },
  data: function () {
    return {
      currentReceipt: Orders.findOne({_id: this.params._id})
    };
  }
});

Router.route('stocktakeOrdering', {
  path: '/stocktake/orders/:_id',
  template: 'stocktakeOrdering',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    if (currentAreaId) {
      return [
        Meteor.subscribe('ordersPlaced', this.params._id),
        Meteor.subscribe('allStocktakeOrders', this.params._id),
        Meteor.subscribe('comments', this.params._id, currentAreaId),
        Meteor.subscribe('areaUsersList', currentAreaId),
        Meteor.subscribe('allIngredientsInArea', currentAreaId, null),
        Meteor.subscribe('allSuppliers', currentAreaId)
      ];
    }
  },
  data: function () {
    return {
      stocktakeMainId: this.params._id
    };
  }
});


Router.route('orderReceiptsList', {
  path: '/stocktake/order/receipts',
  template: 'orderReceiptsListMainView',
  waitOn: function () {
    return Meteor.subscribe('allOrdersInArea', HospoHero.getCurrentAreaId());
  }
});