var component = FlowComponents.define('addNewUnavailability', function (props) {
    this.set('isAllDay', false);
});

component.action.isAllDayChange = function (newValue) {
    this.set('isAllDay', newValue);
};

component.action.addUnavailability = function (newUnavailability) {

    var unavailability = {
        startDate: new Date(newUnavailability.startTime),
        repeat: newUnavailability.repeat,
        comment: newUnavailability.comment
    };

    if (this.get('isAllDay')) {
        unavailability.endDate = new Date(newUnavailability.startDate);
    } else {
        unavailability.endDate = new Date(newUnavailability.endDate);
    };

    Meteor.call('addUnavailability', unavailability);
    Router.go('userUnavailability');
};