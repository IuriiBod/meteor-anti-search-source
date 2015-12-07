var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name'];

JobItemsSearch = new SearchSource('jobItemsSearch', fields, options);

var newSearchParams = function (dataHistory) {
  var count = dataHistory.length;
  var lastItem = dataHistory[count - 1]['name'];
  var selector = {"type": Session.get("type"), "limit": count + 10, "endingAt": lastItem};
  var archive = Router.current().params.type;
  if(archive && archive == 'archive') {
    selector.status = 'archived';
  } else {
    selector.status = {$ne: 'archived'};
  }

  return selector;
};

Template.jobItemsList.helpers({
  getJobItems: function() {
    return JobItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  },

  isLoading: function() {
    return JobItemsSearch.getStatus().loading;
  }
});

Template.jobItemsList.events({
  'keyup #searchJobItemsBox': _.throttle(function(e) {
    var selector = {
      "type": Session.get("type"),
      limit: 30
    };
    if(Router.current().params.type) {
      selector.status = 'archived';
    } else {
      selector.status = {$ne: 'archived'};
    }

    var text = $(e.target).val().trim();
    JobItemsSearch.search(text, selector);
  }, 200),

  'click #loadMoreJobItems': _.throttle(function(e) {
    e.preventDefault();
    var text = $("#searchJobItemsBox").val().trim();
    var params = _.keys(JobItemsSearch.history);
    if(JobItemsSearch.history && JobItemsSearch.history[params]) {
      var dataHistory = JobItemsSearch.history[params].data;
      if(dataHistory.length >= 9) {
        JobItemsSearch.cleanHistory();
        var selector = newSearchParams(dataHistory);
        JobItemsSearch.search(text, selector);
      }
    }
  }, 200)
});

Template.jobItemsList.onRendered(function() {
  var prepType = JobTypes.findOne({ name: 'Prep' });
  Session.set('type', prepType._id);

  var tpl = this;
  Meteor.defer(function() {
    $('#wrapper').scroll(function(e){
      var docHeight = $(document).height();
      var winHeight = $(window).height();
      var scrollTop = $(window).scrollTop();

      if ((docHeight - winHeight) == scrollTop) {
        tpl.$('#loadMoreJobItems').click();
      }
    });
  });

  JobItemsSearch.cleanHistory();
  var selector = {
    "type": Session.get("type"),
    limit: 30
  };
  var archive = Router.current().params.type;
  if(archive && archive == 'archive') {
    selector.status = 'archived';
  } else {
    selector.status = {$ne: 'archived'};
  }
  JobItemsSearch.search("", selector);
});