// ---------------------STOCKTAKE
Router.route('/stocktake', {
  name: "stocktakeList",
  path: '/stocktake',
  template: "stockListMainView",
  waitOn: function() {
    return Meteor.subscribe('organizationInfo');
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit stocks')()) {
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
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe("allAreas"),
      Meteor.subscribe("allSuppliers"),
      Meteor.subscribe("stocktakes", this.params._id),
      Meteor.subscribe("ordersPlaced", this.params._id)
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit stocks')()) {
      Router.go("/");
    }
    Session.set("activeSArea", null);
    Session.set("activeGArea", null);
    Session.set("thisVersion", this.params._id);;
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/stocktake/order/receive/:_id', {
  name: "orderReceive",
  path: '/stocktake/order/receive/:_id',
  template: "orderReceiveMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe("receiptOrders", this.params._id),
      Meteor.subscribe("orderReceipts", [this.params._id])
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit stocks')()) {
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
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe("ordersPlaced", this.params._id),
      Meteor.subscribe("orderReceiptsByVersion", this.params._id),
      Meteor.subscribe("comments", this.params._id),
      Meteor.subscribe("usersList")
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit stocks')()) {
      Router.go("/");
    }
    Session.set("thisVersion", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/stocktake/order/receipts/list', {
  name: "orderReceiptsList",
  path: '/stocktake/order/receipts',
  template: "orderReceiptsListMainView",
  waitOn: function() {
    return [
      Meteor.subscribe('organizationInfo'),
      Meteor.subscribe("allOrderReceipts")
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.canUser('edit stocks')()) {
      Router.go("/");
    }
    Session.set("thisState", false);
    if(!Session.set("thisTime")) {
      Session.set("thisTime", "week");
    }
    Session.set("editStockTake", false);
  },
  fastRender: true
});