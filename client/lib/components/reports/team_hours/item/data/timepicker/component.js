var component = FlowComponents.define('timepicker', function (props) {
  this.editCb = props.editCb;
  this.set('shift', props.shift);
  this.type = props.type;
});

component.action.submitTime = function (date) {
  if (date) {
    var shift = this.get('shift');
    var hours = date.hour();
    var minutes = date.minutes();
    if (this.type === 'editStart') {
      shift.startedAt = moment(shift.startedAt).hours(hours).minutes(minutes).toDate();
    }
    else {
      shift.finishedAt = moment(shift.finishedAt).hours(hours).minutes(minutes).toDate();
    }
    Meteor.call("editShift", shift, HospoHero.handleMethodResult());
  }
  this.editCb();
};