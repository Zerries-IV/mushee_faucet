import Faucet from './Faucet'
import { styled } from 'styled-components'

const Body = styled.div`
  background-color: black !important;
  height: 100vh;
  scroll-behavior: smooth;
  font-family: 'Golos Text', sans-serif;
  overflow-x: hidden;
`

function App() {
  return (
    <Body>
      <Faucet />
    </Body>
  )
}

export default App
