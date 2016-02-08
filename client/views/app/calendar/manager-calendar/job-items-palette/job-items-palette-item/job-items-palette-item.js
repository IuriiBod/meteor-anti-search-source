Template.jobItemsPaletteItem.onCreated(function () {
  // number of seconds need to prepare current job item
  this.activeTime = moment.duration(this.data.activeTime, 'seconds');
});


Template.jobItemsPaletteItem.onRendered(function () {
  var data = this.data;
  var $dragItem = this.$('#draggable-job-item-' + data._id);
  var event = {
    id: data._id,
    title: data.name,
    type: 'prep job',
    stick: true,
    duration: this.activeTime
  };

  _.extend(event, HospoHero.calendar.getEventByType('prep job').eventSettings);

  $dragItem.data('event', event);

  $dragItem.draggable({
    zIndex: 999,
    revert: true,
    revertDuration: 0
  });
});


Template.jobItemsPaletteItem.helpers({
  time: function () {
    return Template.instance().activeTime.humanize();
  }
});