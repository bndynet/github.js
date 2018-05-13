const fs = require('fs-extra');
const path = require('path');
const GitHubApi = require('github');
const https = require('https');

const workspace = './temp';
const fileFolder = workspace + '/_files';
const wikiFolder = workspace + '/wiki';
const blogFolder = workspace + '/blog';
const githubUser = 'bndynet';
const blogTemplate = `---
layout: page
title:  "%description%"
teaser: "%teaser%"
breadcrumb: true
categories:
    - Gists
author: Bendy Zhang
---

%content%

`;

fs.removeSync(workspace);

fs.ensureDir(fileFolder).then(() => { 
    console.log('The folder is ready for gist files.');
});
fs.ensureDir(wikiFolder).then(() => {
    console.log('The folder is ready for wiki.');
});
fs.ensureDir(blogFolder).then(() => {
    console.log('The folder is ready for blog.');
});

const github = new GitHubApi({});
github.gists.getForUser({username: githubUser}, (err, res) => {
    if (err) {
        console.error(err);
        return;
    }

    const gists = res.data;
    for (gist of gists) {
        for (const key in gist.files) {
            if (!gist.files.hasOwnProperty(key)) { 
                continue;
            }

            const file = gist.files[key];
            const filename = file.filename;
            const fileurl = file.raw_url;
            const filepath = path.join(fileFolder, filename);

            // for blog
            const dt = gist.created_at.split('T')[0];
            const blogFilename = dt + '-' + filename;
            const blogFilepath = path.join(blogFolder, blogFilename);
            // for wiki
            const wikiFilepath = path.join(wikiFolder, filename);

            let filecontent = '';
            let blogContent = blogTemplate;
            for (const key in gist) {
                blogContent = blogContent.replace('%' + key + '%', gist[key]);
            }

            if (fileurl) {
                // request gist content
                console.log('Request gist content for `' + gist.description + '` (' + fileurl + ') ...');
                https.get(fileurl, (res) => {
                    res.setEncoding('utf8');
                    res.on('data', (chunk) => {
                        filecontent += chunk;
                    });
                    res.on('end', () => {
                        // gist files
                        fs.writeFile(filepath, filecontent, (err) => {
                            if (err) {
                                console.error(err);
                            }
                        });

                        if (filepath.endsWith('.md')) {
                            // wiki
                            fs.writeFile(wikiFilepath, filecontent, (err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });

                            // blog
                            blogContent = blogContent.replace('%content%', filecontent);
                            // replace teaser
                            var firstline = blogContent.trim().split('\n')[0] || '';
                            blogContent = blogContent.replace('%teaser%', firstline.replace(/#/g, '').trim());
                            
                            // write file
                            fs.writeFile(blogFilepath, blogContent, (err) => {
                                if (err) {
                                    console.error(err);
                                }
                            });
                        }
                    });
                });
            }
        }
    }
});