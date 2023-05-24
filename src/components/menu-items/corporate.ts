
// assets
// import {  Construction,  AssignmentInd, Person, Assignment, Storefront, Description, MonetizationOn, Summarize, Inventory, Support } from '@mui/icons-material';
import Construction from '@mui/icons-material/Construction';
import AssignmentInd from '@mui/icons-material/AssignmentInd';
import Person from '@mui/icons-material/Person';
import Assignment from '@mui/icons-material/Assignment';
import Storefront from '@mui/icons-material/Storefront';
import Description from '@mui/icons-material/Description';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import Summarize from '@mui/icons-material/Summarize';
import Inventory from '@mui/icons-material/Inventory';
import Support from '@mui/icons-material/Support';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';


// constant
const icons = {
     Construction, AssignmentInd, Person, Assignment, Storefront,Description, MonetizationOn, Summarize, Support, Inventory, AccountBalanceWallet
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
                    target: true
                },
                {
                    id: '/contractors/[id]',
                    title: 'Add Contractor',
                    type: 'item',
                    url: '/contractors/add',
                    target: true
                }
            ]
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
                    target: true
                },
                {
                    id: '/employees/[id]',
                    title: 'Add Employee',
                    type: 'item',
                    url: '/employees/add',
                    target: true
                },
            ]
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
                    target: true
                },
                {
                    id: '/wordorder/[id]',
                    title: 'Add Work Order',
                    type: 'item',
                    url: '/workorder/add',
                    target: true
                }
            ]
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
            url: "/safety",
            icon: icons.Support,
             breadcrumbs: false
        },
         {
            id: '/hoauditor',
            title: 'HO Commercial',
            type: 'item',
            url: '/hoauditor',
            icon: icons.Storefront,
            breadcrumbs: false
        },
         {
            id: '/finalsheet',
            title: 'Final Sheet',
            type: 'item',
            url: '/finalsheet',
            icon: icons.Description,
            breadcrumbs: false
        },
         {
            id: '/payouttracker',
            title: 'Payout Tracker',
            type: 'item',
            url: '/payouttracker',
            icon: icons.MonetizationOn,
            breadcrumbs: false
        },
         {
            id: '/report',
            title: 'Report',
            type: 'item',
            url: '/report',
            icon: icons.Summarize,
            breadcrumbs: false
        },
         {
            id: '/bills',
            title: 'Bills',
            type: 'item',
            url: '/bills',
            icon: icons.AccountBalanceWallet,
            breadcrumbs: false
        },
    ]
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
