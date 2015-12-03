Template.shiftBasicTimeEditable.onCreated(function () {
    var self = this;

    self.isEditMode = new ReactiveVar(false);

    self.setDefaultValueInTimePicker = function (timepicker, originProperty) {
        timepicker.date(self.data.shift[originProperty]);
    };

    self.fixZeroYearComdateMoment = function (momentToFix) {
        var shitTimeMoment = moment().hours(momentToFix.hours());
        shitTimeMoment.minutes(momentToFix.minutes());
        shitTimeMoment.seconds(0);
        return shitTimeMoment.toDate();
    };

    self.editShiftTime = function (newStartTime, newEndTime) {
        var shift = Shifts.findOne({_id: self.data.shift._id});

        shift.startTime = self.fixZeroYearComdateMoment(newStartTime);
        shift.endTime = self.fixZeroYearComdateMoment(newEndTime);

        HospoHero.dateUtils.adjustShiftTimes(shift);

        Meteor.call('editShift', shift, HospoHero.handleMethodResult(function () {
            self.isEditMode.set(false);
        }));
    };

    self.exitFromEditMode = function () {
        self.isEditMode.set(false);

        self.setDefaultValueInTimePicker(self.startTimePicker, 'startTime');
        self.setDefaultValueInTimePicker(self.endTimePicker, 'endTime');
    };

    self.getUserUnavailableTimeIntervals = function () {
        var assignedUserId = self.data.shift.assignedTo;
        if (!assignedUserId) {
            return;
        }

        var shiftUnavailableTimeIntervals = [];

        var shiftStartOfDayDate = moment(self.data.shift.startTime).startOf('day').toDate();
        var shiftEndOfDayDate = moment(self.data.shift.startTime).endOf('day').toDate();

        // This checking should be in method assign user, and moving shift through days
        //// find leave request, that overlays current shift
        //var leaveRequests = LeaveRequests.find({
        //    userId: assignedUserId,
        //    startDate: {$lte: shiftStartOfDayDate},
        //    endDate: {$gte: shiftEndOfDayDate}
        //}).fetch();
        //
        //// if exist at least one approved leave request,
        //if (leaveRequests.length > 0) {
        //    unavailabileTimeIntervals.push({
        //        startDate: shiftStartOfDayDate,
        //        endDate: shiftEndOfDayDate
        //    });
        //    return unavailabileTimeIntervals;
        //}

        var unavailabilities = Meteor.users.findOne({_id: assignedUserId}).unavailabilities || [];

        unavailabilities.every(function (unavailability) {
            var isUnavailabilityForToday = unavailability.repeat != 'never' && self.checkRepeatUnavailability(unavailability)
                || unavailability.startDate >= shiftStartOfDayDate && unavailability.endDate <= shiftEndOfDayDate;

            if (isUnavailabilityForToday) {
                return self.getUnavailabilityInterval(unavailability, shiftUnavailableTimeIntervals);
            }
            return true;
        });

        return shiftUnavailableTimeIntervals;
    };

    self.checkRepeatUnavailability = function (unavailability) {
        var unavailabilityMoment = moment(unavailability.startDate).startOf('day');
        var shiftMoment = moment(self.data.shift.startDate).startOf('day');

        // check day of week repeat
        if (unavailabilityMoment.day() == shiftMoment.day()) {
            return true;
        }

        // check day of month repeat
        var diffBetweenMoments = shiftMoment.diff(unavailabilityMoment, 'month');

        unavailabilityMoment.add(diffBetweenMoments, 'month');

        if (unavailabilityMoment.date() == shiftMoment.date() && unavailabilityMoment.month() == shiftMoment.month()) {
            return true;
        }
        return false;
    };

    self.getUnavailabilityInterval = function (unavailabilityItem, shiftUnavailableTimeIntervals) {
        var shiftUnavailabilityStartMoment = moment(self.data.shift.startDate);
        var shiftUnavailabilityEndMoment = moment(self.data.shift.startDate);

        // if unavailability for all day
        if (unavailabilityItem.startDate.getTime() == unavailabilityItem.endDate.getTime()) {
            shiftUnavailabilityStartMoment.startOf('day');
            shiftUnavailabilityEndMoment.endOf('day');

            shiftUnavailableTimeIntervals.push([
                shiftUnavailabilityStartMoment,
                shiftUnavailabilityEndMoment
            ]);
            return false;
        } else {
            // or, for part of day
            var unavailabilityStartTime = moment(unavailabilityItem.startDate);
            var unavailabilityEndTime = moment(unavailabilityItem.endDate);
            shiftUnavailabilityStartMoment.hours(unavailabilityStartTime.hours()).minutes(unavailabilityStartTime.minutes());
            shiftUnavailabilityEndMoment.hours(unavailabilityEndTime.hours()).minutes(unavailabilityEndTime.minutes());

            var interval = [
                shiftUnavailabilityStartMoment,
                shiftUnavailabilityEndMoment
            ];
            shiftUnavailableTimeIntervals.push(interval);
            return true;
        }
    };

    self.getAvailableIntervals = function (unavailabileTimeIntervals) {
        unavailabileTimeIntervals.sort(function (a, b){
            if (a.startTime > b.startTime) {
                return 1;
            } if (a.startTime < b.startTime) {
                return -1;
            }
            return 0;
        });
        debugger;
        var availableTimeIntervals = [];
        var shiftMoment = moment(self.data.shift.startDate);

        for (var i = -1; i < unavailabileTimeIntervals.length; i++) {
            var availableInterval = {};
            if (i == -1) {
                availableInterval.startTime = shiftMoment.startOf('day');
                availableInterval.endTime = unavailabileTimeIntervals[i + 1][0];
            } else if (i < unavailabileTimeIntervals.length - 1) {
                availableInterval.startTime = unavailabileTimeIntervals[i][1];
                availableInterval.endTime = unavailabileTimeIntervals[i + 1][0];
            }
            else {
                availableInterval.startTime = unavailabileTimeIntervals[i][1];
                availableInterval.endTime = shiftMoment.endOf('day');
            }
            availableTimeIntervals.push(availableInterval);
        }
        return availableTimeIntervals;
    }
});

