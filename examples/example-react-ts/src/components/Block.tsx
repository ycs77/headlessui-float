import type { ReactElement } from 'react'

interface BlockProps {
  title: string
  titleClass: string
  children: ReactElement
}

export default function Block(props: BlockProps) {
  const { title, titleClass = '' } = props

  return (
    <div className="relative h-[240px] flex justify-center items-center border-2 border-dashed border-indigo-100 rounded-lg">
      <h2 className={`absolute top-3 left-4 font-bold tracking-wider ${titleClass}`}>
        {title}
      </h2>
      {props.children}
    </div>
  )
}
