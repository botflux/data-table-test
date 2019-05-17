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
    
    const fields = [{
            name: 'departement',
            regex: /^[0-9]+$/
        }, { 
            name: 'nom',
            isFallback: true 
        }, 
    ]

    const searchFields = fields.reduce ((prev, { name, regex, isFallback = false }) => {
        if (isFallback) {
            return (prev.length <= 0) ? `${name}=${newState.inputs.search || ''}` : prev
        }

        if (regex.exec(newState.inputs.search)) {
            return `${prev}${prev.length > 0 ? '&': ''}${name}=${newState.inputs.search || ''}`
        }

        return prev
    }, '')

    const ordersString = Object.entries (newState.orders)
        .filter (([, v]) => v !== 0)
        .reduce ((p, [k, v]) => {
            return `${p}${p.length > 0 ? '&' : ''}order[${k}]=${v === 1 ? 'ASC' : 'DESC' }`
        }, '')
        // .reduce ((p, [k, v]) => encodeURI(`${p}&${k}=${v}`), '')

    const pageString = `page=${(newState.page + 1)}`

    const url = `https://api.webcimetiere.net/api/communes?${encodeURI(pageString)}&${encodeURI(searchFields)}&${encodeURI(ordersString)}`
        console.log(url)
    return fetch(url)
        .then (response => response.json())
        .then (data => {
            return {
                data: data['hydra:member'],
                pageCount: data['hydra:totalItems'] > 0 ? (Math.ceil(data['hydra:totalItems'] / 30)) : 1
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