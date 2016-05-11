let TITLE_FIELD = 'title';

Template.tasksPalette.onCreated(function () {
  this.searchResult = new ReactiveVar(null);
});

Template.tasksPalette.helpers({
  items () {
    let tmpl = Template.instance();
    return tmpl.searchResult.get();
  },

  color () {
    return '#27a0c9';
  },

  searchSettings () {
    let tmpl = Template.instance();

    let onSearchFinished = (searchSource) => {
      let searchResult = searchSource.searchResult({sort: {[TITLE_FIELD]: 1}});
      let modifiedResults = HospoHero.calendar.modifySearchResults(Meteor.userId(), 'task', searchResult);

      tmpl.searchResult.set(modifiedResults);
    };

    let queryOptions = () => {
      let queryType = this.type === 'day' ? 'forDay' : 'forWeek';
      let currentDate = TimeRangeQueryBuilder[queryType](this.date);

      let placedTasks = CalendarEvents.find({startTime: currentDate}).map(event => event.itemId);

      let query = HospoHero.misc.getTasksQuery(Meteor.userId());

      return _.extend(query, {
        _id: {
          $nin: placedTasks
        },
        dueDate: currentDate,
        done: false
      });
    };

    return {
      collection: 'taskList',
      titleField: TITLE_FIELD,
      onSearchFinished: onSearchFinished,
      queryOptions: queryOptions()
    };
  }
});