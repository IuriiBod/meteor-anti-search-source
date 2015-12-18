Template.ingredientsList.onCreated(function () {
  this.onIngredientIdChange = this.data.onIngredientIdChange;

  this.searchLimit = 20;
  var status = HospoHero.getParamsFromRoute(Router.current(), 'type') ? 'archived' : {$ne: 'archived'};

  this.searchSource = this.AntiSearchSource({
    collection: 'ingredients',
    fields: ['code', 'description'],
    mongoQuery: {
      status: status
    },
    limit: this.searchLimit
  });
});

Template.ingredientsList.onRendered(function () {
  var tpl = this;
  Meteor.defer(function () {
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
});

Template.ingredientsList.helpers({
  getIngredients: function () {
    return Template.instance().searchSource.searchResult({sort: {code: 1}});
  },
  onIngredientIdChange: function () {
    var tmpl = Template.instance();

    return function (ingredientId) {
      tmpl.onIngredientIdChange(ingredientId);
      var text = tmpl.$("#searchIngBox").val().trim();
      tmpl.searchSource.search(text);
    }
  }
});

Template.ingredientsList.events({
  'keyup #searchIngBox': _.throttle(function (event, tmpl) {
    var text = event.target.value.trim();
    tmpl.searchSource.search(text);
  }, 200),

  'click #loadMoreIngs': function (event, tmpl) {
    event.preventDefault();
    var text = tmpl.$("#searchIngBox").val().trim();
    tmpl.searchLimit += 10;
    tmpl.searchSource.setLimit(tmpl.searchLimit);
    tmpl.searchSource.search(text);
  }
});

Template.ingredientsList.onDestroyed(function () {
  $('#wrapper').off('scroll');
});