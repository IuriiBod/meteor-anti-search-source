Template.jobItemDetail.onCreated(function () {
  this.id = Router.current().params._id;
  this.job = getPrepItem(this.id);
});

Template.jobItemDetail.helpers({
  job: function () {
    return Template.instance().job;
  },

  section: function () {
    var item = Template.instance().job;
    if (item && item.section) {
      var section = Sections.findOne(item.section);
      return section ? section.name : false;
    }
    return false;
  },

  isPrep: function () {
    var item = Template.instance().job;
    if (item) {
      if (item.type) {
        var type = JobTypes.findOne(item.type);
        return !!(type && type.name == 'Prep');
      }
    }
  },

  isRecurring: function () {
    var item = Template.instance().job;
    if (item) {
      if (item.type) {
        var type = JobTypes.findOne(item.type);
        return !!(type && type.name == 'Recurring');
      }
    }
  },

  ingExists: function () {
    var item = Template.instance().job;
    return !!(item.ingredients && item.ingredients.length > 0);
  },


  isChecklist: function () {
    var item = Template.instance().job;
    return item && item.checklist && item.checklist.length > 0;
  },

  checklist: function () {
    var item = Template.instance().job;
    return item && item.checklist ? item.checklist : '';
  },

  startsOn: function () {
    var item = Template.instance().job;
    if (item && item.startsOn) {
      return moment(item.startsOn).format('YYYY-MM-DD');
    }
  },

  repeatAt: function () {
    var item = Template.instance().job;
    return item && item.repeatAt ? moment(item.repeatAt).format('hh:mm A') : false;
  },

  endsOn: function () {
    var item = Template.instance().job;
    var ends = null;
    if (item) {
      if (item.endsOn) {
        if (item.endsOn.on == 'endsNever') {
          ends = 'Never';
        } else if (item.endsOn.on == 'endsAfter') {
          ends = 'After ' + item.endsOn.after + ' occurrences';
        } else if (item.endsOn.on == 'endsOn') {
          ends = 'On ' + moment(item.endsOn.lastDate).format('YYYY-MM-DD');
        }
      }
      return ends;
    }
  },

  isWeekly: function () {
    var item = Template.instance().job;
    return item ? item.frequency == 'weekly' : false;
  },

  frequency: function () {
    var item = Template.instance().job;
    switch (item.frequency) {
      case 'everyXWeeks':
        return 'Every ' + item.repeatEvery + ' weeks';
        break;
      case 'weekly':
        return 'Weekly';
        break;
      case 'daily':
        return 'Daily';
    }
  },

  repeatOnDays: function () {
    var item = Template.instance().job;

    var repeatOnDays = item.repeatOn;
    if (_.isArray(repeatOnDays)) {
      if (repeatOnDays.length == 7) {
        return 'Every Day'
      } else if (repeatOnDays.length > 0) {
        return repeatOnDays.join(', ');
      }
    }
  },


  description: function () {
    var item = Template.instance().job;
    return item ? item.description : '';
  },

  labourCost: function () {
    var item = Template.instance().job;
    return item ? item.labourCost : 0;
  },

  prepCostPerPortion: function () {
    var item = Template.instance().job;
    return item ? item.prepCostPerPortion : 0;
  },

  relatedMenus: function () {
    return MenuItems.find().fetch();
  },

  getCategory: function (id) {
    var category = Categories.findOne({_id: id});
    return category ? category.name : '';
  }
});

Template.jobItemDetail.events({
  'click .editJobItemBtn': function (event, template) {
    event.preventDefault();
    Router.go("jobItemEdit", {'_id': template.id});
  },

  'click .printJobItemBtn': function (event) {
    event.preventDefault();
    print();
  },

  // This events seems not used
  'click .subscribeJobItemBtn': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("subscribe", id, HospoHero.handleMethodResult());
  },
  'click .unSubscribeJobItemBtn': function (event) {
    event.preventDefault();
    var id = $(event.target).attr("data-id");
    Meteor.call("unSubscribe", id, HospoHero.handleMethodResult());
  }
});