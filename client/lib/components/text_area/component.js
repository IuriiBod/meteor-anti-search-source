var autolinker = new Autolinker({
  "twitter": false
});


var component = FlowComponents.define("textArea", function(props) {
  this.placeholder = props.placeholder;
  this.type = props.type;
  if(props.referenceId) {
    this.ref = props.referenceId;
  } else {
    this.ref = null;
  }
});

component.state.placeholder = function() {
  return this.placeholder;
}

component.action.submit = function(text) {
  //find tagged users
  var ref = this.ref;

  var matched = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
  while (match = matched.exec(text)) {
    matches.push(match[1]);
  }
  var taggedUsers = [];
  matches.forEach(function(username) {
    var filter = new RegExp(username, 'i');
    var subscriber = Meteor.users.findOne({"username": filter});
    if(subscriber) {
      var userClass = "label-success";
      var doc = {
        "user": "@" + subscriber.username,
        "class": userClass
      }
      taggedUsers.push(doc);
    }
  });

  var classes = ['info', 'success', 'danger', 'primary', 'warning'];
  var textHtml = "<div class='non'>" + text + "</div>"
  taggedUsers.forEach(function(user) {
      textHtml = textHtml.replace(user.user, "<span class='label " + user.class + "'>" + user.user + "</span>");
  });
  var linkedText = autolinker.link(textHtml);


  if(this.type == "newsFeedMainTextBox" || this.type == "newsFeedSubTextBox") {
    Meteor.call("createNewsfeed", linkedText, ref, function(err, id) {
      if(err) {
        console.log(err);
        return alert(err.reason);
      } else {
        // var options = {
        //   "title": "New newsfeed created by " + Meteor.user().username,
        //   "users": matches,
        //   "commentId": id,
        //   "type": "post"
        // }
        // Meteor.call("sendNotifications", Meteor.userId(), "comment", options, function(err) {
        //   if(err) {
        //     console.log(err);
        //     return alert(err.reason);
        //   }
        // });
      }
      $('.message-input-post').val("");
    });
  } 
}