var component = FlowComponents.define('jobItemDetailed', function(props) {
  this.jobitem = props.jobitem;
  this.type = props.type;
  var ids = [];

  if(this.jobitem.ingredients && this.jobitem.ingredients.length > 0) {
    this.jobitem.ingredients.forEach(function(ing) {
      ids.push(ing._id);
    });
    if(ids.length > 0) {
      Meteor.subscribe("ingredients", ids);
    }
  }
});

component.state.showSection = function() {
  var id = this.type;
  var type = JobTypes.findOne(id);
  return !!(type && type.name == "Recurring");
};

component.state.job = function() {
  return this.jobitem;
};

component.state.isPrep = function() {
  return this.jobitem.type == "Prep";
};

component.state.cost = function() {
  var jobItem = this.jobitem;
  if(jobItem) {
    jobItem.totalIngCost = 0;
    jobItem.prepCostPerPortion = 0;
    if(!jobItem.wagePerHour) {
      jobItem.labourCost = 0;
    } else {
      var activeTimeInMins = parseInt(jobItem.activeTime/60);
      jobItem.labourCost = (parseFloat(jobItem.wagePerHour)/60) * activeTimeInMins;
    }
    if(jobItem.ingredients) {
      if(jobItem.ingredients.length > 0) {
        jobItem.ingredients.forEach(function(ing) {
          var ingItem = getIngredientItem(ing._id);
          if(ingItem) {
            ingItem.totalCost = parseFloat(ingItem.costPerPortionUsed) * parseFloat(ing.quantity);
            jobItem.totalIngCost += parseFloat(ingItem.totalCost);
          }
        });
      }
    }
    var totalCost = (jobItem.labourCost + jobItem.totalIngCost);
    if(totalCost > 0 && jobItem.portions > 0) {
      jobItem.prepCostPerPortion = Math.round((totalCost/jobItem.portions) * 100)/100;
    } else {
      jobItem.prepCostPerPortion = 0;
    }
    jobItem.labourCost = Math.round(jobItem.labourCost * 100)/100;
    return jobItem.prepCostPerPortion;
  }
};

component.state.isArchive = function() {
  return this.jobitem.status == "archived";
};
