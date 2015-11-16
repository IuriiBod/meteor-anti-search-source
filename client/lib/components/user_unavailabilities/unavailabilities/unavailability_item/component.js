var component = FlowComponents.define('unavailabilityItem', function (props) {
    this.item = props.item;
});

component.state.date = function () {
    var date = this.item.startDate;
    return moment(date).format('ddd D MMM');
};

component.state.isAllDay = function () {
    var startTime = moment(this.item.startDate).format('HH:mm');
    var endTime = moment(this.item.endDate).format('hh:mm');

    return startTime == endTime;
};

component.state.time = function () {
    var startTime = moment(this.item.startDate).format('HH:mm');
    var endTime = moment(this.item.endDate).format('HH:mm');

    return {
        startTime: startTime,
        endTime: endTime
    }
};

component.state.repeat = function () {
    if (this.item.repeat == 'never') {
        return false;
    }
    if (this.item.repeat == 'weekly') {
        return 'week';
    }
    if (this.item.repeat == 'monthly') {
        return 'month';
    }
    return false;
};

component.state.comment = function () {
    return this.item.comment || false;
};


component.action.removeUnavailability = function () {
    Meteor.call('removeUnavailability', this.item);
};