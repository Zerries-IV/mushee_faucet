import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'
import { Field, Form, Formik } from 'formik'
import * as Yup from 'yup'
import { styled } from 'styled-components'
import { useEffect, useState } from 'react'
import Web3 from 'web3'
import * as ABI from '../build/contracts/TestFaucet.json'
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import Countdown from './Countdown'

const TESTNET_INFORMATION = {
    chainId: '0x61',
    chainName: 'Binance Smart Chain Testnet',
    nativeCurrency: {
        name: 'testBNB',
        symbol: 'tBNB',
        decimals: 18
    },
    rpcUrls: [
        'https://data-seed-prebsc-1-s1.binance.org:8545/'
    ],
    blockExplorerUrls: [
        'https://testnet.bscscan.com'
    ]
}


const MyButton = (props) => {
    return(
        <Button variant='secondary' type={props.Type} onClick={props.onClick} disabled={props.disabledBool}
        style={{
            width: '100%',
            marginTop: '30px',
            padding: '10px 25px',
            backgroundColor: 'white',
            color: 'black',
            fontWeight: 800
        }}>{props.DisplayText}</Button> 
    )
}

MyButton.propTypes = {
    DisplayText: PropTypes.string.isRequired,
    Type: PropTypes.string,
    onClick: PropTypes.func,
    disabledBool: PropTypes.bool
}

const FaucetSchema = Yup.object().shape({
    address: Yup.string().matches(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address')
})

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

const FaucetContainer = () => {
    const web3 = new Web3(window.ethereum)
    const FAUCET_ADDRESS = '0x3a384e8098Ef90Ada1c2eA18F14127b881B94A40'
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
                Swal.fire({
                    title: "Error",
                    text: error.message,
                    icon: "error"
                })
            }
        }
        fetchData();
    },[])

    useEffect(() => {
        const fetchData = async () => {
            try {
                if(account !== ''){
                    const ACC = account.toString()
                    await getCooldownForAddress(ACC);
                }
            } catch(error){
                console.log(error)
            }
        }
        fetchData()
    },[account])

    async function connectWallet(){
        if(window.ethereum){
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
                    text: error.message,
                    icon: 'error'
                })
            }
        } else if (window.BinanceChain) {
            try {
                const provider = new Web3(window.BinanceChain)
                await window.BinanceChain.request({
                    method: 'wallet_addEthereumChain',
                    params: [TESTNET_INFORMATION]
                })
                await window.ethereum.request({
                    method: 'eth_requestAccounts'
                })
                const accounts = await provider.eth.getAccounts()
                setAccount(accounts[0])
                Swal.fire({
                    title: 'Success',
                    text: accounts,
                    icon: 'success'
                })
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: error.message,
                    icon: 'error'
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

    async function getCooldownForAddress(address){
        try {
            if(contract !== null){
                const coolDownTime = await contract.methods.getCooldownForAddress(address).call();
                setCoolDownTime(parseInt(coolDownTime))
            } else {
                const coolDownTime = await new web3.eth.Contract(ABI.abi, FAUCET_ADDRESS).methods.getCooldownForAddress(address).call();
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
            const reciept = await contract.methods.requestTokens().send({ from: values.address });
            const addressSentTo = (values.address).toString()
            await getCooldownForAddress(addressSentTo)
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
            <H1>Get tMSH Tokens </H1>
            <P>This faucet transfers Test Tokens and Gas Tokens on Mushee. Please confirm details before submitting</P>
            {
                account === '' ?
                <MyButton DisplayText='Connect Wallet' onClick={() => connectWallet()}/>
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
                            <MyButton DisplayText='Submit' Type='submit' disabledBool={true} />
                            :
                            <MyButton DisplayText='Submit' Type='submit'/>
                        }
                    </Form>
                )}
            </Formik>
        </FaucetContained>
    )
}

const Header = styled.header`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
`

const Container = styled.div`
    display: flex;
    justify-content: space-between;
    margin: 0 20px;
`

const Faucet = () => {
    return (
        <Header>
            <Container>
                <FaucetContainer />
            </Container>
        </Header>
    )
}

export default Faucet