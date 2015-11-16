Template.viewLeaveRequest.onRendered(function () {

    // Define a dateTimePickers
    self.$('#startDatePicker').datetimepicker({
        format: 'YYYY MMM Do',
        minDate: moment(),
        defaultDate: moment()
    });
    self.$('#endDatePicker').datetimepicker({
        format: 'YYYY MMM Do',
        minDate: moment().add(1, 'day'),
        defaultDate: moment().add(1, 'day')
    });

    // Events for dateTimePicker
    self.$("#startDatePicker").on("dp.change", function (e) {
        var endDatePicker = self.$('#endDatePicker').data("DateTimePicker");
        endDatePicker.minDate(e.date.add(1, 'day'));

        if (endDatePicker.minDate() > endDatePicker.date()) {
            endDatePicker.date(endDatePicker.minDate());
        }
    });
});

Template.viewLeaveRequest.events({
    'submit .form-horizontal': function (e, tmpl) {
        e.preventDefault();

        var values = getValues(tmpl);
        FlowComponents.callAction('saveLeaveRequest', values);
    },
    'click #cancelBtn': function () {
        Router.go('userUnavailability');
    },
    'click #approveBtn': function () {
        FlowComponents.callAction('approveLeaveRequest');
    },
    'click #declineBtn': function () {
        FlowComponents.callAction('declineLeaveRequest');
    }
});

var getValues = function (tmpl) {
    var startDate = tmpl.$('#startDatePicker').data('DateTimePicker').date();
    var endDate = tmpl.$('#endDatePicker').data('DateTimePicker').date();
    var notifyManagerId = tmpl.$('#notifyManagerSelect').val() || '';
    var comment = tmpl.$('#commentInputText').val() || '';

    return {
        startDate: startDate,
        endDate: endDate,
        notifyManagerId: notifyManagerId,
        comment: comment
    }
};