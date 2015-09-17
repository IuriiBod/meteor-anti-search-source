Template.createLocation.helpers({
  timezones: function() {
    var zones = [];
    var selectedZone = 0;
    for(var i=-12; i<=12; i++) {
      if(i>0) {
        i = "+"+i;
      }
      if(i == selectedZone) {
        zones.push('<option value="'+i+'" selected="selected">UTC '+i+'</option>');
      } else {
        zones.push('<option value="'+i+'">UTC '+i+'</option>');
      }
    }
    return zones.join('');
  },

  hours: function(selectedHour) {
    var hours = [];
    for (var i = 0; i < 24; i++) {
      if (i == selectedHour) {
        hours.push('<option value="' + i + '" selected="selected">' + i + '</option>');
      } else {
        hours.push('<option value="' + i + '">' + i + '</option>');
      }
    }
    return hours.join('');
  },

  minutes: function() {
    var minutes = [];
    for(var i=0; i<60; i++) {
      if(i<10) {
        i = "0"+i;
      }
      minutes.push('<option value="'+i+'">'+i+'</option>');
    }
    return minutes.join('');
  }
});

Template.createLocation.events({
  'change input[type="radio"]': function() {
    FlowComponents.callAction('changeEnable');
  },

  'submit form': function(e) {
    e.preventDefault();
    var name = e.target.name.value;
    var orgId = e.target.dataset.id;

    var notExists = FlowComponents.callAction('checkExists', orgId, name);

    if(notExists._result) {
      var status = e.target.status.value;
      var address = e.target.address.value;
      var timezone = e.target.timezone.value;
      var openingTime = e.target.openingHour.value+":"+e.target.openingMinutes.value;
      var closingTime = e.target.closingHour.value+":"+e.target.closingMinutes.value;
      var doc = {
        name: name,
        address: address,
        timezone: timezone,
        openingTime: openingTime,
        closingTime: closingTime,
        status: status,
        organizationId: orgId
      };
      FlowComponents.callAction('submit', doc);

      e.target.reset();
      $("#createLocation").removeClass("show");
    }
  }
});