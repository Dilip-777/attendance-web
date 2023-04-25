import Inventory from '@mui/icons-material/Inventory';

// constant
const icons = {
       Inventory
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const store = {
     id: 'pages',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: 'store',
            title: 'Stores',
            type: 'collapse',
            icon: icons.Inventory,

            children: [
               {
                    id: '/store',
                    title: 'Stores',
                    type: 'item',
                    url: '/store',
                    target: true
                },
                {
                    id: '/store/[id]',
                    title: 'Add Store',
                    type: 'item',
                    url: '/store/add',
                    target: true
                },
            ]
        },
    ]
};

export default store;
