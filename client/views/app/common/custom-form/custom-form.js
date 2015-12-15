Template.customForm.onCreated(function () {
  this.set('errors', {});
  this.onSubmit = this.data.onSubmit;
});

Template.customForm.onRendered(function () {
  document.getElementsByName(this.data.fields[0].name)[0].focus();
});

Template.customForm.helpers({
  name: function () {
    return this.name;
  },
  fields: function () {
    return this.fields;
  },
  submitCaption: function () {
    return this.submitCaption || 'Submit';
  },
  errorHandler: function () {
    var self = Template.instance();
    return function (fieldName, hasErrorState) {
      var errors = self.get('errors');
      errors[fieldName] = hasErrorState;
      self.set('errors', errors);
    }
  }
});

Template.customForm.events({
  'submit form': function (event, tmpl) {
    event.preventDefault();

    if (_.values(tmpl.get('errors')).indexOf(true) > -1) {
      return false;
    } else {
      var fields = tmpl.data.fields;

      var values = {};
      fields.forEach(function (field) {
        values[field.name] = event.target[field.name].value;
      });

      tmpl.onSubmit(values);
    }
  }
});