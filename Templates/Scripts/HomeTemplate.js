//Templates
var postTemplate = `${PostTemplate}`;
var tagTemplate = `${TagTemplate}`

//Request - List Posts
fetch(new Request("https://api.github.com/users/${github}/repos"))
    .then(response => {
        if (response.status === 200) {
            return response.json();
        }
    })
    .then(response => {
        let posts = new Array((response.length > 3 ? 3 : response.length));
        let promises = new Array(posts.length*2);

        for (let i = 0; i < posts.length; i++) {
            posts[i] = {
                name: response[i].name,
                updated_at: response[i].updated_at,
                description: response[i].description,
                tags: "",
                languages: "",
                link: response[i].html_url
            };
            promises[i] = getLanguages(response[i].languages_url, posts[i]);
            promises[promises.length+i] = getInternalTags("https://raw.githubusercontent.com/"+response[i].full_name+"/"+response[i].default_branch + "/InternalTags.json", posts[i]);
        }

        Promise.all(promises).then(results => {
            let post;
            document.getElementById("homePosts").innerHTML = "";
            posts.forEach(p => {
                post = postTemplate;
                post = post.replace("{name}", p.name);
                post = post.replace("{updatedAt}", (new Date(p.updated_at)).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' }));
                post = post.replace("{description}", p.description);
                post = post.replace("{tags}", p.tags);
                post = post.replace("{languages}", p.languages);
                post = post.replaceAll("{link}", p.link);
                document.getElementById("homePosts").innerHTML += post;
            });
        });
    }).catch(error => {
        console.error(error);
    });

function getInternalTags(tagsURL, p) {
    fetch(new Request(tagsURL)).then(result => {
        if (result.status === 200) {
            return result.json();
        }
        throw new Error("404");
    }).then(r => {
        r.Tags.forEach(tag=>{
            p.tags += tagTemplate.replace("{tag}", tag);
        });
    }).catch(e=>console.log("No Tags"));
}

function getLanguages(languagesURL, p) {
    return fetch(new Request(languagesURL)).then(result => {
        if (result.status === 200) {
            return result.json();
        }
        throw new Error("404");
    }).then(r => {
        for (let l in r) {
            p.languages += tagTemplate.replace("{tag}", l);
        }
    }).catch(e=>console.log("No Languages"));
}