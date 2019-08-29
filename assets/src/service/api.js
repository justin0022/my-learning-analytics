import useFetch from '../hooks/useFetch'

export const useGradeData = (currentCourseId) =>
  useFetch(`/api/v1/courses/${currentCourseId}/grade_distribution`)
export const useResourcesData = (courseId, weekStart, weekEnd, gradeFilter, resourceFilter) =>
  useFetch(`/api/v1/courses/${courseId}/resource_access_within_week?week_num_start=${weekStart}&week_num_end=${weekEnd}&grade=${gradeFilter}&resource_type=${resourceFilter}`)
export const useCourseInfo = (currentCourseId) =>
  useFetch(`/api/v1/courses/${currentCourseId}/info`)
export const useUserSettingData = (currentCourseId, type) =>
  useFetch(`/api/v1/courses/${currentCourseId}/get_user_default_selection?default_type=${type}`)
