var component = FlowComponents.define("stockCountingListItem", function(props) {
  this.id = props.id;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  var id = this.id;
  var stock = Ingredients.findOne(id);
  if(stock) {
    return stock;
  }
}

component.prototype.onItemRendered = function() {
  $(".noOfPortions").editable({
    type: "text",
    title: 'Edit No of Portions',
    showbuttons: true,
    mode: 'inline',
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        console.log(".............", newValue);
      }
    }
  });
}