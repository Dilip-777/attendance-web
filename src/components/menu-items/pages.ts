// assets
import {  AssignmentInd, Person } from '@mui/icons-material';

// constant
const icons = {
      AssignmentInd, Person
};

// ==============================|| EXTRA PAGES MENU ITEMS ||============================== //

const pages = {
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
        }
    ]
};

export default pages;