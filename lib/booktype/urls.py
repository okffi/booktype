# This file is part of Booktype.
# Copyright (c) 2012 Aleksandar Erkalovic <aleksandar.erkalovic@sourcefabric.org>
#
# Booktype is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Booktype is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with Booktype.  If not, see <http://www.gnu.org/licenses/>.

from django.conf.urls import patterns, url, include
from django.conf import settings
from django.views.generic.base import TemplateView

from booktype.apps.reader.api import BookResource
from booktype.apps.reader.api import ChapterResource


SPUTNIK_DISPATCHER = ((r'^/booki/$', 'booki.channels.main'),
                      (r'^/booki/profile/(?P<profileid>.+)/$', 'booki.channels.profile'),
                      (r'^/chat/(?P<bookid>\d+)/$', 'booki.channels.chat'),
                      (r'^/booktype/book/(?P<bookid>\d+)/(?P<version>[\w\d\.\-.]+)/$', 'booktype.apps.edit.channel')
                      )

book_resource = BookResource()
chapter_resource = ChapterResource()

urlpatterns = patterns(
    '',

    url(r'', include('booktype.apps.portal.urls', namespace="portal")),
    url(r'^accounts/', include('booktype.apps.account.urls', namespace="accounts")),

    # booktype control center
    url(r'^_control/', include('booktypecontrol.urls', namespace="control_center")),

    # convert
    # TODO: Add namespace
    url(r'^_convert/', include('booktype.apps.convert.urls')),

    (r'^data/(?P<path>.*)$', 'django.views.static.serve',
        {'document_root': settings.DATA_ROOT, 'show_indexes': True}),

    url(r'^_utils/profilethumb/(?P<profileid>[\w\d\_\.\-]+)/thumbnail.jpg$', 'booktype.apps.account.views.profilethumbnail', name='view_profilethumbnail'),

    # sputnik dispatcher
    url(r'^_sputnik/$', 'sputnik.views.dispatcher', {"map": SPUTNIK_DISPATCHER}, name='sputnik_dispatcher'),

    # TODO: Add namespace
    url(r'^importer/', include('booktype.apps.importer.urls')),

    # TODO; Add namespace
    url(r'^(?P<bookid>[\w\s\_\.\-\d]+)/', include('booktype.apps.loadsave.urls')),

    # new editor
    url(r'^(?P<bookid>[\w\s\_\.\-\d]+)/', include('booktype.apps.edit.urls', namespace='edit')),

    # old editor app
    url(r'^(?P<bookid>[\w\s\_\.\-\d]+)/', include('booki.editor.urls')),

    # robots.txt
    (r'^robots\.txt$', TemplateView.as_view(template_name='robots.txt', content_type='text/plain')),

    # search
    (r'^search/', include('haystack.urls')),

    # new booktype reader app
    url(r'^(?P<bookid>[\w\s\_\.\-\d]+)/', include('booktype.apps.reader.urls', namespace='reader')),

    # comments
    (r'^comments/', include('django.contrib.comments.urls')),

    # social auth                                                
    url('', include('social.apps.django_app.urls', namespace='social')),
   
    # tastypie
    (r'^api/', include(book_resource.urls)),
    (r'^api/', include(chapter_resource.urls)),
    url(r'^messaging/', include('booki.messaging.urls')),
)
