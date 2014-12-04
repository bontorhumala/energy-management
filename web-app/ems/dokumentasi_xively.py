Three stage in the xively development process:    
    Develop:connected experiences quickly and easily to get your devices, apps and services working together through Xively.
    Deploy: turns prototypes into products at the push of a button.
    Manage: batches of products no matter the size, one or one million, and support your devices in real time.
end

Connect Your Devices, Services, and Apps To connect your device, just copy the displayed Feed ID and API Key to the code in your device responsible for establishing bi-directional communication with Xively. You can also connect any app or service that you would like to this feed through the Xively API. We provide many Libraries and Tutorials that make the process easy.

Develop:    
    Device-->           Homote
    Product ID -->      sSb0zXWmS1PjEMddEphV
    Product Secret -->  de9c3ae94606e1ec7e0c02fbece218d1a0532ba4
    Serial Number -->   MPZRCCYHPWNA
    Activation Code --> db06e208cf9018424770d0351ada5bde11dde040 
    Feed ID -->         18909610
    Feed URL -->        https://xively.com/feeds/18909610
    API Endpoint -->    https://api.xively.com/v2/feeds/18909610
    API Keys -->        oWKTwY6Drhy4xnOcFgoPCZ2mTrf6uOZqqBHCIxW8KcxWgMcy
End

When you deploy, you create a batch of virtual products in Xively that correspond to a batch of manufactured physical products. You also transition from the Develop stage to the Manage stage. A product batch is defined by product metadata, an optional feed template, and a list of serial numbers.
    
Deploy:
    
End

Manage:
    
End

List:
    Link Xivelyjs after jquery, and then your script.
    xively.setKey( "PASTE_YOUR_API_KEY_HERE" );  --> we can use any xivelyjs method
    feedID = 18909610;
    datastreamID  = "sine60";       // Datastream ID  
    selector      = "#myelement";   // Your element on the page  
    

Feed A Feed is the collection of channels (datastreams). A Feed’s metadata can optionally specify location, tags, whether it is physical or virtual, fixed or mobile, indoor or outdoor, etc. Every device has exactly one Feed. 

Datapoint represents a single value of a Datastream at a specific point in time. It is simply a key value pair consisting of a timestamp and the value at that time. 

Datastream is a bi-directional communications channel that allows for the exchange of data between the Xively platform and authorized devices, applications, and services. Each Datastream represents a specific attribute, unit or type of information (a variable). Some Datastreams may be defined automatically by the product template at the time of Feed creation. The Datastreams associated with a Feed can be added and deleted after a device is created. When data is written to an unspecified Datastream using the Feed API, the Datastream will be created dynamically.

