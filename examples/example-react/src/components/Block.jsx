export default function Block(props) {
  const { title, contentClass = '', children, form, 'data-testid': dataTestid = '' } = props

  return (
    <div className="relative max-w-screen-md">
      <h2 className="font-bold tracking-wider mb-4">{title}</h2>
      <div className={contentClass} data-testid={dataTestid}>
        {children}
      </div>
      {form}
    </div>
  )
}
