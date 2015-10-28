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
    return HospoHero.misc.getCountries();
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
    var doc = HospoHero.misc.getValuesFromEvent(e, fields, true);
    doc.pos = HospoHero.misc.getValuesFromEvent(e, ['posKey', 'posSecret', 'posHost'], true);
    doc.openingTime = HospoHero.misc.getValuesFromEvent(e, ['openingHour', 'openingMinutes'], true);
    doc.closingTime = HospoHero.misc.getValuesFromEvent(e, ['closingHour', 'closingMinutes'], true);
    doc.organizationId = e.target.dataset.id;

    FlowComponents.callAction('submit', doc);

    e.target.reset();
    $("#createLocation").removeClass("show");
  }
});