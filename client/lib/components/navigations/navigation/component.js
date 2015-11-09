var dashboardEntry =     {
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
        permission: {
            type: 'canUser',
            action: 'view forecast'
        },
        params: function () {
            return {
                year: moment().year(),
                week: moment().week(),
                category: 'all'
            }
        }
    },
    {
        title: 'Menu',
        route: 'menuItemsMaster',
        icon: 'fa-cutlery',
        permission: {
            type: 'canUser',
            action: 'view menus'
        },
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
        permission: {
            type: 'canUser',
            action: 'view jobs'
        },
        activeOnRoutes: ['jobItemsMaster', 'jobItemsMasterType', 'submitJobItem', 'jobItemDetailed', 'jobItemEdit']
    },
    {
        title: 'Roster',
        icon: 'fa-calendar-o',
        permission: {
            type: 'canUser',
            action: 'view roster'
        },
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
                title: 'Daily',
                route: 'dailyRoster',
                params: function () {
                    return {
                        date: moment().format("YYYY-MM-DD")
                    }
                }
            },
            {
                title: 'Template',
                route: 'templateWeeklyRoster',
                permission: {
                    type: 'canUser',
                    action: 'edit roster'
                },
            }
        ]
    },
    {
        title: 'Reports',
        icon: 'fa-line-chart',
        permission: {
            type: 'isOrganizationOwner'
        },
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
            }, {
                title: 'Daily stock',
                route: 'currentStocks',
                params: function () {
                    return {
                        year: moment().year(),
                        week: moment().week()
                    }
                }
            }
        ]
    },
    {
        title: 'Stock',
        icon: 'fa-list',
        permission: {
            type: 'canUser',
            action: 'view stocks'
        },
        activeOnRoutes: ['ingredientsList', 'stocktakeList', 'orderReceiptsList', 'suppliersList'],
        subMenuEntries: [
            {
                title: 'List',
                route: 'ingredientsList'
            },
            {
                title: 'Stocktake',
                route: 'stocktakeList'
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
    }
];

var component = FlowComponents.define("navigation", function(props) {});

component.state.dashboardEntry = function() {
    return dashboardEntry;
}

component.state.menuEntries = function () {
    return menuEntries;
};