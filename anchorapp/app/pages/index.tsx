import { Container, Grid, Paper, Typography, useTheme } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import type { NextPage } from "next";
import React from "react";

const Home: NextPage = () => {
  const theme = useTheme();
  const wallet = useWallet();

  return (
    <React.Fragment>
      <Container
        sx={{
          marginTop: 5,
        }}
        maxWidth="xl"
      >
        <Grid
          container
          spacing={{ xs: 2, md: 3 }}
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{
            py: theme.spacing(2),
          }}
        >
          <Grid item>
            <Paper
              sx={{
                p: theme.spacing(2),
              }}
            >
              <Typography variant="h6" align="center">
                Public Key
              </Typography>
              <Typography variant="body1" align="center">
                {wallet.publicKey?.toString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </React.Fragment>
  );
};

export default Home;
