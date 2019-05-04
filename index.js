/**
 * 
 * 
 * We parse each elements in the view
 * When everything is parsed
 * We give the result to the viewModel
 * For each changes in the view the viewModel will request the model for changes
 * For each changes in the model the viewModel will change the view 
 * 
 * 
 * 
 * 
 */


const viewModel = (fields, fetchData, eventTarget) => {

    const inputState = new Proxy ({}, {
        set (obj, prop, value) {
            obj[prop] = value

            eventTarget.dispatchEvent (new CustomEvent ('input', {
                detail: obj
            }))
        }
    })

    fields.forEach (({ input, name }) => {
        !!input && input.addEventListener ('input', () => {
            inputState[name] = input.value
        })

    })

    const orderState = new Proxy ({}, {
        set (obj, prop, value) {
            obj[prop] = value

            Object.keys (obj)
                .filter (k => k !== prop)
                .forEach (k => {
                    obj [k] = 0
                })

            eventTarget.dispatchEvent (new CustomEvent ('order', {
                detail: obj
            }))
        }
    })

    fields.forEach (({ order, name }) => {
        !!order && order.addEventListener ('click', () => {
            let currentDirection = orderState[name] || 0

            currentDirection += 1

            if (currentDirection > 1)
                currentDirection = -1

            orderState [name] = currentDirection
        })
    })

    let currentPage = 0

    const setCurrentPage = (page, skipUpdateData = false) => {
        if (currentPage === page) return

        if (!skipUpdateData) {
            updateData ()
        }

        currentPage = page

        eventTarget.dispatchEvent (new CustomEvent ('page', {
            detail: currentPage
        }))
    }

    const dataState = new Proxy ({}, {
        set (obj, prop, value) {
            obj[prop] = value

            eventTarget.dispatchEvent (new CustomEvent ('data', {
                detail: { ...obj.state, page: currentPage }
            }))
        }
    })

    const updateData = () => {
        console.log('fetch data')
        return fetchData (inputState, orderState, currentPage)
            .then (({ data, pageCount }) => {
                dataState.state = {
                    data,
                    pageCount
                }
            })
    }

    eventTarget.addEventListener ('order', _ => {
        updateData()
        console.log('order')
    })
    eventTarget.addEventListener ('input', _ => {
        setCurrentPage (0, true)
        updateData()
        console.log('input')
    })
    eventTarget.addEventListener ('view:page', e => {
        setCurrentPage (e.detail)
    })
    // eventTarget.addEventListener ('data', e => console.log('data', e.detail))

    updateData ()
}

const view = (eventTarget, rowTemplate, paginationTemplate, body, paginator) => {
    const makePagination = (pageCount, page) => {
        paginator.innerHTML = ''

        const createFromTemplate = (n, text) => {
            const t = paginationTemplate.content.cloneNode (true)
            const e = t.querySelector('[data-table-pagination]')
            e.setAttribute ('data-table-pagination', n)
            e.addEventListener ('click', () => {
                eventTarget.dispatchEvent (new CustomEvent ('view:page', {
                    detail: n
                }))
            })
            e.innerHTML = text

            paginator.appendChild (e)
        
        }

        if (page > 0) {
            createFromTemplate (0, '<<')
            createFromTemplate (page - 1, '<')
        }

        ;[...Array(pageCount).keys()]
            .filter (n => n > page - 3 && n < page + 3)
            .forEach (n => {
                createFromTemplate (n, n + 1)
                // const t = paginationTemplate.content.cloneNode (true)
                // const e = t.querySelector('[data-table-pagination]')
                // e.setAttribute ('data-table-pagination', n)
                // e.addEventListener ('click', () => {
                //     eventTarget.dispatchEvent (new CustomEvent ('view:page', {
                //         detail: n
                //     }))
                // })
                // e.innerHTML = n + 1

                // paginator.appendChild (e)
            })

        if (page < pageCount - 1) {
            
            createFromTemplate (page + 1, '>')
            createFromTemplate (pageCount - 1, '>>')
        }
    }

    const makeRows = data => {
        body.innerHTML = ''

        data.forEach (row => {
            const t = rowTemplate.content.cloneNode (true)

            Object.keys (row)
                .forEach (k => {
                    const e = t.querySelector (`[data-table-field="${k}"]`)

                    if (!e) return

                    e.innerHTML = row[k]
                })

            body.appendChild (t)
        })
    }
    
    eventTarget.addEventListener ('data', e => {
        console.log('view', e.detail)
        makePagination (e.detail.pageCount, e.detail.page)

        makeRows (e.detail.data)
    })


}

/**
 * 
 * @param {HTMLElement} wrapper 
 */
const createDataTable = (wrapper, fetchData) => {

    // const updateData = ({ data, pageCount }) => {
    //     console.log(data, pageCount)
    //     dataStateHandler.state.data = data
    //     dataStateHandler.state.pageCount = pageCount
    // } 

    const elements = [...wrapper.querySelectorAll ('[data-table-field]')]
        .map (header => ({ header, order: wrapper.querySelector (`[data-table-field-order="${header.dataset.tableField}"]`) }))
        .map (fields => ({ ...fields, input: wrapper.querySelector(`[data-table-field-input="${fields.header.dataset.tableField}"]`) }))
        .map (fields => ({ ...fields, name: fields.header.dataset.tableField }))
    
    /**
     * Template elements
     */
    const rowTemplate = wrapper.querySelector ('[data-table-row-template]')
    const paginationTemplate = wrapper.querySelector ('[data-table-pagination-template]')
    /**! */

    /**
     * Containers
     */
    const body = wrapper.querySelector ('[data-table-body]')
    const paginator = wrapper.querySelector ('[data-table-paginator]')
    /**! */

    const eventTarget = new EventTarget ()

    viewModel (elements, fetchData, eventTarget)
    view (eventTarget, rowTemplate, paginationTemplate, body, paginator)
}

createDataTable (document.querySelector ('[data-table]'), (inputsValue, order, page) => {
    const o = Object.entries (order).find (([name, value]) => {
        return value !== 0
    })

    let orderString

    if (o) {
        orderString = `order-by=${o[0]}&order-direction=${o[1] === -1 ? 'DESC' : o[1] === 1 ? 'ASC': ''}`
    }

    return fetch (`https://api.webcimetiere.net/cities?${ !!inputsValue.nom ? 'name='+ inputsValue.nom +'&' : '' }page=${page}${o ? '&' + orderString : ''}`)
        .then (response => response.json ())
        .then (({ cities, pageCount }) => ({ data: cities, pageCount }))
})
