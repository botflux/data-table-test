import deepObjectComparaison from './helper/deep-object-comparaison'

const viewModelFactory = ({ eventTarget, getData }) => {
    const state = new Proxy ({}, {
        set (obj, prop, value) {
            const oldState = JSON.parse(JSON.stringify(obj))
            obj[prop] = value
            const newState = JSON.parse(JSON.stringify(obj))
            console.log('ssssssssss',newState)

            const delta = deepObjectComparaison(oldState, newState)

            eventTarget.dispatchEvent (new CustomEvent ('viewmodel', {
                detail: {
                    oldState,
                    newState,
                    delta
                }
            }))

            return true
        }
    })

    /**
     * When the view has changed
     */
    eventTarget.addEventListener ('view', e => {
        const delta = deepObjectComparaison (e.detail.oldState, e.detail.newState)

        if ('input' in delta || 'order' in delta || 'page' in delta) {
            console.log('deeeeee',delta)
            eventTarget.dispatchEvent (new CustomEvent ('viewmodel:need-data', {
                detail: {
                    ...e.detail,
                    delta
                }
            }))
        }
    })

    /**
     * When the viewmodel need to fetch data
     */
    eventTarget.addEventListener ('viewmodel:need-data', e => {
        getData (e.detail)
            .then (({ data, page, pageCount }) => {
                state.currentPage = e.detail.newState.page
                state.data = data
                state.page = page
                state.pageCount = pageCount
            })
    })

    const defaultState = {
        newState: {
            input: {},
            order: {},
        },
    }

    getData (defaultState)
        .then (({ data, page, pageCount }) => {
            state.currentPage = 0
            state.data = data
            state.page = page
            state.pageCount = pageCount
        })
}

export default viewModelFactory