<template>
  <Block title="Floating Dialog" content-class="h-[300px] p-4" data-testid="block-dialog">
    <Float dialog placement="bottom-start" :offset="4">
      <FloatReference>
        <button
          type="button"
          class="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          data-testid="open-dialog-button"
          @click="openModal"
        >
          Open dialog
        </button>
      </FloatReference>

      <TransitionRoot appear :show="isOpen" as="template">
        <Dialog as="div" class="relative z-[10001]" @close="closeModal">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0"
            enter-to="opacity-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100"
            leave-to="opacity-0"
          >
            <div class="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div class="fixed inset-0">
            <div
              class="flex min-h-full items-center justify-center p-4 text-center"
              data-testid="dialog-overlay"
            >
              <FloatContent
                as="template"
                transition-child
                enter="duration-300 ease-out"
                enter-from="opacity-0 scale-50"
                enter-to="opacity-100 scale-100"
                leave="duration-200 ease-in"
                leave-from="opacity-100 scale-100"
                leave-to="opacity-0 scale-50"
                tailwindcss-origin-class
              >
                <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-[transform,opacity] select-none">
                  <DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900">
                    Payment successful
                  </DialogTitle>

                  <div class="mt-2">
                    <p class="text-sm text-gray-500">
                      Your payment has been successfully submitted. We’ve sent you
                      an email with all of the details of your order.
                    </p>
                  </div>

                  <div class="mt-4">
                    <button
                      type="button"
                      class="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      @click="closeModal"
                    >
                      Got it, thanks!
                    </button>
                  </div>
                </DialogPanel>
              </FloatContent>
            </div>
          </div>
        </Dialog>
      </TransitionRoot>
    </Float>
  </Block>
</template>

<script setup>
import { ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, TransitionChild, TransitionRoot } from '@headlessui/vue'
import { Float, FloatContent, FloatReference } from '@headlessui-float/vue'
import Block from '@/components/Block.vue'

const isOpen = ref(false)

function closeModal() {
  isOpen.value = false
}

function openModal() {
  isOpen.value = true
}
</script>
