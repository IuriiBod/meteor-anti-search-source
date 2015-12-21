Template.jobItemsList.onCreated(function () {
  this.searchSource = this.AntiSearchSource({
    collection: 'jobItems',
    fields: ['name', 'recipe', 'description'],
    searchMode: 'local',
    limit: 10
  });

  // when jop type changes, set new mongo query
  var self = this;
  this.autorun(function () {
    var type = Template.currentData().type;
    var typeId = JobTypes.findOne({name: type})._id;
    self.searchSource.setMongoQuery({type: typeId});
  });
  this.searchSource.search('');
});

Template.jobItemsList.onRendered(function () {
  // for infinite scroll
  var tmpl = this;
  $('#wrapper').scroll(function (e) {
    var docHeight = $(document).height();
    var winHeight = $(window).height();
    var scrollTop = $(window).scrollTop();

    if ((docHeight - winHeight) == scrollTop) {
      tmpl.$('.load-more-items').click();
    }
  });
});

Template.jobItemsList.helpers({
  jobItems: function () {
    return Template.instance().searchSource.searchResult();
  },
  isRecurring: function () {
    return Template.instance().data.type == 'Recurring';
  }
});

Template.jobItemsList.events({
  'keyup .search-job-items-box': _.throttle(function (e, tmpl) {
    var value = $(e.target).val();
    tmpl.searchSource.search(value);
  }, 500),

  'click .load-more-items': function (e, tmpl) {
    tmpl.searchSource.incrementLimit(10);
  }
});