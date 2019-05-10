import viewModelFactory from './view-model-factory'
import viewFactory from './view-factory'

const dataTableFactory = (getData, wrapper, { requestAfter = 250 } = {}) => {
    const eventTarget = new EventTarget ()

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