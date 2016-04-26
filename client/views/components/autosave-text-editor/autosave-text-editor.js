Template.autosaveTextEditor.onCreated(function () {
  this.editableMode = new ReactiveVar(false);
  this.statusText = new ReactiveVar('');

  this.timer = {
    timeout: 0,
    setTimeout(executeFunc, timeout) {
      this.timeout = Meteor.setTimeout(executeFunc, timeout);
    },
    clearTimeout() {
      Meteor.clearTimeout(this.timeout);
    }
  };
});


Template.autosaveTextEditor.onRendered(function () {
  this.saveChanges = () => {
    if (!this.data.readOnly && _.isFunction(this.data.saveChanges)) {
      let text = this.$('.summernote').summernote('code');

      this.statusText.set('Saving...');
      this.data.saveChanges(text, () => this.statusText.set('Saved'));
    }
  };

  let onBodyClick = (event) => {
    if (this.$('.note-editor').length) {
      let isClickOnNoteEditor = $.contains(this.$('.note-editor')[0], event.target);
      if (!isClickOnNoteEditor) {
        this.editableMode.set(false);
        this.timer.clearTimeout();
        this.saveChanges();
        this.statusText.set('');
      }
    }
  };

  $('body').bind('click', onBodyClick);
});


Template.autosaveTextEditor.helpers({
  isEditableMode() {
    return Template.instance().editableMode.get();
  },

  statusText() {
    return Template.instance().statusText.get();
  }
});


Template.autosaveTextEditor.events({
  'click .text-editor-content'(event, tmpl) {
    event.preventDefault();
    tmpl.editableMode.set(true);
  },

  'keyup .note-editor'(event, tmpl) {
    event.preventDefault();
    let timeout = tmpl.data.timeout || 1500;
    tmpl.timer.clearTimeout();
    tmpl.timer.setTimeout(tmpl.saveChanges, timeout);
  }
});


Template.autosaveTextEditor.onDestroyed(function () {
  $('body').unbind('click', this.onBodyClick);
});