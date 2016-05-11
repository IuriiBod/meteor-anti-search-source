Namespace('HospoHero.calendar', {
  modifySearchResults(userId, type, searchResults) {
    let area = HospoHero.getCurrentArea(userId);

    return searchResults.map(searchResult => {
      return {
        itemId: searchResult._id,
        type,
        userId,
        locationId: area.locationId,
        startTime: new Date(),
        endTime: new Date()
      };
    });
  }
});