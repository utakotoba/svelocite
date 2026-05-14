/// <reference types="@sveltejs/kit" />

declare global {
  namespace App {
    // interface Error {}
    // interface Locals {}
    // interface PageData {}
    // interface PageState {}
    // interface Platform {}
  }
}

declare namespace svelteHTML {
  import type { AttributifyAttributes } from '@unocss/preset-attributify'

  // extend html attributes for unocss attributify preset
  type HTMLAttributes = AttributifyAttributes
}

export {}
