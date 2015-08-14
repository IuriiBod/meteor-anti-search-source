var component = FlowComponents.define("switchUser", function(props) {
  this.userSearchRequest = new ReactiveVar();
  this.set("users", props.users);
});

component.state.schema = function () {
  var users = _.map(this.get("users"), function (user) {
    return {
      label: user.username,
      value: user._id
    };
  });
  return new SimpleSchema({
    username: {
      type: String,
      optional: true,
      autoform: {
        type: "select2",
        options: users,
        multiple: false,
        placeholder: "Name"
      }
    }
  });
};

component.state.searchRequest = function () {
  return this.userSearchRequest.get();
};

component.action.findUser = function(request) {
  this.userSearchRequest.set(request);
};


component.action.switchUser = function(userId) {
  var loggedUsers = Session.get("loggedUsers");
  var token = loggedUsers[userId];
  Meteor.loginWithToken(token, function (err) {
    if (err) {
      console.log(err);
      return alert(err.reason);
    }
    Router.go("pinLock");
  });
};