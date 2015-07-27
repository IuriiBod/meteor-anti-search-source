var component = FlowComponents.define("stockCountingListItem", function(props) {
  this.id = props.id;
});

component.state.item = function() {
  var id = this.id;
  var stock = Ingredients.findOne(id);
  if(stock) {
    return stock;
  }
}