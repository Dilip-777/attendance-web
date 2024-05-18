// assets
import Dashboard from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ArticleIcon from "@mui/icons-material/Article";

// constant
const icons = {
  ArticleIcon,
  AccountTreeIcon,
  DesignServicesIcon,
  EngineeringIcon,
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const civil = {
  id: "civil",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "/civil/measurement",
      title: "Measurement Sheet",
      type: "collapse",
      icon: icons.DesignServicesIcon,

      children: [
        {
          id: "/civil/measurement",
          title: "Measurement Sheet",
          type: "item",
          url: "/civil/measurement",
          target: true,
        },
        {
          id: "/civil/measurement/add",
          title: "Add Measurement Sheet",
          type: "item",
          url: "/civil/measurement/add",
          target: true,
        },
      ],
    },
    {
      id: "/civil/abstract",
      title: "Abstract Sheet",
      type: "item",
      url: "/civil/abstract",
      icon: icons.ArticleIcon,
      breadcrumbs: false,
    },
    {
      id: "/civil/barbending",
      title: "Barbending Sheet",
      type: "collapse",
      icon: icons.EngineeringIcon,

      children: [
        {
          id: "/civil/barbending",
          title: "Barbending Sheet",
          type: "item",
          url: "/civil/barbending",
          target: true,
        },
        {
          id: "/civil/barbending/add",
          title: "Add Barbending Sheet",
          type: "item",
          url: "/civil/barbending/add",
          target: true,
        },
      ],
    },
  ],
};

export default civil;
