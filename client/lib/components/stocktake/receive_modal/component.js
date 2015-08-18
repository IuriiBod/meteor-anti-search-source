var component = FlowComponents.define("receiveModal", function(props) {
  this.name = props.name;
});

component.state.isWrongPrice = function() {
  if(this.name == "wrongPrice") {
    return true;
  }
} 

component.state.isWrongQuantity = function() {
  if(this.name == "wrongQuantity") {
    return true;
  }
}