var headingComponentsMap = {
  //props.name : 'headerComponent',
  menulist: 'menuListHeader',
  menudetailed: 'menuDetailsHeader',
  jobslist: 'jobListHeader',
  jobitemdetailed: 'jobDetailsHeader',
  ingredientslist: 'stockHeader',
  teamHoursReport: 'reportsHeader',
  currentStocksReport: 'reportsHeader',
  weeklyroster: 'weeklyHeader',
  dailyroster: 'dailyHeader',
  weeklyrostertemplate: 'weeklyTemplateHeader',
  salesPrediction: 'salesPredictionHeader',
  stocktakeList: 'stocktakeHeader',
  suppliersListHeader: 'suppliersListHeader',
  posMenuLinking: 'posMenuLinkingHeader'
};

var component = FlowComponents.define("pageHeading", function (props) {
  this.title = props.title;
  this.category = props.category;
  this.subCategory = props.subCategory;
  this.set('type', props.name);
  this.id = props.id;
});

component.state.id = function () {
  if (this.id) {
    return this.id;
  } else if (Router.current().params._id) {
    return Router.current().params._id;
  }
};

component.state.heading = function () {
  return {
    category: this.category,
    subCategory: this.subCategory
  };
};

component.state.title = function () {
  var title = this.title;
  if (Router.current().params.type == "archive" || Router.current().params.status == "archived") {
    title = "Archived " + title;
  }
  return title;
};

component.state.headingToLoad = function () {
  var type = this.get('type');
  return headingComponentsMap.hasOwnProperty(type) ? headingComponentsMap[type] : false;
};