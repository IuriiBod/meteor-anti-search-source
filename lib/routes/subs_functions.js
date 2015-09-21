function weeklySubs(week, type) {
  var dates = getWeekStartEnd(week);
  return subs.subscribe("weekly", dates, null, type);
}

function jobItemSubs(id) {
  var cursors = [];
  var jobItemCursor = subs.subscribe("jobItems", [id]);
  cursors.push(jobItemCursor);
  if(jobItemCursor) {
    var jobItem = JobItems.findOne(id);
    if(jobItem) {
      if(jobItem.ingredients) {
        var ids = [];
        jobItem.ingredients.forEach(function(doc) {
          ids.push(doc._id);
        });
        if(ids.length > 0) {
          cursors.push(subs.subscribe("ingredients", ids))
        }
      }
      if(jobItem.section) {
        cursors.push(subs.subscribe("section", jobItem.section));
      }
    }
  }
  return cursors;
}

function menuItemSubs(id) {
  var cursors = [];
  var menuItemCursor = Meteor.subscribe("menuItem", id);
  cursors.push(menuItemCursor);
  if(menuItemCursor) {
    var menuItem = MenuItems.findOne(id);
    if(menuItem) {
      if(menuItem.ingredients) {
        var ids = [];
        menuItem.ingredients.forEach(function(doc) {
          ids.push(doc._id);
        });
        if(ids.length > 0) {
          cursors.push(subs.subscribe("ingredients", ids))
        }
      }
    }
  }
  return [
    subs.subscribe("allJobItems"),
    subs.subscribe("allCategories"),
    subs.subscribe("allStatuses"),
    subs.subscribe("allIngredients")
  ];
}