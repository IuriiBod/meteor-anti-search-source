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
      var text = this.$('.summernote').summernote('code');
      this.data.saveChanges(text);
      this.statusText.set('Saved');
    }
  };

  var onBodyClick = (event) => {
    if (this.$('.note-editor').length) {
      var isClickOnNoteEditor = $.contains(this.$('.note-editor')[0], event.target);
      if (!isClickOnNoteEditor) {
        this.editableMode.set(false);
        this.timer.clearTimeout();
        this.saveChanges();
      }
    }
  };

  $("body").bind('click', onBodyClick);
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

    tmpl.statusText.set('Saving...');

    var timeout = tmpl.data.timeout || 1500;
    tmpl.timer.clearTimeout();
    tmpl.timer.setTimeout(tmpl.saveChanges, timeout);
  }
});


Template.autosaveTextEditor.onDestroyed(function () {
  $('body').unbind('click', this.onBodyClick);
});