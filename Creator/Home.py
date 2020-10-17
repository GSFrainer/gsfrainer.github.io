from string import Template
import json
import Utils.Templates as Templates

class Home:
    
    def createHome(self, dataDict):
        ret = dict()
        with open('../Pages/Home.html', 'r') as file:
            content = file.read()
            ret["content"] = (Template(content)).safe_substitute(dataDict)
            with open("../Templates/Scripts/HomeTemplate.js") as s:
                ret['script'] = "Home.js"
                templates = Templates.getTemplates("Home")
                script = s.read()
                with open("../Data/Tags.json", "r") as tags:
                    script = script.replace("${TagsData}", tags.read())
                for template in templates:
                    script = script.replace("${"+template+"}", templates[template])
                script = (Template(script)).safe_substitute(dataDict)
                with open("../JS/Home.js", 'w') as generated:
                    generated.write(script)
        return ret
