from tastypie.resources import ModelResource
from booki.editor.models import Book
from booki.editor.models import Chapter

class BookResource(ModelResource):
    class Meta:
        queryset = Book.objects.all()
        resource_name = 'book'

class ChapterResource(ModelResource):
    class Meta:
        queryset = Chapter.objects.all()
        resource_name = 'chapter'

