Template.userPopup.onCreated(function() {
  this.subscribe('profileUser', Template.currentData().userId);
});

Template.userPopup.onRendered(function() {
  var target = Template.currentData().target;
  var popup = this.find('.user-popup');
  var modal = this.find('.modal-dialog');
  var modalPosition = {
    top: target.top + target.height,
    left: target.left
  };
  $(modal).offset(modalPosition);

  var getModalSize = function() {
    var modalRect = modal.getBoundingClientRect();
    if (modalRect.width !== 0 && modalRect.height !== 0) {
      return {
        width: modalRect.width,
        height: modalRect.height
      }
    }
    return null;
  };

  var fitModalToWindow = function(modalSize, modalPosition) {
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var newModalPosition = modalPosition;
    if (modalPosition.left + modalSize.width > windowWidth) {
      newModalPosition.left = windowWidth - modalSize.width;
    }
    if (modalPosition.top + modalSize.height > windowHeight) {
      newModalPosition.top = windowHeight - modalSize.height;
    }
    $(modal).offset(newModalPosition);
  };

  var checkModalPosition = function() {
    Meteor.setTimeout(function() {
      var modalSize = getModalSize();
      if (!modalSize) {
        checkModalPosition();
      } else {
        fitModalToWindow(modalSize, modalPosition);
        $(popup).css('visibility', 'visible');
      }
    }, 200)
  };

  checkModalPosition();
});

Template.userPopup.helpers({
  userRole: function() {
    return HospoHero.roles.getUserRoleName(this.userId, this.areaId);
  },
  roles: function() {
    return Meteor.roles.find().fetch();
  }
});

Template.userPopup.events({
  'click .remove-user-from-area': function (event, tmpl) {
    var userId = tmpl.data.userId;
    var areaId = tmpl.data.areaId;
    if (confirm("Are you sure, you want to delete this user from area?")) {
      Meteor.call('removeUserFromArea', userId, areaId, HospoHero.handleMethodResult());
      Modal.hide();
    }
  },
  'click .filter-menus a': function(event, tmpl) {
    var newRoleId = this._id;
    var userId = tmpl.data.userId;
    Meteor.call('changeUserRole', userId, newRoleId, tmpl.data.areaId, HospoHero.handleMethodResult());
  }
});