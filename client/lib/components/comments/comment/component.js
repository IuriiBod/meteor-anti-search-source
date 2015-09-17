var component = FlowComponents.define("comment", function(props) {
  this.comment = props.comment;
});

component.state.createdBy = function() {
  return this.comment.createdBy;
}

component.state.text = function() {
  var text = this.comment.text;
  return text;
}

component.state.createdOn = function() {
  return this.comment.createdOn;
}