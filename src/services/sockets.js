// src/services/socketService.js
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:3000"; // Replace with actual server URL

class SocketService {
  constructor() {
    this.socket = io(SOCKET_SERVER_URL, { autoConnect: false }); // Prevent auto-connect
  }

  // Connect to the socket server
  connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  // Disconnect from the socket server
  disconnect() {
    if (this.socket.connected) {
      this.socket.disconnect();
    }
  }

  // Subscribe to a company's market updates
  subscribeToCompany(company) {
    this.socket.emit("subscribeToCompany", company);
  }

  // Listen for market updates
  onMarketUpdate(callback) {
    this.socket.on("market", callback);
  }

  onBuyLiquidUpdate(callback){
    this.socket.on("buy_liquid", callback)
  }

  onSellLiquidUpdate(callback){
    this.socket.on("sell_liquid", callback)
  }

  // Listen for buy/sell volume updates
  onBuyVolumeUpdate(callback) {
    this.socket.on("buy_volume", callback);
  }

  onSellVolumeUpdate(callback) {
    this.socket.on("sell_volume", callback);
  }

  // Remove listeners when the component unmounts
  removeListeners() {
    this.socket.off("market");
    this.socket.off("buy_volume");
    this.socket.off("sell_volume");
    this.socket.off("buy_liquid");
    this.socket.off("sell_liquid");
  }
}

// Create a singleton instance of the SocketService
const socketService = new SocketService();
export default socketService;
