var component = FlowComponents.define("areaBox", function(props) {
  this.item = props.item;
  this.class = props.class;
  this.name = props.name;
  this.onRendered(this.onItemRendered);
});

component.state.item = function() {
  var area = this.item;
  area.class = this.class;
  area.type = this.name;
  return area;
}

component.state.widthofBar = function() {
  if(this.class == "sarea-filter") {
    // if(this.item.)
    return '50%';
  } else if(this.class == "garea-filter") {
    return '70%';
  }
}

component.state.editable = function() {
  return Session.get("editStockTake");
}

component.prototype.onItemRendered = function() {
};