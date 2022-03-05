import { Float, tailwindcssOriginClassResolver } from 'headlessui-float-react'

export default function HighOrderFloat(props) {
  return (
    <Float
      offset={8}
      flip
      portal
      transition
      enter="transition duration-200 ease-out"
      enterFrom="scale-95 opacity-0"
      enterTo="scale-100 opacity-100"
      leave="transition duration-150 ease-in"
      leaveFrom="scale-100 opacity-100"
      leaveTo="scale-95 opacity-0"
      placementClass={tailwindcssOriginClassResolver}
      {...props}
    >
      {props.children}
    </Float>
  )
}
