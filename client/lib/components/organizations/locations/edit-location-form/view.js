Template.editLocationForm.helpers({
  countries: function () {
    return HospoHero.misc.getCountries();
  }
});

Template.editLocationForm.events({
  'submit .edit-location-form-component': function (event, tmpl) {
    event.preventDefault();

    var fields = [
      'name',
      'country',
      'city',
      'address'
    ];

    var locationDoc = HospoHero.misc.getValuesFromEvent(event, fields, true);

    locationDoc.timezone = tmpl.$('.time-zone-select').val();

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
      locationDoc.pos = pos;
    }

    locationDoc.openingTime = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'openingHour',
        newName: 'hours'
      },
      {
        name: 'openingMinutes',
        newName: 'minutes'
      }
    ], true);
    locationDoc.openingTime = moment(locationDoc.openingTime).toDate();

    locationDoc.closingTime = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'closingHour',
        newName: 'hours'
      },
      {
        name: 'closingMinutes',
        newName: 'minutes'
      }
    ], true);
    locationDoc.closingTime = moment(locationDoc.closingTime).toDate();

    locationDoc.organizationId = HospoHero.getOrganization()._id;

    FlowComponents.callAction('submit', locationDoc, event);
  },

  'click .cancel-button': function (event, tmpl) {
    FlowComponents.callAction('cancel', event);
  }
});
