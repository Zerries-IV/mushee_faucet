import { Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const CustomButton = (props) => {
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

CustomButton.propTypes = {
    DisplayText: PropTypes.string.isRequired,
    Type: PropTypes.string,
    onClick: PropTypes.func,
    disabledBool: PropTypes.bool
}

export default CustomButton