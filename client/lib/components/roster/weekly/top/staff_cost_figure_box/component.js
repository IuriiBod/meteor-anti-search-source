var component = FlowComponents.define("staffCostFigureBox", function (props) {
    this.week = Router.current().params.week;
    this.year = Router.current().params.year;
    this.weekRange = getWeekStartEnd(this.week, this.year);
    this.onRendered(this.itemRendered);
});

component.state.weeklyStaffCost = function () {
    var shifts = Shifts.find({shiftDate: TimeRangeQueryBuilderShifts.forWeek(this.weekRange.monday)}).fetch();
    var total = calcStaffCost(shifts);
    this.set("actual", total);
    return total.toFixed(2)
};

component.state.percent = function () {
    var actual = this.get("actual");
    var forecast = this.get("forecast");

    var diff = 0;
    var doc = {
        "value": 0,
        "textColor": "text-navy",
        "icon": "fa-angle-up"
    };

    diff = parseFloat(forecast) - parseFloat(actual);
    doc.value = ((diff / parseFloat(forecast)) * 100).toFixed(2);

    if (diff < 0) {
        doc.textColor = "text-danger";
        doc.icon = "fa-angle-down";
    }
    return doc;
};

component.state.rosteredStaffCost = function () {
    var shifts = Shifts.find({shiftDate: TimeRangeQueryBuilderShifts.forWeek(this.weekRange.monday)}).fetch();
    shifts = _.map(shifts, function (item) {
       item.status = "draft";
        return item;
    });
    var total = calcStaffCost(shifts);
    this.set("forecast", total);
    return total.toFixed(2)
};


function calcStaffCost(shifts){
    var totalCost = 0;
    if (shifts && shifts.length > 0) {
        _.each(shifts, function (shift) {
            var user = Meteor.users.findOne({_id: shift.assignedTo});
            if (user && user.profile && user.profile.payrates) {
                var day = moment(shift.shiftDate).format("dddd");
                var rate = 0;
                var totalhours = 0;

                if (shift.status == "draft" || shift.status == "started") {
                    totalhours = moment(shift.endTime).diff(moment(shift.startTime), "h");
                } else {
                    totalhours = moment(shift.finishedAt).diff(moment(shift.startedAt), "h");
                }
                if (day) {
                    if (day == "Saturday") {
                        if (user.profile.payrates.saturday) {
                            rate = user.profile.payrates.saturday;
                        }
                    } else if (day == "Sunday") {
                        if (user.profile.payrates.sunday) {
                            rate = user.profile.payrates.sunday;
                        }
                    } else {
                        if (user.profile.payrates.weekdays) {
                            rate = user.profile.payrates.weekdays;
                        }
                    }
                }
                if (totalhours > 0) {
                    totalCost += rate * totalhours;
                }
            }
        });
    }
    return totalCost;
};




component.prototype.itemRendered = function () {
    this.$('[data-toggle="popover"]').popover({
        content: "The figure shows the actual staff cost result from the days in the past plus " +
                 "the forecast staff cost for the rest of the week. So you can see if you're on track."
    });
};