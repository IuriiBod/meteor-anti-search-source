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
    var firstTime = self.getTimeFromCombodate('.first-time');
    var secondTime = self.isTimeRangeMode() ? self.getTimeFromCombodate('.second-time') : null;

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

  self.getTimeFromCombodate = function (selector) {
    var $combodate = self.$(selector);

    var hours = $combodate.find('.hours').val();
    var minutes = $combodate.find('.minutes').val();
    var ampm = $combodate.find('.ampm').val();

    return new Date(moment(self.data.params.date).format('YYYY.MM.DD ') + hours + ':' + minutes + ' ' + ampm);
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
    return _.isDate(firstTime) ? HospoHero.dateUtils.timeFormat(firstTime) : firstTime;
  },
  secondTime: function () {
    var secondTime = Template.instance().data.params.secondTime;
    return _.isDate(secondTime) ? HospoHero.dateUtils.timeFormat(secondTime) : secondTime;
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