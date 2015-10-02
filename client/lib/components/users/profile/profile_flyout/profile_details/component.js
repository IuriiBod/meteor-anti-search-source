var component = FlowComponents.define('profileFlyout', function(props) {
  props.id ? this.set("id", props.id) : this.set("id", Meteor.userId());
});

component.state.basic = function() {
  var id = this.get("id");
  var user = Meteor.users.findOne(id);
  this.set("user", user);
  return user;
};

component.state.email = function() {
  var user = this.get("user");
  if(user && user.emails) {
    return user.emails[0].address;
  }
};

component.state.image = function() {
  var user = this.get("user");
  if(user && user.services && user.services.google) {
    return user.services.google.picture;
  } else {
    return "/images/user-image.jpeg";
  }
};

//permitted for profile owner and admins
component.state.isEditPermitted = function() {
  return HospoHero.isManager() || HospoHero.isMe(this.get('id'));
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