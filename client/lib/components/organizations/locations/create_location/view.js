Template.createLocation.helpers({
  countries: function () {
    return HospoHero.misc.getCountries();
  },
  usersTimeZone: function () {
    return TimezonePicker.detectedZone();
  }
});

Template.createLocation.events({
  'change input[type="radio"]': function () {
    FlowComponents.callAction('changeEnable');
  },

  'submit form': function (event, tmpl) {
    event.preventDefault();

    var fields = [
      'name',
      'country',
      'city',
      'address',
      'timezone'
    ];
    var doc = HospoHero.misc.getValuesFromEvent(event, fields, true);

    doc.timezone = tmpl.$('.time-zone-select').val();

    var pos = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'posKey',
        newName: 'key'
      },
      {
        name: 'posSecret',
        newName: 'secret'
      },
      {
        name: 'posHost',
        newName: 'host'
      }
    ], true);
    if (pos.key || pos.secret || pos.host) {
      doc.pos = pos;
    }

    doc.openingTime = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'openingHour',
        newName: 'hours'
      },
      {
        name: 'openingMinutes',
        newName: 'minutes'
      }
    ], true);
    doc.openingTime = moment(doc.openingTime).toDate();

    doc.closingTime = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'closingHour',
        newName: 'hours'
      },
      {
        name: 'closingMinutes',
        newName: 'minutes'
      }
    ], true);
    doc.closingTime = moment(doc.closingTime).toDate();
    doc.organizationId = event.target.dataset.id;

    FlowComponents.callAction('submit', doc);

    var flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  }
});