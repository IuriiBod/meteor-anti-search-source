var component = FlowComponents.define("ingsAndPreps", function(props) {
  this.type = props.type;
  this.id = props.item._id;
  this.quantity = props.item.quantity;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  if(this.type == "prep") {
    this.item = JobItems.findOne(this.id);
  } else if(this.type == "ings") {
    this.item = Ingredients.findOne(this.id);
  }
  if(this.item) {
    return this.item;
  }
};

component.state.name = function() {
  if(this.item) {
    if(this.type == "prep") {
      return this.item.name;
    } else if(this.type == "ings") {
      return this.item.description;
    }
  }
};

component.state.quantity = function() {
  if(this.item) {
    return this.quantity;
  }
};

component.state.type = function() {
  return this.type;
};

component.state.measure = function() {
  if(this.item) {
    if(this.type == "prep") {
      return this.item.measure;
    } else if(this.type == "ings") {
      return this.item.portionUsed;
    }
  }
};

component.prototype.onItemRendered = function() {
  if(this.type == "prep") {
    Meteor.subscribe("jobItems", [this.id]);
  }
};