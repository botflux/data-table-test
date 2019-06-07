import viewModelFactory from './view-model-factory'
import viewFactory from './view-factory'

/**
 * Create a new data table
 * 
 * @param {Function} getData 
 * @param {HTMLElement} wrapper 
 * @param {{}} param2 
 * @param {Function} inject
 * @param {EventTarget} errorHandler 
 */
const dataTableFactory = (getData, wrapper, { requestAfter = 250 } = {}, inject = row => row, errorHandler) => {
    const eventTarget = new EventTarget ()

    if (!errorHandler) {
        errorHandler = new EventTarget ()
        errorHandler.addEventListener ('error', console.log)
    }

    viewModelFactory ({
        getData,
        eventTarget,
        errorHandler,
        requestAfter
    })
    viewFactory ({
        eventTarget,
        wrapper,
        errorHandler,
        inject
    })
}

window.Datatable = dataTableFactory
export default dataTableFactory