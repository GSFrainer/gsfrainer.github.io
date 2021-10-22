import os

def getTemplates(dir):
    templates = dict()
    if not os.path.isdir("../Templates/"+dir+"/"):
        return templates
    for temp in [temp for temp in os.listdir("../Templates/"+dir+"/") if temp.endswith(".html")]:
        with open("../Templates/"+dir+"/"+temp, 'r') as template:
            templates[temp[0:temp.find('.')]] = template.read()
    return templates