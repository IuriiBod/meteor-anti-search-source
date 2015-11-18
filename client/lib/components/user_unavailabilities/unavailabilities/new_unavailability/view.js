Template.addNewUnavailability.onCreated(function () {
    this.getValuesFromTemplate = function () {
        var date = this.$('.date-picker').data('DateTimePicker').date();
        var startTime = this.$('.start-time-picker').data('DateTimePicker').date();
        var endTime = this.$('.end-time-picker').data('DateTimePicker').date();
        var repeat = this.$('.repeat-select').val();
        var comment = this.$('.comment-input').val();

        return {
            date: date,
            startTime: startTime,
            endTime: endTime,
            repeat: repeat,
            comment: comment
        };
    };
});

Template.addNewUnavailability.onRendered(function () {
    var self = this;

    // Define a dateTimePickers
    self.$('.date-picker').datetimepicker({
        format: 'YYYY MMM Do',
        minDate: moment(),
        defaultDate: moment()
    });
    self.$('.start-time-picker').datetimepicker({
        format: 'HH:mm',
        stepping: 10,
        defaultDate: moment()
    });
    self.$('.end-time-picker').datetimepicker({
        format: 'HH:mm',
        stepping: 10,
        defaultDate: moment().add(1, 'hours'),
        minDate: moment().add(10, 'minutes')
    });

    self.$('.start-time-picker').on("dp.change", function (e) {
        var endTimePicker = self.$('.end-time-picker').data("DateTimePicker");

        endTimePicker.minDate(e.date.add(10, 'minutes'));

        if (endTimePicker.minDate() > endTimePicker.date()) {
            endTimePicker.date(endTimePicker.minDate());
        };
    });
});

Template.addNewUnavailability.events({
    'submit .unavailability-form': function (e, tmpl) {
        e.preventDefault();

        var values = tmpl.getValuesFromTemplate();
        FlowComponents.callAction('addUnavailability', values);
    },
    'click .cancel-button': function () {
        Router.go('userUnavailability');
    },
    'change .all-day-checkbox': function (e) {
        var value = $(e.currentTarget).prop('checked');
        FlowComponents.callAction('isAllDayChange', value);
    }
});