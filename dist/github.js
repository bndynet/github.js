// Generated by CoffeeScript 2.0.1
var Github;

Github = function(username) {
  var self;
  self = this;
  self.mappings = {
    CommitCommentEvent: {
      action: '',
      title: 'payload'
    },
    CreateEvent: {
      action: 'New Repo',
      title: 'payload.description'
    },
    DownloadEvent: {
      action: '',
      title: ''
    },
    FollowEvent: {
      action: '',
      title: ''
    },
    ForkEvent: {
      action: '',
      title: ''
    },
    GistEvent: {
      action: '',
      title: ''
    },
    IssueCommentEvent: {
      action: {
        created: 'Comment'
      },
      title: 'payload.issue.title'
    },
    IssuesEvent: {
      action: {
        opened: 'New Issue',
        closed: 'Close Issue'
      },
      title: 'payload.issue.title',
      date: 'payload.issue.updated_at'
    },
    PullRequestEvent: {
      action: {
        reopened: 'Reopen Pull Request',
        closed: 'Close Pull Request'
      },
      title: 'payload.pull_request.title'
    },
    PushEvent: {
      action: 'Push Code',
      title: 'payload.commits[0].message'
    },
    WatchEvent: {
      action: '',
      title: ''
    },
    ReleaseEvent: {
      action: {
        published: 'Release'
      },
      title: 'payload.release.name',
      date: 'created_at'
    }
  };
  return {
    apiRoot: 'https://api.github.com',
    user: username || 'bndynet',
    getFullUrl: function(relativeUrl) {
      return `${self.apiRoot}${relativeUrl}`;
    },
    parseEvent: function(event) {
      var mapping;
      mapping = mappings[event.type];
      return {
        user: event.actor.login,
        userAvatar: event.actor.avatar_url,
        userUrl: event.actor.url,
        date: new Date((_.get(event, mapping.date)) ? _.get(event, mapping.date) : event.created_at).toLocaleString().replace(',', ''),
        repo: event.repo.name.replace(`${self.user}/`, ""),
        repoUrl: event.repo.url,
        action: _.isObject(mapping.action) ? _.get(mapping.action, event.payload.action) : mapping.action,
        title: _.get(event, mapping.title)
      };
    },
    getEvents: function(fnSuccess) {
      var url;
      self = this;
      url = self.getFullUrl(`/users/${self.user}/events`);
      $.get(url, function(res) {
        var data, i, item, len;
        data = [];
        for (i = 0, len = res.length; i < len; i++) {
          item = res[i];
          data.push(self.parseEvent(item));
        }
        return fnSuccess(data);
      });
    },
    getGists: function(fnSuccess) {
      var url;
      self = this;
      url = self.getFullUrl(`/users/${self.user}/gists`);
      $.get(url, function(res) {
        if (fnSuccess) {
          return fnSuccess(data);
        }
      });
    },
    render: function(items, format) {
      var i, item, key, len, line, result;
      result = '';
      for (i = 0, len = items.length; i < len; i++) {
        item = items[i];
        line = format;
        for (key in item) {
          line = line.replace(`%${key}%`, item[key] || '');
        }
        result += line;
      }
      return result;
    }
  };
};

if (typeof window !== "undefined" && window !== null) {
  window.github = Github();
}

if (typeof module !== "undefined" && module !== null) {
  module.exports = Github;
}
