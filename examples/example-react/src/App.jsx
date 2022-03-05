import ExampleMenuOriginalFloat from '@/components/ExampleMenuOriginalFloat'
import ExampleMenuHighOrderComponent from '@/components/ExampleMenuHighOrderComponent'
import ExampleMenuOverrideTransition from '@/components/ExampleMenuOverrideTransition'
import ExampleMenuHasArrow from '@/components/ExampleMenuHasArrow'
import ExampleNestedMenu from '@/components/ExampleNestedMenu'
import ExampleListbox from '@/components/ExampleListbox'
import ExampleCombobox from '@/components/ExampleCombobox'
import ExamplePopover from '@/components/ExamplePopover'

export default function App() {
  return (
    <>
      <h1 className="mt-4 text-center text-gray-800 text-2xl font-bold">
        Headless UI Float - React Example
      </h1>

      <div className="p-6 grid sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        <ExampleMenuOriginalFloat />
        <ExampleMenuHighOrderComponent />
        <ExampleMenuOverrideTransition />
        <ExampleMenuHasArrow />
        <ExampleNestedMenu />
        <ExampleListbox />
        <ExampleCombobox />
        <ExamplePopover />
      </div>
    </>
  )
}
