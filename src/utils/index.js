
const Utils = {

}

Utils.isPlainObject = function(obj) {
  return Object.prototype.toString.call(obj) === '[object Object]'
}

/**
 * 对象遍历
 */
Utils.each = function(obj, tpl) {
  var keys = Object.keys(obj)
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i]
    if (tpl(key, obj[key])) {
      break
    }
  }
}

/**
 * Returns a depply cloned object without reference.
 * Copied from Vue MultiSelect and Vuex.
 * @type {Object}
 */
Utils.deepClone = function(obj) {
  if (Array.isArray(obj)) {
    return obj.map(Utils.deepClone)
  } else if (obj && typeof obj === 'object') {
    var cloned = {}
    Utils.each(obj, function(key, value) {
      cloned[key] = Utils.deepClone(value)
    })
    return cloned
  } else {
    return obj
  }
}

/**
 * Iterates over radio/checkbox/selection options, it accept four formats
 *
 * @example
 * // array of values
 * options = ['one', 'two', 'three']
 * @example
 * // simple key-value map
 * options = {1: 'one', 2: 'two', 3: 'three'}
 * @example
 * // array of 1-element maps
 * options = [{1: 'one'}, {2: 'two'}, {3: 'three'}]
 * @example
 * // array of elements
 * options = [{value: 1, label: 'one', optgroup: 'group'}, {value: 2, label: 'two'}]
 *
 * @param {object|array} options
 * @param {Utils#OptionsIteratee} tpl
 */
Utils.iterateOptions = function(options, tpl) {
  if (!options) { return }
  if (Array.isArray(options)) {
    options.forEach(function(entry) {
      if (Utils.isPlainObject(entry)) {
        // array of elements
        if ('value' in entry) {
          tpl(entry.value, entry.label || entry.value, entry.optgroup)
        } else { // array of one-element maps
          Utils.each(entry, function(key, value) {
            tpl(key, value)
            return false // break after first entry
          })
        }
      } else { // array of values
        tpl(entry, entry)
      }
    })
  } else { // unordered map
    Utils.each(options, function(key, value) {
      tpl(key, value)
    })
  }
}

/**
 * Replaces {0}, {1}, ... in a string
 * @param {string} str
 * @param {...*} args
 * @returns {string}
 */
Utils.fmt = function(str, args) {
  if (!Array.isArray(args)) {
    args = Array.prototype.slice.call(arguments, 1)
  }

  return str.replace(/{([0-9]+)}/g, function(m, i) {
    return args[parseInt(i)]
  })
}

/**
 * Throws an Error object with custom name or logs an error
 * @param {boolean} [doThrow=true]
 * @param {string} type
 * @param {string} message
 * @param {...*} args
 */
Utils.error = function() {
  var i = 0
  var doThrow = typeof arguments[i] === 'boolean' ? arguments[i++] : true
  var type = arguments[i++]
  var message = arguments[i++]
  var args = Array.isArray(arguments[i]) ? arguments[i] : Array.prototype.slice.call(arguments, i)

  if (doThrow) {
    var err = new Error(Utils.fmt(message, args))
    err.name = type + 'Error'
    err.args = args
    throw err
  } else {
    console.error(type + 'Error: ' + Utils.fmt(message, args))
  }
}
export default Utils
