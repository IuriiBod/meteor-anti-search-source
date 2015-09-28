var autolinker = new Autolinker({
  "twitter": false
});
var component = FlowComponents.define("onePost", function (props) {
  this.post = props.post;
});
component.state.checkifnotcomment = function () {
  var ref = this.post.reference;
  var createdby = this.post.createdBy;
  return ref == createdby;
};

component.state.name = function () {
  var user = Meteor.users.findOne({"_id": this.post.createdBy});
  if (user) {
    return user.username;
  } else {
    return false;
  }
};

component.state.profilePicture = function () {
  var user = Meteor.users.findOne(this.post.createdBy);
  if (user) {
    var image = "/images/user-image.jpeg";
    if (user.services && user.services.google) {
      image = user.services.google.picture;
    }
    return image;
  } else {
    return false;
  }
};

component.state.currentprofilePicture = function () {
  var user = Meteor.user();
  var image = "/images/user-image.jpeg";
  if (user.services && user.services.google) {
    image = user.services.google.picture;
  }
  return image;
};

component.state.createdOn = function () {
  return this.post.createdOn;
};
component.state.id = function () {
  return this.post._id;
};
component.state.text = function () {
  return this.post.text;
};
component.state.like = function () {
  var like = this.post.like;
  if (like == "")
    return 0;
  else {
    var likearray = like.split(",");
    return likearray.length;
  }
};
component.action.submitcommenttopost = function (text) {
  var ref = Session.get("comment_post_id");
  //find tagged users
  var matched = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
  while (match = matched.exec(text)) {
    matches.push(match[1]);
  }
  var taggedUsers = [];
  matches.forEach(function (username) {
    var filter = new RegExp(username, 'i');
    var subscriber = Meteor.users.findOne({"username": filter});
    if (subscriber) {
      var userClass = "label-success";
      var doc = {
        "user": "@" + subscriber.username,
        "class": userClass
      };
      taggedUsers.push(doc);
    }
  });

  var classes = ['info', 'success', 'danger', 'primary', 'warning'];
  var textHtml = "<div class='non'>" + text + "</div>";
  taggedUsers.forEach(function (user) {
    textHtml = textHtml.replace(user.user, "<span class='label " + user.class + "'>" + user.user + "</span>");
  });
  var linkedText = autolinker.link(textHtml);

  Meteor.call("createPost", linkedText, ref, function (err, id) {
    if (err) {
      HospoHero.alert(err);
    } else {
      var options = {
        "title": "New Posts on by " + Meteor.user().username,
        "users": matches,
        "commentId": id,
        "type": "post"
      };
      Meteor.call("sendNotifications", ref, "comment", options, function (err) {
        if (err) {
          HospoHero.alert(err);
        }
      });
    }
    $('.message-input-comment').val("");
  });
};
component.action.submitlikepost = function (likelist) {
  var ref = Session.get("post-like-id");
  Meteor.call("updatePost", likelist, ref, function (err, id) {
    if (err) {
      HospoHero.alert(err);
    } else {
      var options = {
        "title": "update Posts on by " + Meteor.user().username,
        "postId": id,
        "type": "post update"
      };
      Meteor.call("sendNotifications", ref, "post", options, function (err) {
        if (err) {
          HospoHero.alert(err);
        }
      });
    }
  });
};


component.state.commentsof = function () {
  return Posts.find({
    "reference": this.post._id,
    "createdBy": {$not: this.post._id}
  }, {
    sort: {"createdOn": 1}
  });
};

component.state.activecomment = function () {
  var count = Posts.find({
      "reference": this.post._id,
      "createdBy": {$not: this.post._id}
    },
    {
      sort: {"createdOn": 1}
    }).count();
  return !count;
};
