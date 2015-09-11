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
      $('.no-results').show();
      $('.search-result').hide();
    } else {
      $('.no-results').hide();
      $('.search-result').show();
    }
    return data;
  }
});

Template.addUserPopup.events({
  'keyup input[name="add-user-name"]': _.throttle(function(e) {
    var searchVal = $(e.target).val();
    if(searchVal.length == 0) {
      $('.add-user-info').show();
      $('.users-search-results').hide();
    } else if(searchVal.indexOf('@') != -1) {
      $('.add-user-info').show();
      $('.users-search-results').hide();
    } else if(searchVal.length < 3) {
      $('.add-user-info').hide();
      $('.users-search-results').show();
      $('.no-results').show();
      $('.search-result').hide();
    } else {
      var options = {};
      options.isActive = true;
      options.areaId = Session.get('areaId');
      UsersSearch.search(searchVal, options);
    }
  }, 200)
});

Template.addUserPopup.onRendered(function() {
  $('.add-user-info').show();
  $('.users-search-results').hide();
});