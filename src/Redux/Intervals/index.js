import { createReducer, createActions } from 'reduxsauce'
import {
  randomInterval,
  intervalOptions,
  expandIntervalSets,
  setOf
} from 'lib/music'
import { playInterval } from 'lib/player'
import { append, filter, groupBy, map } from 'ramda'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/mapTo'

/* ------------- Initial State ------------- */

const INITIAL_STATE = {
  intervalRange: intervalOptions,
  interval: null,
  answer: null,
  ready: false,
  historic: []
}

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  setIntervalRange: ['intervalRange'],
  start: null,
  ready: null,
  replay: null,
  answer: ['answer'],
  stop: null
})

export default Creators

/* ------------- Reducers ------------- */

const setIntervalRange = (state, { intervalRange }) => ({
  ...state,
  intervalRange
})

const start = state => ({
  ...state,
  ready: false,
  answer: null,
  interval: randomInterval(state.intervalRange)
})

const answer = (state, { answer }) => ({
  ...state,
  answer,
  historic: append({ interval: state.interval, answer: answer }, state.historic)
})

const ready = state => ({ ...state, ready: true })

const stop = state => ({
  ...INITIAL_STATE,
  intervalRange: state.intervalRange
})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SET_INTERVAL_RANGE]: setIntervalRange,
  [Types.START]: start,
  [Types.ANSWER]: answer,
  [Types.READY]: ready,
  [Types.STOP]: stop
})

/* ------------- Epics ------------- */

export const epic = (action$, store) =>
  action$
    .ofType(Types.START, Types.REPLAY)
    .do(() => {
      playInterval(store.getState().intervals.interval)
    })
    .mapTo(Creators.ready())

/* ------------- Selectors ------------- */

export const expandSelectedIntervals = state =>
  expandIntervalSets(state.intervals.intervalRange, false)

export const progressStats = state => {
  const { historic } = state.intervals
  const answerOk = ({ interval, answer }) => answer === interval.name
  const intervalSet = ({ interval }) => setOf(interval.name)
  const stats = intervals => ({
    total: intervals.length,
    correct: filter(answerOk, intervals).length
  })
  return {
    ...stats(historic),
    byGroup: map(stats, groupBy(intervalSet, historic))
  }
}