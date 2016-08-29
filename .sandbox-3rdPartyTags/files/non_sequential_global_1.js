try {
    console.log("Non Sequential Global script 1");
    console.log("Window object `nsg1` should now be set.");
    var nsg1 = "This is the `nsg1` object";
    alert("Non Sequential Global script 1");
} finally {
    _satellite._customJSLoaded('def');
}
