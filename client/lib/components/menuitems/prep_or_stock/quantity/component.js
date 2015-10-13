var component = FlowComponents.define("quantity", function(props) {
  this.id = props.id;
  this.type = props.type;
  this.quantity = props.quantity;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  return this;
};

component.state.quantity = function() {
  return this.quantity;
};

component.prototype.onItemRendered = function() {
  var menu = Session.get("thisMenuItem");
  $('.quantity').editable({
    mode: "inline",
    type: "text",
    title: 'Edit count',
    autotext: 'auto',
    display: false,
    inputclass: "nadee",
    success: function(response, newValue) {
      var elem = $(this).closest("tr");
      if($(elem).next().length > 0) {
        $(elem).next().find("a.quantity").click();
      }
      if(newValue) {
        var ing = $(this).data("pk");
        var type = $(this).data("itemtype");
        newValue = parseFloat(newValue);
        newValue = !isNaN(newValue) ? newValue : 0;
        if(type == "ings") {
          Meteor.call("addMenuIngredients", menu, [{"_id": ing, "quantity": newValue}], function(err) {
            if(err) {
              HospoHero.error(err);
            } else {
              if($(elem).next().length > 0) {
                $(elem).next().find("a.quantity").click();
              }
            }
          });
        } else if(type == "prep") {
          Meteor.call("addMenuPrepItems", menu, [{"_id": ing, "quantity": newValue}], function(err) {
            if(err) {
              HospoHero.error(err);
            } else {
              if($(elem).next().length > 0) {
                $(elem).next().find("a.quantity").click();
              }
            }
          });
        }
      }
    }
  });
};