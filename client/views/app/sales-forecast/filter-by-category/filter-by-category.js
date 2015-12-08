Template.FilterByCategory.onCreated(function () {

});

Template.FilterByCategory.helpers({
  categories: function () {
    var categories = Categories.find({"relations.areaId": HospoHero.getCurrentAreaId()}).fetch();
    categories.push({_id: "all", name: "All"});
    return categories;
  },

  week: function () {
    return Router.current().params.week;
  },

  year: function () {
    return Router.current().params.year;
  },

  currentCategory: function () {
    var category = Router.current().params.category;
    return category === "all" ? "All" : Categories.findOne({_id: category}).name;
  }
});