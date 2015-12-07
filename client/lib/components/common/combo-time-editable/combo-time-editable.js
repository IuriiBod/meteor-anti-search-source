Template.comboTimeEditable.onCreated(function () {
    var self = this;

    self.isEditMode = new ReactiveVar(false);

    self.getTimeFromCombodate = function (selector) {
        var $combodate = self.$(selector);

        var hours = $combodate.find('.hours').val();
        var minutes = $combodate.find('.minutes').val();
        var ampm = $combodate.find('.ampm').val();

        return new Date(moment().format('YYYY.MM.DD ') + hours + ':' + minutes + ' ' + ampm);
    };

    self.exitFromEditMode = function () {
        self.isEditMode.set(false);
    };

    self.isTimeRangeMode = function () {
        return !!self.data.params.secondTime;
    };
});

Template.comboTimeEditable.helpers({
    isEditMode: function () {
        return Template.instance().isEditMode.get();
    },

    defaultTime: function () {
        return Template.instance().data.params;
    },
    isTimeRangeMode: function () {
        return Template.instance().isTimeRangeMode();
    },
    minuteStepping: function () {
        return Template.instance().data.params.minuteStepping || 1;
    }
});

Template.comboTimeEditable.events({
    'click .time': function (e, tmpl) {
        tmpl.isEditMode.set(true);
    },
    'submit .time-range-selector': function (e, tmpl) {
        e.preventDefault();

        var firstTime = tmpl.getTimeFromCombodate('.first-time');
        var secondTime = tmpl.isTimeRangeMode() ? tmpl.getTimeFromCombodate('.second-time') : null;

        tmpl.data.params.onSubmit(firstTime, secondTime);
        tmpl.exitFromEditMode();
    },
    'click .cancel-button': function (e, tmpl) {
        tmpl.exitFromEditMode();
    }
});