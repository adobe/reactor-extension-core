try {
    console.log("Sequential Global script 1");
    console.log("Window object `sg1` should now be set.");
    var sg1 = "This is the `sg1` object";
} finally {
    _satellite._customJSLoaded('abc');
}
