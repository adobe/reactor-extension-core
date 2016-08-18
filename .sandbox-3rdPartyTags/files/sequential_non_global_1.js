_satellite._customJSLoaded('ghi', function(event, target) {
    console.log("Sequential Non Global script 1");
    console.log("Window object `sng1` should now be set.");
    window.sng1 = "This is the `sng1` object";
});
