import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { styled } from 'styled-components'

const Body = styled.div`
    text-align: center;
    color: red
`

function Countdown({ seconds }){
    const [timeLeft, setTimeLeft] = useState({
        minutes: 0,
        seconds: 0
    })

    useEffect(() => {
        const countDownInterval = setInterval(() => {
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60

            setTimeLeft({ minutes, seconds: secs})
            if (seconds > 0){
                seconds--
            }else {
                clearInterval(countDownInterval)
            }
        }, 1000)

        return () => {
            clearInterval(countDownInterval)
        }
    },[seconds])

  return (
    <Body>
        {timeLeft.minutes} minutes, {timeLeft.seconds} seconds
    </Body>
  )
}

Countdown.propTypes = {
    seconds: PropTypes.number.isRequired,
}

export default Countdown