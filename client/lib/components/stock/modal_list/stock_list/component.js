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

component.state.name = function() {
  return this.name;
}

component.prototype.setIds = function() {
  var ids = [];
  if(this.name == "stockModal") {
    if(this.item) {
      if(this.item.ingredients && this.item.ingredients.length > 0) {
        this.item.ingredients.forEach(function(doc) {
          ids.push(doc._id);
        });
      } else if(this.item.stocks && this.item.stocks.length > 0) {
        ids = this.item.stocks;
      }
    }
  } else if(this.name == "editJob") {
    var localJobItemId = Session.get("localId");
    var localJobItem = LocalJobItem.findOne(localJobItemId);
    if(localJobItem && localJobItem.ings.length > 0) {
      ids = localJobItem.ings;
    }
  }
  this.set("ids", ids);
  return ids;
}

component.prototype.renderShowIngList = function() {
  var self = this;
  Tracker.autorun(function() {

    if(self.name) {
      if(self.name == "editJob") {
        self.item = JobItems.findOne(Session.get("localId"));
      } else if(self.name == "editMenu") {
        self.item = MenuItems.findOne(id);
      } else if(self.name == "stockModal") {
        self.item = SpecialAreas.findOne(Session.get("activeSArea"));
      }
    }

    var ids = self.setIds();
    if(ids.length > 0) {
      self.IngredientsSearch.cleanHistory();
    }
    self.IngredientsSearch.search(self.get("text"), {"ids": ids, "limit": 10, "status": "active"});
  });
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
  this.set("text", text);
  this.IngredientsSearch.search(text, {"ids": ids, "limit": 10, "status": "active"});
}