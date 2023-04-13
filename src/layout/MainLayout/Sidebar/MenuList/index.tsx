// material-ui
import { CircularProgress, Typography } from "@mui/material";

// project imports
import NavGroup from "./NavGroup";
import {
  menuItems,
  adminItems,
  timekeeperItems,
  hritems,
  corporatorItems,
  hoitems,
} from "@/components/menu-items";
import { use, useEffect, useState } from "react";
import { User } from "@prisma/client";
import axios from "axios";
import { useSession } from "next-auth/react";

// ==============================|| SIDEBAR MENU LIST ||============================== //

const MenuList = () => {
  const [navItems, setNavItems] = useState<any>();
  const { data: session } = useSession();

  console.log(session);

  const getNavItems = () => {
    let items = [];
    if (session?.user?.role === "Admin") {
      items = adminItems.items;
    } else if (
      session?.user?.role === "TimeKeeper" ||
      session?.user?.role === "None"
    ) {
      items = timekeeperItems.items;
    } else if (session?.user?.role === "HR") {
      items = hritems.items;
    } else if (
      session?.user?.role === "PlantCommercial" ||
      session?.user?.role === "HoCommercialAuditor"
    ) {
      items = hoitems.items;
    } else if (session?.user?.role === "Corporate") {
      items = corporatorItems.items;
    } else {
      items = timekeeperItems.items;
    }

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
