Github = (username) ->
    self = this
    self.mappings = {
        CommitCommentEvent:
            action: 'Comment'
            title: 'payload.comment.body'
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
                created: 'Comment'
            title: 'payload.issue.title'
        IssuesEvent:
            action:
                opened: 'New Issue'
                closed: 'Close Issue'
            title: 'payload.issue.title'
            date: 'payload.issue.updated_at'
        PullRequestEvent:
            action:
                reopened: 'Reopen Pull Request'
                closed: 'Close Pull Request'
            title: 'payload.pull_request.title'
        PullRequestReviewCommentEvent:
            action:
                created: 'Code Review'
            title: 'payload.comment.body'
            date: 'payload.comment.created_at'
        PushEvent:
            action: 'Push Code'
            title: 'payload.commits[0].message'
        WatchEvent:
            action: ''
            title: ''
        ReleaseEvent:
            action:
                published: 'Release'
            title: 'payload.release.name'
            date: 'created_at'
        MemberEvent:
            action:
                added: 'New Member'
            title: 'payload.member.login'
    }

    apiRoot: 'https://api.github.com'
    user: username || 'bndynet'
    getFullUrl: (relativeUrl) ->
        "#{self.apiRoot}#{relativeUrl}"
    parseEvent: (event) ->
        mapping = mappings[event.type]
        if mapping
            user: event.actor.login
            userAvatar: event.actor.avatar_url
            userUrl: event.actor.url
            date: new Date(if (_.get event, mapping.date) then (_.get event, mapping.date) else event.created_at).toLocaleString().replace(',', '')
            repo: event.repo.name.replace "#{self.user}/", ""
            repoUrl: 'https://github.com/' + event.repo.name
            action: if _.isObject(mapping.action) then (_.get mapping.action, event.payload.action) else mapping.action
            title: _.get event, mapping.title
        else
            console.debug 'No Event Definiation:'
            console.debug event
            return null
    getEvents: (fnSuccess) ->
        self = this
        url = self.getFullUrl "/users/#{self.user}/events"
        $.get url, (res) -> 
            parsedEvents = []
            parsedEvents.push(self.parseEvent(item)) for item in res
            data = []
            data.push item for item in parsedEvents when item and item.title.split(' ').length > 1
            fnSuccess data
        return
    getGists: (fnSuccess) ->
        self = this
        url = self.getFullUrl "/users/#{self.user}/gists"
        $.get url, (res) ->
            fnSuccess data if fnSuccess
        return
    render: (items, format) ->
        result = '' 
        for item in items
            line = format
            for key of item
                line = line.replace "%#{key}%", item[key] || ''
            result += line
        result

window.github = Github() if window?
module.exports = Github if module?