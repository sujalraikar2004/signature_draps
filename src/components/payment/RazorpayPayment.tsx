import React, { useState, useEffect } from "react";
import api from "@/Api";

const RazorpayPayment = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [checkoutData, setCheckoutData] = useState<any>(null);



  useEffect(() => {
    const data = sessionStorage.getItem("checkoutData");
    if (data) {
      setCheckoutData(JSON.parse(data));
    } else {
      setMessage("No checkout data found. Please go back to Checkout page.");
    }
  }, []);
  console.log(checkoutData)

  const payNow = async () => {
    if (!checkoutData) {
      setMessage("Missing checkout data");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Step 1: Place order on backend
      const placeOrderRes = await api.post("/orders/place",
        {
          shippingAddress: checkoutData.shippingAddress,
          paymentMode: checkoutData.paymentMode,
        
        }
      );

      const { razorpayOrder, key, order } = placeOrderRes.data;

      if (!razorpayOrder || !key) {
        setMessage("Failed to create Razorpay order");
        setLoading(false);
        return;
      }

      // Step 2: Open Razorpay Checkout
      const options = {
        key,
        amount: razorpayOrder.amount,
        currency: "INR",
        name: "My Store",
        description: "Order Payment",
        order_id: razorpayOrder.id,
        handler: async function (response: any) {
          try {
            const verifyRes = await api.post("/orders/verify",
              {
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                receipt: order.orderId,
              }
            );
            setMessage(
              verifyRes.data.message || "Payment Verified Successfully!"
            );
            sessionStorage.removeItem("checkoutData"); 
          } catch (verifyErr: any) {
            setMessage(
              verifyErr.response?.data?.message ||
                "Payment verification failed"
            );
          }
          setLoading(false);
        },
        prefill: {
          name: checkoutData.shippingAddress.fullName,
          contact: checkoutData.shippingAddress.phone,
        },
        theme: {
          color: "#3399cc",
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setMessage("Payment popup closed");
          },
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      setMessage(
        err.response?.data?.message ||
          "Error placing order: " + err.message
      );
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "30px", fontFamily: "Arial, sans-serif" }}>
      <h1>Razorpay Payment</h1>
      <button
        onClick={payNow}
        disabled={loading || !checkoutData}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
      {message && (
        <p style={{ marginTop: "20px", fontWeight: "bold", color: "green" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default RazorpayPayment;
