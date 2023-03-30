import { useRouter } from "next/router";
import PropTypes from "prop-types";
import React, { useEffect } from "react";

// ==============================|| NAVIGATION SCROLL TO TOP ||============================== //

const NavigationScroll = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { pathname } = location;

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, [pathname]);

  return children || null;
};

NavigationScroll.propTypes = {
  children: PropTypes.node,
};

export default NavigationScroll;
