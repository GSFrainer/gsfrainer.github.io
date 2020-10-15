from string import Template
import json

class Home:
    
    def createHome(self, dataDict):
        ret = dict()
        with open('../Pages/Home.html', 'r') as file:
            content = file.read()
            ret["content"] = (Template(content)).safe_substitute(dataDict)
            ret['script'] = "Home.js"
        return ret
