Template.dropdownMenuItem.helpers({
  routeParams: function () {
    var tpl = Template.instance();
    var params = tpl.data.item.params;
    return params ? params : {};
  }
});