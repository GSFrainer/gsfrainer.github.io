from string import Template
import json
import Utils.Templates as Templates

class Home:
    
    #Create Home page
    def createHome(self, dataDict):
        ret = dict()

        #Open a base Home page
        with open('../Pages/Home.html', 'r') as file:
            content = file.read()
            ret["content"] = (Template(content)).safe_substitute(dataDict)

            #Open a Home script template
            with open("../Templates/Scripts/HomeTemplate.js") as s:
                script = s.read()

                #Add tags information on script
                with open("../Data/Tags.json", "r") as tags:
                    script = script.replace("${TagsData}", tags.read())

                #Add Home objects templates on script
                templates = Templates.getTemplates("Home")
                for template in templates:
                    script = script.replace("${"+template+"}", templates[template])
                script = (Template(script)).safe_substitute(dataDict)

                #Save generated script
                with open("../JS/Home.js", 'w') as generated:
                    generated.write(script)
                    
                #Add script to the scripts list
                ret['scripts'] = ["Home.js"]
        return ret
