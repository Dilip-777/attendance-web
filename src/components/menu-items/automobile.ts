// assets
import LocalShippingIcon from '@mui/icons-material/LocalShipping';

// constant
const icons = { LocalShippingIcon };

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const automobile = {
    id: '/vehiclelogbook',
    title: 'Dashboard',
    type: 'group',
    children: [
        {
            id: '/vehiclelogbook',
            title: 'Vehicle Log Book',
            type: 'item',
            url: '/vehiclelogbook',
            icon: icons.LocalShippingIcon,
            breadcrumbs: false
        }
    ]
};

export default automobile;
