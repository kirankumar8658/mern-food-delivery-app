import React from "react";
import "./Nabvar.css";
import { assets } from "../../assets/assets";
const Nabvar = () => {
  return (
    <div className="navbar">
      <img src={assets.logo} alt="" className="logo" />
      <img src={assets.profile_image} alt="" className="profile" />
    </div>
  );
};

export default Nabvar;
