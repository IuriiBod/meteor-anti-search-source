Template.createLocation.helpers({
  timezones: function() {
    var zones = [];
    for(var i=-12; i<=12; i++) {
      if(i>0) {
        i = "+"+i;
      }
      zones.push('UTC '+i);
    }
    return zones;
  },

  hours: function() {
    var hours = [];
    for (var i = 0; i < 24; i++) {
      hours.push(i);
    }
    return hours;
  },

  minutes: function() {
    var minutes = [];
    for(var i=0; i<60; i++) {
      if(i<10) {
        i = "0"+i;
      }
      minutes.push(i);
    }
    return minutes;
  },

  countries: function(){
    return HospoHero.otherUtils.getCountries();
  }
});

Template.createLocation.events({
  'change input[type="radio"]': function() {
    FlowComponents.callAction('changeEnable');
  },

  'submit form': function(e) {
    e.preventDefault();

    var fields = [
      'name',
      'country',
      'city',
      'address',
      'timezone'
    ];
    var doc = HospoHero.otherUtils.getValuesFromEvent(e, fields, true);
    doc.pos = HospoHero.otherUtils.getValuesFromEvent(e, ['posKey', 'posSecret', 'posHost'], true);
    doc.openingTime = HospoHero.otherUtils.getValuesFromEvent(e, ['openingHour', 'openingMinutes'], true);
    doc.closingTime = HospoHero.otherUtils.getValuesFromEvent(e, ['closingHour', 'closingMinutes'], true);
    doc.organizationId = e.target.dataset.id;

    FlowComponents.callAction('submit', doc);

    e.target.reset();
    $("#createLocation").removeClass("show");
  }
});