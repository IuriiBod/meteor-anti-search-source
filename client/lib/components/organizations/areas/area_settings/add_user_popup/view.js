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
    var email = e.target.addUserName.value;
    var name = e.target.newUserName.value;
    var areaId = Session.get('areaId');
    var sender = Meteor.user();
    var senderInfo = {
      _id: sender._id,
      name: sender.username,
      email: sender.emails[0].address
    };
    if (!name.trim() || name.length < 3) {
      tpl.$('.input-group').addClass('has-error');
      tpl.$('input[name="newUserName"]').val('').focus();
    } else {
      tpl.$('.input-group').removeClass('has-error');

      Meteor.call('createInvitation', email, name, senderInfo, areaId, function (err) {
        if (err) {
          console.log(err);
          return alert(err.reason);
        }
      });
      tpl.$('.add-user-by-email-success').removeClass('hide');
      //tpl.$('.user-permissions').addClass('show');
      tpl.$('.input-group').addClass('hide');
      tpl.$('input[name="addUserName"]').val('').addClass('hide');
      tpl.$('input[name="newUserName"]').val('');
    }
  }
});