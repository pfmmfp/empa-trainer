import React, { Component } from 'react'
import Button from 'Components/Button'
import styled from 'styled-components'
import Icon from 'react-fontawesome'
import { props, fromProps } from 'tonal-interval'
import { pick, none, isNil, values } from 'ramda'
import { quality } from 'lib/music'

const IntervalPickerContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-content: space-between;
  width: 80%;
`
const IntervalsContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
  flex-grow: 3;
  align-items: center;
  justify-content: center;
`

const DirectionContainer = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  justify-content: center;
`

const IntervalButton = Button.extend`
  width: 15vw;
  height: 15vw;
  margin: 1vw;
  font-size: 5vw;
`

export default class IntervalPicker extends Component {
  state = { num: null, alt: null, dir: null }

  setQuality = quality => {
    this.setState(pick(['num', 'alt'], props(quality)))
  }

  setDirection = dir => {
    this.setState({ dir })
  }

  stateComplete = () => none(isNil, values(this.state))

  componentDidUpdate() {
    console.log(this.state)
    if (this.stateComplete()) {
      this.props.onIntervalSelected(fromProps(this.state))
    }
  }

  render() {
    const { possibleIntervals } = this.props
    return (
      <IntervalPickerContainer>
        <IntervalsContainer>
          {possibleIntervals.map(interval => (
            <IntervalButton
              color="darkblue"
              key={interval}
              onClick={() => this.setQuality(interval)}
              selected={interval === quality(this.state)}
            >
              {interval}
            </IntervalButton>
          ))}
        </IntervalsContainer>
        <DirectionContainer>
          <IntervalButton
            color="orange"
            selected={this.state.dir === 1}
            onClick={() => this.setDirection(1)}
          >
            <Icon name="arrow-up" />
          </IntervalButton>
          <IntervalButton
            color="orange"
            selected={this.state.dir === -1}
            onClick={() => this.setDirection(-1)}
          >
            <Icon name="arrow-down" />
          </IntervalButton>
        </DirectionContainer>
      </IntervalPickerContainer>
    )
  }
}