import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import { useSession } from 'next-auth/react';

// ==============================|| MENU ITEMS ||============================== //

export default function menuItems(role: string) {
    return {
        items: [dashboard, pages]
    }
}
// const menuItems = {
//     items: [dashboard, pages]
// };

// export default menuItems;
