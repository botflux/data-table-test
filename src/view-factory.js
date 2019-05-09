/**
 * 
 * @param {{}} param0 
 */
const viewFactory = ({ eventTarget, wrapper }) => {


    const setter = {
        set (obj, prop, value) {
            const oldState = JSON.parse (JSON.stringify (state))
            obj[prop] = value
            const newState = JSON.parse (JSON.stringify (state))

            eventTarget.dispatchEvent (new CustomEvent ('view', {
                detail: {
                    oldState,
                    newState
                }
            }))

            return true
        }
    }

    const state = new Proxy ({
        order: new Proxy ({}, setter),
        input: new Proxy ({}, setter)
    }, setter)

    const elements = [...wrapper.querySelectorAll ('[data-table-field]')]
        .map (header => ({ name: header.dataset.tableField, header }))
        .map (({ header, name }) => {
            const order = wrapper.querySelector (`[data-table-field-order="${header.dataset.tableField}"]`)
            let currentOrder = 0

            !!order && order.addEventListener ('click', () => {
                currentOrder += 1

                if (currentOrder > 1) currentOrder = -1
                state.order[name] = currentOrder
            })

            return ({ header, order, name })
        })
        .map (fields => {
            const input = wrapper.querySelector(`[data-table-field-input="${fields.header.dataset.tableField}"]`)

            !!input && input.addEventListener ('input', e => {

                state.input[fields.name] = e.target.value
            })

            return ({ ...fields, input })
        })

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

    const makePaginationTemplate = (n, text) => {
        const t = paginationTemplate.content.cloneNode (true)
        let e = t.querySelector ('[data-table-pagination]')

        // console.log(t,e)
        e.setAttribute ('data-table-pagination', n)
        e.innerHTML = text
        e.addEventListener ('click', () => {
            state.page = n
        })
        
        paginator.appendChild (e)
    }

    const updateRows = data => {
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

    const updatePagination = (pageCount, page) => {
        paginator.innerHTML = ''

        ;[...Array(pageCount).keys ()]
            .filter(n => n > page - 3 && n < page + 3)
            .forEach (n => makePaginationTemplate (n, n + 1))
    }

    eventTarget.addEventListener ('viewmodel', e => {
        console.log(e.detail.newState)
        
        if ('data' in e.detail.delta) {
            updateRows (e.detail.newState.data)
        }

        if ('pageCount' in e.detail.delta) {
            updatePagination (e.detail.newState.pageCount, e.detail.newState.currentPage)
        }

        if ('page' in e.detail.delta) {
            updatePagination (e.detail.newState.pageCount, e.detail.newState.currentPage)
        }
    })

    console.log('view', elements, rowTemplate, paginationTemplate, body, paginator)
}

export default viewFactory