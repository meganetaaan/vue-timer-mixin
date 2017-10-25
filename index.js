class TimerMixin {
  constructor(param) {
    const evNamesDict = {
      start: param.start,
      pause: param.pause,
      resume: param.resume,
      stop: param.stop,
      reset: param.reset
    };
    const tick = param.tick;
    this.data = function() {
      return {
        _mode: 'countup',
        _evNamesDict: evNamesDict,
        time: null,
        _lastStarted: null,
        _tick: tick
      };
    };
    this.created = this._created;
    this.methods = {
      start: this._start,
      pause: this._pause,
      resume: this._resume,
      stop: this._stop,
      reset: this._reset
    };
  }
  _created() {
    ["start", "pause", "resume", "stop", "reset"].forEach(evKey => {
      if (this.$data._evNamesDict[evKey] != null) {
        let evNames = this.$data._evNamesDict[evKey];
        if (typeof evNames === "string") {
          evNames = [evNames];
        }
        if (Array.isArray(evNames)) {
          evNames.forEach(evName => {
            this.$on(evName, function() {
              this.$emit("timer" + evName, this.$data.timer);
              this[evKey].apply(this);
            });
          });
        }
      }
    });
  }
  _start() {
    if (this._handler != null) {
      return
    }
    this._lastStarted = Date.now()
    this._lastPassed = 0
    this._handler = setInterval(() => {
      this._lastPassed = Date.now() - this._lastStarted
      this.$emit('tick', {
        current: this.time + this._lastPassed
      })
    }, this._tick)
  }
  _stop() {
    if (this._handler == null) {
      return
    }
    this.time = this.time + Date.now() - this._lastStarted
    this._lastStarted = null
    this._lastPassed = null
    clearInterval(this._handler)
  }
  _reset() {
    if (this._handler != null) {
      this._lastStarted = null
      this._lastPassed = null
      clearInterval(this._handler)
    }
    this.time = 0
  }
}

var myMixin = new TimerMixin({
  start: "start",
  stop: "stop",
  reset: "reset",
  tick: 300
});

var app = new Vue({
  mixins: [myMixin],
  name: "World",
  el: "#app",
  template: `
      <div class="app">
        <div class="greeting">{{greeting}}</div>
        <div class="time">{{time}}</div>
        <input type="button" value="start" @click="onClickStart">
        <input type="button" value="stop" @click="onClickStop">
        <input type="button" value="reset" @click="onClickReset">
      </div>
      `,
  data: function() {
    return {
      greeting: "hello world!",
      time: null
    };
  },
  methods: {
    onClickStart: function() {
      this.$emit("start");
    },
    onClickStop: function() {
      this.$emit("stop");
    },
    onClickReset: function() {
      this.$emit("reset");
    }
  }
});
