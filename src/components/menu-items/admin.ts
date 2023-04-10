// assets
import { Dashboard } from "@mui/icons-material"

// constant
const icons = { Dashboard };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const admin = {
    id: '/admin',
    title: 'Users',
    type: 'group',
    children: [
        {
            id: '/admin',
            title: 'Users',
            type: 'item',
            url: '/admin',
            icon: icons.Dashboard,
            breadcrumbs: false
        }
    ]
};

export default admin;
