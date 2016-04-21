const DEFAULT_LOADING_ICON = 'fa fa-spinner fa-pulse fa-3x fa-fw';

Template.waitButtonContent.helpers({
  iconClassNames() {
    let isWait = this.isWaitState;
    return isWait && (this.waitIcon || DEFAULT_LOADING_ICON) || !isWait && this.icon;
  }
});