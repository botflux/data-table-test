import viewFactory from './view-factory'
import viewModelFactory from './view-model-factory'
const e = new EventTarget ()
viewFactory ({
    eventTarget: e,
    wrapper: document.querySelector ('[data-table]')
})

const getData = ({ newState, oldState, delta }) => {
    const name = newState.input.nom || ''
    const order = Object.entries (newState.order).find (([k, v]) => v !== 0)
    console.log('ddddd', newState)
    const page = newState.page || 0

    const pageString = `page=${page}`
    const nameString = `name=${name}`
    const orderString = order ? `order-by=${order[0]}&order-direction=${order[1] === '-1' ? 'DESC' : 'ASC' }` : undefined

    const url = `https://api.webcimetiere.net/cities?${pageString}&${nameString}&${orderString || ''}`
    return fetch (url)
        .then (response => response.json ())
        .then (({ pageCount, cities }) => {
            return {
                pageCount,
                data: cities
            }
        })
}

viewModelFactory ({
    eventTarget: e,
    getData
})

// e.addEventListener ('view', e => {
//     console.log(e.detail)
// })

console.log('hello')