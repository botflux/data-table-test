const deepObjectComparaison = (a, b) => {
    const be = Object.keys (b)

    const d = be.reduce ((prev, key) => {
        const aElement = a[key]
        const bElement = b[key]
        
        if ((!aElement || !bElement) && (aElement !== bElement)) {
            return {...prev, [key]: bElement }
        }

        if (typeof aElement === 'object' && typeof bElement === 'object' && !Array.isArray (aElement) && !Array.isArray (bElement)) {
            const diff = deepObjectComparaison(aElement, bElement)

            if (Object.keys (diff).length > 0) {
                return { ...prev, [key]: diff }
            }
            return prev
        }
        
        if (Array.isArray (aElement) && Array.isArray (bElement)) {
            return {...prev, [key]: bElement }
        }

        if (aElement !== bElement) {
            return {...prev, [key]: bElement }
        }

        return prev
    }, {})

    return d
}

export default deepObjectComparaison