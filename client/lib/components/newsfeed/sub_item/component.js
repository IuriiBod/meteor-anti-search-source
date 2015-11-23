var component = FlowComponents.define("subNewsFeedPost", function(props) {
  this.set('post', props.post);
});

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