var component = FlowComponents.define("subNewsFeedPost", function(props) {
  this.post = props.post;
});

component.state.subNewsFeedPost = function() {
  return this.post;
} 

component.state.likesCount = function(){
  var count = this.post.likes.length;
  if(this.post.likes.indexOf(Meteor.userId()) >= 0) {
    count = count - 1;  
  }
  if(count > 0) {
    return count;
  }
}

component.state.liked = function() {
  if(this.post.likes.indexOf(Meteor.userId()) >= 0) {
    return true;
  } else {
    return false;
  }
}
