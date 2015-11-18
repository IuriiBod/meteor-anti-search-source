var component = FlowComponents.define('customForm', function (props) {
  this.set('name', props.name);
  this.set('submitCaption', props.submitCaption || 'Submit');
  this.set('fields', props.fields);
  this.set('errors', {});

  this.onSubmit = props.onSubmit;
});

component.state.errorHandler = function () {
  var self = this;
  return function (fieldName, hasErrorState) {
    var errors = self.get('errors');
    errors[fieldName] = hasErrorState;
    self.set('errors', errors);
  }
};

component.action.submitForm = function (eventObject) {
  if(_.values(this.get('errors')).indexOf(true) > -1) {
    return false;
  } else {
    var fields = this.get('fields');

    var values = {};
    fields.forEach(function(field) {
      values[field.name] = eventObject.target[field.name].value;
    });

    this.onSubmit(values);
  }
};