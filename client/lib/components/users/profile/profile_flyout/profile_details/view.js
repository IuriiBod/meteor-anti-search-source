Template.profileFlyout.events({
  'change .shiftsPerWeek': function(event) {
    var id = $(event.target).attr("data-id");
    var value = $(event.target).val();
    Meteor.call("editBasicDetails", id, {"shiftsPerWeek": value}, function(err) {
      if(err) {
        HospoHero.alert(err);
      }
    });
  },

  "submit form#flyout-change-pin": function(event) {
    event.preventDefault();
    var newPin = Template.instance().find("#flyout-new-pin").value;
    Meteor.call("changePinCode", newPin, function (err) {
      if (err) {
        HospoHero.alert(err);
      }
      else {
        alert("PIN has been changed.");
      }
    });
  }
});

Template.profileFlyout.rendered = function(){
  $.fn.editable.defaults.mode = 'inline';

  $(".open-resigned-date-picker").datepicker({
    startDate: new Date(),
    todayHighlight: true
  });

  $('#flyout-datepicker').datepicker({
    todayBtn: true,
    todayHighlight: true
  });

  $('#flyout-username').editable({
    type: 'text',
    title: 'Edit username',
    display: false,
    showbuttons: true,
    mode: 'inline',
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = $(self).attr("data-id");
        var editDetail = {"username": newValue.trim()};
        updateBasicDetails(id, editDetail, "username");
      }
    }
  });

  $('#flyout-phone').editable({
    type: 'text',
    title: 'Edit Phone Number',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = $(self).attr("data-id");
        var editDetail = {"phone": newValue};
        updateBasicDetails(id, editDetail, "profile.phone");
      }
    },
    display: function(value, sourceData) {
    }
  });

  $('#flyout-email').editable({
    type: 'text',
    title: 'Edit Email Address',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = $(self).attr("data-id");
        var editDetail = {"email": newValue};
        updateBasicDetails(id, editDetail, "profile.emails.address");
      }
    },
    display: function(value, sourceData) {
    }
  });

  $('#flyout-weekdaysrate').editable({
    type: 'text',
    title: 'Edit Weekday rate',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        if(newRate && (newRate == newRate)) {
          newRate = newRate
        } else {
          newRate = 0;
        }
        var editDetail = {"weekdaysrate": newRate};
        updateBasicDetails(id, editDetail, "profile.payrates.weekdays");
      }
    },
    display: function(value, sourceData) {
    }
  });

  $('#flyout-saturdayrate').editable({
    type: 'text',
    title: 'Edit Saturday rate',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        if(newRate && (newRate == newRate)) {
          newRate = newRate
        } else {
          newRate = 0;
        }
        var editDetail = {"saturdayrate": newRate};
        updateBasicDetails(id, editDetail, "profile.payrates.saturday");
      }
    },
    display: function(value, sourceData) {
    }
  });

  $('#flyout-sundayrate').editable({
    type: 'text',
    title: 'Edit Sunday rate',
    showbuttons: true,
    mode: 'inline',
    emptytext: 'Empty',
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        if(newRate && (newRate == newRate)) {
          newRate = newRate
        } else {
          newRate = 0;
        }
        var editDetail = {"sundayrate": newRate};
        updateBasicDetails(id, editDetail, "profile.payrates.sunday");
      }
    },
    display: function(value, sourceData) {
    }
  });

};

function updateBasicDetails(id, updateDetails, type) {
  Meteor.call("editBasicDetails", id, updateDetails, function(err) {
    if(err) {
      HospoHero.alert(err);
    }
  });
}
