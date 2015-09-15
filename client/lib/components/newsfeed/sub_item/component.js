var component = FlowComponents.define("subNewsFeedPost", function(props) {
  this.post = props.post;
});

component.state.subNewsFeedPost = function() {
  return this.post;
} 

component.state.likesCount = function(){
  return this.post.likes.length;
}
