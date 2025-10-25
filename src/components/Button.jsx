export const Button = ({
  className = "",
  color = "btn-primary",
  onClick = () => {},
  type = "button",
  text,
  ...props
}) => {
  const label = text ? text : "Configurar Botón";
  const classes = ["btn", color, className].filter(Boolean).join(" ");

  return (
    <button className={classes} type={type} onClick={onClick} {...props}>
      {label}
    </button>
  );
};
