var component = FlowComponents.define("figureBox", function(props) {
  this.name = props.name;
  this.subText = props.subtext;
  this.dataContent = props.dataContent;
  this.onRendered(this.itemRendered);
});

component.state.item = function() {
  return this;
}

component.prototype.itemRendered = function() {
  $('[data-toggle="popover"]').popover()
}