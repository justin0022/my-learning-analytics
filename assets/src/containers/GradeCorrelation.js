import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import AlertBanner from '../components/AlertBanner'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import WarningBanner from '../components/WarningBanner'
import Typography from '@material-ui/core/Typography'
import Scatterplot from '../components/Scatterplot'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 8
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary
  },
  table: {
    width: '300px'
  }
})

const data = {
  data: {
    course: {
      assignments: [
        {
          id: '17700000000447605',
          name: 'Random assignment 1',
          pointsPossible: 50,
          currentSubmissions: [
            {
              userId: '17700000000475149',
              name: 'Robert Thompson',
              score: 30
            },
            {
              userId: '17700000000609566',
              name: 'Allison Montgomery',
              score: 45
            },
            {
              userId: '17700000000623036',
              name: 'Samuel Buchanan',
              score: 25
            }
          ]
        },
        {
          id: '17700000000447675',
          name: 'Random assignment 2',
          pointsPossible: 70,
          currentSubmissions: [
            {
              userId: '17700000000475149',
              name: 'Robert Thompson',
              score: 65
            },
            {
              userId: '17700000000609566',
              name: 'Allison Montgomery',
              score: 54
            },
            {
              userId: '17700000000623036',
              name: 'Samuel Buchanan',
              score: 47
            }
          ]
        },
        {
          id: '17700000000447676',
          name: 'Random assignment 3',
          pointsPossible: 70,
          currentSubmissions: [
            {
              userId: '17700000000475149',
              name: 'Robert Thompson',
              score: 65
            },
            {
              userId: '17700000000609566',
              name: 'Allison Montgomery',
              score: 54
            },
            {
              userId: '17700000000623036',
              name: 'Samuel Buchanan',
              score: 47
            }
          ]
        }
      ]
    }
  }
}

const getAssignmentById = (assignments, id) => assignments.filter(a => a.id === id)

function GradeCorrelation (props) {
  const { classes, disabled, courseId } = props
  if (disabled) return (<AlertBanner>The Grade Correlation view is hidden for this course.</AlertBanner>)
  const assignments = data.data.course.assignments.map(a => ({ name: a.name, id: a.id }))
  const scatterplotData = data.data.course.assignments.map(a => a.currentSubmissions.map(({ score }) => score))

  // console.log(scatterplotData)

  const [xAxisAssignmentId, setXAxisAssignmentId] = useState(assignments[0].id)
  const [yAxisAssignmentId, setYAxisAssignmentId] = useState(assignments[1].id)

  const [xAxisAssignment, setXAxisAssignment] = useState(null)
  const [yAxisAssignment, setYAxisAssignment] = useState(null)

  useEffect(() => {
    setXAxisAssignment(
      getAssignmentById(data.data.course.assignments, xAxisAssignmentId)
    )
  }, [xAxisAssignmentId])

  useEffect(() => {
    setYAxisAssignment(
      getAssignmentById(data.data.course.assignments, yAxisAssignmentId)
    )
  }, [yAxisAssignmentId])

  console.log(xAxisAssignment, yAxisAssignment)

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant='h5' gutterBottom>Grade Correlation</Typography>
            <FormControl className={classes.formControl}>
              <InputLabel>Select Assignment</InputLabel>
              <Select
                value={xAxisAssignmentId}
                onChange={event => setXAxisAssignmentId(event.target.value)}
              >
                {assignments.map((a, i) => (
                  <MenuItem value={a.id} key={i}>{a.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel>Select Assignment</InputLabel>
              <Select
                value={yAxisAssignmentId}
                onChange={event => setYAxisAssignmentId(event.target.value)}
              >
                {assignments.map((a, i) => (
                  <MenuItem value={a.id} key={i}>{a.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <Scatterplot
              data={}
            /> */}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(GradeCorrelation)
