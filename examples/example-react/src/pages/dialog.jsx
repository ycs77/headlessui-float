import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { Float } from '@headlessui-float/react'
import Block from '@/components/Block'

export default function ExampleDialog() {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <Block title="Floating Dialog" contentClass="h-[300px] p-4" data-testid="block-dialog">
      <Float dialog placement="bottom-start" offset={4}>
        <Float.Reference>
          <button
            type="button"
            onClick={openModal}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
            data-testid="open-dialog-button"
          >
            Open dialog
          </button>
        </Float.Reference>

        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-[10001]" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="duration-300 ease-out"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0">
              <div
                className="flex min-h-full items-center justify-center p-4 text-center"
                data-testid="dialog-overlay"
              >
                <Float.Content
                  as={Fragment}
                  transitionChild
                  enter="duration-300 ease-out"
                  enterFrom="opacity-0 scale-50"
                  enterTo="opacity-100 scale-100"
                  leave="duration-200 ease-in"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-50"
                  tailwindcssOriginClass
                >
                  <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-[transform,opacity] select-none">
                    <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                      Payment successful
                    </Dialog.Title>

                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your payment has been successfully submitted. We’ve sent
                        you an email with all of the details of your order.
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={closeModal}
                      >
                        Got it, thanks!
                      </button>
                    </div>
                  </Dialog.Panel>
                </Float.Content>
              </div>
            </div>
          </Dialog>
        </Transition>
      </Float>
    </Block>
  )
}
