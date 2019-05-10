import dataTableFactory from './data-table-factory'


const adapter = rows => {
    return rows.map (row => {
        row.name = row.nom
        row.county = row.departement

        return row
    })
}
const fieldNameAdapter = fieldName => {
    switch (fieldName) {
        case 'name': return 'nom'
        case 'county': return 'departement'
    }
}

const getData = (newState) => {
    console.log('getData', newState)

    const { page, inputs = {}, orders = {} } = newState
    
    const pageString = `page=${page}`
    const inputsString = Object.entries (inputs).reduce ((prev, [k, v]) => {
        if (prev.length > 0) prev += '&'
        
        return `${prev}${k}=${v}`
    }, '')

    const order = Object.entries (orders).find (([k, v]) => v !== 0)
    let orderString = ''

    if (!!order) {
        const [k, v] = order

        orderString = `order-by=${fieldNameAdapter(k)}&order-direction=${v === 1 ? 'ASC' : 'DESC'}`
    }

    const url = `https://api.webcimetiere.net/cities?${pageString}&${inputsString}&${orderString}`

    return fetch (url)
        .then (response => response.json ())
        .then (({ pageCount, cities }) => {
            return {
                pageCount,
                data: adapter (cities)
            }
        })
}

dataTableFactory (getData, document.querySelector('[data-table]'))

// import viewFactory from './view-factory'
// import viewModelFactory from './view-model-factory'
// const e = new EventTarget ()
// viewFactory ({
//     eventTarget: e,
//     wrapper: document.querySelector ('[data-table]')
// })

// const adapter = rows => {
//     return rows.map (row => {
//         row.name = row.nom
//         row.county = row.departement

//         return row
//     })
// }
// const fieldNameAdapter = fieldName => {
//     switch (fieldName) {
//         case 'name': return 'nom'
//         case 'county': return 'departement'
//     }
// }

// const getData = (newState) => {
//     console.log('getData', newState)

//     const { page, inputs = {}, orders = {} } = newState
    
//     const pageString = `page=${page}`
//     const inputsString = Object.entries (inputs).reduce ((prev, [k, v]) => {
//         if (prev.length > 0) prev += '&'
        
//         return `${prev}${k}=${v}`
//     }, '')

//     const order = Object.entries (orders).find (([k, v]) => v !== 0)
//     let orderString = ''

//     if (!!order) {
//         const [k, v] = order

//         orderString = `order-by=${fieldNameAdapter(k)}&order-direction=${v === 1 ? 'ASC' : 'DESC'}`
//     }

//     const url = `https://api.webcimetiere.net/cities?${pageString}&${inputsString}&${orderString}`

//     return fetch (url)
//         .then (response => response.json ())
//         .then (({ pageCount, cities }) => {
//             return {
//                 pageCount,
//                 data: adapter (cities)
//             }
//         })
// }

// viewModelFactory ({
//     eventTarget: e,
//     getData
// })

// // e.addEventListener ('view', e => {
// //     console.log(e.detail)
// // })

// console.log('hello')