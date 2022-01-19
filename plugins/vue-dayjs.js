import dayjs from 'dayjs'

import relativeTime from 'dayjs/plugin/relativeTime'
import duration from 'dayjs/plugin/duration'

import 'dayjs/locale/fr'

dayjs.locale('fr')

dayjs.extend(duration)
dayjs.extend(relativeTime, {
  rounding: Math.floor,
  thresholds: [
    { l: 's', r: 1 },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 29, d: 'day' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y' },
    { l: 'yy', d: 'year' },
  ],
})

export default (context, inject) => {
  context.$dayjs = dayjs
  inject('dayjs', dayjs)
}
