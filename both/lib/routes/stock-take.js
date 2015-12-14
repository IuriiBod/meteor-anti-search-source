// ---------------------STOCKTAKE
Router.route('/stocktake', {
  name: "stocktakeList",
  path: '/stocktake',
  template: "stockListMainView",
  waitOn: function () {
    return Meteor.subscribe('stocktakeList', HospoHero.getCurrentAreaId());
  },
  data: function () {
    Session.set("editStockTake", false);
  }
});

Router.route('/stocktake/:_id', {
  name: "stocktakeCounting",
  template: "stocktakeCountingMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allAreas', currentAreaId),
      Meteor.subscribe("stocktakes", this.params._id),
      Meteor.subscribe('ordersPlaced', this.params._id),
      Meteor.subscribe('allSuppliers', currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId)
    ];
  },
  data: function () {
    return {
      stocktakeId: this.params._id
    }
  }
});


Router.route('/stocktake/order/receive/:_id', {
  name: "orderReceive",
  path: '/stocktake/order/receive/:_id',
  template: "orderReceiveMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('receiptOrders', this.params._id),
      Meteor.subscribe("orderReceipts", [this.params._id]),
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('allSuppliers', currentAreaId)
    ];
  },
  data: function () {
    return {
      currentReceipt: this.params._id
    };
  }
});

Router.route('/stocktake/orders/:_id', {
  name: "stocktakeOrdering",
  path: '/stocktake/orders/:_id',
  template: "stocktakeOrderingMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('ordersPlaced', this.params._id),
      Meteor.subscribe('orderReceiptsByVersion', this.params._id, currentAreaId),
      Meteor.subscribe('comments', this.params._id, currentAreaId),
      Meteor.subscribe('usersList', currentAreaId),
      Meteor.subscribe('ingredients', null, currentAreaId),
      Meteor.subscribe('allSuppliers', currentAreaId)
    ];
  },
  data: function () {
    Session.set("thisVersion", this.params._id);
    Session.set("editStockTake", false);

    return {
      orderId: this.params._id
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