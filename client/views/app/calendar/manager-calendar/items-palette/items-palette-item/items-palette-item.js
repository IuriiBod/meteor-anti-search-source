Template.itemsPaletteItem.onCreated(function () {
  var durationObject = this.data.eventItem.duration;

  var defaultDuration = "01:00";
  var duration = this.data.item[durationObject.field];

  // duration that needs to make current item
  this.duration = duration > 0 ? moment.duration(duration, durationObject.timeUnits) : moment.duration(defaultDuration);
});


Template.itemsPaletteItem.onRendered(function () {
  var item = this.data.item;
  var eventItemSettings = this.data.eventItem.eventSettings;

  var $dragItem = this.$('#draggable-item-' + item._id);
  var event = {
    id: item._id,
    title: item[eventItemSettings.titleField],
    type: this.data.type,
    stick: true,
    duration: this.duration
  };

  _.extend(event, eventItemSettings);

  $dragItem.data('event', event);

  $dragItem.draggable({
    zIndex: 999,
    revert: true,
    revertDuration: 0
  });

  $dragItem.css({
    'background-color': eventItemSettings.backgroundColor,
    'border-color': eventItemSettings.borderColor
  });
});

Template.itemsPaletteItem.helpers({
  time: function () {
    return Template.instance().duration.humanize();
  },

  name: function () {
    return this.item[this.eventItem.eventSettings.titleField];
  }
});