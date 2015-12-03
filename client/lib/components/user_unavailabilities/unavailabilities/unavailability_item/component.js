var component = FlowComponents.define('unavailabilityItem', function (props) {
    this.item = props.item;
});

component.state.date = function () {
    var date = this.item.startDate;
    return moment(date).format('ddd D MMM');
};

component.state.isAllDay = function () {
    return this.item.isAllDay;
};

component.state.time = function () {
    return {
        startTime: moment(this.item.startDate).format('HH:mm'),
        endTime: moment(this.item.endDate).format('HH:mm')
    };
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
    Meteor.call('removeUnavailability', this.item, HospoHero.handleMethodResult());
};