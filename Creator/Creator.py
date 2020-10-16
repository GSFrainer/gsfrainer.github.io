import json
from Utils.Thread import Thread
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

homeTh = Thread(target=home.createHome, args=(data,))
activitiesTh = Thread(target=activities.createActivities, args=(data,))
aboutTh = Thread(target=about.createAbout, args=(data,))

homeTh.start()
activitiesTh.start()
aboutTh.start()

pages = dict()
pages["Home"] = homeTh.join()
pages["Activities"] = activitiesTh.join()
pages["About"] = aboutTh.join()

index.createIndex(data, pages)

