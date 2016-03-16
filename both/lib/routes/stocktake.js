Router.route('stocktakeList', {
  path: '/stocktake',
  template: 'stockListMainView',
  waitOn: function () {
    return Meteor.subscribe('stocktakeList', HospoHero.getCurrentAreaId());
  }
});

Router.route('stocktakeCounting', {
  path: '/stocktake/:_id',
  template: 'stocktakeCountingMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allStockAreas', currentAreaId),
      Meteor.subscribe("stocktakes", this.params._id),
      Meteor.subscribe('ordersPlaced', this.params._id),
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('allIngredientsInArea', currentAreaId, null)
    ];
  },
  data: function () {
    return {
      stocktakeId: this.params._id
    };
  }
});

Router.route('stocktakeCountingEdit', {
  path: '/stocktake/edit/:_id',
  template: 'stocktakeCountingMainEdit',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allStockAreas', currentAreaId),
      Meteor.subscribe('stocktakes', this.params._id),
      Meteor.subscribe('ordersPlaced', this.params._id),
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('allIngredientsInArea', currentAreaId, null)
    ];
  },
  data: function () {
    return {
      stocktakeId: this.params._id
    };
  }
});


Router.route('orderReceive', {
  path: '/stocktake/order/receive/:_id',
  template: 'orderReceiveMainView',
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('receiptOrders', this.params._id),
      Meteor.subscribe("orderReceipts", [this.params._id]),
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
        Meteor.subscribe('orderReceiptsByVersion', this.params._id, currentAreaId),
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
    return Meteor.subscribe('allOrderReceipts', HospoHero.getCurrentAreaId(Meteor.userId()));
  }
});