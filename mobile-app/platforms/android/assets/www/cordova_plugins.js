cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    },
    {
        "file": "plugins/com.cowbell.cordova.geofence/www/geofence.js",
        "id": "com.cowbell.cordova.geofence.geofence",
        "clobbers": [
            "geofence"
        ]
    },
    {
        "file": "plugins/com.borismus.webintent/www/webintent.js",
        "id": "com.borismus.webintent.WebIntent",
        "clobbers": [
            "WebIntent"
        ]
    },
    {
        "file": "plugins/com.vladstirbu.cordova.promise/www/promise.js",
        "id": "com.vladstirbu.cordova.promise.Promise",
        "clobbers": [
            "Promise"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.ionic.keyboard": "1.0.3",
    "org.apache.cordova.console": "0.2.11",
    "org.apache.cordova.device": "0.2.12",
    "com.cowbell.cordova.geofence": "0.2.4",
    "com.borismus.webintent": "1.0.0",
    "org.apache.cordova.geolocation": "0.3.12-dev",
    "com.vladstirbu.cordova.promise": "1.0.0"
}
// BOTTOM OF METADATA
});