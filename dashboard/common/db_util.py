# Some utility functions used by other classes in this project

import django
import logging
import re
from datetime import datetime
from dateutil.parser import parse

from django_cron.models import CronJobLog
from dashboard.models import Course

from django.conf import settings

logger = logging.getLogger(__name__)

def canvas_id_to_prefixed_id(canvas_id):
    """
    Insert the Canvas ID into the beginging of the DATA_WAREHOUSE_ID_TEMPLATE string
    Ex: if DATA_WAREHOUSE_ID_TEMPLATE=11000000 and the Canvas ID = 999 then the prefixed_id will be 11000999
    """
    canvas_id = str(canvas_id)
    prefixed_id = str(settings.DATA_WAREHOUSE_ID_TEMPLATE)[0:-len(canvas_id)] + canvas_id
    return prefixed_id

def prefixed_id_to_canvas_id(prefixed_id):
    """
    Remove the prefix from prefix_id to get the original Canvas ID
    Ex: if the prefixed_id is 11000999 and DATA_WAREHOUSE_ID_TEMPLATE=11000000
    then first remove the trailing zeros from DATA_WAREHOUSE_ID_TEMPLATE to get prefix `11`
    then remove the prefix `11` from the prefixed_id getting `000999`
    finally remove the leading zeros from `000999` getting `999` (the expected Canvas ID)
    """
    prefixed_id = str(prefixed_id)
    prefix = re.sub('0+$', '', prefixed_id)
    canvas_id = re.sub('^0+', '', prefixed_id.replace(prefix, ''))
    return canvas_id

def get_course_name_from_id(course_id):
    """[Get the long course name from the id]

    :param course_id: [Canvas course ID without DATA_WAREHOUSE PREFIX]
    :type course_id: [str]
    :return: [Course Name of course or blank not found]
    :rtype: [str]
    """
    logger.info(get_course_name_from_id.__name__)
    course_id = canvas_id_to_prefixed_id(course_id)
    course_name = ""
    if (course_id):
        with django.db.connection.cursor() as cursor:
            cursor.execute("SELECT name FROM course WHERE id = %s", [course_id])
            row = cursor.fetchone()
            if (row != None):
                course_name = row[0]
    return course_name

def get_course_view_options (course_id):

    logger.info(get_course_view_options.__name__)
    course_id = canvas_id_to_prefixed_id(course_id)
    logger.debug("course_id=" + str(course_id))
    course_view_option = ""
    if (course_id):
        with django.db.connection.cursor() as cursor:
            cursor.execute("SELECT show_files_accessed, show_assignment_planning, show_grade_distribution FROM course_view_option WHERE course_id = %s", [course_id])
            row = cursor.fetchone()
            if (row != None):
                course_view_option = {}
                course_view_option['show_files_accessed'] = settings.ENABLE_FILES_ACCESSED and row[0]
                course_view_option['show_assignment_planning'] = settings.ENABLE_ASSIGNMENT_PLANNING and row[1]
                course_view_option['show_grade_distribution'] = settings.ENABLE_GRADE_DISTRIBUTION and row[2]
    return course_view_option

def get_default_user_course_id(user_id):
    """[Get the default course id for the user id from the user table]
    :param user_id: [SIS User ID of the user]
    :type user_id: [str]
    :return: [Canvas Course ID]
    :rtype: [str]
    """
    logger.info(get_default_user_course_id.__name__)
    course_id = ""
    with django.db.connection.cursor() as cursor:
        cursor.execute("SELECT course_id FROM user WHERE sis_name= %s ORDER BY course_id DESC LIMIT 1", [user_id])
        row = cursor.fetchone()
        if (row != None):
            course_id = canvas_id_to_prefixed_id(row[0])
    return course_id

def get_last_cron_run():
    try:
        c = CronJobLog.objects.filter(is_success=1).latest('end_time')
        end_time = c.end_time
        return end_time
    except CronJobLog.DoesNotExist:
        logger.info("CronJobLog did not exist", exc_info = True)
    return datetime.min

def get_canvas_data_date():
    if not settings.DATA_WAREHOUSE_IS_UNIZIN:
        return get_last_cron_run()

    try:
        with django.db.connection.cursor() as cursor:
            cursor.execute("SELECT pvalue from unizin_metadata where pkey = 'canvasdatadate'")
            row = cursor.fetchone()
            if (row != None):
                date = parse(row[0])
                return date
    except Exception:
        logger.info("Value could not be found from metadata", exc_info = True)
    return datetime.min