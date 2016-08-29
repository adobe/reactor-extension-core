try {
    console.log("Non Sequential Global script 3");
    console.log("Window object `nsg3` should now be set.");
    var nsg3 = "This is the `nsg3` object"
} finally {
    _satellite._customJSLoaded('fgh');
}
