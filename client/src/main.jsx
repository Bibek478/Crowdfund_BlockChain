import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { ThirdwebProvider } from '@thirdweb-dev/react';

import { StateContextProvider } from './context';
import { SEPOLIA_CHAIN, SEPOLIA_CHAIN_ID, SEPOLIA_RPC_URL } from './constants/contract';
import App from './App';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <ThirdwebProvider
    desiredChainId={SEPOLIA_CHAIN_ID}
    supportedChains={[SEPOLIA_CHAIN]}
    chainRpc={{ [SEPOLIA_CHAIN_ID]: SEPOLIA_RPC_URL }}
  >
    <Router>
      <StateContextProvider>
        <App />
      </StateContextProvider>
    </Router>
  </ThirdwebProvider> 
)
