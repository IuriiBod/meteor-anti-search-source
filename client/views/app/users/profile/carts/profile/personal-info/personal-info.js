Template.profilePersonalInfo.helpers({
  //permitted for profile owner and admins
  isEditPermitted: function () {
    return HospoHero.security.hasPermissionInAreaTo("edit user's payrate") ||
      Meteor.userId() && Meteor.userId() === this._id;
  },
  firstName: function () {
    return HospoHero.utils.getNestedProperty(this, 'profile.firstname', 'Set firstname');
  },
  lastName: function () {
    return HospoHero.utils.getNestedProperty(this, 'profile.lastname', 'Set lastname');
  },
  phone: function () {
    return HospoHero.utils.getNestedProperty(this, 'profile.phone', 'Set phone');
  },
  email: function () {
    return HospoHero.utils.getNestedProperty(this, 'emails.0.address', 'Email not specified');
  }
});

Template.profilePersonalInfo.onRendered(function () {
  let getUserId = () => this.data._id;

  this.$('#firstname').editable({
    type: 'text',
    title: 'Edit first name',
    showbuttons: true,
    mode: 'inline',
    placeholder: "Enter first name here",
    success: function (response, newValue) {
      if (newValue) {
        var editDetail = {"firstname": newValue.trim()};
        Meteor.call("editBasicDetails", getUserId(), editDetail, HospoHero.handleMethodResult());
      }
    },
    display: false
  });

  this.$('#lastname').editable({
    type: 'text',
    title: 'Edit last name',
    showbuttons: true,
    mode: 'inline',
    placeholder: "Enter last name here",
    success: function (response, newValue) {
      if (newValue) {
        var editDetail = {"lastname": newValue.trim()};
        Meteor.call("editBasicDetails", getUserId(), editDetail, HospoHero.handleMethodResult());
      }
    },
    display: false
  });

  this.$('#phone').editable({
    type: 'text',
    title: 'Edit Phone Number',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function (response, newValue) {
      if (newValue) {
        var editDetail = {phone: newValue};
        Meteor.call("editBasicDetails", getUserId(), editDetail, HospoHero.handleMethodResult());
      }
    },
    display: false
  });

  this.$('#email').editable({
    type: 'text',
    title: 'Edit Email Address',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function (response, newValue) {
      if (newValue) {
        var editDetail = {email: newValue};
        Meteor.call("editBasicDetails", getUserId(), editDetail, HospoHero.handleMethodResult());
      }
    },
    display: false
  });
});