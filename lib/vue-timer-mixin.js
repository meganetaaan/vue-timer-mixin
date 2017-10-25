class TimerMixin { // eslint-disable-line no-unused-vars
  constructor (param) {
    const evNamesDict = {
      start: param.start,
      stop: param.stop,
      reset: param.reset
    }
    const tick = param.tick
    this.data = function () {
      return {
        _mode: 'countup',
        _evNamesDict: evNamesDict,
        time: 0,
        _lastTime: 0,
        _lastStarted: null,
        _lastPassed: null,
        _tick: tick,
        _handler: null
      }
    }
    this.created = this._created
    this.methods = {
      start: this._start,
      stop: this._stop,
      reset: this._reset
    }
  }
  _created () {
    ['reset', 'stop', 'start'].forEach(evKey => {
      if (this.$data._evNamesDict[evKey] != null) {
        let evNames = this.$data._evNamesDict[evKey]
        if (typeof evNames === 'string') {
          evNames = [evNames]
        }
        if (Array.isArray(evNames)) {
          evNames.forEach(evName => {
            this.$on(evName, function () {
              this[evKey].apply(this)
              this.$emit('timer' + evName, {
                time: this.time
              })
            })
          })
        }
      }
    })
  }
  _start () {
    if (this.$data._handler != null) {
      return
    }
    this.$data._lastStarted = Date.now()
    this.$data._lastPassed = 0
    this.$data._handler = setInterval(() => {
      this.$data._lastPassed = Date.now() - this.$data._lastStarted
      this.time = this.$data._lastTime + this.$data._lastPassed
      this.$emit('tick', {
        time: this.time
      })
    }, this.$data._tick)
  }
  _stop () {
    if (this.$data._handler == null) {
      return
    }
    this.$data._lastTime = this.$data._lastTime + Date.now() - this.$data._lastStarted
    this.$data._lastStarted = null
    this.$data._lastPassed = null
    clearInterval(this.$data._handler)
    this.$data._handler = null
  }
  _reset () {
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

export default TimerMixin
