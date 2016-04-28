Template.locationSettings.onCreated(function () {
  this.isTemplateRendered = new ReactiveVar(false);
  this.detailsSubsHandle = this.subscribe('locationDetails', this.data.locationId);

  this.closeFlyoutByEvent = function (event) {
    var flyout = FlyoutManager.getInstanceByElement(event.target);
    flyout.close();
  };

  this.location = function () {
    return Locations.findOne({_id: this.data.locationId});
  };
});

Template.locationSettings.onRendered(function () {
  //compensate flyout animation while rendering location details form
  // animation duration .5s
  Meteor.setTimeout(() => this.isTemplateRendered.set(true), 500);
});

Template.locationSettings.helpers({
  isLocationDetailsLoaded: function () {
    const tmpl = Template.instance();
    return tmpl.isTemplateRendered.get() && tmpl.detailsSubsHandle.ready();
  },

  location: function () {
    return Template.instance().location();
  },

  checkOrganizationOwner: function (location) {
    let permissionChecker = new HospoHero.security.PermissionChecker();
    return permissionChecker.isOrganizationOwner(location.organizationId);
  },

  onLocationSubmit: function () {
    const self = Template.instance();
    return function (newLocationDoc, event) {
      Meteor.call('editLocation', newLocationDoc, HospoHero.handleMethodResult(function () {
        self.closeFlyoutByEvent(event);
      }));
    };
  },

  onCancel: function () {
    const self = Template.instance();
    return function (event) {
      self.closeFlyoutByEvent(event);
    };
  }
});


Template.locationSettings.events({
  'click .delete-location': function (event, tmpl) {
    event.preventDefault();

    var locationId = tmpl.data.locationId;
    var nameOfLocation = Template.instance().location().name;
    sweetAlert({
      title: 'Are you absolutely sure?',
      text: 'Please type in the name of the location to confirm.',
      type: 'input',
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonText: 'Delete Location',
      confirmButtonColor: '#ec4758',
      animation: 'slide-from-top',
      inputPlaceholder: 'Name of location'
    }, function (inputValue) {
      if (inputValue === '') {
        sweetAlert.showInputError('You need to write name of location!');
        return false;
      }
      if (inputValue !== nameOfLocation) {
        sweetAlert.showInputError("It isn't name of current location!");
        return false;
      }
      Meteor.call('deleteLocation', locationId, HospoHero.handleMethodResult(function () {
        tmpl.closeFlyoutByEvent(event);
        sweetAlert('Ok!', nameOfLocation + ' was deleted!', 'success');
      }));
    });
  },

  'click .create-area-flyout': function (event, tmpl) {
    var location = tmpl.location();
    if (location) {
      FlyoutManager.open('wrapperFlyout', {
        template: 'createArea',
        title: "Add Area",
        data: {
          organizationId: location.organizationId,
          locationId: location._id
        }
      });
    }
  }
});