var component = FlowComponents.define("quantity", function(props) {
  this.id = props.id;
  this.type = props.type;
  this.quantity = props.quantity;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  return this;
}


component.prototype.onItemRendered = function() {
  var menu = Session.get("thisMenuItem");
  $('.quantity').editable({
    mode: "inline",
    type: "text",
    success: function(response, newValue) {
      if(newValue) {
        var ing = $(this).data("pk");
        var type = $(this).data("itemtype");
        if(type == "ings") {
          Meteor.call("addMenuIngredients", menu, [{"_id": ing, "quantity": newValue}], function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
            return;
          });
        } else if(type == "prep") {
          Meteor.call("addMenuPrepItems", menu, [{"_id": ing, "quantity": newValue}], function(err) {
            if(err) {
              console.log(err);
              return alert(err.reason);
            }
            return;
          });
        }
      }
    }
  });
}