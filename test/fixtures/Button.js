
const Button = ()=>{
  return <button>This is Button</button>
}

Button.propTypes = {
  /**
    Label for the button.
  */
  label: React.PropTypes.string,

  /**
    Triggered when clicked on the button.
  */
  onClick: React.PropTypes.func,
};

export default Button