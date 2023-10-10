import { CHAIN, TonConnectButton } from "@tonconnect/ui-react";
import "@twa-dev/sdk";
import styled from "styled-components";
import "./App.css";
import logo from "./assets/hack-ton-berfest.jpg";
import { BusinessCard } from "./components/BusinessCard";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";

const StyledApp = styled.div`
  background-color: #12172c;
  color: white;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

const Logo = styled.div`
  height: 48px;
`;
function App() {
  const { network } = useTonConnect();

  return (
    <StyledApp>
      <AppContainer className={"container"}>
        <FlexBoxCol>
          <FlexBoxRow>
            <img src={logo} height={48} />
            <TonConnectButton />
            <Button>
              network {network === CHAIN.MAINNET ? "MAIN_NET" : "TEST-NET"}
            </Button>
          </FlexBoxRow>
          <BusinessCard />
        </FlexBoxCol>
      </AppContainer>
    </StyledApp>
  );
}

export default App;
