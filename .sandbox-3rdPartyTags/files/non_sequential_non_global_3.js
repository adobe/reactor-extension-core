_satellite._customJSLoaded('ghi', function(event, target) {
    console.log("Sequential Non Global script 3");
    console.log("Window object `nsng3` should now be set.");
    window.nsng3 = "This is the `nsng3` object";
});
