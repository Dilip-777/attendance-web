import AssignmentInd from '@mui/icons-material/AssignmentInd';
import Person from '@mui/icons-material/Person';
import Storefront from '@mui/icons-material/Storefront';
import Inventory from '@mui/icons-material/Inventory';
import SupportIcon from '@mui/icons-material/Support';
import AccountBalanceWallet from '@mui/icons-material/AccountBalanceWallet';
import MonetizationOn from '@mui/icons-material/MonetizationOn';
import Assignment from '@mui/icons-material/Assignment';
import Description from '@mui/icons-material/Description';

// constant
const icons = {
  AssignmentInd,
  Person,
  Storefront,
  Inventory,
  SupportIcon,
  AccountBalanceWallet,
  MonetizationOn,
  Assignment,
  Description,
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const ho = {
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
      icon: icons.SupportIcon,
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
      ],
    },
    {
      id: '/notesheet',

      title: 'Note Sheet',
      type: 'item',
      url: '/notesheet',
      icon: icons.Description,
      breadcrumbs: false,
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
      id: '/bills',
      title: 'Bills',
      type: 'item',
      url: '/bills',
      icon: icons.AccountBalanceWallet,
      breadcrumbs: false,
    },
  ],
};

export default ho;
