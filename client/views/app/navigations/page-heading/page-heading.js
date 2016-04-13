var headingComponentsMap = {
  //props.name : 'headerComponent',
  menuList: 'menuListHeader',
  menuDetails: 'menuDetailsHeader',
  jobslist: 'jobListHeader',
  jobitemdetailed: 'jobDetailsHeader',
  ingredientslist: 'stockHeader',
  teamHoursReport: 'reportsHeader',
  currentStocksReport: 'reportsHeader',
  weeklyroster: 'weeklyHeader',
  weeklyrostertemplate: 'weeklyTemplateHeader',
  salesPrediction: 'salesPredictionHeader',
  stocktakeList: 'stocktakeHeader',
  suppliersListHeader: 'suppliersListHeader',
  posMenuLinking: 'posMenuLinkingHeader',
  taskList: 'taskListHeader',
  meetings: 'meetingsHeader',
  projects: 'projectsListHeader',
  calendar: 'calendarHeader',
  applicationsList: 'applicationsListHeader',
  projectDetails: 'projectDetailsHeader'
};

Template.pageHeading.onCreated(function () {
  this.subscribe('todayTasks');
});

Template.pageHeading.helpers({
  id: function () {
    if (this.id) {
      return this.id;
    } else if (Router.current().params._id) {
      return Router.current().params._id;
    }
  },

  heading: function () {
    return {
      category: this.category,
      subCategory: this.subCategory
    };
  },

  title: function () {
    let title = this.title;
    let routeParams = Router.current().params;
    if (!_.isObject(title) && (routeParams.type === 'archive' || routeParams.status === 'archived')) {
      title = `Archived ${title}`;
    }
    return title;
  },

  headingToLoad: function () {
    var name = this.name;
    return headingComponentsMap.hasOwnProperty(name) ? headingComponentsMap[name] : false;
  },

  templateData: function () {
    return this || {};
  }
});