var autolinker = new Autolinker({
  "twitter": false
});

var component = FlowComponents.define("textArea", function(props) {
  this.set('placeholder', props.placeholder);
  this.type = props.type;
  this.ref = props.referenceId ? props.referenceId : null;
  this.refType = props.refType ? props.refType : null;
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
};

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
      taggedUsers.push({
        name: '@' + HospoHero.username(subscriber._id),
        username: '@' + subscriber.username
      });
    }
  });

  var textHtml = '<div class="non">' + text + '</div>';

  taggedUsers.forEach(function(user) {
    textHtml = textHtml.replace(user.username, '<span class="label label-success">' + user.name + '</span>');
  });
  var linkedText = autolinker.link(textHtml);

  if(self.type == "newsFeedMainTextBox" || self.type == "newsFeedSubTextBox") {
    Meteor.call("createNewsfeed", linkedText, ref, matches, HospoHero.handleMethodResult(function() {
      $('.message-input-post').val("");
    }));

  } else if(this.type == "submitComment") {
    Meteor.call("createComment", linkedText, ref, refType, matches, HospoHero.handleMethodResult(function() {
      $('.message-input-post').val("");
    }));
  }
};