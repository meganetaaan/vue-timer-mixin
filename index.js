import Vue from 'vue'
import TimerMixin from './lib/vue-timer-mixin.js'
var myMixin = new TimerMixin({
  start: 'start',
  stop: 'stop',
  reset: 'reset',
  tick: 33
})

var app = new Vue({
  mixins: [myMixin],
  name: 'World',
  el: '#app',
  template: `
      <div class="app">
        <div class="greeting">{{greeting}}</div>
        <div class="time">{{time}}</div>
        <input type="button" value="start" @click="onClickStart">
        <input type="button" value="stop" @click="onClickStop">
        <input type="button" value="reset" @click="onClickReset">
      </div>
      `,
  data: function () {
    return {
      greeting: 'hello world!',
      time: null
    }
  },
  methods: {
    onClickStart: function () {
      this.$emit('start')
    },
    onClickStop: function () {
      this.$emit('stop')
    },
    onClickReset: function () {
      this.$emit('reset')
    }
  }
})

console.debug(app)
