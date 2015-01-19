package com.tlantic.plugins.socket;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.InetAddress;
import java.net.Socket;
import java.net.UnknownHostException;
import android.util.Log;

/**
 * @author viniciusl
 *
 * This class represents a socket connection, behaving like a thread to listen 
 * a TCP port and receive data
 */
public class Connection implements Runnable {
	private SocketPlugin hook;

	private Socket callbackSocket;
	private PrintWriter writer;
	private BufferedReader reader;

	private Boolean mustClose;
	private String host;
	private int port;
  
  private String LOG = "com.emos.socket";

	/**
	 * Creates a TCP socket connection object.
	 * 
	 * @param pool Object containing "sendMessage" method to be called as a callback for data receive.
	 * @param host Target host for socket connection.
	 * @param port Target port for socket connection
	 */
	public Connection(SocketPlugin pool, String host, int port) {
		super();
		// setDaemon(true);

		this.mustClose = false;
		this.host = host;
		this.port = port;
		this.hook = pool;
	}


	/**
	 * Returns socket connection state.
	 * 
	 * @return true if socket connection is established or false case else.
	 */
	public boolean isConnected() {

		boolean result =  (
				this.callbackSocket == null ? false : 
					this.callbackSocket.isConnected() && 
					this.callbackSocket.isBound() && 
					!this.callbackSocket.isClosed() && 
					!this.callbackSocket.isInputShutdown() && 
					!this.callbackSocket.isOutputShutdown());

		// if everything apparently is fine, time to test the streams
		if (result) {
			try {
				this.callbackSocket.getInputStream().available();
			} catch (IOException e) {
				// connection lost
				result = false;
			}
		}

		return result;
	}

	/**
	 * Closes socket connection. 
	 */
	public void close() {
		// closing connection
		try {
			//this.writer.close();
			//this.reader.close();
			callbackSocket.shutdownInput();
			callbackSocket.shutdownOutput();
			callbackSocket.close();
			this.mustClose = true;
		} catch (IOException e) {
			e.printStackTrace();
		}		
	}


	/**
	 * Writes on socket output stream to send data to target host.
	 * 
	 * @param data information to be sent
	 */
	public void write(String data) {
    try {
      Log.d(LOG, "Socket write data: " + data);
      this.writer = new PrintWriter(this.callbackSocket.getOutputStream(), true);
  		this.writer.println(data);
    } catch (UnknownHostException e1) {
      // TODO Auto-generated catch block
      Log.d(LOG, "UnknownHostException..." + e1);
      e1.printStackTrace();
    } catch (IOException e1) {
      Log.d(LOG, "IO exception..." + e1);
      // TODO Auto-generated catch block
      e1.printStackTrace();
    }    
	}

	/* (non-Javadoc)
	 * @see java.lang.Thread#run()
	 */
  @Override
	public void run() {
		String chunk = null;
    Log.d(LOG, "Running socket bro...");
    Log.d(LOG, "Host: " + this.host);
    Log.d(LOG, "Port: " + this.port);
		// creating connection
		try {
      Log.d(LOG, "Creating...");

      InetAddress serverAddr = InetAddress.getByName(this.host);
			this.callbackSocket = new Socket(serverAddr, this.port);
      Log.d(LOG, "Created...");
			// this.reader = new BufferedReader(new InputStreamReader(callbackSocket.getInputStream()));

			// // receiving data chunk
			// while(!this.mustClose){

			// 	try {

			// 		if (this.isConnected()) {
			// 			chunk = reader.readLine();

			// 			if (chunk != null) {
			// 				chunk = chunk.replaceAll("\"\"", "null");
			// 				Log.d(LOG, "## RECEIVED DATA: " + chunk);
			// 				hook.sendMessage(this.host, this.port, chunk);
			// 			}
			// 		}
			// 	} catch (Exception e) {
			// 		e.printStackTrace();
			// 	}
			// }

		} catch (UnknownHostException e1) {
			// TODO Auto-generated catch block
      Log.d(LOG, "UnknownHostException..." + e1);
			e1.printStackTrace();
		} catch (IOException e1) {
      Log.d(LOG, "IO exception..." + e1);
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}

	}

}
