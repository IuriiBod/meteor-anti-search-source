Template.newsFeed.helpers({
  newsFeedsList: function () {
    return NewsFeeds.find({
      "relations.areaId": HospoHero.getCurrentAreaId(),
      "reference": null
    }, {sort: {"createdOn": -1}});
  }
});

