from string import Template
import json
import Utils.Templates as Templates

class Posts:
    def __init__(self):
        self.title = " - Posts"
    
    def createPosts(self, dataDict):
        ret = dict()
        with open('../Pages/Posts.html', 'r') as file:
            content = file.read()
            ret["content"] = (Template(content)).safe_substitute(dataDict)
            with open("../Templates/Scripts/PostsTemplate.js") as s:
                script = s.read()
                
                #Add tags information on script
                with open("../Data/Tags.json", "r") as tags:
                    script = script.replace("${TagsData}", tags.read())

                #Add Posts objects templates on script
                templates = Templates.getTemplates("Posts")
                for template in templates:
                    script = script.replace("${"+template+"}", templates[template])
                script = (Template(script)).safe_substitute(dataDict)

                #Save generated script
                with open("../JS/Posts.js", 'w') as generated:
                    generated.write(script)

                #Add script to the scripts list
                ret['dynamicScripts'] = ["Posts.js"]
        return ret