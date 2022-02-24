<template>
  <div ref="buttonRef">
    <slot></slot>
  </div>

  <div ref="floatingRef">
    <transition
      :enter-active-class="transition ? `${enterActiveClass} ${placementOriginClass}` : undefined"
      :enter-from-class="transition ? enterFromClass : undefined"
      :enter-to-class="transition ? enterToClass : undefined"
      :leave-active-class="transition ? `${leaveActiveClass} ${placementOriginClass}` : undefined"
      :leave-from-class="transition ? leaveFromClass : undefined"
      :leave-to-class="transition ? leaveToClass : undefined"
      @before-enter="showFloatEl"
      @after-leave="hideFloatEl"
    >
      <slot name="content"></slot>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, nextTick } from 'vue'
import { computePosition, offset, flip, shift } from '@floating-ui/dom'
import { defaultPlacementClassResolver } from '../placement-class-resolvers'
import type { PropType } from 'vue'
import type { ComputePositionConfig } from '@floating-ui/core'
import type { Placement, Strategy, Middleware } from '@floating-ui/dom'
import type { PlacementClassResolver } from '../types'

export default defineComponent({
  props: {
    placement: {
      type: String as PropType<Placement>,
      default: 'bottom-start',
    },
    strategy: {
      type: String as PropType<Strategy>,
      default: 'absolute',
    },
    offset: {
      type: Number,
      default: 0,
    },
    transition: {
      type: Boolean,
      default: false,
    },
    zIndex: {
      type: Number,
      default: 9999,
    },
    placementClassResolver: {
      type: Function as PropType<PlacementClassResolver>,
      default: defaultPlacementClassResolver,
    },
    middleware: {
      type: Array as PropType<Middleware[]>,
      default: () => [],
    },
    options: {
      type: Object as PropType<Partial<ComputePositionConfig>>,
      default: () => ({}),
    },
    enterActiveClass: String,
    enterFromClass: String,
    enterToClass: String,
    leaveActiveClass: String,
    leaveFromClass: String,
    leaveToClass: String,
    originClass: String,
  },
  setup(props) {
    const buttonRef = ref<HTMLElement>(null!)
    const floatingRef = ref<HTMLElement>(null!)

    const showFloatEl = async () => {
      await nextTick()

      Object.assign(floatingRef.value.style, {
        position: props.strategy,
        zIndex: props.zIndex,
      })

      computePosition(buttonRef.value, floatingRef.value, {
        ...props.options,
        placement: props.placement,
        strategy: props.strategy,
        middleware: [
          offset(props.offset),
          flip(),
          shift({ padding: 6 }),
        ].concat(props.middleware),
      }).then(({ x, y }) => {
        Object.assign(floatingRef.value.style, {
          left: `${x}px`,
          top: `${y}px`,
        })
      })
    }

    const hideFloatEl = async () => {
      await nextTick()

      Object.assign(floatingRef.value.style, {
        position: null,
        zIndex: null,
        left: null,
        top: null,
      })
    }

    const placementOriginClass = computed(() => {
      if (props.originClass) {
        return props.originClass
      }

      return props.placementClassResolver(props.placement)
    })

    return { buttonRef, floatingRef, showFloatEl, hideFloatEl, placementOriginClass }
  },
})
</script>
