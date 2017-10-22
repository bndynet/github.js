Github = () ->
    mappings = {
        CommitCommentEvent:
            action: ''
            title: 'payload'
        CreateEvent:
            action: 'New Repo'
            title: 'payload.description'
        DownloadEvent:
            action: ''
            title: ''
        FollowEvent:
            action: ''
            title: ''
        ForkEvent:
            action: ''
            title: ''
        GistEvent:
            action: ''
            title: ''
        IssueCommentEvent:
            action: 
                created: 'New Comment for Issue'
            title: 'payload.issue.title'
        IssuesEvent:
            action:
                closed: 'Close Issue'
            title: 'payload.issue.title'
            date: 'payload.issue.updated_at'
        PullRequestEvent:
            action: ''
            title: ''
        PushEvent:
            action: 'Push Code'
            title: 'payload.commits[0].message'
        WatchEvent:
            action: ''
            title: ''
    }
    apiRoot = 'https://api.github.com'
    user = 'bndynet'

    getFullUrl: (relativeUrl) ->
        "#{apiRoot}#{relativeUrl}"
    parseEvent: (event) ->
        mapping = mappings[event.type]

        user: event.actor.login
        userAvatar: event.actor.avatar_url
        userUrl: event.actor.url
        date: if (_.get event, mapping.date) then (_.get event, mapping.date) else  event.created_at
        repo: event.repo.name
        repoUrl: event.repo.url
        action: if _.isObject(mapping.action) then (_.get mapping.action, event.payload.action) else mapping.action
        title: _.get event, mapping.title
    getEvents: ->
        self = this
        new Promise (resolve, reject) ->
            url = self.getFullUrl "/users/#{user}/events"
            $.get url, (res) -> 
                data = []
                console.debug res
                data.push self.parseEvent(item) for item in res
                resolve data
            return

window.github = Github()