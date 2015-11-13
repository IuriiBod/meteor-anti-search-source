Template.areaSettings.events({
  'click .delete-area': function(e) {
    if(confirm("Are you sure, you want to delete this area?")) {
      var id = e.target.dataset.id;
      FlowComponents.callAction('deleteArea', id);
      var flyout = FlyoutManager.getInstanceByElement(e.target);
      flyout.close();
    }
  },

  'click .add-user': function() {
    FlowComponents.callAction('toggleAddUser');
  },

  'mouseenter .user-profile-image-container': function(e) {
    $(e.target).find('.remove-user-from-area').css('opacity', 1);
  },

  'mouseleave .user-profile-image-container': function(e) {
    $(e.target).find('.remove-user-from-area').css('opacity', 0);
  },

  'click .remove-user-from-area': function(e) {
    var userId = this._id;
    FlowComponents.callAction('removeUserFromArea', userId);
  }
});

Template.areaSettings.onRendered(function() {
  $('.area-name').editable({
    type: "text",
    title: 'Edit area name',
    showbuttons: true,
    mode: 'inline',
    success: function(response, newValue) {
      var id = this.dataset.id;
      if(id) {
        var area = Areas.findOne({ _id: id });
        area.name = newValue;

        Meteor.call('editArea', area, HospoHero.handleMethodResult());
      }
    }
  });
});