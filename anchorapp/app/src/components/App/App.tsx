import React from "react";
import { useDarkModeManager } from "../../state/user/hooks";
import UserUpdater from "../../state/user/updater";
import Header from "../Header";
import Wallet from "../Wallets";

function Updaters() {
  return (
    <React.Fragment>
      <UserUpdater />
    </React.Fragment>
  );
}

const App = ({ children }: { children: React.ReactNode }) => {
  const [_, toggleDarkMode] = useDarkModeManager();

  return (
    <React.Fragment>
      <Updaters />
      <Wallet>
        <React.Fragment>
          <Header toggleColorMode={toggleDarkMode} />
          {children}
        </React.Fragment>
      </Wallet>
    </React.Fragment>
  );
};

export default App;
