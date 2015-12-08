var component = FlowComponents.define('itemListed', function (props) {
  this.type = props.type;
  this.item = props.item;
  // this.jobitem = props.jobitem;
  // var item = getPrepItem(this.jobitem._id);
  // this.jobitem = item;
});

component.state.name = function () {
  return this.type == "prep" ? this.item.name : this.item.description;
};

component.state.id = function () {
  return this.item._id;
};

component.state.type = function () {
  return this.type;
};

component.state.isPrep = function () {
  return this.type == "prep";
};

component.state.isPrep = function () {
  if (this.type == "prep") {
    return true;
  }
}

component.state.activeTime = function () {
  if (this.type == "prep") {
    return (this.item.activeTime / 60);
  }
};