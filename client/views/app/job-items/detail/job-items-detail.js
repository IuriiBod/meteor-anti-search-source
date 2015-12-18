Template.jobItemDetail.onCreated(function () {

  this.getLabourCost = function () {
    var jobItem = this.data.jobItem;
    var activeTimeInMins = parseInt(jobItem.activeTime / 60);
    return (parseFloat(jobItem.wagePerHour) / 60) * activeTimeInMins;
  };
  this.getTotalIngredientCost = function () {
    var totalIngCost = 0;
    this.data.jobItem.ingredients.forEach(function (ing) {
      var ingItem = getIngredientItem(ing._id);
      if (ingItem) {
        totalIngCost += parseFloat(ingItem.costPerPortionUsed) * parseFloat(ing.quantity);
      }
    });
    return totalIngCost;
  };
  this.getPrepCostPerPortion = function () {
    var totalCost = (this.getLabourCost() + this.getTotalIngredientCost());
    return Math.round((totalCost / this.data.jobItem.portions) * 100) / 100;
  };
});

Template.jobItemDetail.helpers({

  section: function () {
    var item = Template.instance().data.jobItem;
    if (item && item.section) {
      var section = Sections.findOne(item.section);
      return section ? section.name : false;
    }
    return false;
  },

  isPrep: function () {
    var item = Template.instance().data.jobItem;
    if (item) {
      if (item.type) {
        var type = JobTypes.findOne(item.type);
        return type && type.name == 'Prep';
      }
    }
  },

  isRecurring: function () {
    var item = Template.instance().data.jobItem;
    if (item) {
      if (item.type) {
        var type = JobTypes.findOne(item.type);
        return type && type.name == 'Recurring';
      }
    }
  },

  endsOn: function () {
    var item = Template.instance().data.jobItem;
    var ends = null;
    if (item.endsOn) {
      if (item.endsOn.on == 'endsNever') {
        ends = 'Never';
      } else if (item.endsOn.after) {
        ends = 'After ' + item.endsOn.after + ' occurrences';
      } else if (item.endsOn.lastDate) {
        ends = moment(item.endsOn.lastDate).format('YYYY-MM-DD');
      }
    }
    return ends;
  },

  isWeekly: function () {
    var item = Template.instance().data.jobItem;
    return item ? item.frequency == 'weekly' : false;
  },

  frequency: function () {
    var item = Template.instance().data.jobItem;
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
    var item = Template.instance().data.jobItem;

    var repeatOnDays = item.repeatOn;
    if (_.isArray(repeatOnDays)) {
      if (repeatOnDays.length == 7) {
        return 'Every Day'
      } else if (repeatOnDays.length > 0) {
        return repeatOnDays.join(', ');
      }
    }
  },

  labourCost: function () {
    return Template.instance().getLabourCost();
  },

  prepCostPerPortion: function () {
    return Template.instance().getPrepCostPerPortion();
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
    Router.go("jobItemEdit", {'_id': template.data.jobItem._id});
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