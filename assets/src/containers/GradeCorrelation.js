import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import AlertBanner from '../components/AlertBanner'
import WarningBanner from '../components/WarningBanner'
import Typography from '@material-ui/core/Typography'

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
        }
      ]
    }
  }
}

function GradeCorrelation (props) {
  const { classes, disabled, courseId } = props
  if (disabled) return (<AlertBanner>The Grade Correlation view is hidden for this course.</AlertBanner>)

  return (
    <div className={classes.root}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Typography variant='h5' gutterBottom>Grade Correlation</Typography>

          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(GradeCorrelation)
