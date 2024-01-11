import { styled } from 'styled-components'
import FaucetContainer from './components/FaucetContainer'



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