Template.addNewUnavailability.onRendered(function () {
    var self = this;

    // Define a dateTimePickers
    var now = moment().minute(0);
    self.$('#datePicker').datetimepicker({
        format: 'YYYY MMM Do',
        minDate: now,
        defaultDate: now
    });
    self.$('#startTimePicker').datetimepicker({
        format: 'hh:mm',
        stepping: 5,
        defaultDate: now
    });
    self.$('#endTimePicker').datetimepicker({
        format: 'hh:mm',
        stepping: 5,
        defaultDate: now.add(1, 'hours')
    });

    // Events for dateTimePickers
    self.$("#datePicker").on("dp.change", function (e) {
        var newDate = e.date || moment();

        var startTimePicker = self.$('#startTimePicker').data("DateTimePicker");
        setDateForTimePickers(startTimePicker, newDate);

        var endTimePicker = self.$('#endTimePicker').data("DateTimePicker");
        setDateForTimePickers(endTimePicker, newDate);
    });
    self.$("#startTimePicker").on("dp.change", function (e) {
        self.$('#endTimePicker').data("DateTimePicker").minDate(e.date);
    });
    self.$("#endTimePicker").on("dp.change", function (e) {
        self.$('#startTimePicker').data("DateTimePicker").maxDate(e.date);
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

var setDateForTimePickers = function (timePicker, newDate) {
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