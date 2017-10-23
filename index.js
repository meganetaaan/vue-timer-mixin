class Timer {
  constructor(onTick) {
    this.id = "hoge";
    this.sec = 0;
    this.handler = null;
    this.onTick = onTick;
  }
  start() {
    if (this.handler != null) {
      return;
    }
    this.handler = setInterval(() => {
      this.onTick(this.sec++);
    }, 1000);
  }
  stop() {
    clearInterval(this.handler);
    this.handler = null;
  }
  reset() {
    this.stop();
    this.sec = 0;
    this.onTick(this.sec);
  }
}
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
        _evNamesDict: evNamesDict,
        timer: null,
        time: 0,
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
      if (this.timer == null) {
        this.timer = new Timer(time => {
          this.time = time;
        });
      }
      this.timer.start();
  }
  _pause() {}
  _resume() {}
  _stop() {
      if (this.timer != null) {
        this.timer.stop();
      }
  }
  _reset() {
      if (this.timer != null) {
        this.timer.reset();
      }
  }

  _data() {
    return {
      timer: null,
      time: 0
    };
  }
}

var myMixin = {
  created: function() {
    this.$on("start", this.onStart);
    this.$on("stop", this.onStop);
    this.$on("reset", this.onReset);
  },
  data: function() {
    timer: null;
    time: 0;
  },
  methods: {
    onStart: function() {
      if (this.timer == null) {
        this.timer = new Timer(time => {
          this.time = time;
        });
      }
      this.timer.start();
    },
    onStop: function() {
      if (this.timer != null) {
        this.timer.stop();
      }
    },
    onReset: function() {
      if (this.timer != null) {
        this.timer.reset();
      }
    }
  }
};

var myMixin2 = new TimerMixin({
  start: "start",
  stop: "stop",
  reset: "reset"
});

var app = new Vue({
  mixins: [myMixin2],
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
