import { createReducer, createActions } from 'reduxsauce'
import { randomInterval, intervalOptions, expandIntervalSets } from 'lib/music'
import { playInterval } from 'lib/player'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/mapTo'

/* ------------- Initial State ------------- */

const INITIAL_STATE = {
  intervalRange: intervalOptions,
  interval: null,
  answer: null,
  ready: false
}

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  start: null,
  ready: null,
  replay: null,
  answer: ['answer']
})

export default Creators

/* ------------- Reducers ------------- */

const start = state => ({
  ...state,
  interval: randomInterval(state.intervalRange),
  answer: null,
  ready: false
})

const answer = (state, { answer }) => ({ ...state, answer, ready: false })

const ready = state => ({ ...state, ready: true })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.START]: start,
  [Types.ANSWER]: answer,
  [Types.READY]: ready
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