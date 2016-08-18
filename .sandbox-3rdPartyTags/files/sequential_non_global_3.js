_satellite._customJSLoaded('ghi', function(event, target) {
    console.log("Sequential Non Global script 3");
    console.log("Window object `sng3` should now be set.");
    window.sng3 = "This is the `sng3` object";
});
