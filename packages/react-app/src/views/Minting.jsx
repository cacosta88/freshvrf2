import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Card, List } from "antd";
import { Address, AddressInput, Mint } from "../components";
import { ethers } from "ethers";
import { useContractReader } from "eth-hooks";

function Minting({
  DEBUG,
  readContracts,
  writeContracts,
  tx,
  mainnetProvider,
  blockExplorer,
  address,
  updateBalances,
  setUpdateBalances,
}) {
  const [loogieBalance, setLoogieBalance] = useState(0);
  const [yourLoogieBalance, setYourLoogieBalance] = useState(0);
  const [yourLoogies, setYourLoogies] = useState();
  const [yourLoogiesApproved, setYourLoogiesApproved] = useState({});
  const [transferToAddresses, setTransferToAddresses] = useState({});
  const [loadingOptimisticLoogies, setLoadingOptimisticLoogies] = useState(true);

  //const priceToMint = useContractReader(readContracts, "Loogies", "price");
  //if (DEBUG) console.log("🤗 priceToMint:", priceToMint);

  const totalSupply = useContractReader(readContracts, "YourContract", "totalSupply");
  //if (DEBUG) console.log("🤗 totalSupply:", totalSupply);
  //const loogiesLeft = 3728 - totalSupply;

  useEffect(() => {
    const updateBalances = async () => {
      if (DEBUG) console.log("Updating balances...");
      if (readContracts.YourContract) {
        const loogieNewBalance = await readContracts.YourContract.balanceOf(address);
        const yourLoogieNewBalance = loogieNewBalance && loogieNewBalance.toNumber && loogieNewBalance.toNumber();
        if (DEBUG) console.log("NFT: Loogie - Balance: ", loogieNewBalance);
        setLoogieBalance(loogieNewBalance);
        setYourLoogieBalance(yourLoogieNewBalance);
      } else {
        if (DEBUG) console.log("Contracts not defined yet.");
      }
    };
    updateBalances();
  }, [address, readContracts.YourContract, updateBalances]);

  useEffect(() => {
    const updateYourCollectibles = async () => {
      setLoadingOptimisticLoogies(true);
      const loogieUpdate = [];
      const loogieApproved = {};
      for (let tokenIndex = 0; tokenIndex < yourLoogieBalance; tokenIndex++) {
        try {
          const tokenId = await readContracts.YourContract.tokenOfOwnerByIndex(address, tokenIndex);
          if (DEBUG) console.log("Getting Loogie tokenId: ", tokenId);
          const tokenURI = await readContracts.YourContract.tokenURI(tokenId);
          if (DEBUG) console.log("tokenURI: ", tokenURI);
          const jsonManifestString = atob(tokenURI.substring(29));

          try {
            const jsonManifest = JSON.parse(jsonManifestString);
            loogieUpdate.push({ id: tokenId, uri: tokenURI, owner: address, ...jsonManifest });
            let approved = await readContracts.YourContract.getApproved(tokenId);
            loogieApproved[tokenId] = approved;
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
      setYourLoogies(loogieUpdate.reverse());
      setYourLoogiesApproved(loogieApproved);
      setLoadingOptimisticLoogies(false);
    };
    updateYourCollectibles();
  }, [address, yourLoogieBalance]);

  return (
    <>
      <div style={{ maxWidth: 820, margin: "auto", marginTop: 32, paddingBottom: 5 }}>
        <div style={{ fontSize: 16 }}>
          <p>
            {readContracts.YourContract.canmintnft() ? (
              <Mint />
            ) : (
              <div>
                <p>can not mint</p>
              </div>
            )}
          </p>
        </div>
      </div>
    </>
  );
}

export default Minting;
