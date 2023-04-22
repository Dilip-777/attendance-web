import SupportIcon from '@mui/icons-material/Support';

// constant
const icons = {
       SupportIcon
};

// ==============================|| SAMPLE PAGE & DOCUMENTATION MENU ITEMS ||============================== //

const safety = {
     id: 'pages',
    title: 'Pages',
    caption: 'Pages Caption',
    type: 'group',
    children: [
        {
            id: 'safety',
            title: 'Safety',
            type: 'collapse',
            icon: icons.SupportIcon,

            children: [
               {
                    id: '/safety',
                    title: 'Safety',
                    type: 'item',
                    url: '/safety',
                    target: true
                },
                {
                    id: '/safety/[id]',
                    title: 'Add Safety',
                    type: 'item',
                    url: '/safety/add',
                    target: true
                },
            ]
        },
    ]
};

export default safety;
