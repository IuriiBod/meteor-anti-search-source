Template.areaUserEntry.onRendered(function () {
  this.$('[data-toggle="tooltip"]').tooltip();
});

Template.areaUserEntry.events({
  'click .user-profile-image-container': function (event, tmpl) {
    event.preventDefault();

    var user = tmpl.data;
    var target = $(event.currentTarget);

    Modal.show('userPopup', {
      target: {
        width: target.width(),
        height: target.height(),
        left: Math.round(target.offset().left),
        top: Math.round(target.offset().top)
      },
      userId: user._id,
      areaId: Template.parentData(1).areaId
    });
  }
});