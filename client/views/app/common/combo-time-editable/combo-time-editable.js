Template.comboTimeEditable.onCreated(function () {
  var self = this;

  self.isEditMode = new ReactiveVar(false);

  self.exitFromEditMode = function () {
    self.isEditMode.set(false);
  };

  self.isTimeRangeMode = function () {
    return !!self.data.params.secondTime;
  };

  let checkTimeRange = function (firstTime, secondTime) {
    return moment(secondTime).isAfter(firstTime);
  };

  self.submitTime = function () {
    var firstTime = self.getTimeFromCombodate('.first-time', 'firstTime');
    var secondTime = self.isTimeRangeMode() ? self.getTimeFromCombodate('.second-time', 'secondTime') : null;

    if (secondTime && !self.data.params.ignoreDateRangeCheck) {
      let isRangeValid = checkTimeRange(firstTime, secondTime);
      if (!isRangeValid) {
        HospoHero.error('Start time should be less than end time!');
        return;
      }
    }

    if (firstTime) {
      self.data.params.onSubmit(firstTime, secondTime);
      self.exitFromEditMode();
    }
  };

  self.getTimeFromCombodate = function (selector, option) {
    var $combodate = self.$(selector);

    var hours = $combodate.find('.hours').val();
    var minutes = $combodate.find('.minutes').val();
    var ampm = $combodate.find('.ampm').val();

    return new Date(moment(self.data.params[option]).format('YYYY.MM.DD ') + hours + ':' + minutes + ' ' + ampm);
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
  },
  firstTime: function () {
    var firstTime = Template.instance().data.params.firstTime;
    return HospoHero.dateUtils.timeFormat(firstTime);
  },
  secondTime: function () {
    var secondTime = Template.instance().data.params.secondTime;
    return HospoHero.dateUtils.timeFormat(secondTime);
  },
  icon: function () {
    return this.params.icon || 'fa-clock-o';
  }
});

Template.comboTimeEditable.events({
  'click .time': function (e, tmpl) {
    tmpl.isEditMode.set(true);
  },
  'click .change-time-button': function (e, tmpl) {
    e.preventDefault();

    tmpl.submitTime();
  },
  'click .cancel-button': function (e, tmpl) {
    tmpl.exitFromEditMode();
  }
});