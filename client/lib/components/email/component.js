var component = FlowComponents.define("composeMail", function (props) {
});

component.state.subject = function () {
  return "Order from Hospo Hero";
};

component.state.supplier = function () {
  var supplierId = Session.get("activeSupplier");
  return Suppliers.findOne(supplierId);
};

component.state.initialHTML = function () {
  var supplierId = Session.get("activeSupplier");
  var receipt = OrderReceipts.findOne({"version": Session.get("thisVersion"), "supplier": supplierId});
  var total = 0;
  var data = StockOrders.find({
    "version": Session.get("thisVersion"),
    "supplier": supplierId,
    "relations.areaId": HospoHero.getCurrentAreaId(),
    "countOrdered": {$gt: 0}
  }).fetch();
  var supplier = Suppliers.findOne(supplierId);
  if (supplier) {
    var text = "<p>Hi " + supplier.name + ",</p>";
    text += "<p>We'd like to place the order for delivery on ";
    if (receipt && receipt.expectedDeliveryDate) {
      text += moment(receipt.expectedDeliveryDate).format("YYYY-MM-DD") + ".</p>";
    } else {
      var date = moment().add(1, 'day');
      text += moment(date).format("YYYY-MM-DD") + ".</p>";
    }
    text += "<p>If there are any items that you cannot supply or changes you wish, please email us.</p><br>";
    if (receipt && receipt.orderNote) {
      text += "<p>Note: " + receipt.orderNote + "</p>";
    }

    if (data && data.length > 0) {
      text += "<br><table class='table table-condensed table-hover table-striped'>";
      text += "<thead><tr><th>Code</th><th>Stock Item</th><th>Amount</th><th>Price ($)</th></tr></thead><tbody>";

      data.forEach(function (item) {
        var stockItem = Ingredients.findOne(item.stockId);
        if (stockItem) {
          var cost = item.countOrdered * item.unitPrice;
          total += cost;
          text += "<tr><td>" + stockItem.code + "</td>";
          text += "<td>" + stockItem.description + "</td>";
          text += "<td>" + item.countOrdered + "[" + item.unit + "]</td>";
          text += "<td>$ " + Math.round(cost * 100) / 100 + "</td></tr>"
        }
      });
      text += "<tr><td><b>Total</b></td><td></td><td></td><td><b>$ " + Math.round(total * 100) / 100 + "</b></td></tr>"
      text += "</tbody></table>";
    }
    text += "<br><br><p>" + this.get("username") + ",</p>"
    text += "<p>" + this.get("userType") + "</p>";
    return text;

  }

  text += "<tr><td><b>Total</b></td><td></td><td></td><td><b>$ " + Math.round(total * 100) / 100 + "</b></td></tr>"
  text += "</tbody></table>";
  text += "<br><br><p>" + this.get("username") + ",</p>"
  text += "<p>" + this.get("userType") + ".</p>";
  var user = Meteor.user();
  if (user) {
    if (user.emails && user.emails[0].address) {
      text += "<p>" + user.emails[0].address + "</p>";
    }
    if (user.profile && user.profile.phone) {
      text += "<p>" + user.profile.phone + "</p>";
    }
  }
  return text;
};

component.state.replyToEmail = function () {
  var user = Meteor.user();
  if (user && user.emails) {
    this.set("username", user.username);

    var role = "Worker";
    if (HospoHero.isManager()) {
      role = "Manager";
    }
    this.set("userType", role);
    return user.emails[0].address;
  }
};
