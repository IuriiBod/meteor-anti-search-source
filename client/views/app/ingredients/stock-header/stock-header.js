Template.stockHeader.helpers({
  isArchived: function () {
    var archive = HospoHero.getParamsFromRoute('status');
    return archive && archive === 'archived';
  }
});

Template.stockHeader.events({
  'click .add-new-ingredient': function () {
    FlyoutManager.open('ingredientEditor', {
    	title: 'Add Ingredient',
      ingredient: null
    });
  }
});