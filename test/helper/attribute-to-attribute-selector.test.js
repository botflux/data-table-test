import attributeToAttributeSelector from '../../src/helper/attribute-to-attribute-selector'

describe ('#attributeToAttributeSelector', () => {
    it ('returns the attribute surround by square brackets', () => {
        expect (attributeToAttributeSelector ('attribute-name')).toBe ('[attribute-name]')
    })

    it ('returns square brackets with empty content when the attribute name is undefined', () => {
        expect (attributeToAttributeSelector (undefined)).toBe ('[]')
    })
})