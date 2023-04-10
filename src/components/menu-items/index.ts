import dashboard from './dashboard';
import pages from './pages';
import utilities from './utilities';
import other from './other';
import admin from './admin';
import corporator from './utilities';

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
        items: [dashboard, pages, utilities]
}

const adminItems = {
    items: [admin]
}

const timekeeperItems = {
    items: [dashboard]
}

const hritems = {
    items: [dashboard, pages]
}

const corporatorItems = {
     items: [dashboard, corporator ]
}

export { menuItems, adminItems, timekeeperItems, hritems, corporatorItems}
