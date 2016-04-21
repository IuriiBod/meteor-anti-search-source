const READY_STATE = 'ready';
const WAIT_STATE = 'wait';
const COMPONENT_ROOT_CLASS = 'wait-button-component';


/**
 * Small component that shows spinner if user clicks on it
 *
 * ```
 * {{> button class="target-class" }}
 * ```
 *
 * To stop spinner just call `Template.waitButton.handleMethodResult`
 *
 * ```
 * 'click .target-class': function (event) {
 *  Meteor.call('someMethod', Template.waitButton.handleMethodResult(event));
 * }
 * ```
 *
 * or set preventWait true and manage behaviour via
 *
 * ```
 * $('.target-class')[0].ready() //hide spinner
 * $('.target-class')[0].wait() //show spinner
 * ```
 */
//context: text (String), classNames [String], id [String], type ['button'/'submit'/'link'],
// waitIcon [String], icon [String], iconAfterText [Boolean], preventWait [Boolean]
// [] - optional
Template.waitButton.onCreated(function () {
  this.state = new ReactiveVar(READY_STATE);

  this.isWaitState = () => this.state.get() === WAIT_STATE;
});


Template.waitButton.onRendered(function () {
  let componentRootElement = this.$(`.${COMPONENT_ROOT_CLASS}`)[0];

  _.extend(componentRootElement, {
    ready: () => this.state.set(READY_STATE),
    wait: () => this.state.set(WAIT_STATE)
  });
});


Template.waitButton.helpers({
  buttonAttributes() {
    let classNames = this.classNames ? this.classNames : '';
    return {
      class: `${COMPONENT_ROOT_CLASS} ${classNames}`,
      id: this.id,
      type: this.type || 'button'
    };
  },

  isLink() {
    return this.type === 'link';
  },

  buttonContentContext() {
    return _.extend({
      isWaitState: Template.instance().isWaitState()
    }, this);
  }
});

Template.waitButton.events({
  //this only works when class is constant (it isn't reactive)
  [`click .${COMPONENT_ROOT_CLASS}`]: function (event, tmpl) {
    if (tmpl.data.type === 'link') {
      event.preventDefault();
    }

    if (!tmpl.data.preventWait) {
      event.target.wait();
    }
  }
});


Template.waitButton.handleMethodResult = function (event, onSuccess) {
  return function (err, res) {
    //process result
    if (err) {
      HospoHero.error(err);
    } else {
      if (_.isFunction(onSuccess)) {
        onSuccess(res);
      }
    }

    //hide loading animation
    let readyFn = HospoHero.utils.getNestedProperty(event, 'target.ready', false);
    if (_.isFunction(readyFn)) {
      readyFn();
    }
  };
};