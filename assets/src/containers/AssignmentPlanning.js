import React, { useEffect, useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Spinner from '../components/Spinner'
import Typography from '@material-ui/core/Typography'
import Select from '@material-ui/core/Select'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import ProgressBar from '../components/ProgressBar'
import TableAssignment from '../components/TableAssignment'
import Checkbox from '@material-ui/core/Checkbox'
import UserSettingSnackbar from '../components/UserSettingSnackbar'
import Error from './Error'
import { getCurrentWeek } from '../util/data'
import { useAssignmentData } from '../service/api'
import { isObjectEmpty } from '../util/object'
import useUserSetting from '../hooks/useUserSetting'
import useSetUserSetting from '../hooks/useSetUserSetting'
import { AssignmentPlanningTooltip } from '../components/Tooltip'

const styles = theme => ({
  root: {
    flexGrow: 1,
    padding: 8
  },
  paper: {
    padding: theme.spacing.unit * 2,
    color: theme.palette.text.secondary
  },
  graded: {
    width: '10px',
    height: '10px',
    background: 'lightskyblue',
    display: 'inline-block'
  },
  ungraded: {
    width: '10px',
    height: '10px',
    background: 'gray',
    display: 'inline-block'
  }
})

const currentSetting = 'My current setting'
const rememberSetting = 'Remember my setting'
const settingNotUpdated = 'Setting not updated'

const assignmentTable = assignmentData => {
  if (!assignmentData || Object.keys(assignmentData).length === 0) {
    return (<Typography>No data provided</Typography>)
  }
  return <TableAssignment
    tableHead={['Week', 'Due', 'Title', 'Percent of final grade']}
    tableData={assignmentData}
    currentWeek={getCurrentWeek(assignmentData)}
  />
}

function AssignmentPlanning (props) {
  const { classes, disabled, courseId } = props
  if (disabled) return (<Error>Assignment view is hidden for this course.</Error>)

  const [showSaveSetting, setShowSaveSetting] = useState(false)
  const [saveSettingClicked, setSaveSettingClicked] = useState(false)

  const [assignmentGradeFilter, setAssignmentGradeFilter] = useState(0)
  const [userSavedFilterSetting, setUserSavedFilterSetting] = useState(assignmentGradeFilter)
  const [userSettingLoaded, userSetting] = useUserSetting(courseId, 'assignment')
  const [assignmentLoaded, assignmentError, assignmentData] = useAssignmentData(courseId, assignmentGradeFilter, !userSettingLoaded)
  const [saveLabel, setSaveLabel] = useState(currentSetting)

  const [userSettingSaved, savingError, userSettingResponse] = useSetUserSetting(
    courseId,
    { assignment: assignmentGradeFilter },
    userSavedFilterSetting !== assignmentGradeFilter && saveSettingClicked,
    [saveSettingClicked]
  )

  useEffect(() => {
    if (userSettingLoaded) {
      if (isObjectEmpty(userSetting.default)) {
        setAssignmentGradeFilter(0)
      } else {
        setAssignmentGradeFilter(Number(userSetting.default))
        setUserSavedFilterSetting(Number(userSetting.default))
      }
    }
  }, [userSettingLoaded])

  useEffect(() => {
    // if user setting is different from current grade filter, show label for remembering setting
    if (userSavedFilterSetting !== assignmentGradeFilter) {
      setSaveLabel(rememberSetting)
    } else if (savingError) {
      setSaveLabel(settingNotUpdated)
    } else {
      setSaveLabel(currentSetting)
    }
  })

  // if user setting is saved, don't show checkbox and sync userSavedFilterSetting with assignmentGradeFilter
  useEffect(() => {
    if (userSettingSaved) {
      setShowSaveSetting(false)
      setUserSavedFilterSetting(assignmentGradeFilter)
    }
  }, [userSettingSaved])

  const handleAssignmentFilter = event => {
    const value = event.target.value
    setAssignmentGradeFilter(value)

    if (userSavedFilterSetting !== value) {
      setSaveSettingClicked(false)
      setShowSaveSetting(true)
    } else {
      setShowSaveSetting(false)
    }
  }

  if (assignmentError) return (<Error>Something went wrong, please try again later.</Error>)
  if (assignmentLoaded && isObjectEmpty(assignmentData)) return (<Error>No data provided.</Error>)

  return (
    <div className={classes.root}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <>
              <Typography variant='h5' gutterBottom>Progress toward Final Grade</Typography>
              {assignmentData
                ? <ProgressBar
                  data={assignmentData.progress}
                  aspectRatio={0.12}
                  tip={AssignmentPlanningTooltip(classes)} />
                : <Spinner />}
            </ >
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.paper}>
            <Grid container>
              <Grid item xs={12} md={10}>
                <Typography variant='h5' gutterBottom>Assignments Due by Date</Typography>
              </Grid>
              <Grid item xs={12} md={2}>
                <Typography variant='h6'>Assignment Status</Typography>
                <div className={classes.graded} />
                <Typography style={{ display: 'inline' }}> Graded</Typography>
                <br />
                <div className={classes.ungraded} />
                <Typography style={{ display: 'inline' }}> Not Yet Graded</Typography>
                <br />
              </Grid>
            </Grid>
            <FormControl>
              <Typography>Show assignments that weigh at least</Typography>
              <div style={{ display: 'flex' }}>
                <Select
                  value={assignmentGradeFilter}
                  onChange={handleAssignmentFilter}
                >
                  <MenuItem value={0}>0% (all)</MenuItem>
                  <MenuItem value={2}>2%</MenuItem>
                  <MenuItem value={5}>5%</MenuItem>
                  <MenuItem value={10}>10%</MenuItem>
                  <MenuItem value={20}>20%</MenuItem>
                  <MenuItem value={50}>50%</MenuItem>
                  <MenuItem value={75}>75%</MenuItem>
                </Select>
                {showSaveSetting
                  ? <Checkbox
                    checked={saveSettingClicked}
                    onChange={() => setSaveSettingClicked(!saveSettingClicked)}
                    value='checked'
                    color='primary'
                  />
                  : null
                }
                <div style={{ padding: '15px 2px' }}>{saveLabel}</div>
              </div>
            </FormControl>
            <UserSettingSnackbar
              saved={userSettingSaved}
              response={userSettingResponse}
              successMessage={'Assignment filter setting saved!'} />
            { /* in case of no data empty list is sent */}
            {assignmentLoaded ? assignmentTable(assignmentData.plan) : <Spinner />}
          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default withStyles(styles)(AssignmentPlanning)
