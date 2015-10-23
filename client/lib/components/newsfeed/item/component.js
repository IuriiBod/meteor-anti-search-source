var component = FlowComponents.define("newsFeedPost", function(props) {
  this.post = props.post;
});

component.state.newsfeedPost = function() {
  return this.post;
};

component.state.likesCount = function() {
  var id = this.post._id;
  var post = NewsFeeds.findOne(id);
  if(post) {
    var count = post.likes.length;
    if(post.likes.indexOf(Meteor.userId()) >= 0) {
      count = count - 1;  
    }
    if(count > 0) {
      return count;
    }
  }
};

component.state.liked = function() {
  return this.post.likes.indexOf(Meteor.userId()) >= 0;
};

component.state.comments = function(){
  return NewsFeeds.find({"reference": this.post._id}, {sort: {"createdOn": 1}});
};

component.state.currentUser = function() {
  return Meteor.userId();
};

// TODO: Check this method
component.action.likePost = function(id) {
  Meteor.call("updateNewsfeed", id, Meteor.userId(), HospoHero.handleMethodResult(function(id) {
    var newsFeedPost = NewsFeeds.findOne(id);
    if(newsFeedPost) {
      var name = HospoHero.username(Meteor.userId());
      var createdUser = Meteor.users.findOne(newsFeedPost.createdBy);

      // TODO: Why?? HTML in database is bad practice
      var text = newsFeedPost.text;
      text = $(text).text();

      var matched = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
      while (match = matched.exec(text)) {
        matches.push(match[1]);
      }

      var ref = null;
      var type = "newsfeed";

      if(newsFeedPost.ref) {
        ref = newsFeedPost.ref;
        type = "newsfeed";
      }

      var options = {
        newsfeedId: id,
        type: "like"
      };

      //notify created user
      options.title =  name + " liked your newsfeed post";
      options.users = [createdUser.username];
      sendNotifi(ref, type, options);

      //notify tagged users
      options.title = name + " liked the newsfeed post you are tagged in";
      options.users = [matches];
      sendNotifi(ref, type, options);
    }
  }));
};