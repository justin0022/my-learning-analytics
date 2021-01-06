import React, { useEffect, /* useState, */ useRef } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
// import PropTypes from 'prop-types'
import StyledTextField from '../StyledTextField'
import { roundToXDecimals, getDecimalPlaceOfFloat } from '../../util/math'
// import { calculateAssignmentGoalsFromCourseGoal } from '../../util/assignment'
// import debounce from 'lodash.debounce'

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
    handleGoalChange,
    // handleAssignmentGoalGrade,
    handleInputFocus,
    handleInputBlur,
    gradeKey
  } = props

  // Use decimal place of pointsPossible if it's a decimal; otherwise, round to nearest tenth
  const placeToRoundTo = pointsPossible => (String(pointsPossible).includes('.'))
    ? getDecimalPlaceOfFloat(pointsPossible) : 1

  const previousGrade = useRef(goalGrade)
  // const [goalGradeInternal, setGoalGradeInternal] = useState(roundToXDecimals(assignment.goalGrade, placeToRoundTo(assignment.pointsPossible)))
  // const debouncedGoalGrade = useRef(debounce(grade => {
  //   handleAssignmentGoalGrade(gradeKey, grade, previousGrade.current)
  //   previousGrade.current = grade
  // }, 500)).current

  useEffect(() => {
    previousGrade.current = goalGrade
  }, [goalGrade])

  // const updateGoalGradeInternal = (grade) => {
  //   const roundedGrade = roundToXDecimals(grade, placeToRoundTo(assignment.pointsPossible))
  //   debouncedGoalGrade(roundedGrade)
  //   setGoalGradeInternal(roundedGrade)
  // }

  // useEffect(() => {
  //   setGoalGradeInternal(assignment.goalGrade)
  // }, [assignment.goalGrade])

  return (
    <StyledTextField
      error={(goalGrade / pointsPossible) > 1}
      disabled={!enabled}
      id='standard-number'
      value={roundToXDecimals(goalGrade, placeToRoundTo(pointsPossible))}
      label={
        enabled ? 'Set a goal'
          : (goalGrade / pointsPossible) > 1
            ? 'Over 100%'
            : 'Set a goal'
      }
      onChange={event => {
        const assignmentGoalGrade = event.target.value
        handleGoalChange(id, assignmentGoalGrade, -1)
        // handleAssignmentGoalGrade(id, assignmentGoalGrade, -1)
        // updateGoalGradeInternal(assignmentGoalGrade)
      }}
      type='number'
      className={classes.goalGradeInput}
      onFocus={() => handleInputFocus(gradeKey)}
      onBlur={() => handleInputBlur(gradeKey)}
    />
  )
}

AssignmentGoalInput.propTypes = {
  id: PropTypes.string.isRequired,
  goalGrade: PropTypes.number,
  pointsPossible: PropTypes.number // seems like it should be required
}

AssignmentGoalInput.defaultProps = {}

export default withStyles(styles)(AssignmentGoalInput)
