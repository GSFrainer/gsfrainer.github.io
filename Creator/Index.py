from string import Template
import json

class Index:
    def __init__(self):
        self.title = ""

    def createIndex(self, data, activities, posts):
        content = ""
        data['page'] = self.title
        data['ActivitiesContent'] = activities.getActivitiesContent()
        data['PostsContent'] = posts.getPostsContent()

        with open('../Template/Index.html', 'r') as file:
            indexDict = dict()
            indexDict.update(data)
            content = file.read()
        
        with open("../Template/Template.html", 'r') as template:
            result = template.read()
            result = result.replace("${Content}", content, 1)
            result = (Template(result)).safe_substitute(indexDict)
            generated = open('../Generated/Index.html', 'w')
            generated.write(result)
            generated.close()
        

        