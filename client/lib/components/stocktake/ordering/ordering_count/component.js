var component = FlowComponents.define("orderingCount", function(props) {
  this.id = props.id;
  this.unit = props.unit;

  this.onRendered(this.onCountRendered);
});

component.state.orderingCount = function() {
  var order = StockOrders.findOne(this.id);
  if(order) {
    return order.countOrdered;
  }
};

component.state.unit = function() {
  return this.unit;
};

component.prototype.onCountRendered = function() {
  $(".orderingCount").editable({
    title: 'Edit count',
    showbuttons: false,
    mode: 'inline',
    defaultValue: 0,
    autotext: 'auto',
    display: function(value, response) {},
    success: function(response, newValue) {
      var elem = $(this).closest("tr");
      var id = $(this).closest("tr").attr("data-id");
      if(newValue) {
        var count = parseFloat(newValue) ? parseFloat(newValue) : 0;
        Meteor.call("editOrderingCount", id, count, function(err) {
          if(err) {
            HospoHero.error(err);
          } else {
            if($(elem).next().length > 0) {
              $(elem).next().find("a").click();
            }
          }
        });
      }
    }
  });
};