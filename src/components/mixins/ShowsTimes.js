import moment from 'moment';
import config from 'v-calendar-scheduler/utils/config';

export default {
  props: {
    timeRange: {
      type: Array,
      required: true,
    },
    showTimeMarker: {
      type: Boolean
    },
    allDayLabel: {
      type: String,
      default: () => config.labels.all_day
    }
  },
  data() {
    return {
      now: moment(new Date())
    }
  },
  computed: {
    times() {
      let times = [];

      for ( let i = 7; i < 18; i = i + 0.501 ) {
        const momentTime = moment(i, 'HH:mm');
        times.push(momentTime);
      }
      console.log(times)

      return times;
    },
    hourClass() {
      const minutes = Math.round(this.now.minutes() / 10) * 10;
      return this.showTimeMarker ? 'has-marker is-' + minutes : '';
    }
  },
}
