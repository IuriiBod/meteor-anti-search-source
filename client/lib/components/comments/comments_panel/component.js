var component = FlowComponents.define('commentsPanel', function(props) {
  this.referenceId = props.id;
  this.refType = props.type;
});

component.state.commentsExist = function() {
  var item = this.referenceId;
  return Comments.find({"reference": item}).count() > 0;
};

component.state.id = function() {
  return this.referenceId;
};

component.state.type = function() {
  return this.refType;
};

component.state.commentsList = function() {
  return Comments.find({"reference": this.referenceId}, {sort: {"createdOn": 1}});
};