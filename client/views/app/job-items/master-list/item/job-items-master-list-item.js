Template.jobItemDetailed.helpers({
  showSection: function () {
    var id = Template.instance().data.type;
    var type = JobTypes.findOne({_id: id});
    return !!type && type.name == "Recurring";
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
        break;
      case 'weekly':
        return 'Weekly';
        break;
      case 'everyXWeeks':
        return 'Every ' + jobItem.repeatEvery + ' weeks';
        break;
      default :
        false;
    }
  },

  isPrep: function () {
    var id = Template.instance().data.type;
    var type = JobTypes.findOne({_id: id});
    return !!type && type.name == "Prep";
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
          jobItem.ingredients.forEach(function (ing) {
            var ingItem = getIngredientItem(ing._id);
            if (ingItem) {
              ingItem.totalCost = parseFloat(ingItem.costPerPortionUsed) * parseFloat(ing.quantity);
              jobItem.totalIngCost += parseFloat(ingItem.totalCost);
            }
          });
        }
      }
      var totalCost = (jobItem.labourCost + jobItem.totalIngCost);
      if (totalCost > 0 && jobItem.portions > 0) {
        jobItem.prepCostPerPortion = Math.round((totalCost / jobItem.portions) * 100) / 100;
      } else {
        jobItem.prepCostPerPortion = 0;
      }
      jobItem.labourCost = Math.round(jobItem.labourCost * 100) / 100;
      return jobItem.prepCostPerPortion;
    }
  },

  isArchive: function () {
    return Template.instance().data.jobitem.status == "archived";
  }
});

Template.jobItemDetailed.events({
  'click .viewDetail': function (event) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Router.go("jobItemDetailed", {_id: id});
  }
});
