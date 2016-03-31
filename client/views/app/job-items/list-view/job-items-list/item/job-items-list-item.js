Template.jobItemDetailed.helpers({
  isRecurring: function () {
    var id = Template.instance().data.jobitem.type;
    var type = JobTypes.findOne({_id: id});
    return !!type && type.name === "Recurring";
  },

  job: function () {
    return Template.instance().data.jobitem;
  },

  jobFrequency: function () {
    var jobItem = Template.instance().data.jobitem;
    var frequency = jobItem.frequency;
    switch (frequency) {
      case 'daily':
        return 'Daily';
      case 'weekly':
        return 'Weekly';
      case 'everyXWeeks':
        return 'Every ' + jobItem.repeatEvery + ' weeks';
      default :
        return false;
    }
  },

  cost: function () {
    var jobItem = Template.instance().data.jobitem;
    if (jobItem) {
      jobItem.totalIngCost = 0;
      jobItem.prepCostPerPortion = 0;
      if (!jobItem.wagePerHour) {
        jobItem.labourCost = 0;
      } else {
        var activeTimeInMins = parseInt(jobItem.activeTime / 60);
        jobItem.labourCost = (parseFloat(jobItem.wagePerHour) / 60) * activeTimeInMins;
      }
      if (jobItem.ingredients) {
        if (jobItem.ingredients.length > 0) {
          jobItem.ingredients.forEach(function (ingredientInJobItem) {
            var analyzedIngredient = HospoHero.analyze
              .ingredient(Ingredients.findOne({_id: ingredientInJobItem._id}));
            if (analyzedIngredient) {
              analyzedIngredient.totalCost = parseFloat(analyzedIngredient.costPerPortionUsed) *
                parseFloat(ingredientInJobItem.quantity);
              jobItem.totalIngCost += parseFloat(analyzedIngredient.totalCost);
            }
          });
        }
      }
      var totalCost = (jobItem.labourCost + jobItem.totalIngCost);
      if (totalCost > 0 && jobItem.portions > 0) {
        jobItem.prepCostPerPortion = HospoHero.misc.rounding(totalCost / jobItem.portions);
      } else {
        jobItem.prepCostPerPortion = 0;
      }
      jobItem.labourCost = HospoHero.misc.rounding(jobItem.labourCost);
      return jobItem.prepCostPerPortion;
    }
  },

  isArchive: function () {
    return Template.instance().data.jobitem.status === "archived";
  }
});

Template.jobItemDetailed.events({
  'click .viewDetail': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Router.go("jobItemDetailed", {_id: id});
  }
});
