Template.addUserPopup.onCreated(function () {
  this.set('areaId', this.data.areaId);
  this.set('selectedUser', null);
  this.set('searchText', '');
  this.set('selectPermissions', true);

  this.onUserSelect = function(userId) {
    this.set('selectedUser', userId);
    this.set('selectPermissions', true);
  };
});

Template.addUserPopup.onRendered(function () {
  this.$('input[name="addUserName"]').focus();
});

Template.addUserPopup.helpers({
  inSearchMode: function () {
    return !Template.instance().get('selectedUser');
  },
  inviteNewUser: function () {
    var text = Template.instance().get('searchText');
    return text.indexOf('@') > -1;
  },
  isSearchEmpty: function () {
    var text = Template.instance().get('searchText');
    return text.length == 0;
  }
});

Template.addUserPopup.events({
  'keyup input[name="addUserName"]': function (event, tmpl) {
    var searchText = $(event.target).val();
    tmpl.set('searchText', searchText);
  },

  'click .search-user-info-content': function (event, tmpl) {
    tmpl.onUserSelect(this._id);
  },

  'click .back-to-select-user': function (event, tmpl) {
    tmpl.onUserSelect(null);
    tmpl.set('searchText', '');
  },

  'submit form': function (event, tmpl) {
    event.preventDefault();

    var data = HospoHero.misc.getValuesFromEvent(event, ['addUserName', 'newUserName', 'userRole'], true);

    console.log('DART', data);


    //if (!name || name.trim().length < 3) {
    //  tpl.$('.input-group').addClass('has-error');
    //  tpl.$('input[name="newUserName"]').val('').focus();
    //} else {
    //  tpl.$('.input-group').removeClass('has-error');
    //  FlowComponents.callAction('inviteNewUser', email, name, role);
    //  var areaId = this.get('areaId');
    //  Meteor.call('createInvitation', email, name, areaId, roleId, HospoHero.handleMethodResult());
    //  this.set('selectedUser', '1');
    //  this.set('selectPermissions', false);
    //}
  }
});
