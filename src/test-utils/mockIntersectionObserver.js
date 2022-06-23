/* eslint-disable */

const unobserve = jest.fn()
const observe = jest.fn()
const mock = jest.fn(function() {
  this.observe = observe
  this.unobserve = unobserve
})
Object.defineProperty(window, 'IntersectionObserver', { writable: true, configurable: true, value: mock })
Object.defineProperty(global, 'IntersectionObserver', { writable: true, configurable: true, value: mock })

Object.defineProperty(window, 'IntersectionObserverEntry', { writable: true, configurable: true, value: mock })
Object.defineProperty(global, 'IntersectionObserverEntry', { writable: true, configurable: true, value: mock })

Object.defineProperty(window.IntersectionObserver.prototype, 'intersectionRatio', { writable: true, configurable: true, value: mock })
Object.defineProperty(global.IntersectionObserver.prototype, 'intersectionRatio', { writable: true, configurable: true, value: mock })
