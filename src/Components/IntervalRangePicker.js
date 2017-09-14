import React, { Component } from 'react'
import { PickerButton } from 'Components/Button'
import { intervalOptions } from 'lib/music'
import styled from 'styled-components'
import { without } from 'ramda'

const ButtonPanel = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: space-between;
`

const FieldContainer = styled.div`width: 90%;`

export default class IntervalPicker extends Component {
  render() {
    const { selected, onSelectRange } = this.props
    const isSelected = intervalSet => selected.includes(intervalSet)
    const clickHandler = intervalSet => () => {
      onSelectRange(
        isSelected(intervalSet)
          ? without([intervalSet], selected)
          : [...selected, intervalSet]
      )
    }

    return (
      <FieldContainer>
        <h2>Incluir intervalos de:</h2>
        <ButtonPanel>
          {intervalOptions.map(intervalSet => (
            <PickerButton
              color="black"
              key={intervalSet}
              onClick={clickHandler(intervalSet)}
              selected={isSelected(intervalSet)}
            >
              {intervalSet}
            </PickerButton>
          ))}
        </ButtonPanel>
      </FieldContainer>
    )
  }
}
