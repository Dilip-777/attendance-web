// assets
import Dashboard from "@mui/icons-material/Dashboard";

// constant
const icons = { Dashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const civil = {
    id: 'civil',
    title: 'Dashboard',
    type: 'group',
    children: [
        // {
        //     id: '/civil/measurement',
        //     title: 'Measurement Sheet',
        //     type: 'item',
        //     url: '/civil/measurement',
        //     icon: icons.Dashboard,
        //     breadcrumbs: false
        // },
         {
            id: '/civil/measurement',
            title: 'Measurement Sheet',
            type: 'collapse',
            icon: icons.Dashboard,

            children: [
                {
                    id: '/civil/measurement',
                    title: 'Measurement Sheet',
                    type: 'item',
                    url: '/civil/measurement',
                    target: true
                },
                {
                    id: '/civil/measurement/add',
                    title: 'Add Measurement Sheet',
                    type: 'item',
                    url: '/civil/measurement/add',
                    target: true
                }
            ]
        },
        {
            id: '/civil/abstract',
            title: 'Abstract Sheet',
            type: 'item',
            url: '/civil/abstract',
            icon: icons.Dashboard,
            breadcrumbs: false
        },
         {
            id: '/civil/barbending',
            title: 'Barbending Sheet',
            type: 'collapse',
            icon: icons.Dashboard,

            children: [
                {
                    id: '/civil/barbending',
                    title: 'Barbending Sheet',
                    type: 'item',
                    url: '/civil/barbending',
                    target: true
                },
                {
                    id: '/civil/barbending/add',
                    title: 'Add Barbending Sheet',
                    type: 'item',
                    url: '/civil/barbending/add',
                    target: true
                }
            ]
        },
    ]
};

export default civil;
