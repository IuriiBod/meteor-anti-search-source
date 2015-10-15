Template.createLocation.helpers({
  timezones: function() {
    return HospoHero.dateUtils.timezones();
  },

  hours: function() {
    return HospoHero.dateUtils.hours();
  },

  minutes: function() {
    return HospoHero.dateUtils.minutes();
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