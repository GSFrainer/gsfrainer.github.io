import json
from Activities import Activities
from Posts import Posts
from Index import Index
from Home import Home
from About import About

index = Index()
home = Home()
activities = Activities()
about = About()

data = dict()
with open('../Data/Profile.json', 'r') as profile:
    data.update(json.loads(profile.read()))

pages = dict()
pages.update({"Home":home.createHome(data), "Activities": activities.createActivities(data), "About": about.createAbout(data)})

index.createIndex(data, pages)

