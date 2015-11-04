var component = FlowComponents.define('menuEntry', function (props) {
    this.menuEntry = props.menuEntry;
});

component.state.title = function() {
    return this.menuEntry.title;
};

component.state.icon = function() {
    return this.menuEntry.icon;
};

component.state.subMenuItems = function() {
    return this.menuEntry.subMenuEntries || false;
}