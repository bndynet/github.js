describe "github", ->
    # $ = require "../node_modules/jquery/dist/jquery.js"
    # Github = require "./github.js"

    self = this

    # beforeEach ->
    #     self.github = Github()

    it "user should be specified", ->
        expect(github.user).toBeTruthy()

    it "should get events", ->
        spyOn($, 'get')
        github.getEvents() 
        expect($.get).toHaveBeenCalled()
    
    return