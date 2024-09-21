// assets
import Dashboard from "@mui/icons-material/Dashboard";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DesignServicesIcon from "@mui/icons-material/DesignServices";
import EngineeringIcon from "@mui/icons-material/Engineering";
import ArticleIcon from "@mui/icons-material/Article";
import Assignment from "@mui/icons-material/Assignment";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import Description from "@mui/icons-material/Description";

// constant
const icons = {
  ArticleIcon,
  AccountTreeIcon,
  DesignServicesIcon,
  EngineeringIcon,
  Assignment,
  EqualizerIcon,
  FactCheckIcon,
  Description,

  // AccountTreeIcon,
  // DesignServicesIcon,
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const civil = {
  id: "civil",
  title: "Dashboard",
  type: "group",
  children: [
    {
      id: "/civil/project",
      title: "Project",
      type: "collapse",
      icon: icons.AccountTreeIcon,

      children: [
        {
          id: "/civil/project",
          title: "Project",
          type: "item",
          url: "/civil/project",
          target: true,
        },
        {
          id: "/civil/project/add",
          title: "Add Project",
          type: "item",
          url: "/civil/project/add",
          target: true,
        },
      ],
    },
    {
      id: "workorder",
      title: "Work Order",
      type: "collapse",
      icon: icons.Assignment,

      children: [
        {
          id: "/workorder",
          title: "Work Order List",
          type: "item",
          url: "/workorder",
          target: true,
        },
        {
          id: "/wordorder/[id]",
          title: "Add Work Order",
          type: "item",
          url: "/workorder/add",
          target: true,
        },
      ],
    },

    {
      id: "/civil/boq",
      title: "BOQ Sheet",
      type: "collapse",
      icon: icons.DesignServicesIcon,

      children: [
        {
          id: "/civil/boq",
          title: "BOQ Sheet",
          type: "item",
          url: "/civil/boq",
          target: true,
        },
        {
          id: "/civil/boq/add",
          title: "Add BOQ Sheet",
          type: "item",
          url: "/civil/boq/add",
          target: true,
        },
        {
          id: "/civil/boq/extra",
          title: "Add Extra BOQ",
          type: "item",
          url: "/civil/boq/extra",
          target: true,
        },
        {
          id: "/civil/boq/boqformat",
          title: "BOQ Format",
          type: "item",
          url: "/civil/boq/boqformat",
          target: true,
        },
      ],
    },
    {
      id: "qcs",
      title: "QCS",
      type: "collapse",
      icon: icons.FactCheckIcon,

      children: [
        {
          id: "/qcs",
          title: "QCS",
          type: "item",
          url: "/qcs",
          target: true,
        },
        {
          id: "/qcs/[id]",
          title: "Add QCS",
          type: "item",
          url: "/qcs/add",
          target: true,
        },
      ],
    },
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
    {
      id: "/civil/workanalysis",
      title: "Work Analysis",
      type: "item",
      url: "/civil/workanalysis",
      icon: icons.EqualizerIcon,
      breadcrumbs: false,
    },
    {
      id: "/civil/finalsheet",
      title: "Civil Final Sheet",
      type: "item",
      url: "/civil/finalsheet",
      icon: icons.Description,
      breadcrumbs: false,
    },
  ],
};

export default civil;
