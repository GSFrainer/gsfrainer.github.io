import json
from Activities import Activities
from Posts import Posts
from Index import Index

index = Index()
activities = Activities()
posts = Posts()

data = dict()
with open('../Data/Profile.json', 'r') as profile:
    data.update(json.loads(profile.read()))

index.createIndex(data, activities, posts)


