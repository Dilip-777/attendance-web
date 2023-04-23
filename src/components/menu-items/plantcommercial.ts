import AssignmentInd from '@mui/icons-material/AssignmentInd';
import Person from '@mui/icons-material/Person';
import Storefront from '@mui/icons-material/Storefront';
import Support from '@mui/icons-material/Support';
import Inventory from '@mui/icons-material/Inventory';

// constant
const icons = {
      AssignmentInd, Person, Storefront, Inventory, Support
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const plantCommercial = {
     id: 'pages',
    title: 'Pages',
    caption: 'Pages Caption',
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
    ]
};

export default plantCommercial;