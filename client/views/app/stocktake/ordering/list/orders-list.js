Template.ordersList.onCreated(function() {
  this.getInitialHtml = function(supplierId) {
    var supplier = Suppliers.findOne(supplierId);
    console.log(this);
    if (supplier) {
      var receipt = OrderReceipts.findOne({"version": this.data.orderId, "supplier": supplierId});
      var total = 0;

      var data = StockOrders.find({
        "version": this.data.orderId,
        "supplier": supplierId,
        "relations.areaId": HospoHero.getCurrentAreaId(),
        "countOrdered": {$gt: 0}
      }, {
        fields: {
          countOrdered: 1,
          unit: 1,
          stockId: 1,
          unitPrice: 1
        }
      }).fetch();
      console.log('data in getInitialHtml -> ', data);
      console.log('supplierID -> ', supplierId);
      data = _.map(data, function (stock) {
        var stockItem = Ingredients.findOne({_id: stock.stockId}, {fields: {code: 1, description: 1}});
        var cost = stock.countOrdered * stock.unitPrice;
        stockItem.cost = cost;

        total += cost;

        return _.extend(stock, stockItem);
      });

      var area = HospoHero.getCurrentArea();
      var location = Locations.findOne({_id: area.locationId});

      var deliveryDate = receipt && receipt.expectedDeliveryDate ? receipt.expectedDeliveryDate : moment().add(1, 'day');

      var user = {
        name: HospoHero.username(Meteor.userId()),
        type: HospoHero.roles.getUserRoleName(Meteor.userId(), HospoHero.getCurrentAreaId())
      };

      var templateData = {
        supplierName: supplier.name,
        deliveryDate: HospoHero.dateUtils.dateFormat(deliveryDate),
        orederNote: receipt && receipt.orderNote || '',
        location: location,
        areaName: area.name,
        orderData: data,
        total: total,
        user: user
      };

      var self = this;
      console.log('self -> ', self);
      console.log('templateData -> ', templateData);
      Meteor.call('renderSomeHandlebarsTemplate', 'supplier-email-text', templateData, HospoHero.handleMethodResult(function (text) {
        console.log('text after Meteor call => ', text);
        self.set('initialHtml', text);
      }));
    } else {
      this.set('initialHtml', '');
    }
  };
});

Template.ordersList.helpers({
  isNull: function() {
    var data = StockOrders.find({
      "version": this.orderId
    }).fetch();
    return !!(data && data.length > 0);
  },

  list: function() {
    var data = StockOrders.find({
      "version": this.orderId,
      "supplier": Template.instance().get("activeSupplier")
    }).fetch();
    return _.map(data, function (doc) {
      return doc._id;
    });
  },

  supplier: function() {
    return Template.instance().get("activeSupplier");
  },

  orderNote: function() {
    var data = OrderReceipts.findOne({
      "version": this.orderId,
      "supplier": Template.instance().get("activeSupplier")
    });
    if (data && data.orderNote) {
      return data.orderNote;
    }
  },

  onSupplierChanged: function() {
    var instance = Template.instance();
    return function (supplierId) {
      instance.set('activeSupplier', supplierId);
      instance.getInitialHtml(supplierId);
    }
  },

  onCountChange: function() {
    var instance = Template.instance();
    return function () {
      instance.getInitialHtml(Template.instance().get('activeSupplier'));
    }
  },

  getSupplier: function() {
    return Template.instance().get('supplier');
  }
});

Template.ordersList.events({
  'click .gotoStocktake': function (event, tmpl) {
    event.preventDefault();
    var id = tmpl.data.orderId;
    Router.go("stocktakeCounting", {"_id": id});
  },

  'keyup #supplierOrderNote': function (event) {
    event.preventDefault();
    if (event.keyCode == 13) {
      var supplier = tmpl.get('supplier');
      var version = HospoHero.getParamsFromRoute(Router.current(), '_id');
      var text = $(event.target).val();
      var id = null;
      var receipt = OrderReceipts.findOne({"supplier": supplier, "version": version});
      var info = {
        "orderNote": text.trim(),
        "version": version,
        "supplier": supplier
      };
      if (receipt) {
        id = receipt._id;
      }

      Meteor.call("updateReceipt", id, info, HospoHero.handleMethodResult());
    }
  }
});