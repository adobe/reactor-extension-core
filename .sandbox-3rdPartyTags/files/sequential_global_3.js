try {
    console.log("Sequential Global script 3");
    console.log("Window object `sg3` should now be set.");
    var sg3 = "This is the `sg3` object"
} finally {
    _satellite._customJSLoaded('ghi');
}
