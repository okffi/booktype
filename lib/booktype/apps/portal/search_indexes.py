import datetime
from haystack import indexes
from booki.editor.models import Book, BookHistory, BookToc, Chapter

class ChapterIndex(indexes.SearchIndex, indexes.Indexable):
    text = indexes.CharField(document=True, use_template=True)

    def get_model(self):
        return Chapter

