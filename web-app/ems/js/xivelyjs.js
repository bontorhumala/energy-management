$(document).ready(function($) {

      // Set the Xively API key (https://xively.com/users/YOUR_USERNAME/keys)
      xively.setKey( "VdEHP84FKgJFLAS29pNZqe8rJzPZsqJnNIPtPc6zT8qj3rgw" );

      // Replace with your own values
      var feedID_Outlet1    = 2092030555, // Feed ID for Outlet 1
          feedID_Outlet2    = 2092030555, // Feed ID for Outlet 2
          datastreamID_Stat = "status",       // Datastream ID for Status1
          datastreamID_Pow  = "power",       // Datastream ID for Status1
          selector_stat     = "#stat",  // Your element on the page - takes any valid jQuery selector
          selector_pow      = "#pow";   // Your element on the page - takes any valid jQuery selector
      // Get datastream data from Xively
    
      xively.datastream.get (feedID_Outlet1, datastreamID_Pow, function ( datastream ) {// Display the current value from the datastream    
      $(selector_pow).html( datastream["current_value"] );// Getting realtime! The function associated with the subscribe method will be executed every time there is an update to the datastream
        xively.datastream.subscribe(feedID_Outlet1, datastreamID_Pow, function ( event , datastream_updated ) {// Display the current value from the updated datastream
            $(selector_pow).html( datastream_updated["current_value"] );            
        });
      });
    xively.datastream.get (feedID_Outlet1, datastreamID_Stat, function ( datastream ) {// Display the current value from the datastream  
        $(selector_stat).html( datastream["current_value"] );// Getting realtime! The function associated with the subscribe method will be executed every time there is an update to the datastream
        xively.datastream.subscribe(feedID_Outlet1, datastreamID_Stat, function ( event , datastream_updated ) {// Display the current value from the updated datastream            
            $(selector_stat).html( datastream_updated["current_value"] );
        });
      });    
      // WARNING: Code here will continue executing while we get the datastream data from Xively, use the function associated with datastream.get to work with the data, when the request is complete
    });