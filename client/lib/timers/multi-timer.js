/**
 * Singleton class for multi-timers support
 *
 * Usage example:
 *
 * ```
 * let multiTimer = MultiTimer.getInstance();
 *
 * multiTimer.add(timerId, 0);
 *
 * multiTimer.reset(timerId);
 * multiTimer.start(timerId);
 *
 * multiTimer.stop(timer2Id);
 * ```
 *
 * For more information look at ReactiveTimer class
 */
MultiTimer = class MultiTimer {
  constructor () {
    this.timers = {};
  }

  static getInstance () {
    if (!MultiTimer._instance) {
      MultiTimer._instance = new MultiTimer();
    }

    return MultiTimer._instance;
  }

  add (timerId, duration) {
    this.timers[timerId] = new ReactiveTimer(duration);
  }

  get (timerId) {
    return this.timers[timerId] && this.timers[timerId].get();
  }

  start (timerId) {
    return this.timers[timerId] && this.timers[timerId].start();
  }

  pause (timerId) {
    return this.timers[timerId] && this.timers[timerId].pause();
  }

  stop (timerId) {
    return this.timers[timerId] && this.timers[timerId].stop();
  }

  reset (timerId) {
    return this.timers[timerId] && this.timers[timerId].reset();
  }
};