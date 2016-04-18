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

  templateData: function () {
    return this || {};
  }
});