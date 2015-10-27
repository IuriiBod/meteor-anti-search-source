var component = FlowComponents.define("subNewsFeedPost", function(props) {
  this.set('post', props.post);
});

component.state.liked = function() {
  return this.get('post').likes.indexOf(Meteor.userId()) >= 0;
};

component.state.likesCount = function() {
  var count = this.get('post').likes.length;
  return this.get('liked') ? count - 1 : count;
};