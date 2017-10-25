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
        time: 0,
        _lastTime: 0,
        _lastStarted: null,
        _lastPassed: null,
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
    ["reset", "stop", "reset"].forEach(evKey => {
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
    if (this.$data._handler != null) {
      return
    }
    this.$data._lastStarted = Date.now()
    this.$data._lastPassed = 0
    this.$data._handler = setInterval(() => {
      this.$data._lastPassed = Date.now() - this.$data._lastStarted
      this.time = this.$data._lastTime + this.$data._lastPassed
      this.$emit('tick', {
        current: this.time
      })
    }, this.$data._tick)
  }
  _stop() {
    if (this.$data._handler == null) {
      return
    }
    this.$data._lastTime = this.$data._lastTime + Date.now() - this.$data._lastStarted
    this.$data._lastStarted = null
    this.$data._lastPassed = null
    clearInterval(this.$data._handler)
    this.$data._handler = null
  }
  _reset() {
    if (this.$data._handler != null) {
      this.$data._lastStarted = null
      this.$data._lastPassed = null
      clearInterval(this.$data._handler)
      this.$data._handler = null
    }
    this.time = 0
    this.$data._lastTime = 0
  }
}

var myMixin = new TimerMixin({
  start: "start",
  stop: "stop",
  reset: "reset",
  tick: 33
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
