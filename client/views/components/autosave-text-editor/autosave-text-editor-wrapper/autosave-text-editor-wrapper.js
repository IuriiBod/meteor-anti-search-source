Template.autosaveTextEditorWrapper.onCreated(function () {
  //disable reactiveness in order to retain cursor position inside textEditor
  this.cachedText = this.data.text;
});

Template.autosaveTextEditorWrapper.helpers({
  cachedText() {
    return Template.instance().cachedText;
  }
});