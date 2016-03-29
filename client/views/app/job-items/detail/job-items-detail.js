Template.jobItemDetail.onCreated(function () {
  this.getLabourCost = function () {
    var jobItem = this.data.jobItem;
    if (jobItem) {
      var activeTimeInMins = parseInt(jobItem.activeTime / 60);
      return HospoHero.misc.rounding((parseFloat(jobItem.wagePerHour) / 60) * activeTimeInMins);
    } else {
      return false;
    }
  };

  this.jobType = JobTypes.findOne({_id: this.data.jobItem.type});
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
    var type = Template.instance().jobType;
    return type && type.name === 'Prep';
  },

  isRecurring: function () {
    var type = Template.instance().jobType;
    return type && type.name === 'Recurring';
  },

  endsOn: function () {
    var item = Template.instance().data.jobItem;
    var ends = null;
    if (item.endsOn) {
      if (item.endsOn.on === 'endsNever') {
        ends = 'Never';
      } else if (item.endsOn.after) {
        ends = 'After ' + item.endsOn.after + ' occurrences';
      } else if (item.endsOn.lastDate) {
        ends = HospoHero.dateUtils.shortDateFormat(moment(item.endsOn.lastDate));
      }
    }
    return ends;
  },

  isWeekly: function () {
    var item = Template.instance().data.jobItem;
    return item ? item.frequency === 'weekly' : false;
  },

  frequency: function () {
    var item = Template.instance().data.jobItem;
    switch (item.frequency) {
      case 'everyXWeeks':
        return 'Every ' + item.repeatEvery + ' weeks';
      case 'weekly':
        return 'Weekly';
      case 'daily':
        return 'Daily';
    }
  },

  repeatOnDays: function () {
    var item = Template.instance().data.jobItem;

    var repeatOnDays = item.repeatOn;
    if (_.isArray(repeatOnDays)) {
      if (repeatOnDays.length === 7) {
        return 'Every Day';
      } else if (repeatOnDays.length > 0) {
        return repeatOnDays.join(', ');
      }
    }
  },

  labourCost: function () {
    return Template.instance().getLabourCost();
  },

  prepCostPerPortion: function () {
    var self = this;
    var getPrepCostPerPortion = function () {
      var getTotalIngredientCost = function () {
        var totalIngCost = 0;
        self.jobItem.ingredients.forEach(function (ingredientInJobItem) {
          var analyzedIngredient = HospoHero.analyze
            .ingredient(Ingredients.findOne({_id: ingredientInJobItem._id}));
          if (analyzedIngredient) {
            totalIngCost += parseFloat(analyzedIngredient.costPerPortionUsed) *
              parseFloat(ingredientInJobItem.quantity);
          }
        });
        return totalIngCost;
      };

      var totalCost = (Template.instance().getLabourCost() + getTotalIngredientCost());
      return HospoHero.misc.rounding(totalCost / self.jobItem.portions);
    };

    return getPrepCostPerPortion();
  },

  relatedMenus: function () {
    var jobItemId = this.jobItem._id;
    return MenuItems.find({jobItems: {$elemMatch: {_id: jobItemId}}});
  },

  getCategory: function (id) {
    var category = Categories.findOne({_id: id});
    return category ? category.name : '';
  }
});