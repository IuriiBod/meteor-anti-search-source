Template.profile.events({
  'change .shiftsPerWeek': function(event) {
    var id = $(event.target).attr("data-id");
    var value = $(event.target).val();
    Meteor.call("editBasicDetails", id, {"shiftsPerWeek": value}, function(err) {
      if(err) {
        HospoHero.alert(err);
      }
    });
  },

  'click #set-resign-date': function(e, tpl) {
    e.preventDefault();
    var id = Router.current().params._id;
    var val = tpl.$(".open-resigned-date-picker").val();

    if (!val) {
      tpl.$(".open-resigned-date-picker").focus().parent().addClass("has-error");
      return;
    } else {
      tpl.$(".open-resigned-date-picker").parent().addClass("has-success");
    }

    Meteor.call("resignDate", "set", id, val, function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
  },

  'click #update-resign-date': function(e, tpl) {
    e.preventDefault();
    var id = Router.current().params._id;
    var val = tpl.$(".open-resigned-date-picker").val();

    if (!val) {
      tpl.$(".open-resigned-date-picker").focus().parent().removeClass("has-success").addClass("has-error");
      return;
    } else {
      tpl.$(".open-resigned-date-picker").parent().removeClass("has-error").addClass("has-success");
    }

    Meteor.call("resignDate", "update", id, val, function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      } else {
        tpl.$(".open-resigned-date-picker").parent().removeClass("has-error").addClass("has-success");
      }
    });
  },

  'click #remove-resign-date': function(e, tpl) {
    e.preventDefault();
    var id = Router.current().params._id;
    Meteor.call("resignDate", "remove", id, '', function(err) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }
    });
  },

  "submit form#change-pin": function(event) {
    event.preventDefault();
    var newPin = Template.instance().find("#new-pin").value;
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

Template.profile.rendered = function(){
  $.fn.editable.defaults.mode = 'inline';

  $(".open-resigned-date-picker").datepicker({
    startDate: new Date(),
    todayHighlight: true
  });

  $('#datepicker').datepicker({
    todayBtn: true,
    todayHighlight: true
  });

  $('#firstname').editable({
    type: 'text',
    title: 'Edit first name',
    display: function() {},
    showbuttons: true,
    mode: 'inline',
    placeholder: "Enter first name here",
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = Session.get("profileUser");
        var editDetail = {"firstname": newValue.trim()};
        updateBasicDetails(id, editDetail);
      }
    }
  });

  $('#lastname').editable({
    type: 'text',
    title: 'Edit last name',
    display: function() {},
    showbuttons: true,
    mode: 'inline',
    placeholder: "Enter last name here",
    success: function(response, newValue) {
      var self = this;
      if(newValue) {
        var id = Session.get("profileUser");
        var editDetail = {"lastname": newValue.trim()};
        updateBasicDetails(id, editDetail);
      }
    }
  });

  $('#phone').editable({
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
        updateBasicDetails(id, editDetail);
      }
    },
    display: function(value, sourceData) {
    }
  });

  $('#email').editable({
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
        updateBasicDetails(id, editDetail);
      }
    },
    display: function(value, sourceData) {
    }
  });

  $('#weekdaysrate').editable({
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
        updateBasicDetails(id, editDetail);
      }
    },
    display: function(value, sourceData) {
    }
  });

  $('#saturdayrate').editable({
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
        updateBasicDetails(id, editDetail);
      }
    },
    display: function(value, sourceData) {
    }
  });

  $('#sundayrate').editable({
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
        updateBasicDetails(id, editDetail);
      }
    },
    display: function(value, sourceData) {
    }
  });

};

function updateBasicDetails(id, updateDetails) {
  Meteor.call("editBasicDetails", id, updateDetails, function(err) {
    if(err) {
      HospoHero.alert(err);
    }
  });
}
