Template.editLocation.onCreated(function() {
  this._customForm = new CustomForm({
    name: 'editLocationForm',
    id: 'editLocationForm'
  });
});

Template.editLocation.helpers({
  posForm: function() {
    var location = FlowComponents.callAction('getLocation')._result;
    if(location && location.pos) {
      var tpl = Template.instance();
      tpl._posForm = new CustomForm({
        name: 'posForm',
        id: 'posForm'
      });

      tpl._posForm.addField('posKey', {
        label: 'Key',
        placeholder: 'Key',
        value: location.pos.posKey || '',
        validation: {
          required: true
        }
      });

      tpl._posForm.addField('posSecret', {
        label: 'Secret',
        placeholder: 'Secret',
        value: location.pos.posSecret || '',
        validation: {
          required: true
        }
      });

      tpl._posForm.addField('posHost', {
        label: 'Host',
        placeholder: 'Host',
        value: location.pos.posHost || '',
        validation: {
          required: true
        }
      });

      tpl._posForm.addField('submitPos', {
        type: 'submit',
        value: 'Save POS Settings'
      });
      return tpl._posForm.getForm();
    }
  },


  editLocationForm: function() {
    var location = FlowComponents.callAction('getLocation')._result;
    if(location) {
      var tpl = Template.instance();

      tpl._customForm.addField('address', {
        placeholder: 'Address',
        label: 'Address',
        value: location.address || '',
        validation: {
          required: true
        }
      });

      tpl._customForm.addField('timezone', {
        label: 'Timezone',
        type: 'select',
        options: HospoHero.dateUtils.timezones(),
        value: location.timezone
      });

      tpl._customForm.addField('openingHour', {
        label: 'Opening Time',
        type: 'select',
        class: 'col-xs-6',
        options: HospoHero.dateUtils.hours(),
        value: new Date(location.openingTime).getHours()
      });

      tpl._customForm.addField('openingMinutes', {
        label: '&nbsp;',
        type: 'select',
        class: 'col-xs-6',
        options: HospoHero.dateUtils.minutes(),
        value: new Date(location.openingTime).getMinutes()
      });

      tpl._customForm.addField('closingHour', {
        label: 'Closing Time',
        type: 'select',
        class: 'col-xs-6',
        options: HospoHero.dateUtils.hours(),
        value: new Date(location.closingTime).getHours()
      });

      tpl._customForm.addField('closingMinutes', {
        label: '&nbsp;',
        type: 'select',
        class: 'col-xs-6',
        options: HospoHero.dateUtils.minutes(),
        value: new Date(location.closingTime).getMinutes()
      });

      tpl._customForm.addField('country', {
        label: 'Country',
        type: 'select',
        options: HospoHero.misc.getCountries(),
        value: location.country
      });

      tpl._customForm.addField('city', {
        label: 'City',
        placeholder: 'City',
        value: location.city,
        validation: {
          required: true
        }
      });

      tpl._customForm.addField('submitEditLocation', {
        type: 'submit',
        value: 'Save location'
      });

      return tpl._customForm.getForm();
    }
  }
});

Template.editLocation.events({
  'submit #editLocationForm': function(e, tpl) {
    e.preventDefault();
    var validation = tpl._customForm.validate(tpl);

    if(validation) {
      var location = FlowComponents.callAction('getLocation')._result;

      validation.openingTime = getDate(validation.openingHour, validation.openingMinutes);
      delete validation.openingHour;
      delete validation.openingMinutes;

      validation.closingTime = getDate(validation.closingHour, validation.closingMinutes);
      delete validation.closingHour;
      delete validation.closingMinutes;

      var updatedLocation = _.extend(location, validation);
      Meteor.call('editLocation', updatedLocation, HospoHero.handleMethodResult(function() {
        HospoHero.success('Location was successfully changed');
      }));
    }
  },

  'submit #posForm': function(e, tpl) {
    e.preventDefault();
    var validation = tpl._posForm.validate(tpl);

    if(validation) {
      var location = FlowComponents.callAction('getLocation')._result;

      var updatedLocation = _.extend(location, validation);
      Meteor.call('editLocation', updatedLocation, HospoHero.handleMethodResult(function() {
        HospoHero.success('POS Settings were successfully changed');
      }));
    }
  }
});

function getDate(hours, minutes) {
  return moment({
    hours: hours,
    minutes: minutes
  }).toDate();
}