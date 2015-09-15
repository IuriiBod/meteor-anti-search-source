var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['username'];
UsersSearch = new SearchSource('usersSearch', fields, options);

Template.addUserPopup.helpers({
  'searchUsers': function() {
    var data = UsersSearch.getData({
      sort: {'name': 1}
    });
    if(data.length == 0) {
      $('.no-results').removeClass('hide');
      $('.search-result').addClass('hide');
    } else {
      $('.no-results').addClass('hide');
      $('.search-result').removeClass('hide');
    }
    return data;
  },

  'userPermissions': function() {
    return [
      {
        name: 'createEditMenu',
        title: 'Create/edit menu',
        description: 'Can create and edit menus'
      },
      {
        name: 'createEditJobs',
        title: 'Create/edit jobs',
        description: 'Can create and edit jobs'
      },
      {
        name: 'createEditStocks',
        title: 'Create/edit stocks',
        description: 'Can create and edit stocks'
      }
    ];
  }
});

Template.addUserPopup.events({
  'keyup input[name="addUserName"]': _.throttle(function(e, tpl) {
    $('.add-user-by-email-success').addClass('hide');
    var searchVal = $(e.target).val();
    if(searchVal.length == 0) {
      tpl.$('.input-group').addClass('hide');
      tpl.$('.add-user-info').removeClass('hide');
      tpl.$('.no-results').addClass('hide');
      tpl.$('.search-result').addClass('hide');
    } else {
      tpl.$('.add-user-info').addClass('hide');

      if(searchVal.length < 3) {
        tpl.$('.no-results').removeClass('hide');
        tpl.$('.search-result').addClass('hide');
        tpl.$('.input-group').addClass('hide');
      } else {
        if(searchVal.indexOf('@') != -1) {
          tpl.$('.input-group').removeClass('hide');
          tpl.$('.no-results').addClass('hide');
          tpl.$('.search-result').addClass('hide');
        } else {
          tpl.$('.input-group').addClass('hide');
          var options = {};
          options.isActive = true;
          options.areaId = Session.get('areaId');
          UsersSearch.cleanHistory();
          UsersSearch.search(searchVal, options);
        }
      }
    }
  }, 200),

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