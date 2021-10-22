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
            
        return ret
