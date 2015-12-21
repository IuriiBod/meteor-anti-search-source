Template.jobItemsModalList.onCreated(function () {

  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['name'];
  var prep = JobTypes.findOne({"name": "Prep"});

  this.prep = new ReactiveVar(prep._id);
  this.text = new ReactiveVar(null);

  this.JobItemsSearch = new SearchSource('jobItemsSearch', fields, options);


  var self = this;
  this.setIds = function () {
    var ids = [];
    if (self.data.name == "editMenu") {
      var menu = MenuItems.findOne(Session.get("thisMenuItem"));
      if (menu.jobItems.length > 0) {
        menu.jobItems.forEach(function (doc) {
          if (ids.indexOf(doc._id) < 0) {
            ids.push(doc._id);
          }
        });
      }
    } else if (self.data.name == "submitMenuItem") {
      var menu = LocalMenuItem.findOne(Session.get("localId"));
      if (menu && menu.preps.length > 0) {
        menu.preps.forEach(function (id) {
          if (ids.indexOf(id) < 0) {
            ids.push(id);
          }
        });
      }
    }
    return ids;
  };

  this.keyup = function (text) {
    var ids = this.setIds();
    self.text.set(text);
    self.JobItemsSearch.search(text, {"ids": ids, "limit": 10, "type": self.prep.get()});
  };
});

Template.jobItemsModalList.onRendered(function () {
  var self = this;

  Tracker.autorun(function () {
    var ids = self.setIds();
    if (ids.length > 0) {
      self.JobItemsSearch.cleanHistory();
    }
    var text = self.text.get();
    self.JobItemsSearch.search(text, {"ids": ids, "limit": 10, "type": self.prep.get()});
  });
});

Template.jobItemsModalList.helpers({
  getJobItems: function () {
    return Template.instance().JobItemsSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'name': 1}
    });
  }
});

Template.jobItemsModalList.events({
  'keyup #searchText-box': function (event) {
    var text = $(event.target).val().trim();
    FlowComponents.callAction('keyup', text);
  },

  'click #addNewJobItem': function (event) {
    event.preventDefault();
    $("#jobItemListModal").modal("hide");
    Router.go("submitJobItem");
  }
});