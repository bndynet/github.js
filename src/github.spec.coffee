describe "github", ->

    it "user should be specified", ->
        expect(github.user).toBeTruthy()

    it "should get events", ->
        spyOn($, 'get')
        github.getEvents() 
        expect($.get).toHaveBeenCalled()
    
    return