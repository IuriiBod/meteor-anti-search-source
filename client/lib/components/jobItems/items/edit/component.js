var component = FlowComponents.define('jobItemEdit', function(props) {
  this.jobitem = props.jobitem;
  this.id = props.id;
});

component.state.item = function() {
  if(this.id) {
    return getPrepItem(this.id);
  }
};