import React, { useContext, createContext } from 'react';

import { useAddress, useContract, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';
import {
  CROWDFUNDING_CONTRACT_ABI,
  CROWDFUNDING_CONTRACT_ADDRESS,
} from '../constants/contract';

const StateContext = createContext();

export const StateContextProvider = ({ children }) => {
  const { contract, isLoading: isContractLoading, error: contractError } = useContract(
    CROWDFUNDING_CONTRACT_ADDRESS,
    CROWDFUNDING_CONTRACT_ABI,
  );

  const address = useAddress();
  const connect = useMetamask();

  const publishCampaign = async (form) => {
    try {
      if (!contract) {
        throw new Error('Contract is still loading. Please wait a moment and try again.');
      }

      if (!address) {
        throw new Error('Connect your wallet before creating a campaign.');
      }

      const data = await contract.call(
        'createCampaign',
        address,
        form.title,
        form.description,
        form.target,
        Math.floor(new Date(form.deadline).getTime() / 1000),
        form.image,
      );

      console.log("contract call success", data)
      return data;
    } catch (error) {
      console.log("contract call failure", error)
      throw error;
    }
  }

  const getCampaigns = async () => {
    if (!contract) return [];

    const campaigns = await contract.call('getCampaigns');

    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber() * 1000,
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaigns;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner.toLowerCase() === address?.toLowerCase()
    );

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    if (!contract) {
      throw new Error('Contract is still loading. Please wait a moment and try again.');
    }

    const data = await contract.call(
      'donateToCampaign',
      pId,
      { value: ethers.utils.parseEther(amount) },
    );

    return data;
  }

  const getDonations = async (pId) => {
    if (!contract) return [];

    const donations = await contract.call('getDonators', pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for(let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }


  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        isContractLoading,
        contractError,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);