Template.shiftBasicTimeEditable.onRendered(function () {
    var self = this;
    var unavailabileTimeIntervals = self.getUserUnavailableTimeIntervals();

    if (unavailabileTimeIntervals) {
        var availableTimeIntervals = self.getAvailableIntervals(unavailabileTimeIntervals);
        console.log('unavailabileTimeIntervals:\n', unavailabileTimeIntervals);
        console.log('availableTimeIntervals:\n', availableTimeIntervals);
    }

    var DATE_TIME_PICKER_FORMAT = 'HH:mm';
    var DATE_TIME_PICKER_STEP = 10;

    self.$('.start-time').datetimepicker({
        format: DATE_TIME_PICKER_FORMAT,
        dayViewHeaderFormat: DATE_TIME_PICKER_FORMAT,
        stepping: DATE_TIME_PICKER_STEP,
        defaultDate: self.data.shift.startTime,
        disabledTimeIntervals: unavailabileTimeIntervals
    });
    self.$('.end-time').datetimepicker({
        format: DATE_TIME_PICKER_FORMAT,
        dayViewHeaderFormat: DATE_TIME_PICKER_FORMAT,
        stepping: DATE_TIME_PICKER_STEP,
        defaultDate: self.data.shift.endTime,
        disabledTimeIntervals: unavailabileTimeIntervals,

        useCurrent: false //Important! See issue #1075
    });

    self.startTimePicker = self.$('.start-time').data("DateTimePicker");
    self.endTimePicker = self.$('.end-time').data("DateTimePicker");

    var MINIMUM_SHIFT_DURATION = 30;
    self.$(".start-time").on("dp.change", function (e) {
        if (self.endTimePicker.date() < e.date) {
            self.endTimePicker.date(e.date.add(MINIMUM_SHIFT_DURATION, 'minutes'));
        }
    });

    self.$(".end-time").on("dp.change", function (e) {
        if (self.startTimePicker.date() > e.date) {
            self.startTimePicker.date(e.date.subtract(MINIMUM_SHIFT_DURATION, 'minutes'));
        }
    });
});


Template.shiftBasicTimeEditable.helpers({
    shift: function () {
        return this.shift;
    },
    isEditMode: function () {
        return Template.instance().isEditMode.get();
    },
    timeRangeSelectorDisplayClass: function () {
        return Template.instance().isEditMode.get() ? '' : 'hide'
    },
    timeDisplayClass: function () {
        return Template.instance().isEditMode.get() ? 'hide' : ''
    }
});

Template.shiftBasicTimeEditable.events({
    'click .time': function (e, tmpl) {
        tmpl.isEditMode.set(true);
    },
    'submit .time-range-selector': function (e, tmpl) {
        e.preventDefault();

        var startDate = tmpl.startTimePicker.date();
        var endDate = tmpl.endTimePicker.date();
        tmpl.editShiftTime(startDate, endDate);
    },
    'click .cancel-button': function (e, tmpl) {
        tmpl.exitFromEditMode();
    }
});