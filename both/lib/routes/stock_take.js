// ---------------------STOCKTAKE
Router.route('/stocktake', {
  name: "stocktakeList",
  path: '/stocktake',
  template: "stockListMainView",
  data: function () {
    if (!HospoHero.canUser('edit stocks')()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/stocktake/:_id', {
  name: "stocktakeCounting",
  path: '/stocktake/:_id',
  template: "stocktakeCountingMainView",
  waitOn: function () {
    var currentAreaId = HospoHero.getCurrentAreaId(Meteor.userId());
    return [
      Meteor.subscribe('allAreas', currentAreaId),
      Meteor.subscribe("stocktakes", this.params._id),
      Meteor.subscribe('ordersPlaced', this.params._id)
    ];
  },
  data: function () {
    if (!HospoHero.canUser('edit stocks')()) {
      Router.go("/");
    }
    Session.set("activeSArea", null);
    Session.set("activeGArea", null);
    Session.set("thisVersion", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
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
    if (!HospoHero.canUser('edit stocks')()) {
      Router.go("/");
    }
    Session.set("editStockTake", false);
    Session.set("thisReceipt", this.params._id);
  },
  fastRender: true
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
    if (!HospoHero.canUser('edit stocks')()) {
      Router.go("/");
    }
    Session.set("thisVersion", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});


Router.route('orderReceiptsList', {
  path: '/stocktake/order/receipts',
  template: 'orderReceiptsListMainView',
  waitOn: function () {
    return Meteor.subscribe('allOrderReceipts', HospoHero.getCurrentAreaId(Meteor.userId()));
  },
  data: function () {
    Session.set("thisState", false);
    Session.set("thisTime", "week");
    Session.set("editStockTake", false);
  }
});