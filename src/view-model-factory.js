import deepObjectComparaison from './helper/deep-object-comparaison'

const viewModelFactory = ({ eventTarget, getData, errorHandler, requestAfter = 750 }) => {
    
    let timeoutId
    
    const makeProxy = (baseState, state, eventName) => {
        return new Proxy (state, {
            set (obj, prop, value) {
                if (obj[prop] === value) return true

                const os = JSON.parse (JSON.stringify (baseState))
                obj[prop] = value
                const ns = JSON.parse (JSON.stringify (baseState))
                // console.log('deep', deepObjectComparaison (os, ns))
                const delta = deepObjectComparaison (os, ns)
                // console.log('new state in proxy handler', ns)
                // console.log('old state in proxy handler', os)
                // console.log('delta in proxy handler', delta)
                eventTarget.dispatchEvent (new CustomEvent (eventName, {
                    detail: {
                        oldState: os,
                        newState: ns,
                        delta
                    }
                }))

                return true
            }
        })
    }

    const state = {
        page: 0,
        pageCount: 0,
        data: [],

        inputs: null,
        orders: null
    }

    state.inputs = makeProxy (state, {}, 'viewmodel')
    state.orders = makeProxy (state, {}, 'viewmodel')
    const p = makeProxy (state, state, 'viewmodel')

    eventTarget.addEventListener ('view:input', ({ detail }) => {
        // console.log('input dispatched',p)
        p.inputs[detail.name] = detail.value
    })

    eventTarget.addEventListener ('view:order', ({ detail }) => {
        let current = p.orders[detail.name] || 0

        Object.keys (p.orders)
            .forEach (k => {
                p.orders[k] = 0
            })
        
        if (++current > 1) {
            current = -1
        }

        p.orders[detail.name] = current
    })

    eventTarget.addEventListener ('view:page', ({ detail }) => {
        p.page = detail
    })

    eventTarget.addEventListener ('viewmodel', ({ detail }) => {
        if ('inputs' in detail.delta) {
            state.page = 0
        }

        if ('inputs' in detail.delta || 'orders' in detail.delta || 'page' in detail.delta) {
            if (!!timeoutId) {
                clearTimeout (timeoutId)
            }
            
            timeoutId = setTimeout (() => {
                getData (detail.newState)
                    .then (({ data, pageCount }) => {
                        // console.log(data, pageCount)
                        p.data = data
                        p.pageCount = pageCount
                    })
            }, requestAfter)
        }
    })

    getData (state)
        .then (({ data, pageCount }) => {
            p.data = data
            p.pageCount = pageCount
        })

    // const state = new Proxy ({}, {
    //     set (obj, prop, value) {
    //         const oldState = JSON.parse(JSON.stringify(obj))
    //         obj[prop] = value
    //         const newState = JSON.parse(JSON.stringify(obj))
    //         console.log('ssssssssss',newState)

    //         const delta = deepObjectComparaison(oldState, newState)

    //         eventTarget.dispatchEvent (new CustomEvent ('viewmodel', {
    //             detail: {
    //                 oldState,
    //                 newState,
    //                 delta
    //             }
    //         }))

    //         return true
    //     }
    // })

    // /**
    //  * When the view has changed
    //  */
    // eventTarget.addEventListener ('view', e => {
    //     const delta = deepObjectComparaison (e.detail.oldState, e.detail.newState)

    //     if ('input' in delta || 'order' in delta || 'page' in delta) {
    //         console.log('deeeeee',delta)
    //         eventTarget.dispatchEvent (new CustomEvent ('viewmodel:need-data', {
    //             detail: {
    //                 ...e.detail,
    //                 delta
    //             }
    //         }))
    //     }
    // })

    // /**
    //  * When the viewmodel need to fetch data
    //  */
    // eventTarget.addEventListener ('viewmodel:need-data', e => {
    //     getData (e.detail)
    //         .then (({ data, page, pageCount }) => {
    //             state.currentPage = e.detail.newState.page
    //             state.data = data
    //             state.page = page
    //             state.pageCount = pageCount
    //         })
    // })

    // const defaultState = {
    //     newState: {
    //         input: {},
    //         order: {},
    //     },
    // }

    // getData (defaultState)
    //     .then (({ data, page, pageCount }) => {
    //         state.currentPage = 0
    //         state.data = data
    //         state.page = page
    //         state.pageCount = pageCount
    //     })
}

export default viewModelFactory