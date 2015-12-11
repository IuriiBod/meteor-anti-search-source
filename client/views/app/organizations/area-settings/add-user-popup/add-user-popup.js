Template.addUserPopup.onCreated(function () {
  this.set('areaId', this.data.areaId);
  this.set('selectedUser', null);
});

Template.addUserPopup.onRendered(function () {
  this.$('input[name="addUserName"]').focus();
});

Template.addUserPopup.helpers({
  onPermissionSelect: function () {
    var self = Template.instance();
    return function (selectedUserId) {
      self.set('selectedUser', selectedUserId);
    }
  }
});

Template.addUserPopup.events({
  'click .search-user-info-content': function (event, tmpl) {
    tmpl.set('selectedUser', this._id);
  },

  'click .back-to-select-user': function (event, tmpl) {
    tmpl.$('input[name="addUserName"]').focus();
    tmpl.set('selectedUser', null);
  }
});
