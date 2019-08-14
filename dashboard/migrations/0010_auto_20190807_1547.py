# -*- coding: utf-8 -*-
# Generated by Django 1.11.23 on 2019-08-07 22:47
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0009_auto_20190731_1518'),
    ]

    operations = [
        migrations.CreateModel(
            name='DiscussionFlattened',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='Table Id')),
                ('topic_id', models.BigIntegerField(verbose_name='Discussion Topic Id')),
                ('entry_id', models.BigIntegerField(blank=True, null=True, verbose_name='Discussion Entry Id')),
                ('course_id', models.BigIntegerField(verbose_name='Course Id')),
                ('assignment_id', models.BigIntegerField(blank=True, null=True, verbose_name='Assignment Id')),
                ('group_id', models.BigIntegerField(blank=True, null=True, verbose_name='Group Id')),
                ('user_id', models.BigIntegerField(blank=True, null=True, verbose_name='User Id')),
                ('group_is_public', models.NullBooleanField(default=False, verbose_name='Group Is Public')),
                ('title', models.CharField(blank=True, default='', max_length=255, null=True, verbose_name='Title')),
                ('message', models.TextField(verbose_name='Message')),
                ('updated_at', models.DateTimeField(blank=True, null=True, verbose_name='Updated At')),
            ],
            options={
                'db_table': 'discussion_flattened',
            },
        ),
        migrations.CreateModel(
            name='GroupMembership',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, verbose_name='Table Id')),
                ('group_id', models.BigIntegerField(verbose_name='Group Id')),
                ('user_id', models.BigIntegerField(verbose_name='User Id')),
            ],
            options={
                'db_table': 'group_membership',
            },
        ),
        migrations.AlterUniqueTogether(
            name='groupmembership',
            unique_together=set([('group_id', 'user_id')]),
        ),
        migrations.AlterUniqueTogether(
            name='discussionflattened',
            unique_together=set([('topic_id', 'entry_id')]),
        ),
    ]
