Template.createLocation.helpers({
  timezones: function() {
    var zones = [];
    for(var i=-12; i<=12; i++) {
      if(i>0) {
        i = "+"+i;
      }
      zones.push({
        value: 'UTC '+i,
        title: 'UTC '+i
      });
    }
    return zones;
  },

  hours: function(selectedHour) {
    var hours = [];
    for (var i = 0; i < 24; i++) {
      hours.push({
        value: i,
        title: i
      });
    }
    return hours;
  },

  minutes: function() {
    var minutes = [];
    for(var i=0; i<60; i++) {
      if(i<10) {
        i = "0"+i;
      }
      minutes.push({
        value: i,
        title: i
      });
    }
    return minutes;
  }
});

Template.createLocation.events({
  'change input[type="radio"]': function() {
    FlowComponents.callAction('changeEnable');
  },

  'submit form': function(e) {
    e.preventDefault();

    var doc = {
      name: e.target.name.value,
      address: e.target.address.value,
      timezone: e.target.timezone.value,
      openingTime: e.target.openingHour.value+":"+e.target.openingMinutes.value,
      closingTime: e.target.closingHour.value+":"+e.target.closingMinutes.value,
      status: e.target.status.value,
      organizationId: e.target.dataset.id
    };
    FlowComponents.callAction('submit', doc);

    e.target.reset();
    $("#createLocation").removeClass("show");
  }
});