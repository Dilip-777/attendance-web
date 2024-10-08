import dashboard from "./dashboard";
import hr from "./hr";
import utilities from "./corporate";
import admin from "./admin";
import corporator from "./corporate";
import ho from "./ho";
import plantCommercial from "./plantcommercial";
import store from "./store";
import safety from "./safety";
import automobile from "./automobile";
import civil from "./civil";
import management from "./manager";
import fixed from "./fixed";
import workorder from "./workorder";
import accounts from "./accounts";
import paymententry from "./paymententry";
import mtr from "./mtr";

// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, hr, utilities],
};

const adminItems = {
  items: [admin],
};

const timekeeperItems = {
  items: [dashboard],
};

const plantCommercialItems = {
  items: [dashboard, plantCommercial],
};

const hritems = {
  items: [dashboard, hr],
};

const hoitems = {
  items: [dashboard, ho],
};

const corporatorItems = {
  items: [dashboard, corporator],
};

const storeitems = {
  items: [store],
};

const safetyitems = {
  items: [safety],
};

const automobileItems = {
  items: [automobile],
};

const civilItems = {
  items: [civil],
};

const managerItems = {
  items: [management],
};

const fixedItems = {
  items: [fixed],
};

const workorderItems = {
  items: [workorder],
};

const accountItems = {
  items: [accounts],
};

const paymententryItems = {
  item: [paymententry],
};

const mtrItems = {
  items: [mtr],
};

export {
  menuItems,
  adminItems,
  timekeeperItems,
  hritems,
  hoitems,
  corporatorItems,
  plantCommercialItems,
  storeitems,
  safetyitems,
  automobileItems,
  civilItems,
  managerItems,
  fixedItems,
  workorderItems,
  accountItems,
  paymententryItems,
  mtrItems,
};
