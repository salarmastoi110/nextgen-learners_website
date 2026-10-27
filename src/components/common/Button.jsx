export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  as: Component = 'button',
  className = '',
  ...props
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    size !== 'md' ? `btn--${size}` : '',
    props.block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const { block, ...rest } = props;

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}
