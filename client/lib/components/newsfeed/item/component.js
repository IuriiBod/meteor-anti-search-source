var component = FlowComponents.define("newsFeedPost", function(props) {
  this.set('post', props.post);
});

component.state.comments = function(){
  return NewsFeeds.find({"reference": this.get('post')._id}, {sort: {"createdOn": 1}});
};

component.state.getLikesCountForPost = function () {
  var likes = this.get('post').likes;
  var count = likes.length;
  var likedByMe = likes.indexOf(Meteor.userId()) >= 0;
  var likesCount = likedByMe ? count - 1 : count;
  return {
    likedByMe: likedByMe,
    likesCount: likesCount
  };
};

component.action.likePost = function() {
  var id = this.get('post')._id;
  Meteor.call("updateNewsfeed", id, Meteor.userId(), HospoHero.handleMethodResult());
};