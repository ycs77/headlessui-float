import type { ReactElement } from 'react'

interface BlockProps {
  title: string
  contentClass: string
  children: ReactElement | ReactElement[]
  form?: ReactElement
  'data-testid'?: string
}

export default function Block(props: BlockProps) {
  return (
    <div className="relative max-w-screen-md">
      <h2 className="font-bold tracking-wider mb-4">{props.title}</h2>
      <div className={props.contentClass || ''} data-testid={props['data-testid'] || ''}>
        {props.children}
      </div>
      {props.form}
    </div>
  )
}
