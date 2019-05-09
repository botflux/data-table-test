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
})