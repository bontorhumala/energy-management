angular.module('starter')

.factory('device', ['$http', '$q', function($http, $q){
  var urlBase = 'http://api.thingspeak.com/channels/';
  var talkbackBase = 'http://api.thingspeak.com/talkbacks/';  
  var device = {};

  device.isdevice = '';

  // http://api.thingspeak.com/channels/(channel_id)/feed/last.(format)

  device.getFeedNow = function( items ) {
    var httpPromises = [];
    for (var i=0; i<items.length; i++) {
      httpPromises.push($http.get(urlBase + items[i].channelId + '/feed/last.json?offset=7&key=' + items[i].readKey ));
      // console.log(urlBase + items[i].channelId + '/feed/last.json?offset=7&key=' + items[i].readKey);
    }
    return httpPromises;
  };

  device.getFeedLog = function(channelId, readKey, days, average) {
    // console.log(urlBase + channelId + '/feed.json?offset=7&key=' + readKey + '&days=' + days + '&average=' + average);
    var feedLog = $http.get(urlBase + channelId + '/feed.json?offset=7&key=' + readKey + '&days=' + days + '&average=' + average );
    // console.log(feedLog);
    return feedLog;
  }

  device.calculateOverview = function( data ) {
    // check isBase unit -> use as main power value
    // if isBaseMember -> do not add
    // else -> add
    var overviewValue = { 'power': '', 'voltage':'', 'current':'' }
    return overviewValue;
  }

  device.updateState = function( devices ) {
    var httpPromises = [];
    for (var i=0; i<devices.length; i++) {
      httpPromises.push($http.get(talkbackBase + devices[i].talkbackId + '/commands/last?api_key=' + devices[i].talkbackKey));
    }
    return httpPromises;
  }

  device.controlDevices = function( devices ) {
    var httpPromises = [];
    var httpExecPromises = [];
    for (var i=0; i<devices.length; i++) {
      httpPromises.push($http.post(talkbackBase + devices[i].talkbackId + '/commands', { api_key:devices[i].talkbackKey, command_string:devices[i].command, position:1}));
      // console.log({ api_key:devices[i].talkbackKey, command_string:devices[i].command, position:1});
      $q.all( httpPromises ).then( function(results) {
        for (var i=0; i<devices.length; i++) {
          httpExecPromises.push($http.post(talkbackBase + devices[i].talkbackId + '/commands/execute?api_key=' + devices[i].talkbackKey));
        }
      });
    }
    return httpExecPromises;
  }

  function parseDate(inputDate) {
    // inputDate is ISO8601 format "2014-10-01T05:10:47.357918Z"
    return moment(inputDate).valueOf();
  }

  device.getGraph = function(feedLog, keyname, graphname) {
    // console.log(feedLog);
    // console.log(feedLog.length);    
    for (var i=0; i<feedLog.length; i++) {
      feedLog[i][keyname] = parseFloat(parseFloat(feedLog[i][keyname]).toFixed(2));
      feedLog[i].created_at = feedLog[i].created_at.replace("T", "_");
      feedLog[i].created_at = feedLog[i].created_at.substring(0, feedLog[i].created_at.indexOf('+'));
    }
    return feedLog;
  }

  device.getFeed = function(channelId, readKey) {
    var feed = $http.get(urlBase + channelId + '/feed/last.json?offset=7&key=' + readKey );
    return feed;
  }

  return device;
}])