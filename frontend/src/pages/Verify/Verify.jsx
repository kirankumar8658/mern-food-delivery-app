import React, { useContext, useEffect } from "react";
import "./Verify.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../context/StoreContext.jsx";
import axios from "axios";

const Verify = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const success = searchParams.get("success") === "true"; // This ensures 'success' is a boolean
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  const verifyPayment = async () => {
    try {
      const response = await axios.post(url + "/api/order/verify", {
        success,
        orderId,
      });
      if (response.data.success) {
        navigate("/myorders");
        console.log(response.data.success, response.data);
      } else {
        navigate("/");
        console.log(response.data.success, response.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    verifyPayment();
  }, []);
  return (
    <div className="verify">
      <div className="spinner"></div>
    </div>
  );
};

export default Verify;
