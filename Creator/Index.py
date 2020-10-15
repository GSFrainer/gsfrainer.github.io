from string import Template
import json

class Index:
    
    def createIndex(self, dataDict, pages):
        navItem = """<li class="nav-item"><a class="nav-link btn btn-outline-secondary mx-1" id="pills-${navItem}-tab" data-toggle="pill" href="#${navItem}" role="tab" aria-controls="${navItem}" aria-selected="true">${tabName}</a> </li>"""
        navTab = """<div class="tab-pane fade" id="${navItem}" role="tabpanel" aria-labelledby="pills-${navItem}-tab">
                        ${tabContent}
                    </div>"""
        scripts = ""
        navItems = ""
        navTabs = ""
        for name, page in pages.items():
            navItems += (Template(navItem)).safe_substitute({"navItem":name, "tabName":name})
            tab = navTab.replace("${navItem}", name)
            navTabs += tab.replace("${tabContent}", page['content'])
            if "script" in page:
                scripts += '<script src="./JS/'+page["script"]+'"></script>'
        
        with open("../Pages/Index.html", 'r') as file:
            result = file.read()
            result = result.replace("${Scripts}", scripts, 1)
            result = result.replace("${navItems}", navItems, 1)
            result = result.replace("${navTabs}", navTabs, 1)
            result = (Template(result)).safe_substitute(dataDict)
            generated = open('../Index.html', 'w')
            generated.write(result)
            generated.close()
        return