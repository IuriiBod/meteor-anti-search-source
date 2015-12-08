var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['name'];

JobItemsSearch = new SearchSource('jobItemsSearch', fields, options);

Template.jobItemsList.onCreated(function () {
  this.type = this.data.id;
  this.newSearchParams = function (dataHistory) {
    var count = dataHistory.length;
    var lastItem = dataHistory[count - 1]['name'];
    var selector = {"type": Session.get("type"), "limit": count + 10, "endingAt": lastItem};
    var archive = Router.current().params.type;
    if (archive && archive == 'archive') {
      selector.status = 'archived';
    } else {
      selector.status = {$ne: 'archived'};
    }

    return selector;
  };
});

Template.jobItemsList.onRendered(function () {
  var prepType = JobTypes.findOne({name: 'Prep'});
  Session.set('type', prepType._id);

  var tpl = this;
  Meteor.defer(function () {
    $('#wrapper').scroll(function (event) {
      var wrapper = event.target;
      var wrapperHeight = wrapper.clientHeight;
      var wrapperScrollHeight = wrapper.scrollHeight;
      var wrapperScrollTop = wrapper.scrollTop;

      if (wrapperHeight + wrapperScrollTop === wrapperScrollHeight) {
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
  if (archive && archive == 'archive') {
    selector.status = 'archived';
  } else {
    selector.status = {$ne: 'archived'};
  }
  JobItemsSearch.search("", selector);
});

Template.jobItemsList.onDestroyed(function () {
  $('#wrapper').off('scroll');
});

Template.jobItemsList.helpers({
  getJobItems: function () {
    return JobItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  },

  isLoading: function () {
    return JobItemsSearch.getStatus().loading;
  },
  type: function () {
    return Template.instance().type;
  },
  showSection: function () {
    var id = Template.instance().type;
    var type = JobTypes.findOne(id);
    return !!(type && type.name == "Recurring");
  }
});

Template.jobItemsList.events({
  'keyup #searchJobItemsBox': _.throttle(function (e) {
    var selector = {
      "type": Session.get("type"),
      limit: 30
    };
    if (Router.current().params.type) {
      selector.status = 'archived';
    } else {
      selector.status = {$ne: 'archived'};
    }

    var text = $(e.target).val().trim();
    JobItemsSearch.search(text, selector);
  }, 200),

  'click #loadMoreJobItems': _.throttle(function (event, tmpl) {
    event.preventDefault();
    var text = $("#searchJobItemsBox").val().trim();
    if (JobItemsSearch.history && JobItemsSearch.history[text]) {
      var dataHistory = JobItemsSearch.history[text].data;
      if (dataHistory.length >= 9) {
        JobItemsSearch.cleanHistory();
        var selector = tmpl.newSearchParams(dataHistory);
        JobItemsSearch.search(text, selector);
      }
    }
  }, 200)
});