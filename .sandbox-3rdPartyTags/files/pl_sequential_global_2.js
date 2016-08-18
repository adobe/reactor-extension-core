try {
    console.log("Page Load Sequential Global script 2");
    console.log("Window object `plsg2` should now be set.");
    var plsg2 = "This is the `plsg2` object"
} finally {
    _satellite._customJSLoaded('def');
}
