class Posts {
    constructor() {
        //Templates
        this.postTemplate = `<div class="card mb-2">
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
        this.tagTemplate = `<span class="d-inline-block rounded mr-1 mb-1 post-tag post-tag-filter" onclick="{selectFilter}">#
    <spam class="d-inline-block rounded-right tag" {style}>
        {tag}
    </spam>
</span>`;
        this.languageTemplate = `<span class="d-inline-block rounded mr-1 mb-1 post-tag post-tag-filter" onclick="{selectFilter}">
    {languageTag}
    <spam class="d-inline-block rounded-right language-usage">{languageUsage}</spam>
</span>`;
        this.filterTemplate = `<span id="{filter}" class="d-inline-block rounded mr-1 mb-1 post-filter" onclick="{unselectFilter}">X
    <spam class="d-inline-block rounded-right filter">
        {filter}
    </spam>
</span>`;
        this.tagsData = {
    "For Fun": {
        "color": "#a4a62b"
    }
};

        this.limitPosts = 3;
        this.activeFilters = {tags: [], languages: []};

        Posts.postsList = [];
        Posts._loadingLock = true;
        Posts._waitingLoad = new Array();
    }

    //Request - List Posts
    listPosts() {
        return fetch(new Request("https://api.github.com/users/GSFrainer/repos?type=public&sort=created"))
            .then(response => {
                if (response.status === 200) {
                    return response.json();
                }
                if (response.status === 403) {
                    throw new Error(403);
                }
            })
            .then(response => {

                //Create home posts  list
                let postsHome = new Array((response.length > this.limitPosts ? this.limitPosts : response.length));

                //Create promises list to load home posts
                let promises = new Array(postsHome.length * 2);

                //Create an object for each post on home posts list
                //Add promises for each object loading
                let i = 0;
                for (; i < postsHome.length; i++) {
                    postsHome[i] = {
                        name: response[i].name,
                        updated_at: response[i].updated_at,
                        created_at: response[i].created_at,
                        description: response[i].description,
                        tagsContent: "",
                        languagesContent: "",
                        filter: {tags: [], languages: []},
                        link: response[i].html_url
                    };
                    promises[i] = this.getLanguages(response[i].languages_url, postsHome[i]);
                    promises[promises.length + i] = this.getInternalTags("https://raw.githubusercontent.com/" + response[i].full_name + "/" + response[i].default_branch + "/InternalTags.json", postsHome[i]);
                }

                //Wait home posts promises
                Promise.all(promises).then(results => {

                    //Load home posts on HTML
                    this.loadPostsField("homePosts", postsHome);

                    //Clean posts list
                    Posts.postsList = new Array();

                    //Copy posts on home posts list to (full) posts list
                    Posts.postsList = Posts.postsList.concat(postsHome);

                    //Check if there is more posts to load
                    if (response.length <= postsHome.length) {
                        this.loadPostsField("postsList", Posts.postsList);
                        return;
                    }

                    //Create promises list to load rest of posts
                    promises = new Array();

                    //Create a list for other posts
                    let otherPosts = new Array(response.length - i);

                    //Create an object for each one of the rest of the posts
                    //Add promises for each object loading
                    let j = 0;
                    for (; i < response.length; i++) {
                        otherPosts[j] = {
                            name: response[i].name,
                            updated_at: response[i].updated_at,
                            created_at: response[i].created_at,
                            description: response[i].description,
                            tagsContent: "",
                            languagesContent: "",
                            filter: {tags: [], languages: []},
                            link: response[i].html_url
                        };
                        promises[j] = this.getLanguages(response[i].languages_url, otherPosts[j]);
                        promises[promises.length + j] = this.getInternalTags("https://raw.githubusercontent.com/" + response[i].full_name + "/" + response[i].default_branch + "/InternalTags.json", otherPosts[j]);
                        j++;
                    }

                    //Wait home posts promises
                    Promise.all(promises).then(results => {

                        //Copy other posts to (full) posts list
                        Posts.postsList = Posts.postsList.concat(otherPosts);
                        Posts._loadingLock = false;
                        Posts._waitingLoad.forEach(f => f());

                        //Load posts list
                        this.loadPostsField("postsList", Posts.postsList);

                    }).catch(error => {
                        this.errorHandler(error);
                    });

                }).catch(error => {
                    this.errorHandler(error);
                });

            }).catch(error => {
                this.errorHandler(error);
            });
    }

    loadPostsField(field, posts) {
        document.getElementById(field).innerHTML = "";
        let post;
        posts.forEach(p => {
            post = this.postTemplate;
            post = post.replace("{name}", p.name);
            post = post.replace("{createdAt}", (new Date(p.created_at)).toLocaleDateString("en-GB", {year: 'numeric', month: 'long', day: 'numeric'}));
            post = post.replace("{updatedAt}", (new Date(p.updated_at)).toLocaleDateString("en-GB", {year: 'numeric', month: 'long', day: 'numeric'}));
            post = post.replace("{description}", p.description);
            post = post.replace("{tags}", p.tagsContent);
            post = post.replace("{languages}", p.languagesContent);
            post = post.replaceAll("{link}", p.link);
            document.getElementById(field).innerHTML += post;
        });
    }

    getInternalTags(tagsURL, p) {
        return fetch(new Request(tagsURL)).then(result => {
            if (result.status === 200) {
                return result.json();
            }
            if (response.status === 403) {
                throw new Error(403);
            }
            throw new Error("404");
        }).then(r => {
            r.Tags.forEach(tag => {
                if (this.tagsData[tag] != null) {
                    p.tagsContent += (this.tagTemplate.replace("{tag}", tag)).replace("{style}", 'style="background-color: ' + this.tagsData[tag]["color"] + ' !important;" ').replace("{selectFilter}", "posts.selectTagFilter('" + tag + "')");
                } else {
                    p.tagsContent += this.tagTemplate.replace("{tag}", tag).replace("{selectFilter}", "posts.selectTagFilter('" + tag + "')");;
                }
                p.filter.tags.push(tag);
            });
        }).catch(error => {
            this.errorHandler(error);
        });
    }

    getLanguages(languagesURL, p) {
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
                p.languagesContent += (this.languageTemplate.replace("{languageTag}", l)).replace("{languageUsage}", ((r[l] * 100 / cent).toPrecision(4)) + "%").replace("{selectFilter}", "posts.selectLanguageFilter('" + l + "')");
                p.filter.languages.push(l);
            }
        }).catch(error => {
            this.errorHandler(error);
        });
    }


    selectTagFilter(tag) {
        if (!this.activeFilters.tags.includes(tag)) {
            this.activeFilters.tags.push(tag);
            this.filterPosts();
        }
    }

    unselectTagFilter(tag) {
        if (this.activeFilters.tags.includes(tag)) {
            this.activeFilters.tags.splice(this.activeFilters.tags.indexOf(tag), 1);
            this.filterPosts();
        }
    }

    selectLanguageFilter(language) {
        if (!this.activeFilters.languages.includes(language)) {
            this.activeFilters.languages.push(language);
            this.filterPosts();
        }
    }
    unselectLanguageFilter(language) {
        if (this.activeFilters.languages.includes(language)) {
            this.activeFilters.languages.splice(this.activeFilters.languages.indexOf(language), 1);
            this.filterPosts();
        }
    }


    filterPosts() {
        let postsFilter = "";
        $('#pills-tab a[href="#Posts"]').tab('show');
        this.activeFilters.tags.forEach(tag => {
            postsFilter += this.filterTemplate.replaceAll("{filter}", tag).replace("{unselectFilter}", "posts.unselectTagFilter('" + tag + "')");
        });
        this.activeFilters.languages.forEach(language => {
            postsFilter += this.filterTemplate.replaceAll("{filter}", language).replace("{unselectFilter}", "posts.unselectLanguageFilter('" + language + "')");
        });
        document.getElementById("postsFilter").innerHTML = postsFilter;
        if (this.activeFilters.tags.length == 0 && this.activeFilters.languages.length == 0) {
            this.loadPostsField("postsList", Posts.postsList);
            return;
        }
        this.loadPostsField("postsList", Posts.postsList.filter(p => {
            if (p.filter.tags.some(t => {
                return this.activeFilters.tags.includes(t);
            })) {
                return true;
            }
            return p.filter.languages.some(l => {
                return this.activeFilters.languages.includes(l);
            });
        }));
    }

    errorHandler(error) {
        if (error.message == '403') {
            document.getElementById("homePosts").innerHTML = `
                    <h4 class="ml-2">
                        Sorry...
                    </h4>
                    <p class="description">Can't retrieve the information from GitHub server. To see the posts, please access my GitHub repository.</p>
                    <p><a href="">View GitHub Repository</a></p>  `;

            document.getElementById("postsList").innerHTML = `
                    <h2 class="border border-top-0 border-right-0 border-left-0 mb-2 pb-2">
                        Sorry...
                    </h2>
                    <p class="description">Can't retrieve the information from GitHub server. To see the posts, please access my GitHub repository.</p>
                    <p><a href="">View GitHub Repository</a></p>  `;
        }
    }
}

var posts = new Posts();
posts.listPosts();