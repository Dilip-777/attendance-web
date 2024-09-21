// assets
// import {  Construction,  AssignmentInd, Person, Assignment, Storefront, Description, MonetizationOn, Summarize, Inventory, Support } from '@mui/icons-material';
import Construction from "@mui/icons-material/Construction";
import AssignmentInd from "@mui/icons-material/AssignmentInd";
import Person from "@mui/icons-material/Person";
import Assignment from "@mui/icons-material/Assignment";
import Storefront from "@mui/icons-material/Storefront";
import Description from "@mui/icons-material/Description";
import Summarize from "@mui/icons-material/Summarize";
import Inventory from "@mui/icons-material/Inventory";
import Support from "@mui/icons-material/Support";
import AccountBalanceWallet from "@mui/icons-material/AccountBalanceWallet";
import MonetizationOn from "@mui/icons-material/MonetizationOn";
import LocalShipping from "@mui/icons-material/LocalShipping";
import GroupWorkIcon from "@mui/icons-material/GroupWork";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import EqualizerIcon from "@mui/icons-material/Equalizer";

// constant
const icons = {
  Construction,
  AssignmentInd,
  Person,
  Assignment,
  Storefront,
  Description,
  MonetizationOn,
  Summarize,
  Support,
  Inventory,
  AccountBalanceWallet,
  LocalShipping,
  GroupWorkIcon,
  FactCheckIcon,
  EqualizerIcon,
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const mtr = {
  id: "pages",
  title: "Functional Roles",
  type: "group",
  children: [
    {
      id: "/mtr/divisions",
      title: "Division Wise",
      type: "item",
      url: "/mtr/divisions",
      icon: icons.MonetizationOn,
      breadcrumbs: false,
    },
    {
      id: "/mtr/functions",
      title: "Function Wise",
      type: "item",
      url: "/mtr/functions",
      icon: icons.Summarize,
      breadcrumbs: false,
    },
    {
      id: "/mtr/contractorwise",
      title: "Contractor Wise",
      type: "item",
      url: "/mtr/contractorwise",
      icon: icons.AccountBalanceWallet,
      breadcrumbs: false,
    },
    {
      id: "/mtr/monthly",
      title: "Monthly Billing",
      type: "item",
      url: "/mtr/monthly",
      icon: icons.AccountBalanceWallet,
      breadcrumbs: false,
    },
  ],
};

export default mtr;
