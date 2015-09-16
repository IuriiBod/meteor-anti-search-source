var component = FlowComponents.define("newsFeedPost", function(props) {
  this.post = props.post;
});

component.state.newsfeedPost = function() {
  return this.post;
}

component.state.likesCount = function() {
  var id = this.post._id;
  var post = NewsFeeds.findOne(id);
  if(post) {
    return post.likes.length;
    
  }
};

component.state.comments = function(){
  return NewsFeeds.find({"reference": this.post._id}, {sort: {"createdOn": 1}});
}

component.state.currentUser = function() {
  return Meteor.userId();
}

component.action.likePost = function(id) {
  Meteor.call("updateNewsfeed", id, Meteor.userId(), function(err, id) {
    if(err) {
      console.log(err);
      return alert(err.reason);
    } else {
      // var options = {
      //   "title": "update NewsFeeds on by " + Meteor.user().username,
      //   "postId": id,
      //   "type": "post update"
      // }
      // Meteor.call("sendNotifications", ref, "post", options, function(err) {
      //   if(err) {
      //       console.log(err);
      //       return alert(err.reason);
      //   }
      // });
    }
  });
};