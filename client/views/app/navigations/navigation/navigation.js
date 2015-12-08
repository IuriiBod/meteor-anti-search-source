var dashboardEntry = {
  title: 'Dashboard',
  route: 'home',
  icon: 'fa-th-large',
  activeOnRoutes: 'home'
};

var menuEntries = [
  {
    title: 'Forecast',
    route: 'salesPrediction',
    icon: 'fa-bar-chart',
    permission: 'view forecast',
    params: function () {
      return {
        year: moment().year(),
        week: moment().week(),
        category: 'all'
      }
    }
  },
  {
    title: 'Roster',
    icon: 'fa-calendar-o',
    permission: 'view roster',
    activeOnRoutes: ['weeklyRoster', 'dailyRoster', 'templateWeeklyRoster'],
    subMenuEntries: [
      {
        title: 'Weekly',
        route: 'weeklyRoster',
        params: function () {
          return {
            year: moment().year(),
            week: moment().week()
          }
        }
      },
      {
        title: 'Template',
        route: 'templateWeeklyRoster',
        permission: 'edit roster'
      }
    ]
  },
  {
    title: 'Menu',
    route: 'menuItemsMaster',
    icon: 'fa-cutlery',
    permission: 'view menus',
    activeOnRoutes: ['menuItemsMaster', 'submitMenuItem', 'menuItemsMasterType', 'menuItemDetail'],
    params: function () {
      return {
        category: 'all',
        status: 'all'
      }
    }
  },
  {
    title: 'Jobs',
    route: 'jobItemsMaster',
    icon: 'fa-spoon',
    permission: 'view jobs',
    activeOnRoutes: ['jobItemsMaster', 'jobItemsMasterType', 'submitJobItem', 'jobItemDetailed', 'jobItemEdit']
  },
  {
    title: 'Stock',
    icon: 'fa-list',
    permission: 'view stocks',
    activeOnRoutes: ['ingredientsList', 'stocktakeList', 'orderReceiptsList', 'suppliersList', 'supplierProfile', 'orderReceive'],
    subMenuEntries: [
      {
        title: 'List',
        route: 'ingredientsList'
      },
      {
        title: 'Stocktake',
        route: 'stocktakeList',
        permission: 'edit stocks'
      },
      {
        title: 'Receive Orders',
        route: 'orderReceiptsList'
      },
      {
        title: 'Suppliers',
        route: 'suppliersList'
      }
    ]
  },
  {
    title: 'Reports',
    icon: 'fa-line-chart',
    permission: 'view reports',
    activeOnRoutes: ['teamHours', 'currentStocks'],
    subMenuEntries: [
      {
        title: 'Team Hours',
        route: 'teamHours',
        params: function () {
          return {
            year: moment().year(),
            week: moment().week()
          }
        }
      }
    ]
  }
];

Template.navigation.helpers({
  dashboardEntry: function () {
    return dashboardEntry;
  },

  menuEntries: function () {
    return menuEntries;
  }
});
