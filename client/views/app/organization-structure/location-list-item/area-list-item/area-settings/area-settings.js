Template.areaSettings.onCreated(function () {
  this.subscribe('areaDetailsUsers', this.data.areaId);
  this.subscribe('areaDetails', this.data.areaId);

  this.addUser = new ReactiveVar(false);

  this.area = function () {
    return Areas.findOne({_id: this.data.areaId});
  }
});

Template.areaSettings.onRendered(function () {
  var self = this;
  $('.area-name').editable({
    type: 'text',
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
            'relations.organizationIds': {$in: [area.organizationId]},
            'relations.locationIds': null,
            'relations.areaIds': null
          }
        ]
      }, {
        sort: {
          'profile.firstname': 1
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
  },

  addUser: function () {
    return Template.instance().addUser.get();
  }
});

Template.areaSettings.events({
  'click .delete-area': function (event, tmpl) {
    event.preventDefault();

    var areaId = tmpl.data.areaId;
    var nameOfArea = Template.instance().area().name;

    let onAreaDeleteSuccess = function () {
      sweetAlert(`Done! ${nameOfArea} was deleted.`, 'success');

      var flyout = FlyoutManager.getInstanceByElement(event.target);
      flyout.close();
    };

    let processSwInput = function (inputValue) {
      if (inputValue === '') {
        sweetAlert.showInputError('You need to write name of area!');
      } else if (inputValue !== nameOfArea) {
        sweetAlert.showInputError("It isn't name of current area!");
      } else {
        Meteor.call('deleteArea', areaId, HospoHero.handleMethodResult(onAreaDeleteSuccess));
      }
    };

    sweetAlert({
      title: 'Are you absolutely sure?',
      text: 'Please type in the name of the area to confirm.',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonText: 'Delete Area',
      confirmButtonColor: '#ec4758',
      animation: 'slide-from-top',
      inputPlaceholder: 'Name of area'
    }, processSwInput);
  },

  'click .add-user': function (event, tmpl) {
    tmpl.addUser.set(!tmpl.addUser.get());
  },

  'click .show-pos-settings': function () {
    event.preventDefault();
    Router.go('posSettings');
  }
});