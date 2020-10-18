from string import Template
import json
import Utils.Templates as Templates

class Index:
    
    def createIndex(self, dataDict, pages):
        templates = Templates.getTemplates("Index")
        scripts = ""
        dynamicScripts = ""
        navItems = ""
        navTabs = ""
        for name, page in pages.items():
            navItems += (Template(templates['NavItemTemplate'])).safe_substitute({"NavItem":name, "TabName":name})
            tab = templates["NavTabTemplate"].replace("${NavItem}", name)
            navTabs += tab.replace("${TabContent}", page['content'])
            if "scripts" in page:
                for sc in page["scripts"]:
                    scripts += templates["ScriptTemplate"].replace("${Script}",sc)
            if "dynamicScripts" in page:
                dynamicScripts += '"'+name+'":['
                for sc in page["dynamicScripts"]:
                    dynamicScripts += '"./JS/'+sc+'"'
                dynamicScripts += '], '
        
        with open("../Pages/Index.html", 'r') as file:
            result = file.read()
            result = result.replace("${Scripts}", scripts, 1)
            result = result.replace("${DynamicScripts}", dynamicScripts, 1)
            result = result.replace("${navItems}", navItems, 1)
            result = result.replace("${navTabs}", navTabs, 1)
            result = (Template(result)).safe_substitute(dataDict)
            generated = open('../Index.html', 'w')
            generated.write(result)
            generated.close()
        return