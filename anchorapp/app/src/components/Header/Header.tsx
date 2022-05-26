import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { NextRouter, withRouter } from "next/router";
import React from "react";

interface Props {
  toggleColorMode: () => void;
  router: NextRouter;
}

const Header: React.FC<Props> = (props: Props) => {
  const theme = useTheme();

  return (
    <React.Fragment>
      <AppBar position="static">
        <Toolbar>
          <Typography
            sx={{ flexGrow: 1, cursor: "pointer", paddingLeft: 1 }}
            variant="h4"
          >
            CSE223B
          </Typography>
          <Tooltip title="Dark Mode">
            <IconButton onClick={props.toggleColorMode}>
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Tooltip>
          <Box sx={{
            px: 1,
          }}>
            <WalletMultiButton />
          </Box>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};

export default withRouter(Header);
