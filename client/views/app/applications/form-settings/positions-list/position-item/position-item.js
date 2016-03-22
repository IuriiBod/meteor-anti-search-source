Template.positionItem.events({
  'click .remove-position': function (event, tmpl) {
    event.preventDefault();
    tmpl.data.onPositionRemove(tmpl.data.position._id);
  }
});