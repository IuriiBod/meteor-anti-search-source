// ---------------------STOCKTAKE
Router.route('/stocktake', {
  name: "stocktakeList",
  path: '/stocktake',
  template: "stockListMainView",
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canEditStock()) {
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
      subs.subscribe("allAreas"),
      subs.subscribe("allSuppliers"),
      subs.subscribe("stocktakes", this.params._id),
      subs.subscribe("ordersPlaced", this.params._id)
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canEditStock()) {
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
      subs.subscribe("receiptOrders", this.params._id),
      subs.subscribe("orderReceipts", [this.params._id])
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canEditStock()) {
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
      subs.subscribe("ordersPlaced", this.params._id),
      subs.subscribe("orderReceiptsByVersion", this.params._id),
      subs.subscribe("comments", this.params._id),
      subs.subscribe("usersList")
    ];
  },
  data: function() {
    if(!Meteor.userId() || !HospoHero.perms.canEditStock()) {
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
    cursors.push(subs.subscribe("allOrderReceipts"));
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
    if(!Meteor.userId() || !HospoHero.perms.canEditStock()) {
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