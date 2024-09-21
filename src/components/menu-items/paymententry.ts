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

const paymententry = {
  id: "pages",
  title: "Functional Roles",
  type: "group",
  children: [
    {
      id: "payments",
      title: "Payments",
      type: "collapse",
      icon: icons.AssignmentInd,

      children: [
        {
          id: "/payments",
          title: "Payments",
          type: "item",
          url: "/payments",
          target: true,
        },
        {
          id: "/payments/[id]",
          title: "Add Payment",
          type: "item",
          url: "/payments/add",
          target: true,
        },
      ],
    },
  ],
};

export default paymententry;

// // assets
// import { TextDecrease } from '@mui/icons-material';

// // constant
// const icons = {
//     TextDecrease
// };

// // ==============================|| UTILITIES MENU ITEMS ||============================== //

// const utilities = {
//     id: 'utilities',
//     title: 'Utilities',
//     type: 'group',
//     children: [
//         {
//             id: 'util-typography',
//             title: 'Typography',
//             type: 'item',
//             url: '/utils/util-typography',
//             icon: icons.TextDecrease,
//             breadcrumbs: false
//         },
//         {
//             id: 'util-color',
//             title: 'Color',
//             type: 'item',
//             url: '/utils/util-color',
//             icon: icons.TextDecrease,
//             breadcrumbs: false
//         },
//         {
//             id: 'util-shadow',
//             title: 'Shadow',
//             type: 'item',
//             url: '/utils/util-shadow',
//             icon: icons.TextDecrease,
//             breadcrumbs: false
//         },
//         {
//             id: 'icons',
//             title: 'Icons',
//             type: 'collapse',
//             icon: icons.TextDecrease,
//             children: [
//                 {
//                     id: 'tabler-icons',
//                     title: 'Tabler Icons',
//                     type: 'item',
//                     url: '/icons/tabler-icons',
//                     breadcrumbs: false
//                 },
//                 {
//                     id: 'material-icons',
//                     title: 'Material Icons',
//                     type: 'item',
//                     url: '/icons/material-icons',
//                     breadcrumbs: false
//                 }
//             ]
//         }
//     ]
// };

// export default utilities;
