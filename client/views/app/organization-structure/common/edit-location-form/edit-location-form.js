Template.editLocationForm.onCreated(function () {
  var format = 'HH:mm';
  this.defaultOpeningTime = moment('08:00', format).toDate();
  this.defaultClosingTime = moment('17:00', format).toDate();

  this.isPosSettingsShown = new ReactiveVar(false);
});

Template.editLocationForm.onRendered(function () {
  this.$("input[name='name']").focus();
});

Template.editLocationForm.helpers({
  locationDoc: function () {
    return Template.instance().data.locationDoc || {};
  },
  submitCaption: function () {
    return this.submitCaption;
  },
  countries: function () {
    return HospoHero.misc.getCountries();
  },
  timeZone: function () {
    var locationDoc = Template.instance().data.locationDoc;
    return locationDoc && locationDoc.timezone || TimezonePicker.detectedZone();
  },
  openingTime: function () {
    var locationDoc = Template.instance().data.locationDoc;
    return locationDoc && locationDoc.openingTime || Template.instance().defaultOpeningTime;
  },
  closingTime: function () {
    var locationDoc = Template.instance().data.locationDoc;
    return locationDoc && locationDoc.closingTime || Template.instance().defaultClosingTime;
  },
  isPosSettingsShown: function () {
    return Template.instance().isPosSettingsShown.get();
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

    var updateLocationDoc = HospoHero.misc.getValuesFromEvent(event, fields, true);

    updateLocationDoc.timezone = tmpl.$('.time-zone-select').val();

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
      updateLocationDoc.pos = pos;
    }

    updateLocationDoc.openingTime = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'openingHour',
        newName: 'hours'
      },
      {
        name: 'openingMinutes',
        newName: 'minutes'
      }
    ], true);
    updateLocationDoc.openingTime = moment(updateLocationDoc.openingTime).toDate();

    updateLocationDoc.closingTime = HospoHero.misc.getValuesFromEvent(event, [
      {
        name: 'closingHour',
        newName: 'hours'
      },
      {
        name: 'closingMinutes',
        newName: 'minutes'
      }
    ], true);
    updateLocationDoc.closingTime = moment(updateLocationDoc.closingTime).toDate();

    if (_.isFunction(tmpl.data.onSubmit)) {
      var locationDoc = tmpl.data.locationDoc || {};
      _.extend(locationDoc, updateLocationDoc);
      tmpl.data.onSubmit(locationDoc, event);
    }
  },

  'click .cancel-button': function (event, tmpl) {
    if (_.isFunction(tmpl.data.onCancel)) {
      tmpl.data.onCancel(event);
    }
  },

  'click .show-pos-settings': function (event, tmpl) {
    var isShown = tmpl.isPosSettingsShown.get();
    tmpl.isPosSettingsShown.set(!isShown);
  }
});
