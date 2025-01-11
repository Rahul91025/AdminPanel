import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Order = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [sortedOrders, setSortedOrders] = useState([]);
  const [sortOrder, setSortOrder] = useState("asc");
  const sourceAddress = "Patai, Bhubaneswar, INDIA"; // Source address

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        const ordersWithDistance = await calculateDistances(
          response.data.orders.reverse()
        );
        setOrders(ordersWithDistance);
        setSortedOrders(ordersWithDistance);
      } else {
        toast.error("Failed to fetch orders");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch orders");
    }
  };

  const calculateDistances = async (orders) => {
    const updatedOrders = await Promise.all(
      orders.map(async (order) => {
        try {
          const destinationAddress = `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}`;
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${encodeURIComponent(
              sourceAddress
            )}&destinations=${encodeURIComponent(
              destinationAddress
            )}&key=qQxFRT8S19bZN8QocZ-UAm7MEt2h4VeXOyCFMefhbEc`
          );

          const distance =
            response.data.rows[0].elements[0].distance.text || "N/A";
          return { ...order, distance };
        } catch (error) {
          console.error("Error calculating distance:", error);
          return { ...order, distance: "Error" };
        }
      })
    );
    return updatedOrders;
  };

  const sortOrdersByDistance = (order) => {
    const sorted = [...orders].sort((a, b) => {
      const distanceA = parseFloat(a.distance.split(" ")[0]);
      const distanceB = parseFloat(b.distance.split(" ")[0]);
      return sortOrder === "asc"
        ? distanceA - distanceB
        : distanceB - distanceA;
    });
    setSortedOrders(sorted);
    setSortOrder(order);
  };

  const openGoogleMaps = (destination) => {
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(
      sourceAddress
    )}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
    window.open(url, "_blank");
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        toast.success("Order status updated successfully");
        await fetchAllOrders();
      } else {
        toast.error("Failed to update order status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to update order status");
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div>
      <h3>Order Page</h3>
      <div className="mb-4">
        <label className="font-medium text-sm">Sort by Distance:</label>
        <select
          className="ml-2 p-2 border rounded"
          value={sortOrder}
          onChange={(e) => sortOrdersByDistance(e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
      <div>
        {sortedOrders.map((order, index) => (
          <div
            className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 text-xs sm:text-sm text-gray-700"
            key={index}
          >
            <img className="w-12" src={assets.parcel_icon} alt="" />
            <div>
              <div>
                {order.items.map((item, index) => (
                  <p className="py-0.5" key={index}>
                    {item.name} x {item.quantity} <span>{item.size}</span>
                  </p>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div>
                <p>{order.address.street + ","}</p>
                <p>
                  {order.address.city +
                    ", " +
                    order.address.state +
                    ", " +
                    order.address.country +
                    ", " +
                    order.address.zipcode}
                </p>
              </div>

              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className="text-sm sm:text-[15px]">
                Items: {order.items.length}
              </p>
              <p className="mt-3">Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? "Done" : "Pending"}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="text-sm sm:text-[15px]">
              {currency}
              {order.amount}
            </p>
            <p className="text-sm sm:text-[15px]">Distance: {order.distance}</p>
            <button
              onClick={() =>
                openGoogleMaps(
                  `${order.address.street}, ${order.address.city}, ${order.address.state}, ${order.address.country}`
                )
              }
              className="text-blue-500 underline mt-3"
            >
              View on Map
            </button>
            <select
              onChange={(e) => statusHandler(e, order._id)}
              value={order.status}
              className="p-2 font-semibold"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Order;
