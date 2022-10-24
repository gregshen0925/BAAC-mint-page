import type { NextPage } from 'next'
import Image from 'next/image'
import { Cursor, useTypewriter } from "react-simple-typewriter"
import React, { useEffect, useState } from 'react';
import BAAC from '../src/BAAC.jpg'
import toast from 'react-hot-toast'


const Home: NextPage = () => {
  const [address, setAddress] = useState<String | null>(null)
  const [isWalletConnected, setIsWalletConnected] = useState<boolean>(false)
  // const [connenctButtonText, setConnenctButtonText] = useState<String>('Connect')
  const [mintedAmount, setMintedAmount] = useState<number>(0)
  const [totalSupply, setTotalSupply] = useState<number>(0)
  const [amountLoading, setAmountLoading] = useState<boolean>(true)
  const [minted, setMinted] = useState<boolean>(true)
  // const [txLoading, setTxLoading] = useState<boolean>(false)
  // const [mintAmount, setMintAmount] = useState(1)
  // const cmAddress = data.candymachine.cmPublicKey;
  // const coverImg = data.collection.collectionCover;
  // const collectionName = data.collection.collectionName;



  const [text, count] = useTypewriter({
    words: [
      `Bored Ape Aptos Club`,
    ],
    // loop: true,
    delaySpeed: 2000,
  })

  useEffect(() => {
    connectWallet()
  }, [])

  useEffect(() => {
    const fetchNFTDropData = async () => {
      setAmountLoading(true)

      const totalMinted = await getMintedAmount()
      const total = await getTotalAmount()

      setMintedAmount(totalMinted)
      setTotalSupply(total)
      setAmountLoading(false)
    }

    fetchNFTDropData()
  }, [])

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
  //   setMintAmount(e.target.valueAsNumber)
  // };

  const getMintedAmount = () => {
    // getMintedAmount
    return 1
  }
  const getTotalAmount = () => {
    // getTotalAmount
    return 1
  }

  const connectWallet = async () => {
    if ("martian" in window) {
      console.log("connecting wallet")
      const response = await window.martian.connect();
      const address = response.address
      console.log(address);
      setAddress(address)
      const isConnected = await window.martian.isConnected()
      if (isConnected) {
        setIsWalletConnected(true)
      }
      console.log("wallet connected");
      // setConnenctButtonText('Connected');
      return;
    }
    window.open("https://www.martianwallet.xyz/", "_blank");
  };

  const handleCheckResource = async () => {
    const response = await window.martian.connect();
    const address = response.address
    console.log(address);
    const transactions = await window.martian.getAccountResources(address)
    console.log(transactions);
  }

  const handleMint = async () => {
    if (!address) {
      toast.error('Connect Wallet First')
      return
    }
    // if (!mintAmount) {
    //   toast.error('Input a number')
    //   setMintAmount(1)
    //   return
    // }
    // if (mintAmount < 1) {
    //   toast.error('Mint at least one!')
    //   setMintAmount(1)
    //   return
    // }
    console.log(address);
    // Generate a transaction
    const payload = {
      // type: "entry_function_payload",
      function: "0x5ac985f1fe40c5121eb33699952ce8a79b1d1cb7438709dbd1da8e840a04fbee::candy_machine_v2::mint_tokens",
      type_arguments: [],
      arguments: [
        // cmAddress,
        // collectionName,
        "0x30957ce23fa2e31cb10766e27e950cf8aa2245e3273f2e18b2ef84ad4870cd9e",
        "TestCollection101",
        1,
      ]
    };
    const transaction = await window.martian.generateTransaction(address, payload);
    const txnHash = await window.martian.signAndSubmitTransaction(transaction);
    console.log(txnHash);
  }



  return (
    <div className="h-screen flex flex-col space-y-10 justify-center bg-black
    text-center overflow-hidden">
      <title>Bored Ape Aptos Club Mint</title>
      <h1 className='text-white font-bold text-3xl md:text-5xl '>{text}</h1>
      <div>
        <div className='relative h-40 w-40 md:h-60 md:w-60 mx-auto'>
          <Image
            src={BAAC}
            layout="fill"
            objectFit="cover"
            className="rounded-full"
            alt=""
          />
        </div>
        <div className='z-20 py-5'>
          <h2 className="text-sm uppercase text-gray-500 pb-2 tracking-[5px] md:tracking-[5px]">
            {amountLoading ? (
              <h1>Loading supply count...</h1>
            ) : (
              <div>&nbsp; {mintedAmount}/{totalSupply}</div>
            )}

          </h2>
          <h1 className="text-3xl md:text-4xl font-semibold px-10 text-[#447de6]">
            <span className="mr-3">&nbsp;One mint per wallet</span>
          </h1>

          <div className="pt-5">
            <div>
              {(!address) && <button onClick={connectWallet}
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full py-2 px-3 font-semibold items-right"
              >Connect Wallet</button>}

              {(address) && (!minted) && <div className=''>
                {/* <input
                  type="number"
                  onChange={handleChange}
                  value={mintAmount}
                  placeholder='Amount to mint'
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-50 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 items-center"
                /> */}
                <button onClick={handleMint}
                  className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 rounded-lg px-4 py-2 font-semibold"
                >Mint 1 for 2.5 APT</button>
              </div>}

              {(address) && (minted) && <div className='text-white font-bold text-xl'>
                You've minted one!
              </div>}
              <button onClick={handleCheckResource} className='text-white'>resources</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
