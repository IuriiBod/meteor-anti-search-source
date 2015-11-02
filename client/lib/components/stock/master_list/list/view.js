var options = {
  keepHistory: 1000 * 60 * 5,
  localSearch: true
};
var fields = ['code', 'description'];

IngredientsListSearch = new SearchSource('ingredients', fields, options);

Template.ingredientsList.helpers({
  getIngredients: function() {
    return IngredientsListSearch.getData({
      transform: function (matchText, regExp) {
        return matchText.replace(regExp, "<b>$&</b>")
      },
      sort: {'code': 1}
    });
  },

  isLoading: function() {
    return IngredientsListSearch.getStatus().loading;
  }
});

Template.ingredientsList.events({
  "keyup #searchIngBox": _.throttle(function(e) {
    var selector = {
      limit: 30
    };
    if(Router.current().params.type) {
      selector.status = "archived";
    } else {
      selector.status = {$ne: "archived"};
    }
    var text = $(e.target).val().trim();
    IngredientsListSearch.search(text, selector);
  }, 200),

  'click #loadMoreIngs': _.throttle(function(e) {
    e.preventDefault();
    var text = $("#searchIngBox").val().trim();
    if(IngredientsListSearch.history && IngredientsListSearch.history[text]) {
      var dataHistory = IngredientsListSearch.history[text].data;
      if(dataHistory.length >= 9) {
        IngredientsListSearch.cleanHistory();
        var count = dataHistory.length;
        var lastItem = dataHistory[count - 1]['code'];
        var selector = {
          "limit": count + 10,
          "endingAt": lastItem
        };
        if(Router.current().params.type) {
          selector.status = "archived";
        } else {
          selector.status = {$ne: "archived"};
        }
        IngredientsListSearch.search(text, selector);
      }
    }
  }, 200),

  'click .editIngredient': function(event, tmpl) {
    event.preventDefault();
    var id = $(event.target).closest("tr").attr("data-id");
    Session.set("thisIngredientId", id);
    Meteor.subscribe('ingredients', [id], HospoHero.getCurrentAreaId(Meteor.userId()));
    tmpl.$("#editIngredientModal").modal("show");
  }
});

Template.ingredientsList.onRendered(function() {
  IngredientsListSearch.cleanHistory();
  var selector = {
    limit: 30
  };
  if(Router.current().params.type) {
    selector.status = "archived";
  } else {
    selector.status = {$ne: "archived"};
  }
  IngredientsListSearch.search("", selector);

  var tpl = this;
  Meteor.defer(function() {
    $(window).scroll(function(e){
      var docHeight = $(document).height();
      var winHeight = $(window).height();
      var scrollTop = $(window).scrollTop();

      if ((docHeight - winHeight) == scrollTop) {
        tpl.$('#loadMoreIngs').click();
      }
    });
  });
});
