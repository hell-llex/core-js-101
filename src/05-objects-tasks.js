/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  // throw new Error('Not implemented');
  return { width, height, getArea() { return width * height; } };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  // throw new Error('Not implemented');
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  // throw new Error('Not implemented');
  return Object.setPrototypeOf(JSON.parse(json), proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const TWICE_ERROR = 'Element, id and pseudo-element should not occur more then one time inside the selector';
const NOT_SO_ERROR = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';

const cssSelectorBuilder = {
  element(value) {
    if (this.res && this.res.filter((val) => val.type === 'element').length !== 0) {
      throw new Error(TWICE_ERROR);
    }

    const res = { ...this, res: [...this.res || [], { type: 'element', value }] };
    res.throwErrorIfNotSorted();

    return res;
  },

  id(value) {
    if (this.res && this.res.filter((val) => val.type === 'id').length !== 0) {
      throw new Error(TWICE_ERROR);
    }

    const res = { ...this, res: [...this.res || [], { type: 'id', value }] };
    res.throwErrorIfNotSorted();

    return res;
  },

  class(value) {
    const res = { ...this, res: [...this.res || [], { type: 'class', value }] };
    res.throwErrorIfNotSorted();

    return res;
  },

  attr(value) {
    const res = { ...this, res: [...this.res || [], { type: 'attribute', value }] };
    res.throwErrorIfNotSorted();

    return res;
  },

  pseudoClass(value) {
    const res = { ...this, res: [...this.res || [], { type: 'pseudo-class', value }] };
    res.throwErrorIfNotSorted();

    return res;
  },

  pseudoElement(value) {
    if (this.res && this.res.filter((val) => val.type === 'pseudo-element').length !== 0) {
      throw new Error(TWICE_ERROR);
    }

    const res = { ...this, res: [...this.res || [], { type: 'pseudo-element', value }] };
    res.throwErrorIfNotSorted();

    return res;
  },

  combine(selector1, combinator, selector2) {
    return { ...this, res: [...selector1.res || [], { type: 'combinator', value: combinator }, ...selector2.res || []] };
  },

  stringify() {
    return (this.res || []).reduce((accumutator, obj) => {
      const formatSelector = {
        id: `#${obj.value}`,
        class: `.${obj.value}`,
        attribute: `[${obj.value}]`,
        'pseudo-class': `:${obj.value}`,
        'pseudo-element': `::${obj.value}`,
        combinator: ` ${obj.value} `,
        default: `${obj.value}`,
      };
      return accumutator + (formatSelector[obj.type] || formatSelector.default);
    }, '');
  },

  throwErrorIfNotSorted() {
    const order = ['element', 'id', 'class', 'attribute', 'pseudo-class', 'pseudo-element'];

    const isSorted = (this.res || []).every((value, index, array) => !index
      || order.indexOf(array[index - 1].type) <= order.indexOf(value.type));

    if (!isSorted) {
      // throw new Error(CSS_SELECTOR_NOT_SORTED_ERROR);
      throw new Error(NOT_SO_ERROR);
    }
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
