/**
 * 
 * @param {{}} param0 
 */
const viewFactory = ({ eventTarget, wrapper, errorHandler, config = {} }) => {

    const { 
        tableRowTemplateAttribute = 'data-table-row-template', 
        paginationTemplateAttribute = 'data-table-pagination-template',
        bodyAttribute = 'data-table-body',
        emptyBodyAttribute = 'data-table-empty-body',
        paginatorAttribute = 'data-table-paginator',

        fieldAttribute = 'data-table-field',
        fieldOrderAttribute = 'data-table-field-order',
        fieldOrderDirectionAttribute = 'data-table-order-direction',
        fieldInputAttribute = 'data-table-field-input',

        paginationElementAttribute = 'data-table-pagination',
        activePaginationElementAttribute = 'data-table-pagination-active',
        rowElementFieldAttribute = 'data-table-field'
    } = config

    /**
     * Template elements
     */
    const rowTemplate = wrapper.querySelector (`[${tableRowTemplateAttribute}]`)
    const paginationTemplate = wrapper.querySelector (`[${paginationTemplateAttribute}]`)
    /**! */

    /**
     * Containers
     */
    const body = wrapper.querySelector (`[${bodyAttribute}]`)
    const emptyBody = wrapper.querySelector (`[${emptyBodyAttribute}]`)
    const paginator = wrapper.querySelector (`[${paginatorAttribute}]`)
    /**! */

    // get all headers
    const elements = [...wrapper.querySelectorAll (`[${fieldAttribute}]`)]
        // we extract the name of each header
        .map (header => ({ name: header.getAttribute (fieldAttribute), header }))
        // we extract order control of each header
        .map (holder => ({ ...holder, order: wrapper.querySelector (`[${fieldOrderAttribute}="${holder.name}"]`) }))
        // we extract input of each header
        .map (holder => ({ ...holder, input: wrapper.querySelector (`[${fieldInputAttribute}="${holder.name}"]`) }))

    elements.forEach (({ input, order, name }) => {
        !!input && input.addEventListener ('input', () => {
            eventTarget.dispatchEvent (new CustomEvent (`view:input`, {
                detail: {
                    name,
                    value: input.value
                }
            }))
        })

        !!order && order.addEventListener ('click', () => {
            eventTarget.dispatchEvent (new CustomEvent (`view:order`, {
                detail: {
                    name
                }
            }))
        })
    })

    const makePaginationElement = (page, text, active) => {
        const template = paginationTemplate.content.cloneNode (true)
        const button = template.querySelector (`[${paginationElementAttribute}]`)

        if (!button) {
            errorHandler.dispatchEvent (new CustomEvent ('error', {
                detail: new Error (`view: no element with ${paginationElementAttribute} found in the pagination template !`)
            }))
            return
        }

        if (active)
            button.setAttribute (activePaginationElementAttribute, '')

        // button.setAttribute ('data-table-pagination', page)
        button.addEventListener ('click', () => {
            eventTarget.dispatchEvent (new CustomEvent ('view:page', {
                detail: page
            }))
        })

        button.innerHTML = text

        paginator.appendChild (template)
    }

    const updateOrdersAttribute = orders => {
        Object.entries (orders)
            .forEach (([k, v]) => {
                const el = elements.find (e => e.name === k)

                if (!el) return

                el.order.setAttribute (fieldOrderDirectionAttribute, v)
            })
    }    

    const updatePagination = ({ pageCount, page }) => {
        paginator.innerHTML = ''

        if (page > 1) {
            makePaginationElement (0, '<<')
        }

        if (page > 0) {
            makePaginationElement (page - 1, '<')
        }

        ;[...Array(pageCount).keys()]
            .filter (n => n > page - 3 && n < page + 3)
            .forEach (n => {
                let active = n === page

                makePaginationElement (n, n + 1, active)
            })


        if (page < pageCount - 1) {
            makePaginationElement (page + 1, '>')
        }

        if (page < pageCount - 2) {
            makePaginationElement (pageCount - 1, '>>')
        }
    }

    const updateData = ({ data }) => {
        if (data.length === 0) {
            body.setAttribute (bodyAttribute, 'empty')
            emptyBody.setAttribute (emptyBodyAttribute, 'empty')
        } else {
            body.setAttribute (bodyAttribute, '')
            emptyBody.setAttribute (emptyBodyAttribute, '')
        }

        body.innerHTML = ''

        data.forEach (row => {
            const template = rowTemplate.content.cloneNode (true)

            Object.keys (row)
                .forEach (k => {
                    const field = template.querySelector (`[${rowElementFieldAttribute}="${k}"]`)

                    if (!field) return

                    field.innerHTML = row[k]
                })

            body.appendChild (template)
        })
    }

    eventTarget.addEventListener ('viewmodel', ({ detail }) => {
        // when new data were fetched
        // console.log('detail', detail)
        if ('pageCount' in detail.delta || 'page' in detail.delta) {
            // console.log('page count updated')
            updatePagination (detail.newState)
        }
        
        if ('data' in detail.delta) {
            updateData (detail.newState)
        }

        if ('orders' in detail.delta) {
            updateOrdersAttribute (detail.newState.orders)
        }
    })
}

export default viewFactory