var component = FlowComponents.define('profile', function(props) {
  props.id ? this.set("id", props.id) : this.set("id", Meteor.userId());
});

component.state.basic = function() {
  var id = this.get("id");
  var user = Meteor.users.findOne(id);
  this.set("user", user);
  return user;
};

component.state.firstName = function() {
  var user = Meteor.users.findOne(this.get("id"));
  if(user && user.profile && user.profile.firstname) {
    return user.profile.firstname;
  } else {
    return user.username;
  }
}

 component.state.lastName = function() {
  var user = Meteor.users.findOne(this.get("id"));
  if(user && user.profile && user.profile.lastname) {
    return user.profile.lastname;
  } else {
    return "";
  }
 }

component.state.email = function() {
  var user = this.get("user");
  if(user && user.emails) {
    return user.emails[0].address;
  }
};

//permitted for profile owner and admins
component.state.isEditPermitted = function() {
  return HospoHero.isManager() || isMe(this.get('id'));
};

component.state.shiftsPerWeek = function() {
  var user = this.get("user");
  var shifts = [1, 2, 3, 4, 5, 6, 7];
  var formattedShifts = [];

  shifts.forEach(function(shift) {
    var doc = {
      "shift": shift
    };
    doc.selected = user && user.profile.shiftsPerWeek == shift;
    formattedShifts.push(doc);
  });
  return formattedShifts;
};

component.state.hasResignDate = function() {
  var user = Meteor.users.findOne(this.get("id"));
  return !!user.profile.resignDate;
};

component.state.resignDate = function() {
  var id = this.get("id");
  var user = Meteor.users.findOne({_id: id});
  var resignDate = user.profile.resignDate;
  return resignDate ? moment(resignDate).format("MM/DD/YYYY") : null;
};