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
  if(props.refType) {
    this.refType = props.refType;
  } else {
    this.refType = null;
  }
});

component.state.settings = function() {
  var data = {};
  if(this.type == "newsFeedMainTextBox" || this.type == "newsFeedSubTextBox") {
    data['position'] = "bottom";
  } else if(this.type == "submitComment") {
    data['position'] = "top";
  }
  data['limit'] = 10;
  data['rules'] = [{
    token: '@',
    collection: Meteor.users,
    field: "username",
    filter: { "_id": {$nin: [Meteor.userId()]}, "isActive": true},
    sort: true,
    template: Template.username,
    noMatchTemplate: Template.noMatchTemplate
  }];
  return data;  
}

component.state.placeholder = function() {
  return this.placeholder;
}

component.action.submit = function(text) {
  var self = this;
  //find tagged users
  var ref = self.ref;
  var refType = self.refType;


  var matched = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
  while (match = matched.exec(text)) {
    matches.push(match[1]);
  }

  var taggedUsers = [];

  matches.forEach(function(username) {
    var filter = new RegExp(username);
    var subscriber = Meteor.users.findOne({"username": filter});
    if(subscriber) {
      var userClass = "label-success";
      var doc = {
        "class": userClass
      }
      if(subscriber.profile.firstname && subscriber.profile.lastname) {
        doc["name"] = "@" + subscriber.profile.firstname + " " + subscriber.profile.lastname; 
      } 
      doc['username'] = "@" + subscriber.username;
      taggedUsers.push(doc);
    }
  });

  var textHtml = "<div class='non'>" + text + "</div>"
  taggedUsers.forEach(function(user) {
    var name = null;
    if(user.hasOwnProperty("name")) {
      name = user.name;
    } else {
      name = user.username;
    }
    textHtml = textHtml.replace(user.username, "<span class='label " + user.class + "'>" + name + "</span>");
  });
  var linkedText = autolinker.link(textHtml);

  if(self.type == "newsFeedMainTextBox" || self.type == "newsFeedSubTextBox") {
    Meteor.call("createNewsfeed", linkedText, ref, function(err, id) {
      if(err) {
        HospoHero.error(err);
      } else {
        notify(self.type, id, matches, ref);
      }
      $('.message-input-post').val("");
    });

  } else if(this.type == "submitComment") {
    Meteor.call("createComment", linkedText, ref, function(err, id) {
      if(err) {
        HospoHero.error(err);
      } else {
        var reference = null;
        var ref_name = null;
        var ref_type = refType;
        
        if(refType == "menu") {
          reference = MenuItems.findOne(ref);
        } else if(refType == "job") {
          reference = JobItems.findOne(ref);
        } else if(refType == "workerJob") {
          reference = Jobs.findOne(ref) ;
        }

        if(reference) {
          ref_name = reference.name;
        }
        var options = {
          "title": "New comment on " + ref_name + " by " + Meteor.user().username,
          "users": matches,
          "commentId": id,
          "type": ref_type
        }
        sendNotifi(ref, "comment", options);
      }
      $('.message-input-post').val("");
    });
  }
}

notify = function(type, id, matches, ref) {
  if(type == "newsFeedMainTextBox") {

    if(matches.length > 0) {
      var options = {
        "title": "You've been mentioned in new newsfeed created by " + Meteor.user().username,
        "users": matches,
        "newsfeedId": id,
        "type": "new"
      }
      sendNotifi(id, "newsfeed", options);
    }
  } else if(type == "newsFeedSubTextBox") {
    var thisUser = Meteor.user();
    var mainNewsFeed = NewsFeeds.findOne(ref);
    var createdBy = Meteor.users.findOne(mainNewsFeed.createdBy);
    
    if(mainNewsFeed) {
      var name = thisUser.username;
      if(thisUser.profile.firstname && thisUser.profile.lastname) {
        name = thisUser.profile.firstname + " " + thisUser.profile.lastname;
      }
      
      if(createdBy._id != Meteor.userId()) {
        //created user
        var options = {
          "title": name + " commented on your newsfeed post",
          "users": [createdBy.username],
          "newsfeedId": id,
          "type": "newsfeedComment"
        }
        sendNotifi(ref, "newsfeed", options);
      }

      if(matches.length > 0) {
        var index = matches.indexOf(createdBy.username);
        if(index >= 0) {
          matches.splice(index, 1);
        }

        //tagged users 
        if(matches.length > 0) {
          var options = {
            "title": "You've been mentioned in newsfeed by " + name,
            "users": matches,
            "newsfeedId": id,
            "type": "newsfeedComment"
          }
          sendNotifi(ref, "newsfeed", options);
        }
      }
    }
  }
}


sendNotifi = function(ref, type, options) {
  Meteor.call("sendNewsfeedNotifications", ref, type, options, function(err) {
    if(err) {
      HospoHero.error(err);
    }
    return;
  });  
}