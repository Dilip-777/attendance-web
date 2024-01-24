// assets
import Dashboard from "@mui/icons-material/Dashboard";

// constant
const icons = { Dashboard };

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
  ],
};

export default management;
