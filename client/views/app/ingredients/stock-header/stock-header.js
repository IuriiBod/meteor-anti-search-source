Template.stockHeader.helpers({
  isArchived: function () {
    var archive = HospoHero.getParamsFromRoute('status');
    return archive && archive === 'archived';
  }
});

Template.stockHeader.events({
  'click .add-new-ingredient': function () {
    FlyoutManager.open('wrapperFlyout', {
      template: 'ingredientEditor',
      title: 'Add ingredient',
      data: {
        inFlyout: true,
        ingredient: null
      }
    });
  }
});