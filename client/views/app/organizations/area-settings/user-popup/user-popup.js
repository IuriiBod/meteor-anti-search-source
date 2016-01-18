Template.userPopup.onCreated(function() {
  this.subscribe('profileUser', Template.currentData().userId);
});

Template.userPopup.onRendered(function() {
  var target = Template.currentData().target;
  var modal = this.find('.modal-dialog');
  var modalPosition = {
    top: target.top + target.height,
    left: target.left
  }
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
    modal.style.visibility = 'visible';
  };

  var checkModalPosition = function() {
    Meteor.setTimeout(function() {
      var modalSize = getModalSize();
      if (!modalSize) {
        checkModalPosition();
      } else {
        fitModalToWindow(modalSize, modalPosition);
      }
    }, 200)
  };

  checkModalPosition();
});

Template.userPopup.helpers({
  userRole: function() {
    var data = Template.currentData();
    return HospoHero.roles.getUserRoleName(data.userId, data.areaId);
  },
  roles: function() {
    return Meteor.roles.find().fetch();
  }
});