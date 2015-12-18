Template.stockHeader.helpers({
  isArchived: function () {
    var archive = HospoHero.getParamsFromRoute(Router.current(), 'type');
    return archive && archive === 'archive';
  }
});

Template.stockHeader.events({
  'click .add-new-ingredient': function (event, tmpl) {
    tmpl.data.onIngredientIdChange(null);
  }
});