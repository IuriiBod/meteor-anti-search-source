var autolinker = new Autolinker({
  "twitter": false
});
var component = FlowComponents.define("newsFeed", function (props) {
  this.referenceId = props.user._id;
});

component.state.postsExist = function () {
  var count = Posts.find({
    "relations.areaId": HospoHero.getCurrentArea()._id
  }, {sort: {"createdOn": -1}}).count();
  return count > 0;
};

component.state.postsList = function () {
  return Posts.find({
    "relations.areaId": HospoHero.getCurrentArea()._id
  }, {sort: {"createdOn": -1}});
};

component.action.submit = function (text) {
  var ref = this.referenceId;
  //find tagged users
  var matched = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
  while (match = matched.exec(text)) {
    matches.push(match[1]);
  }
  var taggedUsers = [];
  matches.forEach(function (username) {
    var filter = new RegExp(username, 'i');
    var subscriber = Meteor.users.findOne({
      "username": filter,
      "relations.organizationId": HospoHero.isInOrganization()
    });
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
    $('.message-input-post').val("");
  });
};
