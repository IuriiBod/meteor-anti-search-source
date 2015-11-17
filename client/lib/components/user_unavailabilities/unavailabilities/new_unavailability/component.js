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

component.action.addUnavailability = function (params) {
    var startDate = getDate(params.date, params.startTime);
    var endDate = this.get('isAllDay') ? startDate : getDate(params.date, params.endTime);

    var unavailability = {
        startDate: startDate,
        endDate: endDate,
        repeat: params.repeat,
        comment: params.comment
    };

    Meteor.call('addUnavailability', unavailability, HospoHero.handleMethodResult());
    Router.go('userUnavailability');
};

var getDate = function (date, time) {
    return new Date(moment(date).hours(time.hours()).minutes(time.minutes()));
};