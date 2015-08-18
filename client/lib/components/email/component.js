var component = FlowComponents.define("composeMail", function(props) {});

component.state.subject = function() {
  var date = moment().format("YYYY-MM-DD");
  var title = "Stock order for " + date;
  return title;
}

component.state.initialHTML = function() {
  var receipt = OrderReceipts.findOne({ "version": Session.get("thisVersion"), "supplier": Session.get("activeSupplier")});
  var data = StockOrders.find({
    "version": Session.get("thisVersion"),
    "supplier": Session.get("activeSupplier")
  }).fetch();

  var text = "<p>Hi " + Session.get("activeSupplier") + ",</p>";
  text += "<p>We'd like to place the order for delivery on ";
  if(receipt && receipt.expectedDeliveryDate) {
    text += moment(receipt.expectedDeliveryDate).format("YYYY-MM-DD") + ".</p>";
  } else {
    var date = moment().add(7, 'day');
    text += moment(date).format("YYYY-MM-DD") + ".</p>";
  }
  text += "<p>If there are any items that you cannot supply or changes you wish, please email us.</p><br>";
  if(receipt && receipt.orderNote) {
    text += "<p>Note: " + receipt.orderNote + "</p>";
  }

  text += "<br><table class='table table-condensed table-hover table-striped'>";
  text += "<thead><tr><th>Stock Item</th><th>Amount</th><th>Price ($)</th></tr></thead><tbody>";


  if(data && data.length > 0) {
    data.forEach(function(item) {
      var stockItem = Ingredients.findOne(item.stockId);
      if(stockItem) {
        text += "<tr><td>" + stockItem.description + "</td><td>" + item.countOrdered + "[" + item.unit + "]</td><td>$ " + (item.countOrdered * item.unitPrice) + "</td></tr>"
      }
    });
  }
  text += "</tbody></table>";
  text += "<br><br><p>" + this.get("username") + ",</p>"
  text += "<p>" + this.get("userType") + "</p>";
  return text;
}

component.state.replyToEmail = function() {
  var user = Meteor.user();
  if(user && user.emails) {
    this.set("username", user.username);
    if(user.isAdmin) {
      this.set("userType", "Admin");
    } else if(user.isManager) {
      this.set("userType", "Manager");
    } else if(user.isWorker) {
      this.set("userType", "Worker");
    }
    return user.emails[0].address;
  }
}
