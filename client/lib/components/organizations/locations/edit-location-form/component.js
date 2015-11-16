var component = FlowComponents.define('editLocationForm', function (props) {
  this.set('submitCaption', props.submitCaption);
  this.set('locationDoc', props.locationDoc || {});
  this.onSubmit = props.onSubmit;
  this.onCancel = props.onCancel;

  var format = 'HH:mm';
  this.defaultOpeningTime = moment('08:00', format).toDate();
  this.defaultClosingTime = moment('17:00', format).toDate();
});

component.state.timeZone = function () {
  var locationDoc = this.get('locationDoc');
  return locationDoc.timezone || TimezonePicker.detectedZone();
};

component.state.openingTime = function () {
  var locationDoc = this.get('locationDoc');
  return locationDoc.openingTime || this.defaultOpeningTime;
};

component.state.closingTime = function () {
  var locationDoc = this.get('locationDoc');
  return locationDoc.closingTime || this.defaultClosingTime;
};


component.action.submit = function (newLocationDoc) {
  if (_.isFunction(this.onSubmit)) {
    this.onSubmit(newLocationDoc);
  }
};


component.action.cancel = function () {
  if (_.isFunction(this.onCancel)) {
    this.onCancel();
  }
};