// material-ui
import { Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import {
  menuItems,
  adminItems,
  timekeeperItems,
  hritems,
  corporatorItems,
  hoitems,
  plantCommercialItems,
  storeitems,
  safetyitems,
} from "@/components/menu-items";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const [navItems, setNavItems] = useState<any>();
  const { data: session } = useSession();

  console.log(session);

  const getNavItems = () => {
    let items = [];
    if (session?.user?.role === "Admin") items = adminItems.items;
    else if (session?.user?.role === "TimeKeeper")
      items = timekeeperItems.items;
    else if (session?.user?.role === "HR") items = hritems.items;
    else if (session?.user?.role === "PlantCommercial")
      items = plantCommercialItems.items;
    else if (session?.user?.role === "Stores") items = storeitems.items;
    else if (session?.user?.role === "Safety") items = safetyitems.items;
    else if (session?.user?.role === "HoCommercialAuditor")
      items = hoitems.items;
    else if (session?.user?.role === "Corporate") items = corporatorItems.items;
    else items = timekeeperItems.items;

    const navItems1 = items?.map((item) => {
      switch (item.type) {
        case "group":
          return <NavGroup key={item.id} item={item} />;
        default:
          return (
            <Typography key={item.id} variant="h6" color="error" align="center">
              Menu Items Error
            </Typography>
          );
      }
    });
    setNavItems(navItems1);
  };
  useEffect(() => {
    getNavItems();
  }, [session]);

  return <>{navItems}</>;
};

export default MenuList;
