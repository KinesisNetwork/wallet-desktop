declare module 'react-inlinesvg' {
  import { Component, ComponentType, ReactNode } from 'react'

  class RequestError extends Error {}
  interface RequestError {
    isHttpError: boolean
    status: number
  }

  class InlineSVGError extends Error {}
  interface InlineSVGError {
    name: 'InlineSVGError'
    isSupportedBrowser: boolean
    isConfigurationError: boolean
    isUnsupportedBrowserError: boolean
    message: string
  }

  interface Props {
    src: string
    wrapper?: ComponentType
    preloader?: ReactNode
    className?: string
    uniquifyIDs?: boolean
    uniqueHash?: string
    baseURL?: string
    cacheGetRequests?: boolean
    onLoad?: (src: string, isCached: boolean) => any
    onError?: (error: RequestError | InlineSVGError) => any
  }
  class SVG extends Component<Props> {}
  namespace SVG {
    namespace defaultProps {
      const baseURL: string
      const cacheGetRequests: boolean
      function onLoad(): void
      function supportTest(...args: any[]): any
      namespace supportTest {
        const called: boolean
      }
      const uniquifyIDs: boolean
      function wrapper(p0: any, p1: any): any
      namespace wrapper {
        const type: any
      }
    }

    namespace propTypes {
      function baseURL(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace baseURL {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function cacheGetRequests(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace cacheGetRequests {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function children(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace children {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function className(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace className {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function onError(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace onError {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function onLoad(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace onLoad {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function preloader(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace preloader {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function src(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      function style(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace style {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function supportTest(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace supportTest {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function uniqueHash(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace uniqueHash {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function uniquifyIDs(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace uniquifyIDs {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
      function wrapper(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      namespace wrapper {
        function isRequired(p0: any, p1: any, p2: any, p3: any, p4: any, p5: any): any
      }
    }
  }

  export default SVG
}
