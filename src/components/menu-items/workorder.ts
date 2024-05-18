// assets
// import {  Construction,  AssignmentInd, Person, Assignment, Storefront, Description, MonetizationOn, Summarize, Inventory, Support } from '@mui/icons-material';
import Assignment from "@mui/icons-material/Assignment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import DesignServicesIcon from "@mui/icons-material/DesignServices";

// constant
const icons = {
  Assignment,
  AccountTreeIcon,
  DesignServicesIcon,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const workorder = {
  id: "pages",
  title: "Functional Roles",
  type: "group",
  children: [
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
      ],
    },
  ],
};

export default workorder;
