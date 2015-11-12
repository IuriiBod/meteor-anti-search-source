var component = FlowComponents.define('unavailabilityItem', function (props) {
    this.item = props.item;
});

component.state.date = function () {
    var date = this.item.startDate;
    return moment(date).format('ddd Do MM');
};

component.state.isAllDay = function () {
    var startTime = moment(this.item.startDate).format('hh:mm');
    var endTime = moment(this.item.endDate).format('hh:mm');

    return startTime == endTime;
};

component.state.time = function () {
    var startTime = moment(this.item.startDate).format('hh:mm');
    var endTime = moment(this.item.endDate).format('hh:mm');

    return {
        startTime: startTime,
        endTime: endTime
    }
};

component.state.comment = function () {
    return this.item.comment || false;
};