let TITLE_FIELD = 'name';

Template.prepJobsPalette.onCreated(function () {
  this.searchResult = new ReactiveVar(null);
});

Template.prepJobsPalette.helpers({
  items () {
    let tmpl = Template.instance();
    return tmpl.searchResult.get();
  },

  color () {
    return '#23C6C8';
  },

  searchSettings () {
    let tmpl = Template.instance();

    let onSearchFinished = (searchSource) => {
      let searchResult = searchSource.searchResult({sort: {[TITLE_FIELD]: 1}});
      let modifiedResults = HospoHero.calendar.modifySearchResults(Meteor.userId(), 'prep job', searchResult);

      tmpl.searchResult.set(modifiedResults);
    };

    let queryOptions = () => {
      return {
        frequency: {
          $exists: false
        }
      };
    };

    return {
      collection: 'jobItems',
      titleField: TITLE_FIELD,
      onSearchFinished: onSearchFinished,
      queryOptions: queryOptions()
    };
  }
});