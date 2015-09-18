var component = FlowComponents.define("subNewsFeedPost", function(props) {
  this.post = props.post;
});

component.state.subNewsFeedPost = function() {
  return this.post;
} ;

component.state.likesCount = function(){
  return this.get('liked') ? (this.post.likes.length-1) : this.post.likes.length;
};

component.state.liked = function() {
  return this.post.likes.indexOf(Meteor.userId()) >= 0;
};