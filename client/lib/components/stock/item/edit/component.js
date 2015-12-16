var component = FlowComponents.define('ingredientItemEdit', function (props) {
  this.id = props.id;
  this.name = props.name;
  this.itemId = props.itemId;
  this.quantity = 1;
});

component.state.item = function () {
  var item = Ingredients.findOne(this.id);
  if (item) {
    return item;
  }
};

component.state.unitPrice = function () {
  var item = getIngredientItem(this.id);
  if (item) {
    return item.costPerPortionUsed;
  }
};

component.state.quantity = function () {
  var id = this.id;
  var quantity = 1;
  if (this.name == "editJobItem") {
    var jobItem = JobItems.findOne({"_id": Session.get("thisJobItem")});
    if (jobItem) {
      if (jobItem.ingredients && jobItem.ingredients.length > 0) {
        $.grep(jobItem.ingredients, function (e) {
          if (e._id == id) {
            quantity = e.quantity;
          }
        });
      }
    }
  }
  return quantity;
};