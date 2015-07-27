var component = FlowComponents.define('stocksModalList', function(props) {
  this.name = props.name;
  this.onRendered(this.renderShowIngList);
  var id = Router.current().params._id;

  var options = {
    keepHistory: 1000 * 60 * 5,
    localSearch: true
  };
  var fields = ['code', 'description'];

  this.IngredientsSearch = new SearchSource('ingredients', fields, options);
});

component.prototype.setIds = function() {
  var ids = [];
  if(this.item) {
    if(this.item.ingredients && this.item.ingredients.length > 0) {
      this.item.ingredients.forEach(function(doc) {
        ids.push(doc._id);
      });
    } else if(this.item.stocks && this.item.stocks.length > 0) {
      this.item.stocks.forEach(function(doc) {
        ids.push(doc._id);
      });
    }
  }
  this.set("ids", ids);
  return ids;
}

component.prototype.renderShowIngList = function() {
  if(this.name) {
    if(this.name == "editJob") {
      this.item = JobItems.findOne(id);
    } else if(this.name == "editMenu") {
      this.item = MenuItems.findOne(id);
    } else if(this.name == "stockModal") {
      this.item = SpecialAreas.findOne(Session.get("activeSArea"));
    }
  }

  var ids = this.setIds();
  this.IngredientsSearch.search("", {"ids": ids, "limit": 10});
}

component.state.getIngredients = function() {
  return this.IngredientsSearch.getData({
    transform: function(matchText, regExp) {
      return matchText.replace(regExp, "<b>$&</b>")
    },
    sort: {'code': 1}
  });
}

component.action.keyup = function(text) {
  var ids = this.setIds();
  this.IngredientsSearch.search(text, {"ids": ids, "limit": 10});
}

component.action.submit = function() {
  this.IngredientsSearch.search("", {limit: 10});
}