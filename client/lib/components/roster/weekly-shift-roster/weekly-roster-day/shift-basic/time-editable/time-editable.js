Template.shiftBasicTimeEditable.onCreated(function () {
    var self = this;

    self.isEditMode = new ReactiveVar(false);

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

        //self.setDefaultValueInTimePicker(self.startTimePicker, 'startTime');
        //self.setDefaultValueInTimePicker(self.endTimePicker, 'endTime');
    };
});

Template.shiftBasicTimeEditable.onRendered(function () {
    var self = this;

    self.$('.start-time').combodate({
        format: "HH:mm A",
        template: "HH : mm A",
        minuteStep: 10
    });

    self.$('.end-time').combodate({
        format: "HH:mm",
        template: "HH : mm A",
        minuteStep: 10
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
        return !Template.instance().isEditMode.get() ? 'hide' : ''
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

        tmpl.editShiftTime(startDate, endDate);
    },
    'click .cancel-button': function (e, tmpl) {
        tmpl.exitFromEditMode();
    }
});



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


















//Template.shiftBasicTimeEditable.onCreated(function () {

    //self.setDefaultValueInTimePicker = function (timepicker, originProperty) {
    //    timepicker.date(self.data.shift[originProperty]);
    //};

    //self.getUnavailableTimeIntervalsForCurrentShift = function () {
    //    var assignedUserId = self.data.shift.assignedTo;
    //    if (!assignedUserId) {
    //        return [];
    //    }
    //
    //    var unavailabilitiesForCurrentShift = self.getUnavailabilitiesForCurrentShiftAndAssignedUser(assignedUserId);
    //
    //    return self.getUnavailableIntervals(unavailabilitiesForCurrentShift);
    //};
    //
    //self.getUnavailabilitiesForCurrentShiftAndAssignedUser = function (assignedUserId) {
    //    var unavailabilitiesForCurrentShift = [];
    //
    //    var allUnavailabilitiesForAssignedUser = Meteor.users.findOne({_id: assignedUserId}).unavailabilities || [];
    //    allUnavailabilitiesForAssignedUser.forEach(function (unavailabilityItem) {
    //        if (self.checkIsUnavailabilityForCurrentShift(unavailabilityItem)) {
    //            unavailabilitiesForCurrentShift.push(unavailabilityItem);
    //        }
    //    });
    //
    //    return unavailabilitiesForCurrentShift;
    //};
    //
    //self.checkIsUnavailabilityForCurrentShift = function (unavailability) {
    //    var shiftStartOfDayDate = moment(self.data.shift.startTime).startOf('day').toDate();
    //    var shiftEndOfDayDate = moment(shiftStartOfDayDate).endOf('day').toDate();
    //
    //    return unavailability.repeat != 'never' && self.checkRepeatUnavailability(unavailability)
    //        || unavailability.startDate >= shiftStartOfDayDate && unavailability.endDate <= shiftEndOfDayDate;
    //};
    //
    //self.checkRepeatUnavailability = function (unavailability) {
    //    var unavailabilityMoment = moment(unavailability.startDate).startOf('day');
    //    var shiftMoment = moment(self.data.shift.startTime).startOf('day');
    //
    //    // check day of week repeat
    //    if (unavailability.repeat == 'weekly' && unavailabilityMoment.day() == shiftMoment.day()) {
    //        return true;
    //    }
    //
    //    if (unavailability.repeat == 'monthly') {
    //        // check day of month repeat
    //        var diffBetweenMoments = shiftMoment.diff(unavailabilityMoment, 'month');
    //        unavailabilityMoment.add(diffBetweenMoments, 'month');
    //
    //        if (unavailabilityMoment.date() == shiftMoment.date()
    //            && unavailabilityMoment.month() == shiftMoment.month()) {
    //            return true;
    //        }
    //    }
    //    return false;
    //};
    //
    //self.getUnavailableIntervals = function (unavailabilities) {
    //
    //    var isAllDayUnavailability = !!_.find(unavailabilities, function (unavailabilityItem) {
    //        return unavailabilityItem.isAllDay;
    //    });
    //
    //    if (isAllDayUnavailability) {
    //        return self.getUnavailabilityIntervalForAllDay();
    //    } else {
    //        return self.partTimeUnavailabilityIntervals(unavailabilities);
    //    }
    //};
    //
    //self.getAvailableIntervals = function (unavailabileTimeIntervals) {
    //    var shiftStartOfDay = moment(self.data.shift.startTime).startOf('day');
    //    var shiftEndOfDay = moment(shiftStartOfDay).endOf('day');
    //    var availableTimeIntervals = [];
    //
    //    for (var i = -1; i < unavailabileTimeIntervals.length; i++) {
    //        var interval = {};
    //        // for first unavailable interval
    //        if (i == -1) {
    //            interval.minTime = shiftStartOfDay;
    //            interval.maxTime = unavailabileTimeIntervals[i + 1][0];
    //        }
    //        // for last unavailable interval
    //        else if (i == unavailabileTimeIntervals.length - 1) {
    //            interval.minTime = unavailabileTimeIntervals[i][1];
    //            interval.maxTime = shiftEndOfDay;
    //        }
    //        else if (i > -1) {
    //            interval.minTime = unavailabileTimeIntervals[i][1];
    //            interval.maxTime = unavailabileTimeIntervals[i + 1][0];
    //        }
    //        availableTimeIntervals.push(interval);
    //    }
    //    return availableTimeIntervals;
    //};
    //
    //self.sortUnavailabilities = function (unavailabilities) {
    //    unavailabilities.sort(function (a, b) {
    //        if (a.startDate == b.startDate) {
    //            return 0;
    //        }
    //        return a.startDate > b.startDate ? 1 : -1;
    //    });
    //};
    //
    //self.getUnavailabilityIntervalForAllDay = function () {
    //    var shiftUnavailabilityStartMoment = moment().startOf('day');
    //    var shiftUnavailabilityEndMoment = moment().endOf('day');
    //    return [[
    //        shiftUnavailabilityStartMoment,
    //        shiftUnavailabilityEndMoment
    //    ]];
    //};
    //
    //self.partTimeUnavailabilityIntervals = function (unavailabilities) {
    //    self.sortUnavailabilities(unavailabilities);
    //    var intervals = [];
    //
    //    unavailabilities.forEach(function (unavailabilityItem) {
    //        var intervalStartTime = self.getIntervalFromUnavailabilityItem(unavailabilityItem.startDate);
    //        var intervalEndTime = self.getIntervalFromUnavailabilityItem(unavailabilityItem.endDate);
    //        var interval = [
    //            moment(intervalStartTime),
    //            moment(intervalEndTime)
    //        ];
    //        intervals.push(interval);
    //    });
    //    return intervals;
    //};
    //
    //self.getIntervalFromUnavailabilityItem = function (date) {
    //    var shiftMoment = moment().startOf('day');
    //    return moment(date).date(shiftMoment.date())
    //        .month(shiftMoment.month()).year(shiftMoment.year()).toDate();
    //};
//});

//Template.shiftBasicTimeEditable.onRendered(function () {
    //var unavailabileTimeIntervals = self.getUnavailableTimeIntervalsForCurrentShift();
    //
    //if (unavailabileTimeIntervals.length > 0) {
    //    var availableTimeIntervals = self.getAvailableIntervals(unavailabileTimeIntervals);
    //    console.log('\n\n', Meteor.users.findOne({_id: self.data.shift.assignedTo}).username);
    //    console.log('shift date:\n', self.data.shift.startTime, self.data.shift.endTime);
    //    console.log('unavailabileTimeIntervals:\n', unavailabileTimeIntervals);
    //    console.log('availableTimeIntervals:\n', availableTimeIntervals);
    //}
    //
    //var DATE_TIME_PICKER_FORMAT = 'HH:mm';
    //var DATE_TIME_PICKER_STEP = 10;
    //
    //self.$('.start-time').datetimepicker({
    //    format: DATE_TIME_PICKER_FORMAT,
    //    dayViewHeaderFormat: DATE_TIME_PICKER_FORMAT,
    //    stepping: DATE_TIME_PICKER_STEP,
    //    disabledTimeIntervals: unavailabileTimeIntervals
    //});
    //self.$('.end-time').datetimepicker({
    //    format: DATE_TIME_PICKER_FORMAT,
    //    dayViewHeaderFormat: DATE_TIME_PICKER_FORMAT,
    //    stepping: DATE_TIME_PICKER_STEP,
    //    disabledTimeIntervals: unavailabileTimeIntervals,
    //
    //    useCurrent: false //Important! See issue #1075
    //});
    //
    //self.startTimePicker = self.$('.start-time').data("DateTimePicker");
    //self.endTimePicker = self.$('.end-time').data("DateTimePicker");
    //
    //// because, defaultDate does't works
    //self.setDefaultValueInTimePicker(self.startTimePicker, 'startTime');
    //self.setDefaultValueInTimePicker(self.endTimePicker, 'endTime');
    //
    //var MINIMUM_SHIFT_DURATION = 30;
    //self.$(".start-time").on("dp.change", function (e) {
    //    if (self.endTimePicker.date() < e.date) {
    //        self.endTimePicker.date(e.date.add(MINIMUM_SHIFT_DURATION, 'minutes'));
    //    }
    //});
    //
    //self.$(".end-time").on("dp.change", function (e) {
    //    if (self.startTimePicker.date() > e.date) {
    //        self.startTimePicker.date(e.date.subtract(MINIMUM_SHIFT_DURATION, 'minutes'));
    //    }
    //});
//})