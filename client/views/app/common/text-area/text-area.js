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
      var matches = [];
      let match;
      while ((match = HospoHero.regExp.mentionRegExp.exec(text))) {
        var user = Meteor.users.findOne({
          'profile.firstname': match[1],
          "relations.areaIds": {$all: [HospoHero.getCurrentAreaId()]}
        });
        if (user) {
          matches.push(user);
        }
      }

      var taggedUsers = [];
      matches.forEach(function (user) {
        var filter = new RegExp(user.profile.firstname);
        var subscriber = Meteor.users.findOne({"profile.firstname": filter});
        if (subscriber) {
          taggedUsers.push({
            name: '@' + HospoHero.username(subscriber._id)
          });
        }
      });

      var textHtml = '<div class="non">' + text.trim() + '</div>';

      taggedUsers.forEach(function (user) {
        textHtml = textHtml.replace(user.name, '<span class="label label-success">' + user.name + '</span>');
      });

      var linkedText = autolinker.link(textHtml);

      if (this.data.type === "newsFeedMainTextBox" || this.data.type === "newsFeedSubTextBox") {
        Meteor.call("createNewsfeed", linkedText, this.data.reference, matches, HospoHero.handleMethodResult());
      } else if (this.data.type === "submitComment") {
        var comment = {
          text: linkedText,
          reference: this.data.reference,
        };

        Meteor.call("createComment", comment, this.data.refType, matches, HospoHero.handleMethodResult());
      }
    }
  };
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
        field: ["profile.firstname", "profile.lastname"],
        filter: {
          "_id": {$nin: [Meteor.userId()]}
        },
        sort: true,
        template: Template.username,
        noMatchTemplate: Template.noMatchTemplate
      }]
    };

    if (this.type === "newsFeedMainTextBox" || this.type === "newsFeedSubTextBox") {
      settingsBundle.position = "bottom";
    } else if (this.type === "submitComment") {
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
    if (event.keyCode === 10) {
      event.preventDefault();
      tmpl.sendNewsfeed(event);
    }
  }
});