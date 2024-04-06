// assets
import RateReviewIcon from "@mui/icons-material/RateReview";

// constant
const icons = { RateReviewIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const fixed = {
  id: "fixed",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "/data-entry",
      title: "Data Entry",
      type: "item",
      url: "/data-entry",
      icon: icons.RateReviewIcon,
      breadcrumbs: false,
    },
  ],
};

export default fixed;
