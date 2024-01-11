import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { styled } from 'styled-components'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import * as ABI from '../../bin/contracts/Faucet.json'
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import Countdown from './Countdown'
import CustomButton from './CustomButton'

const FaucetContained  = styled.div`
    width: 100%;
    background-color: #141414;
    color: white;
    padding: 40px !important;
    border-radius: 30px;
    line-height: 30px;

    @media (max-width: 426px){
        padding: 40px 20px !important;
    }
`

const H1 = styled.h1`
    font-size: 60px;
    font-weight: 800;

    @media (max-width: 1024px){
        font-size: 44px
    }

    @media (max-width: 426px){
        font-size: 26px;
    }

`

const P = styled.p`
    color: grey;
    font-weight: 800;
`

const Copy = styled.p`
    color: white;
    padding: 1px 10px; 
    border-radius: 15px; 
    background-color: black;
    width: fit-content;
    text-align: center;
    font-weight: 600;

    @media (max-width: 769px){
        font-size: 10px !important;
        font-weight: 200;
    }
`


const CRYPTO_NAME =import.meta.env.VITE_CRYPTO_NAME;
const SYMBOL =import.meta.env.VITE_CRYPTO_SYMBOL;
const CHAIN_ID =import.meta.env.VITE_CHAIN_ID
const CHAIN_NAME =import.meta.env.VITE_CHAIN_NAME
const DECIMALS =import.meta.env.VITE_DECIMALS
const RPC_URLS =import.meta.env.VITE_RPC_URLS
const BLOCK_EXPLORER_URLS =import.meta.env.VITE_BLOCK_EXPLORER_URLS
const ADDRESS =import.meta.env.VITE_FAUCET_ADDRESS


const TESTNET_INFORMATION = {
    chainId: CHAIN_ID,
    chainName: CHAIN_NAME,
    nativeCurrency: {
        name: CRYPTO_NAME,
        symbol: SYMBOL,
        decimals: DECIMALS
    },
    rpcUrls: [
        RPC_URLS
    ],
    blockExplorerUrls: [
        BLOCK_EXPLORER_URLS
    ]
}


const FaucetSchema = Yup.object().shape({
    address: Yup.string().matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
})

const FaucetContainer = () => {
    const web3 = new Web3(window.ethereum)
    const FAUCET_ADDRESS = ADDRESS
    const [account, setAccount] = useState('')
    const [coolDownTime, setCoolDownTime] = useState(0)
    const [contract, setContract] = useState(null)

    useEffect(() => {
        const initializeContract = async () => {
            setAccount('')
            try {
                const contractInstance = new web3.eth.Contract(ABI.abi, FAUCET_ADDRESS);
                setContract(contractInstance)
                return contractInstance;  
            } catch (error) {
                console.log(error)
                Swal.fire({
                    title: "Error",
                    text: "Make sure metamask is installed",
                    icon: "error"
                })
            }
        };
        const fetchData = async () => {
            try {
                await initializeContract();
            } catch (error) {
                console.log(error)
                Swal.fire({
                    title: "Error",
                    text: 'Error while establishing connection, Disable other extensions',
                    icon: "error",
                    button: "Try Again"
                })
            }
        }
        fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    useEffect(() => {
        connectWallet()    
    // eslint-disable-next-line react-hooks/exhaustive-deps        
    },[account])

    async function connectWallet(){
        if(window.BinanceChain){
            try {
                const provider = new Web3(window.BinanceChain)
                const mobileInstance = new provider.eth.Contract(ABI.abi, FAUCET_ADDRESS);
                await window.BinanceChain.request({
                    method: 'wallet_addEthereumChain',
                    params: [TESTNET_INFORMATION]
                })
                await window.ethereum.request({
                    method: 'eth_requestAccounts'
                })
                const accounts = await provider.eth.getAccounts()
                setAccount(accounts[0])
                setContract(mobileInstance)
                Swal.fire({
                    title: 'Success',
                    text: accounts,
                    icon: 'success'
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error while establishing connection, Disable other extensions',
                    icon: 'error',
                    button: 'Try Again'
                })
            }
        } else if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [TESTNET_INFORMATION]
                })
                const accounts = await window.ethereum.enable();
                setAccount(accounts[0])
                Swal.fire({
                    title: 'Success',
                    text: accounts,
                    icon: 'success'
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Error while establishing connection, We would try to connect you',
                    icon: 'error',
                    button: 'Try Again'
                })
            }
        } else {
            Swal.fire({
                title: 'Error',
                text: 'Make sure to install metamask',
                icon: 'error'
            })
        }
    }

    async function getCoolDownForAddress(address){
        try {
            if(contract !== null){
                const coolDownTime = await contract.methods.getCoolDownForAddress(address).call();
                setCoolDownTime(parseInt(coolDownTime))
            } else {
                const coolDownTime = await new web3.eth.Contract(ABI.abi, FAUCET_ADDRESS).methods.getCoolDownForAddress(address).call();
                setCoolDownTime(parseInt(coolDownTime))
                Swal.fire({
                    title: "No connected accounts found.",
                    icon: 'error',
                });
            }    
        } catch (error) {
            Swal.fire({
                title: error.message,
                icon: 'error',
            });
        }
    }

    async function requestToken(values){
        try {
            await contract.methods.requestTokens().send({ from: values.address });
            const addressSentTo = (values.address).toString()
            await getCoolDownForAddress(addressSentTo)
            Swal.fire({
                title: 'Mushee Sent',
                icon: 'success',
              });
        } catch (error) {
            Swal.fire({
                title: error.message,
                icon: 'error',
              });
        }
    }

    function copyToClipboard(){
        const copyText = account
        if(copyText !== null){

            navigator.clipboard.writeText(copyText)

            Swal.fire({
                title: 'Copied address to clipboard',
                text: copyText,
                timer: 1000
            })
        }
    }

    return (
        <FaucetContained>
            <H1>Get { SYMBOL } Tokens </H1>
            <P>This faucet transfers Test Tokens and Gas Tokens on {CRYPTO_NAME}. Please confirm details before submitting</P>
            {
                account === '' ?
                <CustomButton DisplayText='Connect Wallet' onClick={() => connectWallet()}/>
                :
                <Copy onClick={() => copyToClipboard()}>{account}</Copy>
            }
            <Countdown seconds={coolDownTime}/>
            <Formik initialValues={{ address: ''}} validationSchema={FaucetSchema} onSubmit={ (values) => requestToken(values) }>
                {({ errors }) => (
                    <Form style={{ marginTop: '10px'}} >
                        <div>{errors.address}</div>
                        <Field type='text' name='address' id='address' placeholder='0x00000000000000000' required />
                        {
                            account === '' ?
                            <CustomButton DisplayText='Submit' Type='submit' disabledBool={true} />
                            :
                            <CustomButton DisplayText='Submit' Type='submit'/>
                        }
                    </Form>
                )}
            </Formik>
        </FaucetContained>
    )
}

export default FaucetContainer