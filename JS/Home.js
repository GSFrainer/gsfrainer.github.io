//Templates
var postTemplate = `<div class="card mb-2">
    <div class="card-body">
        <div class="card card-post w-100 border-0">
            <div class="card-body p-0">
                <h4 class="card-title mb-2">
                    <a href="{link}" target="_blank">{name}</a>
                </h4>
                <h6 class="card-subtitle mb-1 text-secondary post-date">
                    Created: {createdAt}
                </h6>
                <h6 class="card-subtitle mb-1 text-secondary post-date">
                    Last Update: {updatedAt}
                </h6>
                <div class="card-text d-flex align-items-center mb-2">
                    <div>
                        {tags}{languages}
                    </div>
                </div>
                <div class="card-text mb-0">
                    <p class="description">{description}</p>
                </div>
                <a href="{link}" target="_blank">Read More...</a>
            </div>
        </div>
    </div>
</div>`;
var tagTemplate = `<span class="d-inline-block rounded mr-1 mb-1 post-tag">#
    <spam class="d-inline-block rounded-right tag" {style}>
        {tag}
    </spam>
</span>`;
var languageTemplate = `<span class="d-inline-block rounded mr-1 mb-1 post-tag">
    {languageTag}
    <spam class="d-inline-block rounded-right language-usage">{languageUsage}</spam>
</span>`;
var tagsData = {
    "For Fun": {
        "color": "#a4a62b"
    }
};
var limitPosts = 3;

listPostsHome();

//Request - List Posts
function listPostsHome() {
    fetch(new Request("https://api.github.com/users/GFrainer/repos?per_page=" + limitPosts + "&type=public&sort=created"))
        .then(response => {
            if (response.status === 200) {
                return response.json();
            }
            if (response.status === 403) {
                throw new Error(403);
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
                document.getElementById("homePosts").innerHTML = "";
                posts.forEach(p => {
                    post = postTemplate;
                    post = post.replace("{name}", p.name);
                    post = post.replace("{createdAt}", (new Date(p.created_at)).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' }));
                    post = post.replace("{updatedAt}", (new Date(p.updated_at)).toLocaleDateString("en-GB", { year: 'numeric', month: 'long', day: 'numeric' }));
                    post = post.replace("{description}", p.description);
                    post = post.replace("{tags}", p.tags);
                    post = post.replace("{languages}", p.languages);
                    post = post.replaceAll("{link}", p.link);
                    document.getElementById("homePosts").innerHTML += post;
                });
            }).catch(error => {
                if (error.message == '403') {
                    connectionFail();
                }
            });
        }).catch(error => {
            if (error.message == '403') {
                connectionFail();
            }
        });
}

function getInternalTags(tagsURL, p) {
    fetch(new Request(tagsURL)).then(result => {
        if (result.status === 200) {
            return result.json();
        }
        if (response.status === 403) {
            throw new Error(403);
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
    }).catch(error => {
        if (error.message == '403') {
            connectionFail();
        }
    });
}

function getLanguages(languagesURL, p) {
    return fetch(new Request(languagesURL)).then(result => {
        if (result.status === 200) {
            return result.json();
        }
        if (response.status === 403) {
            throw new Error(403);
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
    }).catch(error => {
        if (error.message == '403') {
            connectionFail();
        }
    });
}

function connectionFail() {
    document.getElementById("homePosts").innerHTML = `
                <h2 class="border border-top-0 border-right-0 border-left-0 mb-2 pb-2">
                    Sorry...
                </h2>
                <p class="description">Can't retrieve the information from GitHub server. To see the posts, please access my GitHub repository.</p>
                <p><a href="">View GitHub Repository</a></p>  `;
}