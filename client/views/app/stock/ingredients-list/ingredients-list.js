Template.ingredientsList.onCreated(function () {
  this.onIngredientIdChange = this.data.onIngredientIdChange;

  this.searchLimit = 20;
  this.searchSource = this.AntiSearchSource({
    collection: 'ingredients',
    fields: ['code', 'description'],
    searchMode: 'local',
    limit: this.searchLimit
  });
});

Template.ingredientsList.onRendered(function () {
  var tpl = this;
  $('#wrapper').scroll(function (event) {
    var wrapper = event.target;
    var wrapperHeight = wrapper.clientHeight;
    var wrapperScrollHeight = wrapper.scrollHeight;
    var wrapperScrollTop = wrapper.scrollTop;

    if (wrapperHeight + wrapperScrollTop === wrapperScrollHeight) {
      tpl.$('#loadMoreIngs').click();
    }
  });
});

Template.ingredientsList.helpers({
  getIngredients: function () {
    return Template.instance().searchSource.searchResult({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>");
      },
      sort: {code: 1}
    });
  },
  onIngredientIdChange: function () {
    var tmpl = Template.instance();

    return function (ingredientId) {
      tmpl.onIngredientIdChange(ingredientId);
      var text = tmpl.$("#searchIngBox").val().trim();
      tmpl.searchSource.search(text);
    };
  }
});

Template.ingredientsList.events({
  'keyup #searchIngBox': _.throttle(function (event, tmpl) {
    var text = event.target.value.trim();
    tmpl.searchSource.search(text);
  }, 500),

  'click #loadMoreIngs': function (event, tmpl) {
    event.preventDefault();
    tmpl.searchSource.incrementLimit(10);
  }
});

Template.ingredientsList.onDestroyed(function () {
  $('#wrapper').off('scroll');
});