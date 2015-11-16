Template.createLocation.helpers({
  countries: function () {
    return HospoHero.misc.getCountries();
  }
});

Template.createLocation.events({
  'change input[type="radio"]': function () {
    FlowComponents.callAction('changeEnable');
  },

  'submit form': function (e, tmpl) {
    e.preventDefault();

    var fields = [
      'name',
      'country',
      'city',
      'address',
      {
        name: 'timezone',
        parse: 'int'
      }
    ];
    var doc = HospoHero.misc.getValuesFromEvent(e, fields, true);

    var pos = HospoHero.misc.getValuesFromEvent(e, [
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
    if(pos.key || pos.secret || pos.host) {
      doc.pos = pos;
    }

    doc.openingTime = HospoHero.misc.getValuesFromEvent(e, [
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

    doc.closingTime = HospoHero.misc.getValuesFromEvent(e, [
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
    doc.organizationId = e.target.dataset.id;

    FlowComponents.callAction('submit', doc);

    var flyout = FlyoutManager.getInstanceByElement(e.target);
    flyout.close();
  }
});