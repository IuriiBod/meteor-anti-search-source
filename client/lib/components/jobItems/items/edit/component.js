var component = FlowComponents.define('jobItemEdit', function(props) {
  this.jobitem = props.jobitem;
  this.id = props.id;
});

component.state.item = function() {
  if(this.id) {
    var job = getPrepItem(this.id);
    return job;
  }
}

component.state.quantity = function() {
  return 1;
}