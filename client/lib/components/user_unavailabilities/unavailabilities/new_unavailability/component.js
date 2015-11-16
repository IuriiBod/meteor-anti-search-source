var component = FlowComponents.define('addNewUnavailability', function () {
    this.set('timePickerVisibility', '');
    this.set('isAllDay', false);
});

component.action.isAllDayChange = function (value) {
    this.set('isAllDay', value);
    if (value) {
        this.set('timePickerVisibility', 'hide');
    } else {
        this.set('timePickerVisibility', '');
    }
};

component.action.addUnavailability = function (newUnavailability) {

    var unavailability = {
        startDate: new Date(newUnavailability.startTime),
        repeat: newUnavailability.repeat,
        comment: newUnavailability.comment
    };

    if (this.get('isAllDay')) {
        unavailability.endDate = new Date(newUnavailability.startTime);
    } else {
        unavailability.endDate = new Date(newUnavailability.endTime);
    };

    Meteor.call('addUnavailability', unavailability);
    Router.go('userUnavailability');
};