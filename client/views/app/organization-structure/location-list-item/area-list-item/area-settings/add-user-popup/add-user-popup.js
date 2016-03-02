Template.addUserPopup.onCreated(function () {
  this.selectedUser = new ReactiveVar(null);
});

Template.addUserPopup.onRendered(function () {
  this.$('input[name="addUserName"]').focus();
});

Template.addUserPopup.helpers({
  onPermissionSelect: function () {
    var self = Template.instance();
    return function (selectedUserId) {
      self.selectedUser.set(selectedUserId);
    }
  },
  selectedUser: function () {
    return Template.instance().selectedUser.get();
  }
});

Template.addUserPopup.events({
  'click .search-user-info-content': function (event, tmpl) {
    tmpl.selectedUser.set(this._id);
  },

  'click .back-to-select-user': function (event, tmpl) {
    tmpl.$('input[name="addUserName"]').focus();
    tmpl.selectedUser(null);
  }
});
