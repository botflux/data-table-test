import deepObjectComparaison from '../../src/helper/deep-object-comparaison'

describe ('#deepObjectComparaison', () => {
    it ('returns the difference between a and b', () => {
        const a = { field: 0 }
        const b = { field: 1 }

        const delta = deepObjectComparaison (a, b)
        expect (delta).toStrictEqual ({
            field: 1
        })
    })

    it ('returns the difference between a and b when more than one field', () => {
        const a = { firstName: 'Jane', lastName: 'Doe' }
        const b = { firstName: 'John', lastName: 'Doe' }

        const delta = deepObjectComparaison (a, b)
        expect(delta).toStrictEqual ({
            firstName: 'John'
        })
    })

    it ('returns the difference between a and b when there is deep equality', () => {
        const a = { firstName: 'Jane', family: {
            john: 20
        } }

        const b = { firstName: 'Jane', family: {
            john: 21
        } }

        const delta = deepObjectComparaison (a, b)
        expect (delta).toStrictEqual ({
            family: {
                john: 21
            }
        })
    })

    it ('returns the difference between a and b when there is deep equality with different types', () => {
        const a = { firstName: 'John', family: 'Jane' }
        const b = { firstName: 'John', family: {
            jane: 20
        } }

        const delta = deepObjectComparaison (a, b)

        expect (delta).toStrictEqual ({
            family: {
                jane: 20
            }
        })
    })

    it ('returns empty object when there is no difference', () => {
        const a = { hello: 'world' }
        
        const delta = deepObjectComparaison (a, a)
        expect (delta).toStrictEqual ({})
    })

    it ('returns empty object when there is no difference with deep objects', () => {
        const a = { hello: 'world', people: {
            jane: 20,
            john: 21
        } }

        const delta = deepObjectComparaison (a, a)

        expect (delta).toStrictEqual ({})
    })

    it ('returns the difference when there is more than 2 level deep', () => {
        const a = {
            hello: 'world',
            world: {
                hello: {
                    john: {
                        doe: 20
                    }
                }
            }
        }

        const b = {
            hello: 'world',
            world: {
                hello: {
                    john: {
                        doe: 23
                    }
                }
            }
        }

        const delta = deepObjectComparaison (a, b)

        expect(delta).toStrictEqual ({
            world: {
                hello: {
                    john: {
                        doe: 23
                    }
                }
            }
        })
    })

    it ('returns the difference when there is complexe difference', () => {

        const a = {
            hello: 'foo',
            field: {
                my: 200
            }
        }
        const b = {
            hello: 'world',
            field: {
                my: {
                    foo: 'bar'
                }
            }
        }

        const delta = deepObjectComparaison (a, b)

        expect (delta).toStrictEqual ({
            hello: 'world',
            field: {
                my: {
                    foo: 'bar'
                }
            }
        })
    })

    it ('returns the difference when one of the to object is a proxy', () => {
        const a = new Proxy ({
            hello: 'world'
        }, {
            set (o, p, v) {
                o[p] = v
            }
        })

        const b = new Proxy ({
            hello: 'w',
        }, {
            set (o, p, v) {
                o[p] = v
            }
        })

        const delta = deepObjectComparaison (a, b)

        expect (delta).toStrictEqual ({
            hello: 'w'
        })
    })

    it ('returns the difference when there is nested proxies', () => {
        const proxyHandler = {
            set (o, p, n) {
                o[p] = n
                return true
            }
        }
        const p1 = new Proxy({
            john: 'hello',
            jane: 'world'
        }, proxyHandler)

        const p2 = new Proxy ({
            bla: 'foo',
            bar: 'bla'
        }, proxyHandler)

        const a = new Proxy ({
            p1, p2, input: 'Jane Doe'
        }, proxyHandler)

        const p3 = new Proxy({
            john: 20,
            jane: 'world'
        }, proxyHandler)

        const p4 = new Proxy ({
            bla: 'foo',
            bar: 'bla'
        }, proxyHandler)

        const b = new Proxy({
            p1: p3,
            p2: p4,
            input: 'Jane Do'
        }, proxyHandler)

        const delta = deepObjectComparaison (a, b)

        expect (delta).toStrictEqual ({
            input: 'Jane Do',
            p1: {
                john: 20
            }
        })
    })
})