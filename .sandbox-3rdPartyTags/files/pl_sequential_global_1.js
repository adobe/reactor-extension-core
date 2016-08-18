try {
    console.log("Page Load Sequential Global script 1");
    console.log("Window object `plsg1` should now be set.");
    var plsg1 = "This is the `plsg1` object";
} finally {
    _satellite._customJSLoaded('abc');
}
