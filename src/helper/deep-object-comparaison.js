const deepObjectComparaison = (a, b) => {
    const ae = Object.keys (a)
    const be = Object.keys (b)

    const d = be.reduce ((prev, key) => {
        const aElement = a[key]
        const bElement = b[key]

        if (!aElement || !bElement) {
            return {...prev, [key]: bElement }
        }

        if (typeof aElement === 'object' && typeof bElement === 'object') {
            const diff = deepObjectComparaison(aElement, bElement)

            if (Object.keys (diff).length > 0) {
                return { ...prev, [key]: diff }
            }
            return prev
        }

        if (aElement !== bElement) {
            return {...prev, [key]: bElement }
        }

        return prev
    }, {})

    return d
}

export default deepObjectComparaison