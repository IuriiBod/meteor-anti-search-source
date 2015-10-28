var component = FlowComponents.define("FilterByCategory", function (props) {

});

component.state.categories = function () {
  var categories = Categories.find({"relations.areaId": HospoHero.getCurrentAreaId()}).fetch();
  categories.push({_id: "all", name: "All"});
  return categories;
};

component.state.week = function () {
  return Router.current().params.week;
};

component.state.year = function () {
  return Router.current().params.year;
};

component.state.currentCategory = function () {
  var category = Router.current().params.category;
  return category === "all" ? "All" : Categories.findOne({_id: category}).name;
};