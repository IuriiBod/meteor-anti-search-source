var dashboardEntry = {
  title: 'Dashboard',
  route: 'dashboard',
  icon: 'fa-th-large',
  activeOnRoutes: 'dashboard'
};

var menuEntries = [
  {
    title: 'Forecast',
    route: 'salesPrediction',
    icon: 'fa-bar-chart',
    permission: 'view forecast',
    params: function () {
      return {
        date: HospoHero.dateUtils.getDateStringForRoute(),
        category: 'all'
      };
    }
  },
  {
    title: 'Schedules',
    icon: 'fa-calendar-o',
    permission: 'view roster',
    activeOnRoutes: ['managerCalendar', 'weeklyRoster', 'templateWeeklyRoster'],
    subMenuEntries: [
      {
        title: 'Daily',
        route: 'managerCalendar',
        permission: 'edit roster',
        params: function () {
          return {
            date: HospoHero.dateUtils.shortDateFormat(new Date())
          };
        }
      },
      {
        title: 'Weekly',
        route: 'weeklyRoster',
        params: function () {
          return {
            date: HospoHero.dateUtils.getDateStringForRoute()
          };
        }
      },
      {
        title: 'Template',
        route: 'templateWeeklyRoster',
        permission: 'edit roster'
      },
      {
        title: 'Sections',
        route: 'sectionsSettings',
        permission: 'edit roster'
      }
    ]
  },
  {
    title: 'Menu',
    route: 'menuItemsMaster',
    icon: 'fa-cutlery',
    permission: 'view menus',
    activeOnRoutes: ['menuItemsMaster', 'submitMenuItem', 'menuItemDetail'],
    params: function () {
      return {
        category: 'all',
        status: 'all'
      };
    }
  },
  {
    title: 'Jobs',
    route: 'jobItemsMaster',
    icon: 'fa-spoon',
    permission: 'view jobs',
    activeOnRoutes: ['jobItemsMaster', 'jobItemsMaster', 'submitJobItem', 'jobItemDetailed', 'jobItemEdit']
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
      },
      {
        title: 'Stock Areas',
        route: 'stockAreasSettings',
        permission: 'edit stocks'
      }
    ]
  },
  {
    title: 'Reports',
    icon: 'fa-line-chart',
    permission: 'view reports',
    activeOnRoutes: ['teamHours', 'currentStocks', 'menuItemsRankReport'],
    subMenuEntries: [
      {
        title: 'Team Hours',
        route: 'teamHours',
        params: function () {
          return {
            date: HospoHero.dateUtils.getDateStringForRoute()
          };
        }
      },
      {
        title: 'Menu Rank <span class="label label-info pull-right">NEW</span>',
        route: 'menuItemsRankReport',
        params: function () {
          return {
            category: 'all',
            rangeType: 'yesterday',
            startDate: HospoHero.dateUtils.shortDateFormat(moment().subtract(1, 'days'))
          };
        }
      },
      {
        title: 'Stock Report <span class="label label-info pull-right">NEW</span>',
        route: 'stockReport'
      }
    ]
  },
  {
    title: 'Meetings',
    icon: 'fa-users',
    route: 'meetings',
    params: function () {
      return {};
    }
  },
  {
    title: 'Projects',
    icon: 'fa-file-text-o',
    route: 'projectsList',
    activeOnRoutes: ['projectsList', 'createProject', 'projectDetails'],
    params: function () {
      return {};
    }
  },
  {
    title: "Help",
    icon: 'fa-question',
    subMenuEntries: [
      {
        title: 'Self Help',
        callback: function () {
          window._elev.openModule('articles');
        }
      },
      {
        title: 'Chat with Support',
        callback: function () {
          window._elev.openModule('intercom');
        }
      }
    ]
  },
  {
    title: "Chat",
    icon: 'fa-comment',
    route: 'chat'
  }

];

Template.navigation.helpers({
  dashboardEntry: function () {
    return dashboardEntry;
  },

  isUserInAnyOrganization: function () {
    return HospoHero.security.isUserInAnyOrganization();
  },

  menuEntries: function () {
    return menuEntries;
  }
});
