// ---------------------STOCKTAKE
Router.route('/stocktake', {
  name: "stocktakeList",
  path: '/stocktake',
  template: "stockListMainView",
  waitOn: function() {
    var cursors = [];

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

Router.route('/stocktake/:_id', {
  name: "stocktakeCounting",
  path: '/stocktake/:_id',
  template: "stocktakeCountingMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(subs.subscribe("allAreas"));
    cursors.push(subs.subscribe("allSuppliers"));
    cursors.push(subs.subscribe("stocktakes", this.params._id));
    cursors.push(subs.subscribe("ordersPlaced", this.params._id));

    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
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
    var cursors = [];
    cursors.push(subs.subscribe("receiptOrders", this.params._id));
    cursors.push(subs.subscribe("orderReceipts", [this.params._id]));

    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
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
    var cursors = [];
    cursors.push(subs.subscribe("ordersPlaced", this.params._id));
    var orders = StockOrders.find({"version": this.params._id}).fetch();
    cursors.push(subs.subscribe("orderReceiptsByVersion", this.params._id));
    cursors.push(subs.subscribe("comments", this.params._id));
    cursors.push(subs.subscribe("usersList"));

    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
      Router.go("/");
    }
    Session.set("thisVersion", this.params._id);
    Session.set("editStockTake", false);
  },
  fastRender: true
});

Router.route('/stocktake/order/receipts', {
  name: "orderReceiptsList",
  path: '/stocktake/order/receipts',
  template: "orderReceiptsListMainView",
  waitOn: function() {
    var cursors = [];
    cursors.push(Meteor.subscribe("allOrderReceipts"));
    var receipts = OrderReceipts.find({"received": true}).fetch();
    var users = [];
    if(receipts && receipts.length > 0) {
      receipts.forEach(function(receipt) {
        if(receipt.receivedBy && users.indexOf(receipt.receivedBy) < 0) {
          users.push(receipt.receivedBy);
        }
      });
    }
    cursors.push(subs.subscribe("selectedUsers", users));

    return cursors;
  },
  data: function() {
    if(!Meteor.userId()) {
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