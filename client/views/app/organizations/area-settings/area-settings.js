Template.areaSettings.onCreated(function () {
  this.set('addUser', false);

  this.area = function () {
    return Areas.findOne({_id: this.data.areaId});
  }
});

Template.areaSettings.onRendered(function () {
  var self = this;
  $('.area-name').editable({
    type: "text",
    title: 'Edit area name',
    display: false,
    showbuttons: true,
    mode: 'inline',
    success: function (response, newValue) {
      var area = self.area();
      area.name = newValue;
      Meteor.call('editArea', area, HospoHero.handleMethodResult());
    }
  });
});

Template.areaSettings.helpers({
  area: function () {
    return Template.instance().area();
  },
  areaUsers: function () {
    var area = Template.instance().area();
    if (area) {
      return Meteor.users.find({
        $or: [
          {'relations.areaIds': this.areaId},
          {
            'relations.organizationId': area.organizationId,
            'relations.locationIds': null,
            'relations.areaIds': null
          }
        ]
      }, {
        sort: {
          username: 1
        }
      });
    }
  },
  areaColor: function () {
    var area = Template.instance().area();
    return area && area.color;
  },
  onColorChange: function () {
    var area = Template.instance().area();
    return function (color) {
      if (area) {
        area.color = color;
        Meteor.call('editArea', area, HospoHero.handleMethodResult());
      }
    }
  }
});

Template.areaSettings.events({
  'click .delete-area': function (event, tmpl) {
    if (confirm("Are you sure, you want to delete this area?")) {
      var id = tmpl.data.areaId;
      Meteor.call('deleteArea', id, HospoHero.handleMethodResult(function () {
        var flyout = FlyoutManager.getInstanceByElement(event.target);
        flyout.close();
      }));
    }
  },

  'click .add-user': function (event, tmpl) {
    tmpl.set('addUser', !tmpl.get('addUser'));
  },

  'mouseenter .user-profile-image-container': function (e) {
    $(e.target).find('.remove-user-from-area').css('opacity', 1);
  },

  'mouseleave .user-profile-image-container': function (e) {
    $(e.target).find('.remove-user-from-area').css('opacity', 0);
  },

  'click .remove-user-from-area': function (event, tmpl) {
    var userId = this._id;
    Meteor.call('removeUserFromArea', userId, tmpl.data.areaId, HospoHero.handleMethodResult());
  }
});