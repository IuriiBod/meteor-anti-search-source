Template.addNewUnavailability.onRendered(function () {
    var self = this;

    // Define a dateTimePickers
    self.$('#datePicker').datetimepicker({
        format: 'YYYY MMM Do',
        minDate: moment(),
        defaultDate: moment()
    });
    self.$('#startTimePicker').datetimepicker({
        format: 'HH:mm',
        stepping: 10,
        minDate: moment(),
        defaultDate: moment().add(10, 'minutes')
    });
    self.$('#endTimePicker').datetimepicker({
        format: 'HH:mm',
        stepping: 10,
        minDate: moment().add(10, 'minutes'),
        defaultDate: moment().add(1, 'hours')
    });

    var startTimePicker = self.$('#startTimePicker').data("DateTimePicker");
    var endTimePicker = self.$('#endTimePicker').data("DateTimePicker");

    // Events for dateTimePickers
    self.$("#datePicker").on("dp.change", function (e) {
        var newDate = e.date || moment();

        setDateForTimePicker(startTimePicker, newDate);
        setDateForTimePicker(endTimePicker, newDate);
    });
    self.$("#startTimePicker").on("dp.change", function (e) {
        endTimePicker.minDate(e.date.add(10, 'minutes'));

        if (endTimePicker.minDate() > endTimePicker.date()) {
            endTimePicker.date(endTimePicker.minDate());
        }
    });
});

Template.addNewUnavailability.events({
    'submit .form-horizontal': function (e, tmpl) {
        e.preventDefault();

        var values = getValues(tmpl);
        FlowComponents.callAction('addUnavailability', values);
    },
    'click #cancelBtn': function () {
        Router.go('userUnavailability');
    },
    'change #allDayCheckbox': function (e) {
        var value = $(e.currentTarget).prop('checked');
        FlowComponents.callAction('isAllDayChange', value);
    }
});

var setDateForTimePicker = function (timePicker, newDate) {
    var time = timePicker.date() || moment();
    time.date(newDate.date()).month(newDate.month()).year(newDate.year());
    timePicker.date(time);
};

var getValues = function (tmpl) {
    var date = tmpl.$('#datePicker').data('DateTimePicker').date();
    var startTime = tmpl.$('#startTimePicker').data('DateTimePicker').date();
    var endTime = tmpl.$('#endTimePicker').data('DateTimePicker').date();
    var repeat = tmpl.$('#repeatSelect').val();
    var comment = tmpl.$('#commentInputText').val();

    return {
        date: date,
        startTime: startTime,
        endTime: endTime,
        repeat: repeat,
        comment: comment
    }
};