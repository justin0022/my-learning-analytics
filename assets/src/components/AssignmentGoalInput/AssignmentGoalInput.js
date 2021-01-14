import React, { useEffect, useState, useRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import StyledTextField from '../StyledTextField'
import { roundGrade } from '../../util/math'
import debounce from 'lodash.debounce'

const styles = theme => ({
  goalGradeInput: {
    marginTop: 0,
    width: 100,
    marginBottom: '10px'
  }
})

function AssignmentGoalInput (props) {
  const {
    classes,
    id,
    goalGrade,
    pointsPossible,
    enabled,
    handleGoalChange
  } = props

  const previousGrade = useRef(goalGrade)
  const [goalGradeinternal, setGoalGradeInternal] = useState(goalGrade ?? '')

  const debounceGoalChange = debounce(grade => {
    handleGoalChange(id, grade, previousGrade.current)
  }, 500)

  useEffect(() => {
    previousGrade.current = goalGrade
  }, [goalGrade])

  useEffect(() => {
    setGoalGradeInternal(roundGrade(goalGradeinternal, pointsPossible))
  }, [goalGrade, pointsPossible])

  return (
    <StyledTextField
      error={(goalGrade / pointsPossible) > 1}
      disabled={!enabled}
      id='standard-number'
      value={goalGradeinternal}
      label={
        enabled ? 'Set a goal'
          : (goalGrade / pointsPossible) > 1
            ? 'Over 100%'
            : 'Set a goal'
      }
      onChange={event => {
        const assignmentGoalGrade = event.target.value
        setGoalGradeInternal(assignmentGoalGrade)
        debounceGoalChange(assignmentGoalGrade)
      }}
      type='number'
      className={classes.goalGradeInput}
    />
  )
}

AssignmentGoalInput.propTypes = {
  id: PropTypes.string.isRequired,
  goalGrade: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  pointsPossible: PropTypes.number // seems like it should be required
}

AssignmentGoalInput.defaultProps = {}

export default withStyles(styles)(AssignmentGoalInput)
