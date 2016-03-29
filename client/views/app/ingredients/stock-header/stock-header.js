Template.stockHeader.helpers({
  isArchived: function () {
    var archive = HospoHero.getParamsFromRoute('type');
    return archive && archive === 'archive';
  }
});

Template.stockHeader.events({
  'click .add-new-ingredient': function () {
    FlyoutManager.open('wrapperFlyout', {
      template: 'ingredientEditor',
      title: "Add ingredient",
      data: {
        inFlyout: true,
        ingredient: null
      }
    });
  }
});