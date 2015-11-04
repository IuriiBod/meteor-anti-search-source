var dashBoadEntry =     {
    title: 'Dashboard',
    route: 'home',
    icon: 'fa-th-large'
};

var menuEntries = [
    {
        title: 'Forecast',
        route: 'salesPrediction',
        icon: 'fa-bar-chart',
        permission: 'canViewForecast',
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
        permission: 'canViewMenu'
    },
    {
        title: 'Jobs',
        route: 'jobItemsMaster',
        icon: 'fa-spoon',
        permission: 'canViewJob'
    },
    {
        title: 'Settings',
        route: 'admin',
        icon: 'fa-cog',
        permission: 'isManager'
    },
    {
        title: 'Roster',
        icon: 'fa-calendar-o',
        permission: 'canViewRoster',
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
                route: 'templateWeeklyRoster'
            }
        ]
    },
    {
        title: 'Reports',
        icon: 'fa-line-chart',
        permission: 'isOrganizationOwner',
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
        permission: 'canViewStock',
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
    return dashBoadEntry;
}

component.state.menuEntries = function () {
    return menuEntries;
};