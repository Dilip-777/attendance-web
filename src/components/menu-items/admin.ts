
import Dashboard from "@mui/icons-material/Dashboard";


const icons = { Dashboard };


const admin = {
    id: '/admin',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: '/admin',
            title: 'Users',
            type: 'item',
            url: '/admin',
            icon: icons.Dashboard,
            breadcrumbs: false
        },
        {
            id: '/department',
            title: 'Departments',
            type: 'item',
            url: '/department',
            icon: icons.Dashboard,
            breadcrumbs: false
        },
        {
            id: '/designations',
            title: 'Designations',
            type: 'item',
            url: '/designations',
            icon: icons.Dashboard,
            breadcrumbs: false
        },
    ]
};

export default admin;
