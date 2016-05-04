Template.profilePayRates.onRendered(function () {
  this.$('#weekdaysrate').editable({
    type: 'text',
    title: 'Edit Weekday rate',
    showbuttons: true,
    mode: 'inline',
    success: function (response, newValue) {
      var self = this;
      if (newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        newRate = isNaN(newRate) ? 0 : newRate;
        var editDetail = {weekdaysrate: newRate};
        Meteor.call("editBasicDetails", id, editDetail, HospoHero.handleMethodResult());
      }
    },
    display: false
  });

  this.$('#saturdayrate').editable({
    type: 'text',
    title: 'Edit Saturday rate',
    showbuttons: true,
    mode: 'inline',
    success: function (response, newValue) {
      var self = this;
      if (newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        newRate = isNaN(newRate) ? 0 : newRate;
        var editDetail = {saturdayrate: newRate};
        Meteor.call("editBasicDetails", id, editDetail, HospoHero.handleMethodResult());
      }
    },
    display: false
  });

  this.$('#sundayrate').editable({
    type: 'text',
    title: 'Edit Sunday rate',
    showbuttons: true,
    mode: 'inline',
    success: function (response, newValue) {
      var self = this;
      if (newValue) {
        var id = $(self).attr("data-id");
        var newRate = parseFloat(newValue);
        newRate = isNaN(newRate) ? 0 : newRate;
        var editDetail = {sundayrate: newRate};
        Meteor.call("editBasicDetails", id, editDetail, HospoHero.handleMethodResult());
      }
    },
    display: false
  });
});


Template.profilePayRates.helpers({
  weekdaysPayrate () {
    return HospoHero.utils.getNestedProperty(this, 'profile.payrates.weekdays', 'Not added');
  },

  saturdayPayrate () {
    return HospoHero.utils.getNestedProperty(this, 'profile.payrates.saturday', 'Not added');
  },

  sundayPayrate () {
    return HospoHero.utils.getNestedProperty(this, 'profile.payrates.sunday', 'Not added');
  }
});