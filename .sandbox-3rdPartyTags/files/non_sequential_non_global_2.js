_satellite._customJSLoaded('def', function(event, target) {
    console.log("Sequential Non Global script 2");
    console.log("Window object `nsng2` should now be set.");
    window.nsng2 = "This is the `nsng2` object";
    console.log("DE_One Value : " + _satellite.getVar("DE_One"));
});
