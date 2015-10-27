var component = FlowComponents.define("newsFeedPost", function(props) {
  this.set('post', props.post);
});

component.state.liked = function() {
  return this.get('post').likes.indexOf(Meteor.userId()) >= 0;
};

component.state.likesCount = function() {
  var likes = this.get('post').likes;
  var count = likes.length;
  return this.get('liked') ? count - 1 : count;
};

component.state.comments = function(){
  return NewsFeeds.find({"reference": this.get('post')._id}, {sort: {"createdOn": 1}});
};

component.action.likePost = function(id) {
  Meteor.call("updateNewsfeed", id, Meteor.userId(), HospoHero.handleMethodResult());
};