const fs = require('fs-extra');
const path = require('path');
const GitHubApi = require('github');
const https = require('https');

const dataFolder = './temp/gists';
const githubUser = 'bndynet';
const template = `---
layout: page
title:  "%description%"
breadcrumb: true
categories:
    - Gists
author: Bendy Zhang
---

%content%

<!--more-->

## Other Post Formats
{: .t60 }
{% include list-posts tag='post format' %}
`;

fs.ensureDir(dataFolder).then(() => {
    console.log('The folder is ready.');
});

const github = new GitHubApi({});
github.gists.getForUser({username: githubUser}, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    const gists = res.data;
    for (gist of gists) {
        const dt = gist.created_at.split('T')[0];
        const filename = dt + '-' + gist.description.replace(/[^\w+]/g, '-') + '.md';
        const filepath = path.join(dataFolder, filename);
        let fileContent = template;
        for (const key in gist) {
            fileContent = fileContent.replace('%' + key + '%', gist[key]);
        }
        for (const key in gist.files) {
            if (gist.files.hasOwnProperty(key)) { 
                const file = gist.files[key].raw_url;
                if (file) {
                    // request gist content
                    console.log('Request gist conent for `' + gist.description + '` (' + file + ') ...');
                    https.get(file, (res) => {
                        res.setEncoding('utf8');
                        res.on('data', (chunk) => {
                            fileContent = fileContent.replace('%content%', chunk);
                            // write file
                            fs.writeFile(filepath, fileContent, (err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        });
                    });
                }
            }
        }
    }
});