Template.breadcrumbs.helpers({
  isTitleTemplate() {
    return _.isObject(this.title);
  }
});

Template.breadcrumbs.events({
  'click .breadcrumbCategory': function (event) {
    event.preventDefault();

    let category = this.heading.category;
    let categories = {
      Jobs: 'jobItemsMaster',
      Menus: {
        name: 'menuItemsMaster',
        params: {category: 'all', status: 'all'}
      },
      'Stocktake List': 'stocktakeList',
      Stocktake: 'orderReceiptsList',
      Stocks: 'suppliersList',
      Meetings: 'meetings',
      Projects: 'projectsList',
      Interviews: 'interviews',
      Applications: 'applications'
    };

    let route = _.has(categories, category) && categories[category];

    if (route) {
      if (_.isString(route)) {
        Router.go(route);
      } else if (_.isObject(route)) {
        Router.go(route.name, route.params);
      } else {
        return false;
      }
    }
  },

  'click .breadcrumbSubCategory': function (event, tmpl) {
    event.preventDefault();
    let category = tmpl.data.heading.category;
    let id = tmpl.data.id;
    let categoryRouteNamesMap = {Jobs: 'jobItemDetailed', Menus: 'menuItemDetail'};
    let routeName = categoryRouteNamesMap[category];
    if (routeName) {
      Router.go(routeName, {_id: id});
    }
  }
});