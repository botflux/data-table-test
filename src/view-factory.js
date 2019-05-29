import attributeToAttributeSelector from './helper/attribute-to-attribute-selector'

/**
 * 
 * @param {{}} param0 
 */
const viewFactory = ({ eventTarget, wrapper, errorHandler, config = {} }) => {

    const {
        /** Inputs attributes */
        inputAttribute = 'data-table-field-input',
        headerAttribute = 'data-table-field-header',
        headerDirectionAttribute = 'data-table-direction-header',

        /** Containers attributes */
        bodyAttribute = 'data-table-body',
        emptyBodyAttribute = 'data-table-empty-body',
        paginationContainerAttribute = 'data-table-pagination-container',

        /** Templates attributes */
        paginationTemplateAttribute = 'data-table-pagination-template',
        rowTemplateAttribute = 'data-table-row-template',

        /** State attributes  */
        activePaginationAttribute = 'data-table-pagination-active',

        paginationElementAttribute = 'data-table-pagination'
    } = config

    /**
     * Rows container
     */
    const bodyElement = document.querySelector(attributeToAttributeSelector(bodyAttribute))
    
    /**
     * Empty body element
     */
    const emptyBodyElement = document.querySelector(attributeToAttributeSelector(emptyBodyAttribute))

    /**
     * Pagination container
     */
    const paginationContainer = document.querySelector(attributeToAttributeSelector(paginationContainerAttribute))

    /**
     * Pagination template
     */
    const paginationTemplate = document.querySelector(attributeToAttributeSelector(paginationTemplateAttribute))

    /**
     * Row template
     */
    const rowTemplate = document.querySelector (attributeToAttributeSelector(rowTemplateAttribute))

    ;[...document.querySelectorAll(attributeToAttributeSelector(headerAttribute))]
        .forEach(element => {
            if (!element) return

            element.addEventListener ('click', () => {
                eventTarget.dispatchEvent (new CustomEvent('view:order', {
                    detail: element.getAttribute(headerAttribute)
                }))
            })
        })

    ;[...document.querySelectorAll(attributeToAttributeSelector(inputAttribute))]
        .forEach (element => {
            if (!element) return

            element.addEventListener ('input', () => {
                eventTarget.dispatchEvent (new CustomEvent('view:input', {
                    detail: {
                        name: element.getAttribute(inputAttribute),
                        value: element.value
                    }
                }))
            })
        })

    const makePaginationElement = (index, text, isActive) => {
        const templateClone = paginationTemplate.content.cloneNode (true)
        const button = templateClone.querySelector (attributeToAttributeSelector(paginationElementAttribute))

        if (!button) return

        button.innerHTML = text

        if (isActive) {
            button.setAttribute (activePaginationAttribute, '')
        }

        button.addEventListener ('click', _ => {
            eventTarget.dispatchEvent (new CustomEvent ('view:page', {
                detail: index
            }))
        })

        paginationContainer.appendChild (templateClone)
    }

    const makeRowElement = row => {
        const template = rowTemplate.cloneNode (true)
                    let templateString = template.innerHTML
                    Object.keys (row)
                        .forEach (k => {
                            const r = new RegExp (`{{\\s(${k})\\s}}`, 'gm')
                            templateString = templateString.replace(r, row[k])
                            // const field = template.querySelector (`[${rowElementFieldAttribute}="${k}"]`)
                            
                            // if (!field) return
        
        
        
                            // field.innerHTML = row[k]
                        })
        
                    template.innerHTML = templateString
        
                    bodyElement.appendChild (template.content)
    }

    eventTarget.addEventListener ('viewmodel', ({ detail }) => {
        console.log(detail)
        if ('orders' in detail.delta) {
            Object.entries (detail.delta.orders).forEach (([k, v]) => {
                const header = document.querySelector(`[${headerAttribute}="${k}"]`)
                header.setAttribute (headerDirectionAttribute, v)
                console.log(header)
            })
        }

        if ('data' in detail.delta) {
            console.log('data has changed', detail.newState.data)

            const isEmpty = detail.newState.data.length === 0
            
            bodyElement.setAttribute (bodyAttribute, isEmpty ? 'empty': null)
            emptyBodyElement.setAttribute (emptyBodyAttribute, isEmpty ? 'empty': null)

            bodyElement.innerHTML = ''

            detail.newState.data.forEach (row => makeRowElement (row))
        }

        if ('page' in detail.delta || 'pageCount' in detail.delta) {
            paginationContainer.innerHTML = ''

            const { pageCount, page } = detail.newState

            if (page > 1) 
                makePaginationElement (0, '<<')

            if (page > 0)
                makePaginationElement(page - 1, '<')
            
            ;[...Array(pageCount).keys()]
                .filter (n => n > page - 3 && n < page + 3)
                .forEach (index => {
                    makePaginationElement (index, index + 1, index === page)
                })

            if (page < pageCount - 2) 
                makePaginationElement (page + 1, '>')

            if (page < pageCount - 1)
                makePaginationElement (pageCount - 1, '>>')
            
        }
    })
    // const { 
    //     tableRowTemplateAttribute = 'data-table-row-template', 
    //     paginationTemplateAttribute = 'data-table-pagination-template',
    //     bodyAttribute = 'data-table-body',
    //     emptyBodyAttribute = 'data-table-empty-body',
    //     paginatorAttribute = 'data-table-paginator',

    //     fieldAttribute = 'data-table-field',
    //     fieldOrderAttribute = 'data-table-field-order',
    //     fieldOrderDirectionAttribute = 'data-table-order-direction',
    //     fieldInputAttribute = 'data-table-field-input',

    //     paginationElementAttribute = 'data-table-pagination',
    //     activePaginationElementAttribute = 'data-table-pagination-active',
    //     rowElementFieldAttribute = 'data-table-field'
    // } = config

    // /**
    //  * Template elements
    //  */
    // const rowTemplate = wrapper.querySelector (`[${tableRowTemplateAttribute}]`)
    // const paginationTemplate = wrapper.querySelector (`[${paginationTemplateAttribute}]`)
    // /**! */

    // /**
    //  * Containers
    //  */
    // const body = wrapper.querySelector (`[${bodyAttribute}]`)
    // const emptyBody = wrapper.querySelector (`[${emptyBodyAttribute}]`)
    // const paginator = wrapper.querySelector (`[${paginatorAttribute}]`)
    // /**! */

    // // get all headers
    // const elements = [...wrapper.querySelectorAll (`[${fieldAttribute}]`)]
    //     // we extract the name of each header
    //     .map (header => ({ name: header.getAttribute (fieldAttribute), header }))
    //     // we extract order control of each header
    //     .map (holder => ({ ...holder, order: wrapper.querySelector (`[${fieldOrderAttribute}="${holder.name}"]`) }))
    //     // we extract input of each header
    //     .map (holder => ({ ...holder, input: wrapper.querySelector (`[${fieldInputAttribute}="${holder.name}"]`) }))

    // elements.forEach (({ input, order, name }) => {
    //     !!input && input.addEventListener ('input', () => {
    //         eventTarget.dispatchEvent (new CustomEvent (`view:input`, {
    //             detail: {
    //                 name,
    //                 value: input.value
    //             }
    //         }))
    //     })

    //     !!order && order.addEventListener ('click', () => {
    //         eventTarget.dispatchEvent (new CustomEvent (`view:order`, {
    //             detail: {
    //                 name
    //             }
    //         }))
    //     })
    // })

    // const makePaginationElement = (page, text, active) => {
    //     const template = paginationTemplate.content.cloneNode (true)
    //     const button = template.querySelector (`[${paginationElementAttribute}]`)

    //     if (!button) {
    //         errorHandler.dispatchEvent (new CustomEvent ('error', {
    //             detail: new Error (`view: no element with ${paginationElementAttribute} found in the pagination template !`)
    //         }))
    //         return
    //     }

    //     if (active)
    //         button.setAttribute (activePaginationElementAttribute, '')

    //     // button.setAttribute ('data-table-pagination', page)
    //     button.addEventListener ('click', () => {
    //         eventTarget.dispatchEvent (new CustomEvent ('view:page', {
    //             detail: page
    //         }))
    //     })

    //     button.innerHTML = text

    //     paginator.appendChild (template)
    // }

    // const updateOrdersAttribute = orders => {
    //     Object.entries (orders)
    //         .forEach (([k, v]) => {
    //             const el = elements.find (e => e.name === k)

    //             if (!el) return

    //             el.order.setAttribute (fieldOrderDirectionAttribute, v)
    //         })
    // }    

    // const updatePagination = ({ pageCount, page }) => {
    //     paginator.innerHTML = ''

    //     if (page > 1) {
    //         makePaginationElement (0, '<<')
    //     }

    //     if (page > 0) {
    //         makePaginationElement (page - 1, '<')
    //     }

    //     ;[...Array(pageCount).keys()]
    //         .filter (n => n > page - 3 && n < page + 3)
    //         .forEach (n => {
    //             let active = n === page

    //             makePaginationElement (n, n + 1, active)
    //         })


    //     if (page < pageCount - 1) {
    //         makePaginationElement (page + 1, '>')
    //     }

    //     if (page < pageCount - 2) {
    //         makePaginationElement (pageCount - 1, '>>')
    //     }
    // }

    // const updateData = ({ data }) => {
    //     if (data.length === 0) {
    //         body.setAttribute (bodyAttribute, 'empty')
    //         emptyBody.setAttribute (emptyBodyAttribute, 'empty')
    //     } else {
    //         body.setAttribute (bodyAttribute, '')
    //         emptyBody.setAttribute (emptyBodyAttribute, '')
    //     }

    //     body.innerHTML = ''

    //     data.forEach (row => {
    //         const template = rowTemplate.cloneNode (true)
    //         let templateString = template.innerHTML
    //         Object.keys (row)
    //             .forEach (k => {
    //                 const r = new RegExp (`{{\\s(${k})\\s}}`, 'gm')
    //                 templateString = templateString.replace(r, row[k])
    //                 // const field = template.querySelector (`[${rowElementFieldAttribute}="${k}"]`)
                    
    //                 // if (!field) return



    //                 // field.innerHTML = row[k]
    //             })

    //         template.innerHTML = templateString

    //         body.appendChild (template.content)
    //     })
    // }

    // eventTarget.addEventListener ('viewmodel', ({ detail }) => {
    //     // when new data were fetched
    //     // console.log('detail', detail)
    //     if ('pageCount' in detail.delta || 'page' in detail.delta) {
    //         // console.log('page count updated')
    //         updatePagination (detail.newState)
    //     }
        
    //     if ('data' in detail.delta) {
    //         updateData (detail.newState)
    //     }

    //     if ('orders' in detail.delta) {
    //         updateOrdersAttribute (detail.newState.orders)
    //     }
    // })
}

export default viewFactory