Template.comboTimeEditable.onCreated(function () {
    var self = this;

    self.isEditMode = new ReactiveVar(false);

    self.submitTime = function () {
        var firstTime = self.getTimeFromCombodate('.first-time');
        var secondTime = self.isTimeRangeMode() ? self.getTimeFromCombodate('.second-time') : null;
        if (secondTime && self.checkFirstSecondDate(firstTime, secondTime)) {
            self.data.params.onSubmit(firstTime, secondTime);
            self.exitFromEditMode();
        }
    };

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

    self.checkFirstSecondDate = function (firstTime, secondTime) {
        if (secondTime < firstTime) {
            HospoHero.error('Start time should be less than end time!');
            return false;
        }
        return true;
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

        tmpl.submitTime();
    },
    'click .cancel-button': function (e, tmpl) {
        tmpl.exitFromEditMode();
    }
});