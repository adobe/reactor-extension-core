_satellite._customJSLoaded('jkl', function(event, target) {
    console.log("Sequential Non Global script 1");
    console.log("Window object `nsng1` should now be set.");
    window.nsng1 = "This is the `nsng1` object";
});
