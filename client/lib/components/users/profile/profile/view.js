Template.profile.events({
  'change .shiftsPerWeek': function(event) {
    var id = $(event.target).attr("data-id");
    var value = $(event.target).val();
    Meteor.call("editBasicDetails", id, {"shiftsPerWeek": value}, function(err) {
      if(err) {
        console.log(err);
        return alert(err.reason);
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

    Meteor.call("resignDate", "set", id, val, function(err, data) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }

      if(data && data !== true) {
        var content = "<h4>The user has next future shifts:</h4>";

        data.forEach(function(shift) {
          content += '<p><a target="blank" href="/roster/shift/' + shift._id + '">';
          content += moment(shift.shiftDate).format("ddd, Do MMMM ");
          content += moment(shift.startTime).format("HH:mm - ");
          content += moment(shift.endTime).format("HH:mm");
          content += '</a></p>';
        });

        content += '<p>Please, remove them before resigning user.</p>';

        $("#future-shifts-modal").modal();
        $("#future-shifts-modal").find(".modal-body").html(content);
        $("#future-shifts-modal").modal("show");
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

    Meteor.call("resignDate", "update", id, val, function(err, data) {
      if(err) {
        console.log(err);
        alert(err.reason);
      }

      tpl.$(".open-resigned-date-picker").parent().removeClass("has-error").addClass("has-success");

      if(data && data !== true) {
        var content = "<h4>The user has next future shifts:</h4>";

        data.forEach(function(shift) {
          content += '<p><a target="blank" href="/roster/shift/' + shift._id + '">';
          content += moment(shift.shiftDate).format("ddd, Do MMMM ");
          content += moment(shift.startTime).format("HH:mm - ");
          content += moment(shift.endTime).format("HH:mm");
          content += '</a></p>';
        });

        content += '<p>Please, remove them before resigning user.</p>';

        $("#future-shifts-modal").modal();
        $("#future-shifts-modal").find(".modal-body").html(content);
        $("#future-shifts-modal").modal("show");
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
        console.log(err);
        return alert(err.reason);
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

  $('#username').editable({
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
        updateBasicDetails(id, editDetail, "profile.phone");
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
        updateBasicDetails(id, editDetail, "profile.emails.address");
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
        updateBasicDetails(id, editDetail, "profile.payrates.weekdays");
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
        updateBasicDetails(id, editDetail, "profile.payrates.saturday");
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
      console.log(err);
      return alert(err.reason);
    }
  });
}
