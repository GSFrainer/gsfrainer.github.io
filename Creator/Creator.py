import json
from Utils.Thread import Thread
from Posts import Posts
from Index import Index
from Home import Home
from About import About

index = Index()
home = Home()
posts = Posts()
about = About()

data = dict()
with open('../Data/Profile.json', 'r') as profile:
    data.update(json.loads(profile.read()))

homeTh = Thread(target=home.createHome, args=(data,))
postsTh = Thread(target=posts.createPosts, args=(data,))
aboutTh = Thread(target=about.createAbout, args=(data,))

homeTh.start()
postsTh.start()
aboutTh.start()

pages = dict()
pages["Home"] = homeTh.join()
pages["Posts"] = postsTh.join()
pages["About"] = aboutTh.join()

index.createIndex(data, pages)

