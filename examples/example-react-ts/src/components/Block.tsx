import type { ReactElement } from 'react'

interface BlockProps {
  title: string
  contentClass: string
  children: ReactElement
  form?: ReactElement
  'data-testid'?: string
}

export default function Block(props: BlockProps) {
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
