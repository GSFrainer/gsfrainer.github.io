//Templates
var postTemplate = `${PostTemplate}`;
var tagTemplate = `${TagTemplate}`;
var languageTemplate = `${LanguageTemplate}`;
var tagsData = ${TagsData};
var postsList;

listPosts();

//Request - List Posts
function listPosts() {
    fetch(new Request("https://api.github.com/users/${github}/repos?type=public&sort=created"))
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
        })
        .then(response => {
            let posts = new Array((response.length > limitPosts ? limitPosts : response.length));
            let promises = new Array(posts.length * 2);

            for (let i = 0; i < posts.length; i++) {
                posts[i] = {
                    name: response[i].name,
                    updated_at: response[i].updated_at,
                    created_at: response[i].created_at,
                    description: response[i].description,
                    tags: "",
                    languages: "",
                    link: response[i].html_url
                };
                promises[i] = getLanguages(response[i].languages_url, posts[i]);
                promises[promises.length + i] = getInternalTags("https://raw.githubusercontent.com/" + response[i].full_name + "/" + response[i].default_branch + "/InternalTags.json", posts[i]);
            }

            Promise.all(promises).then(results => {
                let post;
                postsList = posts;
                document.getElementById("postsList").innerHTML = "";
                posts.forEach(p => {
                    post = postTemplate;
                    post = post.replace("{name}", p.name);
                    post = post.replace("{createdAt}", (new Date(p.created_at)).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' }));
                    post = post.replace("{updatedAt}", (new Date(p.updated_at)).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' }));
                    post = post.replace("{description}", p.description);
                    post = post.replace("{tags}", p.tags);
                    post = post.replace("{languages}", p.languages);
                    post = post.replaceAll("{link}", p.link);
                    document.getElementById("postsList").innerHTML += post;
                });
            });
        }).catch(error => {
            console.error(error);
        });
}

function getInternalTags(tagsURL, p) {
    fetch(new Request(tagsURL)).then(result => {
        if (result.status === 200) {
            return result.json();
        }
        throw new Error("404");
    }).then(r => {
        r.Tags.forEach(tag => {
            if (tagsData[tag] != null) {
                p.tags += (tagTemplate.replace("{tag}", tag)).replace("{style}", 'style="background-color: ' + tagsData[tag]["color"] + ' !important;" ');
            } else {
                p.tags += tagTemplate.replace("{tag}", tag);
            }
        });
    }).catch(e => console.log("No Tag"));
}

function getLanguages(languagesURL, p) {
    return fetch(new Request(languagesURL)).then(result => {
        if (result.status === 200) {
            return result.json();
        }
        throw new Error("404");
    }).then(r => {
        let cent = 0;
        for (let l in r) {
            cent += r[l];
        }
        for (let l in r) {
            p.languages += (languageTemplate.replace("{languageTag}", l)).replace("{languageUsage}", ((r[l] * 100 / cent).toPrecision(4)) + "%");

        }
    }).catch(e => console.log("No Languages"));
}