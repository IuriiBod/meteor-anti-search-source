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
    var searchVal = $(e.target).val();
    if(searchVal.length == 0) {
      tpl.$('.add-user-info').removeClass('hide');

      tpl.$('.no-results').addClass('hide');
    } else {
      tpl.$('.add-user-info').addClass('hide');

      if(searchVal.length < 3) {
        tpl.$('.no-results').removeClass('hide');
        tpl.$('.search-result').addClass('hide');
      } else {
        tpl.$('.no-results').addClass('hide');
        tpl.$('.search-result').removeClass('hide');

        var options = {};
        options.isActive = true;
        options.areaId = Session.get('areaId');
        UsersSearch.cleanHistory();
        UsersSearch.search(searchVal, options);
      }
    }
  }, 200),

  'submit form': function(e) {
    e.preventDefault();
    var email = e.target.addUserName.value;
  }
});

Template.addUserPopup.onRendered(function() {
  $('.add-user-info').show();
  $('.users-search-results').hide();
});