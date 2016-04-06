/**
 * Reactive Timer
 *
 * Allow to create reactive timers with duration in seconds.
 *
 * Usage example:
 *
 * ```
 * Template.test.onCreated(function() {
 *  let duration = 3600; // an hour
 *
 *  this.timer = new ReactiveTimer(duration);
 *  this.timer.start();
 * });
 *
 * Template.test.helpers({
 *  timerValue () {
 *    return Template.instance().timer.get();
 *  }
 * });
 * ```
 * @param {number} [duration] - start duration in seconds
 */
ReactiveTimer = class ReactiveTimer {
  constructor(duration = 0) {
    this.duration = duration;
    this.dependency = new Tracker.Dependency();
  }

  start() {
    let timeIncrement = () => {
      this.duration++;
      this.dependency.changed();
    };

    this.timerId = setInterval(timeIncrement, 1000);
  }

  pause() {
    clearInterval(this.timerId);
    this.dependency.changed();
  }

  stop() {
    this.pause();
    this.reset();
    this.dependency.changed();
  }

  get() {
    this.dependency.depend();
    return this.duration;
  }

  reset() {
    this.duration = 0;
    this.dependency.changed();
  }
};