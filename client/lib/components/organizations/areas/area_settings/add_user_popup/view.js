Template.addUserPopup.events({
  'keyup input[name="addUserName"]': function(e) {
    var searchText = $(e.target).val();
    FlowComponents.callAction('onSearchTextChange', searchText);
  },

  'click .search-user-info-content': function() {
    FlowComponents.callAction('onUserSelect', this._id);
  },

  'click .back-to-select-user': function() {
    FlowComponents.callAction('onUserSelect', null);
    FlowComponents.callAction('clearSearchText');
  },

  'submit form': function (e, tpl) {
    e.preventDefault();
    var email = $('[name="addUserName"]').val();
    var name = $('[name="newUserName"]').val();

    if (!name.trim() || name.length < 3) {
      tpl.$('.input-group').addClass('has-error');
      tpl.$('input[name="newUserName"]').val('').focus();
    } else {
      tpl.$('.input-group').removeClass('has-error');
      FlowComponents.callAction('inviteNewUser', email, name);
    }
  }
});