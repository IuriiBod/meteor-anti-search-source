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
    }
});

Template.shiftBasicTimeEditable.onRendered(function () {
    var self = this;

    var DATE_TIME_PICKER_FORMAT = 'HH:mm';
    var DATE_TIME_PICKER_STEP = 10;

    self.$('.start-time').datetimepicker({
        format: DATE_TIME_PICKER_FORMAT,
        dayViewHeaderFormat: DATE_TIME_PICKER_FORMAT,
        stepping: DATE_TIME_PICKER_STEP,
        defaultDate: self.data.shift.startTime
    });
    self.$('.end-time').datetimepicker({
        format: DATE_TIME_PICKER_FORMAT,
        dayViewHeaderFormat: DATE_TIME_PICKER_FORMAT,
        stepping: DATE_TIME_PICKER_STEP,
        defaultDate: self.data.shift.endTime,

        useCurrent: false //Important! See issue #1075
    });

    self.startTimePicker = self.$('.start-time').data("DateTimePicker");
    self.endTimePicker = self.$('.end-time').data("DateTimePicker");

    var MINIMUM_SHIFT_DURATION = 30;
    self.$(".start-time").on("dp.change", function (e) {
        var newMinDate = e.date.add(MINIMUM_SHIFT_DURATION, 'minutes');
        self.endTimePicker.minDate(newMinDate);

        if (self.endTimePicker.date() < self.endTimePicker.minDate()) {
            self.endTimePicker.date(newMinDate);
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