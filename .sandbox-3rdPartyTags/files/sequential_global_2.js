try {
    console.log("Sequential Global script 2");
    console.log("Window object `sg2` should now be set.");
    var sg2 = "This is the `sg2` object";
    console.log("DE_One Value : " + _satellite.getVar("DE_One"));
} finally {
    _satellite._customJSLoaded('bcd');
}
