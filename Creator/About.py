from string import Template
import json

class About:
    
    def createAbout(self, dataDict):
        ret = dict()
        with open('../Pages/About.html', 'r') as file:
            content = file.read()
            ret["content"] = (Template(content)).safe_substitute(dataDict)
        return ret
