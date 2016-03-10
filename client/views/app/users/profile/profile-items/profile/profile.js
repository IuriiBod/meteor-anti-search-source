Template.profile.onRendered(function () {
  var userId = this.data._id;
  makeInputsEditable(userId);
});

Template.profile.helpers({
  user: function () {
    return this;
  },
  firstName: function () {
    if (this && this.profile && this.profile.firstname) {
      return this.profile.firstname;
    } else {
      return "";
    }
  },
  lastName: function () {
    if (this && this.profile && this.profile.lastname) {
      return this.profile.lastname;
    } else {
      return "";
    }
  },
  email: function () {
    if (this && this.emails) {
      return this.emails[0].address;
    }
  },
  //permitted for profile owner and admins
  isEditPermitted: function () {
    return HospoHero.security.hasPermissionInAreaTo("edit user's payrate") ||
        Meteor.userId() && Meteor.userId() === this._id;
  },
  isMe: function (userId) {
    return Meteor.userId() && Meteor.userId() === userId;
  },
  shiftsPerWeek: function () {
    var user = this;
    var shifts = [1, 2, 3, 4, 5, 6, 7];
    var formattedShifts = [];

    shifts.forEach(function (shift) {
      var doc = {
        "shift": shift
      };
      doc.selected = user && user.profile.shiftsPerWeek === shift;
      formattedShifts.push(doc);
    });
    return formattedShifts;
  },
  hasResignDate: function () {
    return !!this.profile.resignDate;
  },
  resignDate: function () {
    var resignDate = this.profile.resignDate;
    return resignDate ? moment(resignDate).format("MM/DD/YYYY") : null;
  },
  lastLoginDate: function () {
    return this.lastLoginDate && moment.duration(moment().diff(this.lastLoginDate)).humanize() || 'never';
  }
});

Template.profile.events({
  'change .shiftsPerWeek': function (event) {
    var id = $(event.target).attr("data-id");
    var value = $(event.target).val();
    Meteor.call("editBasicDetails", id, {"shiftsPerWeek": value}, HospoHero.handleMethodResult());
  },

  'click #set-resign-date': function (e, tpl) {
    e.preventDefault();
    var id = Router.current().params._id;
    var val = tpl.$(".open-resigned-date-picker").val();

    if (!val) {
      tpl.$(".open-resigned-date-picker").focus().parent().addClass("has-error");
      return;
    } else {
      tpl.$(".open-resigned-date-picker").parent().addClass("has-success");
    }

    Meteor.call("resignDate", "set", id, val, HospoHero.handleMethodResult());
  },

  'click #update-resign-date': function (e, tpl) {
    e.preventDefault();
    var id = Router.current().params._id;
    var val = tpl.$(".open-resigned-date-picker").val();

    if (!val) {
      tpl.$(".open-resigned-date-picker").focus().parent().removeClass("has-success").addClass("has-error");
      return;
    } else {
      tpl.$(".open-resigned-date-picker").parent().removeClass("has-error").addClass("has-success");
    }

    Meteor.call("resignDate", "update", id, val, HospoHero.handleMethodResult(function () {
      tpl.$(".open-resigned-date-picker").parent().removeClass("has-error").addClass("has-success");
    }));
  },

  'click #remove-resign-date': function (e) {
    e.preventDefault();
    var id = Router.current().params._id;
    Meteor.call("resignDate", "remove", id, '', HospoHero.handleMethodResult());
  },

  "submit form#change-pin": function (event) {
    event.preventDefault();
    var newPin = Template.instance().find("#new-pin").value;
    Meteor.call("changePinCode", newPin, HospoHero.handleMethodResult(function () {
      HospoHero.info("PIN has been changed");
    }));
  }
});

function makeInputsEditable(userId) {
  $(".open-resigned-date-picker").datepicker({
    startDate: new Date(),
    todayHighlight: true
  });

  $('#datepicker').datepicker({
    todayBtn: true
  });

  $('#firstname').editable({
    type: 'text',
    title: 'Edit first name',
    display: function () {
    },
    showbuttons: true,
    mode: 'inline',
    placeholder: "Enter first name here",
    success: function (response, newValue) {
      if (newValue) {
        var editDetail = {"firstname": newValue.trim()};
        updateBasicDetails(userId, editDetail);
      }
    }
  });

  $('#lastname').editable({
    type: 'text',
    title: 'Edit last name',
    display: function () {
    },
    showbuttons: true,
    mode: 'inline',
    placeholder: "Enter last name here",
    success: function (response, newValue) {
      if (newValue) {
        var editDetail = {"lastname": newValue.trim()};
        updateBasicDetails(userId, editDetail);
      }
    }
  });

  $('#phone').editable({
    type: 'text',
    title: 'Edit Phone Number',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function (response, newValue) {
      var self = this;
      if (newValue) {
        var id = $(self).attr("data-id");
        var editDetail = {"phone": newValue};
        updateBasicDetails(id, editDetail);
      }
    },
    display: function () {}
  });

  $('#email').editable({
    type: 'text',
    title: 'Edit Email Address',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function (response, newValue) {
      var self = this;
      if (newValue) {
        var id = $(self).attr("data-id");
        var editDetail = {"email": newValue};
        updateBasicDetails(id, editDetail);
      }
    },
    display: function () {}
  });

  $('#weekdaysrate').editable({
    type: 'text',
    title: 'Edit Weekday rate',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function (response, newValue) {
      var self = this;
      if (newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        newRate = isNaN(newRate) ? 0 : newRate;
        var editDetail = {"weekdaysrate": newRate};
        updateBasicDetails(id, editDetail);
      }
    },
    display: function () {}
  });

  $('#saturdayrate').editable({
    type: 'text',
    title: 'Edit Saturday rate',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function (response, newValue) {
      var self = this;
      if (newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        newRate = isNaN(newRate) ? 0 : newRate;
        var editDetail = {"saturdayrate": newRate};
        updateBasicDetails(id, editDetail);
      }
    },
    display: function () {}
  });

  $('#sundayrate').editable({
    type: 'text',
    title: 'Edit Sunday rate',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function (response, newValue) {
      var self = this;
      if (newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        newRate = isNaN(newRate) ? 0 : newRate;
        var editDetail = {"sundayrate": newRate};
        updateBasicDetails(id, editDetail);
      }
    },
    display: function () {}
  });
}

function updateBasicDetails(id, updateDetails) {
  Meteor.call("editBasicDetails", id, updateDetails, HospoHero.handleMethodResult());
}

