import { useDispatch, useSelector } from "react-redux";

// material-ui
import { ButtonBase, Typography } from "@mui/material";

// project imports
import { MENU_OPEN } from "@/store/actions";

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = () => {
  const defaultId = useSelector((state: any) => state.customization.defaultId);
  const dispatch = useDispatch();
  return (
    <ButtonBase
      disableRipple
      onClick={() => dispatch({ type: MENU_OPEN, id: defaultId })}
    >
      <Typography variant="h3" color="#5e35b1">
        Logo
      </Typography>
    </ButtonBase>
  );
};

export default LogoSection;
