var component = FlowComponents.define("ingsAndPreps", function (props) {
  this.type = props.type;
  this.id = props.item._id;
  this.quantity = props.item.quantity;
});

component.state.item = function () {
  if (this.type == "prep") {
    this.item = JobItems.findOne(this.id);
  } else if (this.type == "ings") {
    this.item = Ingredients.findOne(this.id);
  }
  if (this.item) {
    return this.item;
  }
};

component.state.name = function () {
  if (this.item) {
    if (this.type == "prep") {
      return this.item.name;
    } else if (this.type == "ings") {
      return this.item.description;
    }
  }
};

component.state.quantity = function () {
  if (this.item) {
    return this.quantity;
  }
};

component.state.type = function () {
  return this.type;
};

component.state.measure = function () {
  if (this.item) {
    if (this.type == "prep") {
      return this.item.measure;
    } else if (this.type == "ings") {
      return this.item.portionUsed;
    }
  }
};

component.state.price = function () {
  if (this.item){
    if (this.type === 'prep'){
      var item = getPrepItem(this.id);
      return item.prepCostPerPortion* this.quantity;
    }
    var item = getIngredientItem(this.id);
    return item.costPerPortionUsed;
  }
};