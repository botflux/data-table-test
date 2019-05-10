import viewModelFactory from './view-model-factory'
import viewFactory from './view-factory'

/**
 * Create a new data table
 * 
 * @param {Function} getData 
 * @param {HTMLElement} wrapper 
 * @param {{}} param2 
 * @param {EventTarget} errorHandler 
 */
const dataTableFactory = (getData, wrapper, { requestAfter = 250 } = {}, errorHandler) => {
    const eventTarget = new EventTarget ()

    if (!errorHandler) errorHandler = new EventTarget ()

    viewModelFactory ({
        getData,
        eventTarget,
        requestAfter
    })

    viewFactory ({
        eventTarget,
        wrapper
    })
}

export default dataTableFactory