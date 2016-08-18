try {
    console.log("Non Sequential Global script 2");
    console.log("Window object `nsg2` should now be set.");
    var nsg2 = "This is the `nsg2` object";
    console.log("DE_One Value : " + _satellite.getVar("DE_One"));
} finally {
    _satellite._customJSLoaded('def');
}
