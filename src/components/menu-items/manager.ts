// assets
import Dashboard from "@mui/icons-material/Dashboard";
import FilterTiltShiftIcon from "@mui/icons-material/FilterTiltShift";

// constant
const icons = { Dashboard, FilterTiltShiftIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const management = {
  id: "att-management",
  title: "Management",
  type: "group",
  children: [
    {
      id: "default",
      title: "Management",
      type: "item",
      url: "/att-management",
      icon: icons.Dashboard,
      breadcrumbs: false,
    },
    {
      id: "/shift",
      title: "Shifts",
      type: "item",
      url: "/shift",
      icon: icons.FilterTiltShiftIcon,
      breadcrumbs: false,
    },
  ],
};

export default management;
