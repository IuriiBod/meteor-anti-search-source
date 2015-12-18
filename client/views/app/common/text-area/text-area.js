//context: placeholder (String), type (String), ref (String/null), refType (String/null)

var autolinker = new Autolinker({
  "twitter": false
});

Template.textArea.onRendered(function () {
  this.sendNewsfeed = function () {
    var textArea = this.$('.message-area');
    var text = textArea.val();
    if (text) {
      textArea.val('');

      //find tagged users
      var mentionRegExp = /(?:^|\W)@(\w+)(?!\w)/g, match, matches = [];
      while (match = mentionRegExp.exec(text)) {
        var user = Meteor.users.findOne({
          username: match[1],
          "relations.areaIds": {$all: [HospoHero.getCurrentAreaId()]}
        });
        if (user) {
          matches.push(match[1]);
        }
      }

      var taggedUsers = [];
      matches.forEach(function (username) {
        var filter = new RegExp(username);
        var subscriber = Meteor.users.findOne({"username": filter});
        if (subscriber) {
          taggedUsers.push({
            name: '@' + HospoHero.username(subscriber._id),
            username: '@' + subscriber.username
          });
        }
      });

      var textHtml = '<div class="non">' + text + '</div>';

      taggedUsers.forEach(function (user) {
        textHtml = textHtml.replace(user.username, '<span class="label label-success">' + user.name + '</span>');
      });

      var linkedText = autolinker.link(textHtml);

      if (this.data.type == "newsFeedMainTextBox" || this.data.type == "newsFeedSubTextBox") {
        Meteor.call("createNewsfeed", linkedText, this.data.reference, matches, HospoHero.handleMethodResult());
      } else if (this.data.type == "submitComment") {
        Meteor.call("createComment", linkedText, this.data.reference, this.data.refType, matches, HospoHero.handleMethodResult());
      }
    }
  }
});

Template.textArea.helpers({
  buttonCaption: function () {
    return this.ref ? 'Add comment' : 'Share';
  },
  settings: function () {
    var settingsBundle = {
      limit: 10,
      rules: [{
        token: '@',
        collection: Meteor.users,
        field: "username",
        filter: {
          "_id": {$nin: [Meteor.userId()]},
          "isActive": true
        },
        sort: true,
        template: Template.username,
        noMatchTemplate: Template.noMatchTemplate
      }]
    };

    if (this.type == "newsFeedMainTextBox" || this.type == "newsFeedSubTextBox") {
      settingsBundle.position = "bottom";
    } else if (this.type == "submitComment") {
      settingsBundle.position = "top";
    }

    return settingsBundle;
  }
});

Template.textArea.events({
  'click .submit-comment-button': function (event, tmpl) {
    event.preventDefault();
    tmpl.sendNewsfeed(event);
  },

  'keypress .message-area': function (event, tmpl) {
    if (event.keyCode == 10 || event.keyCode == 13) {
      event.preventDefault();
      tmpl.sendNewsfeed(event);
    }
  }
});