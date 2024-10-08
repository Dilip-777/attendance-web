// assets
// import {  Construction,  AssignmentInd, Person, Assignment, Storefront, Description, MonetizationOn, Summarize, Inventory, Support } from '@mui/icons-material';
import Construction from '@mui/icons-material/Construction';
import AssignmentInd from '@mui/icons-material/AssignmentInd';
import Person from '@mui/icons-material/Person';
import Assignment from '@mui/icons-material/Assignment';
import Storefront from '@mui/icons-material/Storefront';
import Description from '@mui/icons-material/Description';
import Summarize from '@mui/icons-material/Summarize';
import Inventory from '@mui/icons-material/Inventory';
import Support from '@mui/icons-material/Support';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import LocalShipping from '@mui/icons-material/LocalShipping';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import EqualizerIcon from '@mui/icons-material/Equalizer';

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

const corporator = {
  id: 'pages',
  title: 'Functional Roles',
  type: 'group',
  children: [
    {
      id: 'contractors',
      title: 'Contractors',
      type: 'collapse',
      icon: icons.AssignmentInd,

      children: [
        {
          id: '/contractors',
          title: 'Contractors List',
          type: 'item',
          url: '/contractors',
          target: true,
        },
        {
          id: '/contractors/[id]',
          title: 'Add Contractor',
          type: 'item',
          url: '/contractors/add',
          target: true,
        },
      ],
    },
    {
      id: 'employees',
      title: 'Employees',
      type: 'collapse',
      icon: icons.Person,

      children: [
        {
          id: '/employees',
          title: 'Employees List',
          type: 'item',
          url: '/employees',
          target: true,
        },
        {
          id: '/employees/[id]',
          title: 'Add Employee',
          type: 'item',
          url: '/employees/add',
          target: true,
        },
      ],
    },
    {
      id: 'workorder',
      title: 'Work Order',
      type: 'collapse',
      icon: icons.Assignment,

      children: [
        {
          id: '/workorder',
          title: 'Work Order List',
          type: 'item',
          url: '/workorder',
          target: true,
        },
        {
          id: '/wordorder/[id]',
          title: 'Add Work Order',
          type: 'item',
          url: '/workorder/add',
          target: true,
        },
      ],
    },
    {
      id: 'works',
      title: 'Works',
      type: 'collapse',
      icon: icons.GroupWorkIcon,

      children: [
        {
          id: '/works',
          title: 'Works',
          type: 'item',
          url: '/works',
          target: true,
        },
        {
          id: '/works/[id]',
          title: 'Add Works',
          type: 'item',
          url: '/works/add',
          target: true,
        },
      ],
    },
    {
      id: 'qcs',
      title: 'QCS',
      type: 'collapse',
      icon: icons.FactCheckIcon,

      children: [
        {
          id: '/qcs',
          title: 'QCS',
          type: 'item',
          url: '/qcs',
          target: true,
        },
        {
          id: '/qcs/[id]',
          title: 'Add QCS',
          type: 'item',
          url: '/qcs/add',
          target: true,
        },
      ],
    },

    {
      id: '/store',
      title: 'Stores',
      type: 'item',
      url: '/store',
      icon: icons.Inventory,
      breakcrumbs: false,
    },
    {
      id: '/safety',
      title: 'Safety',
      type: 'item',
      url: '/safety',
      icon: icons.Support,
      breadcrumbs: false,
    },
    {
      id: '/deductions',
      title: 'GST Management',
      type: 'collapse',
      icon: icons.MonetizationOn,

      children: [
        {
          id: '/deductions/hold',
          title: 'GST Hold',
          type: 'item',
          url: '/deductions/hold',
          target: true,
        },
        {
          id: '/deductions/release',
          title: 'GST Release',
          type: 'item',
          url: '/deductions/release',
          target: true,
        },
      ],
    },

    {
      id: '/hoauditor',
      title: 'HO Commercial',
      type: 'item',
      url: '/hoauditor',
      icon: icons.Storefront,
      breadcrumbs: false,
    },
    {
      id: '/civil/workanalysis',
      title: 'Work Analysis',
      type: 'item',
      url: '/civil/workanalysis',
      icon: icons.EqualizerIcon,
      breadcrumbs: false,
    },

    {
      id: 'payments',
      title: 'Payments',
      type: 'collapse',
      icon: icons.MonetizationOn,

      children: [
        {
          id: '/payments',
          title: 'Payments',
          type: 'item',
          url: '/payments',
          target: true,
        },
        {
          id: '/payments/[id]',
          title: 'Add Payment',
          type: 'item',
          url: '/payments/add',
          target: true,
        },
      ],
    },

    {
      id: '/finalsheet',

      title: 'Final Sheet',
      type: 'item',
      url: '/finalsheet',
      icon: icons.Description,
      breadcrumbs: false,
    },

    {
      id: '/automobile-finalsheet',
      title: 'FinalSheet Hiring',
      type: 'item',
      url: '/automobile-finalsheet',
      icon: icons.LocalShipping,
      breadcrumbs: false,
    },
    {
      id: '/fixedfinalsheet',
      title: 'Fixed Final Sheet',
      type: 'item',
      url: '/fixedfinalsheet',
      icon: icons.Description,
      breadcrumbs: false,
    },
    {
      id: '/civil/finalsheet',
      title: 'Civil Final Sheet',
      type: 'item',
      url: '/civil/finalsheet',
      icon: icons.Description,
      breadcrumbs: false,
    },
    {
      id: '/payouttracker',
      title: 'Payout Tracker',
      type: 'item',
      url: '/payouttracker',
      icon: icons.MonetizationOn,
      breadcrumbs: false,
    },
    {
      id: '/report',
      title: 'Report',
      type: 'item',
      url: '/report',
      icon: icons.Summarize,
      breadcrumbs: false,
    },
    {
      id: '/bills',
      title: 'Bills',
      type: 'item',
      url: '/bills',
      icon: icons.AccountBalanceWallet,
      breadcrumbs: false,
    },
  ],
};

export default corporator;

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
