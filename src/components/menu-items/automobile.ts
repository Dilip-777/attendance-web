// assets
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import DescriptionIcon from "@mui/icons-material/Description";
import LocalShipping from "@mui/icons-material/LocalShipping";

// constant
const icons = { LocalShippingIcon, DescriptionIcon, LocalShipping };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const automobile = {
  id: "/vehiclelogbook",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "/vehicles",
      title: "Vehicles",
      type: "collapse",
      icon: icons.LocalShippingIcon,

      children: [
        {
          id: "/vehicles",
          title: "Vehicles",
          type: "item",
          url: "/vehicles",
          target: true,
        },
        {
          id: "/vehicles/add",
          title: "Add Vehicles",
          type: "item",
          url: "/vehicles/add",
          target: true,
        },
      ],
    },
    {
      id: "/hsd",
      title: "HSD",
      type: "collapse",
      icon: icons.LocalShippingIcon,

      children: [
        {
          id: "/hsd",
          title: "HSD",
          type: "item",
          url: "/hsd",
          target: true,
        },
        {
          id: "/hsd/add",
          title: "Add HSD",
          type: "item",
          url: "/hsd/add",
          target: true,
        },
      ],
    },
    {
      id: "/vehiclelogbook",
      title: "Vehicle Log Book",
      type: "item",
      url: "/vehiclelogbook",
      icon: icons.DescriptionIcon,
      breadcrumbs: false,
    },
    {
      id: "/automobile-finalsheet",
      title: "FinalSheet Hiring",
      type: "item",
      url: "/automobile-finalsheet",
      icon: icons.LocalShipping,
      breadcrumbs: false,
    },
  ],
};

export default automobile;
