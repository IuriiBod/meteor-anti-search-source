Template.stockHeader.helpers({
  isArchived: function () {
    var archive = HospoHero.getParamsFromRoute(Router.current(), 'type');
    return archive && archive === 'archive';
  }
});