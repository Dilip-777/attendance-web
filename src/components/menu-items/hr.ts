import AssignmentInd from "@mui/icons-material/AssignmentInd";
import Person from "@mui/icons-material/Person";
import TripOriginIcon from "@mui/icons-material/TripOrigin";
import Dashboard from "@mui/icons-material/Dashboard";
import FilterTiltShiftIcon from "@mui/icons-material/FilterTiltShift";
import Assignment from "@mui/icons-material/Assignment";
// constant
const icons = {
  AssignmentInd,
  Person,
  TripOriginIcon,
  Dashboard,
  FilterTiltShiftIcon,
  Assignment,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const hr = {
  id: "pages",
  title: "Functional Roles",
  type: "group",
  children: [
    {
      id: "contractors",
      title: "Contractors",
      type: "collapse",
      icon: icons.AssignmentInd,

      children: [
        {
          id: "/contractors",
          title: "Contractors List",
          type: "item",
          url: "/contractors",
          target: true,
        },
        {
          id: "/contractors/[id]",
          title: "Add Contractor",
          type: "item",
          url: "/contractors/add",
          target: true,
        },
      ],
    },
    {
      id: "employees",
      title: "Employees",
      type: "collapse",
      icon: icons.Person,

      children: [
        {
          id: "/employees",
          title: "Employees List",
          type: "item",
          url: "/employees",
          target: true,
        },
        {
          id: "/employees/[id]",
          title: "Add Employee",
          type: "item",
          url: "/employees/add",
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
      ],
    },
    {
      id: "/attendance",
      title: "Attendance Report",
      type: "item",
      url: "/attendance",
      icon: icons.Assignment,
      breadcrumbs: false,
    },
    {
      id: "/department",
      title: "Departments",
      type: "item",
      url: "/department",
      icon: icons.TripOriginIcon,
      breadcrumbs: false,
    },
    {
      id: "/designations",
      title: "Designations",
      type: "item",
      url: "/designations",
      icon: icons.Dashboard,
      breadcrumbs: false,
    },
    {
      id: "/shifts",
      title: "Shifts",
      type: "item",
      url: "/shifts",
      icon: icons.FilterTiltShiftIcon,
      breadcrumbs: false,
    },
  ],
};

export default hr;
