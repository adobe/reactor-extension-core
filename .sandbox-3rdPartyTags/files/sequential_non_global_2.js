_satellite._customJSLoaded('hij', function(event, target) {
    console.log("Sequential Non Global script 2");
    console.log("Window object `sng2` should now be set.");
    window.sng2 = "This is the `sng2` object";
    console.log("DE_One Value : " + _satellite.getVar("DE_One"));
});
