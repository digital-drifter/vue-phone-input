'use strict';

/*!
 * Vue.js v2.5.17
 * (c) 2014-2018 Evan You
 * Released under the MIT License.
 */
/*  */

var emptyObject = Object.freeze({});

// these helpers produces better vm code in JS engines due to their
// explicitness and function inlining
function isUndef (v) {
  return v === undefined || v === null
}

function isDef (v) {
  return v !== undefined && v !== null
}

function isTrue (v) {
  return v === true
}

function isFalse (v) {
  return v === false
}

/**
 * Check if value is primitive
 */
function isPrimitive (value) {
  return (
    typeof value === 'string' ||
    typeof value === 'number' ||
    // $flow-disable-line
    typeof value === 'symbol' ||
    typeof value === 'boolean'
  )
}

/**
 * Quick object check - this is primarily used to tell
 * Objects from primitive values when we know the value
 * is a JSON-compliant type.
 */
function isObject (obj) {
  return obj !== null && typeof obj === 'object'
}

/**
 * Get the raw type string of a value e.g. [object Object]
 */
var _toString = Object.prototype.toString;

function toRawType (value) {
  return _toString.call(value).slice(8, -1)
}

/**
 * Strict object type check. Only returns true
 * for plain JavaScript objects.
 */
function isPlainObject (obj) {
  return _toString.call(obj) === '[object Object]'
}

function isRegExp (v) {
  return _toString.call(v) === '[object RegExp]'
}

/**
 * Check if val is a valid array index.
 */
function isValidArrayIndex (val) {
  var n = parseFloat(String(val));
  return n >= 0 && Math.floor(n) === n && isFinite(val)
}

/**
 * Convert a value to a string that is actually rendered.
 */
function toString (val) {
  return val == null
    ? ''
    : typeof val === 'object'
      ? JSON.stringify(val, null, 2)
      : String(val)
}

/**
 * Convert a input value to a number for persistence.
 * If the conversion fails, return original string.
 */
function toNumber (val) {
  var n = parseFloat(val);
  return isNaN(n) ? val : n
}

/**
 * Make a map and return a function for checking if a key
 * is in that map.
 */
function makeMap (
  str,
  expectsLowerCase
) {
  var map = Object.create(null);
  var list = str.split(',');
  for (var i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase
    ? function (val) { return map[val.toLowerCase()]; }
    : function (val) { return map[val]; }
}

/**
 * Check if a tag is a built-in tag.
 */
var isBuiltInTag = makeMap('slot,component', true);

/**
 * Check if a attribute is a reserved attribute.
 */
var isReservedAttribute = makeMap('key,ref,slot,slot-scope,is');

/**
 * Remove an item from an array
 */
function remove (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}

/**
 * Check whether the object has the property.
 */
var hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn (obj, key) {
  return hasOwnProperty.call(obj, key)
}

/**
 * Create a cached version of a pure function.
 */
function cached (fn) {
  var cache = Object.create(null);
  return (function cachedFn (str) {
    var hit = cache[str];
    return hit || (cache[str] = fn(str))
  })
}

/**
 * Camelize a hyphen-delimited string.
 */
var camelizeRE = /-(\w)/g;
var camelize = cached(function (str) {
  return str.replace(camelizeRE, function (_, c) { return c ? c.toUpperCase() : ''; })
});

/**
 * Capitalize a string.
 */
var capitalize = cached(function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
});

/**
 * Hyphenate a camelCase string.
 */
var hyphenateRE = /\B([A-Z])/g;
var hyphenate = cached(function (str) {
  return str.replace(hyphenateRE, '-$1').toLowerCase()
});

/**
 * Simple bind polyfill for environments that do not support it... e.g.
 * PhantomJS 1.x. Technically we don't need this anymore since native bind is
 * now more performant in most browsers, but removing it would be breaking for
 * code that was able to run in PhantomJS 1.x, so this must be kept for
 * backwards compatibility.
 */

/* istanbul ignore next */
function polyfillBind (fn, ctx) {
  function boundFn (a) {
    var l = arguments.length;
    return l
      ? l > 1
        ? fn.apply(ctx, arguments)
        : fn.call(ctx, a)
      : fn.call(ctx)
  }

  boundFn._length = fn.length;
  return boundFn
}

function nativeBind (fn, ctx) {
  return fn.bind(ctx)
}

var bind = Function.prototype.bind
  ? nativeBind
  : polyfillBind;

/**
 * Convert an Array-like object to a real Array.
 */
function toArray (list, start) {
  start = start || 0;
  var i = list.length - start;
  var ret = new Array(i);
  while (i--) {
    ret[i] = list[i + start];
  }
  return ret
}

/**
 * Mix properties into target object.
 */
function extend (to, _from) {
  for (var key in _from) {
    to[key] = _from[key];
  }
  return to
}

/**
 * Merge an Array of Objects into a single Object.
 */
function toObject (arr) {
  var res = {};
  for (var i = 0; i < arr.length; i++) {
    if (arr[i]) {
      extend(res, arr[i]);
    }
  }
  return res
}

/**
 * Perform no operation.
 * Stubbing args to make Flow happy without leaving useless transpiled code
 * with ...rest (https://flow.org/blog/2017/05/07/Strict-Function-Call-Arity/)
 */
function noop (a, b, c) {}

/**
 * Always return false.
 */
var no = function (a, b, c) { return false; };

/**
 * Return same value
 */
var identity = function (_) { return _; };

/**
 * Generate a static keys string from compiler modules.
 */


/**
 * Check if two values are loosely equal - that is,
 * if they are plain objects, do they have the same shape?
 */
function looseEqual (a, b) {
  if (a === b) { return true }
  var isObjectA = isObject(a);
  var isObjectB = isObject(b);
  if (isObjectA && isObjectB) {
    try {
      var isArrayA = Array.isArray(a);
      var isArrayB = Array.isArray(b);
      if (isArrayA && isArrayB) {
        return a.length === b.length && a.every(function (e, i) {
          return looseEqual(e, b[i])
        })
      } else if (!isArrayA && !isArrayB) {
        var keysA = Object.keys(a);
        var keysB = Object.keys(b);
        return keysA.length === keysB.length && keysA.every(function (key) {
          return looseEqual(a[key], b[key])
        })
      } else {
        /* istanbul ignore next */
        return false
      }
    } catch (e) {
      /* istanbul ignore next */
      return false
    }
  } else if (!isObjectA && !isObjectB) {
    return String(a) === String(b)
  } else {
    return false
  }
}

function looseIndexOf (arr, val) {
  for (var i = 0; i < arr.length; i++) {
    if (looseEqual(arr[i], val)) { return i }
  }
  return -1
}

/**
 * Ensure a function is called only once.
 */
function once (fn) {
  var called = false;
  return function () {
    if (!called) {
      called = true;
      fn.apply(this, arguments);
    }
  }
}

var SSR_ATTR = 'data-server-rendered';

var ASSET_TYPES = [
  'component',
  'directive',
  'filter'
];

var LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed',
  'activated',
  'deactivated',
  'errorCaptured'
];

/*  */

var config = ({
  /**
   * Option merge strategies (used in core/util/options)
   */
  // $flow-disable-line
  optionMergeStrategies: Object.create(null),

  /**
   * Whether to suppress warnings.
   */
  silent: false,

  /**
   * Show production mode tip message on boot?
   */
  productionTip: 'production' !== 'production',

  /**
   * Whether to enable devtools
   */
  devtools: 'production' !== 'production',

  /**
   * Whether to record perf
   */
  performance: false,

  /**
   * Error handler for watcher errors
   */
  errorHandler: null,

  /**
   * Warn handler for watcher warns
   */
  warnHandler: null,

  /**
   * Ignore certain custom elements
   */
  ignoredElements: [],

  /**
   * Custom user key aliases for v-on
   */
  // $flow-disable-line
  keyCodes: Object.create(null),

  /**
   * Check if a tag is reserved so that it cannot be registered as a
   * component. This is platform-dependent and may be overwritten.
   */
  isReservedTag: no,

  /**
   * Check if an attribute is reserved so that it cannot be used as a component
   * prop. This is platform-dependent and may be overwritten.
   */
  isReservedAttr: no,

  /**
   * Check if a tag is an unknown element.
   * Platform-dependent.
   */
  isUnknownElement: no,

  /**
   * Get the namespace of an element
   */
  getTagNamespace: noop,

  /**
   * Parse the real tag name for the specific platform.
   */
  parsePlatformTagName: identity,

  /**
   * Check if an attribute must be bound using property, e.g. value
   * Platform-dependent.
   */
  mustUseProp: no,

  /**
   * Exposed for legacy reasons
   */
  _lifecycleHooks: LIFECYCLE_HOOKS
});

/*  */

/**
 * Check if a string starts with $ or _
 */
function isReserved (str) {
  var c = (str + '').charCodeAt(0);
  return c === 0x24 || c === 0x5F
}

/**
 * Define a property.
 */
function def (obj, key, val, enumerable) {
  Object.defineProperty(obj, key, {
    value: val,
    enumerable: !!enumerable,
    writable: true,
    configurable: true
  });
}

/**
 * Parse simple path.
 */
var bailRE = /[^\w.$]/;
function parsePath (path) {
  if (bailRE.test(path)) {
    return
  }
  var segments = path.split('.');
  return function (obj) {
    for (var i = 0; i < segments.length; i++) {
      if (!obj) { return }
      obj = obj[segments[i]];
    }
    return obj
  }
}

/*  */

// can we use __proto__?
var hasProto = '__proto__' in {};

// Browser environment sniffing
var inBrowser = typeof window !== 'undefined';
var inWeex = typeof WXEnvironment !== 'undefined' && !!WXEnvironment.platform;
var weexPlatform = inWeex && WXEnvironment.platform.toLowerCase();
var UA = inBrowser && window.navigator.userAgent.toLowerCase();
var isIE = UA && /msie|trident/.test(UA);
var isIE9 = UA && UA.indexOf('msie 9.0') > 0;
var isEdge = UA && UA.indexOf('edge/') > 0;
var isAndroid = (UA && UA.indexOf('android') > 0) || (weexPlatform === 'android');
var isIOS = (UA && /iphone|ipad|ipod|ios/.test(UA)) || (weexPlatform === 'ios');
var isChrome = UA && /chrome\/\d+/.test(UA) && !isEdge;

// Firefox has a "watch" function on Object.prototype...
var nativeWatch = ({}).watch;

var supportsPassive = false;
if (inBrowser) {
  try {
    var opts = {};
    Object.defineProperty(opts, 'passive', ({
      get: function get () {
        /* istanbul ignore next */
        supportsPassive = true;
      }
    })); // https://github.com/facebook/flow/issues/285
    window.addEventListener('test-passive', null, opts);
  } catch (e) {}
}

// this needs to be lazy-evaled because vue may be required before
// vue-server-renderer can set VUE_ENV
var _isServer;
var isServerRendering = function () {
  if (_isServer === undefined) {
    /* istanbul ignore if */
    if (!inBrowser && !inWeex && typeof global !== 'undefined') {
      // detect presence of vue-server-renderer and avoid
      // Webpack shimming the process
      _isServer = global['process'].env.VUE_ENV === 'server';
    } else {
      _isServer = false;
    }
  }
  return _isServer
};

// detect devtools
var devtools = inBrowser && window.__VUE_DEVTOOLS_GLOBAL_HOOK__;

/* istanbul ignore next */
function isNative (Ctor) {
  return typeof Ctor === 'function' && /native code/.test(Ctor.toString())
}

var hasSymbol =
  typeof Symbol !== 'undefined' && isNative(Symbol) &&
  typeof Reflect !== 'undefined' && isNative(Reflect.ownKeys);

var _Set;
/* istanbul ignore if */ // $flow-disable-line
if (typeof Set !== 'undefined' && isNative(Set)) {
  // use native Set when available.
  _Set = Set;
} else {
  // a non-standard Set polyfill that only works with primitive keys.
  _Set = (function () {
    function Set () {
      this.set = Object.create(null);
    }
    Set.prototype.has = function has (key) {
      return this.set[key] === true
    };
    Set.prototype.add = function add (key) {
      this.set[key] = true;
    };
    Set.prototype.clear = function clear () {
      this.set = Object.create(null);
    };

    return Set;
  }());
}

/*  */

var warn = noop;

/*  */


var uid = 0;

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
var Dep = function Dep () {
  this.id = uid++;
  this.subs = [];
};

Dep.prototype.addSub = function addSub (sub) {
  this.subs.push(sub);
};

Dep.prototype.removeSub = function removeSub (sub) {
  remove(this.subs, sub);
};

Dep.prototype.depend = function depend () {
  if (Dep.target) {
    Dep.target.addDep(this);
  }
};

Dep.prototype.notify = function notify () {
  // stabilize the subscriber list first
  var subs = this.subs.slice();
  for (var i = 0, l = subs.length; i < l; i++) {
    subs[i].update();
  }
};

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
Dep.target = null;
var targetStack = [];

function pushTarget (_target) {
  if (Dep.target) { targetStack.push(Dep.target); }
  Dep.target = _target;
}

function popTarget () {
  Dep.target = targetStack.pop();
}

/*  */

var VNode = function VNode (
  tag,
  data,
  children,
  text,
  elm,
  context,
  componentOptions,
  asyncFactory
) {
  this.tag = tag;
  this.data = data;
  this.children = children;
  this.text = text;
  this.elm = elm;
  this.ns = undefined;
  this.context = context;
  this.fnContext = undefined;
  this.fnOptions = undefined;
  this.fnScopeId = undefined;
  this.key = data && data.key;
  this.componentOptions = componentOptions;
  this.componentInstance = undefined;
  this.parent = undefined;
  this.raw = false;
  this.isStatic = false;
  this.isRootInsert = true;
  this.isComment = false;
  this.isCloned = false;
  this.isOnce = false;
  this.asyncFactory = asyncFactory;
  this.asyncMeta = undefined;
  this.isAsyncPlaceholder = false;
};

var prototypeAccessors = { child: { configurable: true } };

// DEPRECATED: alias for componentInstance for backwards compat.
/* istanbul ignore next */
prototypeAccessors.child.get = function () {
  return this.componentInstance
};

Object.defineProperties( VNode.prototype, prototypeAccessors );

var createEmptyVNode = function (text) {
  if ( text === void 0 ) text = '';

  var node = new VNode();
  node.text = text;
  node.isComment = true;
  return node
};

function createTextVNode (val) {
  return new VNode(undefined, undefined, undefined, String(val))
}

// optimized shallow clone
// used for static nodes and slot nodes because they may be reused across
// multiple renders, cloning them avoids errors when DOM manipulations rely
// on their elm reference.
function cloneVNode (vnode) {
  var cloned = new VNode(
    vnode.tag,
    vnode.data,
    vnode.children,
    vnode.text,
    vnode.elm,
    vnode.context,
    vnode.componentOptions,
    vnode.asyncFactory
  );
  cloned.ns = vnode.ns;
  cloned.isStatic = vnode.isStatic;
  cloned.key = vnode.key;
  cloned.isComment = vnode.isComment;
  cloned.fnContext = vnode.fnContext;
  cloned.fnOptions = vnode.fnOptions;
  cloned.fnScopeId = vnode.fnScopeId;
  cloned.isCloned = true;
  return cloned
}

/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

var arrayProto = Array.prototype;
var arrayMethods = Object.create(arrayProto);

var methodsToPatch = [
  'push',
  'pop',
  'shift',
  'unshift',
  'splice',
  'sort',
  'reverse'
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  var original = arrayProto[method];
  def(arrayMethods, method, function mutator () {
    var args = [], len = arguments.length;
    while ( len-- ) args[ len ] = arguments[ len ];

    var result = original.apply(this, args);
    var ob = this.__ob__;
    var inserted;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break
      case 'splice':
        inserted = args.slice(2);
        break
    }
    if (inserted) { ob.observeArray(inserted); }
    // notify change
    ob.dep.notify();
    return result
  });
});

/*  */

var arrayKeys = Object.getOwnPropertyNames(arrayMethods);

/**
 * In some cases we may want to disable observation inside a component's
 * update computation.
 */
var shouldObserve = true;

function toggleObserving (value) {
  shouldObserve = value;
}

/**
 * Observer class that is attached to each observed
 * object. Once attached, the observer converts the target
 * object's property keys into getter/setters that
 * collect dependencies and dispatch updates.
 */
var Observer = function Observer (value) {
  this.value = value;
  this.dep = new Dep();
  this.vmCount = 0;
  def(value, '__ob__', this);
  if (Array.isArray(value)) {
    var augment = hasProto
      ? protoAugment
      : copyAugment;
    augment(value, arrayMethods, arrayKeys);
    this.observeArray(value);
  } else {
    this.walk(value);
  }
};

/**
 * Walk through each property and convert them into
 * getter/setters. This method should only be called when
 * value type is Object.
 */
Observer.prototype.walk = function walk (obj) {
  var keys = Object.keys(obj);
  for (var i = 0; i < keys.length; i++) {
    defineReactive(obj, keys[i]);
  }
};

/**
 * Observe a list of Array items.
 */
Observer.prototype.observeArray = function observeArray (items) {
  for (var i = 0, l = items.length; i < l; i++) {
    observe(items[i]);
  }
};

// helpers

/**
 * Augment an target Object or Array by intercepting
 * the prototype chain using __proto__
 */
function protoAugment (target, src, keys) {
  /* eslint-disable no-proto */
  target.__proto__ = src;
  /* eslint-enable no-proto */
}

/**
 * Augment an target Object or Array by defining
 * hidden properties.
 */
/* istanbul ignore next */
function copyAugment (target, src, keys) {
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    def(target, key, src[key]);
  }
}

/**
 * Attempt to create an observer instance for a value,
 * returns the new observer if successfully observed,
 * or the existing observer if the value already has one.
 */
function observe (value, asRootData) {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  var ob;
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__;
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value);
  }
  if (asRootData && ob) {
    ob.vmCount++;
  }
  return ob
}

/**
 * Define a reactive property on an Object.
 */
function defineReactive (
  obj,
  key,
  val,
  customSetter,
  shallow
) {
  var dep = new Dep();

  var property = Object.getOwnPropertyDescriptor(obj, key);
  if (property && property.configurable === false) {
    return
  }

  // cater for pre-defined getter/setters
  var getter = property && property.get;
  if (!getter && arguments.length === 2) {
    val = obj[key];
  }
  var setter = property && property.set;

  var childOb = !shallow && observe(val);
  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      var value = getter ? getter.call(obj) : val;
      if (Dep.target) {
        dep.depend();
        if (childOb) {
          childOb.dep.depend();
          if (Array.isArray(value)) {
            dependArray(value);
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      var value = getter ? getter.call(obj) : val;
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      if (setter) {
        setter.call(obj, newVal);
      } else {
        val = newVal;
      }
      childOb = !shallow && observe(newVal);
      dep.notify();
    }
  });
}

/**
 * Set a property on an object. Adds the new property and
 * triggers change notification if the property doesn't
 * already exist.
 */
function set (target, key, val) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val
  }
  if (key in target && !(key in Object.prototype)) {
    target[key] = val;
    return val
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    return val
  }
  if (!ob) {
    target[key] = val;
    return val
  }
  defineReactive(ob.value, key, val);
  ob.dep.notify();
  return val
}

/**
 * Delete a property and trigger change if necessary.
 */
function del (target, key) {
  if (Array.isArray(target) && isValidArrayIndex(key)) {
    target.splice(key, 1);
    return
  }
  var ob = (target).__ob__;
  if (target._isVue || (ob && ob.vmCount)) {
    return
  }
  if (!hasOwn(target, key)) {
    return
  }
  delete target[key];
  if (!ob) {
    return
  }
  ob.dep.notify();
}

/**
 * Collect dependencies on array elements when the array is touched, since
 * we cannot intercept array element access like property getters.
 */
function dependArray (value) {
  for (var e = (void 0), i = 0, l = value.length; i < l; i++) {
    e = value[i];
    e && e.__ob__ && e.__ob__.dep.depend();
    if (Array.isArray(e)) {
      dependArray(e);
    }
  }
}

/*  */

/**
 * Option overwriting strategies are functions that handle
 * how to merge a parent option value and a child option
 * value into the final value.
 */
var strats = config.optionMergeStrategies;

/**
 * Helper that recursively merges two data objects together.
 */
function mergeData (to, from) {
  if (!from) { return to }
  var key, toVal, fromVal;
  var keys = Object.keys(from);
  for (var i = 0; i < keys.length; i++) {
    key = keys[i];
    toVal = to[key];
    fromVal = from[key];
    if (!hasOwn(to, key)) {
      set(to, key, fromVal);
    } else if (isPlainObject(toVal) && isPlainObject(fromVal)) {
      mergeData(toVal, fromVal);
    }
  }
  return to
}

/**
 * Data
 */
function mergeDataOrFn (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    // in a Vue.extend merge, both should be functions
    if (!childVal) {
      return parentVal
    }
    if (!parentVal) {
      return childVal
    }
    // when parentVal & childVal are both present,
    // we need to return a function that returns the
    // merged result of both functions... no need to
    // check if parentVal is a function here because
    // it has to be a function to pass previous merges.
    return function mergedDataFn () {
      return mergeData(
        typeof childVal === 'function' ? childVal.call(this, this) : childVal,
        typeof parentVal === 'function' ? parentVal.call(this, this) : parentVal
      )
    }
  } else {
    return function mergedInstanceDataFn () {
      // instance merge
      var instanceData = typeof childVal === 'function'
        ? childVal.call(vm, vm)
        : childVal;
      var defaultData = typeof parentVal === 'function'
        ? parentVal.call(vm, vm)
        : parentVal;
      if (instanceData) {
        return mergeData(instanceData, defaultData)
      } else {
        return defaultData
      }
    }
  }
}

strats.data = function (
  parentVal,
  childVal,
  vm
) {
  if (!vm) {
    if (childVal && typeof childVal !== 'function') {

      return parentVal
    }
    return mergeDataOrFn(parentVal, childVal)
  }

  return mergeDataOrFn(parentVal, childVal, vm)
};

/**
 * Hooks and props are merged as arrays.
 */
function mergeHook (
  parentVal,
  childVal
) {
  return childVal
    ? parentVal
      ? parentVal.concat(childVal)
      : Array.isArray(childVal)
        ? childVal
        : [childVal]
    : parentVal
}

LIFECYCLE_HOOKS.forEach(function (hook) {
  strats[hook] = mergeHook;
});

/**
 * Assets
 *
 * When a vm is present (instance creation), we need to do
 * a three-way merge between constructor options, instance
 * options and parent options.
 */
function mergeAssets (
  parentVal,
  childVal,
  vm,
  key
) {
  var res = Object.create(parentVal || null);
  if (childVal) {
    return extend(res, childVal)
  } else {
    return res
  }
}

ASSET_TYPES.forEach(function (type) {
  strats[type + 's'] = mergeAssets;
});

/**
 * Watchers.
 *
 * Watchers hashes should not overwrite one
 * another, so we merge them as arrays.
 */
strats.watch = function (
  parentVal,
  childVal,
  vm,
  key
) {
  // work around Firefox's Object.prototype.watch...
  if (parentVal === nativeWatch) { parentVal = undefined; }
  if (childVal === nativeWatch) { childVal = undefined; }
  /* istanbul ignore if */
  if (!childVal) { return Object.create(parentVal || null) }
  if (!parentVal) { return childVal }
  var ret = {};
  extend(ret, parentVal);
  for (var key$1 in childVal) {
    var parent = ret[key$1];
    var child = childVal[key$1];
    if (parent && !Array.isArray(parent)) {
      parent = [parent];
    }
    ret[key$1] = parent
      ? parent.concat(child)
      : Array.isArray(child) ? child : [child];
  }
  return ret
};

/**
 * Other object hashes.
 */
strats.props =
strats.methods =
strats.inject =
strats.computed = function (
  parentVal,
  childVal,
  vm,
  key
) {
  if (childVal && 'production' !== 'production') {
    assertObjectType(key, childVal, vm);
  }
  if (!parentVal) { return childVal }
  var ret = Object.create(null);
  extend(ret, parentVal);
  if (childVal) { extend(ret, childVal); }
  return ret
};
strats.provide = mergeDataOrFn;

/**
 * Default strategy.
 */
var defaultStrat = function (parentVal, childVal) {
  return childVal === undefined
    ? parentVal
    : childVal
};

/**
 * Ensure all props option syntax are normalized into the
 * Object-based format.
 */
function normalizeProps (options, vm) {
  var props = options.props;
  if (!props) { return }
  var res = {};
  var i, val, name;
  if (Array.isArray(props)) {
    i = props.length;
    while (i--) {
      val = props[i];
      if (typeof val === 'string') {
        name = camelize(val);
        res[name] = { type: null };
      }
    }
  } else if (isPlainObject(props)) {
    for (var key in props) {
      val = props[key];
      name = camelize(key);
      res[name] = isPlainObject(val)
        ? val
        : { type: val };
    }
  }
  options.props = res;
}

/**
 * Normalize all injections into Object-based format
 */
function normalizeInject (options, vm) {
  var inject = options.inject;
  if (!inject) { return }
  var normalized = options.inject = {};
  if (Array.isArray(inject)) {
    for (var i = 0; i < inject.length; i++) {
      normalized[inject[i]] = { from: inject[i] };
    }
  } else if (isPlainObject(inject)) {
    for (var key in inject) {
      var val = inject[key];
      normalized[key] = isPlainObject(val)
        ? extend({ from: key }, val)
        : { from: val };
    }
  }
}

/**
 * Normalize raw function directives into object format.
 */
function normalizeDirectives (options) {
  var dirs = options.directives;
  if (dirs) {
    for (var key in dirs) {
      var def = dirs[key];
      if (typeof def === 'function') {
        dirs[key] = { bind: def, update: def };
      }
    }
  }
}

function assertObjectType (name, value, vm) {
  if (!isPlainObject(value)) {
    warn(
      "Invalid value for option \"" + name + "\": expected an Object, " +
      "but got " + (toRawType(value)) + ".",
      vm
    );
  }
}

/**
 * Merge two option objects into a new one.
 * Core utility used in both instantiation and inheritance.
 */
function mergeOptions (
  parent,
  child,
  vm
) {

  if (typeof child === 'function') {
    child = child.options;
  }

  normalizeProps(child, vm);
  normalizeInject(child, vm);
  normalizeDirectives(child);
  var extendsFrom = child.extends;
  if (extendsFrom) {
    parent = mergeOptions(parent, extendsFrom, vm);
  }
  if (child.mixins) {
    for (var i = 0, l = child.mixins.length; i < l; i++) {
      parent = mergeOptions(parent, child.mixins[i], vm);
    }
  }
  var options = {};
  var key;
  for (key in parent) {
    mergeField(key);
  }
  for (key in child) {
    if (!hasOwn(parent, key)) {
      mergeField(key);
    }
  }
  function mergeField (key) {
    var strat = strats[key] || defaultStrat;
    options[key] = strat(parent[key], child[key], vm, key);
  }
  return options
}

/**
 * Resolve an asset.
 * This function is used because child instances need access
 * to assets defined in its ancestor chain.
 */
function resolveAsset (
  options,
  type,
  id,
  warnMissing
) {
  /* istanbul ignore if */
  if (typeof id !== 'string') {
    return
  }
  var assets = options[type];
  // check local registration variations first
  if (hasOwn(assets, id)) { return assets[id] }
  var camelizedId = camelize(id);
  if (hasOwn(assets, camelizedId)) { return assets[camelizedId] }
  var PascalCaseId = capitalize(camelizedId);
  if (hasOwn(assets, PascalCaseId)) { return assets[PascalCaseId] }
  // fallback to prototype chain
  var res = assets[id] || assets[camelizedId] || assets[PascalCaseId];
  return res
}

/*  */

function validateProp (
  key,
  propOptions,
  propsData,
  vm
) {
  var prop = propOptions[key];
  var absent = !hasOwn(propsData, key);
  var value = propsData[key];
  // boolean casting
  var booleanIndex = getTypeIndex(Boolean, prop.type);
  if (booleanIndex > -1) {
    if (absent && !hasOwn(prop, 'default')) {
      value = false;
    } else if (value === '' || value === hyphenate(key)) {
      // only cast empty string / same name to boolean if
      // boolean has higher priority
      var stringIndex = getTypeIndex(String, prop.type);
      if (stringIndex < 0 || booleanIndex < stringIndex) {
        value = true;
      }
    }
  }
  // check default value
  if (value === undefined) {
    value = getPropDefaultValue(vm, prop, key);
    // since the default value is a fresh copy,
    // make sure to observe it.
    var prevShouldObserve = shouldObserve;
    toggleObserving(true);
    observe(value);
    toggleObserving(prevShouldObserve);
  }
  return value
}

/**
 * Get the default value of a prop.
 */
function getPropDefaultValue (vm, prop, key) {
  // no default, return undefined
  if (!hasOwn(prop, 'default')) {
    return undefined
  }
  var def = prop.default;
  // the raw prop value was also undefined from previous render,
  // return previous default value to avoid unnecessary watcher trigger
  if (vm && vm.$options.propsData &&
    vm.$options.propsData[key] === undefined &&
    vm._props[key] !== undefined
  ) {
    return vm._props[key]
  }
  // call factory function for non-Function types
  // a value is Function if its prototype is function even across different execution context
  return typeof def === 'function' && getType(prop.type) !== 'Function'
    ? def.call(vm)
    : def
}

/**
 * Use function string name to check built-in types,
 * because a simple equality check will fail when running
 * across different vms / iframes.
 */
function getType (fn) {
  var match = fn && fn.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ''
}

function isSameType (a, b) {
  return getType(a) === getType(b)
}

function getTypeIndex (type, expectedTypes) {
  if (!Array.isArray(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1
  }
  for (var i = 0, len = expectedTypes.length; i < len; i++) {
    if (isSameType(expectedTypes[i], type)) {
      return i
    }
  }
  return -1
}

/*  */

function handleError (err, vm, info) {
  if (vm) {
    var cur = vm;
    while ((cur = cur.$parent)) {
      var hooks = cur.$options.errorCaptured;
      if (hooks) {
        for (var i = 0; i < hooks.length; i++) {
          try {
            var capture = hooks[i].call(cur, err, vm, info) === false;
            if (capture) { return }
          } catch (e) {
            globalHandleError(e, cur, 'errorCaptured hook');
          }
        }
      }
    }
  }
  globalHandleError(err, vm, info);
}

function globalHandleError (err, vm, info) {
  if (config.errorHandler) {
    try {
      return config.errorHandler.call(null, err, vm, info)
    } catch (e) {
      logError(e, null, 'config.errorHandler');
    }
  }
  logError(err, vm, info);
}

function logError (err, vm, info) {
  /* istanbul ignore else */
  if ((inBrowser || inWeex) && typeof console !== 'undefined') {
    console.error(err);
  } else {
    throw err
  }
}

/*  */
/* globals MessageChannel */

var callbacks = [];
var pending = false;

function flushCallbacks () {
  pending = false;
  var copies = callbacks.slice(0);
  callbacks.length = 0;
  for (var i = 0; i < copies.length; i++) {
    copies[i]();
  }
}

// Here we have async deferring wrappers using both microtasks and (macro) tasks.
// In < 2.4 we used microtasks everywhere, but there are some scenarios where
// microtasks have too high a priority and fire in between supposedly
// sequential events (e.g. #4521, #6690) or even between bubbling of the same
// event (#6566). However, using (macro) tasks everywhere also has subtle problems
// when state is changed right before repaint (e.g. #6813, out-in transitions).
// Here we use microtask by default, but expose a way to force (macro) task when
// needed (e.g. in event handlers attached by v-on).
var microTimerFunc;
var macroTimerFunc;
var useMacroTask = false;

// Determine (macro) task defer implementation.
// Technically setImmediate should be the ideal choice, but it's only available
// in IE. The only polyfill that consistently queues the callback after all DOM
// events triggered in the same loop is by using MessageChannel.
/* istanbul ignore if */
if (typeof setImmediate !== 'undefined' && isNative(setImmediate)) {
  macroTimerFunc = function () {
    setImmediate(flushCallbacks);
  };
} else if (typeof MessageChannel !== 'undefined' && (
  isNative(MessageChannel) ||
  // PhantomJS
  MessageChannel.toString() === '[object MessageChannelConstructor]'
)) {
  var channel = new MessageChannel();
  var port = channel.port2;
  channel.port1.onmessage = flushCallbacks;
  macroTimerFunc = function () {
    port.postMessage(1);
  };
} else {
  /* istanbul ignore next */
  macroTimerFunc = function () {
    setTimeout(flushCallbacks, 0);
  };
}

// Determine microtask defer implementation.
/* istanbul ignore next, $flow-disable-line */
if (typeof Promise !== 'undefined' && isNative(Promise)) {
  var p = Promise.resolve();
  microTimerFunc = function () {
    p.then(flushCallbacks);
    // in problematic UIWebViews, Promise.then doesn't completely break, but
    // it can get stuck in a weird state where callbacks are pushed into the
    // microtask queue but the queue isn't being flushed, until the browser
    // needs to do some other work, e.g. handle a timer. Therefore we can
    // "force" the microtask queue to be flushed by adding an empty timer.
    if (isIOS) { setTimeout(noop); }
  };
} else {
  // fallback to macro
  microTimerFunc = macroTimerFunc;
}

/**
 * Wrap a function so that if any code inside triggers state change,
 * the changes are queued using a (macro) task instead of a microtask.
 */
function withMacroTask (fn) {
  return fn._withTask || (fn._withTask = function () {
    useMacroTask = true;
    var res = fn.apply(null, arguments);
    useMacroTask = false;
    return res
  })
}

function nextTick (cb, ctx) {
  var _resolve;
  callbacks.push(function () {
    if (cb) {
      try {
        cb.call(ctx);
      } catch (e) {
        handleError(e, ctx, 'nextTick');
      }
    } else if (_resolve) {
      _resolve(ctx);
    }
  });
  if (!pending) {
    pending = true;
    if (useMacroTask) {
      macroTimerFunc();
    } else {
      microTimerFunc();
    }
  }
  // $flow-disable-line
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(function (resolve) {
      _resolve = resolve;
    })
  }
}

/*  */

var seenObjects = new _Set();

/**
 * Recursively traverse an object to evoke all converted
 * getters, so that every nested property inside the object
 * is collected as a "deep" dependency.
 */
function traverse (val) {
  _traverse(val, seenObjects);
  seenObjects.clear();
}

function _traverse (val, seen) {
  var i, keys;
  var isA = Array.isArray(val);
  if ((!isA && !isObject(val)) || Object.isFrozen(val) || val instanceof VNode) {
    return
  }
  if (val.__ob__) {
    var depId = val.__ob__.dep.id;
    if (seen.has(depId)) {
      return
    }
    seen.add(depId);
  }
  if (isA) {
    i = val.length;
    while (i--) { _traverse(val[i], seen); }
  } else {
    keys = Object.keys(val);
    i = keys.length;
    while (i--) { _traverse(val[keys[i]], seen); }
  }
}

/*  */

var normalizeEvent = cached(function (name) {
  var passive = name.charAt(0) === '&';
  name = passive ? name.slice(1) : name;
  var once$$1 = name.charAt(0) === '~'; // Prefixed last, checked first
  name = once$$1 ? name.slice(1) : name;
  var capture = name.charAt(0) === '!';
  name = capture ? name.slice(1) : name;
  return {
    name: name,
    once: once$$1,
    capture: capture,
    passive: passive
  }
});

function createFnInvoker (fns) {
  function invoker () {
    var arguments$1 = arguments;

    var fns = invoker.fns;
    if (Array.isArray(fns)) {
      var cloned = fns.slice();
      for (var i = 0; i < cloned.length; i++) {
        cloned[i].apply(null, arguments$1);
      }
    } else {
      // return handler return value for single handlers
      return fns.apply(null, arguments)
    }
  }
  invoker.fns = fns;
  return invoker
}

function updateListeners (
  on,
  oldOn,
  add,
  remove$$1,
  vm
) {
  var name, def, cur, old, event;
  for (name in on) {
    def = cur = on[name];
    old = oldOn[name];
    event = normalizeEvent(name);
    /* istanbul ignore if */
    if (isUndef(cur)) ; else if (isUndef(old)) {
      if (isUndef(cur.fns)) {
        cur = on[name] = createFnInvoker(cur);
      }
      add(event.name, cur, event.once, event.capture, event.passive, event.params);
    } else if (cur !== old) {
      old.fns = cur;
      on[name] = old;
    }
  }
  for (name in oldOn) {
    if (isUndef(on[name])) {
      event = normalizeEvent(name);
      remove$$1(event.name, oldOn[name], event.capture);
    }
  }
}

/*  */

function mergeVNodeHook (def, hookKey, hook) {
  if (def instanceof VNode) {
    def = def.data.hook || (def.data.hook = {});
  }
  var invoker;
  var oldHook = def[hookKey];

  function wrappedHook () {
    hook.apply(this, arguments);
    // important: remove merged hook to ensure it's called only once
    // and prevent memory leak
    remove(invoker.fns, wrappedHook);
  }

  if (isUndef(oldHook)) {
    // no existing hook
    invoker = createFnInvoker([wrappedHook]);
  } else {
    /* istanbul ignore if */
    if (isDef(oldHook.fns) && isTrue(oldHook.merged)) {
      // already a merged invoker
      invoker = oldHook;
      invoker.fns.push(wrappedHook);
    } else {
      // existing plain hook
      invoker = createFnInvoker([oldHook, wrappedHook]);
    }
  }

  invoker.merged = true;
  def[hookKey] = invoker;
}

/*  */

function extractPropsFromVNodeData (
  data,
  Ctor,
  tag
) {
  // we are only extracting raw values here.
  // validation and default values are handled in the child
  // component itself.
  var propOptions = Ctor.options.props;
  if (isUndef(propOptions)) {
    return
  }
  var res = {};
  var attrs = data.attrs;
  var props = data.props;
  if (isDef(attrs) || isDef(props)) {
    for (var key in propOptions) {
      var altKey = hyphenate(key);
      checkProp(res, props, key, altKey, true) ||
      checkProp(res, attrs, key, altKey, false);
    }
  }
  return res
}

function checkProp (
  res,
  hash,
  key,
  altKey,
  preserve
) {
  if (isDef(hash)) {
    if (hasOwn(hash, key)) {
      res[key] = hash[key];
      if (!preserve) {
        delete hash[key];
      }
      return true
    } else if (hasOwn(hash, altKey)) {
      res[key] = hash[altKey];
      if (!preserve) {
        delete hash[altKey];
      }
      return true
    }
  }
  return false
}

/*  */

// The template compiler attempts to minimize the need for normalization by
// statically analyzing the template at compile time.
//
// For plain HTML markup, normalization can be completely skipped because the
// generated render function is guaranteed to return Array<VNode>. There are
// two cases where extra normalization is needed:

// 1. When the children contains components - because a functional component
// may return an Array instead of a single root. In this case, just a simple
// normalization is needed - if any child is an Array, we flatten the whole
// thing with Array.prototype.concat. It is guaranteed to be only 1-level deep
// because functional components already normalize their own children.
function simpleNormalizeChildren (children) {
  for (var i = 0; i < children.length; i++) {
    if (Array.isArray(children[i])) {
      return Array.prototype.concat.apply([], children)
    }
  }
  return children
}

// 2. When the children contains constructs that always generated nested Arrays,
// e.g. <template>, <slot>, v-for, or when the children is provided by user
// with hand-written render functions / JSX. In such cases a full normalization
// is needed to cater to all possible types of children values.
function normalizeChildren (children) {
  return isPrimitive(children)
    ? [createTextVNode(children)]
    : Array.isArray(children)
      ? normalizeArrayChildren(children)
      : undefined
}

function isTextNode (node) {
  return isDef(node) && isDef(node.text) && isFalse(node.isComment)
}

function normalizeArrayChildren (children, nestedIndex) {
  var res = [];
  var i, c, lastIndex, last;
  for (i = 0; i < children.length; i++) {
    c = children[i];
    if (isUndef(c) || typeof c === 'boolean') { continue }
    lastIndex = res.length - 1;
    last = res[lastIndex];
    //  nested
    if (Array.isArray(c)) {
      if (c.length > 0) {
        c = normalizeArrayChildren(c, ((nestedIndex || '') + "_" + i));
        // merge adjacent text nodes
        if (isTextNode(c[0]) && isTextNode(last)) {
          res[lastIndex] = createTextVNode(last.text + (c[0]).text);
          c.shift();
        }
        res.push.apply(res, c);
      }
    } else if (isPrimitive(c)) {
      if (isTextNode(last)) {
        // merge adjacent text nodes
        // this is necessary for SSR hydration because text nodes are
        // essentially merged when rendered to HTML strings
        res[lastIndex] = createTextVNode(last.text + c);
      } else if (c !== '') {
        // convert primitive to vnode
        res.push(createTextVNode(c));
      }
    } else {
      if (isTextNode(c) && isTextNode(last)) {
        // merge adjacent text nodes
        res[lastIndex] = createTextVNode(last.text + c.text);
      } else {
        // default key for nested array children (likely generated by v-for)
        if (isTrue(children._isVList) &&
          isDef(c.tag) &&
          isUndef(c.key) &&
          isDef(nestedIndex)) {
          c.key = "__vlist" + nestedIndex + "_" + i + "__";
        }
        res.push(c);
      }
    }
  }
  return res
}

/*  */

function ensureCtor (comp, base) {
  if (
    comp.__esModule ||
    (hasSymbol && comp[Symbol.toStringTag] === 'Module')
  ) {
    comp = comp.default;
  }
  return isObject(comp)
    ? base.extend(comp)
    : comp
}

function createAsyncPlaceholder (
  factory,
  data,
  context,
  children,
  tag
) {
  var node = createEmptyVNode();
  node.asyncFactory = factory;
  node.asyncMeta = { data: data, context: context, children: children, tag: tag };
  return node
}

function resolveAsyncComponent (
  factory,
  baseCtor,
  context
) {
  if (isTrue(factory.error) && isDef(factory.errorComp)) {
    return factory.errorComp
  }

  if (isDef(factory.resolved)) {
    return factory.resolved
  }

  if (isTrue(factory.loading) && isDef(factory.loadingComp)) {
    return factory.loadingComp
  }

  if (isDef(factory.contexts)) {
    // already pending
    factory.contexts.push(context);
  } else {
    var contexts = factory.contexts = [context];
    var sync = true;

    var forceRender = function () {
      for (var i = 0, l = contexts.length; i < l; i++) {
        contexts[i].$forceUpdate();
      }
    };

    var resolve = once(function (res) {
      // cache resolved
      factory.resolved = ensureCtor(res, baseCtor);
      // invoke callbacks only if this is not a synchronous resolve
      // (async resolves are shimmed as synchronous during SSR)
      if (!sync) {
        forceRender();
      }
    });

    var reject = once(function (reason) {
      if (isDef(factory.errorComp)) {
        factory.error = true;
        forceRender();
      }
    });

    var res = factory(resolve, reject);

    if (isObject(res)) {
      if (typeof res.then === 'function') {
        // () => Promise
        if (isUndef(factory.resolved)) {
          res.then(resolve, reject);
        }
      } else if (isDef(res.component) && typeof res.component.then === 'function') {
        res.component.then(resolve, reject);

        if (isDef(res.error)) {
          factory.errorComp = ensureCtor(res.error, baseCtor);
        }

        if (isDef(res.loading)) {
          factory.loadingComp = ensureCtor(res.loading, baseCtor);
          if (res.delay === 0) {
            factory.loading = true;
          } else {
            setTimeout(function () {
              if (isUndef(factory.resolved) && isUndef(factory.error)) {
                factory.loading = true;
                forceRender();
              }
            }, res.delay || 200);
          }
        }

        if (isDef(res.timeout)) {
          setTimeout(function () {
            if (isUndef(factory.resolved)) {
              reject(
                null
              );
            }
          }, res.timeout);
        }
      }
    }

    sync = false;
    // return in case resolved synchronously
    return factory.loading
      ? factory.loadingComp
      : factory.resolved
  }
}

/*  */

function isAsyncPlaceholder (node) {
  return node.isComment && node.asyncFactory
}

/*  */

function getFirstComponentChild (children) {
  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if (isDef(c) && (isDef(c.componentOptions) || isAsyncPlaceholder(c))) {
        return c
      }
    }
  }
}

/*  */

/*  */

function initEvents (vm) {
  vm._events = Object.create(null);
  vm._hasHookEvent = false;
  // init parent attached events
  var listeners = vm.$options._parentListeners;
  if (listeners) {
    updateComponentListeners(vm, listeners);
  }
}

var target;

function add (event, fn, once) {
  if (once) {
    target.$once(event, fn);
  } else {
    target.$on(event, fn);
  }
}

function remove$1 (event, fn) {
  target.$off(event, fn);
}

function updateComponentListeners (
  vm,
  listeners,
  oldListeners
) {
  target = vm;
  updateListeners(listeners, oldListeners || {}, add, remove$1, vm);
  target = undefined;
}

function eventsMixin (Vue) {
  var hookRE = /^hook:/;
  Vue.prototype.$on = function (event, fn) {
    var this$1 = this;

    var vm = this;
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$on(event[i], fn);
      }
    } else {
      (vm._events[event] || (vm._events[event] = [])).push(fn);
      // optimize hook:event cost by using a boolean flag marked at registration
      // instead of a hash lookup
      if (hookRE.test(event)) {
        vm._hasHookEvent = true;
      }
    }
    return vm
  };

  Vue.prototype.$once = function (event, fn) {
    var vm = this;
    function on () {
      vm.$off(event, on);
      fn.apply(vm, arguments);
    }
    on.fn = fn;
    vm.$on(event, on);
    return vm
  };

  Vue.prototype.$off = function (event, fn) {
    var this$1 = this;

    var vm = this;
    // all
    if (!arguments.length) {
      vm._events = Object.create(null);
      return vm
    }
    // array of events
    if (Array.isArray(event)) {
      for (var i = 0, l = event.length; i < l; i++) {
        this$1.$off(event[i], fn);
      }
      return vm
    }
    // specific event
    var cbs = vm._events[event];
    if (!cbs) {
      return vm
    }
    if (!fn) {
      vm._events[event] = null;
      return vm
    }
    if (fn) {
      // specific handler
      var cb;
      var i$1 = cbs.length;
      while (i$1--) {
        cb = cbs[i$1];
        if (cb === fn || cb.fn === fn) {
          cbs.splice(i$1, 1);
          break
        }
      }
    }
    return vm
  };

  Vue.prototype.$emit = function (event) {
    var vm = this;
    var cbs = vm._events[event];
    if (cbs) {
      cbs = cbs.length > 1 ? toArray(cbs) : cbs;
      var args = toArray(arguments, 1);
      for (var i = 0, l = cbs.length; i < l; i++) {
        try {
          cbs[i].apply(vm, args);
        } catch (e) {
          handleError(e, vm, ("event handler for \"" + event + "\""));
        }
      }
    }
    return vm
  };
}

/*  */



/**
 * Runtime helper for resolving raw children VNodes into a slot object.
 */
function resolveSlots (
  children,
  context
) {
  var slots = {};
  if (!children) {
    return slots
  }
  for (var i = 0, l = children.length; i < l; i++) {
    var child = children[i];
    var data = child.data;
    // remove slot attribute if the node is resolved as a Vue slot node
    if (data && data.attrs && data.attrs.slot) {
      delete data.attrs.slot;
    }
    // named slots should only be respected if the vnode was rendered in the
    // same context.
    if ((child.context === context || child.fnContext === context) &&
      data && data.slot != null
    ) {
      var name = data.slot;
      var slot = (slots[name] || (slots[name] = []));
      if (child.tag === 'template') {
        slot.push.apply(slot, child.children || []);
      } else {
        slot.push(child);
      }
    } else {
      (slots.default || (slots.default = [])).push(child);
    }
  }
  // ignore slots that contains only whitespace
  for (var name$1 in slots) {
    if (slots[name$1].every(isWhitespace)) {
      delete slots[name$1];
    }
  }
  return slots
}

function isWhitespace (node) {
  return (node.isComment && !node.asyncFactory) || node.text === ' '
}

function resolveScopedSlots (
  fns, // see flow/vnode
  res
) {
  res = res || {};
  for (var i = 0; i < fns.length; i++) {
    if (Array.isArray(fns[i])) {
      resolveScopedSlots(fns[i], res);
    } else {
      res[fns[i].key] = fns[i].fn;
    }
  }
  return res
}

/*  */

var activeInstance = null;

function initLifecycle (vm) {
  var options = vm.$options;

  // locate first non-abstract parent
  var parent = options.parent;
  if (parent && !options.abstract) {
    while (parent.$options.abstract && parent.$parent) {
      parent = parent.$parent;
    }
    parent.$children.push(vm);
  }

  vm.$parent = parent;
  vm.$root = parent ? parent.$root : vm;

  vm.$children = [];
  vm.$refs = {};

  vm._watcher = null;
  vm._inactive = null;
  vm._directInactive = false;
  vm._isMounted = false;
  vm._isDestroyed = false;
  vm._isBeingDestroyed = false;
}

function lifecycleMixin (Vue) {
  Vue.prototype._update = function (vnode, hydrating) {
    var vm = this;
    if (vm._isMounted) {
      callHook(vm, 'beforeUpdate');
    }
    var prevEl = vm.$el;
    var prevVnode = vm._vnode;
    var prevActiveInstance = activeInstance;
    activeInstance = vm;
    vm._vnode = vnode;
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render
      vm.$el = vm.__patch__(
        vm.$el, vnode, hydrating, false /* removeOnly */,
        vm.$options._parentElm,
        vm.$options._refElm
      );
      // no need for the ref nodes after initial patch
      // this prevents keeping a detached DOM tree in memory (#5851)
      vm.$options._parentElm = vm.$options._refElm = null;
    } else {
      // updates
      vm.$el = vm.__patch__(prevVnode, vnode);
    }
    activeInstance = prevActiveInstance;
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null;
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm;
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el;
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  };

  Vue.prototype.$forceUpdate = function () {
    var vm = this;
    if (vm._watcher) {
      vm._watcher.update();
    }
  };

  Vue.prototype.$destroy = function () {
    var vm = this;
    if (vm._isBeingDestroyed) {
      return
    }
    callHook(vm, 'beforeDestroy');
    vm._isBeingDestroyed = true;
    // remove self from parent
    var parent = vm.$parent;
    if (parent && !parent._isBeingDestroyed && !vm.$options.abstract) {
      remove(parent.$children, vm);
    }
    // teardown watchers
    if (vm._watcher) {
      vm._watcher.teardown();
    }
    var i = vm._watchers.length;
    while (i--) {
      vm._watchers[i].teardown();
    }
    // remove reference from data ob
    // frozen object may not have observer.
    if (vm._data.__ob__) {
      vm._data.__ob__.vmCount--;
    }
    // call the last hook...
    vm._isDestroyed = true;
    // invoke destroy hooks on current rendered tree
    vm.__patch__(vm._vnode, null);
    // fire destroyed hook
    callHook(vm, 'destroyed');
    // turn off all instance listeners.
    vm.$off();
    // remove __vue__ reference
    if (vm.$el) {
      vm.$el.__vue__ = null;
    }
    // release circular reference (#6759)
    if (vm.$vnode) {
      vm.$vnode.parent = null;
    }
  };
}

function mountComponent (
  vm,
  el,
  hydrating
) {
  vm.$el = el;
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode;
  }
  callHook(vm, 'beforeMount');

  var updateComponent;
  /* istanbul ignore if */
  {
    updateComponent = function () {
      vm._update(vm._render(), hydrating);
    };
  }

  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, null, true /* isRenderWatcher */);
  hydrating = false;

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true;
    callHook(vm, 'mounted');
  }
  return vm
}

function updateChildComponent (
  vm,
  propsData,
  listeners,
  parentVnode,
  renderChildren
) {

  // determine whether component has slot children
  // we need to do this before overwriting $options._renderChildren
  var hasChildren = !!(
    renderChildren ||               // has new static slots
    vm.$options._renderChildren ||  // has old static slots
    parentVnode.data.scopedSlots || // has new scoped slots
    vm.$scopedSlots !== emptyObject // has old scoped slots
  );

  vm.$options._parentVnode = parentVnode;
  vm.$vnode = parentVnode; // update vm's placeholder node without re-render

  if (vm._vnode) { // update child tree's parent
    vm._vnode.parent = parentVnode;
  }
  vm.$options._renderChildren = renderChildren;

  // update $attrs and $listeners hash
  // these are also reactive so they may trigger child update if the child
  // used them during render
  vm.$attrs = parentVnode.data.attrs || emptyObject;
  vm.$listeners = listeners || emptyObject;

  // update props
  if (propsData && vm.$options.props) {
    toggleObserving(false);
    var props = vm._props;
    var propKeys = vm.$options._propKeys || [];
    for (var i = 0; i < propKeys.length; i++) {
      var key = propKeys[i];
      var propOptions = vm.$options.props; // wtf flow?
      props[key] = validateProp(key, propOptions, propsData, vm);
    }
    toggleObserving(true);
    // keep a copy of raw propsData
    vm.$options.propsData = propsData;
  }

  // update listeners
  listeners = listeners || emptyObject;
  var oldListeners = vm.$options._parentListeners;
  vm.$options._parentListeners = listeners;
  updateComponentListeners(vm, listeners, oldListeners);

  // resolve slots + force update if has children
  if (hasChildren) {
    vm.$slots = resolveSlots(renderChildren, parentVnode.context);
    vm.$forceUpdate();
  }
}

function isInInactiveTree (vm) {
  while (vm && (vm = vm.$parent)) {
    if (vm._inactive) { return true }
  }
  return false
}

function activateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = false;
    if (isInInactiveTree(vm)) {
      return
    }
  } else if (vm._directInactive) {
    return
  }
  if (vm._inactive || vm._inactive === null) {
    vm._inactive = false;
    for (var i = 0; i < vm.$children.length; i++) {
      activateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'activated');
  }
}

function deactivateChildComponent (vm, direct) {
  if (direct) {
    vm._directInactive = true;
    if (isInInactiveTree(vm)) {
      return
    }
  }
  if (!vm._inactive) {
    vm._inactive = true;
    for (var i = 0; i < vm.$children.length; i++) {
      deactivateChildComponent(vm.$children[i]);
    }
    callHook(vm, 'deactivated');
  }
}

function callHook (vm, hook) {
  // #7573 disable dep collection when invoking lifecycle hooks
  pushTarget();
  var handlers = vm.$options[hook];
  if (handlers) {
    for (var i = 0, j = handlers.length; i < j; i++) {
      try {
        handlers[i].call(vm);
      } catch (e) {
        handleError(e, vm, (hook + " hook"));
      }
    }
  }
  if (vm._hasHookEvent) {
    vm.$emit('hook:' + hook);
  }
  popTarget();
}

var queue = [];
var activatedChildren = [];
var has = {};
var waiting = false;
var flushing = false;
var index = 0;

/**
 * Reset the scheduler's state.
 */
function resetSchedulerState () {
  index = queue.length = activatedChildren.length = 0;
  has = {};
  waiting = flushing = false;
}

/**
 * Flush both queues and run the watchers.
 */
function flushSchedulerQueue () {
  flushing = true;
  var watcher, id;

  // Sort queue before flush.
  // This ensures that:
  // 1. Components are updated from parent to child. (because parent is always
  //    created before the child)
  // 2. A component's user watchers are run before its render watcher (because
  //    user watchers are created before the render watcher)
  // 3. If a component is destroyed during a parent component's watcher run,
  //    its watchers can be skipped.
  queue.sort(function (a, b) { return a.id - b.id; });

  // do not cache length because more watchers might be pushed
  // as we run existing watchers
  for (index = 0; index < queue.length; index++) {
    watcher = queue[index];
    id = watcher.id;
    has[id] = null;
    watcher.run();
  }

  // keep copies of post queues before resetting state
  var activatedQueue = activatedChildren.slice();
  var updatedQueue = queue.slice();

  resetSchedulerState();

  // call component updated and activated hooks
  callActivatedHooks(activatedQueue);
  callUpdatedHooks(updatedQueue);

  // devtool hook
  /* istanbul ignore if */
  if (devtools && config.devtools) {
    devtools.emit('flush');
  }
}

function callUpdatedHooks (queue) {
  var i = queue.length;
  while (i--) {
    var watcher = queue[i];
    var vm = watcher.vm;
    if (vm._watcher === watcher && vm._isMounted) {
      callHook(vm, 'updated');
    }
  }
}

/**
 * Queue a kept-alive component that was activated during patch.
 * The queue will be processed after the entire tree has been patched.
 */
function queueActivatedComponent (vm) {
  // setting _inactive to false here so that a render function can
  // rely on checking whether it's in an inactive tree (e.g. router-view)
  vm._inactive = false;
  activatedChildren.push(vm);
}

function callActivatedHooks (queue) {
  for (var i = 0; i < queue.length; i++) {
    queue[i]._inactive = true;
    activateChildComponent(queue[i], true /* true */);
  }
}

/**
 * Push a watcher into the watcher queue.
 * Jobs with duplicate IDs will be skipped unless it's
 * pushed when the queue is being flushed.
 */
function queueWatcher (watcher) {
  var id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    if (!flushing) {
      queue.push(watcher);
    } else {
      // if already flushing, splice the watcher based on its id
      // if already past its id, it will be run next immediately.
      var i = queue.length - 1;
      while (i > index && queue[i].id > watcher.id) {
        i--;
      }
      queue.splice(i + 1, 0, watcher);
    }
    // queue the flush
    if (!waiting) {
      waiting = true;
      nextTick(flushSchedulerQueue);
    }
  }
}

/*  */

var uid$1 = 0;

/**
 * A watcher parses an expression, collects dependencies,
 * and fires callback when the expression value changes.
 * This is used for both the $watch() api and directives.
 */
var Watcher = function Watcher (
  vm,
  expOrFn,
  cb,
  options,
  isRenderWatcher
) {
  this.vm = vm;
  if (isRenderWatcher) {
    vm._watcher = this;
  }
  vm._watchers.push(this);
  // options
  if (options) {
    this.deep = !!options.deep;
    this.user = !!options.user;
    this.lazy = !!options.lazy;
    this.sync = !!options.sync;
  } else {
    this.deep = this.user = this.lazy = this.sync = false;
  }
  this.cb = cb;
  this.id = ++uid$1; // uid for batching
  this.active = true;
  this.dirty = this.lazy; // for lazy watchers
  this.deps = [];
  this.newDeps = [];
  this.depIds = new _Set();
  this.newDepIds = new _Set();
  this.expression = '';
  // parse expression for getter
  if (typeof expOrFn === 'function') {
    this.getter = expOrFn;
  } else {
    this.getter = parsePath(expOrFn);
    if (!this.getter) {
      this.getter = function () {};
    }
  }
  this.value = this.lazy
    ? undefined
    : this.get();
};

/**
 * Evaluate the getter, and re-collect dependencies.
 */
Watcher.prototype.get = function get () {
  pushTarget(this);
  var value;
  var vm = this.vm;
  try {
    value = this.getter.call(vm, vm);
  } catch (e) {
    if (this.user) {
      handleError(e, vm, ("getter for watcher \"" + (this.expression) + "\""));
    } else {
      throw e
    }
  } finally {
    // "touch" every property so they are all tracked as
    // dependencies for deep watching
    if (this.deep) {
      traverse(value);
    }
    popTarget();
    this.cleanupDeps();
  }
  return value
};

/**
 * Add a dependency to this directive.
 */
Watcher.prototype.addDep = function addDep (dep) {
  var id = dep.id;
  if (!this.newDepIds.has(id)) {
    this.newDepIds.add(id);
    this.newDeps.push(dep);
    if (!this.depIds.has(id)) {
      dep.addSub(this);
    }
  }
};

/**
 * Clean up for dependency collection.
 */
Watcher.prototype.cleanupDeps = function cleanupDeps () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    var dep = this$1.deps[i];
    if (!this$1.newDepIds.has(dep.id)) {
      dep.removeSub(this$1);
    }
  }
  var tmp = this.depIds;
  this.depIds = this.newDepIds;
  this.newDepIds = tmp;
  this.newDepIds.clear();
  tmp = this.deps;
  this.deps = this.newDeps;
  this.newDeps = tmp;
  this.newDeps.length = 0;
};

/**
 * Subscriber interface.
 * Will be called when a dependency changes.
 */
Watcher.prototype.update = function update () {
  /* istanbul ignore else */
  if (this.lazy) {
    this.dirty = true;
  } else if (this.sync) {
    this.run();
  } else {
    queueWatcher(this);
  }
};

/**
 * Scheduler job interface.
 * Will be called by the scheduler.
 */
Watcher.prototype.run = function run () {
  if (this.active) {
    var value = this.get();
    if (
      value !== this.value ||
      // Deep watchers and watchers on Object/Arrays should fire even
      // when the value is the same, because the value may
      // have mutated.
      isObject(value) ||
      this.deep
    ) {
      // set new value
      var oldValue = this.value;
      this.value = value;
      if (this.user) {
        try {
          this.cb.call(this.vm, value, oldValue);
        } catch (e) {
          handleError(e, this.vm, ("callback for watcher \"" + (this.expression) + "\""));
        }
      } else {
        this.cb.call(this.vm, value, oldValue);
      }
    }
  }
};

/**
 * Evaluate the value of the watcher.
 * This only gets called for lazy watchers.
 */
Watcher.prototype.evaluate = function evaluate () {
  this.value = this.get();
  this.dirty = false;
};

/**
 * Depend on all deps collected by this watcher.
 */
Watcher.prototype.depend = function depend () {
    var this$1 = this;

  var i = this.deps.length;
  while (i--) {
    this$1.deps[i].depend();
  }
};

/**
 * Remove self from all dependencies' subscriber list.
 */
Watcher.prototype.teardown = function teardown () {
    var this$1 = this;

  if (this.active) {
    // remove self from vm's watcher list
    // this is a somewhat expensive operation so we skip it
    // if the vm is being destroyed.
    if (!this.vm._isBeingDestroyed) {
      remove(this.vm._watchers, this);
    }
    var i = this.deps.length;
    while (i--) {
      this$1.deps[i].removeSub(this$1);
    }
    this.active = false;
  }
};

/*  */

var sharedPropertyDefinition = {
  enumerable: true,
  configurable: true,
  get: noop,
  set: noop
};

function proxy (target, sourceKey, key) {
  sharedPropertyDefinition.get = function proxyGetter () {
    return this[sourceKey][key]
  };
  sharedPropertyDefinition.set = function proxySetter (val) {
    this[sourceKey][key] = val;
  };
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function initState (vm) {
  vm._watchers = [];
  var opts = vm.$options;
  if (opts.props) { initProps(vm, opts.props); }
  if (opts.methods) { initMethods(vm, opts.methods); }
  if (opts.data) {
    initData(vm);
  } else {
    observe(vm._data = {}, true /* asRootData */);
  }
  if (opts.computed) { initComputed(vm, opts.computed); }
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch);
  }
}

function initProps (vm, propsOptions) {
  var propsData = vm.$options.propsData || {};
  var props = vm._props = {};
  // cache prop keys so that future props updates can iterate using Array
  // instead of dynamic object key enumeration.
  var keys = vm.$options._propKeys = [];
  var isRoot = !vm.$parent;
  // root instance props should be converted
  if (!isRoot) {
    toggleObserving(false);
  }
  var loop = function ( key ) {
    keys.push(key);
    var value = validateProp(key, propsOptions, propsData, vm);
    /* istanbul ignore else */
    {
      defineReactive(props, key, value);
    }
    // static props are already proxied on the component's prototype
    // during Vue.extend(). We only need to proxy props defined at
    // instantiation here.
    if (!(key in vm)) {
      proxy(vm, "_props", key);
    }
  };

  for (var key in propsOptions) loop( key );
  toggleObserving(true);
}

function initData (vm) {
  var data = vm.$options.data;
  data = vm._data = typeof data === 'function'
    ? getData(data, vm)
    : data || {};
  if (!isPlainObject(data)) {
    data = {};
  }
  // proxy data on instance
  var keys = Object.keys(data);
  var props = vm.$options.props;
  var methods = vm.$options.methods;
  var i = keys.length;
  while (i--) {
    var key = keys[i];
    if (props && hasOwn(props, key)) ; else if (!isReserved(key)) {
      proxy(vm, "_data", key);
    }
  }
  // observe data
  observe(data, true /* asRootData */);
}

function getData (data, vm) {
  // #7573 disable dep collection when invoking data getters
  pushTarget();
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, "data()");
    return {}
  } finally {
    popTarget();
  }
}

var computedWatcherOptions = { lazy: true };

function initComputed (vm, computed) {
  // $flow-disable-line
  var watchers = vm._computedWatchers = Object.create(null);
  // computed properties are just getters during SSR
  var isSSR = isServerRendering();

  for (var key in computed) {
    var userDef = computed[key];
    var getter = typeof userDef === 'function' ? userDef : userDef.get;

    if (!isSSR) {
      // create internal watcher for the computed property.
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions
      );
    }

    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef);
    }
  }
}

function defineComputed (
  target,
  key,
  userDef
) {
  var shouldCache = !isServerRendering();
  if (typeof userDef === 'function') {
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      : userDef;
    sharedPropertyDefinition.set = noop;
  } else {
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : userDef.get
      : noop;
    sharedPropertyDefinition.set = userDef.set
      ? userDef.set
      : noop;
  }
  Object.defineProperty(target, key, sharedPropertyDefinition);
}

function createComputedGetter (key) {
  return function computedGetter () {
    var watcher = this._computedWatchers && this._computedWatchers[key];
    if (watcher) {
      if (watcher.dirty) {
        watcher.evaluate();
      }
      if (Dep.target) {
        watcher.depend();
      }
      return watcher.value
    }
  }
}

function initMethods (vm, methods) {
  var props = vm.$options.props;
  for (var key in methods) {
    vm[key] = methods[key] == null ? noop : bind(methods[key], vm);
  }
}

function initWatch (vm, watch) {
  for (var key in watch) {
    var handler = watch[key];
    if (Array.isArray(handler)) {
      for (var i = 0; i < handler.length; i++) {
        createWatcher(vm, key, handler[i]);
      }
    } else {
      createWatcher(vm, key, handler);
    }
  }
}

function createWatcher (
  vm,
  expOrFn,
  handler,
  options
) {
  if (isPlainObject(handler)) {
    options = handler;
    handler = handler.handler;
  }
  if (typeof handler === 'string') {
    handler = vm[handler];
  }
  return vm.$watch(expOrFn, handler, options)
}

function stateMixin (Vue) {
  // flow somehow has problems with directly declared definition object
  // when using Object.defineProperty, so we have to procedurally build up
  // the object here.
  var dataDef = {};
  dataDef.get = function () { return this._data };
  var propsDef = {};
  propsDef.get = function () { return this._props };
  Object.defineProperty(Vue.prototype, '$data', dataDef);
  Object.defineProperty(Vue.prototype, '$props', propsDef);

  Vue.prototype.$set = set;
  Vue.prototype.$delete = del;

  Vue.prototype.$watch = function (
    expOrFn,
    cb,
    options
  ) {
    var vm = this;
    if (isPlainObject(cb)) {
      return createWatcher(vm, expOrFn, cb, options)
    }
    options = options || {};
    options.user = true;
    var watcher = new Watcher(vm, expOrFn, cb, options);
    if (options.immediate) {
      cb.call(vm, watcher.value);
    }
    return function unwatchFn () {
      watcher.teardown();
    }
  };
}

/*  */

function initProvide (vm) {
  var provide = vm.$options.provide;
  if (provide) {
    vm._provided = typeof provide === 'function'
      ? provide.call(vm)
      : provide;
  }
}

function initInjections (vm) {
  var result = resolveInject(vm.$options.inject, vm);
  if (result) {
    toggleObserving(false);
    Object.keys(result).forEach(function (key) {
      /* istanbul ignore else */
      {
        defineReactive(vm, key, result[key]);
      }
    });
    toggleObserving(true);
  }
}

function resolveInject (inject, vm) {
  if (inject) {
    // inject is :any because flow is not smart enough to figure out cached
    var result = Object.create(null);
    var keys = hasSymbol
      ? Reflect.ownKeys(inject).filter(function (key) {
        /* istanbul ignore next */
        return Object.getOwnPropertyDescriptor(inject, key).enumerable
      })
      : Object.keys(inject);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      var provideKey = inject[key].from;
      var source = vm;
      while (source) {
        if (source._provided && hasOwn(source._provided, provideKey)) {
          result[key] = source._provided[provideKey];
          break
        }
        source = source.$parent;
      }
      if (!source) {
        if ('default' in inject[key]) {
          var provideDefault = inject[key].default;
          result[key] = typeof provideDefault === 'function'
            ? provideDefault.call(vm)
            : provideDefault;
        }
      }
    }
    return result
  }
}

/*  */

/**
 * Runtime helper for rendering v-for lists.
 */
function renderList (
  val,
  render
) {
  var ret, i, l, keys, key;
  if (Array.isArray(val) || typeof val === 'string') {
    ret = new Array(val.length);
    for (i = 0, l = val.length; i < l; i++) {
      ret[i] = render(val[i], i);
    }
  } else if (typeof val === 'number') {
    ret = new Array(val);
    for (i = 0; i < val; i++) {
      ret[i] = render(i + 1, i);
    }
  } else if (isObject(val)) {
    keys = Object.keys(val);
    ret = new Array(keys.length);
    for (i = 0, l = keys.length; i < l; i++) {
      key = keys[i];
      ret[i] = render(val[key], key, i);
    }
  }
  if (isDef(ret)) {
    (ret)._isVList = true;
  }
  return ret
}

/*  */

/**
 * Runtime helper for rendering <slot>
 */
function renderSlot (
  name,
  fallback,
  props,
  bindObject
) {
  var scopedSlotFn = this.$scopedSlots[name];
  var nodes;
  if (scopedSlotFn) { // scoped slot
    props = props || {};
    if (bindObject) {
      props = extend(extend({}, bindObject), props);
    }
    nodes = scopedSlotFn(props) || fallback;
  } else {
    var slotNodes = this.$slots[name];
    // warn duplicate slot usage
    if (slotNodes) {
      slotNodes._rendered = true;
    }
    nodes = slotNodes || fallback;
  }

  var target = props && props.slot;
  if (target) {
    return this.$createElement('template', { slot: target }, nodes)
  } else {
    return nodes
  }
}

/*  */

/**
 * Runtime helper for resolving filters
 */
function resolveFilter (id) {
  return resolveAsset(this.$options, 'filters', id, true) || identity
}

/*  */

function isKeyNotMatch (expect, actual) {
  if (Array.isArray(expect)) {
    return expect.indexOf(actual) === -1
  } else {
    return expect !== actual
  }
}

/**
 * Runtime helper for checking keyCodes from config.
 * exposed as Vue.prototype._k
 * passing in eventKeyName as last argument separately for backwards compat
 */
function checkKeyCodes (
  eventKeyCode,
  key,
  builtInKeyCode,
  eventKeyName,
  builtInKeyName
) {
  var mappedKeyCode = config.keyCodes[key] || builtInKeyCode;
  if (builtInKeyName && eventKeyName && !config.keyCodes[key]) {
    return isKeyNotMatch(builtInKeyName, eventKeyName)
  } else if (mappedKeyCode) {
    return isKeyNotMatch(mappedKeyCode, eventKeyCode)
  } else if (eventKeyName) {
    return hyphenate(eventKeyName) !== key
  }
}

/*  */

/**
 * Runtime helper for merging v-bind="object" into a VNode's data.
 */
function bindObjectProps (
  data,
  tag,
  value,
  asProp,
  isSync
) {
  if (value) {
    if (!isObject(value)) ; else {
      if (Array.isArray(value)) {
        value = toObject(value);
      }
      var hash;
      var loop = function ( key ) {
        if (
          key === 'class' ||
          key === 'style' ||
          isReservedAttribute(key)
        ) {
          hash = data;
        } else {
          var type = data.attrs && data.attrs.type;
          hash = asProp || config.mustUseProp(tag, type, key)
            ? data.domProps || (data.domProps = {})
            : data.attrs || (data.attrs = {});
        }
        if (!(key in hash)) {
          hash[key] = value[key];

          if (isSync) {
            var on = data.on || (data.on = {});
            on[("update:" + key)] = function ($event) {
              value[key] = $event;
            };
          }
        }
      };

      for (var key in value) loop( key );
    }
  }
  return data
}

/*  */

/**
 * Runtime helper for rendering static trees.
 */
function renderStatic (
  index,
  isInFor
) {
  var cached = this._staticTrees || (this._staticTrees = []);
  var tree = cached[index];
  // if has already-rendered static tree and not inside v-for,
  // we can reuse the same tree.
  if (tree && !isInFor) {
    return tree
  }
  // otherwise, render a fresh tree.
  tree = cached[index] = this.$options.staticRenderFns[index].call(
    this._renderProxy,
    null,
    this // for render fns generated for functional component templates
  );
  markStatic(tree, ("__static__" + index), false);
  return tree
}

/**
 * Runtime helper for v-once.
 * Effectively it means marking the node as static with a unique key.
 */
function markOnce (
  tree,
  index,
  key
) {
  markStatic(tree, ("__once__" + index + (key ? ("_" + key) : "")), true);
  return tree
}

function markStatic (
  tree,
  key,
  isOnce
) {
  if (Array.isArray(tree)) {
    for (var i = 0; i < tree.length; i++) {
      if (tree[i] && typeof tree[i] !== 'string') {
        markStaticNode(tree[i], (key + "_" + i), isOnce);
      }
    }
  } else {
    markStaticNode(tree, key, isOnce);
  }
}

function markStaticNode (node, key, isOnce) {
  node.isStatic = true;
  node.key = key;
  node.isOnce = isOnce;
}

/*  */

function bindObjectListeners (data, value) {
  if (value) {
    if (!isPlainObject(value)) ; else {
      var on = data.on = data.on ? extend({}, data.on) : {};
      for (var key in value) {
        var existing = on[key];
        var ours = value[key];
        on[key] = existing ? [].concat(existing, ours) : ours;
      }
    }
  }
  return data
}

/*  */

function installRenderHelpers (target) {
  target._o = markOnce;
  target._n = toNumber;
  target._s = toString;
  target._l = renderList;
  target._t = renderSlot;
  target._q = looseEqual;
  target._i = looseIndexOf;
  target._m = renderStatic;
  target._f = resolveFilter;
  target._k = checkKeyCodes;
  target._b = bindObjectProps;
  target._v = createTextVNode;
  target._e = createEmptyVNode;
  target._u = resolveScopedSlots;
  target._g = bindObjectListeners;
}

/*  */

function FunctionalRenderContext (
  data,
  props,
  children,
  parent,
  Ctor
) {
  var options = Ctor.options;
  // ensure the createElement function in functional components
  // gets a unique context - this is necessary for correct named slot check
  var contextVm;
  if (hasOwn(parent, '_uid')) {
    contextVm = Object.create(parent);
    // $flow-disable-line
    contextVm._original = parent;
  } else {
    // the context vm passed in is a functional context as well.
    // in this case we want to make sure we are able to get a hold to the
    // real context instance.
    contextVm = parent;
    // $flow-disable-line
    parent = parent._original;
  }
  var isCompiled = isTrue(options._compiled);
  var needNormalization = !isCompiled;

  this.data = data;
  this.props = props;
  this.children = children;
  this.parent = parent;
  this.listeners = data.on || emptyObject;
  this.injections = resolveInject(options.inject, parent);
  this.slots = function () { return resolveSlots(children, parent); };

  // support for compiled functional template
  if (isCompiled) {
    // exposing $options for renderStatic()
    this.$options = options;
    // pre-resolve slots for renderSlot()
    this.$slots = this.slots();
    this.$scopedSlots = data.scopedSlots || emptyObject;
  }

  if (options._scopeId) {
    this._c = function (a, b, c, d) {
      var vnode = createElement(contextVm, a, b, c, d, needNormalization);
      if (vnode && !Array.isArray(vnode)) {
        vnode.fnScopeId = options._scopeId;
        vnode.fnContext = parent;
      }
      return vnode
    };
  } else {
    this._c = function (a, b, c, d) { return createElement(contextVm, a, b, c, d, needNormalization); };
  }
}

installRenderHelpers(FunctionalRenderContext.prototype);

function createFunctionalComponent (
  Ctor,
  propsData,
  data,
  contextVm,
  children
) {
  var options = Ctor.options;
  var props = {};
  var propOptions = options.props;
  if (isDef(propOptions)) {
    for (var key in propOptions) {
      props[key] = validateProp(key, propOptions, propsData || emptyObject);
    }
  } else {
    if (isDef(data.attrs)) { mergeProps(props, data.attrs); }
    if (isDef(data.props)) { mergeProps(props, data.props); }
  }

  var renderContext = new FunctionalRenderContext(
    data,
    props,
    children,
    contextVm,
    Ctor
  );

  var vnode = options.render.call(null, renderContext._c, renderContext);

  if (vnode instanceof VNode) {
    return cloneAndMarkFunctionalResult(vnode, data, renderContext.parent, options)
  } else if (Array.isArray(vnode)) {
    var vnodes = normalizeChildren(vnode) || [];
    var res = new Array(vnodes.length);
    for (var i = 0; i < vnodes.length; i++) {
      res[i] = cloneAndMarkFunctionalResult(vnodes[i], data, renderContext.parent, options);
    }
    return res
  }
}

function cloneAndMarkFunctionalResult (vnode, data, contextVm, options) {
  // #7817 clone node before setting fnContext, otherwise if the node is reused
  // (e.g. it was from a cached normal slot) the fnContext causes named slots
  // that should not be matched to match.
  var clone = cloneVNode(vnode);
  clone.fnContext = contextVm;
  clone.fnOptions = options;
  if (data.slot) {
    (clone.data || (clone.data = {})).slot = data.slot;
  }
  return clone
}

function mergeProps (to, from) {
  for (var key in from) {
    to[camelize(key)] = from[key];
  }
}

/*  */




// Register the component hook to weex native render engine.
// The hook will be triggered by native, not javascript.


// Updates the state of the component to weex native render engine.

/*  */

// https://github.com/Hanks10100/weex-native-directive/tree/master/component

// listening on native callback

/*  */

/*  */

// inline hooks to be invoked on component VNodes during patch
var componentVNodeHooks = {
  init: function init (
    vnode,
    hydrating,
    parentElm,
    refElm
  ) {
    if (
      vnode.componentInstance &&
      !vnode.componentInstance._isDestroyed &&
      vnode.data.keepAlive
    ) {
      // kept-alive components, treat as a patch
      var mountedNode = vnode; // work around flow
      componentVNodeHooks.prepatch(mountedNode, mountedNode);
    } else {
      var child = vnode.componentInstance = createComponentInstanceForVnode(
        vnode,
        activeInstance,
        parentElm,
        refElm
      );
      child.$mount(hydrating ? vnode.elm : undefined, hydrating);
    }
  },

  prepatch: function prepatch (oldVnode, vnode) {
    var options = vnode.componentOptions;
    var child = vnode.componentInstance = oldVnode.componentInstance;
    updateChildComponent(
      child,
      options.propsData, // updated props
      options.listeners, // updated listeners
      vnode, // new parent vnode
      options.children // new children
    );
  },

  insert: function insert (vnode) {
    var context = vnode.context;
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isMounted) {
      componentInstance._isMounted = true;
      callHook(componentInstance, 'mounted');
    }
    if (vnode.data.keepAlive) {
      if (context._isMounted) {
        // vue-router#1212
        // During updates, a kept-alive component's child components may
        // change, so directly walking the tree here may call activated hooks
        // on incorrect children. Instead we push them into a queue which will
        // be processed after the whole patch process ended.
        queueActivatedComponent(componentInstance);
      } else {
        activateChildComponent(componentInstance, true /* direct */);
      }
    }
  },

  destroy: function destroy (vnode) {
    var componentInstance = vnode.componentInstance;
    if (!componentInstance._isDestroyed) {
      if (!vnode.data.keepAlive) {
        componentInstance.$destroy();
      } else {
        deactivateChildComponent(componentInstance, true /* direct */);
      }
    }
  }
};

var hooksToMerge = Object.keys(componentVNodeHooks);

function createComponent (
  Ctor,
  data,
  context,
  children,
  tag
) {
  if (isUndef(Ctor)) {
    return
  }

  var baseCtor = context.$options._base;

  // plain options object: turn it into a constructor
  if (isObject(Ctor)) {
    Ctor = baseCtor.extend(Ctor);
  }

  // if at this stage it's not a constructor or an async component factory,
  // reject.
  if (typeof Ctor !== 'function') {
    return
  }

  // async component
  var asyncFactory;
  if (isUndef(Ctor.cid)) {
    asyncFactory = Ctor;
    Ctor = resolveAsyncComponent(asyncFactory, baseCtor, context);
    if (Ctor === undefined) {
      // return a placeholder node for async component, which is rendered
      // as a comment node but preserves all the raw information for the node.
      // the information will be used for async server-rendering and hydration.
      return createAsyncPlaceholder(
        asyncFactory,
        data,
        context,
        children,
        tag
      )
    }
  }

  data = data || {};

  // resolve constructor options in case global mixins are applied after
  // component constructor creation
  resolveConstructorOptions(Ctor);

  // transform component v-model data into props & events
  if (isDef(data.model)) {
    transformModel(Ctor.options, data);
  }

  // extract props
  var propsData = extractPropsFromVNodeData(data, Ctor, tag);

  // functional component
  if (isTrue(Ctor.options.functional)) {
    return createFunctionalComponent(Ctor, propsData, data, context, children)
  }

  // extract listeners, since these needs to be treated as
  // child component listeners instead of DOM listeners
  var listeners = data.on;
  // replace with listeners with .native modifier
  // so it gets processed during parent component patch.
  data.on = data.nativeOn;

  if (isTrue(Ctor.options.abstract)) {
    // abstract components do not keep anything
    // other than props & listeners & slot

    // work around flow
    var slot = data.slot;
    data = {};
    if (slot) {
      data.slot = slot;
    }
  }

  // install component management hooks onto the placeholder node
  installComponentHooks(data);

  // return a placeholder vnode
  var name = Ctor.options.name || tag;
  var vnode = new VNode(
    ("vue-component-" + (Ctor.cid) + (name ? ("-" + name) : '')),
    data, undefined, undefined, undefined, context,
    { Ctor: Ctor, propsData: propsData, listeners: listeners, tag: tag, children: children },
    asyncFactory
  );

  // Weex specific: invoke recycle-list optimized @render function for
  // extracting cell-slot template.
  // https://github.com/Hanks10100/weex-native-directive/tree/master/component
  /* istanbul ignore if */
  return vnode
}

function createComponentInstanceForVnode (
  vnode, // we know it's MountedComponentVNode but flow doesn't
  parent, // activeInstance in lifecycle state
  parentElm,
  refElm
) {
  var options = {
    _isComponent: true,
    parent: parent,
    _parentVnode: vnode,
    _parentElm: parentElm || null,
    _refElm: refElm || null
  };
  // check inline-template render functions
  var inlineTemplate = vnode.data.inlineTemplate;
  if (isDef(inlineTemplate)) {
    options.render = inlineTemplate.render;
    options.staticRenderFns = inlineTemplate.staticRenderFns;
  }
  return new vnode.componentOptions.Ctor(options)
}

function installComponentHooks (data) {
  var hooks = data.hook || (data.hook = {});
  for (var i = 0; i < hooksToMerge.length; i++) {
    var key = hooksToMerge[i];
    hooks[key] = componentVNodeHooks[key];
  }
}

// transform component v-model info (value and callback) into
// prop and event handler respectively.
function transformModel (options, data) {
  var prop = (options.model && options.model.prop) || 'value';
  var event = (options.model && options.model.event) || 'input';(data.props || (data.props = {}))[prop] = data.model.value;
  var on = data.on || (data.on = {});
  if (isDef(on[event])) {
    on[event] = [data.model.callback].concat(on[event]);
  } else {
    on[event] = data.model.callback;
  }
}

/*  */

var SIMPLE_NORMALIZE = 1;
var ALWAYS_NORMALIZE = 2;

// wrapper function for providing a more flexible interface
// without getting yelled at by flow
function createElement (
  context,
  tag,
  data,
  children,
  normalizationType,
  alwaysNormalize
) {
  if (Array.isArray(data) || isPrimitive(data)) {
    normalizationType = children;
    children = data;
    data = undefined;
  }
  if (isTrue(alwaysNormalize)) {
    normalizationType = ALWAYS_NORMALIZE;
  }
  return _createElement(context, tag, data, children, normalizationType)
}

function _createElement (
  context,
  tag,
  data,
  children,
  normalizationType
) {
  if (isDef(data) && isDef((data).__ob__)) {
    return createEmptyVNode()
  }
  // object syntax in v-bind
  if (isDef(data) && isDef(data.is)) {
    tag = data.is;
  }
  if (!tag) {
    // in case of component :is set to falsy value
    return createEmptyVNode()
  }
  // support single function children as default scoped slot
  if (Array.isArray(children) &&
    typeof children[0] === 'function'
  ) {
    data = data || {};
    data.scopedSlots = { default: children[0] };
    children.length = 0;
  }
  if (normalizationType === ALWAYS_NORMALIZE) {
    children = normalizeChildren(children);
  } else if (normalizationType === SIMPLE_NORMALIZE) {
    children = simpleNormalizeChildren(children);
  }
  var vnode, ns;
  if (typeof tag === 'string') {
    var Ctor;
    ns = (context.$vnode && context.$vnode.ns) || config.getTagNamespace(tag);
    if (config.isReservedTag(tag)) {
      // platform built-in elements
      vnode = new VNode(
        config.parsePlatformTagName(tag), data, children,
        undefined, undefined, context
      );
    } else if (isDef(Ctor = resolveAsset(context.$options, 'components', tag))) {
      // component
      vnode = createComponent(Ctor, data, context, children, tag);
    } else {
      // unknown or unlisted namespaced elements
      // check at runtime because it may get assigned a namespace when its
      // parent normalizes children
      vnode = new VNode(
        tag, data, children,
        undefined, undefined, context
      );
    }
  } else {
    // direct component options / constructor
    vnode = createComponent(tag, data, context, children);
  }
  if (Array.isArray(vnode)) {
    return vnode
  } else if (isDef(vnode)) {
    if (isDef(ns)) { applyNS(vnode, ns); }
    if (isDef(data)) { registerDeepBindings(data); }
    return vnode
  } else {
    return createEmptyVNode()
  }
}

function applyNS (vnode, ns, force) {
  vnode.ns = ns;
  if (vnode.tag === 'foreignObject') {
    // use default namespace inside foreignObject
    ns = undefined;
    force = true;
  }
  if (isDef(vnode.children)) {
    for (var i = 0, l = vnode.children.length; i < l; i++) {
      var child = vnode.children[i];
      if (isDef(child.tag) && (
        isUndef(child.ns) || (isTrue(force) && child.tag !== 'svg'))) {
        applyNS(child, ns, force);
      }
    }
  }
}

// ref #5318
// necessary to ensure parent re-render when deep bindings like :style and
// :class are used on slot nodes
function registerDeepBindings (data) {
  if (isObject(data.style)) {
    traverse(data.style);
  }
  if (isObject(data.class)) {
    traverse(data.class);
  }
}

/*  */

function initRender (vm) {
  vm._vnode = null; // the root of the child tree
  vm._staticTrees = null; // v-once cached trees
  var options = vm.$options;
  var parentVnode = vm.$vnode = options._parentVnode; // the placeholder node in parent tree
  var renderContext = parentVnode && parentVnode.context;
  vm.$slots = resolveSlots(options._renderChildren, renderContext);
  vm.$scopedSlots = emptyObject;
  // bind the createElement fn to this instance
  // so that we get proper render context inside it.
  // args order: tag, data, children, normalizationType, alwaysNormalize
  // internal version is used by render functions compiled from templates
  vm._c = function (a, b, c, d) { return createElement(vm, a, b, c, d, false); };
  // normalization is always applied for the public version, used in
  // user-written render functions.
  vm.$createElement = function (a, b, c, d) { return createElement(vm, a, b, c, d, true); };

  // $attrs & $listeners are exposed for easier HOC creation.
  // they need to be reactive so that HOCs using them are always updated
  var parentData = parentVnode && parentVnode.data;

  /* istanbul ignore else */
  {
    defineReactive(vm, '$attrs', parentData && parentData.attrs || emptyObject, null, true);
    defineReactive(vm, '$listeners', options._parentListeners || emptyObject, null, true);
  }
}

function renderMixin (Vue) {
  // install runtime convenience helpers
  installRenderHelpers(Vue.prototype);

  Vue.prototype.$nextTick = function (fn) {
    return nextTick(fn, this)
  };

  Vue.prototype._render = function () {
    var vm = this;
    var ref = vm.$options;
    var render = ref.render;
    var _parentVnode = ref._parentVnode;

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject;
    }

    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode;
    // render self
    var vnode;
    try {
      vnode = render.call(vm._renderProxy, vm.$createElement);
    } catch (e) {
      handleError(e, vm, "render");
      // return error render result,
      // or previous vnode to prevent render error causing blank component
      /* istanbul ignore else */
      {
        vnode = vm._vnode;
      }
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode();
    }
    // set parent
    vnode.parent = _parentVnode;
    return vnode
  };
}

/*  */

var uid$3 = 0;

function initMixin (Vue) {
  Vue.prototype._init = function (options) {
    var vm = this;
    // a uid
    vm._uid = uid$3++;

    // a flag to avoid this being observed
    vm._isVue = true;
    // merge options
    if (options && options._isComponent) {
      // optimize internal component instantiation
      // since dynamic options merging is pretty slow, and none of the
      // internal component options needs special treatment.
      initInternalComponent(vm, options);
    } else {
      vm.$options = mergeOptions(
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      );
    }
    /* istanbul ignore else */
    {
      vm._renderProxy = vm;
    }
    // expose real self
    vm._self = vm;
    initLifecycle(vm);
    initEvents(vm);
    initRender(vm);
    callHook(vm, 'beforeCreate');
    initInjections(vm); // resolve injections before data/props
    initState(vm);
    initProvide(vm); // resolve provide after data/props
    callHook(vm, 'created');

    if (vm.$options.el) {
      vm.$mount(vm.$options.el);
    }
  };
}

function initInternalComponent (vm, options) {
  var opts = vm.$options = Object.create(vm.constructor.options);
  // doing this because it's faster than dynamic enumeration.
  var parentVnode = options._parentVnode;
  opts.parent = options.parent;
  opts._parentVnode = parentVnode;
  opts._parentElm = options._parentElm;
  opts._refElm = options._refElm;

  var vnodeComponentOptions = parentVnode.componentOptions;
  opts.propsData = vnodeComponentOptions.propsData;
  opts._parentListeners = vnodeComponentOptions.listeners;
  opts._renderChildren = vnodeComponentOptions.children;
  opts._componentTag = vnodeComponentOptions.tag;

  if (options.render) {
    opts.render = options.render;
    opts.staticRenderFns = options.staticRenderFns;
  }
}

function resolveConstructorOptions (Ctor) {
  var options = Ctor.options;
  if (Ctor.super) {
    var superOptions = resolveConstructorOptions(Ctor.super);
    var cachedSuperOptions = Ctor.superOptions;
    if (superOptions !== cachedSuperOptions) {
      // super option changed,
      // need to resolve new options.
      Ctor.superOptions = superOptions;
      // check if there are any late-modified/attached options (#4976)
      var modifiedOptions = resolveModifiedOptions(Ctor);
      // update base extend options
      if (modifiedOptions) {
        extend(Ctor.extendOptions, modifiedOptions);
      }
      options = Ctor.options = mergeOptions(superOptions, Ctor.extendOptions);
      if (options.name) {
        options.components[options.name] = Ctor;
      }
    }
  }
  return options
}

function resolveModifiedOptions (Ctor) {
  var modified;
  var latest = Ctor.options;
  var extended = Ctor.extendOptions;
  var sealed = Ctor.sealedOptions;
  for (var key in latest) {
    if (latest[key] !== sealed[key]) {
      if (!modified) { modified = {}; }
      modified[key] = dedupe(latest[key], extended[key], sealed[key]);
    }
  }
  return modified
}

function dedupe (latest, extended, sealed) {
  // compare latest and sealed to ensure lifecycle hooks won't be duplicated
  // between merges
  if (Array.isArray(latest)) {
    var res = [];
    sealed = Array.isArray(sealed) ? sealed : [sealed];
    extended = Array.isArray(extended) ? extended : [extended];
    for (var i = 0; i < latest.length; i++) {
      // push original options and not sealed options to exclude duplicated options
      if (extended.indexOf(latest[i]) >= 0 || sealed.indexOf(latest[i]) < 0) {
        res.push(latest[i]);
      }
    }
    return res
  } else {
    return latest
  }
}

function Vue (options) {
  this._init(options);
}

initMixin(Vue);
stateMixin(Vue);
eventsMixin(Vue);
lifecycleMixin(Vue);
renderMixin(Vue);

/*  */

function initUse (Vue) {
  Vue.use = function (plugin) {
    var installedPlugins = (this._installedPlugins || (this._installedPlugins = []));
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    var args = toArray(arguments, 1);
    args.unshift(this);
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args);
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args);
    }
    installedPlugins.push(plugin);
    return this
  };
}

/*  */

function initMixin$1 (Vue) {
  Vue.mixin = function (mixin) {
    this.options = mergeOptions(this.options, mixin);
    return this
  };
}

/*  */

function initExtend (Vue) {
  /**
   * Each instance constructor, including Vue, has a unique
   * cid. This enables us to create wrapped "child
   * constructors" for prototypal inheritance and cache them.
   */
  Vue.cid = 0;
  var cid = 1;

  /**
   * Class inheritance
   */
  Vue.extend = function (extendOptions) {
    extendOptions = extendOptions || {};
    var Super = this;
    var SuperId = Super.cid;
    var cachedCtors = extendOptions._Ctor || (extendOptions._Ctor = {});
    if (cachedCtors[SuperId]) {
      return cachedCtors[SuperId]
    }

    var name = extendOptions.name || Super.options.name;

    var Sub = function VueComponent (options) {
      this._init(options);
    };
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub.cid = cid++;
    Sub.options = mergeOptions(
      Super.options,
      extendOptions
    );
    Sub['super'] = Super;

    // For props and computed properties, we define the proxy getters on
    // the Vue instances at extension time, on the extended prototype. This
    // avoids Object.defineProperty calls for each instance created.
    if (Sub.options.props) {
      initProps$1(Sub);
    }
    if (Sub.options.computed) {
      initComputed$1(Sub);
    }

    // allow further extension/mixin/plugin usage
    Sub.extend = Super.extend;
    Sub.mixin = Super.mixin;
    Sub.use = Super.use;

    // create asset registers, so extended classes
    // can have their private assets too.
    ASSET_TYPES.forEach(function (type) {
      Sub[type] = Super[type];
    });
    // enable recursive self-lookup
    if (name) {
      Sub.options.components[name] = Sub;
    }

    // keep a reference to the super options at extension time.
    // later at instantiation we can check if Super's options have
    // been updated.
    Sub.superOptions = Super.options;
    Sub.extendOptions = extendOptions;
    Sub.sealedOptions = extend({}, Sub.options);

    // cache constructor
    cachedCtors[SuperId] = Sub;
    return Sub
  };
}

function initProps$1 (Comp) {
  var props = Comp.options.props;
  for (var key in props) {
    proxy(Comp.prototype, "_props", key);
  }
}

function initComputed$1 (Comp) {
  var computed = Comp.options.computed;
  for (var key in computed) {
    defineComputed(Comp.prototype, key, computed[key]);
  }
}

/*  */

function initAssetRegisters (Vue) {
  /**
   * Create asset registration methods.
   */
  ASSET_TYPES.forEach(function (type) {
    Vue[type] = function (
      id,
      definition
    ) {
      if (!definition) {
        return this.options[type + 's'][id]
      } else {
        if (type === 'component' && isPlainObject(definition)) {
          definition.name = definition.name || id;
          definition = this.options._base.extend(definition);
        }
        if (type === 'directive' && typeof definition === 'function') {
          definition = { bind: definition, update: definition };
        }
        this.options[type + 's'][id] = definition;
        return definition
      }
    };
  });
}

/*  */

function getComponentName (opts) {
  return opts && (opts.Ctor.options.name || opts.tag)
}

function matches (pattern, name) {
  if (Array.isArray(pattern)) {
    return pattern.indexOf(name) > -1
  } else if (typeof pattern === 'string') {
    return pattern.split(',').indexOf(name) > -1
  } else if (isRegExp(pattern)) {
    return pattern.test(name)
  }
  /* istanbul ignore next */
  return false
}

function pruneCache (keepAliveInstance, filter) {
  var cache = keepAliveInstance.cache;
  var keys = keepAliveInstance.keys;
  var _vnode = keepAliveInstance._vnode;
  for (var key in cache) {
    var cachedNode = cache[key];
    if (cachedNode) {
      var name = getComponentName(cachedNode.componentOptions);
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

function pruneCacheEntry (
  cache,
  key,
  keys,
  current
) {
  var cached$$1 = cache[key];
  if (cached$$1 && (!current || cached$$1.tag !== current.tag)) {
    cached$$1.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

var patternTypes = [String, RegExp, Array];

var KeepAlive = {
  name: 'keep-alive',
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number]
  },

  created: function created () {
    this.cache = Object.create(null);
    this.keys = [];
  },

  destroyed: function destroyed () {
    var this$1 = this;

    for (var key in this$1.cache) {
      pruneCacheEntry(this$1.cache, key, this$1.keys);
    }
  },

  mounted: function mounted () {
    var this$1 = this;

    this.$watch('include', function (val) {
      pruneCache(this$1, function (name) { return matches(val, name); });
    });
    this.$watch('exclude', function (val) {
      pruneCache(this$1, function (name) { return !matches(val, name); });
    });
  },

  render: function render () {
    var slot = this.$slots.default;
    var vnode = getFirstComponentChild(slot);
    var componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      var name = getComponentName(componentOptions);
      var ref = this;
      var include = ref.include;
      var exclude = ref.exclude;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode
      }

      var ref$1 = this;
      var cache = ref$1.cache;
      var keys = ref$1.keys;
      var key = vnode.key == null
        // same constructor may get registered as different local components
        // so cid alone is not enough (#3269)
        ? componentOptions.Ctor.cid + (componentOptions.tag ? ("::" + (componentOptions.tag)) : '')
        : vnode.key;
      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        cache[key] = vnode;
        keys.push(key);
        // prune oldest entry
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
      }

      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0])
  }
};

var builtInComponents = {
  KeepAlive: KeepAlive
};

/*  */

function initGlobalAPI (Vue) {
  // config
  var configDef = {};
  configDef.get = function () { return config; };
  Object.defineProperty(Vue, 'config', configDef);

  // exposed util methods.
  // NOTE: these are not considered part of the public API - avoid relying on
  // them unless you are aware of the risk.
  Vue.util = {
    warn: warn,
    extend: extend,
    mergeOptions: mergeOptions,
    defineReactive: defineReactive
  };

  Vue.set = set;
  Vue.delete = del;
  Vue.nextTick = nextTick;

  Vue.options = Object.create(null);
  ASSET_TYPES.forEach(function (type) {
    Vue.options[type + 's'] = Object.create(null);
  });

  // this is used to identify the "base" constructor to extend all plain-object
  // components with in Weex's multi-instance scenarios.
  Vue.options._base = Vue;

  extend(Vue.options.components, builtInComponents);

  initUse(Vue);
  initMixin$1(Vue);
  initExtend(Vue);
  initAssetRegisters(Vue);
}

initGlobalAPI(Vue);

Object.defineProperty(Vue.prototype, '$isServer', {
  get: isServerRendering
});

Object.defineProperty(Vue.prototype, '$ssrContext', {
  get: function get () {
    /* istanbul ignore next */
    return this.$vnode && this.$vnode.ssrContext
  }
});

// expose FunctionalRenderContext for ssr runtime helper installation
Object.defineProperty(Vue, 'FunctionalRenderContext', {
  value: FunctionalRenderContext
});

Vue.version = '2.5.17';

/*  */

// these are reserved for web because they are directly compiled away
// during template compilation
var isReservedAttr = makeMap('style,class');

// attributes that should be using props for binding
var acceptValue = makeMap('input,textarea,option,select,progress');
var mustUseProp = function (tag, type, attr) {
  return (
    (attr === 'value' && acceptValue(tag)) && type !== 'button' ||
    (attr === 'selected' && tag === 'option') ||
    (attr === 'checked' && tag === 'input') ||
    (attr === 'muted' && tag === 'video')
  )
};

var isEnumeratedAttr = makeMap('contenteditable,draggable,spellcheck');

var isBooleanAttr = makeMap(
  'allowfullscreen,async,autofocus,autoplay,checked,compact,controls,declare,' +
  'default,defaultchecked,defaultmuted,defaultselected,defer,disabled,' +
  'enabled,formnovalidate,hidden,indeterminate,inert,ismap,itemscope,loop,multiple,' +
  'muted,nohref,noresize,noshade,novalidate,nowrap,open,pauseonexit,readonly,' +
  'required,reversed,scoped,seamless,selected,sortable,translate,' +
  'truespeed,typemustmatch,visible'
);

var xlinkNS = 'http://www.w3.org/1999/xlink';

var isXlink = function (name) {
  return name.charAt(5) === ':' && name.slice(0, 5) === 'xlink'
};

var getXlinkProp = function (name) {
  return isXlink(name) ? name.slice(6, name.length) : ''
};

var isFalsyAttrValue = function (val) {
  return val == null || val === false
};

/*  */

function genClassForVnode (vnode) {
  var data = vnode.data;
  var parentNode = vnode;
  var childNode = vnode;
  while (isDef(childNode.componentInstance)) {
    childNode = childNode.componentInstance._vnode;
    if (childNode && childNode.data) {
      data = mergeClassData(childNode.data, data);
    }
  }
  while (isDef(parentNode = parentNode.parent)) {
    if (parentNode && parentNode.data) {
      data = mergeClassData(data, parentNode.data);
    }
  }
  return renderClass(data.staticClass, data.class)
}

function mergeClassData (child, parent) {
  return {
    staticClass: concat(child.staticClass, parent.staticClass),
    class: isDef(child.class)
      ? [child.class, parent.class]
      : parent.class
  }
}

function renderClass (
  staticClass,
  dynamicClass
) {
  if (isDef(staticClass) || isDef(dynamicClass)) {
    return concat(staticClass, stringifyClass(dynamicClass))
  }
  /* istanbul ignore next */
  return ''
}

function concat (a, b) {
  return a ? b ? (a + ' ' + b) : a : (b || '')
}

function stringifyClass (value) {
  if (Array.isArray(value)) {
    return stringifyArray(value)
  }
  if (isObject(value)) {
    return stringifyObject(value)
  }
  if (typeof value === 'string') {
    return value
  }
  /* istanbul ignore next */
  return ''
}

function stringifyArray (value) {
  var res = '';
  var stringified;
  for (var i = 0, l = value.length; i < l; i++) {
    if (isDef(stringified = stringifyClass(value[i])) && stringified !== '') {
      if (res) { res += ' '; }
      res += stringified;
    }
  }
  return res
}

function stringifyObject (value) {
  var res = '';
  for (var key in value) {
    if (value[key]) {
      if (res) { res += ' '; }
      res += key;
    }
  }
  return res
}

/*  */

var namespaceMap = {
  svg: 'http://www.w3.org/2000/svg',
  math: 'http://www.w3.org/1998/Math/MathML'
};

var isHTMLTag = makeMap(
  'html,body,base,head,link,meta,style,title,' +
  'address,article,aside,footer,header,h1,h2,h3,h4,h5,h6,hgroup,nav,section,' +
  'div,dd,dl,dt,figcaption,figure,picture,hr,img,li,main,ol,p,pre,ul,' +
  'a,b,abbr,bdi,bdo,br,cite,code,data,dfn,em,i,kbd,mark,q,rp,rt,rtc,ruby,' +
  's,samp,small,span,strong,sub,sup,time,u,var,wbr,area,audio,map,track,video,' +
  'embed,object,param,source,canvas,script,noscript,del,ins,' +
  'caption,col,colgroup,table,thead,tbody,td,th,tr,' +
  'button,datalist,fieldset,form,input,label,legend,meter,optgroup,option,' +
  'output,progress,select,textarea,' +
  'details,dialog,menu,menuitem,summary,' +
  'content,element,shadow,template,blockquote,iframe,tfoot'
);

// this map is intentionally selective, only covering SVG elements that may
// contain child elements.
var isSVG = makeMap(
  'svg,animate,circle,clippath,cursor,defs,desc,ellipse,filter,font-face,' +
  'foreignObject,g,glyph,image,line,marker,mask,missing-glyph,path,pattern,' +
  'polygon,polyline,rect,switch,symbol,text,textpath,tspan,use,view',
  true
);



var isReservedTag = function (tag) {
  return isHTMLTag(tag) || isSVG(tag)
};

function getTagNamespace (tag) {
  if (isSVG(tag)) {
    return 'svg'
  }
  // basic support for MathML
  // note it doesn't support other MathML elements being component roots
  if (tag === 'math') {
    return 'math'
  }
}

var unknownElementCache = Object.create(null);
function isUnknownElement (tag) {
  /* istanbul ignore if */
  if (!inBrowser) {
    return true
  }
  if (isReservedTag(tag)) {
    return false
  }
  tag = tag.toLowerCase();
  /* istanbul ignore if */
  if (unknownElementCache[tag] != null) {
    return unknownElementCache[tag]
  }
  var el = document.createElement(tag);
  if (tag.indexOf('-') > -1) {
    // http://stackoverflow.com/a/28210364/1070244
    return (unknownElementCache[tag] = (
      el.constructor === window.HTMLUnknownElement ||
      el.constructor === window.HTMLElement
    ))
  } else {
    return (unknownElementCache[tag] = /HTMLUnknownElement/.test(el.toString()))
  }
}

var isTextInputType = makeMap('text,number,password,search,email,tel,url');

/*  */

/**
 * Query an element selector if it's not an element already.
 */
function query (el) {
  if (typeof el === 'string') {
    var selected = document.querySelector(el);
    if (!selected) {
      return document.createElement('div')
    }
    return selected
  } else {
    return el
  }
}

/*  */

function createElement$1 (tagName, vnode) {
  var elm = document.createElement(tagName);
  if (tagName !== 'select') {
    return elm
  }
  // false or null will remove the attribute but undefined will not
  if (vnode.data && vnode.data.attrs && vnode.data.attrs.multiple !== undefined) {
    elm.setAttribute('multiple', 'multiple');
  }
  return elm
}

function createElementNS (namespace, tagName) {
  return document.createElementNS(namespaceMap[namespace], tagName)
}

function createTextNode (text) {
  return document.createTextNode(text)
}

function createComment (text) {
  return document.createComment(text)
}

function insertBefore (parentNode, newNode, referenceNode) {
  parentNode.insertBefore(newNode, referenceNode);
}

function removeChild (node, child) {
  node.removeChild(child);
}

function appendChild (node, child) {
  node.appendChild(child);
}

function parentNode (node) {
  return node.parentNode
}

function nextSibling (node) {
  return node.nextSibling
}

function tagName (node) {
  return node.tagName
}

function setTextContent (node, text) {
  node.textContent = text;
}

function setStyleScope (node, scopeId) {
  node.setAttribute(scopeId, '');
}


var nodeOps = Object.freeze({
	createElement: createElement$1,
	createElementNS: createElementNS,
	createTextNode: createTextNode,
	createComment: createComment,
	insertBefore: insertBefore,
	removeChild: removeChild,
	appendChild: appendChild,
	parentNode: parentNode,
	nextSibling: nextSibling,
	tagName: tagName,
	setTextContent: setTextContent,
	setStyleScope: setStyleScope
});

/*  */

var ref = {
  create: function create (_, vnode) {
    registerRef(vnode);
  },
  update: function update (oldVnode, vnode) {
    if (oldVnode.data.ref !== vnode.data.ref) {
      registerRef(oldVnode, true);
      registerRef(vnode);
    }
  },
  destroy: function destroy (vnode) {
    registerRef(vnode, true);
  }
};

function registerRef (vnode, isRemoval) {
  var key = vnode.data.ref;
  if (!isDef(key)) { return }

  var vm = vnode.context;
  var ref = vnode.componentInstance || vnode.elm;
  var refs = vm.$refs;
  if (isRemoval) {
    if (Array.isArray(refs[key])) {
      remove(refs[key], ref);
    } else if (refs[key] === ref) {
      refs[key] = undefined;
    }
  } else {
    if (vnode.data.refInFor) {
      if (!Array.isArray(refs[key])) {
        refs[key] = [ref];
      } else if (refs[key].indexOf(ref) < 0) {
        // $flow-disable-line
        refs[key].push(ref);
      }
    } else {
      refs[key] = ref;
    }
  }
}

/**
 * Virtual DOM patching algorithm based on Snabbdom by
 * Simon Friis Vindum (@paldepind)
 * Licensed under the MIT License
 * https://github.com/paldepind/snabbdom/blob/master/LICENSE
 *
 * modified by Evan You (@yyx990803)
 *
 * Not type-checking this because this file is perf-critical and the cost
 * of making flow understand it is not worth it.
 */

var emptyNode = new VNode('', {}, []);

var hooks = ['create', 'activate', 'update', 'remove', 'destroy'];

function sameVnode (a, b) {
  return (
    a.key === b.key && (
      (
        a.tag === b.tag &&
        a.isComment === b.isComment &&
        isDef(a.data) === isDef(b.data) &&
        sameInputType(a, b)
      ) || (
        isTrue(a.isAsyncPlaceholder) &&
        a.asyncFactory === b.asyncFactory &&
        isUndef(b.asyncFactory.error)
      )
    )
  )
}

function sameInputType (a, b) {
  if (a.tag !== 'input') { return true }
  var i;
  var typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type;
  var typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type;
  return typeA === typeB || isTextInputType(typeA) && isTextInputType(typeB)
}

function createKeyToOldIdx (children, beginIdx, endIdx) {
  var i, key;
  var map = {};
  for (i = beginIdx; i <= endIdx; ++i) {
    key = children[i].key;
    if (isDef(key)) { map[key] = i; }
  }
  return map
}

function createPatchFunction (backend) {
  var i, j;
  var cbs = {};

  var modules = backend.modules;
  var nodeOps = backend.nodeOps;

  for (i = 0; i < hooks.length; ++i) {
    cbs[hooks[i]] = [];
    for (j = 0; j < modules.length; ++j) {
      if (isDef(modules[j][hooks[i]])) {
        cbs[hooks[i]].push(modules[j][hooks[i]]);
      }
    }
  }

  function emptyNodeAt (elm) {
    return new VNode(nodeOps.tagName(elm).toLowerCase(), {}, [], undefined, elm)
  }

  function createRmCb (childElm, listeners) {
    function remove () {
      if (--remove.listeners === 0) {
        removeNode(childElm);
      }
    }
    remove.listeners = listeners;
    return remove
  }

  function removeNode (el) {
    var parent = nodeOps.parentNode(el);
    // element may have already been removed due to v-html / v-text
    if (isDef(parent)) {
      nodeOps.removeChild(parent, el);
    }
  }

  function createElm (
    vnode,
    insertedVnodeQueue,
    parentElm,
    refElm,
    nested,
    ownerArray,
    index
  ) {
    if (isDef(vnode.elm) && isDef(ownerArray)) {
      // This vnode was used in a previous render!
      // now it's used as a new node, overwriting its elm would cause
      // potential patch errors down the road when it's used as an insertion
      // reference node. Instead, we clone the node on-demand before creating
      // associated DOM element for it.
      vnode = ownerArray[index] = cloneVNode(vnode);
    }

    vnode.isRootInsert = !nested; // for transition enter check
    if (createComponent(vnode, insertedVnodeQueue, parentElm, refElm)) {
      return
    }

    var data = vnode.data;
    var children = vnode.children;
    var tag = vnode.tag;
    if (isDef(tag)) {

      vnode.elm = vnode.ns
        ? nodeOps.createElementNS(vnode.ns, tag)
        : nodeOps.createElement(tag, vnode);
      setScope(vnode);

      /* istanbul ignore if */
      {
        createChildren(vnode, children, insertedVnodeQueue);
        if (isDef(data)) {
          invokeCreateHooks(vnode, insertedVnodeQueue);
        }
        insert(parentElm, vnode.elm, refElm);
      }
    } else if (isTrue(vnode.isComment)) {
      vnode.elm = nodeOps.createComment(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    } else {
      vnode.elm = nodeOps.createTextNode(vnode.text);
      insert(parentElm, vnode.elm, refElm);
    }
  }

  function createComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i = vnode.data;
    if (isDef(i)) {
      var isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
      if (isDef(i = i.hook) && isDef(i = i.init)) {
        i(vnode, false /* hydrating */, parentElm, refElm);
      }
      // after calling the init hook, if the vnode is a child component
      // it should've created a child instance and mounted it. the child
      // component also has set the placeholder vnode's elm.
      // in that case we can just return the element and be done.
      if (isDef(vnode.componentInstance)) {
        initComponent(vnode, insertedVnodeQueue);
        if (isTrue(isReactivated)) {
          reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
        }
        return true
      }
    }
  }

  function initComponent (vnode, insertedVnodeQueue) {
    if (isDef(vnode.data.pendingInsert)) {
      insertedVnodeQueue.push.apply(insertedVnodeQueue, vnode.data.pendingInsert);
      vnode.data.pendingInsert = null;
    }
    vnode.elm = vnode.componentInstance.$el;
    if (isPatchable(vnode)) {
      invokeCreateHooks(vnode, insertedVnodeQueue);
      setScope(vnode);
    } else {
      // empty component root.
      // skip all element-related modules except for ref (#3455)
      registerRef(vnode);
      // make sure to invoke the insert hook
      insertedVnodeQueue.push(vnode);
    }
  }

  function reactivateComponent (vnode, insertedVnodeQueue, parentElm, refElm) {
    var i;
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    var innerNode = vnode;
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode;
      if (isDef(i = innerNode.data) && isDef(i = i.transition)) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode);
        }
        insertedVnodeQueue.push(innerNode);
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    insert(parentElm, vnode.elm, refElm);
  }

  function insert (parent, elm, ref$$1) {
    if (isDef(parent)) {
      if (isDef(ref$$1)) {
        if (ref$$1.parentNode === parent) {
          nodeOps.insertBefore(parent, elm, ref$$1);
        }
      } else {
        nodeOps.appendChild(parent, elm);
      }
    }
  }

  function createChildren (vnode, children, insertedVnodeQueue) {
    if (Array.isArray(children)) {
      for (var i = 0; i < children.length; ++i) {
        createElm(children[i], insertedVnodeQueue, vnode.elm, null, true, children, i);
      }
    } else if (isPrimitive(vnode.text)) {
      nodeOps.appendChild(vnode.elm, nodeOps.createTextNode(String(vnode.text)));
    }
  }

  function isPatchable (vnode) {
    while (vnode.componentInstance) {
      vnode = vnode.componentInstance._vnode;
    }
    return isDef(vnode.tag)
  }

  function invokeCreateHooks (vnode, insertedVnodeQueue) {
    for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
      cbs.create[i$1](emptyNode, vnode);
    }
    i = vnode.data.hook; // Reuse variable
    if (isDef(i)) {
      if (isDef(i.create)) { i.create(emptyNode, vnode); }
      if (isDef(i.insert)) { insertedVnodeQueue.push(vnode); }
    }
  }

  // set scope id attribute for scoped CSS.
  // this is implemented as a special case to avoid the overhead
  // of going through the normal attribute patching process.
  function setScope (vnode) {
    var i;
    if (isDef(i = vnode.fnScopeId)) {
      nodeOps.setStyleScope(vnode.elm, i);
    } else {
      var ancestor = vnode;
      while (ancestor) {
        if (isDef(i = ancestor.context) && isDef(i = i.$options._scopeId)) {
          nodeOps.setStyleScope(vnode.elm, i);
        }
        ancestor = ancestor.parent;
      }
    }
    // for slot content they should also get the scopeId from the host instance.
    if (isDef(i = activeInstance) &&
      i !== vnode.context &&
      i !== vnode.fnContext &&
      isDef(i = i.$options._scopeId)
    ) {
      nodeOps.setStyleScope(vnode.elm, i);
    }
  }

  function addVnodes (parentElm, refElm, vnodes, startIdx, endIdx, insertedVnodeQueue) {
    for (; startIdx <= endIdx; ++startIdx) {
      createElm(vnodes[startIdx], insertedVnodeQueue, parentElm, refElm, false, vnodes, startIdx);
    }
  }

  function invokeDestroyHook (vnode) {
    var i, j;
    var data = vnode.data;
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.destroy)) { i(vnode); }
      for (i = 0; i < cbs.destroy.length; ++i) { cbs.destroy[i](vnode); }
    }
    if (isDef(i = vnode.children)) {
      for (j = 0; j < vnode.children.length; ++j) {
        invokeDestroyHook(vnode.children[j]);
      }
    }
  }

  function removeVnodes (parentElm, vnodes, startIdx, endIdx) {
    for (; startIdx <= endIdx; ++startIdx) {
      var ch = vnodes[startIdx];
      if (isDef(ch)) {
        if (isDef(ch.tag)) {
          removeAndInvokeRemoveHook(ch);
          invokeDestroyHook(ch);
        } else { // Text node
          removeNode(ch.elm);
        }
      }
    }
  }

  function removeAndInvokeRemoveHook (vnode, rm) {
    if (isDef(rm) || isDef(vnode.data)) {
      var i;
      var listeners = cbs.remove.length + 1;
      if (isDef(rm)) {
        // we have a recursively passed down rm callback
        // increase the listeners count
        rm.listeners += listeners;
      } else {
        // directly removing
        rm = createRmCb(vnode.elm, listeners);
      }
      // recursively invoke hooks on child component root node
      if (isDef(i = vnode.componentInstance) && isDef(i = i._vnode) && isDef(i.data)) {
        removeAndInvokeRemoveHook(i, rm);
      }
      for (i = 0; i < cbs.remove.length; ++i) {
        cbs.remove[i](vnode, rm);
      }
      if (isDef(i = vnode.data.hook) && isDef(i = i.remove)) {
        i(vnode, rm);
      } else {
        rm();
      }
    } else {
      removeNode(vnode.elm);
    }
  }

  function updateChildren (parentElm, oldCh, newCh, insertedVnodeQueue, removeOnly) {
    var oldStartIdx = 0;
    var newStartIdx = 0;
    var oldEndIdx = oldCh.length - 1;
    var oldStartVnode = oldCh[0];
    var oldEndVnode = oldCh[oldEndIdx];
    var newEndIdx = newCh.length - 1;
    var newStartVnode = newCh[0];
    var newEndVnode = newCh[newEndIdx];
    var oldKeyToIdx, idxInOld, vnodeToMove, refElm;

    // removeOnly is a special flag used only by <transition-group>
    // to ensure removed elements stay in correct relative positions
    // during leaving transitions
    var canMove = !removeOnly;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
      if (isUndef(oldStartVnode)) {
        oldStartVnode = oldCh[++oldStartIdx]; // Vnode has been moved left
      } else if (isUndef(oldEndVnode)) {
        oldEndVnode = oldCh[--oldEndIdx];
      } else if (sameVnode(oldStartVnode, newStartVnode)) {
        patchVnode(oldStartVnode, newStartVnode, insertedVnodeQueue);
        oldStartVnode = oldCh[++oldStartIdx];
        newStartVnode = newCh[++newStartIdx];
      } else if (sameVnode(oldEndVnode, newEndVnode)) {
        patchVnode(oldEndVnode, newEndVnode, insertedVnodeQueue);
        oldEndVnode = oldCh[--oldEndIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldStartVnode, newEndVnode)) { // Vnode moved right
        patchVnode(oldStartVnode, newEndVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldStartVnode.elm, nodeOps.nextSibling(oldEndVnode.elm));
        oldStartVnode = oldCh[++oldStartIdx];
        newEndVnode = newCh[--newEndIdx];
      } else if (sameVnode(oldEndVnode, newStartVnode)) { // Vnode moved left
        patchVnode(oldEndVnode, newStartVnode, insertedVnodeQueue);
        canMove && nodeOps.insertBefore(parentElm, oldEndVnode.elm, oldStartVnode.elm);
        oldEndVnode = oldCh[--oldEndIdx];
        newStartVnode = newCh[++newStartIdx];
      } else {
        if (isUndef(oldKeyToIdx)) { oldKeyToIdx = createKeyToOldIdx(oldCh, oldStartIdx, oldEndIdx); }
        idxInOld = isDef(newStartVnode.key)
          ? oldKeyToIdx[newStartVnode.key]
          : findIdxInOld(newStartVnode, oldCh, oldStartIdx, oldEndIdx);
        if (isUndef(idxInOld)) { // New element
          createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
        } else {
          vnodeToMove = oldCh[idxInOld];
          if (sameVnode(vnodeToMove, newStartVnode)) {
            patchVnode(vnodeToMove, newStartVnode, insertedVnodeQueue);
            oldCh[idxInOld] = undefined;
            canMove && nodeOps.insertBefore(parentElm, vnodeToMove.elm, oldStartVnode.elm);
          } else {
            // same key but different element. treat as new element
            createElm(newStartVnode, insertedVnodeQueue, parentElm, oldStartVnode.elm, false, newCh, newStartIdx);
          }
        }
        newStartVnode = newCh[++newStartIdx];
      }
    }
    if (oldStartIdx > oldEndIdx) {
      refElm = isUndef(newCh[newEndIdx + 1]) ? null : newCh[newEndIdx + 1].elm;
      addVnodes(parentElm, refElm, newCh, newStartIdx, newEndIdx, insertedVnodeQueue);
    } else if (newStartIdx > newEndIdx) {
      removeVnodes(parentElm, oldCh, oldStartIdx, oldEndIdx);
    }
  }

  function findIdxInOld (node, oldCh, start, end) {
    for (var i = start; i < end; i++) {
      var c = oldCh[i];
      if (isDef(c) && sameVnode(node, c)) { return i }
    }
  }

  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
    if (oldVnode === vnode) {
      return
    }

    var elm = vnode.elm = oldVnode.elm;

    if (isTrue(oldVnode.isAsyncPlaceholder)) {
      if (isDef(vnode.asyncFactory.resolved)) {
        hydrate(oldVnode.elm, vnode, insertedVnodeQueue);
      } else {
        vnode.isAsyncPlaceholder = true;
      }
      return
    }

    // reuse element for static trees.
    // note we only do this if the vnode is cloned -
    // if the new node is not cloned it means the render functions have been
    // reset by the hot-reload-api and we need to do a proper re-render.
    if (isTrue(vnode.isStatic) &&
      isTrue(oldVnode.isStatic) &&
      vnode.key === oldVnode.key &&
      (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))
    ) {
      vnode.componentInstance = oldVnode.componentInstance;
      return
    }

    var i;
    var data = vnode.data;
    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
      i(oldVnode, vnode);
    }

    var oldCh = oldVnode.children;
    var ch = vnode.children;
    if (isDef(data) && isPatchable(vnode)) {
      for (i = 0; i < cbs.update.length; ++i) { cbs.update[i](oldVnode, vnode); }
      if (isDef(i = data.hook) && isDef(i = i.update)) { i(oldVnode, vnode); }
    }
    if (isUndef(vnode.text)) {
      if (isDef(oldCh) && isDef(ch)) {
        if (oldCh !== ch) { updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly); }
      } else if (isDef(ch)) {
        if (isDef(oldVnode.text)) { nodeOps.setTextContent(elm, ''); }
        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue);
      } else if (isDef(oldCh)) {
        removeVnodes(elm, oldCh, 0, oldCh.length - 1);
      } else if (isDef(oldVnode.text)) {
        nodeOps.setTextContent(elm, '');
      }
    } else if (oldVnode.text !== vnode.text) {
      nodeOps.setTextContent(elm, vnode.text);
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.postpatch)) { i(oldVnode, vnode); }
    }
  }

  function invokeInsertHook (vnode, queue, initial) {
    // delay insert hooks for component root nodes, invoke them after the
    // element is really inserted
    if (isTrue(initial) && isDef(vnode.parent)) {
      vnode.parent.data.pendingInsert = queue;
    } else {
      for (var i = 0; i < queue.length; ++i) {
        queue[i].data.hook.insert(queue[i]);
      }
    }
  }
  // list of modules that can skip create hook during hydration because they
  // are already rendered on the client or has no need for initialization
  // Note: style is excluded because it relies on initial clone for future
  // deep updates (#7063).
  var isRenderedModule = makeMap('attrs,class,staticClass,staticStyle,key');

  // Note: this is a browser-only function so we can assume elms are DOM nodes.
  function hydrate (elm, vnode, insertedVnodeQueue, inVPre) {
    var i;
    var tag = vnode.tag;
    var data = vnode.data;
    var children = vnode.children;
    inVPre = inVPre || (data && data.pre);
    vnode.elm = elm;

    if (isTrue(vnode.isComment) && isDef(vnode.asyncFactory)) {
      vnode.isAsyncPlaceholder = true;
      return true
    }
    if (isDef(data)) {
      if (isDef(i = data.hook) && isDef(i = i.init)) { i(vnode, true /* hydrating */); }
      if (isDef(i = vnode.componentInstance)) {
        // child component. it should have hydrated its own tree.
        initComponent(vnode, insertedVnodeQueue);
        return true
      }
    }
    if (isDef(tag)) {
      if (isDef(children)) {
        // empty element, allow client to pick up and populate children
        if (!elm.hasChildNodes()) {
          createChildren(vnode, children, insertedVnodeQueue);
        } else {
          // v-html and domProps: innerHTML
          if (isDef(i = data) && isDef(i = i.domProps) && isDef(i = i.innerHTML)) {
            if (i !== elm.innerHTML) {
              return false
            }
          } else {
            // iterate and compare children lists
            var childrenMatch = true;
            var childNode = elm.firstChild;
            for (var i$1 = 0; i$1 < children.length; i$1++) {
              if (!childNode || !hydrate(childNode, children[i$1], insertedVnodeQueue, inVPre)) {
                childrenMatch = false;
                break
              }
              childNode = childNode.nextSibling;
            }
            // if childNode is not null, it means the actual childNodes list is
            // longer than the virtual children list.
            if (!childrenMatch || childNode) {
              return false
            }
          }
        }
      }
      if (isDef(data)) {
        var fullInvoke = false;
        for (var key in data) {
          if (!isRenderedModule(key)) {
            fullInvoke = true;
            invokeCreateHooks(vnode, insertedVnodeQueue);
            break
          }
        }
        if (!fullInvoke && data['class']) {
          // ensure collecting deps for deep class bindings for future updates
          traverse(data['class']);
        }
      }
    } else if (elm.data !== vnode.text) {
      elm.data = vnode.text;
    }
    return true
  }

  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
    if (isUndef(vnode)) {
      if (isDef(oldVnode)) { invokeDestroyHook(oldVnode); }
      return
    }

    var isInitialPatch = false;
    var insertedVnodeQueue = [];

    if (isUndef(oldVnode)) {
      // empty mount (likely as component), create new root element
      isInitialPatch = true;
      createElm(vnode, insertedVnodeQueue, parentElm, refElm);
    } else {
      var isRealElement = isDef(oldVnode.nodeType);
      if (!isRealElement && sameVnode(oldVnode, vnode)) {
        // patch existing root node
        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly);
      } else {
        if (isRealElement) {
          // mounting to a real element
          // check if this is server-rendered content and if we can perform
          // a successful hydration.
          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
            oldVnode.removeAttribute(SSR_ATTR);
            hydrating = true;
          }
          if (isTrue(hydrating)) {
            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
              invokeInsertHook(vnode, insertedVnodeQueue, true);
              return oldVnode
            }
          }
          // either not server-rendered, or hydration failed.
          // create an empty node and replace it
          oldVnode = emptyNodeAt(oldVnode);
        }

        // replacing existing element
        var oldElm = oldVnode.elm;
        var parentElm$1 = nodeOps.parentNode(oldElm);

        // create new node
        createElm(
          vnode,
          insertedVnodeQueue,
          // extremely rare edge case: do not insert if old element is in a
          // leaving transition. Only happens when combining transition +
          // keep-alive + HOCs. (#4590)
          oldElm._leaveCb ? null : parentElm$1,
          nodeOps.nextSibling(oldElm)
        );

        // update parent placeholder node element, recursively
        if (isDef(vnode.parent)) {
          var ancestor = vnode.parent;
          var patchable = isPatchable(vnode);
          while (ancestor) {
            for (var i = 0; i < cbs.destroy.length; ++i) {
              cbs.destroy[i](ancestor);
            }
            ancestor.elm = vnode.elm;
            if (patchable) {
              for (var i$1 = 0; i$1 < cbs.create.length; ++i$1) {
                cbs.create[i$1](emptyNode, ancestor);
              }
              // #6513
              // invoke insert hooks that may have been merged by create hooks.
              // e.g. for directives that uses the "inserted" hook.
              var insert = ancestor.data.hook.insert;
              if (insert.merged) {
                // start at index 1 to avoid re-invoking component mounted hook
                for (var i$2 = 1; i$2 < insert.fns.length; i$2++) {
                  insert.fns[i$2]();
                }
              }
            } else {
              registerRef(ancestor);
            }
            ancestor = ancestor.parent;
          }
        }

        // destroy old node
        if (isDef(parentElm$1)) {
          removeVnodes(parentElm$1, [oldVnode], 0, 0);
        } else if (isDef(oldVnode.tag)) {
          invokeDestroyHook(oldVnode);
        }
      }
    }

    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch);
    return vnode.elm
  }
}

/*  */

var directives = {
  create: updateDirectives,
  update: updateDirectives,
  destroy: function unbindDirectives (vnode) {
    updateDirectives(vnode, emptyNode);
  }
};

function updateDirectives (oldVnode, vnode) {
  if (oldVnode.data.directives || vnode.data.directives) {
    _update(oldVnode, vnode);
  }
}

function _update (oldVnode, vnode) {
  var isCreate = oldVnode === emptyNode;
  var isDestroy = vnode === emptyNode;
  var oldDirs = normalizeDirectives$1(oldVnode.data.directives, oldVnode.context);
  var newDirs = normalizeDirectives$1(vnode.data.directives, vnode.context);

  var dirsWithInsert = [];
  var dirsWithPostpatch = [];

  var key, oldDir, dir;
  for (key in newDirs) {
    oldDir = oldDirs[key];
    dir = newDirs[key];
    if (!oldDir) {
      // new directive, bind
      callHook$1(dir, 'bind', vnode, oldVnode);
      if (dir.def && dir.def.inserted) {
        dirsWithInsert.push(dir);
      }
    } else {
      // existing directive, update
      dir.oldValue = oldDir.value;
      callHook$1(dir, 'update', vnode, oldVnode);
      if (dir.def && dir.def.componentUpdated) {
        dirsWithPostpatch.push(dir);
      }
    }
  }

  if (dirsWithInsert.length) {
    var callInsert = function () {
      for (var i = 0; i < dirsWithInsert.length; i++) {
        callHook$1(dirsWithInsert[i], 'inserted', vnode, oldVnode);
      }
    };
    if (isCreate) {
      mergeVNodeHook(vnode, 'insert', callInsert);
    } else {
      callInsert();
    }
  }

  if (dirsWithPostpatch.length) {
    mergeVNodeHook(vnode, 'postpatch', function () {
      for (var i = 0; i < dirsWithPostpatch.length; i++) {
        callHook$1(dirsWithPostpatch[i], 'componentUpdated', vnode, oldVnode);
      }
    });
  }

  if (!isCreate) {
    for (key in oldDirs) {
      if (!newDirs[key]) {
        // no longer present, unbind
        callHook$1(oldDirs[key], 'unbind', oldVnode, oldVnode, isDestroy);
      }
    }
  }
}

var emptyModifiers = Object.create(null);

function normalizeDirectives$1 (
  dirs,
  vm
) {
  var res = Object.create(null);
  if (!dirs) {
    // $flow-disable-line
    return res
  }
  var i, dir;
  for (i = 0; i < dirs.length; i++) {
    dir = dirs[i];
    if (!dir.modifiers) {
      // $flow-disable-line
      dir.modifiers = emptyModifiers;
    }
    res[getRawDirName(dir)] = dir;
    dir.def = resolveAsset(vm.$options, 'directives', dir.name, true);
  }
  // $flow-disable-line
  return res
}

function getRawDirName (dir) {
  return dir.rawName || ((dir.name) + "." + (Object.keys(dir.modifiers || {}).join('.')))
}

function callHook$1 (dir, hook, vnode, oldVnode, isDestroy) {
  var fn = dir.def && dir.def[hook];
  if (fn) {
    try {
      fn(vnode.elm, dir, vnode, oldVnode, isDestroy);
    } catch (e) {
      handleError(e, vnode.context, ("directive " + (dir.name) + " " + hook + " hook"));
    }
  }
}

var baseModules = [
  ref,
  directives
];

/*  */

function updateAttrs (oldVnode, vnode) {
  var opts = vnode.componentOptions;
  if (isDef(opts) && opts.Ctor.options.inheritAttrs === false) {
    return
  }
  if (isUndef(oldVnode.data.attrs) && isUndef(vnode.data.attrs)) {
    return
  }
  var key, cur, old;
  var elm = vnode.elm;
  var oldAttrs = oldVnode.data.attrs || {};
  var attrs = vnode.data.attrs || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(attrs.__ob__)) {
    attrs = vnode.data.attrs = extend({}, attrs);
  }

  for (key in attrs) {
    cur = attrs[key];
    old = oldAttrs[key];
    if (old !== cur) {
      setAttr(elm, key, cur);
    }
  }
  // #4391: in IE9, setting type can reset value for input[type=radio]
  // #6666: IE/Edge forces progress value down to 1 before setting a max
  /* istanbul ignore if */
  if ((isIE || isEdge) && attrs.value !== oldAttrs.value) {
    setAttr(elm, 'value', attrs.value);
  }
  for (key in oldAttrs) {
    if (isUndef(attrs[key])) {
      if (isXlink(key)) {
        elm.removeAttributeNS(xlinkNS, getXlinkProp(key));
      } else if (!isEnumeratedAttr(key)) {
        elm.removeAttribute(key);
      }
    }
  }
}

function setAttr (el, key, value) {
  if (el.tagName.indexOf('-') > -1) {
    baseSetAttr(el, key, value);
  } else if (isBooleanAttr(key)) {
    // set attribute for blank value
    // e.g. <option disabled>Select one</option>
    if (isFalsyAttrValue(value)) {
      el.removeAttribute(key);
    } else {
      // technically allowfullscreen is a boolean attribute for <iframe>,
      // but Flash expects a value of "true" when used on <embed> tag
      value = key === 'allowfullscreen' && el.tagName === 'EMBED'
        ? 'true'
        : key;
      el.setAttribute(key, value);
    }
  } else if (isEnumeratedAttr(key)) {
    el.setAttribute(key, isFalsyAttrValue(value) || value === 'false' ? 'false' : 'true');
  } else if (isXlink(key)) {
    if (isFalsyAttrValue(value)) {
      el.removeAttributeNS(xlinkNS, getXlinkProp(key));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    baseSetAttr(el, key, value);
  }
}

function baseSetAttr (el, key, value) {
  if (isFalsyAttrValue(value)) {
    el.removeAttribute(key);
  } else {
    // #7138: IE10 & 11 fires input event when setting placeholder on
    // <textarea>... block the first input event and remove the blocker
    // immediately.
    /* istanbul ignore if */
    if (
      isIE && !isIE9 &&
      el.tagName === 'TEXTAREA' &&
      key === 'placeholder' && !el.__ieph
    ) {
      var blocker = function (e) {
        e.stopImmediatePropagation();
        el.removeEventListener('input', blocker);
      };
      el.addEventListener('input', blocker);
      // $flow-disable-line
      el.__ieph = true; /* IE placeholder patched */
    }
    el.setAttribute(key, value);
  }
}

var attrs = {
  create: updateAttrs,
  update: updateAttrs
};

/*  */

function updateClass (oldVnode, vnode) {
  var el = vnode.elm;
  var data = vnode.data;
  var oldData = oldVnode.data;
  if (
    isUndef(data.staticClass) &&
    isUndef(data.class) && (
      isUndef(oldData) || (
        isUndef(oldData.staticClass) &&
        isUndef(oldData.class)
      )
    )
  ) {
    return
  }

  var cls = genClassForVnode(vnode);

  // handle transition classes
  var transitionClass = el._transitionClasses;
  if (isDef(transitionClass)) {
    cls = concat(cls, stringifyClass(transitionClass));
  }

  // set the class
  if (cls !== el._prevClass) {
    el.setAttribute('class', cls);
    el._prevClass = cls;
  }
}

var klass = {
  create: updateClass,
  update: updateClass
};

/*  */

/*  */









// add a raw attr (use this in preTransforms)








// note: this only removes the attr from the Array (attrsList) so that it
// doesn't get processed by processAttrs.
// By default it does NOT remove it from the map (attrsMap) because the map is
// needed during codegen.

/*  */

/**
 * Cross-platform code generation for component v-model
 */


/**
 * Cross-platform codegen helper for generating v-model value assignment code.
 */

/*  */

// in some cases, the event used has to be determined at runtime
// so we used some reserved tokens during compile.
var RANGE_TOKEN = '__r';
var CHECKBOX_RADIO_TOKEN = '__c';

/*  */

// normalize v-model event tokens that can only be determined at runtime.
// it's important to place the event as the first in the array because
// the whole point is ensuring the v-model callback gets called before
// user-attached handlers.
function normalizeEvents (on) {
  /* istanbul ignore if */
  if (isDef(on[RANGE_TOKEN])) {
    // IE input[type=range] only supports `change` event
    var event = isIE ? 'change' : 'input';
    on[event] = [].concat(on[RANGE_TOKEN], on[event] || []);
    delete on[RANGE_TOKEN];
  }
  // This was originally intended to fix #4521 but no longer necessary
  // after 2.5. Keeping it for backwards compat with generated code from < 2.4
  /* istanbul ignore if */
  if (isDef(on[CHECKBOX_RADIO_TOKEN])) {
    on.change = [].concat(on[CHECKBOX_RADIO_TOKEN], on.change || []);
    delete on[CHECKBOX_RADIO_TOKEN];
  }
}

var target$1;

function createOnceHandler (handler, event, capture) {
  var _target = target$1; // save current target element in closure
  return function onceHandler () {
    var res = handler.apply(null, arguments);
    if (res !== null) {
      remove$2(event, onceHandler, capture, _target);
    }
  }
}

function add$1 (
  event,
  handler,
  once$$1,
  capture,
  passive
) {
  handler = withMacroTask(handler);
  if (once$$1) { handler = createOnceHandler(handler, event, capture); }
  target$1.addEventListener(
    event,
    handler,
    supportsPassive
      ? { capture: capture, passive: passive }
      : capture
  );
}

function remove$2 (
  event,
  handler,
  capture,
  _target
) {
  (_target || target$1).removeEventListener(
    event,
    handler._withTask || handler,
    capture
  );
}

function updateDOMListeners (oldVnode, vnode) {
  if (isUndef(oldVnode.data.on) && isUndef(vnode.data.on)) {
    return
  }
  var on = vnode.data.on || {};
  var oldOn = oldVnode.data.on || {};
  target$1 = vnode.elm;
  normalizeEvents(on);
  updateListeners(on, oldOn, add$1, remove$2, vnode.context);
  target$1 = undefined;
}

var events = {
  create: updateDOMListeners,
  update: updateDOMListeners
};

/*  */

function updateDOMProps (oldVnode, vnode) {
  if (isUndef(oldVnode.data.domProps) && isUndef(vnode.data.domProps)) {
    return
  }
  var key, cur;
  var elm = vnode.elm;
  var oldProps = oldVnode.data.domProps || {};
  var props = vnode.data.domProps || {};
  // clone observed objects, as the user probably wants to mutate it
  if (isDef(props.__ob__)) {
    props = vnode.data.domProps = extend({}, props);
  }

  for (key in oldProps) {
    if (isUndef(props[key])) {
      elm[key] = '';
    }
  }
  for (key in props) {
    cur = props[key];
    // ignore children if the node has textContent or innerHTML,
    // as these will throw away existing DOM nodes and cause removal errors
    // on subsequent patches (#3360)
    if (key === 'textContent' || key === 'innerHTML') {
      if (vnode.children) { vnode.children.length = 0; }
      if (cur === oldProps[key]) { continue }
      // #6601 work around Chrome version <= 55 bug where single textNode
      // replaced by innerHTML/textContent retains its parentNode property
      if (elm.childNodes.length === 1) {
        elm.removeChild(elm.childNodes[0]);
      }
    }

    if (key === 'value') {
      // store value as _value as well since
      // non-string values will be stringified
      elm._value = cur;
      // avoid resetting cursor position when value is the same
      var strCur = isUndef(cur) ? '' : String(cur);
      if (shouldUpdateValue(elm, strCur)) {
        elm.value = strCur;
      }
    } else {
      elm[key] = cur;
    }
  }
}

// check platforms/web/util/attrs.js acceptValue


function shouldUpdateValue (elm, checkVal) {
  return (!elm.composing && (
    elm.tagName === 'OPTION' ||
    isNotInFocusAndDirty(elm, checkVal) ||
    isDirtyWithModifiers(elm, checkVal)
  ))
}

function isNotInFocusAndDirty (elm, checkVal) {
  // return true when textbox (.number and .trim) loses focus and its value is
  // not equal to the updated value
  var notInFocus = true;
  // #6157
  // work around IE bug when accessing document.activeElement in an iframe
  try { notInFocus = document.activeElement !== elm; } catch (e) {}
  return notInFocus && elm.value !== checkVal
}

function isDirtyWithModifiers (elm, newVal) {
  var value = elm.value;
  var modifiers = elm._vModifiers; // injected by v-model runtime
  if (isDef(modifiers)) {
    if (modifiers.lazy) {
      // inputs with lazy should only be updated when not in focus
      return false
    }
    if (modifiers.number) {
      return toNumber(value) !== toNumber(newVal)
    }
    if (modifiers.trim) {
      return value.trim() !== newVal.trim()
    }
  }
  return value !== newVal
}

var domProps = {
  create: updateDOMProps,
  update: updateDOMProps
};

/*  */

var parseStyleText = cached(function (cssText) {
  var res = {};
  var listDelimiter = /;(?![^(]*\))/g;
  var propertyDelimiter = /:(.+)/;
  cssText.split(listDelimiter).forEach(function (item) {
    if (item) {
      var tmp = item.split(propertyDelimiter);
      tmp.length > 1 && (res[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return res
});

// merge static and dynamic style data on the same vnode
function normalizeStyleData (data) {
  var style = normalizeStyleBinding(data.style);
  // static style is pre-processed into an object during compilation
  // and is always a fresh object, so it's safe to merge into it
  return data.staticStyle
    ? extend(data.staticStyle, style)
    : style
}

// normalize possible array / string values into Object
function normalizeStyleBinding (bindingStyle) {
  if (Array.isArray(bindingStyle)) {
    return toObject(bindingStyle)
  }
  if (typeof bindingStyle === 'string') {
    return parseStyleText(bindingStyle)
  }
  return bindingStyle
}

/**
 * parent component style should be after child's
 * so that parent component's style could override it
 */
function getStyle (vnode, checkChild) {
  var res = {};
  var styleData;

  if (checkChild) {
    var childNode = vnode;
    while (childNode.componentInstance) {
      childNode = childNode.componentInstance._vnode;
      if (
        childNode && childNode.data &&
        (styleData = normalizeStyleData(childNode.data))
      ) {
        extend(res, styleData);
      }
    }
  }

  if ((styleData = normalizeStyleData(vnode.data))) {
    extend(res, styleData);
  }

  var parentNode = vnode;
  while ((parentNode = parentNode.parent)) {
    if (parentNode.data && (styleData = normalizeStyleData(parentNode.data))) {
      extend(res, styleData);
    }
  }
  return res
}

/*  */

var cssVarRE = /^--/;
var importantRE = /\s*!important$/;
var setProp = function (el, name, val) {
  /* istanbul ignore if */
  if (cssVarRE.test(name)) {
    el.style.setProperty(name, val);
  } else if (importantRE.test(val)) {
    el.style.setProperty(name, val.replace(importantRE, ''), 'important');
  } else {
    var normalizedName = normalize(name);
    if (Array.isArray(val)) {
      // Support values array created by autoprefixer, e.g.
      // {display: ["-webkit-box", "-ms-flexbox", "flex"]}
      // Set them one by one, and the browser will only set those it can recognize
      for (var i = 0, len = val.length; i < len; i++) {
        el.style[normalizedName] = val[i];
      }
    } else {
      el.style[normalizedName] = val;
    }
  }
};

var vendorNames = ['Webkit', 'Moz', 'ms'];

var emptyStyle;
var normalize = cached(function (prop) {
  emptyStyle = emptyStyle || document.createElement('div').style;
  prop = camelize(prop);
  if (prop !== 'filter' && (prop in emptyStyle)) {
    return prop
  }
  var capName = prop.charAt(0).toUpperCase() + prop.slice(1);
  for (var i = 0; i < vendorNames.length; i++) {
    var name = vendorNames[i] + capName;
    if (name in emptyStyle) {
      return name
    }
  }
});

function updateStyle (oldVnode, vnode) {
  var data = vnode.data;
  var oldData = oldVnode.data;

  if (isUndef(data.staticStyle) && isUndef(data.style) &&
    isUndef(oldData.staticStyle) && isUndef(oldData.style)
  ) {
    return
  }

  var cur, name;
  var el = vnode.elm;
  var oldStaticStyle = oldData.staticStyle;
  var oldStyleBinding = oldData.normalizedStyle || oldData.style || {};

  // if static style exists, stylebinding already merged into it when doing normalizeStyleData
  var oldStyle = oldStaticStyle || oldStyleBinding;

  var style = normalizeStyleBinding(vnode.data.style) || {};

  // store normalized style under a different key for next diff
  // make sure to clone it if it's reactive, since the user likely wants
  // to mutate it.
  vnode.data.normalizedStyle = isDef(style.__ob__)
    ? extend({}, style)
    : style;

  var newStyle = getStyle(vnode, true);

  for (name in oldStyle) {
    if (isUndef(newStyle[name])) {
      setProp(el, name, '');
    }
  }
  for (name in newStyle) {
    cur = newStyle[name];
    if (cur !== oldStyle[name]) {
      // ie9 setting to null has no effect, must use empty string
      setProp(el, name, cur == null ? '' : cur);
    }
  }
}

var style = {
  create: updateStyle,
  update: updateStyle
};

/*  */

/**
 * Add class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function addClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.add(c); });
    } else {
      el.classList.add(cls);
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    if (cur.indexOf(' ' + cls + ' ') < 0) {
      el.setAttribute('class', (cur + cls).trim());
    }
  }
}

/**
 * Remove class with compatibility for SVG since classList is not supported on
 * SVG elements in IE
 */
function removeClass (el, cls) {
  /* istanbul ignore if */
  if (!cls || !(cls = cls.trim())) {
    return
  }

  /* istanbul ignore else */
  if (el.classList) {
    if (cls.indexOf(' ') > -1) {
      cls.split(/\s+/).forEach(function (c) { return el.classList.remove(c); });
    } else {
      el.classList.remove(cls);
    }
    if (!el.classList.length) {
      el.removeAttribute('class');
    }
  } else {
    var cur = " " + (el.getAttribute('class') || '') + " ";
    var tar = ' ' + cls + ' ';
    while (cur.indexOf(tar) >= 0) {
      cur = cur.replace(tar, ' ');
    }
    cur = cur.trim();
    if (cur) {
      el.setAttribute('class', cur);
    } else {
      el.removeAttribute('class');
    }
  }
}

/*  */

function resolveTransition (def) {
  if (!def) {
    return
  }
  /* istanbul ignore else */
  if (typeof def === 'object') {
    var res = {};
    if (def.css !== false) {
      extend(res, autoCssTransition(def.name || 'v'));
    }
    extend(res, def);
    return res
  } else if (typeof def === 'string') {
    return autoCssTransition(def)
  }
}

var autoCssTransition = cached(function (name) {
  return {
    enterClass: (name + "-enter"),
    enterToClass: (name + "-enter-to"),
    enterActiveClass: (name + "-enter-active"),
    leaveClass: (name + "-leave"),
    leaveToClass: (name + "-leave-to"),
    leaveActiveClass: (name + "-leave-active")
  }
});

var hasTransition = inBrowser && !isIE9;
var TRANSITION = 'transition';
var ANIMATION = 'animation';

// Transition property/event sniffing
var transitionProp = 'transition';
var transitionEndEvent = 'transitionend';
var animationProp = 'animation';
var animationEndEvent = 'animationend';
if (hasTransition) {
  /* istanbul ignore if */
  if (window.ontransitionend === undefined &&
    window.onwebkittransitionend !== undefined
  ) {
    transitionProp = 'WebkitTransition';
    transitionEndEvent = 'webkitTransitionEnd';
  }
  if (window.onanimationend === undefined &&
    window.onwebkitanimationend !== undefined
  ) {
    animationProp = 'WebkitAnimation';
    animationEndEvent = 'webkitAnimationEnd';
  }
}

// binding to window is necessary to make hot reload work in IE in strict mode
var raf = inBrowser
  ? window.requestAnimationFrame
    ? window.requestAnimationFrame.bind(window)
    : setTimeout
  : /* istanbul ignore next */ function (fn) { return fn(); };

function nextFrame (fn) {
  raf(function () {
    raf(fn);
  });
}

function addTransitionClass (el, cls) {
  var transitionClasses = el._transitionClasses || (el._transitionClasses = []);
  if (transitionClasses.indexOf(cls) < 0) {
    transitionClasses.push(cls);
    addClass(el, cls);
  }
}

function removeTransitionClass (el, cls) {
  if (el._transitionClasses) {
    remove(el._transitionClasses, cls);
  }
  removeClass(el, cls);
}

function whenTransitionEnds (
  el,
  expectedType,
  cb
) {
  var ref = getTransitionInfo(el, expectedType);
  var type = ref.type;
  var timeout = ref.timeout;
  var propCount = ref.propCount;
  if (!type) { return cb() }
  var event = type === TRANSITION ? transitionEndEvent : animationEndEvent;
  var ended = 0;
  var end = function () {
    el.removeEventListener(event, onEnd);
    cb();
  };
  var onEnd = function (e) {
    if (e.target === el) {
      if (++ended >= propCount) {
        end();
      }
    }
  };
  setTimeout(function () {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(event, onEnd);
}

var transformRE = /\b(transform|all)(,|$)/;

function getTransitionInfo (el, expectedType) {
  var styles = window.getComputedStyle(el);
  var transitionDelays = styles[transitionProp + 'Delay'].split(', ');
  var transitionDurations = styles[transitionProp + 'Duration'].split(', ');
  var transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  var animationDelays = styles[animationProp + 'Delay'].split(', ');
  var animationDurations = styles[animationProp + 'Duration'].split(', ');
  var animationTimeout = getTimeout(animationDelays, animationDurations);

  var type;
  var timeout = 0;
  var propCount = 0;
  /* istanbul ignore if */
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0
      ? transitionTimeout > animationTimeout
        ? TRANSITION
        : ANIMATION
      : null;
    propCount = type
      ? type === TRANSITION
        ? transitionDurations.length
        : animationDurations.length
      : 0;
  }
  var hasTransform =
    type === TRANSITION &&
    transformRE.test(styles[transitionProp + 'Property']);
  return {
    type: type,
    timeout: timeout,
    propCount: propCount,
    hasTransform: hasTransform
  }
}

function getTimeout (delays, durations) {
  /* istanbul ignore next */
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }

  return Math.max.apply(null, durations.map(function (d, i) {
    return toMs(d) + toMs(delays[i])
  }))
}

function toMs (s) {
  return Number(s.slice(0, -1)) * 1000
}

/*  */

function enter (vnode, toggleDisplay) {
  var el = vnode.elm;

  // call leave callback now
  if (isDef(el._leaveCb)) {
    el._leaveCb.cancelled = true;
    el._leaveCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data)) {
    return
  }

  /* istanbul ignore if */
  if (isDef(el._enterCb) || el.nodeType !== 1) {
    return
  }

  var css = data.css;
  var type = data.type;
  var enterClass = data.enterClass;
  var enterToClass = data.enterToClass;
  var enterActiveClass = data.enterActiveClass;
  var appearClass = data.appearClass;
  var appearToClass = data.appearToClass;
  var appearActiveClass = data.appearActiveClass;
  var beforeEnter = data.beforeEnter;
  var enter = data.enter;
  var afterEnter = data.afterEnter;
  var enterCancelled = data.enterCancelled;
  var beforeAppear = data.beforeAppear;
  var appear = data.appear;
  var afterAppear = data.afterAppear;
  var appearCancelled = data.appearCancelled;
  var duration = data.duration;

  // activeInstance will always be the <transition> component managing this
  // transition. One edge case to check is when the <transition> is placed
  // as the root node of a child component. In that case we need to check
  // <transition>'s parent for appear check.
  var context = activeInstance;
  var transitionNode = activeInstance.$vnode;
  while (transitionNode && transitionNode.parent) {
    transitionNode = transitionNode.parent;
    context = transitionNode.context;
  }

  var isAppear = !context._isMounted || !vnode.isRootInsert;

  if (isAppear && !appear && appear !== '') {
    return
  }

  var startClass = isAppear && appearClass
    ? appearClass
    : enterClass;
  var activeClass = isAppear && appearActiveClass
    ? appearActiveClass
    : enterActiveClass;
  var toClass = isAppear && appearToClass
    ? appearToClass
    : enterToClass;

  var beforeEnterHook = isAppear
    ? (beforeAppear || beforeEnter)
    : beforeEnter;
  var enterHook = isAppear
    ? (typeof appear === 'function' ? appear : enter)
    : enter;
  var afterEnterHook = isAppear
    ? (afterAppear || afterEnter)
    : afterEnter;
  var enterCancelledHook = isAppear
    ? (appearCancelled || enterCancelled)
    : enterCancelled;

  var explicitEnterDuration = toNumber(
    isObject(duration)
      ? duration.enter
      : duration
  );

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(enterHook);

  var cb = el._enterCb = once(function () {
    if (expectsCSS) {
      removeTransitionClass(el, toClass);
      removeTransitionClass(el, activeClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, startClass);
      }
      enterCancelledHook && enterCancelledHook(el);
    } else {
      afterEnterHook && afterEnterHook(el);
    }
    el._enterCb = null;
  });

  if (!vnode.data.show) {
    // remove pending leave element on enter by injecting an insert hook
    mergeVNodeHook(vnode, 'insert', function () {
      var parent = el.parentNode;
      var pendingNode = parent && parent._pending && parent._pending[vnode.key];
      if (pendingNode &&
        pendingNode.tag === vnode.tag &&
        pendingNode.elm._leaveCb
      ) {
        pendingNode.elm._leaveCb();
      }
      enterHook && enterHook(el, cb);
    });
  }

  // start enter transition
  beforeEnterHook && beforeEnterHook(el);
  if (expectsCSS) {
    addTransitionClass(el, startClass);
    addTransitionClass(el, activeClass);
    nextFrame(function () {
      removeTransitionClass(el, startClass);
      if (!cb.cancelled) {
        addTransitionClass(el, toClass);
        if (!userWantsControl) {
          if (isValidDuration(explicitEnterDuration)) {
            setTimeout(cb, explicitEnterDuration);
          } else {
            whenTransitionEnds(el, type, cb);
          }
        }
      }
    });
  }

  if (vnode.data.show) {
    toggleDisplay && toggleDisplay();
    enterHook && enterHook(el, cb);
  }

  if (!expectsCSS && !userWantsControl) {
    cb();
  }
}

function leave (vnode, rm) {
  var el = vnode.elm;

  // call enter callback now
  if (isDef(el._enterCb)) {
    el._enterCb.cancelled = true;
    el._enterCb();
  }

  var data = resolveTransition(vnode.data.transition);
  if (isUndef(data) || el.nodeType !== 1) {
    return rm()
  }

  /* istanbul ignore if */
  if (isDef(el._leaveCb)) {
    return
  }

  var css = data.css;
  var type = data.type;
  var leaveClass = data.leaveClass;
  var leaveToClass = data.leaveToClass;
  var leaveActiveClass = data.leaveActiveClass;
  var beforeLeave = data.beforeLeave;
  var leave = data.leave;
  var afterLeave = data.afterLeave;
  var leaveCancelled = data.leaveCancelled;
  var delayLeave = data.delayLeave;
  var duration = data.duration;

  var expectsCSS = css !== false && !isIE9;
  var userWantsControl = getHookArgumentsLength(leave);

  var explicitLeaveDuration = toNumber(
    isObject(duration)
      ? duration.leave
      : duration
  );

  var cb = el._leaveCb = once(function () {
    if (el.parentNode && el.parentNode._pending) {
      el.parentNode._pending[vnode.key] = null;
    }
    if (expectsCSS) {
      removeTransitionClass(el, leaveToClass);
      removeTransitionClass(el, leaveActiveClass);
    }
    if (cb.cancelled) {
      if (expectsCSS) {
        removeTransitionClass(el, leaveClass);
      }
      leaveCancelled && leaveCancelled(el);
    } else {
      rm();
      afterLeave && afterLeave(el);
    }
    el._leaveCb = null;
  });

  if (delayLeave) {
    delayLeave(performLeave);
  } else {
    performLeave();
  }

  function performLeave () {
    // the delayed leave may have already been cancelled
    if (cb.cancelled) {
      return
    }
    // record leaving element
    if (!vnode.data.show) {
      (el.parentNode._pending || (el.parentNode._pending = {}))[(vnode.key)] = vnode;
    }
    beforeLeave && beforeLeave(el);
    if (expectsCSS) {
      addTransitionClass(el, leaveClass);
      addTransitionClass(el, leaveActiveClass);
      nextFrame(function () {
        removeTransitionClass(el, leaveClass);
        if (!cb.cancelled) {
          addTransitionClass(el, leaveToClass);
          if (!userWantsControl) {
            if (isValidDuration(explicitLeaveDuration)) {
              setTimeout(cb, explicitLeaveDuration);
            } else {
              whenTransitionEnds(el, type, cb);
            }
          }
        }
      });
    }
    leave && leave(el, cb);
    if (!expectsCSS && !userWantsControl) {
      cb();
    }
  }
}

function isValidDuration (val) {
  return typeof val === 'number' && !isNaN(val)
}

/**
 * Normalize a transition hook's argument length. The hook may be:
 * - a merged hook (invoker) with the original in .fns
 * - a wrapped component method (check ._length)
 * - a plain function (.length)
 */
function getHookArgumentsLength (fn) {
  if (isUndef(fn)) {
    return false
  }
  var invokerFns = fn.fns;
  if (isDef(invokerFns)) {
    // invoker
    return getHookArgumentsLength(
      Array.isArray(invokerFns)
        ? invokerFns[0]
        : invokerFns
    )
  } else {
    return (fn._length || fn.length) > 1
  }
}

function _enter (_, vnode) {
  if (vnode.data.show !== true) {
    enter(vnode);
  }
}

var transition = inBrowser ? {
  create: _enter,
  activate: _enter,
  remove: function remove$$1 (vnode, rm) {
    /* istanbul ignore else */
    if (vnode.data.show !== true) {
      leave(vnode, rm);
    } else {
      rm();
    }
  }
} : {};

var platformModules = [
  attrs,
  klass,
  events,
  domProps,
  style,
  transition
];

/*  */

// the directive module should be applied last, after all
// built-in modules have been applied.
var modules = platformModules.concat(baseModules);

var patch = createPatchFunction({ nodeOps: nodeOps, modules: modules });

/**
 * Not type checking this file because flow doesn't like attaching
 * properties to Elements.
 */

/* istanbul ignore if */
if (isIE9) {
  // http://www.matts411.com/post/internet-explorer-9-oninput/
  document.addEventListener('selectionchange', function () {
    var el = document.activeElement;
    if (el && el.vmodel) {
      trigger(el, 'input');
    }
  });
}

var directive = {
  inserted: function inserted (el, binding, vnode, oldVnode) {
    if (vnode.tag === 'select') {
      // #6903
      if (oldVnode.elm && !oldVnode.elm._vOptions) {
        mergeVNodeHook(vnode, 'postpatch', function () {
          directive.componentUpdated(el, binding, vnode);
        });
      } else {
        setSelected(el, binding, vnode.context);
      }
      el._vOptions = [].map.call(el.options, getValue);
    } else if (vnode.tag === 'textarea' || isTextInputType(el.type)) {
      el._vModifiers = binding.modifiers;
      if (!binding.modifiers.lazy) {
        el.addEventListener('compositionstart', onCompositionStart);
        el.addEventListener('compositionend', onCompositionEnd);
        // Safari < 10.2 & UIWebView doesn't fire compositionend when
        // switching focus before confirming composition choice
        // this also fixes the issue where some browsers e.g. iOS Chrome
        // fires "change" instead of "input" on autocomplete.
        el.addEventListener('change', onCompositionEnd);
        /* istanbul ignore if */
        if (isIE9) {
          el.vmodel = true;
        }
      }
    }
  },

  componentUpdated: function componentUpdated (el, binding, vnode) {
    if (vnode.tag === 'select') {
      setSelected(el, binding, vnode.context);
      // in case the options rendered by v-for have changed,
      // it's possible that the value is out-of-sync with the rendered options.
      // detect such cases and filter out values that no longer has a matching
      // option in the DOM.
      var prevOptions = el._vOptions;
      var curOptions = el._vOptions = [].map.call(el.options, getValue);
      if (curOptions.some(function (o, i) { return !looseEqual(o, prevOptions[i]); })) {
        // trigger change event if
        // no matching option found for at least one value
        var needReset = el.multiple
          ? binding.value.some(function (v) { return hasNoMatchingOption(v, curOptions); })
          : binding.value !== binding.oldValue && hasNoMatchingOption(binding.value, curOptions);
        if (needReset) {
          trigger(el, 'change');
        }
      }
    }
  }
};

function setSelected (el, binding, vm) {
  actuallySetSelected(el, binding, vm);
  /* istanbul ignore if */
  if (isIE || isEdge) {
    setTimeout(function () {
      actuallySetSelected(el, binding, vm);
    }, 0);
  }
}

function actuallySetSelected (el, binding, vm) {
  var value = binding.value;
  var isMultiple = el.multiple;
  if (isMultiple && !Array.isArray(value)) {
    return
  }
  var selected, option;
  for (var i = 0, l = el.options.length; i < l; i++) {
    option = el.options[i];
    if (isMultiple) {
      selected = looseIndexOf(value, getValue(option)) > -1;
      if (option.selected !== selected) {
        option.selected = selected;
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el.selectedIndex !== i) {
          el.selectedIndex = i;
        }
        return
      }
    }
  }
  if (!isMultiple) {
    el.selectedIndex = -1;
  }
}

function hasNoMatchingOption (value, options) {
  return options.every(function (o) { return !looseEqual(o, value); })
}

function getValue (option) {
  return '_value' in option
    ? option._value
    : option.value
}

function onCompositionStart (e) {
  e.target.composing = true;
}

function onCompositionEnd (e) {
  // prevent triggering an input event for no reason
  if (!e.target.composing) { return }
  e.target.composing = false;
  trigger(e.target, 'input');
}

function trigger (el, type) {
  var e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
}

/*  */

// recursively search for possible transition defined inside the component root
function locateNode (vnode) {
  return vnode.componentInstance && (!vnode.data || !vnode.data.transition)
    ? locateNode(vnode.componentInstance._vnode)
    : vnode
}

var show = {
  bind: function bind (el, ref, vnode) {
    var value = ref.value;

    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    var originalDisplay = el.__vOriginalDisplay =
      el.style.display === 'none' ? '' : el.style.display;
    if (value && transition$$1) {
      vnode.data.show = true;
      enter(vnode, function () {
        el.style.display = originalDisplay;
      });
    } else {
      el.style.display = value ? originalDisplay : 'none';
    }
  },

  update: function update (el, ref, vnode) {
    var value = ref.value;
    var oldValue = ref.oldValue;

    /* istanbul ignore if */
    if (!value === !oldValue) { return }
    vnode = locateNode(vnode);
    var transition$$1 = vnode.data && vnode.data.transition;
    if (transition$$1) {
      vnode.data.show = true;
      if (value) {
        enter(vnode, function () {
          el.style.display = el.__vOriginalDisplay;
        });
      } else {
        leave(vnode, function () {
          el.style.display = 'none';
        });
      }
    } else {
      el.style.display = value ? el.__vOriginalDisplay : 'none';
    }
  },

  unbind: function unbind (
    el,
    binding,
    vnode,
    oldVnode,
    isDestroy
  ) {
    if (!isDestroy) {
      el.style.display = el.__vOriginalDisplay;
    }
  }
};

var platformDirectives = {
  model: directive,
  show: show
};

/*  */

// Provides transition support for a single element/component.
// supports transition mode (out-in / in-out)

var transitionProps = {
  name: String,
  appear: Boolean,
  css: Boolean,
  mode: String,
  type: String,
  enterClass: String,
  leaveClass: String,
  enterToClass: String,
  leaveToClass: String,
  enterActiveClass: String,
  leaveActiveClass: String,
  appearClass: String,
  appearActiveClass: String,
  appearToClass: String,
  duration: [Number, String, Object]
};

// in case the child is also an abstract component, e.g. <keep-alive>
// we want to recursively retrieve the real component to be rendered
function getRealChild (vnode) {
  var compOptions = vnode && vnode.componentOptions;
  if (compOptions && compOptions.Ctor.options.abstract) {
    return getRealChild(getFirstComponentChild(compOptions.children))
  } else {
    return vnode
  }
}

function extractTransitionData (comp) {
  var data = {};
  var options = comp.$options;
  // props
  for (var key in options.propsData) {
    data[key] = comp[key];
  }
  // events.
  // extract listeners and pass them directly to the transition methods
  var listeners = options._parentListeners;
  for (var key$1 in listeners) {
    data[camelize(key$1)] = listeners[key$1];
  }
  return data
}

function placeholder (h, rawChild) {
  if (/\d-keep-alive$/.test(rawChild.tag)) {
    return h('keep-alive', {
      props: rawChild.componentOptions.propsData
    })
  }
}

function hasParentTransition (vnode) {
  while ((vnode = vnode.parent)) {
    if (vnode.data.transition) {
      return true
    }
  }
}

function isSameChild (child, oldChild) {
  return oldChild.key === child.key && oldChild.tag === child.tag
}

var Transition = {
  name: 'transition',
  props: transitionProps,
  abstract: true,

  render: function render (h) {
    var this$1 = this;

    var children = this.$slots.default;
    if (!children) {
      return
    }

    // filter out text nodes (possible whitespaces)
    children = children.filter(function (c) { return c.tag || isAsyncPlaceholder(c); });
    /* istanbul ignore if */
    if (!children.length) {
      return
    }

    var mode = this.mode;

    var rawChild = children[0];

    // if this is a component root node and the component's
    // parent container node also has transition, skip.
    if (hasParentTransition(this.$vnode)) {
      return rawChild
    }

    // apply transition data to child
    // use getRealChild() to ignore abstract components e.g. keep-alive
    var child = getRealChild(rawChild);
    /* istanbul ignore if */
    if (!child) {
      return rawChild
    }

    if (this._leaving) {
      return placeholder(h, rawChild)
    }

    // ensure a key that is unique to the vnode type and to this transition
    // component instance. This key will be used to remove pending leaving nodes
    // during entering.
    var id = "__transition-" + (this._uid) + "-";
    child.key = child.key == null
      ? child.isComment
        ? id + 'comment'
        : id + child.tag
      : isPrimitive(child.key)
        ? (String(child.key).indexOf(id) === 0 ? child.key : id + child.key)
        : child.key;

    var data = (child.data || (child.data = {})).transition = extractTransitionData(this);
    var oldRawChild = this._vnode;
    var oldChild = getRealChild(oldRawChild);

    // mark v-show
    // so that the transition module can hand over the control to the directive
    if (child.data.directives && child.data.directives.some(function (d) { return d.name === 'show'; })) {
      child.data.show = true;
    }

    if (
      oldChild &&
      oldChild.data &&
      !isSameChild(child, oldChild) &&
      !isAsyncPlaceholder(oldChild) &&
      // #6687 component root is a comment node
      !(oldChild.componentInstance && oldChild.componentInstance._vnode.isComment)
    ) {
      // replace old child transition data with fresh one
      // important for dynamic transitions!
      var oldData = oldChild.data.transition = extend({}, data);
      // handle transition mode
      if (mode === 'out-in') {
        // return placeholder node and queue update when leave finishes
        this._leaving = true;
        mergeVNodeHook(oldData, 'afterLeave', function () {
          this$1._leaving = false;
          this$1.$forceUpdate();
        });
        return placeholder(h, rawChild)
      } else if (mode === 'in-out') {
        if (isAsyncPlaceholder(child)) {
          return oldRawChild
        }
        var delayedLeave;
        var performLeave = function () { delayedLeave(); };
        mergeVNodeHook(data, 'afterEnter', performLeave);
        mergeVNodeHook(data, 'enterCancelled', performLeave);
        mergeVNodeHook(oldData, 'delayLeave', function (leave) { delayedLeave = leave; });
      }
    }

    return rawChild
  }
};

/*  */

// Provides transition support for list items.
// supports move transitions using the FLIP technique.

// Because the vdom's children update algorithm is "unstable" - i.e.
// it doesn't guarantee the relative positioning of removed elements,
// we force transition-group to update its children into two passes:
// in the first pass, we remove all nodes that need to be removed,
// triggering their leaving transition; in the second pass, we insert/move
// into the final desired state. This way in the second pass removed
// nodes will remain where they should be.

var props = extend({
  tag: String,
  moveClass: String
}, transitionProps);

delete props.mode;

var TransitionGroup = {
  props: props,

  render: function render (h) {
    var tag = this.tag || this.$vnode.data.tag || 'span';
    var map = Object.create(null);
    var prevChildren = this.prevChildren = this.children;
    var rawChildren = this.$slots.default || [];
    var children = this.children = [];
    var transitionData = extractTransitionData(this);

    for (var i = 0; i < rawChildren.length; i++) {
      var c = rawChildren[i];
      if (c.tag) {
        if (c.key != null && String(c.key).indexOf('__vlist') !== 0) {
          children.push(c);
          map[c.key] = c
          ;(c.data || (c.data = {})).transition = transitionData;
        }
      }
    }

    if (prevChildren) {
      var kept = [];
      var removed = [];
      for (var i$1 = 0; i$1 < prevChildren.length; i$1++) {
        var c$1 = prevChildren[i$1];
        c$1.data.transition = transitionData;
        c$1.data.pos = c$1.elm.getBoundingClientRect();
        if (map[c$1.key]) {
          kept.push(c$1);
        } else {
          removed.push(c$1);
        }
      }
      this.kept = h(tag, null, kept);
      this.removed = removed;
    }

    return h(tag, null, children)
  },

  beforeUpdate: function beforeUpdate () {
    // force removing pass
    this.__patch__(
      this._vnode,
      this.kept,
      false, // hydrating
      true // removeOnly (!important, avoids unnecessary moves)
    );
    this._vnode = this.kept;
  },

  updated: function updated () {
    var children = this.prevChildren;
    var moveClass = this.moveClass || ((this.name || 'v') + '-move');
    if (!children.length || !this.hasMove(children[0].elm, moveClass)) {
      return
    }

    // we divide the work into three loops to avoid mixing DOM reads and writes
    // in each iteration - which helps prevent layout thrashing.
    children.forEach(callPendingCbs);
    children.forEach(recordPosition);
    children.forEach(applyTranslation);

    // force reflow to put everything in position
    // assign to this to avoid being removed in tree-shaking
    // $flow-disable-line
    this._reflow = document.body.offsetHeight;

    children.forEach(function (c) {
      if (c.data.moved) {
        var el = c.elm;
        var s = el.style;
        addTransitionClass(el, moveClass);
        s.transform = s.WebkitTransform = s.transitionDuration = '';
        el.addEventListener(transitionEndEvent, el._moveCb = function cb (e) {
          if (!e || /transform$/.test(e.propertyName)) {
            el.removeEventListener(transitionEndEvent, cb);
            el._moveCb = null;
            removeTransitionClass(el, moveClass);
          }
        });
      }
    });
  },

  methods: {
    hasMove: function hasMove (el, moveClass) {
      /* istanbul ignore if */
      if (!hasTransition) {
        return false
      }
      /* istanbul ignore if */
      if (this._hasMove) {
        return this._hasMove
      }
      // Detect whether an element with the move class applied has
      // CSS transitions. Since the element may be inside an entering
      // transition at this very moment, we make a clone of it and remove
      // all other transition classes applied to ensure only the move class
      // is applied.
      var clone = el.cloneNode();
      if (el._transitionClasses) {
        el._transitionClasses.forEach(function (cls) { removeClass(clone, cls); });
      }
      addClass(clone, moveClass);
      clone.style.display = 'none';
      this.$el.appendChild(clone);
      var info = getTransitionInfo(clone);
      this.$el.removeChild(clone);
      return (this._hasMove = info.hasTransform)
    }
  }
};

function callPendingCbs (c) {
  /* istanbul ignore if */
  if (c.elm._moveCb) {
    c.elm._moveCb();
  }
  /* istanbul ignore if */
  if (c.elm._enterCb) {
    c.elm._enterCb();
  }
}

function recordPosition (c) {
  c.data.newPos = c.elm.getBoundingClientRect();
}

function applyTranslation (c) {
  var oldPos = c.data.pos;
  var newPos = c.data.newPos;
  var dx = oldPos.left - newPos.left;
  var dy = oldPos.top - newPos.top;
  if (dx || dy) {
    c.data.moved = true;
    var s = c.elm.style;
    s.transform = s.WebkitTransform = "translate(" + dx + "px," + dy + "px)";
    s.transitionDuration = '0s';
  }
}

var platformComponents = {
  Transition: Transition,
  TransitionGroup: TransitionGroup
};

/*  */

// install platform specific utils
Vue.config.mustUseProp = mustUseProp;
Vue.config.isReservedTag = isReservedTag;
Vue.config.isReservedAttr = isReservedAttr;
Vue.config.getTagNamespace = getTagNamespace;
Vue.config.isUnknownElement = isUnknownElement;

// install platform runtime directives & components
extend(Vue.options.directives, platformDirectives);
extend(Vue.options.components, platformComponents);

// install platform patch function
Vue.prototype.__patch__ = inBrowser ? patch : noop;

// public mount method
Vue.prototype.$mount = function (
  el,
  hydrating
) {
  el = el && inBrowser ? query(el) : undefined;
  return mountComponent(this, el, hydrating)
};

// devtools global hook
/* istanbul ignore next */
if (inBrowser) {
  setTimeout(function () {
    if (config.devtools) {
      if (devtools) {
        devtools.emit('init', Vue);
      }
    }
  }, 0);
}

var version = "1.6.8";
var country_calling_codes = {
	"1": [
		"US",
		"AG",
		"AI",
		"AS",
		"BB",
		"BM",
		"BS",
		"CA",
		"DM",
		"DO",
		"GD",
		"GU",
		"JM",
		"KN",
		"KY",
		"LC",
		"MP",
		"MS",
		"PR",
		"SX",
		"TC",
		"TT",
		"VC",
		"VG",
		"VI"
	],
	"7": [
		"RU",
		"KZ"
	],
	"20": [
		"EG"
	],
	"27": [
		"ZA"
	],
	"30": [
		"GR"
	],
	"31": [
		"NL"
	],
	"32": [
		"BE"
	],
	"33": [
		"FR"
	],
	"34": [
		"ES"
	],
	"36": [
		"HU"
	],
	"39": [
		"IT",
		"VA"
	],
	"40": [
		"RO"
	],
	"41": [
		"CH"
	],
	"43": [
		"AT"
	],
	"44": [
		"GB",
		"GG",
		"IM",
		"JE"
	],
	"45": [
		"DK"
	],
	"46": [
		"SE"
	],
	"47": [
		"NO",
		"SJ"
	],
	"48": [
		"PL"
	],
	"49": [
		"DE"
	],
	"51": [
		"PE"
	],
	"52": [
		"MX"
	],
	"53": [
		"CU"
	],
	"54": [
		"AR"
	],
	"55": [
		"BR"
	],
	"56": [
		"CL"
	],
	"57": [
		"CO"
	],
	"58": [
		"VE"
	],
	"60": [
		"MY"
	],
	"61": [
		"AU",
		"CC",
		"CX"
	],
	"62": [
		"ID"
	],
	"63": [
		"PH"
	],
	"64": [
		"NZ"
	],
	"65": [
		"SG"
	],
	"66": [
		"TH"
	],
	"81": [
		"JP"
	],
	"82": [
		"KR"
	],
	"84": [
		"VN"
	],
	"86": [
		"CN"
	],
	"90": [
		"TR"
	],
	"91": [
		"IN"
	],
	"92": [
		"PK"
	],
	"93": [
		"AF"
	],
	"94": [
		"LK"
	],
	"95": [
		"MM"
	],
	"98": [
		"IR"
	],
	"211": [
		"SS"
	],
	"212": [
		"MA",
		"EH"
	],
	"213": [
		"DZ"
	],
	"216": [
		"TN"
	],
	"218": [
		"LY"
	],
	"220": [
		"GM"
	],
	"221": [
		"SN"
	],
	"222": [
		"MR"
	],
	"223": [
		"ML"
	],
	"224": [
		"GN"
	],
	"225": [
		"CI"
	],
	"226": [
		"BF"
	],
	"227": [
		"NE"
	],
	"228": [
		"TG"
	],
	"229": [
		"BJ"
	],
	"230": [
		"MU"
	],
	"231": [
		"LR"
	],
	"232": [
		"SL"
	],
	"233": [
		"GH"
	],
	"234": [
		"NG"
	],
	"235": [
		"TD"
	],
	"236": [
		"CF"
	],
	"237": [
		"CM"
	],
	"238": [
		"CV"
	],
	"239": [
		"ST"
	],
	"240": [
		"GQ"
	],
	"241": [
		"GA"
	],
	"242": [
		"CG"
	],
	"243": [
		"CD"
	],
	"244": [
		"AO"
	],
	"245": [
		"GW"
	],
	"246": [
		"IO"
	],
	"247": [
		"AC"
	],
	"248": [
		"SC"
	],
	"249": [
		"SD"
	],
	"250": [
		"RW"
	],
	"251": [
		"ET"
	],
	"252": [
		"SO"
	],
	"253": [
		"DJ"
	],
	"254": [
		"KE"
	],
	"255": [
		"TZ"
	],
	"256": [
		"UG"
	],
	"257": [
		"BI"
	],
	"258": [
		"MZ"
	],
	"260": [
		"ZM"
	],
	"261": [
		"MG"
	],
	"262": [
		"RE",
		"YT"
	],
	"263": [
		"ZW"
	],
	"264": [
		"NA"
	],
	"265": [
		"MW"
	],
	"266": [
		"LS"
	],
	"267": [
		"BW"
	],
	"268": [
		"SZ"
	],
	"269": [
		"KM"
	],
	"290": [
		"SH",
		"TA"
	],
	"291": [
		"ER"
	],
	"297": [
		"AW"
	],
	"298": [
		"FO"
	],
	"299": [
		"GL"
	],
	"350": [
		"GI"
	],
	"351": [
		"PT"
	],
	"352": [
		"LU"
	],
	"353": [
		"IE"
	],
	"354": [
		"IS"
	],
	"355": [
		"AL"
	],
	"356": [
		"MT"
	],
	"357": [
		"CY"
	],
	"358": [
		"FI",
		"AX"
	],
	"359": [
		"BG"
	],
	"370": [
		"LT"
	],
	"371": [
		"LV"
	],
	"372": [
		"EE"
	],
	"373": [
		"MD"
	],
	"374": [
		"AM"
	],
	"375": [
		"BY"
	],
	"376": [
		"AD"
	],
	"377": [
		"MC"
	],
	"378": [
		"SM"
	],
	"380": [
		"UA"
	],
	"381": [
		"RS"
	],
	"382": [
		"ME"
	],
	"383": [
		"XK"
	],
	"385": [
		"HR"
	],
	"386": [
		"SI"
	],
	"387": [
		"BA"
	],
	"389": [
		"MK"
	],
	"420": [
		"CZ"
	],
	"421": [
		"SK"
	],
	"423": [
		"LI"
	],
	"500": [
		"FK"
	],
	"501": [
		"BZ"
	],
	"502": [
		"GT"
	],
	"503": [
		"SV"
	],
	"504": [
		"HN"
	],
	"505": [
		"NI"
	],
	"506": [
		"CR"
	],
	"507": [
		"PA"
	],
	"508": [
		"PM"
	],
	"509": [
		"HT"
	],
	"590": [
		"GP",
		"BL",
		"MF"
	],
	"591": [
		"BO"
	],
	"592": [
		"GY"
	],
	"593": [
		"EC"
	],
	"594": [
		"GF"
	],
	"595": [
		"PY"
	],
	"596": [
		"MQ"
	],
	"597": [
		"SR"
	],
	"598": [
		"UY"
	],
	"599": [
		"CW",
		"BQ"
	],
	"670": [
		"TL"
	],
	"672": [
		"NF"
	],
	"673": [
		"BN"
	],
	"674": [
		"NR"
	],
	"675": [
		"PG"
	],
	"676": [
		"TO"
	],
	"677": [
		"SB"
	],
	"678": [
		"VU"
	],
	"679": [
		"FJ"
	],
	"680": [
		"PW"
	],
	"681": [
		"WF"
	],
	"682": [
		"CK"
	],
	"683": [
		"NU"
	],
	"685": [
		"WS"
	],
	"686": [
		"KI"
	],
	"687": [
		"NC"
	],
	"688": [
		"TV"
	],
	"689": [
		"PF"
	],
	"690": [
		"TK"
	],
	"691": [
		"FM"
	],
	"692": [
		"MH"
	],
	"800": [
		"001"
	],
	"808": [
		"001"
	],
	"850": [
		"KP"
	],
	"852": [
		"HK"
	],
	"853": [
		"MO"
	],
	"855": [
		"KH"
	],
	"856": [
		"LA"
	],
	"870": [
		"001"
	],
	"878": [
		"001"
	],
	"880": [
		"BD"
	],
	"881": [
		"001"
	],
	"882": [
		"001"
	],
	"883": [
		"001"
	],
	"886": [
		"TW"
	],
	"888": [
		"001"
	],
	"960": [
		"MV"
	],
	"961": [
		"LB"
	],
	"962": [
		"JO"
	],
	"963": [
		"SY"
	],
	"964": [
		"IQ"
	],
	"965": [
		"KW"
	],
	"966": [
		"SA"
	],
	"967": [
		"YE"
	],
	"968": [
		"OM"
	],
	"970": [
		"PS"
	],
	"971": [
		"AE"
	],
	"972": [
		"IL"
	],
	"973": [
		"BH"
	],
	"974": [
		"QA"
	],
	"975": [
		"BT"
	],
	"976": [
		"MN"
	],
	"977": [
		"NP"
	],
	"979": [
		"001"
	],
	"992": [
		"TJ"
	],
	"993": [
		"TM"
	],
	"994": [
		"AZ"
	],
	"995": [
		"GE"
	],
	"996": [
		"KG"
	],
	"998": [
		"UZ"
	]
};
var countries = {
	AC: [
		"247",
		"00",
		"(?:[01589]\\d|[46])\\d{4}",
		[
			5,
			6
		]
	],
	AD: [
		"376",
		"00",
		"(?:1|6\\d)\\d{7}|[136-9]\\d{5}",
		[
			6,
			8,
			9
		],
		[
			[
				"(\\d{3})(\\d{3})",
				"$1 $2",
				[
					"[136-9]"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"1"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"6"
				]
			]
		]
	],
	AE: [
		"971",
		"00",
		"(?:[4-7]\\d|9[0-689])\\d{7}|800\\d{2,9}|[2-4679]\\d{7}",
		[
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12
		],
		[
			[
				"(\\d{3})(\\d{2,9})",
				"$1 $2",
				[
					"[68]00",
					"600[25]|800"
				]
			],
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[236]|[479][2-8]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"5"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d)(\\d{5})",
				"$1 $2 $3",
				[
					"[479]"
				]
			]
		],
		"0"
	],
	AF: [
		"93",
		"00",
		"[2-7]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[2-7]"
				],
				"0$1"
			]
		],
		"0"
	],
	AG: [
		"1",
		"011",
		"(?:268|[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"268"
	],
	AI: [
		"1",
		"011",
		"(?:264|[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"264"
	],
	AL: [
		"355",
		"00",
		"(?:(?:[2-58]|6\\d)\\d\\d|700)\\d{5}|(?:8\\d{2,3}|900)\\d{3}",
		[
			6,
			7,
			8,
			9
		],
		[
			[
				"(\\d{3})(\\d{3,4})",
				"$1 $2",
				[
					"80[08]|900",
					"80(?:0|8[1-9])|900[1-9]"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"4[2-6]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[2358][2-5]|4"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"[23578]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"6"
				],
				"0$1"
			]
		],
		"0"
	],
	AM: [
		"374",
		"00",
		"(?:[1-489]\\d|55|60|77)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{6})",
				"$1 $2",
				[
					"1|47"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"[23]"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{6})",
				"$1 $2",
				[
					"[4-7]|88|9[13-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"[89]"
				],
				"0 $1"
			]
		],
		"0"
	],
	AO: [
		"244",
		"00",
		"[29]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[29]"
				]
			]
		]
	],
	AR: [
		"54",
		"00",
		"(?:11|(?:[2368]|9\\d)\\d)\\d{8}",
		[
			10,
			11
		],
		[
			[
				"([68]\\d{2})(\\d{3})(\\d{4})",
				"$1-$2-$3",
				[
					"[68]"
				]
			],
			[
				"(9)(11)(\\d{4})(\\d{4})",
				"$2 15-$3-$4",
				[
					"911"
				],
				0,
				0,
				"$1 $2 $3-$4"
			],
			[
				"(9)(\\d{3})(\\d{3})(\\d{4})",
				"$2 15-$3-$4",
				[
					"9(?:2[2-4689]|3[3-8])",
					"9(?:2(?:2[013]|3[067]|49|6[01346]|8|9[147-9])|3(?:36|4[1-358]|5[138]|6|7[069]|8[013578]))",
					"9(?:2(?:2(?:0[013-9]|[13])|3(?:0[013-9]|[67])|49|6(?:[0136]|4[0-59])|8|9(?:[19]|44|7[013-9]|8[14]))|3(?:36|4(?:[12]|3[4-6]|[58]4)|5(?:1|3[0-24-689]|8[46])|6|7[069]|8(?:[01]|34|[578][45])))",
					"9(?:2(?:2(?:0[013-9]|[13])|3(?:0[013-9]|[67])|49|6(?:[0136]|4[0-59])|8|9(?:[19]|44|7[013-9]|8[14]))|3(?:36|4(?:[12]|3(?:4|5[014]|6[1-39])|[58]4)|5(?:1|3[0-24-689]|8[46])|6|7[069]|8(?:[01]|34|[578][45])))"
				],
				0,
				0,
				"$1 $2 $3-$4"
			],
			[
				"(9)(\\d{4})(\\d{2})(\\d{4})",
				"$2 15-$3-$4",
				[
					"9[23]"
				],
				0,
				0,
				"$1 $2 $3-$4"
			],
			[
				"(11)(\\d{4})(\\d{4})",
				"$1 $2-$3",
				[
					"11"
				],
				0,
				1
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2-$3",
				[
					"2(?:2[013]|3[067]|49|6[01346]|8|9[147-9])|3(?:36|4[1-358]|5[138]|6|7[069]|8[013578])",
					"2(?:2(?:0[013-9]|[13])|3(?:0[013-9]|[67])|49|6(?:[0136]|4[0-59])|8|9(?:[19]|44|7[013-9]|8[14]))|3(?:36|4(?:[12]|3[4-6]|[58]4)|5(?:1|3[0-24-689]|8[46])|6|7[069]|8(?:[01]|34|[578][45]))",
					"2(?:2(?:0[013-9]|[13])|3(?:0[013-9]|[67])|49|6(?:[0136]|4[0-59])|8|9(?:[19]|44|7[013-9]|8[14]))|3(?:36|4(?:[12]|3(?:4|5[014]|6[1-39])|[58]4)|5(?:1|3[0-24-689]|8[46])|6|7[069]|8(?:[01]|34|[578][45]))"
				],
				0,
				1
			],
			[
				"(\\d{4})(\\d{2})(\\d{4})",
				"$1 $2-$3",
				[
					"[23]"
				],
				0,
				1
			]
		],
		"0",
		"0$1",
		"0?(?:(11|2(?:2(?:02?|[13]|2[13-79]|4[1-6]|5[2457]|6[124-8]|7[1-4]|8[13-6]|9[1267])|3(?:02?|1[467]|2[03-6]|3[13-8]|[49][2-6]|5[2-8]|[67])|4(?:7[3-578]|9)|6(?:[0136]|2[24-6]|4[6-8]?|5[15-8])|80|9(?:0[1-3]|[19]|2\\d|3[1-6]|4[02568]?|5[2-4]|6[2-46]|72?|8[23]?))|3(?:3(?:2[79]|6|8[2578])|4(?:0[0-24-9]|[12]|3[5-8]?|4[24-7]|5[4-68]?|6[02-9]|7[126]|8[2379]?|9[1-36-8])|5(?:1|2[1245]|3[237]?|4[1-46-9]|6[2-4]|7[1-6]|8[2-5]?)|6[24]|7(?:[069]|1[1568]|2[15]|3[145]|4[13]|5[14-8]|7[2-57]|8[126])|8(?:[01]|2[15-7]|3[2578]?|4[13-6]|5[4-8]?|6[1-357-9]|7[36-8]?|8[5-8]?|9[124])))?15)?",
		"9$1"
	],
	AS: [
		"1",
		"011",
		"(?:[58]\\d\\d|684|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"684"
	],
	AT: [
		"43",
		"00",
		"[1-35-9]\\d{8,12}|4(?:[0-24-9]\\d{4,11}|3(?:(?:0\\d|5[02-9])\\d{3,9}|2\\d{4,5}|[3467]\\d{4}|8\\d{4,6}|9\\d{4,7}))|[1-35-8]\\d{7}|[1-35-7]\\d{6}|[135-7]\\d{5}|[15]\\d{4}|1\\d{3}",
		[
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13
		],
		[
			[
				"(\\d)(\\d{3,12})",
				"$1 $2",
				[
					"1(?:11|[2-9])"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})",
				"$1 $2",
				[
					"517"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3,5})",
				"$1 $2",
				[
					"5[079]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3,10})",
				"$1 $2",
				[
					"(?:31|4)6|51|6(?:5[0-3579]|[6-9])|7(?:20|32|8)|[89]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3,9})",
				"$1 $2",
				[
					"[2-467]|5[2-6]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"5"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4,7})",
				"$1 $2 $3",
				[
					"5"
				],
				"0$1"
			]
		],
		"0"
	],
	AU: [
		"61",
		"001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011",
		"1\\d{4,9}|(?:[2-478]\\d\\d|550)\\d{6}",
		[
			5,
			6,
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{3,4})",
				"$1 $2",
				[
					"16"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2,4})",
				"$1 $2 $3",
				[
					"16"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"[2378]"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"14|[45]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"1(?:30|[89])"
				]
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		[
			[
				"(?:[237]\\d{5}|8(?:51(?:0(?:0[03-9]|[1247]\\d|3[2-9]|5[0-8]|6[1-9]|8[0-6])|1(?:1[69]|[23]\\d|4[0-4]))|(?:[6-8]\\d{3}|9(?:[02-9]\\d\\d|1(?:[0-57-9]\\d|6[0135-9])))\\d))\\d{3}",
				[
					9
				]
			],
			[
				"4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[6-9]|7[02-9]|8[0-2457-9]|9[017-9])\\d{6}",
				[
					9
				]
			],
			[
				"180(?:0\\d{3}|2)\\d{3}",
				[
					7,
					10
				]
			],
			[
				"190[0-26]\\d{6}",
				[
					10
				]
			],
			0,
			0,
			0,
			[
				"16\\d{3,7}",
				[
					5,
					6,
					7,
					8,
					9
				]
			],
			[
				"(?:14(?:5\\d|71)|550\\d)\\d{5}",
				[
					9
				]
			],
			[
				"13(?:00\\d{3}|45[0-4])\\d{3}|13\\d{4}",
				[
					6,
					8,
					10
				]
			]
		],
		"0011"
	],
	AW: [
		"297",
		"00",
		"(?:[25-79]\\d\\d|800)\\d{4}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[25-9]"
				]
			]
		]
	],
	AX: [
		"358",
		"00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))",
		"(?:(?:[1247]\\d|3[0-46-9]|[56]0)\\d\\d|800)\\d{4,6}|(?:[1-47]\\d|50)\\d{4,5}|2\\d{4}",
		[
			5,
			6,
			7,
			8,
			9,
			10
		],
		0,
		"0",
		0,
		0,
		0,
		0,
		"18",
		0,
		"00"
	],
	AZ: [
		"994",
		"00",
		"(?:(?:(?:[12457]\\d|60|88)\\d|365)\\d{3}|900200)\\d{3}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[12]|365",
					"[12]|365",
					"[12]|365(?:[0-46-9]|5[0-35-9])"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"9"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[3-8]"
				],
				"0$1"
			]
		],
		"0"
	],
	BA: [
		"387",
		"00",
		"(?:[3589]\\d|49|6\\d\\d?|70)\\d{6}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2-$3",
				[
					"[3-5]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"6[1-356]|[7-9]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"6"
				],
				"0$1"
			]
		],
		"0"
	],
	BB: [
		"1",
		"011",
		"(?:246|[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"246"
	],
	BD: [
		"880",
		"00",
		"[13469]\\d{9}|8[0-79]\\d{7,8}|[2-7]\\d{8}|[2-9]\\d{7}|[3-689]\\d{6}|[57-9]\\d{5}",
		[
			6,
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{4,6})",
				"$1-$2",
				[
					"31[5-7]|[459]1"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3,7})",
				"$1-$2",
				[
					"3(?:[2-5]1|[67]|8[013-9])|4(?:[235]1|4[01346-9]|6[168]|7|[89][18])|5(?:[2-578]1|6[128]|9)|6(?:[0389]1|28|4[14]|5|6[01346-9])|7(?:[2-589]|61)|8(?:0[014-9]|[12]|[3-7]1)|9(?:[24]1|[358])"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3,6})",
				"$1-$2",
				[
					"[13-9]"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{7,8})",
				"$1-$2",
				[
					"2"
				],
				"0$1"
			]
		],
		"0"
	],
	BE: [
		"32",
		"00",
		"4\\d{8}|[1-9]\\d{7}",
		[
			8,
			9
		],
		[
			[
				"(\\d)(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[23]|4[23]|9[2-4]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[15-7]|8(?:0[2-8]|[1-79])"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"[89]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"4"
				],
				"0$1"
			]
		],
		"0"
	],
	BF: [
		"226",
		"00",
		"[25-7]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[25-7]"
				]
			]
		]
	],
	BG: [
		"359",
		"00",
		"[2-7]\\d{6,7}|[89]\\d{6,8}|2\\d{5}",
		[
			6,
			7,
			8,
			9
		],
		[
			[
				"(\\d)(\\d)(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"43[1-6]|70[1-9]"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2,3})",
				"$1 $2 $3",
				[
					"[356]|4[124-7]|7[1-9]|8[1-6]|9[1-7]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{2})",
				"$1 $2 $3",
				[
					"43[1-7]|70[1-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"7|80"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[48]|9[08]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"9"
				],
				"0$1"
			]
		],
		"0"
	],
	BH: [
		"973",
		"00",
		"[136-9]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[1367]|8[047]|9[014578]"
				]
			]
		]
	],
	BI: [
		"257",
		"00",
		"(?:[267]\\d|31)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[23]|6[189]|7[125-9]"
				]
			]
		]
	],
	BJ: [
		"229",
		"00",
		"[2689]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[2689]"
				]
			]
		]
	],
	BL: [
		"590",
		"00",
		"(?:590|69\\d)\\d{6}",
		[
			9
		],
		0,
		"0",
		0,
		0,
		0,
		0,
		0,
		[
			[
				"590(?:2[7-9]|5[12]|87)\\d{4}"
			],
			[
				"69(?:0\\d\\d|1(?:2[29]|3[0-5]))\\d{4}"
			]
		]
	],
	BM: [
		"1",
		"011",
		"(?:441|[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"441"
	],
	BN: [
		"673",
		"00",
		"[2-578]\\d{6}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[2-578]"
				]
			]
		]
	],
	BO: [
		"591",
		"00(?:1\\d)?",
		"(?:[2-467]\\d{3}|80017)\\d{4}",
		[
			8,
			9
		],
		[
			[
				"(\\d)(\\d{7})",
				"$1 $2",
				[
					"[2-4]"
				]
			],
			[
				"(\\d{8})",
				"$1",
				[
					"[67]"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{4})",
				"$1 $2 $3",
				[
					"8"
				]
			]
		],
		"0",
		0,
		"0(1\\d)?"
	],
	BQ: [
		"599",
		"00",
		"(?:[34]1|7\\d)\\d{5}",
		[
			7
		],
		0,
		0,
		0,
		0,
		0,
		0,
		"[347]"
	],
	BR: [
		"55",
		"00(?:1[245]|2[1-35]|31|4[13]|[56]5|99)",
		"(?:[1-46-9]\\d\\d|5(?:[0-46-9]\\d|5[0-24679]))\\d{8}|[1-9]\\d{9}|[3589]\\d{8}|[34]\\d{7}",
		[
			8,
			9,
			10,
			11
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1-$2",
				[
					"300|4(?:0[02]|37)",
					"300|4(?:0(?:0|20)|370)"
				]
			],
			[
				"([3589]00)(\\d{2,3})(\\d{4})",
				"$1 $2 $3",
				[
					"[3589]00"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1 $2-$3",
				[
					"[1-9][1-9]"
				],
				"($1)"
			],
			[
				"(\\d{2})(\\d{5})(\\d{4})",
				"$1 $2-$3",
				[
					"[1-9][1-9]9"
				],
				"($1)"
			]
		],
		"0",
		0,
		"0(?:(1[245]|2[1-35]|31|4[13]|[56]5|99)(\\d{10,11}))?",
		"$2"
	],
	BS: [
		"1",
		"011",
		"(?:242|[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"242"
	],
	BT: [
		"975",
		"00",
		"[17]\\d{7}|[2-8]\\d{6}",
		[
			7,
			8
		],
		[
			[
				"(\\d)(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[23568]|4[5-7]|7[246]"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"1[67]|7"
				]
			]
		]
	],
	BW: [
		"267",
		"00",
		"(?:(?:[2-6]|7\\d)\\d|90)\\d{5}",
		[
			7,
			8
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[2-6]"
				]
			],
			[
				"(\\d{2})(\\d{5})",
				"$1 $2",
				[
					"90"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"7"
				]
			]
		]
	],
	BY: [
		"375",
		"810",
		"(?:(?:[12]|8[0-7]\\d)\\d|33|44|902)\\d{7}|8(?:[05-79]\\d|1[0-489])\\d{7}|8[0-79]\\d{5,7}|8\\d{5}",
		[
			6,
			7,
			8,
			9,
			10,
			11
		],
		[
			[
				"(\\d{3})(\\d{3})",
				"$1 $2",
				[
					"800"
				],
				"8 $1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2,4})",
				"$1 $2 $3",
				[
					"800"
				],
				"8 $1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2-$3-$4",
				[
					"1(?:5[24]|6[235]|7[467])|2(?:1[246]|2[25]|3[26])",
					"1(?:5[24]|6(?:2|3[04-9]|5[0346-9])|7(?:[46]|7[37-9]))|2(?:1[246]|2[25]|3[26])"
				],
				"8 0$1"
			],
			[
				"(\\d{4})(\\d{2})(\\d{3})",
				"$1 $2-$3",
				[
					"1(?:[56]|7[179])|2[1-3]",
					"1(?:[56]|7(?:1[3-9]|7|9[2-7]))|2[1-3]"
				],
				"8 0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2-$3-$4",
				[
					"[1-4]"
				],
				"8 0$1"
			],
			[
				"(\\d{3})(\\d{3,4})(\\d{4})",
				"$1 $2 $3",
				[
					"[89]"
				],
				"8 $1"
			]
		],
		"8",
		0,
		"0|80?",
		0,
		0,
		0,
		0,
		"8~10"
	],
	BZ: [
		"501",
		"00",
		"(?:0800\\d|[2-8])\\d{6}",
		[
			7,
			11
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1-$2",
				[
					"[2-8]"
				]
			],
			[
				"(\\d)(\\d{3})(\\d{4})(\\d{3})",
				"$1-$2-$3-$4",
				[
					"0"
				]
			]
		]
	],
	CA: [
		"1",
		"011",
		"(?:[2-8]\\d|90)\\d{8}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		0,
		[
			[
				"(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|65)|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|48|79|8[17])|6(?:04|13|39|47)|7(?:0[59]|78|8[02])|8(?:[06]7|19|25|73)|90[25])[2-9]\\d{6}"
			],
			[
				""
			],
			[
				"8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"
			],
			[
				"900[2-9]\\d{6}"
			],
			[
				"(?:5(?:00|2[12]|33|44|66|77|88)|622)[2-9]\\d{6}"
			],
			0,
			0,
			0,
			[
				"600[2-9]\\d{6}"
			]
		]
	],
	CC: [
		"61",
		"001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011",
		"1\\d{5,9}|(?:[48]\\d\\d|550)\\d{6}",
		[
			6,
			7,
			8,
			9,
			10
		],
		0,
		"0",
		0,
		"0|([59]\\d{7})$",
		"8$1",
		0,
		0,
		[
			[
				"8(?:51(?:0(?:02|31|60)|118)|91(?:0(?:1[0-2]|29)|1(?:[28]2|50|79)|2(?:10|64)|3(?:[06]8|22)|4[29]8|62\\d|70[23]|959))\\d{3}",
				[
					9
				]
			],
			[
				"4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[6-9]|7[02-9]|8[0-2457-9]|9[017-9])\\d{6}",
				[
					9
				]
			],
			[
				"180(?:0\\d{3}|2)\\d{3}",
				[
					7,
					10
				]
			],
			[
				"190[0-26]\\d{6}",
				[
					10
				]
			],
			0,
			0,
			0,
			0,
			[
				"(?:14(?:5\\d|71)|550\\d)\\d{5}",
				[
					9
				]
			],
			[
				"13(?:00\\d{3}|45[0-4])\\d{3}|13\\d{4}",
				[
					6,
					8,
					10
				]
			]
		],
		"0011"
	],
	CD: [
		"243",
		"00",
		"[189]\\d{8}|[1-68]\\d{6}",
		[
			7,
			9
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"88"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{5})",
				"$1 $2",
				[
					"[1-6]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[89]"
				],
				"0$1"
			]
		],
		"0"
	],
	CF: [
		"236",
		"00",
		"(?:[27]\\d{3}|8776)\\d{4}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[278]"
				]
			]
		]
	],
	CG: [
		"242",
		"00",
		"(?:(?:0\\d|80)\\d|222)\\d{6}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"801"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[02]"
				]
			],
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"8"
				]
			]
		]
	],
	CH: [
		"41",
		"00",
		"8\\d{11}|[2-9]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[2-7]|[89]1"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"8[047]|9"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4 $5",
				[
					"8"
				],
				"0$1"
			]
		],
		"0"
	],
	CI: [
		"225",
		"00",
		"[02-8]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[02-8]"
				]
			]
		]
	],
	CK: [
		"682",
		"00",
		"[2-8]\\d{4}",
		[
			5
		],
		[
			[
				"(\\d{2})(\\d{3})",
				"$1 $2",
				[
					"[2-8]"
				]
			]
		]
	],
	CL: [
		"56",
		"(?:0|1(?:1[0-69]|2[0-57]|5[13-58]|69|7[0167]|8[018]))0",
		"(?:1230|[2-57-9]\\d|6\\d{1,3})\\d{7}",
		[
			9,
			10,
			11
		],
		[
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"2(?:2|32)",
					"2(?:2|32[0-46-8])"
				],
				"($1)"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"3[2-5]|[47][1-35]|5[1-3578]|6[13-57]|8(?:0[1-9]|[1-9])"
				],
				"($1)"
			],
			[
				"(\\d{5})(\\d{4})",
				"$1 $2",
				[
					"2"
				],
				"($1)"
			],
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"9[2-9]"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"44"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[68]00"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"600"
				]
			],
			[
				"(\\d{4})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				]
			]
		]
	],
	CM: [
		"237",
		"00",
		"(?:[26]\\d\\d|88)\\d{6}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"88"
				]
			],
			[
				"(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4 $5",
				[
					"[26]"
				]
			]
		]
	],
	CN: [
		"86",
		"(?:1(?:[12]\\d{3}|79\\d{2}|9[0-7]\\d{2}))?00",
		"(?:(?:(?:1[03-68]|2\\d)\\d\\d|[3-79])\\d|8[0-57-9])\\d{7}|[1-579]\\d{10}|8[0-57-9]\\d{8,9}|[1-79]\\d{9}|[1-9]\\d{7}|[12]\\d{6}",
		[
			7,
			8,
			9,
			10,
			11,
			12
		],
		[
			[
				"([48]00)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[48]00"
				]
			],
			[
				"(\\d{2})(\\d{5,6})",
				"$1 $2",
				[
					"(?:10|2\\d)[19]",
					"(?:10|2\\d)(?:10|9[56])",
					"(?:10|2\\d)(?:100|9[56])"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{5,6})",
				"$1 $2",
				[
					"[3-9]",
					"[3-9]\\d\\d[19]",
					"[3-9]\\d\\d(?:10|9[56])"
				],
				"0$1"
			],
			[
				"(21)(\\d{4})(\\d{4,6})",
				"$1 $2 $3",
				[
					"21"
				],
				"0$1",
				1
			],
			[
				"([12]\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"10[1-9]|2[02-9]",
					"10[1-9]|2[02-9]",
					"10(?:[1-79]|8(?:0[1-9]|[1-9]))|2[02-9]"
				],
				"0$1",
				1
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"3(?:1[02-9]|35|49|5|7[02-68]|9[1-68])|4(?:1[02-9]|2[179]|[35][2-9]|6[47-9]|7|8[23])|5(?:3[03-9]|4[36]|5[02-9]|6[1-46]|7[028]|80|9[2-46-9])|6(?:3[1-5]|6[0238]|9[12])|7(?:01|[1579]|2[248]|3[04-9]|4[3-6]|6[2368])|8(?:1[236-8]|2[5-7]|3|5[1-9]|7[02-9]|8[36-8]|9[1-7])|9(?:0[1-3689]|1[1-79]|[379]|4[13]|5[1-5])"
				],
				"0$1",
				1
			],
			[
				"(\\d{3})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"3(?:11|7[179])|4(?:[15]1|3[1-35])|5(?:1|2[37]|3[12]|51|7[13-79]|9[15])|7(?:[39]1|5[457]|6[09])|8(?:[57]1|98)"
				],
				"0$1",
				1
			],
			[
				"(\\d{4})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"807",
					"8078"
				],
				"0$1",
				1
			],
			[
				"(\\d{3})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"1(?:[3-57-9]|6[267])"
				]
			],
			[
				"(10800)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"108",
					"1080",
					"10800"
				]
			],
			[
				"(\\d{3})(\\d{7,8})",
				"$1 $2",
				[
					"950"
				]
			]
		],
		"0",
		0,
		"0|(1(?:[12]\\d{3}|79\\d{2}|9[0-7]\\d{2}))",
		0,
		0,
		0,
		0,
		"00"
	],
	CO: [
		"57",
		"00(?:4(?:[14]4|56)|[579])",
		"(?:1\\d|3)\\d{9}|[124-8]\\d{7}",
		[
			8,
			10,
			11
		],
		[
			[
				"(\\d)(\\d{7})",
				"$1 $2",
				[
					"1(?:[2-79]|8[2-9])|[24-8]"
				],
				"($1)"
			],
			[
				"(\\d{3})(\\d{7})",
				"$1 $2",
				[
					"3"
				]
			],
			[
				"(\\d)(\\d{3})(\\d{7})",
				"$1-$2-$3",
				[
					"1(?:80|9)",
					"1(?:800|9)"
				],
				"0$1",
				0,
				"$1 $2 $3"
			]
		],
		"0",
		0,
		"0([3579]|4(?:[14]4|56))?"
	],
	CR: [
		"506",
		"00",
		"(?:8\\d|90)\\d{8}|[24-8]\\d{7}",
		[
			8,
			10
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[24-7]|8[3-9]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1-$2-$3",
				[
					"[89]"
				]
			]
		],
		0,
		0,
		"(19(?:0[0-2468]|1[09]|20|66|77|99))"
	],
	CU: [
		"53",
		"119",
		"[2-57]\\d{7}|[2-47]\\d{6}|[34]\\d{5}",
		[
			6,
			7,
			8
		],
		[
			[
				"(\\d{2})(\\d{4,6})",
				"$1 $2",
				[
					"[2-4]"
				],
				"(0$1)"
			],
			[
				"(\\d)(\\d{6,7})",
				"$1 $2",
				[
					"7"
				],
				"(0$1)"
			],
			[
				"(\\d)(\\d{7})",
				"$1 $2",
				[
					"5"
				],
				"0$1"
			]
		],
		"0"
	],
	CV: [
		"238",
		"0",
		"[2-59]\\d{6}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"[2-59]"
				]
			]
		]
	],
	CW: [
		"599",
		"00",
		"(?:[34]1|60|(?:7|9\\d)\\d)\\d{5}",
		[
			7,
			8
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[3467]"
				]
			],
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"9[4-8]"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		"[69]"
	],
	CX: [
		"61",
		"001[14-689]|14(?:1[14]|34|4[17]|[56]6|7[47]|88)0011",
		"1\\d{5,9}|(?:[48]\\d\\d|550)\\d{6}",
		[
			6,
			7,
			8,
			9,
			10
		],
		0,
		"0",
		0,
		"0|([59]\\d{7})$",
		"8$1",
		0,
		0,
		[
			[
				"8(?:51(?:0(?:01|30|59)|117)|91(?:00[6-9]|1(?:[28]1|49|78)|2(?:09|63)|3(?:12|26|75)|4(?:56|97)|64\\d|7(?:0[01]|1[0-2])|958))\\d{3}",
				[
					9
				]
			],
			[
				"4(?:[0-3]\\d|4[047-9]|5[0-25-9]|6[6-9]|7[02-9]|8[0-2457-9]|9[017-9])\\d{6}",
				[
					9
				]
			],
			[
				"180(?:0\\d{3}|2)\\d{3}",
				[
					7,
					10
				]
			],
			[
				"190[0-26]\\d{6}",
				[
					10
				]
			],
			0,
			0,
			0,
			0,
			[
				"(?:14(?:5\\d|71)|550\\d)\\d{5}",
				[
					9
				]
			],
			[
				"13(?:00\\d{3}|45[0-4])\\d{3}|13\\d{4}",
				[
					6,
					8,
					10
				]
			]
		],
		"0011"
	],
	CY: [
		"357",
		"00",
		"(?:[279]\\d|[58]0)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{6})",
				"$1 $2",
				[
					"[257-9]"
				]
			]
		]
	],
	CZ: [
		"420",
		"00",
		"(?:[2-578]\\d|60|9\\d{1,4})\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[2-8]|9[015-7]"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"9[36]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"96"
				]
			]
		]
	],
	DE: [
		"49",
		"00",
		"(?:1|[235-9]\\d{11}|4(?:[0-8]\\d{2,10}|9(?:[05]\\d{7}|[46][1-8]\\d{2,6})))\\d{3}|[1-35-9]\\d{6,13}|49(?:(?:[0-25]\\d|3[1-689])\\d{4,8}|4[1-8]\\d{4}|6[0-8]\\d{3,4}|7[1-7]\\d{5,8})|497[0-7]\\d{4}|49(?:[0-2579]\\d|[34][1-9])\\d{3}|[1-9]\\d{5}|[13468]\\d{4}",
		[
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15
		],
		[
			[
				"(\\d{2})(\\d{3,13})",
				"$1 $2",
				[
					"3[02]|40|[68]9"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3,12})",
				"$1 $2",
				[
					"2(?:0[1-389]|1[124]|2[18]|3[14]|[4-9]1)|3(?:[35-9][15]|4[015])|(?:4[2-9]|[57][1-9]|[68][1-8])1|9(?:06|[1-9]1)",
					"2(?:0[1-389]|1(?:[14]|2[0-8])|2[18]|3[14]|[4-9]1)|3(?:[35-9][15]|4[015])|(?:4[2-9]|[57][1-9]|[68][1-8])1|9(?:06|[1-9]1)"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"138"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3,11})",
				"$1 $2",
				[
					"[24-6]|3(?:[3569][02-46-9]|4[2-4679]|7[2-467]|8[2-46-8])|7(?:0[2-8]|[1-9])|8(?:0[2-9]|[1-8])|9(?:0[7-9]|[1-9])",
					"[24-6]|3(?:3(?:0[1-467]|2[127-9]|3[124578]|[46][1246]|7[1257-9]|8[1256]|9[145])|4(?:2[135]|3[1357]|4[13578]|6[1246]|7[1356]|9[1346])|5(?:0[14]|2[1-3589]|3[1357]|[49][1246]|6[1-4]|7[13468]|8[13568])|6(?:0[1356]|2[1-489]|3[124-6]|4[1347]|6[13]|7[12579]|8[1-356]|9[135])|7(?:2[1-7]|3[1357]|4[145]|6[1-5]|7[1-4])|8(?:21|3[1468]|4[1347]|6|7[1467]|8[136])|9(?:0[12479]|2[1358]|3[1357]|4[134679]|6[1-9]|7[136]|8[147]|9[1468]))|7(?:0[2-8]|[1-9])|8(?:0[2-9]|[1-8])|9(?:0[7-9]|[1-9])"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{5,11})",
				"$1 $2",
				[
					"181"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d)(\\d{4,10})",
				"$1 $2 $3",
				[
					"1(?:3|80)|9"
				],
				"0$1"
			],
			[
				"(\\d{5})(\\d{3,10})",
				"$1 $2",
				[
					"3"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{7,8})",
				"$1 $2",
				[
					"1(?:6[02-489]|7)"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{7,12})",
				"$1 $2",
				[
					"8"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{7})",
				"$1 $2",
				[
					"15[1279]"
				],
				"0$1"
			],
			[
				"(\\d{5})(\\d{6})",
				"$1 $2",
				[
					"15[0568]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"7"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{8})",
				"$1 $2",
				[
					"18[2-579]",
					"18[2-579]",
					"18(?:[2-479]|5(?:0[1-9]|[1-9]))"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{7})",
				"$1 $2",
				[
					"18[68]"
				],
				"0$1"
			],
			[
				"(\\d{5})(\\d{6})",
				"$1 $2",
				[
					"18"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{7,8})",
				"$1 $2 $3",
				[
					"1(?:6[023]|7)"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{8})",
				"$1 $2 $3",
				[
					"15[013-68]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{2})(\\d{7})",
				"$1 $2 $3",
				[
					"15"
				],
				"0$1"
			]
		],
		"0"
	],
	DJ: [
		"253",
		"00",
		"(?:2\\d|77)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[27]"
				]
			]
		]
	],
	DK: [
		"45",
		"00",
		"[2-9]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[2-9]"
				]
			]
		]
	],
	DM: [
		"1",
		"011",
		"(?:[58]\\d\\d|767|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"767"
	],
	DO: [
		"1",
		"011",
		"(?:[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"8[024]9"
	],
	DZ: [
		"213",
		"00",
		"(?:[1-4]|[5-79]\\d|80)\\d{7}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[1-4]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[5-8]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"9"
				],
				"0$1"
			]
		],
		"0"
	],
	EC: [
		"593",
		"00",
		"1800\\d{6,7}|(?:[2-7]|9\\d)\\d{7}",
		[
			8,
			9,
			10,
			11
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2-$3",
				[
					"[2-7]"
				],
				"(0$1)",
				0,
				"$1-$2-$3"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"9"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"1"
				]
			]
		],
		"0"
	],
	EE: [
		"372",
		"00",
		"8\\d{9}|[4578]\\d{7}|(?:[3-8]\\d\\d|900)\\d{4}",
		[
			7,
			8,
			10
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[369]|4[3-8]|5(?:[0-2]|5[0-478]|6[45])|7[1-9]",
					"[369]|4[3-8]|5(?:[02]|1(?:[0-8]|95)|5[0-478]|6(?:4[0-4]|5[1-589]))|7[1-9]"
				]
			],
			[
				"(\\d{4})(\\d{3,4})",
				"$1 $2",
				[
					"[45]|8(?:00|[1-4])",
					"[45]|8(?:00[1-9]|[1-4])"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{4})",
				"$1 $2 $3",
				[
					"7"
				]
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"80"
				]
			]
		]
	],
	EG: [
		"20",
		"00",
		"(?:[189]\\d?|[24-6])\\d{8}|[13]\\d{7}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{7,8})",
				"$1 $2",
				[
					"[23]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{6,7})",
				"$1 $2",
				[
					"1[35]|[4-6]|8[2468]|9[235-7]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[189]"
				],
				"0$1"
			]
		],
		"0"
	],
	EH: [
		"212",
		"00",
		"[5-8]\\d{8}",
		[
			9
		],
		0,
		"0",
		0,
		0,
		0,
		0,
		"528[89]"
	],
	ER: [
		"291",
		"00",
		"[178]\\d{6}",
		[
			7
		],
		[
			[
				"(\\d)(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[178]"
				],
				"0$1"
			]
		],
		"0"
	],
	ES: [
		"34",
		"00",
		"(?:51|[6-9]\\d)\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[89]00"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[568]|7[0-48]|9(?:0[12]|[1-8])"
				]
			]
		]
	],
	ET: [
		"251",
		"00",
		"(?:11|[2-59]\\d)\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[1-59]"
				],
				"0$1"
			]
		],
		"0"
	],
	FI: [
		"358",
		"00|99(?:[01469]|5(?:[14]1|3[23]|5[59]|77|88|9[09]))",
		"(?:[124-7]\\d|3[0-46-9])\\d{8}|[1-9]\\d{5,8}|[1-35689]\\d{4}",
		[
			5,
			6,
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{4,9})",
				"$1 $2",
				[
					"[2568][1-8]|3(?:0[1-9]|[1-9])|9"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4,8})",
				"$1 $2",
				[
					"1(?:0[1-9]|[3-79][1-8]|8)|2(?:0[1-9]|9)|[45]|7[135]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3,7})",
				"$1 $2",
				[
					"(?:1|20)0|[36-8]"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		"1[03-79]|[2-9]",
		0,
		"00"
	],
	FJ: [
		"679",
		"0(?:0|52)",
		"(?:(?:0800\\d|[235-9])\\d|45)\\d{5}",
		[
			7,
			11
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[235-9]|45"
				]
			],
			[
				"(\\d{4})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"0"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"00"
	],
	FK: [
		"500",
		"00",
		"[2-7]\\d{4}",
		[
			5
		]
	],
	FM: [
		"691",
		"00",
		"[39]\\d{6}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"3(?:20|[357])|9",
					"3(?:20[1-9]|[357])|9"
				]
			]
		]
	],
	FO: [
		"298",
		"00",
		"(?:[2-8]\\d|90)\\d{4}",
		[
			6
		],
		[
			[
				"(\\d{6})",
				"$1",
				[
					"[2-9]"
				]
			]
		],
		0,
		0,
		"(10(?:01|[12]0|88))"
	],
	FR: [
		"33",
		"00",
		"[1-9]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4 $5",
				[
					"[1-79]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"8"
				],
				"0 $1"
			]
		],
		"0"
	],
	GA: [
		"241",
		"00",
		"(?:0\\d|[2-7])\\d{6}",
		[
			7,
			8
		],
		[
			[
				"(\\d)(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[2-7]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"0"
				]
			]
		]
	],
	GB: [
		"44",
		"00",
		"[1-357-9]\\d{9}|[18]\\d{8}|8\\d{6}",
		[
			7,
			9,
			10
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"845",
					"8454",
					"84546",
					"845464"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"800",
					"8001",
					"80011",
					"800111",
					"8001111"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{6})",
				"$1 $2",
				[
					"800"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{5,6})",
				"$1 $2",
				[
					"1(?:[2-79][02-9]|8)",
					"1(?:[24][02-9]|3(?:[02-79]|8[0-46-9])|5(?:[04-9]|2[024-9]|3[014-689])|6(?:[02-8]|9[0-24578])|7(?:[02-57-9]|6[013-9])|8|9(?:[0235-9]|4[2-9]))",
					"1(?:[24][02-9]|3(?:[02-79]|8(?:[0-4689]|7[0-24-9]))|5(?:[04-9]|2(?:[025-9]|4[013-9])|3(?:[014-68]|9[0-37-9]))|6(?:[02-8]|9(?:[0-2458]|7[0-25689]))|7(?:[02-57-9]|6(?:[013-79]|8[0-25689]))|8|9(?:[0235-9]|4(?:[2-57-9]|6[0-689])))"
				],
				"0$1"
			],
			[
				"(\\d{5})(\\d{4,5})",
				"$1 $2",
				[
					"1(?:38|5[23]|69|7|94)"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"[25]|7(?:0|6[024-9])",
					"[25]|7(?:0|6(?:[04-9]|2[356]))"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[1389]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{6})",
				"$1 $2",
				[
					"7"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		[
			[
				"(?:1(?:1(?:3[0-58]|4[0-5]|5[0-26-9]|6[0-4]|[78][0-49])|2(?:0[024-9]|1[0-7]|2[3-9]|3[3-79]|4[1-689]|[58][02-9]|6[0-47-9]|7[013-9]|9\\d)|3(?:0\\d|1[0-8]|[25][02-9]|3[02-579]|[468][0-46-9]|7[1-35-79]|9[2-578])|4(?:0[03-9]|[137]\\d|[28][02-57-9]|4[02-69]|5[0-8]|[69][0-79])|5(?:0[1-35-9]|[16]\\d|2[024-9]|3[015689]|4[02-9]|5[03-9]|7[0-35-9]|8[0-468]|9[0-57-9])|6(?:0[034689]|1\\d|2[0-35689]|[38][013-9]|4[1-467]|5[0-69]|6[13-9]|7[0-8]|9[0-24578])|7(?:0[0246-9]|2\\d|3[0236-8]|4[03-9]|5[0-46-9]|6[013-9]|7[0-35-9]|8[024-9]|9[02-9])|8(?:0[35-9]|2[1-57-9]|3[02-578]|4[0-578]|5[124-9]|6[2-69]|7\\d|8[02-9]|9[02569])|9(?:0[02-589]|[18]\\d|2[02-689]|3[1-57-9]|4[2-9]|5[0-579]|6[2-47-9]|7[0-24578]|9[2-57]))|2(?:0[01378]|3[0189]|4[017]|8[0-46-9]|9[0-2])\\d)\\d{6}|1(?:(?:2(?:0(?:46[1-4]|87[2-9])|545[1-79]|76(?:2\\d|3[1-8]|6[1-6])|9(?:7(?:2[0-4]|3[2-5])|8(?:2[2-8]|7[0-47-9]|8[3-5])))|3(?:6(?:38[2-5]|47[23])|8(?:47[04-9]|64[0157-9]))|4(?:044[1-7]|20(?:2[23]|8\\d)|6(?:0(?:30|5[2-57]|6[1-8]|7[2-8])|140)|8(?:052|87[1-3]))|5(?:2(?:4(?:3[2-79]|6\\d)|76\\d)|6(?:26[06-9]|686))|6(?:06(?:4\\d|7[4-79])|295[5-7]|35[34]\\d|47(?:24|61)|59(?:5[08]|6[67]|74)|9(?:55[0-4]|77[23]))|8(?:27[56]\\d|37(?:5[2-5]|8[239])|843[2-58])|9(?:0(?:0(?:6[1-8]|85)|52\\d)|3583|4(?:66[1-8]|9(?:2[01]|81))|63(?:23|3[1-4])|9561))\\d|7(?:(?:26(?:6[13-9]|7[0-7])|442\\d|50(?:2[0-3]|[3-68]2|76))\\d|6888[2-46-8]))\\d\\d",
				[
					9,
					10
				]
			],
			[
				"7(?:(?:[1-3]\\d\\d|5(?:0[0-8]|[13-9]\\d|2[0-35-9])|8(?:[014-9]\\d|[23][0-8]))\\d|4(?:[0-46-9]\\d\\d|5(?:[0-689]\\d|7[0-57-9]))|7(?:0(?:0[01]|[1-9]\\d)|(?:[1-7]\\d|8[02-9]|9[0-689])\\d)|9(?:(?:[024-9]\\d|3[0-689])\\d|1(?:[02-9]\\d|1[028])))\\d{5}",
				[
					10
				]
			],
			[
				"80[08]\\d{7}|800\\d{6}|8001111"
			],
			[
				"(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[2-49]))\\d{7}|845464\\d",
				[
					7,
					10
				]
			],
			[
				"70\\d{8}",
				[
					10
				]
			],
			0,
			[
				"(?:3[0347]|55)\\d{8}",
				[
					10
				]
			],
			[
				"76(?:0[0-2]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}",
				[
					10
				]
			],
			[
				"56\\d{8}",
				[
					10
				]
			]
		],
		0,
		" x"
	],
	GD: [
		"1",
		"011",
		"(?:473|[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"473"
	],
	GE: [
		"995",
		"00",
		"(?:[3-57]\\d\\d|800)\\d{6}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[348]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"5|79"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"7"
				],
				"0$1"
			]
		],
		"0"
	],
	GF: [
		"594",
		"00",
		"[56]94\\d{6}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[56]"
				],
				"0$1"
			]
		],
		"0"
	],
	GG: [
		"44",
		"00",
		"(?:1481|[357-9]\\d{3})\\d{6}|8\\d{6}(?:\\d{2})?",
		[
			7,
			9,
			10
		],
		0,
		"0",
		0,
		"0|([25-9]\\d{5})$",
		"1481$1",
		0,
		0,
		[
			[
				"1481[25-9]\\d{5}",
				[
					10
				]
			],
			[
				"7(?:(?:781|839)\\d|911[17])\\d{5}",
				[
					10
				]
			],
			[
				"80[08]\\d{7}|800\\d{6}|8001111"
			],
			[
				"(?:8(?:4[2-5]|7[0-3])|9(?:[01]\\d|8[0-3]))\\d{7}|845464\\d",
				[
					7,
					10
				]
			],
			[
				"70\\d{8}",
				[
					10
				]
			],
			0,
			[
				"(?:3[0347]|55)\\d{8}",
				[
					10
				]
			],
			[
				"76(?:0[0-2]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}",
				[
					10
				]
			],
			[
				"56\\d{8}",
				[
					10
				]
			]
		]
	],
	GH: [
		"233",
		"00",
		"(?:[235]\\d{3}|800)\\d{5}",
		[
			8,
			9
		],
		[
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"8"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[235]"
				],
				"0$1"
			]
		],
		"0"
	],
	GI: [
		"350",
		"00",
		"(?:[25]\\d\\d|629)\\d{5}",
		[
			8
		],
		[
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"2"
				]
			]
		]
	],
	GL: [
		"299",
		"00",
		"(?:19|[2-689]\\d)\\d{4}",
		[
			6
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"19|[2-689]"
				]
			]
		]
	],
	GM: [
		"220",
		"00",
		"[2-9]\\d{6}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[2-9]"
				]
			]
		]
	],
	GN: [
		"224",
		"00",
		"(?:30|6\\d\\d|722)\\d{6}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"3"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[67]"
				]
			]
		]
	],
	GP: [
		"590",
		"00",
		"(?:590|69\\d)\\d{6}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[56]"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		[
			[
				"590(?:0[1-68]|1[0-2]|2[0-68]|3[1289]|4[0-24-9]|5[3-579]|6[0189]|7[08]|8[0-689]|9\\d)\\d{4}"
			],
			[
				"69(?:0\\d\\d|1(?:2[29]|3[0-5]))\\d{4}"
			]
		]
	],
	GQ: [
		"240",
		"00",
		"(?:222|(?:3\\d|55|[89]0)\\d)\\d{6}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[235]"
				]
			],
			[
				"(\\d{3})(\\d{6})",
				"$1 $2",
				[
					"[89]"
				]
			]
		]
	],
	GR: [
		"30",
		"00",
		"(?:[268]\\d|[79]0)\\d{8}",
		[
			10
		],
		[
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"21|7"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"2[3-8]1|[689]"
				]
			],
			[
				"(\\d{4})(\\d{6})",
				"$1 $2",
				[
					"2"
				]
			]
		]
	],
	GT: [
		"502",
		"00",
		"(?:1\\d{3}|[2-7])\\d{7}",
		[
			8,
			11
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[2-7]"
				]
			],
			[
				"(\\d{4})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				]
			]
		]
	],
	GU: [
		"1",
		"011",
		"(?:[58]\\d\\d|671|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"671"
	],
	GW: [
		"245",
		"00",
		"[49]\\d{8}|4\\d{6}",
		[
			7,
			9
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"40"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[49]"
				]
			]
		]
	],
	GY: [
		"592",
		"001",
		"(?:(?:(?:[2-46]\\d|77)\\d|862)\\d|9008)\\d{3}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[2-46-9]"
				]
			]
		]
	],
	HK: [
		"852",
		"00(?:30|5[09]|[126-9]?)",
		"8[0-46-9]\\d{6,7}|9\\d{4}(?:\\d(?:\\d(?:\\d{4})?)?)?|(?:[235-79]\\d|46)\\d{6}",
		[
			5,
			6,
			7,
			8,
			9,
			11
		],
		[
			[
				"(\\d{3})(\\d{2,5})",
				"$1 $2",
				[
					"900",
					"9003"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[2-7]|8[1-4]|9(?:0[1-9]|[1-8])"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"8"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"9"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"00"
	],
	HN: [
		"504",
		"00",
		"[237-9]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1-$2",
				[
					"[237-9]"
				]
			]
		]
	],
	HR: [
		"385",
		"00",
		"(?:[24-69]\\d|3[0-79])\\d{7}|80\\d{5,7}|[1-79]\\d{7}|6\\d{5,6}",
		[
			6,
			7,
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2,3})",
				"$1 $2 $3",
				[
					"6[01]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2,3})",
				"$1 $2 $3",
				[
					"8"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{4})(\\d{3})",
				"$1 $2 $3",
				[
					"1"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[2-5]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[67]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"9"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"8"
				],
				"0$1"
			]
		],
		"0"
	],
	HT: [
		"509",
		"00",
		"[2-489]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{4})",
				"$1 $2 $3",
				[
					"[2-489]"
				]
			]
		]
	],
	HU: [
		"36",
		"00",
		"[2357]\\d{8}|[1-9]\\d{7}",
		[
			8,
			9
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				],
				"($1)"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[2-9]"
				],
				"($1)"
			]
		],
		"06"
	],
	ID: [
		"62",
		"0(?:0[17-9]|10(?:00|1[67]))",
		"(?:[1-36]|8\\d{5})\\d{6}|[1-9]\\d{8,10}|[2-9]\\d{7}",
		[
			7,
			8,
			9,
			10,
			11,
			12
		],
		[
			[
				"(\\d)(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"15"
				]
			],
			[
				"(\\d{2})(\\d{5,8})",
				"$1 $2",
				[
					"2[124]|[36]1"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{5,7})",
				"$1 $2",
				[
					"800"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{5,8})",
				"$1 $2",
				[
					"[2-579]|6[2-5]"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{3,4})(\\d{3})",
				"$1-$2-$3",
				[
					"8[1-35-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{6,8})",
				"$1 $2",
				[
					"1"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"804"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d)(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"80"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{4})(\\d{4,5})",
				"$1-$2-$3",
				[
					"8"
				],
				"0$1"
			]
		],
		"0"
	],
	IE: [
		"353",
		"00",
		"[148]\\d{9}|[124-9]\\d{8}|[124-69]\\d{7}|[24-69]\\d{6}",
		[
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{5})",
				"$1 $2",
				[
					"2[24-9]|47|58|6[237-9]|9[35-9]"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"[45]0"
				],
				"(0$1)"
			],
			[
				"(\\d)(\\d{3,4})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[2569]|4[1-69]|7[14]"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"76|8[235-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"7"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"81"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"4"
				],
				"(0$1)"
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"1"
				]
			],
			[
				"(\\d{2})(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3 $4",
				[
					"8"
				],
				"0$1"
			]
		],
		"0"
	],
	IL: [
		"972",
		"0(?:0|1[2-9])",
		"1\\d{6}(?:\\d{3,5})?|[57]\\d{8}|[1-489]\\d{7}",
		[
			7,
			8,
			9,
			10,
			11,
			12
		],
		[
			[
				"(\\d{4})(\\d{3})",
				"$1-$2",
				[
					"125"
				]
			],
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1-$2-$3",
				[
					"[2-489]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{2})(\\d{2})",
				"$1-$2-$3",
				[
					"121"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1-$2-$3",
				[
					"[57]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})",
				"$1-$2-$3",
				[
					"12"
				]
			],
			[
				"(\\d{4})(\\d{6})",
				"$1-$2",
				[
					"159"
				]
			],
			[
				"(\\d)(\\d{3})(\\d{3})(\\d{3})",
				"$1-$2-$3-$4",
				[
					"1[7-9]"
				]
			],
			[
				"(\\d{3})(\\d{1,2})(\\d{3})(\\d{4})",
				"$1-$2 $3-$4",
				[
					"1"
				]
			]
		],
		"0"
	],
	IM: [
		"44",
		"00",
		"(?:1624|(?:[3578]\\d|90)\\d\\d)\\d{6}",
		[
			10
		],
		0,
		"0",
		0,
		"0|([5-8]\\d{5})$",
		"1624$1",
		0,
		0,
		[
			[
				"1624[5-8]\\d{5}"
			],
			[
				"7(?:4576|[59]24\\d|624[0-4689])\\d{5}"
			],
			[
				"808162\\d{4}"
			],
			[
				"(?:8(?:4(?:40[49]06|5624\\d)|7(?:0624|2299)\\d)|90[0167]624\\d)\\d{3}"
			],
			[
				"70\\d{8}"
			],
			0,
			[
				"(?:3(?:(?:08162|3\\d{4}|7(?:0624|2299))\\d|4(?:40[49]06|5624\\d))|55\\d{5})\\d{3}"
			],
			0,
			[
				"56\\d{8}"
			]
		]
	],
	IN: [
		"91",
		"00",
		"(?:00800|1\\d{0,5}|[2-9]\\d\\d)\\d{7}",
		[
			8,
			9,
			10,
			11,
			12,
			13
		],
		[
			[
				"(\\d{8})",
				"$1",
				[
					"5[0236-8]"
				]
			],
			[
				"(\\d{4})(\\d{4,5})",
				"$1 $2",
				[
					"180",
					"1800"
				]
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"11|2[02]|33|4[04]|79[1-7]|80[2-46]",
					"11|2[02]|33|4[04]|79(?:[1-6]|7[19])|80(?:[2-4]|6[0-589])",
					"11|2[02]|33|4[04]|79(?:[124-6]|3(?:[02-9]|1[0-24-9])|7(?:1|9[1-6]))|80(?:[2-4]|6[0-589])"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1(?:2[0-249]|3[0-25]|4[145]|[59][14]|[68]|7[1257])|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5[12]|[78]1|9[15])|6(?:12|[2-4]1|5[17]|6[13]|7[14]|80)|7(?:12|2[14]|3[134]|4[47]|5[15]|61|88)|8(?:16|2[014]|3[126]|6[136]|7[078]|8[34]|91)",
					"1(?:2[0-249]|3[0-25]|4[145]|[59][14]|6(?:0[2-7]|[1-9])|7[1257]|8(?:[06][2-7]|[1-57-9]))|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5(?:1|2[2-7])|[78]1|9[15])|6(?:12[2-7]|[2-4]1|5[17]|6[13]|7[14]|80)|7(?:12|(?:2[14]|5[15])[2-6]|3(?:1[2-7]|[34][2-6])|4[47][2-7]|61[346]|88[0-8])|8(?:(?:16|2[014]|3[126]|6[136])[2-7]|7(?:0[2-6]|[78][2-7])|8(?:3[2-7]|4[235-7])|91[3-7])",
					"1(?:2[0-249]|3[0-25]|4[145]|[59][14]|6(?:0[2-7]|[1-9])|7[1257]|8(?:[06][2-7]|[1-57-9]))|2(?:1[257]|3[013]|4[01]|5[0137]|6[0158]|78|8[1568]|9[14])|3(?:26|4[1-3]|5[34]|6[01489]|7[02-46]|8[159])|4(?:1[36]|2[1-47]|3[15]|5[12]|6[0-26-9]|7[0-24-9]|8[013-57]|9[014-7])|5(?:1[025]|22|[36][25]|4[28]|5(?:1|2[2-7])|[78]1|9[15])|6(?:12(?:[2-6]|7[0-8])|[2-4]1|5[17]|6[13]|7[14]|80)|7(?:12|(?:2[14]|5[15])[2-6]|3(?:1(?:[2-6]|71)|[34][2-6])|4[47](?:[2-6]|7[19])|61[346]|88(?:[01][2-7]|[2-7]|82))|8(?:(?:16|2[014]|3[126]|6[136])(?:[2-6]|7[19])|7(?:0[2-6]|[78](?:[2-6]|7[19]))|8(?:3(?:[2-6]|7[19])|4(?:[2356]|7[19]))|91(?:[3-6]|7[19]))"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"1(?:[23579]|4[236-9])|[2-5]|6(?:1[1358]|2[2457-9]|3[2-5]|[4-8])|7(?:1[013-9]|28|3[129]|4[1-35689]|5[29]|6[02-5]|70)|807",
					"1(?:[23579]|4[236-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|[4-8])|7(?:1(?:[013-8]|9[6-9])|28[6-8]|3(?:17|2[0-49]|9[2-57])|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4|5[0-367])|70[13-7])|807[19]",
					"1(?:[23579]|4[236-9])|[2-5]|6(?:1[1358]|2(?:[2457]|84|95)|3(?:[2-4]|55)|[4-8])|7(?:1(?:[013-8]|9[6-9])|(?:28[6-8]|4(?:1[2-4]|[29][0-7]|3[0-8]|[56]\\d|8[0-24-7])|5(?:2[1-3]|9[0-6])|6(?:0[5689]|2[5-9]|3[02-8]|4\\d|5[0-367])|70[13-7])[2-7]|3(?:179|(?:2[0-49]|9[2-57])[2-7]))|807(?:1|9[1-3])"
				],
				"0$1"
			],
			[
				"(\\d{5})(\\d{5})",
				"$1 $2",
				[
					"[6-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"14"
				]
			],
			[
				"(\\d{4})(\\d{2,4})(\\d{4})",
				"$1 $2 $3",
				[
					"180",
					"1800"
				]
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"1"
				]
			]
		],
		"0",
		0,
		0,
		0,
		1
	],
	IO: [
		"246",
		"00",
		"3\\d{6}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"3"
				]
			]
		]
	],
	IQ: [
		"964",
		"00",
		"(?:1|[2-6]\\d?|7\\d\\d)\\d{7}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[2-6]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"7"
				],
				"0$1"
			]
		],
		"0"
	],
	IR: [
		"98",
		"00",
		"[1-9]\\d{9}|(?:[1-8]\\d\\d|9)\\d{3,4}",
		[
			4,
			5,
			6,
			7,
			10
		],
		[
			[
				"(\\d{4,5})",
				"$1",
				[
					"96"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4,5})",
				"$1 $2",
				[
					"(?:1[137]|2[13-68]|3[1458]|4[145]|5[1468]|6[16]|7[1467]|8[13467])[12689]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"9"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"[1-8]"
				],
				"0$1"
			]
		],
		"0"
	],
	IS: [
		"354",
		"00|1(?:0(?:01|[12]0)|100)",
		"(?:38\\d|[4-9])\\d{6}",
		[
			7,
			9
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[4-9]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"3"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"00"
	],
	IT: [
		"39",
		"00",
		"0\\d{6}(?:\\d{4})?|3[0-8]\\d{9}|(?:[0138]\\d?|55)\\d{8}|[08]\\d{5}(?:\\d{2})?",
		[
			6,
			7,
			8,
			9,
			10,
			11
		],
		[
			[
				"(\\d{2})(\\d{4,6})",
				"$1 $2",
				[
					"0[26]"
				]
			],
			[
				"(\\d{3})(\\d{3,6})",
				"$1 $2",
				[
					"0[13-57-9][0159]|8(?:03|4[17]|9[245])",
					"0[13-57-9][0159]|8(?:03|4[17]|9(?:2|[45][0-4]))"
				]
			],
			[
				"(\\d{4})(\\d{2,6})",
				"$1 $2",
				[
					"0(?:[13-579][2-46-8]|8[236-8])"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"894"
				]
			],
			[
				"(\\d{2})(\\d{3,4})(\\d{4})",
				"$1 $2 $3",
				[
					"0[26]|5"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"1(?:44|[67]|99)|[38]"
				]
			],
			[
				"(\\d{3})(\\d{3,4})(\\d{4})",
				"$1 $2 $3",
				[
					"0[13-57-9][0159]"
				]
			],
			[
				"(\\d{3})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"3"
				]
			],
			[
				"(\\d{2})(\\d{4})(\\d{5})",
				"$1 $2 $3",
				[
					"0[26]"
				]
			],
			[
				"(\\d{4})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"0"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		[
			[
				"0(?:(?:1(?:[0159]\\d|[27][1-5]|31|4[1-4]|6[1356]|8[2-57])|2\\d\\d|3(?:[0159]\\d|2[1-4]|3[12]|[48][1-6]|6[2-59]|7[1-7])|4(?:[0159]\\d|[23][1-9]|4[245]|6[1-5]|7[1-4]|81)|5(?:[0159]\\d|2[1-5]|3[2-6]|4[1-79]|6[4-6]|7[1-578]|8[3-8])|7(?:[0159]\\d|2[12]|3[1-7]|4[2-46]|6[13569]|7[13-6]|8[1-59])|8(?:[0159]\\d|2[3-578]|3[1-356]|[6-8][1-5])|9(?:[0159]\\d|[238][1-5]|4[12]|6[1-8]|7[1-6]))\\d|6(?:[0-57-9]\\d\\d|6(?:[0-8]\\d|9[0-79])))\\d{1,6}"
			],
			[
				"33\\d{9}|3[1-9]\\d{8}|3[2-9]\\d{7}",
				[
					9,
					10,
					11
				]
			],
			[
				"80(?:0\\d{3}|3)\\d{3}",
				[
					6,
					9
				]
			],
			[
				"(?:(?:0878|1(?:44|6[346])\\d)\\d\\d|89(?:2|(?:4[5-9]|(?:5[5-9]|9)\\d\\d)\\d))\\d{3}|89[45][0-4]\\d\\d",
				[
					6,
					8,
					9,
					10
				]
			],
			[
				"1(?:78\\d|99)\\d{6}",
				[
					9,
					10
				]
			],
			0,
			0,
			0,
			[
				"55\\d{8}",
				[
					10
				]
			],
			[
				"84(?:[08]\\d{3}|[17])\\d{3}",
				[
					6,
					9
				]
			]
		]
	],
	JE: [
		"44",
		"00",
		"(?:1534|(?:[3578]\\d|90)\\d\\d)\\d{6}",
		[
			10
		],
		0,
		"0",
		0,
		"0|([0-24-8]\\d{5})$",
		"1534$1",
		0,
		0,
		[
			[
				"1534[0-24-8]\\d{5}"
			],
			[
				"7(?:(?:(?:50|82)9|937)\\d|7(?:00[378]|97[7-9]))\\d{5}"
			],
			[
				"80(?:07(?:35|81)|8901)\\d{4}"
			],
			[
				"(?:8(?:4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|90(?:066[59]|1810|71(?:07|55)))\\d{4}"
			],
			[
				"701511\\d{4}"
			],
			0,
			[
				"(?:3(?:0(?:07(?:35|81)|8901)|3\\d{4}|4(?:4(?:4(?:05|42|69)|703)|5(?:041|800))|7(?:0002|1206))|55\\d{4})\\d{4}"
			],
			[
				"76(?:0[0-2]|2[356]|4[0134]|5[49]|6[0-369]|77|81|9[39])\\d{6}"
			],
			[
				"56\\d{8}"
			]
		]
	],
	JM: [
		"1",
		"011",
		"(?:[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"876"
	],
	JO: [
		"962",
		"00",
		"(?:(?:(?:[268]|7\\d)\\d|32|53)\\d|900)\\d{5}",
		[
			8,
			9
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[2356]|87"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{5,6})",
				"$1 $2",
				[
					"[89]"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"7[457-9]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{7})",
				"$1 $2",
				[
					"7"
				],
				"0$1"
			]
		],
		"0"
	],
	JP: [
		"81",
		"010",
		"00[1-9]\\d{6,14}|[257-9]\\d{9}|(?:00|[1-9]\\d\\d)\\d{6}",
		[
			8,
			9,
			10,
			11,
			12,
			13,
			14,
			15,
			16,
			17
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1-$2-$3",
				[
					"(?:12|57|99)0"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d)(\\d{4})",
				"$1-$2-$3",
				[
					"1(?:26|3[79]|4[56]|5[4-68]|6[3-5])|499|5(?:76|97)|746|8(?:3[89]|47|51|63)|9(?:49|80|9[16])",
					"1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:76|97)9|7468|8(?:3(?:8[78]|96)|477|51[24]|636)|9(?:496|802|9(?:1[23]|69))",
					"1(?:267|3(?:7[247]|9[278])|4(?:5[67]|66)|5(?:47|58|64|8[67])|6(?:3[245]|48|5[4-68]))|499[2468]|5(?:769|979[2-69])|7468|8(?:3(?:8[78]|96[2457-9])|477|51[24]|636[2-57-9])|9(?:496|802|9(?:1[23]|69))"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{4})",
				"$1-$2-$3",
				[
					"1(?:[2-46]|5[2-8]|7[2-689]|8[2-7]|9[1-578])|2(?:2[03-689]|3[3-58]|4[0-468]|5[04-8]|6[013-8]|7[06-9]|8[02-57-9]|9[13])|4(?:2[28]|3[689]|6[035-7]|7[05689]|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|[67]|8[14-7]|9[4-9])|7(?:2[15]|3[5-9]|4|6[135-8]|7[0-4689]|9[014-9])|8(?:2[49]|3[3-8]|4[5-8]|5[2-9]|6[35-9]|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9[3-7])",
					"1(?:[2-46]|5(?:[236-8]|[45][2-69])|7[2-689]|8[2-7]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:[0468][2-9]|5[78]|7[2-4])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|[67]|8[14-7]|9(?:[4-7]|[89][2-8]))|7(?:2[15]|3[5-9]|4|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9[2-8])|3(?:[3-6][2-9]|7[2-6]|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5[4-7]|6[2-9]|8[2-8]|9[236-9])|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3[34]|4[2-69]|[5-7]))",
					"1(?:[2-46]|5(?:[236-8]|[45][2-69])|7[2-689]|8[2-7]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:[0468][2-9]|5[78]|7[2-4])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|[67]|8[14-7]|9(?:[4-7]|[89][2-8]))|7(?:2[15]|3[5-9]|4|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:20|[3578]|4[04-9]|6[56]))|3(?:[3-6][2-9]|7(?:[2-5]|6[0-59])|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))",
					"1(?:[2-46]|5(?:[236-8]|[45][2-69])|7[2-689]|8[2-7]|9[1-578])|2(?:2(?:[04-689]|3[23])|3[3-58]|4[0-468]|5(?:[0468][2-9]|5[78]|7[2-4])|6(?:[0135-8]|4[2-5])|7(?:[0679]|8[2-7])|8(?:[024578]|3[25-9]|9[6-9])|9(?:11|3[2-4]))|4(?:2(?:2[2-9]|8[237-9])|3[689]|6[035-7]|7(?:[059][2-8]|[68])|80|9[3-5])|5(?:3[1-36-9]|4[4578]|5[013-8]|[67]|8[14-7]|9(?:[4-7]|[89][2-8]))|7(?:2[15]|3[5-9]|4|6[135-8]|7[0-4689]|9(?:[017-9]|4[6-8]|5[2-478]|6[2-589]))|8(?:2(?:4[4-8]|9(?:20|[3578]|4[04-9]|6(?:5[25]|60)))|3(?:[3-6][2-9]|7(?:[2-5]|6[0-59])|8[2-5])|4[5-8]|5[2-9]|6(?:[37]|5(?:[467]|5[014-9])|6(?:[2-8]|9[02-69])|8[2-8]|9(?:[236-8]|9[23]))|7[579]|8[03-579]|9[2-8])|9(?:[23]0|4[02-46-9]|5[024-79]|6[4-9]|7[2-47-9]|8[02-7]|9(?:3(?:3[02-9]|4[0-24689])|4[2-69]|[5-7]))"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1-$2-$3",
				[
					"1|2(?:2[37]|5[5-9]|64|78|8[39]|91)|4(?:2[2689]|64|7[347])|5[2-589]|60|8(?:2[124589]|3[279]|[46-9])|9(?:[235-8]|93)",
					"1|2(?:2[37]|5(?:[57]|[68]0|9[19])|64|78|8[39]|917)|4(?:2(?:20|[68]|9[178])|64|7[347])|5[2-589]|60|8(?:2[124589]|3[279]|[46-9])|9(?:[235-8]|93[34])",
					"1|2(?:2[37]|5(?:[57]|[68]0|9(?:17|99))|64|78|8[39]|917)|4(?:2(?:20|[68]|9[178])|64|7[347])|5[2-589]|60|8(?:2[124589]|3[279]|[46-9])|9(?:[235-8]|93[34])"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{4})",
				"$1-$2-$3",
				[
					"2(?:[34]7|[56]9|74|9[14-79])|82|993"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1-$2-$3",
				[
					"[36]|4(?:2[09]|7[01])"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1-$2-$3",
				[
					"2[2-9]|4|7[235-9]|9[49]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1-$2-$3",
				[
					"800"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1-$2-$3",
				[
					"[2579]|80"
				],
				"0$1"
			]
		],
		"0"
	],
	KE: [
		"254",
		"000",
		"(?:(?:2|80)0\\d?|[4-7]\\d\\d|900)\\d{6}|[4-6]\\d{6,7}",
		[
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{5,7})",
				"$1 $2",
				[
					"[24-6]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{6})",
				"$1 $2",
				[
					"7"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[89]"
				],
				"0$1"
			]
		],
		"0"
	],
	KG: [
		"996",
		"00",
		"(?:[235-7]\\d|99)\\d{7}|800\\d{6,7}",
		[
			9,
			10
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[25-79]|31[25]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{5})",
				"$1 $2",
				[
					"3"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d)(\\d{2,3})",
				"$1 $2 $3 $4",
				[
					"8"
				],
				"0$1"
			]
		],
		"0"
	],
	KH: [
		"855",
		"00[14-9]",
		"1\\d{9}|[1-9]\\d{7,8}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[1-9]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"1"
				]
			]
		],
		"0"
	],
	KI: [
		"686",
		"00",
		"(?:[37]\\d|6[0-79])\\d{6}|(?:[2-48]\\d|50)\\d{3}",
		[
			5,
			8
		],
		0,
		"0",
		0,
		0,
		0,
		1
	],
	KM: [
		"269",
		"00",
		"[3478]\\d{6}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"[3478]"
				]
			]
		]
	],
	KN: [
		"1",
		"011",
		"(?:[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"869"
	],
	KP: [
		"850",
		"00|99",
		"(?:(?:19\\d|2)\\d|85)\\d{6}",
		[
			8,
			10
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"8"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				],
				"0$1"
			]
		],
		"0"
	],
	KR: [
		"82",
		"00(?:[125689]|3(?:[46]5|91)|7(?:00|27|3|55|6[126]))",
		"(?:00[1-9]\\d{2,4}|[12]|5\\d{3})\\d{7}|(?:(?:00|[13-6])\\d|70)\\d{8}|(?:[1-6]\\d|80)\\d{7}|[3-6]\\d{4,5}",
		[
			5,
			6,
			8,
			9,
			10,
			11,
			12,
			13,
			14
		],
		[
			[
				"(\\d{2})(\\d{3,4})",
				"$1-$2",
				[
					"(?:3[1-3]|[46][1-4]|5[1-5])1"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1-$2",
				[
					"1(?:5[246-9]|6[046-8]|8[03579])",
					"1(?:5(?:22|44|66|77|88|99)|6(?:[07]0|44|6[16]|88)|8(?:00|33|55|77|99))"
				],
				"$1"
			],
			[
				"(\\d{5})",
				"$1",
				[
					"1[016-9]1",
					"1[016-9]11",
					"1[016-9]114"
				]
			],
			[
				"(\\d)(\\d{3,4})(\\d{4})",
				"$1-$2-$3",
				[
					"2[1-9]"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1-$2-$3",
				[
					"60[2-9]|80"
				]
			],
			[
				"(\\d{2})(\\d{3,4})(\\d{4})",
				"$1-$2-$3",
				[
					"1[0-25-9]|(?:3[1-3]|[46][1-4]|5[1-5])[1-9]"
				]
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1-$2-$3",
				[
					"[57]0"
				]
			],
			[
				"(\\d{2})(\\d{5})(\\d{4})",
				"$1-$2-$3",
				[
					"50"
				]
			]
		],
		"0",
		"0$1",
		"0(8[1-46-8]|85\\d{2})?"
	],
	KW: [
		"965",
		"00",
		"(?:18|[2569]\\d\\d)\\d{5}",
		[
			7,
			8
		],
		[
			[
				"(\\d{4})(\\d{3,4})",
				"$1 $2",
				[
					"[169]|2(?:[235]|4[1-35-9])|52"
				]
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"[25]"
				]
			]
		]
	],
	KY: [
		"1",
		"011",
		"(?:345|[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"345"
	],
	KZ: [
		"7",
		"810",
		"(?:33622|(?:7\\d|80)\\d{3})\\d{5}",
		[
			10
		],
		0,
		"8",
		0,
		0,
		0,
		0,
		"33|7",
		0,
		"8~10"
	],
	LA: [
		"856",
		"00",
		"(?:2\\d|3)\\d{8}|(?:[235-8]\\d|41)\\d{6}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"2[13]|3[14]|[4-8]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"3"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"2"
				],
				"0$1"
			]
		],
		"0"
	],
	LB: [
		"961",
		"00",
		"[7-9]\\d{7}|[13-9]\\d{6}",
		[
			7,
			8
		],
		[
			[
				"(\\d)(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[13-69]|7(?:[2-57]|62|8[0-7]|9[04-9])|8[02-9]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[7-9]"
				]
			]
		],
		"0"
	],
	LC: [
		"1",
		"011",
		"(?:[58]\\d\\d|758|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"758"
	],
	LI: [
		"423",
		"00",
		"(?:(?:[2378]|6\\d\\d)\\d|90)\\d{5}",
		[
			7,
			9
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"[237-9]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"6[56]"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"6"
				]
			]
		],
		"0",
		0,
		"0|(10(?:01|20|66))"
	],
	LK: [
		"94",
		"00",
		"(?:[1-7]\\d|[89]1)\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[1-689]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"7"
				],
				"0$1"
			]
		],
		"0"
	],
	LR: [
		"231",
		"00",
		"(?:[25]\\d|33|77|88)\\d{7}|(?:2\\d|[45])\\d{6}",
		[
			7,
			8,
			9
		],
		[
			[
				"(\\d)(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[45]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[23578]"
				],
				"0$1"
			]
		],
		"0"
	],
	LS: [
		"266",
		"00",
		"(?:[256]\\d\\d|800)\\d{5}",
		[
			8
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[2568]"
				]
			]
		]
	],
	LT: [
		"370",
		"00",
		"(?:[3469]\\d|52|[78]0)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"52[0-79]"
				],
				"(8-$1)"
			],
			[
				"(\\d{2})(\\d{6})",
				"$1 $2",
				[
					"37|4(?:[15]|6[1-8])"
				],
				"(8-$1)"
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"[3-6]"
				],
				"(8-$1)"
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"[7-9]"
				],
				"8 $1"
			]
		],
		"8",
		0,
		"[08]",
		0,
		1
	],
	LU: [
		"352",
		"00",
		"[2457-9]\\d{3,10}|3(?:[0-46-9]\\d{2,9}|5(?:[013-9]\\d{1,8}|2\\d{1,3}))|6\\d{8}",
		[
			4,
			5,
			6,
			7,
			8,
			9,
			10,
			11
		],
		[
			[
				"(\\d{2})(\\d{3})",
				"$1 $2",
				[
					"2(?:0[2-689]|[2-9])|3(?:[0-46-9]|5[013-9])|[457]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"2(?:0[2-689]|[2-9])|3(?:[0-46-9]|5[013-9])|[457]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"20[2-689]"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})",
				"$1 $2 $3 $4",
				[
					"2(?:0[1-689]|[367]|4[3-8])"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"80[01]|90[015]"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"20[2-689]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"6"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})(\\d{1,2})",
				"$1 $2 $3 $4 $5",
				[
					"2(?:0[2-689]|[367]|4[3-8])"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{1,5})",
				"$1 $2 $3 $4",
				[
					"2[2-9]|3(?:[0-46-9]|5[013-9])|[457]|8(?:0[2-9]|[13-9])|9(?:0[89]|[2-579])"
				]
			]
		],
		0,
		0,
		"(15(?:0[06]|1[12]|[35]5|4[04]|6[26]|77|88|99)\\d)"
	],
	LV: [
		"371",
		"00",
		"(?:[268]\\d|90)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[269]|8[01]"
				]
			]
		]
	],
	LY: [
		"218",
		"00",
		"(?:[2569]\\d|71)\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{7})",
				"$1-$2",
				[
					"[25-79]"
				],
				"0$1"
			]
		],
		"0"
	],
	MA: [
		"212",
		"00",
		"[5-8]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{6})",
				"$1-$2",
				[
					"5(?:2[015-7]|3[0-4])|[67]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{5})",
				"$1-$2",
				[
					"5(?:2[2-489]|3[5-9]|9)|892",
					"5(?:2(?:[2-48]|9[0-7])|3(?:[5-79]|8[0-7])|9)|892"
				],
				"0$1"
			],
			[
				"(\\d{5})(\\d{4})",
				"$1-$2",
				[
					"5[23]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"5"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{7})",
				"$1-$2",
				[
					"8"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		[
			[
				"5(?:2(?:[015-79]\\d|2[02-9]|3[2-57]|4[2-8]|8[235-7])|3(?:[0-48]\\d|[57][2-9]|6[2-8]|9[3-9])|(?:4[067]|5[03])\\d)\\d{5}"
			],
			[
				"(?:6(?:[0-79]\\d|8[0-247-9])|7(?:0[067]|6[1267]|7[017]))\\d{6}"
			],
			[
				"80\\d{7}"
			],
			[
				"89\\d{7}"
			],
			0,
			0,
			0,
			0,
			[
				"5924[01]\\d{4}"
			]
		]
	],
	MC: [
		"377",
		"00",
		"(?:(?:[349]|6\\d)\\d\\d|870)\\d{5}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[39]"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"4"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4 $5",
				[
					"6"
				],
				"0$1"
			]
		],
		"0"
	],
	MD: [
		"373",
		"00",
		"(?:[235-7]\\d|[89]0)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"22|3"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"[25-7]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"[89]"
				],
				"0$1"
			]
		],
		"0"
	],
	ME: [
		"382",
		"00",
		"(?:20|[3-79]\\d|80\\d?)\\d{6}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[2-9]"
				],
				"0$1"
			]
		],
		"0"
	],
	MF: [
		"590",
		"00",
		"(?:590|69\\d)\\d{6}",
		[
			9
		],
		0,
		"0",
		0,
		0,
		0,
		0,
		0,
		[
			[
				"590(?:0[079]|[14]3|[27][79]|30|5[0-268]|87)\\d{4}"
			],
			[
				"69(?:0\\d\\d|1(?:2[29]|3[0-5]))\\d{4}"
			]
		]
	],
	MG: [
		"261",
		"00",
		"[23]\\d{8}",
		[
			9
		],
		[
			[
				"([23]\\d)(\\d{2})(\\d{3})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[23]"
				]
			]
		],
		"0",
		"0$1"
	],
	MH: [
		"692",
		"011",
		"(?:(?:[256]\\d|45)\\d|329)\\d{4}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1-$2",
				[
					"[2-6]"
				]
			]
		],
		"1"
	],
	MK: [
		"389",
		"00",
		"[2-578]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[347]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d)(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[58]"
				],
				"0$1"
			]
		],
		"0"
	],
	ML: [
		"223",
		"00",
		"(?:[246-9]\\d|50)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[24-79]|8[0239]"
				]
			]
		]
	],
	MM: [
		"95",
		"00",
		"(?:1|[24-7]\\d)\\d{5,7}|8\\d{6,9}|9(?:[0-46-9]\\d{6,8}|5\\d{6})|2\\d{5}",
		[
			6,
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"16|2"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"[45]|6(?:0[23]|[1-689]|7[235-7])|7(?:[0-4]|5[2-7])|8[1-6]"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[12]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[4-7]|8[1-35]"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{4,6})",
				"$1 $2 $3",
				[
					"9(?:2[0-4]|[35-9]|4[137-9])"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"92"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{5})(\\d{4})",
				"$1 $2 $3",
				[
					"9"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"8"
				],
				"0$1"
			]
		],
		"0"
	],
	MN: [
		"976",
		"001",
		"[12]\\d{8,9}|[1257-9]\\d{7}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{4})",
				"$1 $2 $3",
				[
					"[12]1"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[57-9]"
				]
			],
			[
				"(\\d{3})(\\d{5,6})",
				"$1 $2",
				[
					"[12]2[1-3]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{5,6})",
				"$1 $2",
				[
					"[12](?:27|3[2-8]|4[2-68]|5[1-4689])",
					"[12](?:27|3[2-8]|4[2-68]|5[1-4689])[0-3]"
				],
				"0$1"
			],
			[
				"(\\d{5})(\\d{4,5})",
				"$1 $2",
				[
					"[12]"
				],
				"0$1"
			]
		],
		"0"
	],
	MO: [
		"853",
		"00",
		"(?:28|[68]\\d)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[268]"
				]
			]
		]
	],
	MP: [
		"1",
		"011",
		"(?:[58]\\d\\d|(?:67|90)0)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"670"
	],
	MQ: [
		"596",
		"00",
		"(?:596|69\\d)\\d{6}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[56]"
				],
				"0$1"
			]
		],
		"0"
	],
	MR: [
		"222",
		"00",
		"(?:[2-4]\\d\\d|800)\\d{5}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[2-48]"
				]
			]
		]
	],
	MS: [
		"1",
		"011",
		"(?:(?:[58]\\d\\d|900)\\d\\d|66449)\\d{5}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"664"
	],
	MT: [
		"356",
		"00",
		"(?:(?:[2579]\\d\\d|800)\\d|3550)\\d{4}",
		[
			8
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[2357-9]"
				]
			]
		]
	],
	MU: [
		"230",
		"0(?:0|[24-7]0|3[03])",
		"(?:[2-468]|5\\d)\\d{6}",
		[
			7,
			8
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[2-46]|8(?:0[0-2]|14|3[129])"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"5"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"020"
	],
	MV: [
		"960",
		"0(?:0|19)",
		"(?:800|9[0-57-9]\\d)\\d{7}|[34679]\\d{6}",
		[
			7,
			10
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1-$2",
				[
					"[367]|4(?:00|[56])|9[14-9]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[89]"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"00"
	],
	MW: [
		"265",
		"00",
		"1\\d{6}(?:\\d{2})?|(?:[23]1|77|88|99)\\d{7}",
		[
			7,
			9
		],
		[
			[
				"(\\d)(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"1[2-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[17-9]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"3"
				],
				"0$1"
			]
		],
		"0"
	],
	MX: [
		"52",
		"0[09]",
		"(?:1\\d|[2-9])\\d{9}",
		[
			10,
			11
		],
		[
			[
				"([358]\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"33|55|81"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[2467]|3[0-2457-9]|5[089]|8[02-9]|9[0-35-9]"
				]
			],
			[
				"(1)([358]\\d)(\\d{4})(\\d{4})",
				"044 $2 $3 $4",
				[
					"1(?:33|55|81)"
				],
				"$1",
				0,
				"$1 $2 $3 $4"
			],
			[
				"(1)(\\d{3})(\\d{3})(\\d{4})",
				"044 $2 $3 $4",
				[
					"1(?:[2467]|3[0-2457-9]|5[089]|8[2-9]|9[1-35-9])"
				],
				"$1",
				0,
				"$1 $2 $3 $4"
			]
		],
		"01",
		"01 $1",
		"0[12]|04[45](\\d{10})",
		"1$1",
		1
	],
	MY: [
		"60",
		"00",
		"(?:1\\d\\d?|3\\d|[4-9])\\d{7}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1-$2 $3",
				[
					"[4-79]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1-$2 $3",
				[
					"1(?:[0249]|[367][2-9]|8[1-9])|8"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1-$2 $3",
				[
					"3"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1-$2 $3",
				[
					"15"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1-$2 $3",
				[
					"11"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{2})(\\d{4})",
				"$1-$2-$3-$4",
				[
					"1"
				]
			]
		],
		"0"
	],
	MZ: [
		"258",
		"00",
		"(?:2|8\\d)\\d{7}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"2|8[2-7]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"8"
				]
			]
		]
	],
	NA: [
		"264",
		"00",
		"[68]\\d{7,8}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"88"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"6"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"8[0-5]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"8"
				],
				"0$1"
			]
		],
		"0"
	],
	NC: [
		"687",
		"00",
		"[2-57-9]\\d{5}",
		[
			6
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})",
				"$1.$2.$3",
				[
					"[247-9]|3[0-6]|5[0-4]"
				]
			]
		]
	],
	NE: [
		"227",
		"00",
		"[0289]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"09|2[01]|8[04589]|9"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"0"
				]
			]
		]
	],
	NF: [
		"672",
		"00",
		"[13]\\d{5}",
		[
			6
		],
		[
			[
				"(\\d{2})(\\d{4})",
				"$1 $2",
				[
					"1"
				]
			],
			[
				"(\\d)(\\d{5})",
				"$1 $2",
				[
					"3"
				]
			]
		]
	],
	NG: [
		"234",
		"009",
		"[78]\\d{10,13}|[7-9]\\d{9}|[1-9]\\d{7}|[124-7]\\d{6}",
		[
			7,
			8,
			10,
			11,
			12,
			13,
			14
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"78"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[12]|9(?:0[3-9]|[1-9])"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2,3})",
				"$1 $2 $3",
				[
					"[3-7]|8[2-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[7-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{4})(\\d{4,5})",
				"$1 $2 $3",
				[
					"[78]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{5})(\\d{5,6})",
				"$1 $2 $3",
				[
					"[78]"
				],
				"0$1"
			]
		],
		"0"
	],
	NI: [
		"505",
		"00",
		"(?:1800|[25-8]\\d{3})\\d{4}",
		[
			8
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[125-8]"
				]
			]
		]
	],
	NL: [
		"31",
		"00",
		"(?:[124-7]\\d\\d|3(?:[02-9]\\d|1[0-8])|[89]\\d{0,3})\\d{6}|1\\d{4,5}",
		[
			5,
			6,
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d{3})(\\d{4,7})",
				"$1 $2",
				[
					"[89]0"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1[035]|2[0346]|3[03568]|4[0356]|5[0358]|[7-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[1-5]"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{8})",
				"$1 $2",
				[
					"6[1-58]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{7})",
				"$1 $2",
				[
					"6"
				],
				"0$1"
			]
		],
		"0"
	],
	NO: [
		"47",
		"00",
		"(?:0|[2-9]\\d{3})\\d{4}",
		[
			5,
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[235-7]"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"[489]"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		"[02-689]|7[0-8]"
	],
	NP: [
		"977",
		"00",
		"9\\d{9}|[1-9]\\d{7}",
		[
			8,
			10
		],
		[
			[
				"(\\d)(\\d{7})",
				"$1-$2",
				[
					"1[2-6]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{6})",
				"$1-$2",
				[
					"[1-8]|9(?:[1-579]|6[2-6])"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{7})",
				"$1-$2",
				[
					"9"
				]
			]
		],
		"0"
	],
	NR: [
		"674",
		"00",
		"(?:444|55\\d|888)\\d{4}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[458]"
				]
			]
		]
	],
	NU: [
		"683",
		"00",
		"(?:[47]|888\\d)\\d{3}",
		[
			4,
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"8"
				]
			]
		]
	],
	NZ: [
		"64",
		"0(?:0|161)",
		"[28]\\d{7,9}|[346]\\d{7}|(?:508|[79]\\d)\\d{6,7}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1-$2 $3",
				[
					"24|[346]|7[2-57-9]|9[2-9]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"80|9"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"2(?:10|74)|[59]|80"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3,4})(\\d{4})",
				"$1 $2 $3",
				[
					"2[028]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,5})",
				"$1 $2 $3",
				[
					"[278]"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		0,
		"00"
	],
	OM: [
		"968",
		"00",
		"(?:[279]\\d{3}|500|8007\\d?)\\d{4}",
		[
			7,
			8,
			9
		],
		[
			[
				"(\\d{3})(\\d{4,6})",
				"$1 $2",
				[
					"[58]"
				]
			],
			[
				"(\\d{2})(\\d{6})",
				"$1 $2",
				[
					"2"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[79]"
				]
			]
		]
	],
	PA: [
		"507",
		"00",
		"(?:[1-57-9]|6\\d)\\d{6}",
		[
			7,
			8
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1-$2",
				[
					"[1-57-9]"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1-$2",
				[
					"6"
				]
			]
		]
	],
	PE: [
		"51",
		"19(?:1[124]|77|90)00",
		"(?:[14-8]|9\\d)\\d{7}",
		[
			8,
			9
		],
		[
			[
				"(\\d)(\\d{7})",
				"$1 $2",
				[
					"1"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{6})",
				"$1 $2",
				[
					"[4-7]|8[2-4]"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"8"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"9"
				]
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		" Anexo "
	],
	PF: [
		"689",
		"00",
		"[48]\\d{7}|4\\d{5}",
		[
			6,
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"44"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[48]"
				]
			]
		]
	],
	PG: [
		"675",
		"00|140[1-3]",
		"(?:180|[78]\\d{3})\\d{4}|(?:[2-589]\\d|64)\\d{5}",
		[
			7,
			8
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"18|[2-69]|85"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[78]"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"00"
	],
	PH: [
		"63",
		"00",
		"(?:1800\\d{2,4}|2|[89]\\d{4})\\d{5}|[3-8]\\d{8}|[28]\\d{7}",
		[
			6,
			8,
			9,
			10,
			11,
			12,
			13
		],
		[
			[
				"(\\d)(\\d{5})",
				"$1 $2",
				[
					"2"
				],
				"(0$1)"
			],
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"2"
				],
				"(0$1)"
			],
			[
				"(\\d{4})(\\d{4,6})",
				"$1 $2",
				[
					"3(?:23|39|46)|4(?:2[3-6]|[35]9|4[26]|76)|5(?:22|44)|642|8(?:62|8[245])",
					"3(?:230|397|461)|4(?:2(?:35|[46]4|51)|396|4(?:22|63)|59[347]|76[15])|5(?:221|446)|642[23]|8(?:622|8(?:[24]2|5[13]))"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"3[2-68]|4[2-9]|[5-7]|8[2-8]",
					"3(?:[23568]|4(?:[0-57-9]|6[02-8]))|4(?:2(?:[0-689]|7[0-8])|[3-8]|9(?:[0-246-9]|3[1-9]|5[0-57-9]))|[5-7]|8(?:[2-7]|8(?:[0-24-9]|3[0-35-9]))"
				],
				"(0$1)"
			],
			[
				"(\\d{5})(\\d{4})",
				"$1 $2",
				[
					"[34]|88"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[89]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				]
			],
			[
				"(\\d{4})(\\d{1,2})(\\d{3})(\\d{4})",
				"$1 $2 $3 $4",
				[
					"1"
				]
			]
		],
		"0"
	],
	PK: [
		"92",
		"00",
		"(?:122|[24-8]\\d{4,5}|9(?:[013-9]\\d{2,4}|2(?:[01]\\d\\d|2(?:[025-8]\\d|1[01]))\\d))\\d{6}|(?:[2-8]\\d{3}|92(?:[0-7]\\d|8[1-9]))\\d{6}|[24-9]\\d{8}|[89]\\d{7}",
		[
			8,
			9,
			10,
			11,
			12
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{2})",
				"$1 $2 $3",
				[
					"[89]0"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{5})",
				"$1 $2",
				[
					"1"
				]
			],
			[
				"(\\d{2})(\\d{7,8})",
				"$1 $2",
				[
					"(?:2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91)[2-9]"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{6,7})",
				"$1 $2",
				[
					"2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356])|9(?:2[2-8]|3[27-9]|4[2-6]|6[3569]|9[25-8])",
					"(?:2(?:3[2358]|4[2-4]|9[2-8])|45[3479]|54[2-467]|60[468]|72[236]|8(?:2[2-689]|3[23578]|4[3478]|5[2356]))[2-9]|9(?:2(?:2[2-9]|[3-8])|(?:3[27-9]|4[2-6]|6[3569])[2-9]|9(?:[25-7][2-9]|8))"
				],
				"(0$1)"
			],
			[
				"(\\d{5})(\\d{5})",
				"$1 $2",
				[
					"58"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{7})",
				"$1 $2",
				[
					"3"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"2[125]|4[0-246-9]|5[1-35-7]|6[1-8]|7[14]|8[16]|91"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3 $4",
				[
					"[24-9]"
				],
				"(0$1)"
			]
		],
		"0"
	],
	PL: [
		"48",
		"00",
		"[1-9]\\d{6}(?:\\d{2})?|6\\d{5}(?:\\d{2})?",
		[
			6,
			7,
			8,
			9
		],
		[
			[
				"(\\d{5})",
				"$1",
				[
					"19"
				]
			],
			[
				"(\\d{3})(\\d{3})",
				"$1 $2",
				[
					"11|64"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{3})",
				"$1 $2 $3",
				[
					"(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])1",
					"(?:1[2-8]|2[2-69]|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145])19"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{2,3})",
				"$1 $2 $3",
				[
					"64"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"1[2-8]|2|3[2-4]|4[1-468]|5[24-689]|6[1-3578]|7[14-7]|8[1-79]|9[145]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[3-8]"
				]
			]
		]
	],
	PM: [
		"508",
		"00",
		"[45]\\d{5}",
		[
			6
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"[45]"
				],
				"0$1"
			]
		],
		"0"
	],
	PR: [
		"1",
		"011",
		"(?:[589]\\d\\d|787)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"787|939"
	],
	PS: [
		"970",
		"00",
		"(?:(?:1\\d|5)\\d\\d|[2489]2)\\d{6}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[2489]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"5"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"1"
				]
			]
		],
		"0"
	],
	PT: [
		"351",
		"00",
		"(?:[26-9]\\d|30)\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"2[12]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[236-9]"
				]
			]
		]
	],
	PW: [
		"680",
		"01[12]",
		"(?:[25-8]\\d\\d|345|488|900)\\d{4}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[2-9]"
				]
			]
		]
	],
	PY: [
		"595",
		"00",
		"(?:[2-46-9]\\d|5[0-8])\\d{7}|[2-9]\\d{5,7}",
		[
			6,
			7,
			8,
			9
		],
		[
			[
				"(\\d{3})(\\d{3,6})",
				"$1 $2",
				[
					"[2-9]0"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{5})",
				"$1 $2",
				[
					"[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36]"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{4,5})",
				"$1 $2",
				[
					"2[279]|3[13-5]|4[359]|5|6[347]|7[46-8]|85"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[26]1|3[289]|4[1246-8]|7[1-3]|8[1-36]"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[2-7]|85"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{6})",
				"$1 $2",
				[
					"9"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"8"
				]
			]
		],
		"0"
	],
	QA: [
		"974",
		"00",
		"(?:(?:2|[3-7]\\d)\\d\\d|800)\\d{4}",
		[
			7,
			8
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"2[126]|8"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[3-7]"
				]
			]
		]
	],
	RE: [
		"262",
		"00",
		"(?:26|[68]\\d)\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[268]"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		"262|69|8"
	],
	RO: [
		"40",
		"00",
		"(?:[237]\\d|[89]0)\\d{7}|[23]\\d{5}",
		[
			6,
			9
		],
		[
			[
				"(\\d{2})(\\d{4})",
				"$1 $2",
				[
					"219|31"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})",
				"$1 $2",
				[
					"2[3-6]",
					"2[3-6]\\d9"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[23]1"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[237-9]"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		" int "
	],
	RS: [
		"381",
		"00",
		"[127]\\d{6,11}|3(?:[0-79]\\d{5,10}|8(?:[02-9]\\d{4,9}|1\\d{4,5}))|6\\d{7,9}|800\\d{3,9}|90\\d{4,8}|7\\d{5}",
		[
			6,
			7,
			8,
			9,
			10,
			11,
			12
		],
		[
			[
				"(\\d{3})(\\d{3,9})",
				"$1 $2",
				[
					"(?:2[389]|39)0|[7-9]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{5,10})",
				"$1 $2",
				[
					"[1-36]"
				],
				"0$1"
			]
		],
		"0"
	],
	RU: [
		"7",
		"810",
		"[347-9]\\d{9}",
		[
			10
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"7"
				],
				"8 ($1)",
				1
			],
			[
				"(\\d{3})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2-$3-$4",
				[
					"[3489]"
				],
				"8 ($1)",
				1
			]
		],
		"8",
		0,
		0,
		0,
		0,
		"3[04-689]|[489]",
		0,
		"8~10"
	],
	RW: [
		"250",
		"00",
		"(?:06|[27]\\d\\d|[89]00)\\d{6}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"0"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"2"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[7-9]"
				],
				"0$1"
			]
		],
		"0"
	],
	SA: [
		"966",
		"00",
		"(?:(?:[15]|8\\d)\\d|92)\\d{7}",
		[
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"5"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{5})",
				"$1 $2",
				[
					"9"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"81"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"8"
				]
			]
		],
		"0"
	],
	SB: [
		"677",
		"0[01]",
		"(?:[1-6]|[7-9]\\d\\d)\\d{4}",
		[
			5,
			7
		],
		[
			[
				"(\\d{2})(\\d{5})",
				"$1 $2",
				[
					"7[1-9]|8[4-9]|9(?:1[2-9]|2[013-9]|3[0-2]|[46]|5[0-46-9]|7[0-689]|8[0-79]|9[0-8])"
				]
			]
		]
	],
	SC: [
		"248",
		"0(?:[02]|10?)",
		"(?:(?:(?:[24]\\d|64)\\d|971)\\d|8000)\\d{3}",
		[
			7
		],
		[
			[
				"(\\d)(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[246]"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"00"
	],
	SD: [
		"249",
		"00",
		"[19]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[19]"
				],
				"0$1"
			]
		],
		"0"
	],
	SE: [
		"46",
		"00",
		"(?:[26]\\d\\d|9)\\d{9}|[1-9]\\d{8}|[1-689]\\d{7}|[1-4689]\\d{6}|2\\d{5}",
		[
			6,
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{2,3})(\\d{2})",
				"$1-$2 $3",
				[
					"20"
				],
				"0$1",
				0,
				"$1 $2 $3"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2})",
				"$1-$2 $3",
				[
					"[12][136]|3[356]|4[0246]|6[03]|90[1-9]"
				],
				"0$1",
				0,
				"$1 $2 $3"
			],
			[
				"(\\d{3})(\\d{4})",
				"$1-$2",
				[
					"9(?:00|39|44)"
				],
				"0$1",
				0,
				"$1 $2"
			],
			[
				"(\\d)(\\d{2,3})(\\d{2})(\\d{2})",
				"$1-$2 $3 $4",
				[
					"8"
				],
				"0$1",
				0,
				"$1 $2 $3 $4"
			],
			[
				"(\\d{3})(\\d{2,3})(\\d{2})",
				"$1-$2 $3",
				[
					"1[2457]|2(?:[247-9]|5[0138])|3[0247-9]|4[1357-9]|5[0-35-9]|6(?:[125689]|4[02-57]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"
				],
				"0$1",
				0,
				"$1 $2 $3"
			],
			[
				"(\\d{2})(\\d{2,3})(\\d{2})(\\d{2})",
				"$1-$2 $3 $4",
				[
					"1[013689]|2[0136]|3[1356]|4[0246]|54|6[03]|90[1-9]"
				],
				"0$1",
				0,
				"$1 $2 $3 $4"
			],
			[
				"(\\d{3})(\\d{2,3})(\\d{3})",
				"$1-$2 $3",
				[
					"9(?:0|39|44)"
				],
				"0$1",
				0,
				"$1 $2 $3"
			],
			[
				"(\\d)(\\d{3})(\\d{3})(\\d{2})",
				"$1-$2 $3 $4",
				[
					"8"
				],
				"0$1",
				0,
				"$1 $2 $3 $4"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1-$2 $3 $4",
				[
					"[13-5]|2(?:[247-9]|5[0138])|6(?:[124-689]|7[0-2])|9(?:[125-8]|3[02-5]|4[0-3])"
				],
				"0$1",
				0,
				"$1 $2 $3 $4"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1-$2 $3 $4",
				[
					"7"
				],
				"0$1",
				0,
				"$1 $2 $3 $4"
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{3})",
				"$1-$2 $3 $4",
				[
					"9"
				],
				"0$1",
				0,
				"$1 $2 $3 $4"
			],
			[
				"(\\d{3})(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1-$2 $3 $4 $5",
				[
					"[26]"
				],
				"0$1",
				0,
				"$1 $2 $3 $4 $5"
			]
		],
		"0"
	],
	SG: [
		"65",
		"0[0-3]\\d",
		"(?:1\\d{3}|[369]|7000|8(?:\\d{2})?)\\d{7}",
		[
			8,
			10,
			11
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[369]|8[1-8]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"8"
				]
			],
			[
				"(\\d{4})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"1[89]"
				]
			],
			[
				"(\\d{4})(\\d{4})(\\d{3})",
				"$1 $2 $3",
				[
					"70"
				]
			]
		]
	],
	SH: [
		"290",
		"00",
		"(?:[256]\\d|8)\\d{3}",
		[
			4,
			5
		],
		0,
		0,
		0,
		0,
		0,
		0,
		"[256]"
	],
	SI: [
		"386",
		"00",
		"[1-8]\\d{7}|90\\d{4,6}|8\\d{4,6}",
		[
			5,
			6,
			7,
			8
		],
		[
			[
				"(\\d{2})(\\d{3,6})",
				"$1 $2",
				[
					"8[09]|9"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[12]|[34][24-8]|5[2-8]|7[3-8]"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[3467]|51"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"[58]"
				],
				"0$1"
			]
		],
		"0"
	],
	SJ: [
		"47",
		"00",
		"(?:0|(?:[4589]\\d|79)\\d\\d)\\d{4}",
		[
			5,
			8
		],
		0,
		0,
		0,
		0,
		0,
		0,
		"79"
	],
	SK: [
		"421",
		"00",
		"[2-689]\\d{8}|[2-59]\\d{6}|[2-5]\\d{5}",
		[
			6,
			7,
			9
		],
		[
			[
				"(\\d)(\\d{2})(\\d{3,4})",
				"$1 $2 $3",
				[
					"21"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{2})(\\d{2,3})",
				"$1 $2 $3",
				[
					"[3-5][1-8]1",
					"[3-5][1-8]1[67]"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3})(\\d{3})(\\d{2})",
				"$1/$2 $3 $4",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1/$2 $3 $4",
				[
					"[3-5]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[689]"
				],
				"0$1"
			]
		],
		"0"
	],
	SL: [
		"232",
		"00",
		"(?:[2-578]\\d|66|99)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{6})",
				"$1 $2",
				[
					"[2-9]"
				],
				"(0$1)"
			]
		],
		"0"
	],
	SM: [
		"378",
		"00",
		"(?:0549|[5-7]\\d)\\d{6}",
		[
			8,
			10
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[5-7]"
				]
			],
			[
				"(\\d{4})(\\d{6})",
				"$1 $2",
				[
					"0"
				]
			]
		],
		0,
		0,
		"([89]\\d{5})$",
		"0549$1"
	],
	SN: [
		"221",
		"00",
		"(?:[378]\\d{4}|93330)\\d{4}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[379]"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"8"
				]
			]
		]
	],
	SO: [
		"252",
		"00",
		"[346-9]\\d{8}|[12679]\\d{7}|(?:[1-4]\\d|59)\\d{5}|[1348]\\d{5}",
		[
			6,
			7,
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{4})",
				"$1 $2",
				[
					"8[125]"
				]
			],
			[
				"(\\d{6})",
				"$1",
				[
					"[134]"
				]
			],
			[
				"(\\d)(\\d{6})",
				"$1 $2",
				[
					"[15]|2[0-79]|3[0-46-8]|4[0-7]"
				]
			],
			[
				"(\\d)(\\d{7})",
				"$1 $2",
				[
					"24|[67]"
				]
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[348]|64|79[0-8]|90"
				]
			],
			[
				"(\\d{2})(\\d{5,7})",
				"$1 $2",
				[
					"[12679]"
				]
			]
		],
		"0"
	],
	SR: [
		"597",
		"00",
		"(?:[2-5]|68|[78]\\d)\\d{5}",
		[
			6,
			7
		],
		[
			[
				"(\\d{3})(\\d{3})",
				"$1-$2",
				[
					"[2-4]|5[2-58]"
				]
			],
			[
				"(\\d{2})(\\d{2})(\\d{2})",
				"$1-$2-$3",
				[
					"5"
				]
			],
			[
				"(\\d{3})(\\d{4})",
				"$1-$2",
				[
					"[6-8]"
				]
			]
		]
	],
	SS: [
		"211",
		"00",
		"[19]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[19]"
				],
				"0$1"
			]
		],
		"0"
	],
	ST: [
		"239",
		"00",
		"(?:22|9\\d)\\d{5}",
		[
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[29]"
				]
			]
		]
	],
	SV: [
		"503",
		"00",
		"[267]\\d{7}|[89]00\\d{4}(?:\\d{4})?",
		[
			7,
			8,
			11
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[89]"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[267]"
				]
			],
			[
				"(\\d{3})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"[89]"
				]
			]
		]
	],
	SX: [
		"1",
		"011",
		"(?:(?:[58]\\d\\d|900)\\d|7215)\\d{6}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"721"
	],
	SY: [
		"963",
		"00",
		"[1-39]\\d{8}|[1-5]\\d{7}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[1-5]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"9"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		1
	],
	SZ: [
		"268",
		"00",
		"(?:0800|(?:[237]\\d|900)\\d\\d)\\d{4}",
		[
			8,
			9
		],
		[
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[0237]"
				]
			],
			[
				"(\\d{5})(\\d{4})",
				"$1 $2",
				[
					"9"
				]
			]
		]
	],
	TA: [
		"290",
		"00",
		"8\\d{3}",
		[
			4
		],
		0,
		0,
		0,
		0,
		0,
		0,
		"8"
	],
	TC: [
		"1",
		"011",
		"(?:[58]\\d\\d|649|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"649"
	],
	TD: [
		"235",
		"00|16",
		"(?:22|[69]\\d|77)\\d{6}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[2679]"
				]
			]
		],
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"00"
	],
	TG: [
		"228",
		"00",
		"[279]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[279]"
				]
			]
		]
	],
	TH: [
		"66",
		"00[1-9]",
		"(?:1\\d\\d?|[2-57]|[689]\\d)\\d{7}",
		[
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"2"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"14|[3-9]"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"1"
				]
			]
		],
		"0"
	],
	TJ: [
		"992",
		"810",
		"(?:[3-59]\\d|77|88)\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{4})(\\d)(\\d{4})",
				"$1 $2 $3",
				[
					"3(?:[1245]|3[12])",
					"3(?:[1245]|3(?:1[0-689]|2))"
				]
			],
			[
				"(\\d{6})(\\d)(\\d{2})",
				"$1 $2 $3",
				[
					"33"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"4[148]|[578]|9(?:[0235-9]|1[0-69])"
				]
			],
			[
				"(\\d{3})(\\d{2})(\\d{4})",
				"$1 $2 $3",
				[
					"[349]"
				]
			]
		],
		"8",
		0,
		0,
		0,
		1,
		0,
		0,
		"8~10"
	],
	TK: [
		"690",
		"00",
		"[2-47]\\d{3,6}",
		[
			4,
			5,
			6,
			7
		]
	],
	TL: [
		"670",
		"00",
		"(?:[2-4]\\d|7\\d\\d?|[89]0)\\d{5}",
		[
			7,
			8
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[2-489]|70"
				]
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"7"
				]
			]
		]
	],
	TM: [
		"993",
		"810",
		"[1-6]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2-$3-$4",
				[
					"12"
				],
				"(8 $1)"
			],
			[
				"(\\d{2})(\\d{6})",
				"$1 $2",
				[
					"6"
				],
				"8 $1"
			],
			[
				"(\\d{3})(\\d)(\\d{2})(\\d{2})",
				"$1 $2-$3-$4",
				[
					"[1-5]"
				],
				"(8 $1)"
			]
		],
		"8",
		0,
		0,
		0,
		0,
		0,
		0,
		"8~10"
	],
	TN: [
		"216",
		"00",
		"[2-57-9]\\d{7}",
		[
			8
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[2-57-9]"
				]
			]
		]
	],
	TO: [
		"676",
		"00",
		"(?:(?:080|[56])0|[2-4]\\d|[78]\\d(?:\\d{2})?)\\d{3}",
		[
			5,
			7
		],
		[
			[
				"(\\d{2})(\\d{3})",
				"$1-$2",
				[
					"[2-6]|7[014]|8[05]"
				]
			],
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"7[578]|8"
				]
			],
			[
				"(\\d{4})(\\d{3})",
				"$1 $2",
				[
					"0"
				]
			]
		]
	],
	TR: [
		"90",
		"00",
		"(?:[2-58]\\d\\d|900)\\d{7}|4\\d{6}",
		[
			7,
			10
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[2-4]"
				],
				"(0$1)"
			],
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"512|[89]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"5"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		1
	],
	TT: [
		"1",
		"011",
		"(?:[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"868"
	],
	TV: [
		"688",
		"00",
		"(?:2|7\\d\\d|90)\\d{4}",
		[
			5,
			6,
			7
		]
	],
	TW: [
		"886",
		"0(?:0[25-79]|19)",
		"(?:[24589]|7\\d)\\d{8}|[2-8]\\d{7}|2\\d{6}",
		[
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d)(\\d{4})",
				"$1 $2 $3",
				[
					"202"
				],
				"0$1"
			],
			[
				"(\\d)(\\d{3,4})(\\d{4})",
				"$1 $2 $3",
				[
					"[25][2-8]|[346]|7[1-9]|8[27-9]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[258]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"9"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"7"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		0,
		0,
		"#"
	],
	TZ: [
		"255",
		"00[056]",
		"(?:[26-8]\\d|41|90)\\d{7}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[24]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[67]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{2})(\\d{4})",
				"$1 $2 $3",
				[
					"[89]"
				],
				"0$1"
			]
		],
		"0"
	],
	UA: [
		"380",
		"00",
		"[3-9]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"(?:3[1-8]|4[136-8])2|5(?:[12457]2|6[24])|6(?:[12][29]|[49]2|5[24])|[89]0",
					"3(?:[1-46-8]2[013-9]|52)|4(?:[1378]2|62[013-9])|5(?:[12457]2|6[24])|6(?:[12][29]|[49]2|5[24])|[89]0"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{5})",
				"$1 $2",
				[
					"3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6[0135689]|7[4-6])|6[12459]",
					"3[1-8]|4(?:[1367]|[45][6-9]|8[4-6])|5(?:[1-5]|6(?:[015689]|3[02389])|7[4-6])|6[12459]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[35-9]|4(?:[45]|87)"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		0,
		"0~0"
	],
	UG: [
		"256",
		"00[057]",
		"(?:(?:[29]0|[347]\\d)\\d|800)\\d{6}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{7})",
				"$1 $2",
				[
					"3|4(?:[0-5]|6[0-36-9])"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{5})",
				"$1 $2",
				[
					"202",
					"2024"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{6})",
				"$1 $2",
				[
					"[247-9]"
				],
				"0$1"
			]
		],
		"0"
	],
	US: [
		"1",
		"011",
		"[2-9]\\d{9}",
		[
			10
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{4})",
				"($1) $2-$3",
				[
					"[2-9]"
				],
				0,
				1,
				"$1-$2-$3"
			]
		],
		"1",
		0,
		0,
		0,
		0,
		0,
		[
			[
				"(?:2(?:0[1-35-9]|1[02-9]|2[03-589]|3[149]|4[08]|5[1-46]|6[0279]|7[0269]|8[13])|3(?:0[1-57-9]|1[02-9]|2[0135]|3[0-24679]|4[67]|5[12]|6[014]|8[056])|4(?:0[124-9]|1[02-579]|2[3-5]|3[0245]|4[0235]|58|6[39]|7[0589]|8[04])|5(?:0[1-57-9]|1[0235-8]|20|3[0149]|4[01]|5[19]|6[1-47]|7[013-5]|8[056])|6(?:0[1-35-9]|1[024-9]|2[03689]|[34][016]|5[017]|6[0-279]|78|8[0-2])|7(?:0[1-46-8]|1[2-9]|2[04-7]|3[1247]|4[037]|5[47]|6[02359]|7[02-59]|8[156])|8(?:0[1-68]|1[02-8]|2[08]|3[0-28]|4[3578]|5[046-9]|6[02-5]|7[028])|9(?:0[1346-9]|1[02-9]|2[0589]|3[0146-8]|4[0179]|5[12469]|7[0-389]|8[04-69]))[2-9]\\d{6}"
			],
			[
				""
			],
			[
				"8(?:00|33|44|55|66|77|88)[2-9]\\d{6}"
			],
			[
				"900[2-9]\\d{6}"
			],
			[
				"5(?:00|2[12]|33|44|66|77|88)[2-9]\\d{6}"
			],
			0,
			[
				"710[2-9]\\d{6}"
			]
		]
	],
	UY: [
		"598",
		"0(?:0|1[3-9]\\d)",
		"(?:[249]\\d\\d|80)\\d{5}|9\\d{6}",
		[
			7,
			8
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"8|90"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{4})",
				"$1 $2",
				[
					"[24]"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"9"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		0,
		0,
		0,
		"00",
		" int. "
	],
	UZ: [
		"998",
		"810",
		"[679]\\d{8}",
		[
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[679]"
				],
				"8 $1"
			]
		],
		"8",
		0,
		0,
		0,
		0,
		0,
		0,
		"8~10"
	],
	VA: [
		"39",
		"00",
		"0\\d{6}(?:\\d{4})?|3[0-8]\\d{9}|(?:[0138]\\d?|55)\\d{8}|[08]\\d{5}(?:\\d{2})?",
		[
			6,
			7,
			8,
			9,
			10,
			11
		],
		0,
		0,
		0,
		0,
		0,
		0,
		"06698"
	],
	VC: [
		"1",
		"011",
		"(?:[58]\\d\\d|784|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"784"
	],
	VE: [
		"58",
		"00",
		"(?:(?:[24]\\d|50)\\d|[89]00)\\d{7}",
		[
			10
		],
		[
			[
				"(\\d{3})(\\d{7})",
				"$1-$2",
				[
					"[24589]"
				],
				"0$1"
			]
		],
		"0"
	],
	VG: [
		"1",
		"011",
		"(?:284|[58]\\d\\d|900)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"284"
	],
	VI: [
		"1",
		"011",
		"(?:(?:34|90)0|[58]\\d\\d)\\d{7}",
		[
			10
		],
		0,
		"1",
		0,
		0,
		0,
		0,
		"340"
	],
	VN: [
		"84",
		"00",
		"[12]\\d{9}|[135-9]\\d{8}|(?:[16]\\d?|[78])\\d{6}",
		[
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d{2})(\\d{5})",
				"$1 $2",
				[
					"80"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{4,6})",
				"$1 $2",
				[
					"1"
				]
			],
			[
				"(\\d{2})(\\d{3})(\\d{2})(\\d{2})",
				"$1 $2 $3 $4",
				[
					"[69]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[3578]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{4})(\\d{4})",
				"$1 $2 $3",
				[
					"2[48]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{4})(\\d{3})",
				"$1 $2 $3",
				[
					"2"
				],
				"0$1"
			]
		],
		"0",
		0,
		0,
		0,
		1
	],
	VU: [
		"678",
		"00",
		"(?:(?:[23]|(?:[57]\\d|90)\\d)\\d|[48]8)\\d{3}",
		[
			5,
			7
		],
		[
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"[579]"
				]
			]
		]
	],
	WF: [
		"681",
		"00",
		"(?:[45]0|68|72|8\\d)\\d{4}",
		[
			6
		],
		[
			[
				"(\\d{2})(\\d{2})(\\d{2})",
				"$1 $2 $3",
				[
					"[4-8]"
				]
			]
		]
	],
	WS: [
		"685",
		"0",
		"(?:[2-6]|8\\d(?:\\d{4})?)\\d{4}|[78]\\d{6}",
		[
			5,
			6,
			7,
			10
		],
		[
			[
				"(\\d{5})",
				"$1",
				[
					"[2-6]"
				]
			],
			[
				"(\\d{3})(\\d{3,7})",
				"$1 $2",
				[
					"8"
				]
			],
			[
				"(\\d{2})(\\d{5})",
				"$1 $2",
				[
					"7"
				]
			]
		]
	],
	XK: [
		"383",
		"00",
		"(?:[23]\\d{2,3}|4\\d\\d|[89]00)\\d{5}",
		[
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[2-4]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{5})",
				"$1 $2",
				[
					"[89]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[23]"
				],
				"0$1"
			]
		],
		"0"
	],
	YE: [
		"967",
		"00",
		"(?:1|7\\d)\\d{7}|[1-7]\\d{6}",
		[
			7,
			8,
			9
		],
		[
			[
				"(\\d)(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"[1-6]|7[24-68]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"7"
				],
				"0$1"
			]
		],
		"0"
	],
	YT: [
		"262",
		"00",
		"(?:(?:26|63)9|80\\d)\\d{6}",
		[
			9
		],
		0,
		"0",
		0,
		0,
		0,
		0,
		"269|63"
	],
	ZA: [
		"27",
		"00",
		"[1-9]\\d{8}|8\\d{4,7}",
		[
			5,
			6,
			7,
			8,
			9
		],
		[
			[
				"(\\d{2})(\\d{3,4})",
				"$1 $2",
				[
					"8[1-4]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{2,3})",
				"$1 $2 $3",
				[
					"8[1-4]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"860"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"[1-9]"
				],
				"0$1"
			]
		],
		"0"
	],
	ZM: [
		"260",
		"00",
		"(?:(?:21|76|9\\d)\\d|800)\\d{6}",
		[
			9
		],
		[
			[
				"(\\d{3})(\\d{3})(\\d{3})",
				"$1 $2 $3",
				[
					"[28]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{7})",
				"$1 $2",
				[
					"[79]"
				],
				"0$1"
			]
		],
		"0"
	],
	ZW: [
		"263",
		"00",
		"2(?:[0-57-9]\\d{6,8}|6[0-24-9]\\d{6,7})|[38]\\d{9}|[35-8]\\d{8}|[3-6]\\d{7}|[1-689]\\d{6}|[1-3569]\\d{5}|[1356]\\d{4}",
		[
			5,
			6,
			7,
			8,
			9,
			10
		],
		[
			[
				"(\\d)(\\d{3})(\\d{2,4})",
				"$1 $2 $3",
				[
					"[49]"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3,5})",
				"$1 $2",
				[
					"2(?:0[45]|2[278]|[49]8|[78])|3(?:[09]8|17|3[78]|[78])|5[15][78]|6(?:[29]8|37|[68][78]|75)"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{4})",
				"$1 $2",
				[
					"80"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{7})",
				"$1 $2",
				[
					"2(?:[05-79]2|4)|(?:39|5[45]|6[15-8])2|8[13-59]",
					"2(?:02[014]|4|[56]20|[79]2)|392|5(?:42|525)|6(?:[16-8]21|52[013])|8[13-59]"
				],
				"(0$1)"
			],
			[
				"(\\d{2})(\\d{3})(\\d{4})",
				"$1 $2 $3",
				[
					"7"
				],
				"0$1"
			],
			[
				"(\\d{3})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"2(?:1[39]|2[0157]|[378]|[56][14])|3(?:12|29)",
					"2(?:1[39]|2[0157]|[378]|[56][14])|3(?:123|29)"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{6})",
				"$1 $2",
				[
					"8"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3,5})",
				"$1 $2",
				[
					"[136]|2(?:[0-256]|9[0-79])|5[0-35-9]"
				],
				"0$1"
			],
			[
				"(\\d{2})(\\d{3})(\\d{3,4})",
				"$1 $2 $3",
				[
					"29|3|54"
				],
				"0$1"
			],
			[
				"(\\d{4})(\\d{3,5})",
				"$1 $2",
				[
					"[25]"
				],
				"0$1"
			]
		],
		"0"
	],
	"001": [
		"979",
		0,
		"\\d{9}",
		[
			9
		],
		[
			[
				"(\\d)(\\d{4})(\\d{4})",
				"$1 $2 $3"
			]
		]
	]
};
var metadata = {
	version: version,
	country_calling_codes: country_calling_codes,
	countries: countries
};

var semverCompare = function cmp (a, b) {
    var pa = a.split('.');
    var pb = b.split('.');
    for (var i = 0; i < 3; i++) {
        var na = Number(pa[i]);
        var nb = Number(pb[i]);
        if (na > nb) return 1;
        if (nb > na) return -1;
        if (!isNaN(na) && isNaN(nb)) return 1;
        if (isNaN(na) && !isNaN(nb)) return -1;
    }
    return 0;
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Added "idd_prefix" and "default_idd_prefix".
var V3 = '1.2.0';

var DEFAULT_EXT_PREFIX = ' ext. ';

var Metadata = function () {
	function Metadata(metadata) {
		_classCallCheck(this, Metadata);

		validateMetadata(metadata);

		this.metadata = metadata;

		this.v1 = !metadata.version;
		this.v2 = metadata.version !== undefined && semverCompare(metadata.version, V3) === -1;
		this.v3 = metadata.version !== undefined; // && compare(metadata.version, V4) === -1
	}

	_createClass(Metadata, [{
		key: 'hasCountry',
		value: function hasCountry(country) {
			return this.metadata.countries[country] !== undefined;
		}
	}, {
		key: 'country',
		value: function country(_country) {
			if (!_country) {
				this._country = undefined;
				this.country_metadata = undefined;
				return this;
			}

			if (!this.hasCountry(_country)) {
				throw new Error('Unknown country: ' + _country);
			}

			this._country = _country;
			this.country_metadata = this.metadata.countries[_country];
			return this;
		}
	}, {
		key: 'getDefaultCountryMetadataForRegion',
		value: function getDefaultCountryMetadataForRegion() {
			return this.metadata.countries[this.countryCallingCodes()[this.countryCallingCode()][0]];
		}
	}, {
		key: 'countryCallingCode',
		value: function countryCallingCode() {
			return this.country_metadata[0];
		}
	}, {
		key: 'IDDPrefix',
		value: function IDDPrefix() {
			if (this.v1 || this.v2) return;
			return this.country_metadata[1];
		}
	}, {
		key: 'defaultIDDPrefix',
		value: function defaultIDDPrefix() {
			if (this.v1 || this.v2) return;
			return this.country_metadata[12];
		}
	}, {
		key: 'nationalNumberPattern',
		value: function nationalNumberPattern() {
			if (this.v1 || this.v2) return this.country_metadata[1];
			return this.country_metadata[2];
		}
	}, {
		key: 'possibleLengths',
		value: function possibleLengths() {
			if (this.v1) return;
			return this.country_metadata[this.v2 ? 2 : 3];
		}
	}, {
		key: '_getFormats',
		value: function _getFormats(country_metadata) {
			return country_metadata[this.v1 ? 2 : this.v2 ? 3 : 4];
		}

		// For countries of the same region (e.g. NANPA)
		// formats are all stored in the "main" country for that region.
		// E.g. "RU" and "KZ", "US" and "CA".

	}, {
		key: 'formats',
		value: function formats() {
			var _this = this;

			var formats = this._getFormats(this.country_metadata) || this._getFormats(this.getDefaultCountryMetadataForRegion()) || [];
			return formats.map(function (_) {
				return new Format(_, _this);
			});
		}
	}, {
		key: 'nationalPrefix',
		value: function nationalPrefix() {
			return this.country_metadata[this.v1 ? 3 : this.v2 ? 4 : 5];
		}
	}, {
		key: '_getNationalPrefixFormattingRule',
		value: function _getNationalPrefixFormattingRule(country_metadata) {
			return country_metadata[this.v1 ? 4 : this.v2 ? 5 : 6];
		}

		// For countries of the same region (e.g. NANPA)
		// national prefix formatting rule is stored in the "main" country for that region.
		// E.g. "RU" and "KZ", "US" and "CA".

	}, {
		key: 'nationalPrefixFormattingRule',
		value: function nationalPrefixFormattingRule() {
			return this._getNationalPrefixFormattingRule(this.country_metadata) || this._getNationalPrefixFormattingRule(this.getDefaultCountryMetadataForRegion());
		}
	}, {
		key: 'nationalPrefixForParsing',
		value: function nationalPrefixForParsing() {
			// If `national_prefix_for_parsing` is not set explicitly,
			// then infer it from `national_prefix` (if any)
			return this.country_metadata[this.v1 ? 5 : this.v2 ? 6 : 7] || this.nationalPrefix();
		}
	}, {
		key: 'nationalPrefixTransformRule',
		value: function nationalPrefixTransformRule() {
			return this.country_metadata[this.v1 ? 6 : this.v2 ? 7 : 8];
		}
	}, {
		key: '_getNationalPrefixIsOptionalWhenFormatting',
		value: function _getNationalPrefixIsOptionalWhenFormatting() {
			return !!this.country_metadata[this.v1 ? 7 : this.v2 ? 8 : 9];
		}

		// For countries of the same region (e.g. NANPA)
		// "national prefix is optional when parsing" flag is
		// stored in the "main" country for that region.
		// E.g. "RU" and "KZ", "US" and "CA".

	}, {
		key: 'nationalPrefixIsOptionalWhenFormatting',
		value: function nationalPrefixIsOptionalWhenFormatting() {
			return this._getNationalPrefixIsOptionalWhenFormatting(this.country_metadata) || this._getNationalPrefixIsOptionalWhenFormatting(this.getDefaultCountryMetadataForRegion());
		}
	}, {
		key: 'leadingDigits',
		value: function leadingDigits() {
			return this.country_metadata[this.v1 ? 8 : this.v2 ? 9 : 10];
		}
	}, {
		key: 'types',
		value: function types() {
			return this.country_metadata[this.v1 ? 9 : this.v2 ? 10 : 11];
		}
	}, {
		key: 'hasTypes',
		value: function hasTypes() {
			// Versions 1.2.0 - 1.2.4: can be `[]`.
			/* istanbul ignore next */
			if (this.types() && this.types().length === 0) {
				return false;
			}
			// Versions <= 1.2.4: can be `undefined`.
			// Version >= 1.2.5: can be `0`.
			return !!this.types();
		}
	}, {
		key: 'type',
		value: function type(_type) {
			if (this.hasTypes() && getType$1(this.types(), _type)) {
				return new Type(getType$1(this.types(), _type), this);
			}
		}
	}, {
		key: 'ext',
		value: function ext() {
			if (this.v1 || this.v2) return DEFAULT_EXT_PREFIX;
			return this.country_metadata[13] || DEFAULT_EXT_PREFIX;
		}
	}, {
		key: 'countryCallingCodes',
		value: function countryCallingCodes() {
			if (this.v1) return this.metadata.country_phone_code_to_countries;
			return this.metadata.country_calling_codes;
		}

		// Formatting information for regions which share
		// a country calling code is contained by only one region
		// for performance reasons. For example, for NANPA region
		// ("North American Numbering Plan Administration",
		//  which includes USA, Canada, Cayman Islands, Bahamas, etc)
		// it will be contained in the metadata for `US`.
		//
		// `country_calling_code` is always valid.
		// But the actual country may not necessarily be part of the metadata.
		//

	}, {
		key: 'chooseCountryByCountryCallingCode',
		value: function chooseCountryByCountryCallingCode(country_calling_code) {
			var country = this.countryCallingCodes()[country_calling_code][0];

			// Do not want to test this case.
			// (custom metadata, not all countries).
			/* istanbul ignore else */
			if (this.hasCountry(country)) {
				this.country(country);
			}
		}
	}, {
		key: 'selectedCountry',
		value: function selectedCountry() {
			return this._country;
		}
	}]);

	return Metadata;
}();

var Format = function () {
	function Format(format, metadata) {
		_classCallCheck(this, Format);

		this._format = format;
		this.metadata = metadata;
	}

	_createClass(Format, [{
		key: 'pattern',
		value: function pattern() {
			return this._format[0];
		}
	}, {
		key: 'format',
		value: function format() {
			return this._format[1];
		}
	}, {
		key: 'leadingDigitsPatterns',
		value: function leadingDigitsPatterns() {
			return this._format[2] || [];
		}
	}, {
		key: 'nationalPrefixFormattingRule',
		value: function nationalPrefixFormattingRule() {
			return this._format[3] || this.metadata.nationalPrefixFormattingRule();
		}
	}, {
		key: 'nationalPrefixIsOptionalWhenFormatting',
		value: function nationalPrefixIsOptionalWhenFormatting() {
			return !!this._format[4] || this.metadata.nationalPrefixIsOptionalWhenFormatting();
		}
	}, {
		key: 'nationalPrefixIsMandatoryWhenFormatting',
		value: function nationalPrefixIsMandatoryWhenFormatting() {
			// National prefix is omitted if there's no national prefix formatting rule
			// set for this country, or when the national prefix formatting rule
			// contains no national prefix itself, or when this rule is set but
			// national prefix is optional for this phone number format
			// (and it is not enforced explicitly)
			return this.usesNationalPrefix() && !this.nationalPrefixIsOptionalWhenFormatting();
		}

		// Checks whether national prefix formatting rule contains national prefix.

	}, {
		key: 'usesNationalPrefix',
		value: function usesNationalPrefix() {
			return this.nationalPrefixFormattingRule() &&
			// Check that national prefix formatting rule is not a dummy one.
			this.nationalPrefixFormattingRule() !== '$1' &&
			// Check that national prefix formatting rule actually has national prefix digit(s).
			/\d/.test(this.nationalPrefixFormattingRule().replace('$1', ''));
		}
	}, {
		key: 'internationalFormat',
		value: function internationalFormat() {
			return this._format[5] || this.format();
		}
	}]);

	return Format;
}();

var Type = function () {
	function Type(type, metadata) {
		_classCallCheck(this, Type);

		this.type = type;
		this.metadata = metadata;
	}

	_createClass(Type, [{
		key: 'pattern',
		value: function pattern() {
			if (this.metadata.v1) return this.type;
			return this.type[0];
		}
	}, {
		key: 'possibleLengths',
		value: function possibleLengths() {
			if (this.metadata.v1) return;
			return this.type[1] || this.metadata.possibleLengths();
		}
	}]);

	return Type;
}();

function getType$1(types, type) {
	switch (type) {
		case 'FIXED_LINE':
			return types[0];
		case 'MOBILE':
			return types[1];
		case 'TOLL_FREE':
			return types[2];
		case 'PREMIUM_RATE':
			return types[3];
		case 'PERSONAL_NUMBER':
			return types[4];
		case 'VOICEMAIL':
			return types[5];
		case 'UAN':
			return types[6];
		case 'PAGER':
			return types[7];
		case 'VOIP':
			return types[8];
		case 'SHARED_COST':
			return types[9];
	}
}

function validateMetadata(metadata) {
	if (!metadata) {
		throw new Error('[libphonenumber-js] `metadata` argument not passed. Check your arguments.');
	}

	// `country_phone_code_to_countries` was renamed to
	// `country_calling_codes` in `1.0.18`.
	if (!is_object(metadata) || !is_object(metadata.countries) || !is_object(metadata.country_calling_codes) && !is_object(metadata.country_phone_code_to_countries)) {
		throw new Error('[libphonenumber-js] `metadata` argument was passed but it\'s not a valid metadata. Must be an object having `.countries` and `.country_calling_codes` child object properties. Got ' + (is_object(metadata) ? 'an object of shape: { ' + Object.keys(metadata).join(', ') + ' }' : 'a ' + type_of(metadata) + ': ' + metadata) + '.');
	}
}

// Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".
/* istanbul ignore next */
var is_object = function is_object(_) {
	return (typeof _ === 'undefined' ? 'undefined' : _typeof(_)) === 'object';
};

// Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".
/* istanbul ignore next */
var type_of = function type_of(_) {
	return typeof _ === 'undefined' ? 'undefined' : _typeof(_);
};

var CAPTURING_DIGIT_PATTERN = new RegExp('([' + VALID_DIGITS + '])');

/**
 * Pattern that makes it easy to distinguish whether a region has a single
 * international dialing prefix or not. If a region has a single international
 * prefix (e.g. 011 in USA), it will be represented as a string that contains
 * a sequence of ASCII digits, and possibly a tilde, which signals waiting for
 * the tone. If there are multiple available international prefixes in a
 * region, they will be represented as a regex string that always contains one
 * or more characters that are not ASCII digits or a tilde.
 */
var SINGLE_IDD_PREFIX = /^[\d]+(?:[~\u2053\u223C\uFF5E][\d]+)?$/;

// For regions that have multiple IDD prefixes
// a preferred IDD prefix is returned.
function getIDDPrefix(country, metadata) {
	var countryMetadata = new Metadata(metadata);
	countryMetadata.country(country);

	if (SINGLE_IDD_PREFIX.test(countryMetadata.IDDPrefix())) {
		return countryMetadata.IDDPrefix();
	}

	return countryMetadata.defaultIDDPrefix();
}

function stripIDDPrefix(number, country, metadata) {
	if (!country) {
		return;
	}

	// Check if the number is IDD-prefixed.

	var countryMetadata = new Metadata(metadata);
	countryMetadata.country(country);

	var IDDPrefixPattern = new RegExp(countryMetadata.IDDPrefix());

	if (number.search(IDDPrefixPattern) !== 0) {
		return;
	}

	// Strip IDD prefix.
	number = number.slice(number.match(IDDPrefixPattern)[0].length);

	// Some kind of a weird edge case.
	// No explanation from Google given.
	var matchedGroups = number.match(CAPTURING_DIGIT_PATTERN);
	/* istanbul ignore next */
	if (matchedGroups && matchedGroups[1] != null && matchedGroups[1].length > 0) {
		if (matchedGroups[1] === '0') {
			return;
		}
	}

	return number;
}

/**
 * Parses phone number characters from a string.
 * Drops all punctuation leaving only digits and the leading `+` sign (if any).
 * Also converts wide-ascii and arabic-indic numerals to conventional numerals.
 * E.g. in Iraq they don't write `+442323234` but rather `+٤٤٢٣٢٣٢٣٤`.
 * @param  {string} string
 * @return {string}
 * @example
 * ```js
 * parseIncompletePhoneNumber('8 (800) 555')
 * // Outputs '8800555'.
 * parseIncompletePhoneNumber('+7 800 555')
 * // Outputs '+7800555'.
 * ```
 */
function parseIncompletePhoneNumber(string) {
	var result = '';

	// Using `.split('')` here instead of normal `for ... of`
	// because the importing application doesn't neccessarily include an ES6 polyfill.
	// The `.split('')` approach discards "exotic" UTF-8 characters
	// (the ones consisting of four bytes) but digits
	// (including non-European ones) don't fall into that range
	// so such "exotic" characters would be discarded anyway.
	for (var _iterator = string.split(''), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var character = _ref;

		result += parsePhoneNumberCharacter(character, result) || '';
	}

	return result;
}

/**
 * `input-format` `parse()` function.
 * https://github.com/catamphetamine/input-format
 * @param  {string} character - Yet another character from raw input string.
 * @param  {string} value - The value parsed so far.
 * @param  {object} meta - Optional custom use-case-specific metadata.
 * @return {string?} The parsed character.
 */
function parsePhoneNumberCharacter(character, value) {
	// Only allow a leading `+`.
	if (character === '+') {
		// If this `+` is not the first parsed character
		// then discard it.
		if (value) {
			return;
		}

		return '+';
	}

	// Allow digits.
	return parseDigit(character);
}

// `DASHES` will be right after the opening square bracket of the "character class"
var DASHES = '-\u2010-\u2015\u2212\u30FC\uFF0D';
var SLASHES = '\uFF0F/';
var DOTS = '\uFF0E.';
var WHITESPACE = ' \xA0\xAD\u200B\u2060\u3000';
var BRACKETS = '()\uFF08\uFF09\uFF3B\uFF3D\\[\\]';
// export const OPENING_BRACKETS = '(\uFF08\uFF3B\\\['
var TILDES = '~\u2053\u223C\uFF5E';

// Digits accepted in phone numbers
// (ascii, fullwidth, arabic-indic, and eastern arabic digits).
var VALID_DIGITS = '0-9\uFF10-\uFF19\u0660-\u0669\u06F0-\u06F9';

// Regular expression of acceptable punctuation found in phone numbers. This
// excludes punctuation found as a leading character only. This consists of dash
// characters, white space characters, full stops, slashes, square brackets,
// parentheses and tildes. Full-width variants are also present.
var VALID_PUNCTUATION = '' + DASHES + SLASHES + DOTS + WHITESPACE + BRACKETS + TILDES;

var PLUS_CHARS = '+\uFF0B';

// The ITU says the maximum length should be 15,
// but one can find longer numbers in Germany.
var MAX_LENGTH_FOR_NSN = 17;

// The maximum length of the country calling code.
var MAX_LENGTH_COUNTRY_CODE = 3;

// These mappings map a character (key) to a specific digit that should
// replace it for normalization purposes. Non-European digits that
// may be used in phone numbers are mapped to a European equivalent.
//
// E.g. in Iraq they don't write `+442323234` but rather `+٤٤٢٣٢٣٢٣٤`.
//
var DIGITS = {
	'0': '0',
	'1': '1',
	'2': '2',
	'3': '3',
	'4': '4',
	'5': '5',
	'6': '6',
	'7': '7',
	'8': '8',
	'9': '9',
	'\uFF10': '0', // Fullwidth digit 0
	'\uFF11': '1', // Fullwidth digit 1
	'\uFF12': '2', // Fullwidth digit 2
	'\uFF13': '3', // Fullwidth digit 3
	'\uFF14': '4', // Fullwidth digit 4
	'\uFF15': '5', // Fullwidth digit 5
	'\uFF16': '6', // Fullwidth digit 6
	'\uFF17': '7', // Fullwidth digit 7
	'\uFF18': '8', // Fullwidth digit 8
	'\uFF19': '9', // Fullwidth digit 9
	'\u0660': '0', // Arabic-indic digit 0
	'\u0661': '1', // Arabic-indic digit 1
	'\u0662': '2', // Arabic-indic digit 2
	'\u0663': '3', // Arabic-indic digit 3
	'\u0664': '4', // Arabic-indic digit 4
	'\u0665': '5', // Arabic-indic digit 5
	'\u0666': '6', // Arabic-indic digit 6
	'\u0667': '7', // Arabic-indic digit 7
	'\u0668': '8', // Arabic-indic digit 8
	'\u0669': '9', // Arabic-indic digit 9
	'\u06F0': '0', // Eastern-Arabic digit 0
	'\u06F1': '1', // Eastern-Arabic digit 1
	'\u06F2': '2', // Eastern-Arabic digit 2
	'\u06F3': '3', // Eastern-Arabic digit 3
	'\u06F4': '4', // Eastern-Arabic digit 4
	'\u06F5': '5', // Eastern-Arabic digit 5
	'\u06F6': '6', // Eastern-Arabic digit 6
	'\u06F7': '7', // Eastern-Arabic digit 7
	'\u06F8': '8', // Eastern-Arabic digit 8
	'\u06F9': '9' // Eastern-Arabic digit 9
};

function parseDigit(character) {
	return DIGITS[character];
}

// Parses a formatted phone number
// and returns `{ countryCallingCode, number }`
// where `number` is just the "number" part
// which is left after extracting `countryCallingCode`
// and is not necessarily a "national (significant) number"
// and might as well contain national prefix.
//
function extractCountryCallingCode(number, country, metadata) {
	number = parseIncompletePhoneNumber(number);

	if (!number) {
		return {};
	}

	// If this is not an international phone number,
	// then don't extract country phone code.
	if (number[0] !== '+') {
		// Convert an "out-of-country" dialing phone number
		// to a proper international phone number.
		var numberWithoutIDD = stripIDDPrefix(number, country, metadata);

		// If an IDD prefix was stripped then
		// convert the number to international one
		// for subsequent parsing.
		if (numberWithoutIDD && numberWithoutIDD !== number) {
			number = '+' + numberWithoutIDD;
		} else {
			return { number: number };
		}
	}

	// Fast abortion: country codes do not begin with a '0'
	if (number[1] === '0') {
		return {};
	}

	metadata = new Metadata(metadata);

	// The thing with country phone codes
	// is that they are orthogonal to each other
	// i.e. there's no such country phone code A
	// for which country phone code B exists
	// where B starts with A.
	// Therefore, while scanning digits,
	// if a valid country code is found,
	// that means that it is the country code.
	//
	var i = 2;
	while (i - 1 <= MAX_LENGTH_COUNTRY_CODE && i <= number.length) {
		var countryCallingCode = number.slice(1, i);

		if (metadata.countryCallingCodes()[countryCallingCode]) {
			return {
				countryCallingCode: countryCallingCode,
				number: number.slice(i)
			};
		}

		i++;
	}

	return {};
}

// Checks whether the entire input sequence can be matched
// against the regular expression.
function matches_entirely() {
	var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
	var regular_expression = arguments[1];

	return new RegExp('^(?:' + regular_expression + ')$').test(text);
}

// The RFC 3966 format for extensions.
var RFC3966_EXTN_PREFIX = ';ext=';

// Pattern to capture digits used in an extension.
// Places a maximum length of '7' for an extension.
var CAPTURING_EXTN_DIGITS = '([' + VALID_DIGITS + ']{1,7})';

/**
 * Regexp of all possible ways to write extensions, for use when parsing. This
 * will be run as a case-insensitive regexp match. Wide character versions are
 * also provided after each ASCII version. There are three regular expressions
 * here. The first covers RFC 3966 format, where the extension is added using
 * ';ext='. The second more generic one starts with optional white space and
 * ends with an optional full stop (.), followed by zero or more spaces/tabs
 * /commas and then the numbers themselves. The other one covers the special
 * case of American numbers where the extension is written with a hash at the
 * end, such as '- 503#'. Note that the only capturing groups should be around
 * the digits that you want to capture as part of the extension, or else parsing
 * will fail! We allow two options for representing the accented o - the
 * character itself, and one in the unicode decomposed form with the combining
 * acute accent.
 */
function create_extension_pattern(purpose) {
	// One-character symbols that can be used to indicate an extension.
	var single_extension_characters = 'x\uFF58#\uFF03~\uFF5E';

	switch (purpose) {
		// For parsing, we are slightly more lenient in our interpretation than for matching. Here we
		// allow "comma" and "semicolon" as possible extension indicators. When matching, these are
		case 'parsing':
			single_extension_characters = ',;' + single_extension_characters;
	}

	return RFC3966_EXTN_PREFIX + CAPTURING_EXTN_DIGITS + '|' + '[ \xA0\\t,]*' + '(?:e?xt(?:ensi(?:o\u0301?|\xF3))?n?|\uFF45?\uFF58\uFF54\uFF4E?|' +
	// "доб."
	'\u0434\u043E\u0431|' + '[' + single_extension_characters + ']|int|anexo|\uFF49\uFF4E\uFF54)' + '[:\\.\uFF0E]?[ \xA0\\t,-]*' + CAPTURING_EXTN_DIGITS + '#?|' + '[- ]+([' + VALID_DIGITS + ']{1,5})#';
}

function getCountryCallingCode (country, metadata) {
	metadata = new Metadata(metadata);

	if (!metadata.hasCountry(country)) {
		throw new Error('Unknown country: ' + country);
	}

	return metadata.country(country).countryCallingCode();
}

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// https://www.ietf.org/rfc/rfc3966.txt

/**
 * @param  {string} text - Phone URI (RFC 3966).
 * @return {object} `{ ?number, ?ext }`.
 */
function parseRFC3966(text) {
	var number = void 0;
	var ext = void 0;

	// Replace "tel:" with "tel=" for parsing convenience.
	text = text.replace(/^tel:/, 'tel=');

	for (var _iterator = text.split(';'), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var part = _ref;

		var _part$split = part.split('='),
		    _part$split2 = _slicedToArray(_part$split, 2),
		    name = _part$split2[0],
		    value = _part$split2[1];

		switch (name) {
			case 'tel':
				number = value;
				break;
			case 'ext':
				ext = value;
				break;
			case 'phone-context':
				// Only "country contexts" are supported.
				// "Domain contexts" are ignored.
				if (value[0] === '+') {
					number = value + number;
				}
				break;
		}
	}

	// If the phone number is not viable, then abort.
	if (!is_viable_phone_number(number)) {
		return {};
	}

	var result = { number: number };
	if (ext) {
		result.ext = ext;
	}
	return result;
}

/**
 * @param  {object} - `{ ?number, ?extension }`.
 * @return {string} Phone URI (RFC 3966).
 */
function formatRFC3966(_ref2) {
	var number = _ref2.number,
	    ext = _ref2.ext;

	if (!number) {
		return '';
	}

	if (number[0] !== '+') {
		throw new Error('"formatRFC3966()" expects "number" to be in E.164 format.');
	}

	return 'tel:' + number + (ext ? ';ext=' + ext : '');
}

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof$1 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

// The minimum length of the national significant number.
var MIN_LENGTH_FOR_NSN = 2;

// We don't allow input strings for parsing to be longer than 250 chars.
// This prevents malicious input from consuming CPU.
var MAX_INPUT_STRING_LENGTH = 250;

/**
 * Regexp of all possible ways to write extensions, for use when parsing. This
 * will be run as a case-insensitive regexp match. Wide character versions are
 * also provided after each ASCII version. There are three regular expressions
 * here. The first covers RFC 3966 format, where the extension is added using
 * ';ext='. The second more generic one starts with optional white space and
 * ends with an optional full stop (.), followed by zero or more spaces/tabs
 * /commas and then the numbers themselves. The other one covers the special
 * case of American numbers where the extension is written with a hash at the
 * end, such as '- 503#'. Note that the only capturing groups should be around
 * the digits that you want to capture as part of the extension, or else parsing
 * will fail! We allow two options for representing the accented o - the
 * character itself, and one in the unicode decomposed form with the combining
 * acute accent.
 */
var EXTN_PATTERNS_FOR_PARSING = create_extension_pattern('parsing');

// Regexp of all known extension prefixes used by different regions followed by
// 1 or more valid digits, for use when parsing.
var EXTN_PATTERN = new RegExp('(?:' + EXTN_PATTERNS_FOR_PARSING + ')$', 'i');

//  Regular expression of viable phone numbers. This is location independent.
//  Checks we have at least three leading digits, and only valid punctuation,
//  alpha characters and digits in the phone number. Does not include extension
//  data. The symbol 'x' is allowed here as valid punctuation since it is often
//  used as a placeholder for carrier codes, for example in Brazilian phone
//  numbers. We also allow multiple '+' characters at the start.
//
//  Corresponds to the following:
//  [digits]{minLengthNsn}|
//  plus_sign*
//  (([punctuation]|[star])*[digits]){3,}([punctuation]|[star]|[digits]|[alpha])*
//
//  The first reg-ex is to allow short numbers (two digits long) to be parsed if
//  they are entered as "15" etc, but only if there is no punctuation in them.
//  The second expression restricts the number of digits to three or more, but
//  then allows them to be in international form, and to have alpha-characters
//  and punctuation. We split up the two reg-exes here and combine them when
//  creating the reg-ex VALID_PHONE_NUMBER_PATTERN itself so we can prefix it
//  with ^ and append $ to each branch.
//
//  "Note VALID_PUNCTUATION starts with a -,
//   so must be the first in the range" (c) Google devs.
//  (wtf did they mean by saying that; probably nothing)
//
var MIN_LENGTH_PHONE_NUMBER_PATTERN = '[' + VALID_DIGITS + ']{' + MIN_LENGTH_FOR_NSN + '}';
//
// And this is the second reg-exp:
// (see MIN_LENGTH_PHONE_NUMBER_PATTERN for a full description of this reg-exp)
//
var VALID_PHONE_NUMBER = '[' + PLUS_CHARS + ']{0,1}' + '(?:' + '[' + VALID_PUNCTUATION + ']*' + '[' + VALID_DIGITS + ']' + '){3,}' + '[' + VALID_PUNCTUATION + VALID_DIGITS + ']*';

// The combined regular expression for valid phone numbers:
//
var VALID_PHONE_NUMBER_PATTERN = new RegExp(
// Either a short two-digit-only phone number
'^' + MIN_LENGTH_PHONE_NUMBER_PATTERN + '$' + '|' +
// Or a longer fully parsed phone number (min 3 characters)
'^' + VALID_PHONE_NUMBER +
// Phone number extensions
'(?:' + EXTN_PATTERNS_FOR_PARSING + ')?' + '$', 'i');

// This consists of the plus symbol, digits, and arabic-indic digits.
var PHONE_NUMBER_START_PATTERN = new RegExp('[' + PLUS_CHARS + VALID_DIGITS + ']');

// Regular expression of trailing characters that we want to remove.
var AFTER_PHONE_NUMBER_END_PATTERN = new RegExp('[^' + VALID_DIGITS + ']+$');

var default_options = {
	country: {}

	// `options`:
	//  {
	//    country:
	//    {
	//      restrict - (a two-letter country code)
	//                 the phone number must be in this country
	//
	//      default - (a two-letter country code)
	//                default country to use for phone number parsing and validation
	//                (if no country code could be derived from the phone number)
	//    }
	//  }
	//
	// Returns `{ country, number }`
	//
	// Example use cases:
	//
	// ```js
	// parse('8 (800) 555-35-35', 'RU')
	// parse('8 (800) 555-35-35', 'RU', metadata)
	// parse('8 (800) 555-35-35', { country: { default: 'RU' } })
	// parse('8 (800) 555-35-35', { country: { default: 'RU' } }, metadata)
	// parse('+7 800 555 35 35')
	// parse('+7 800 555 35 35', metadata)
	// ```
	//
};function parse(arg_1, arg_2, arg_3, arg_4) {
	var _sort_out_arguments = sort_out_arguments(arg_1, arg_2, arg_3, arg_4),
	    text = _sort_out_arguments.text,
	    options = _sort_out_arguments.options,
	    metadata = _sort_out_arguments.metadata;

	// Validate `defaultCountry`.


	if (options.defaultCountry && !metadata.hasCountry(options.defaultCountry)) {
		if (options.v2) {
			throw new Error('INVALID_COUNTRY');
		}
		throw new Error('Unknown country: ' + options.defaultCountry);
	}

	// Parse the phone number.

	var _parse_input = parse_input(text, options.v2),
	    formatted_phone_number = _parse_input.number,
	    ext = _parse_input.ext;

	// If the phone number is not viable then return nothing.


	if (!formatted_phone_number) {
		if (options.v2) {
			throw new Error('NOT_A_NUMBER');
		}
		return {};
	}

	var _parse_phone_number = parse_phone_number(formatted_phone_number, options.defaultCountry, metadata),
	    country = _parse_phone_number.country,
	    nationalNumber = _parse_phone_number.national_number,
	    countryCallingCode = _parse_phone_number.countryCallingCode,
	    carrierCode = _parse_phone_number.carrierCode;

	if (!metadata.selectedCountry()) {
		if (options.v2) {
			throw new Error('INVALID_COUNTRY');
		}
		return {};
	}

	// Validate national (significant) number length.
	if (nationalNumber.length < MIN_LENGTH_FOR_NSN) {
		// Won't throw here because the regexp already demands length > 1.
		/* istanbul ignore if */
		if (options.v2) {
			throw new Error('TOO_SHORT');
		}
		// Google's demo just throws an error in this case.
		return {};
	}

	// Validate national (significant) number length.
	//
	// A sidenote:
	//
	// They say that sometimes national (significant) numbers
	// can be longer than `MAX_LENGTH_FOR_NSN` (e.g. in Germany).
	// https://github.com/googlei18n/libphonenumber/blob/7e1748645552da39c4e1ba731e47969d97bdb539/resources/phonenumber.proto#L36
	// Such numbers will just be discarded.
	//
	if (nationalNumber.length > MAX_LENGTH_FOR_NSN) {
		if (options.v2) {
			throw new Error('TOO_LONG');
		}
		// Google's demo just throws an error in this case.
		return {};
	}

	if (options.v2) {
		var phoneNumber = new PhoneNumber(countryCallingCode, nationalNumber, metadata.metadata);

		if (country) {
			phoneNumber.country = country;
		}
		if (carrierCode) {
			phoneNumber.carrierCode = carrierCode;
		}
		if (ext) {
			phoneNumber.ext = ext;
		}

		return phoneNumber;
	}

	// Check if national phone number pattern matches the number.
	// National number pattern is different for each country,
	// even for those ones which are part of the "NANPA" group.
	var valid = country && matches_entirely(nationalNumber, metadata.nationalNumberPattern()) ? true : false;

	if (!options.extended) {
		return valid ? result(country, nationalNumber, ext) : {};
	}

	return {
		country: country,
		countryCallingCode: countryCallingCode,
		carrierCode: carrierCode,
		valid: valid,
		possible: valid ? true : options.extended === true && metadata.possibleLengths() && is_possible_number(nationalNumber, countryCallingCode !== undefined, metadata),
		phone: nationalNumber,
		ext: ext
	};
}

// Checks to see if the string of characters could possibly be a phone number at
// all. At the moment, checks to see that the string begins with at least 2
// digits, ignoring any punctuation commonly found in phone numbers. This method
// does not require the number to be normalized in advance - but does assume
// that leading non-number symbols have been removed, such as by the method
// `extract_possible_number`.
//
function is_viable_phone_number(number) {
	return number.length >= MIN_LENGTH_FOR_NSN && VALID_PHONE_NUMBER_PATTERN.test(number);
}

/**
 * Extracts a parseable phone number.
 * @param  {string} text - Input.
 * @return {string}.
 */
function extract_formatted_phone_number(text, v2) {
	if (!text) {
		return;
	}

	if (text.length > MAX_INPUT_STRING_LENGTH) {
		if (v2) {
			throw new Error('TOO_LONG');
		}
		return;
	}

	// Attempt to extract a possible number from the string passed in

	var starts_at = text.search(PHONE_NUMBER_START_PATTERN);

	if (starts_at < 0) {
		return;
	}

	return text
	// Trim everything to the left of the phone number
	.slice(starts_at)
	// Remove trailing non-numerical characters
	.replace(AFTER_PHONE_NUMBER_END_PATTERN, '');
}

// Strips any national prefix (such as 0, 1) present in the number provided.
// "Carrier codes" are only used  in Colombia and Brazil,
// and only when dialing within those countries from a mobile phone to a fixed line number.
function strip_national_prefix_and_carrier_code(number, metadata) {
	if (!number || !metadata.nationalPrefixForParsing()) {
		return { number: number };
	}

	// Attempt to parse the first digits as a national prefix
	var national_prefix_pattern = new RegExp('^(?:' + metadata.nationalPrefixForParsing() + ')');
	var national_prefix_matcher = national_prefix_pattern.exec(number);

	// If no national prefix is present in the phone number,
	// but the national prefix is optional for this country,
	// then consider this phone number valid.
	//
	// Google's reference `libphonenumber` implementation
	// wouldn't recognize such phone numbers as valid,
	// but I think it would perfectly make sense
	// to consider such phone numbers as valid
	// because if a national phone number was originally
	// formatted without the national prefix
	// then it must be parseable back into the original national number.
	// In other words, `parse(format(number))`
	// must always be equal to `number`.
	//
	if (!national_prefix_matcher) {
		return { number: number };
	}

	var national_significant_number = void 0;

	// `national_prefix_for_parsing` capturing groups
	// (used only for really messy cases: Argentina, Brazil, Mexico, Somalia)
	var captured_groups_count = national_prefix_matcher.length - 1;

	// If the national number tranformation is needed then do it.
	//
	// `national_prefix_matcher[captured_groups_count]` means that
	// the corresponding captured group is not empty.
	// It can be empty if it's optional.
	// Example: "0?(?:...)?" for Argentina.
	//
	if (metadata.nationalPrefixTransformRule() && national_prefix_matcher[captured_groups_count]) {
		national_significant_number = number.replace(national_prefix_pattern, metadata.nationalPrefixTransformRule());
	}
	// Else, no transformation is necessary,
	// and just strip the national prefix.
	else {
			national_significant_number = number.slice(national_prefix_matcher[0].length);
		}

	var carrierCode = void 0;
	if (captured_groups_count > 0) {
		carrierCode = national_prefix_matcher[1];
	}

	// The following is done in `get_country_and_national_number_for_local_number()` instead.
	//
	// // Verify the parsed national (significant) number for this country
	// const national_number_rule = new RegExp(metadata.nationalNumberPattern())
	// //
	// // If the original number (before stripping national prefix) was viable,
	// // and the resultant number is not, then prefer the original phone number.
	// // This is because for some countries (e.g. Russia) the same digit could be both
	// // a national prefix and a leading digit of a valid national phone number,
	// // like `8` is the national prefix for Russia and both
	// // `8 800 555 35 35` and `800 555 35 35` are valid numbers.
	// if (matches_entirely(number, national_number_rule) &&
	// 		!matches_entirely(national_significant_number, national_number_rule))
	// {
	// 	return number
	// }

	// Return the parsed national (significant) number
	return {
		number: national_significant_number,
		carrierCode: carrierCode
	};
}

function find_country_code(country_calling_code, national_phone_number, metadata) {
	// Is always non-empty, because `country_calling_code` is always valid
	var possible_countries = metadata.countryCallingCodes()[country_calling_code];

	// If there's just one country corresponding to the country code,
	// then just return it, without further phone number digits validation.
	if (possible_countries.length === 1) {
		return possible_countries[0];
	}

	return _find_country_code(possible_countries, national_phone_number, metadata.metadata);
}

// Changes `metadata` `country`.
function _find_country_code(possible_countries, national_phone_number, metadata) {
	metadata = new Metadata(metadata);

	for (var _iterator = possible_countries, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var country = _ref;

		metadata.country(country);

		// Leading digits check would be the simplest one
		if (metadata.leadingDigits()) {
			if (national_phone_number && national_phone_number.search(metadata.leadingDigits()) === 0) {
				return country;
			}
		}
		// Else perform full validation with all of those
		// fixed-line/mobile/etc regular expressions.
		else if (get_number_type({ phone: national_phone_number, country: country }, metadata.metadata)) {
				return country;
			}
	}
}

// Sort out arguments
function sort_out_arguments(arg_1, arg_2, arg_3, arg_4) {
	var text = void 0;
	var options = void 0;
	var metadata = void 0;

	// If the phone number is passed as a string.
	// `parse('88005553535', ...)`.
	if (typeof arg_1 === 'string') {
		text = arg_1;
	} else throw new TypeError('A phone number for parsing must be a string.');

	// If "default country" argument is being passed
	// then move it to `options`.
	// `parse('88005553535', 'RU', [options], metadata)`.
	if ((typeof arg_2 === 'undefined' ? 'undefined' : _typeof$1(arg_2)) !== 'object') {
		if (arg_4) {
			options = _extends({ defaultCountry: arg_2 }, arg_3);
			metadata = arg_4;
		} else {
			options = { defaultCountry: arg_2 };
			metadata = arg_3;
		}
	}
	// No "default country" argument is being passed.
	// International phone number is passed.
	// `parse('+78005553535', [options], metadata)`.
	else {
			if (arg_3) {
				options = arg_2;
				metadata = arg_3;
			} else {
				metadata = arg_2;
			}
		}

	// Apply default options.
	if (options) {
		options = _extends({}, default_options, options);
	} else {
		options = default_options;
	}

	return { text: text, options: options, metadata: new Metadata(metadata) };
}

// Strips any extension (as in, the part of the number dialled after the call is
// connected, usually indicated with extn, ext, x or similar) from the end of
// the number, and returns it.
function strip_extension(number) {
	var start = number.search(EXTN_PATTERN);
	if (start < 0) {
		return {};
	}

	// If we find a potential extension, and the number preceding this is a viable
	// number, we assume it is an extension.
	var number_without_extension = number.slice(0, start);
	/* istanbul ignore if - seems a bit of a redundant check */
	if (!is_viable_phone_number(number_without_extension)) {
		return {};
	}

	var matches = number.match(EXTN_PATTERN);
	var i = 1;
	while (i < matches.length) {
		if (matches[i] != null && matches[i].length > 0) {
			return {
				number: number_without_extension,
				ext: matches[i]
			};
		}
		i++;
	}
}

/**
 * @param  {string} text - Input.
 * @return {object} `{ ?number, ?ext }`.
 */
function parse_input(text, v2) {
	// Parse RFC 3966 phone number URI.
	if (text && text.indexOf('tel:') === 0) {
		return parseRFC3966(text);
	}

	var number = extract_formatted_phone_number(text, v2);

	// If the phone number is not viable, then abort.
	if (!number || !is_viable_phone_number(number)) {
		return {};
	}

	// Attempt to parse extension first, since it doesn't require region-specific
	// data and we want to have the non-normalised number here.
	var with_extension_stripped = strip_extension(number);
	if (with_extension_stripped.ext) {
		return with_extension_stripped;
	}

	return { number: number };
}

/**
 * Creates `parse()` result object.
 */
function result(country, national_number, ext) {
	var result = {
		country: country,
		phone: national_number
	};

	if (ext) {
		result.ext = ext;
	}

	return result;
}

/**
 * Parses a viable phone number.
 * Returns `{ country, countryCallingCode, national_number }`.
 */
function parse_phone_number(formatted_phone_number, default_country, metadata) {
	var _extractCountryCallin = extractCountryCallingCode(formatted_phone_number, default_country, metadata.metadata),
	    countryCallingCode = _extractCountryCallin.countryCallingCode,
	    number = _extractCountryCallin.number;

	if (!number) {
		return { countryCallingCode: countryCallingCode };
	}

	var country = void 0;

	if (countryCallingCode) {
		metadata.chooseCountryByCountryCallingCode(countryCallingCode);
	} else if (default_country) {
		metadata.country(default_country);
		country = default_country;
		countryCallingCode = getCountryCallingCode(default_country, metadata.metadata);
	} else return {};

	var _parse_national_numbe = parse_national_number(number, metadata),
	    national_number = _parse_national_numbe.national_number,
	    carrier_code = _parse_national_numbe.carrier_code;

	// Sometimes there are several countries
	// corresponding to the same country phone code
	// (e.g. NANPA countries all having `1` country phone code).
	// Therefore, to reliably determine the exact country,
	// national (significant) number should have been parsed first.
	//
	// When `metadata.json` is generated, all "ambiguous" country phone codes
	// get their countries populated with the full set of
	// "phone number type" regular expressions.
	//


	var exactCountry = find_country_code(countryCallingCode, national_number, metadata);
	if (exactCountry) {
		country = exactCountry;
		metadata.country(country);
	}

	return {
		country: country,
		countryCallingCode: countryCallingCode,
		national_number: national_number,
		carrierCode: carrier_code
	};
}

function parse_national_number(number, metadata) {
	var national_number = parseIncompletePhoneNumber(number);
	var carrier_code = void 0;

	// Only strip national prefixes for non-international phone numbers
	// because national prefixes can't be present in international phone numbers.
	// Otherwise, while forgiving, it would parse a NANPA number `+1 1877 215 5230`
	// first to `1877 215 5230` and then, stripping the leading `1`, to `877 215 5230`,
	// and then it would assume that's a valid number which it isn't.
	// So no forgiveness for grandmas here.
	// The issue asking for this fix:
	// https://github.com/catamphetamine/libphonenumber-js/issues/159

	var _strip_national_prefi = strip_national_prefix_and_carrier_code(national_number, metadata),
	    potential_national_number = _strip_national_prefi.number,
	    carrierCode = _strip_national_prefi.carrierCode;

	// If metadata has "possible lengths" then employ the new algorythm.


	if (metadata.possibleLengths()) {
		// We require that the NSN remaining after stripping the national prefix and
		// carrier code be long enough to be a possible length for the region.
		// Otherwise, we don't do the stripping, since the original number could be
		// a valid short number.
		switch (check_number_length_for_type(potential_national_number, undefined, metadata)) {
			case 'TOO_SHORT':
			// case 'IS_POSSIBLE_LOCAL_ONLY':
			case 'INVALID_LENGTH':
				break;
			default:
				national_number = potential_national_number;
				carrier_code = carrierCode;
		}
	} else {
		// If the original number (before stripping national prefix) was viable,
		// and the resultant number is not, then prefer the original phone number.
		// This is because for some countries (e.g. Russia) the same digit could be both
		// a national prefix and a leading digit of a valid national phone number,
		// like `8` is the national prefix for Russia and both
		// `8 800 555 35 35` and `800 555 35 35` are valid numbers.
		if (matches_entirely(national_number, metadata.nationalNumberPattern()) && !matches_entirely(potential_national_number, metadata.nationalNumberPattern())) ; else {
			national_number = potential_national_number;
			carrier_code = carrierCode;
		}
	}

	return {
		national_number: national_number,
		carrier_code: carrier_code
	};
}

// Determines the country for a given (possibly incomplete) phone number.
// export function get_country_from_phone_number(number, metadata)
// {
// 	return parse_phone_number(number, null, metadata).country
// }

var _typeof$2 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var non_fixed_line_types = ['MOBILE', 'PREMIUM_RATE', 'TOLL_FREE', 'SHARED_COST', 'VOIP', 'PERSONAL_NUMBER', 'PAGER', 'UAN', 'VOICEMAIL'];

// Finds out national phone number type (fixed line, mobile, etc)
function get_number_type(arg_1, arg_2, arg_3, arg_4) {
	var _sort_out_arguments = sort_out_arguments$1(arg_1, arg_2, arg_3, arg_4),
	    input = _sort_out_arguments.input,
	    options = _sort_out_arguments.options,
	    metadata = _sort_out_arguments.metadata;

	// When `parse()` returned `{}`
	// meaning that the phone number is not a valid one.


	if (!input.country) {
		return;
	}

	if (!metadata.hasCountry(input.country)) {
		throw new Error('Unknown country: ' + input.country);
	}

	var nationalNumber = options.v2 ? input.nationalNumber : input.phone;
	metadata.country(input.country);

	// The following is copy-pasted from the original function:
	// https://github.com/googlei18n/libphonenumber/blob/3ea547d4fbaa2d0b67588904dfa5d3f2557c27ff/javascript/i18n/phonenumbers/phonenumberutil.js#L2835

	// Is this national number even valid for this country
	if (!matches_entirely(nationalNumber, metadata.nationalNumberPattern())) {
		return;
	}

	// Is it fixed line number
	if (is_of_type(nationalNumber, 'FIXED_LINE', metadata)) {
		// Because duplicate regular expressions are removed
		// to reduce metadata size, if "mobile" pattern is ""
		// then it means it was removed due to being a duplicate of the fixed-line pattern.
		//
		if (metadata.type('MOBILE') && metadata.type('MOBILE').pattern() === '') {
			return 'FIXED_LINE_OR_MOBILE';
		}

		// v1 metadata.
		// Legacy.
		// Deprecated.
		if (!metadata.type('MOBILE')) {
			return 'FIXED_LINE_OR_MOBILE';
		}

		// Check if the number happens to qualify as both fixed line and mobile.
		// (no such country in the minimal metadata set)
		/* istanbul ignore if */
		if (is_of_type(nationalNumber, 'MOBILE', metadata)) {
			return 'FIXED_LINE_OR_MOBILE';
		}

		return 'FIXED_LINE';
	}

	for (var _iterator = non_fixed_line_types, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var _type = _ref;

		if (is_of_type(nationalNumber, _type, metadata)) {
			return _type;
		}
	}
}

function is_of_type(nationalNumber, type, metadata) {
	type = metadata.type(type);

	if (!type || !type.pattern()) {
		return false;
	}

	// Check if any possible number lengths are present;
	// if so, we use them to avoid checking
	// the validation pattern if they don't match.
	// If they are absent, this means they match
	// the general description, which we have
	// already checked before a specific number type.
	if (type.possibleLengths() && type.possibleLengths().indexOf(nationalNumber.length) < 0) {
		return false;
	}

	return matches_entirely(nationalNumber, type.pattern());
}

// Sort out arguments
function sort_out_arguments$1(arg_1, arg_2, arg_3, arg_4) {
	var input = void 0;
	var options = {};
	var metadata = void 0;

	// If the phone number is passed as a string.
	// `getNumberType('88005553535', ...)`.
	if (typeof arg_1 === 'string') {
		// If "default country" argument is being passed
		// then convert it to an `options` object.
		// `getNumberType('88005553535', 'RU', metadata)`.
		if ((typeof arg_2 === 'undefined' ? 'undefined' : _typeof$2(arg_2)) !== 'object') {
			if (arg_4) {
				options = arg_3;
				metadata = arg_4;
			} else {
				metadata = arg_3;
			}

			// `parse` extracts phone numbers from raw text,
			// therefore it will cut off all "garbage" characters,
			// while this `validate` function needs to verify
			// that the phone number contains no "garbage"
			// therefore the explicit `is_viable_phone_number` check.
			if (is_viable_phone_number(arg_1)) {
				input = parse(arg_1, arg_2, metadata);
			} else {
				input = {};
			}
		}
		// No "resrict country" argument is being passed.
		// International phone number is passed.
		// `getNumberType('+78005553535', metadata)`.
		else {
				if (arg_3) {
					options = arg_2;
					metadata = arg_3;
				} else {
					metadata = arg_2;
				}

				// `parse` extracts phone numbers from raw text,
				// therefore it will cut off all "garbage" characters,
				// while this `validate` function needs to verify
				// that the phone number contains no "garbage"
				// therefore the explicit `is_viable_phone_number` check.
				if (is_viable_phone_number(arg_1)) {
					input = parse(arg_1, metadata);
				} else {
					input = {};
				}
			}
	}
	// If the phone number is passed as a parsed phone number.
	// `getNumberType({ phone: '88005553535', country: 'RU' }, ...)`.
	else if (is_object$1(arg_1)) {
			input = arg_1;

			if (arg_3) {
				options = arg_2;
				metadata = arg_3;
			} else {
				metadata = arg_2;
			}
		} else throw new TypeError('A phone number must either be a string or an object of shape { phone, [country] }.');

	return { input: input, options: options, metadata: new Metadata(metadata) };
}

// Should only be called for the "new" metadata which has "possible lengths".
function check_number_length_for_type(nationalNumber, type, metadata) {
	var type_info = metadata.type(type);

	// There should always be "<possiblePengths/>" set for every type element.
	// This is declared in the XML schema.
	// For size efficiency, where a sub-description (e.g. fixed-line)
	// has the same "<possiblePengths/>" as the "general description", this is missing,
	// so we fall back to the "general description". Where no numbers of the type
	// exist at all, there is one possible length (-1) which is guaranteed
	// not to match the length of any real phone number.
	var possible_lengths = type_info && type_info.possibleLengths() || metadata.possibleLengths();
	// let local_lengths    = type_info && type.possibleLengthsLocal() || metadata.possibleLengthsLocal()

	if (type === 'FIXED_LINE_OR_MOBILE') {
		// No such country in metadata.
		/* istanbul ignore next */
		if (!metadata.type('FIXED_LINE')) {
			// The rare case has been encountered where no fixedLine data is available
			// (true for some non-geographical entities), so we just check mobile.
			return check_number_length_for_type(nationalNumber, 'MOBILE', metadata);
		}

		var mobile_type = metadata.type('MOBILE');

		if (mobile_type) {
			// Merge the mobile data in if there was any. "Concat" creates a new
			// array, it doesn't edit possible_lengths in place, so we don't need a copy.
			// Note that when adding the possible lengths from mobile, we have
			// to again check they aren't empty since if they are this indicates
			// they are the same as the general desc and should be obtained from there.
			possible_lengths = merge_arrays(possible_lengths, mobile_type.possibleLengths());
			// The current list is sorted; we need to merge in the new list and
			// re-sort (duplicates are okay). Sorting isn't so expensive because
			// the lists are very small.

			// if (local_lengths)
			// {
			// 	local_lengths = merge_arrays(local_lengths, mobile_type.possibleLengthsLocal())
			// }
			// else
			// {
			// 	local_lengths = mobile_type.possibleLengthsLocal()
			// }
		}
	}
	// If the type doesn't exist then return 'INVALID_LENGTH'.
	else if (type && !type_info) {
			return 'INVALID_LENGTH';
		}

	var actual_length = nationalNumber.length;

	// In `libphonenumber-js` all "local-only" formats are dropped for simplicity.
	// // This is safe because there is never an overlap beween the possible lengths
	// // and the local-only lengths; this is checked at build time.
	// if (local_lengths && local_lengths.indexOf(nationalNumber.length) >= 0)
	// {
	// 	return 'IS_POSSIBLE_LOCAL_ONLY'
	// }

	var minimum_length = possible_lengths[0];

	if (minimum_length === actual_length) {
		return 'IS_POSSIBLE';
	}

	if (minimum_length > actual_length) {
		return 'TOO_SHORT';
	}

	if (possible_lengths[possible_lengths.length - 1] < actual_length) {
		return 'TOO_LONG';
	}

	// We skip the first element since we've already checked it.
	return possible_lengths.indexOf(actual_length, 1) >= 0 ? 'IS_POSSIBLE' : 'INVALID_LENGTH';
}

// Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".
/* istanbul ignore next */
var is_object$1 = function is_object(_) {
	return (typeof _ === 'undefined' ? 'undefined' : _typeof$2(_)) === 'object';
};

function merge_arrays(a, b) {
	var merged = a.slice();

	for (var _iterator2 = b, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
		var _ref2;

		if (_isArray2) {
			if (_i2 >= _iterator2.length) break;
			_ref2 = _iterator2[_i2++];
		} else {
			_i2 = _iterator2.next();
			if (_i2.done) break;
			_ref2 = _i2.value;
		}

		var element = _ref2;

		if (a.indexOf(element) < 0) {
			merged.push(element);
		}
	}

	return merged.sort(function (a, b) {
		return a - b;
	});

	// ES6 version, requires Set polyfill.
	// let merged = new Set(a)
	// for (const element of b)
	// {
	// 	merged.add(i)
	// }
	// return Array.from(merged).sort((a, b) => a - b)
}

/**
 * Checks if a given phone number is possible.
 * Which means it only checks phone number length
 * and doesn't test any regular expressions.
 *
 * Examples:
 *
 * ```js
 * isPossibleNumber('+78005553535', metadata)
 * isPossibleNumber('8005553535', 'RU', metadata)
 * isPossibleNumber('88005553535', 'RU', metadata)
 * isPossibleNumber({ phone: '8005553535', country: 'RU' }, metadata)
 * ```
 */
function isPossibleNumber(arg_1, arg_2, arg_3, arg_4) {
	var _sort_out_arguments = sort_out_arguments$1(arg_1, arg_2, arg_3, arg_4),
	    input = _sort_out_arguments.input,
	    options = _sort_out_arguments.options,
	    metadata = _sort_out_arguments.metadata;

	if (options.v2) {
		if (!input.countryCallingCode) {
			throw new Error('Invalid phone number object passed');
		}
		metadata.chooseCountryByCountryCallingCode(input.countryCallingCode);
	} else {
		if (!input.phone) {
			return false;
		}
		if (input.country) {
			if (!metadata.hasCountry(input.country)) {
				throw new Error('Unknown country: ' + input.country);
			}
			metadata.country(input.country);
		} else {
			if (!input.countryCallingCode) {
				throw new Error('Invalid phone number object passed');
			}
			metadata.chooseCountryByCountryCallingCode(input.countryCallingCode);
		}
	}

	if (!metadata.possibleLengths()) {
		throw new Error('Metadata too old');
	}

	return is_possible_number(input.phone || input.nationalNumber, undefined, metadata);
}

function is_possible_number(national_number, is_international, metadata) {
	switch (check_number_length_for_type(national_number, undefined, metadata)) {
		case 'IS_POSSIBLE':
			return true;
		// case 'IS_POSSIBLE_LOCAL_ONLY':
		// 	return !is_international
		default:
			return false;
	}
}

/**
 * Checks if a given phone number is valid.
 *
 * If the `number` is a string, it will be parsed to an object,
 * but only if it contains only valid phone number characters (including punctuation).
 * If the `number` is an object, it is used as is.
 *
 * The optional `defaultCountry` argument is the default country.
 * I.e. it does not restrict to just that country,
 * e.g. in those cases where several countries share
 * the same phone numbering rules (NANPA, Britain, etc).
 * For example, even though the number `07624 369230`
 * belongs to the Isle of Man ("IM" country code)
 * calling `isValidNumber('07624369230', 'GB', metadata)`
 * still returns `true` because the country is not restricted to `GB`,
 * it's just that `GB` is the default one for the phone numbering rules.
 * For restricting the country see `isValidNumberForRegion()`
 * though restricting a country might not be a good idea.
 * https://github.com/googlei18n/libphonenumber/blob/master/FAQ.md#when-should-i-use-isvalidnumberforregion
 *
 * Examples:
 *
 * ```js
 * isValidNumber('+78005553535', metadata)
 * isValidNumber('8005553535', 'RU', metadata)
 * isValidNumber('88005553535', 'RU', metadata)
 * isValidNumber({ phone: '8005553535', country: 'RU' }, metadata)
 * ```
 */
function isValidNumber(arg_1, arg_2, arg_3, arg_4) {
  var _sort_out_arguments = sort_out_arguments$1(arg_1, arg_2, arg_3, arg_4),
      input = _sort_out_arguments.input,
      options = _sort_out_arguments.options,
      metadata = _sort_out_arguments.metadata;

  // This is just to support `isValidNumber({})`
  // for cases when `parseNumber()` returns `{}`.


  if (!input.country) {
    return false;
  }

  if (!metadata.hasCountry(input.country)) {
    throw new Error('Unknown country: ' + input.country);
  }

  metadata.country(input.country);

  // By default, countries only have type regexps when it's required for
  // distinguishing different countries having the same `countryCallingCode`.
  if (metadata.hasTypes()) {
    return get_number_type(input, options, metadata.metadata) !== undefined;
  }

  // If there are no type regexps for this country in metadata then use
  // `nationalNumberPattern` as a "better than nothing" replacement.
  var national_number = options.v2 ? input.nationalNumber : input.phone;
  return matches_entirely(national_number, metadata.nationalNumberPattern());
}

var _typeof$3 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends$1 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var defaultOptions = {
	formatExtension: function formatExtension(number, extension, metadata) {
		return '' + number + metadata.ext() + extension;
	}

	// Formats a phone number
	//
	// Example use cases:
	//
	// ```js
	// format('8005553535', 'RU', 'INTERNATIONAL')
	// format('8005553535', 'RU', 'INTERNATIONAL', metadata)
	// format({ phone: '8005553535', country: 'RU' }, 'INTERNATIONAL')
	// format({ phone: '8005553535', country: 'RU' }, 'INTERNATIONAL', metadata)
	// format('+78005553535', 'NATIONAL')
	// format('+78005553535', 'NATIONAL', metadata)
	// ```
	//
};function format(arg_1, arg_2, arg_3, arg_4, arg_5) {
	var _sort_out_arguments = sort_out_arguments$2(arg_1, arg_2, arg_3, arg_4, arg_5),
	    input = _sort_out_arguments.input,
	    format_type = _sort_out_arguments.format_type,
	    options = _sort_out_arguments.options,
	    metadata = _sort_out_arguments.metadata;

	if (input.country) {
		// Validate `input.country`.
		if (!metadata.hasCountry(input.country)) {
			throw new Error('Unknown country: ' + input.country);
		}
		metadata.country(input.country);
	} else if (input.countryCallingCode) {
		metadata.chooseCountryByCountryCallingCode(input.countryCallingCode);
	} else return input.phone || '';

	var countryCallingCode = metadata.countryCallingCode();

	var nationalNumber = options.v2 ? input.nationalNumber : input.phone;

	// This variable should have been declared inside `case`s
	// but Babel has a bug and it says "duplicate variable declaration".
	var number = void 0;

	switch (format_type) {
		case 'INTERNATIONAL':
			// Legacy argument support.
			// (`{ country: ..., phone: '' }`)
			if (!nationalNumber) {
				return '+' + countryCallingCode;
			}
			number = format_national_number(nationalNumber, 'INTERNATIONAL', metadata);
			number = '+' + countryCallingCode + ' ' + number;
			return add_extension(number, input.ext, metadata, options.formatExtension);

		case 'E.164':
			// `E.164` doesn't define "phone number extensions".
			return '+' + countryCallingCode + nationalNumber;

		case 'RFC3966':
			return formatRFC3966({
				number: '+' + countryCallingCode + nationalNumber,
				ext: input.ext
			});

		case 'IDD':
			if (!options.fromCountry) {
				return;
				// throw new Error('`fromCountry` option not passed for IDD-prefixed formatting.')
			}
			var IDDPrefix = getIDDPrefix(options.fromCountry, metadata.metadata);
			if (!IDDPrefix) {
				return;
			}
			if (options.humanReadable) {
				var formattedForSameCountryCallingCode = countryCallingCode && formatIDDSameCountryCallingCodeNumber(nationalNumber, metadata.countryCallingCode(), options.fromCountry, metadata);
				if (formattedForSameCountryCallingCode) {
					number = formattedForSameCountryCallingCode;
				} else {
					number = IDDPrefix + ' ' + countryCallingCode + ' ' + format_national_number(nationalNumber, 'INTERNATIONAL', metadata);
				}
				return add_extension(number, input.ext, metadata, options.formatExtension);
			}
			return '' + IDDPrefix + countryCallingCode + nationalNumber;

		case 'NATIONAL':
			// Legacy argument support.
			// (`{ country: ..., phone: '' }`)
			if (!nationalNumber) {
				return '';
			}
			number = format_national_number(nationalNumber, 'NATIONAL', metadata);
			return add_extension(number, input.ext, metadata, options.formatExtension);
	}
}

// This was originally set to $1 but there are some countries for which the
// first group is not used in the national pattern (e.g. Argentina) so the $1
// group does not match correctly.  Therefore, we use \d, so that the first
// group actually used in the pattern will be matched.
var FIRST_GROUP_PATTERN = /(\$\d)/;

function format_national_number_using_format(number, format, useInternationalFormat, includeNationalPrefixForNationalFormat, metadata) {
	var formattedNumber = number.replace(new RegExp(format.pattern()), useInternationalFormat ? format.internationalFormat() : format.nationalPrefixFormattingRule() && (!format.nationalPrefixIsOptionalWhenFormatting() || includeNationalPrefixForNationalFormat) ? format.format().replace(FIRST_GROUP_PATTERN, format.nationalPrefixFormattingRule()) : format.format());

	if (useInternationalFormat) {
		return changeInternationalFormatStyle(formattedNumber);
	}

	return formattedNumber;
}

function format_national_number(number, format_as, metadata) {
	var format = choose_format_for_number(metadata.formats(), number);
	if (!format) {
		return number;
	}
	return format_national_number_using_format(number, format, format_as === 'INTERNATIONAL', true, metadata);
}

function choose_format_for_number(available_formats, national_number) {
	for (var _iterator = available_formats, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
		var _ref;

		if (_isArray) {
			if (_i >= _iterator.length) break;
			_ref = _iterator[_i++];
		} else {
			_i = _iterator.next();
			if (_i.done) break;
			_ref = _i.value;
		}

		var _format = _ref;

		// Validate leading digits
		if (_format.leadingDigitsPatterns().length > 0) {
			// The last leading_digits_pattern is used here, as it is the most detailed
			var last_leading_digits_pattern = _format.leadingDigitsPatterns()[_format.leadingDigitsPatterns().length - 1];

			// If leading digits don't match then move on to the next phone number format
			if (national_number.search(last_leading_digits_pattern) !== 0) {
				continue;
			}
		}

		// Check that the national number matches the phone number format regular expression
		if (matches_entirely(national_number, _format.pattern())) {
			return _format;
		}
	}
}

// Removes brackets and replaces dashes with spaces.
//
// E.g. "(999) 111-22-33" -> "999 111 22 33"
//
// For some reason Google's metadata contains `<intlFormat/>`s with brackets and dashes.
// Meanwhile, there's no single opinion about using punctuation in international phone numbers.
//
// For example, Google's `<intlFormat/>` for USA is `+1 213-373-4253`.
// And here's a quote from WikiPedia's "North American Numbering Plan" page:
// https://en.wikipedia.org/wiki/North_American_Numbering_Plan
//
// "The country calling code for all countries participating in the NANP is 1.
// In international format, an NANP number should be listed as +1 301 555 01 00,
// where 301 is an area code (Maryland)."
//
// I personally prefer the international format without any punctuation.
// For example, brackets are remnants of the old age, meaning that the
// phone number part in brackets (so called "area code") can be omitted
// if dialing within the same "area".
// And hyphens were clearly introduced for splitting local numbers into memorizable groups.
// For example, remembering "5553535" is difficult but "555-35-35" is much simpler.
// Imagine a man taking a bus from home to work and seeing an ad with a phone number.
// He has a couple of seconds to memorize that number until it passes by.
// If it were spaces instead of hyphens the man wouldn't necessarily get it,
// but with hyphens instead of spaces the grouping is more explicit.
// I personally think that hyphens introduce visual clutter,
// so I prefer replacing them with spaces in international numbers.
// In the modern age all output is done on displays where spaces are clearly distinguishable
// so hyphens can be safely replaced with spaces without losing any legibility.
//
function changeInternationalFormatStyle(local) {
	return local.replace(new RegExp('[' + VALID_PUNCTUATION + ']+', 'g'), ' ').trim();
}

// Sort out arguments
function sort_out_arguments$2(arg_1, arg_2, arg_3, arg_4, arg_5) {
	var input = void 0;
	var format_type = void 0;
	var options = void 0;
	var metadata = void 0;

	// Sort out arguments.

	// If the phone number is passed as a string.
	// `format('8005553535', ...)`.
	if (typeof arg_1 === 'string') {
		// If country code is supplied.
		// `format('8005553535', 'RU', 'NATIONAL', [options], metadata)`.
		if (typeof arg_3 === 'string') {
			format_type = arg_3;

			if (arg_5) {
				options = arg_4;
				metadata = arg_5;
			} else {
				metadata = arg_4;
			}

			input = parse(arg_1, { defaultCountry: arg_2, extended: true }, metadata);
		}
		// Just an international phone number is supplied
		// `format('+78005553535', 'NATIONAL', [options], metadata)`.
		else {
				if (typeof arg_2 !== 'string') {
					throw new Error('`format` argument not passed to `formatNumber(number, format)`');
				}

				format_type = arg_2;

				if (arg_4) {
					options = arg_3;
					metadata = arg_4;
				} else {
					metadata = arg_3;
				}

				input = parse(arg_1, { extended: true }, metadata);
			}
	}
	// If the phone number is passed as a parsed number object.
	// `format({ phone: '8005553535', country: 'RU' }, 'NATIONAL', [options], metadata)`.
	else if (is_object$2(arg_1)) {
			input = arg_1;
			format_type = arg_2;

			if (arg_4) {
				options = arg_3;
				metadata = arg_4;
			} else {
				metadata = arg_3;
			}
		} else throw new TypeError('A phone number must either be a string or an object of shape { phone, [country] }.');

	if (format_type === 'International') {
		format_type = 'INTERNATIONAL';
	} else if (format_type === 'National') {
		format_type = 'NATIONAL';
	}

	// Validate `format_type`.
	switch (format_type) {
		case 'E.164':
		case 'INTERNATIONAL':
		case 'NATIONAL':
		case 'RFC3966':
		case 'IDD':
			break;
		default:
			throw new Error('Unknown format type argument passed to "format()": "' + format_type + '"');
	}

	// Apply default options.
	if (options) {
		options = _extends$1({}, defaultOptions, options);
	} else {
		options = defaultOptions;
	}

	return { input: input, format_type: format_type, options: options, metadata: new Metadata(metadata) };
}

// Babel transforms `typeof` into some "branches"
// so istanbul will show this as "branch not covered".
/* istanbul ignore next */
var is_object$2 = function is_object(_) {
	return (typeof _ === 'undefined' ? 'undefined' : _typeof$3(_)) === 'object';
};

function add_extension(number, ext, metadata, formatExtension) {
	return ext ? formatExtension(number, ext, metadata) : number;
}

function formatIDDSameCountryCallingCodeNumber(number, toCountryCallingCode, fromCountry, toCountryMetadata) {
	var fromCountryMetadata = new Metadata(toCountryMetadata.metadata);
	fromCountryMetadata.country(fromCountry);

	// If calling within the same country calling code.
	if (toCountryCallingCode === fromCountryMetadata.countryCallingCode()) {
		// For NANPA regions, return the national format for these regions
		// but prefix it with the country calling code.
		if (toCountryCallingCode === '1') {
			return toCountryCallingCode + ' ' + format_national_number(number, 'NATIONAL', toCountryMetadata);
		}

		// If regions share a country calling code, the country calling code need
		// not be dialled. This also applies when dialling within a region, so this
		// if clause covers both these cases. Technically this is the case for
		// dialling from La Reunion to other overseas departments of France (French
		// Guiana, Martinique, Guadeloupe), but not vice versa - so we don't cover
		// this edge case for now and for those cases return the version including
		// country calling code. Details here:
		// http://www.petitfute.com/voyage/225-info-pratiques-reunion
		//
		return format_national_number(number, 'NATIONAL', toCountryMetadata);
	}
}

var _extends$2 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$1 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$1(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var PhoneNumber = function () {
	function PhoneNumber(countryCallingCode, nationalNumber, metadata) {
		_classCallCheck$1(this, PhoneNumber);

		if (!countryCallingCode) {
			throw new TypeError('`countryCallingCode` not passed');
		}
		if (!nationalNumber) {
			throw new TypeError('`nationalNumber` not passed');
		}
		// If country code is passed then derive `countryCallingCode` from it.
		// Also store the country code as `.country`.
		if (isCountryCode(countryCallingCode)) {
			this.country = countryCallingCode;
			var _metadata = new Metadata(metadata);
			_metadata.country(countryCallingCode);
			countryCallingCode = _metadata.countryCallingCode();
		}
		this.countryCallingCode = countryCallingCode;
		this.nationalNumber = nationalNumber;
		this.number = '+' + this.countryCallingCode + this.nationalNumber;
		this.metadata = metadata;
	}

	_createClass$1(PhoneNumber, [{
		key: 'isPossible',
		value: function isPossible() {
			return isPossibleNumber(this, { v2: true }, this.metadata);
		}
	}, {
		key: 'isValid',
		value: function isValid() {
			return isValidNumber(this, { v2: true }, this.metadata);
		}
	}, {
		key: 'getType',
		value: function getType() {
			return get_number_type(this, { v2: true }, this.metadata);
		}
	}, {
		key: 'format',
		value: function format$$1(_format, options) {
			return format(this, _format, options ? _extends$2({}, options, { v2: true }) : { v2: true }, this.metadata);
		}
	}, {
		key: 'formatNational',
		value: function formatNational(options) {
			return this.format('NATIONAL', options);
		}
	}, {
		key: 'formatInternational',
		value: function formatInternational(options) {
			return this.format('INTERNATIONAL', options);
		}
	}, {
		key: 'getURI',
		value: function getURI(options) {
			return this.format('RFC3966', options);
		}
	}]);

	return PhoneNumber;
}();


var isCountryCode = function isCountryCode(value) {
	return (/^[A-Z]{2}$/.test(value)
	);
};

var _typeof$4 = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function parsePhoneNumber(text, defaultCountry, metadata) {
	if (isObject$1(defaultCountry)) {
		metadata = defaultCountry;
		defaultCountry = undefined;
	}
	return parse(text, { defaultCountry: defaultCountry, v2: true }, metadata);
}

// so istanbul will show this as "branch not covered".
/* istanbul ignore next */
var isObject$1 = function isObject(_) {
	return (typeof _ === 'undefined' ? 'undefined' : _typeof$4(_)) === 'object';
};

/** Returns a regular expression quantifier with an upper and lower limit. */
function limit(lower, upper) {
	if (lower < 0 || upper <= 0 || upper < lower) {
		throw new TypeError();
	}
	return "{" + lower + "," + upper + "}";
}

/**
 * Trims away any characters after the first match of {@code pattern} in {@code candidate},
 * returning the trimmed version.
 */
function trimAfterFirstMatch(regexp, string) {
	var index = string.search(regexp);

	if (index >= 0) {
		return string.slice(0, index);
	}

	return string;
}

function startsWith(string, substring) {
	return string.indexOf(substring) === 0;
}

function endsWith(string, substring) {
	return string.indexOf(substring, string.length - substring.length) === string.length - substring.length;
}

// Regular expression of characters typically used to start a second phone number for the purposes
// of parsing. This allows us to strip off parts of the number that are actually the start of
// another number, such as for: (530) 583-6985 x302/x2303 -> the second extension here makes this
// actually two phone numbers, (530) 583-6985 x302 and (530) 583-6985 x2303. We remove the second
// extension so that the first number is parsed correctly.
//
// Matches a slash (\ or /) followed by a space followed by an `x`.
//
var SECOND_NUMBER_START_PATTERN = /[\\/] *x/;

function parsePreCandidate(candidate) {
	// Check for extra numbers at the end.
	// TODO: This is the place to start when trying to support extraction of multiple phone number
	// from split notations (+41 79 123 45 67 / 68).
	return trimAfterFirstMatch(SECOND_NUMBER_START_PATTERN, candidate);
}

// Matches strings that look like dates using "/" as a separator.
// Examples: 3/10/2011, 31/10/96 or 08/31/95.
var SLASH_SEPARATED_DATES = /(?:(?:[0-3]?\d\/[01]?\d)|(?:[01]?\d\/[0-3]?\d))\/(?:[12]\d)?\d{2}/;

// Matches timestamps.
// Examples: "2012-01-02 08:00".
// Note that the reg-ex does not include the
// trailing ":\d\d" -- that is covered by TIME_STAMPS_SUFFIX.
var TIME_STAMPS = /[12]\d{3}[-/]?[01]\d[-/]?[0-3]\d +[0-2]\d$/;
var TIME_STAMPS_SUFFIX_LEADING = /^:[0-5]\d/;

function isValidPreCandidate(candidate, offset, text) {
	// Skip a match that is more likely to be a date.
	if (SLASH_SEPARATED_DATES.test(candidate)) {
		return false;
	}

	// Skip potential time-stamps.
	if (TIME_STAMPS.test(candidate)) {
		var followingText = text.slice(offset + candidate.length);
		if (TIME_STAMPS_SUFFIX_LEADING.test(followingText)) {
			return false;
		}
	}

	return true;
}

// Javascript doesn't support UTF-8 regular expressions.
// So mimicking them here.

// Copy-pasted from `PhoneNumberMatcher.js`.

/**
 * "\p{Z}" is any kind of whitespace or invisible separator ("Separator").
 * http://www.regular-expressions.info/unicode.html
 * "\P{Z}" is the reverse of "\p{Z}".
 * "\p{N}" is any kind of numeric character in any script ("Number").
 * "\p{Nd}" is a digit zero through nine in any script except "ideographic scripts" ("Decimal_Digit_Number").
 * "\p{Sc}" is a currency symbol ("Currency_Symbol").
 * "\p{L}" is any kind of letter from any language ("Letter").
 * "\p{Mn}" is "non-spacing mark".
 *
 * Javascript doesn't support Unicode Regular Expressions
 * so substituting it with this explicit set of characters.
 *
 * https://stackoverflow.com/questions/13210194/javascript-regex-equivalent-of-a-za-z-using-pl
 * https://github.com/danielberndt/babel-plugin-utf-8-regex/blob/master/src/transformer.js
 */

var _pZ = ' \xA0\u1680\u180E\u2000-\u200A\u2028\u2029\u202F\u205F\u3000';
var pZ = '[' + _pZ + ']';
var PZ = '[^' + _pZ + ']';

var _pN = '0-9\xB2\xB3\xB9\xBC-\xBE\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u09F4-\u09F9\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0B72-\u0B77\u0BE6-\u0BF2\u0C66-\u0C6F\u0C78-\u0C7E\u0CE6-\u0CEF\u0D66-\u0D75\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F33\u1040-\u1049\u1090-\u1099\u1369-\u137C\u16EE-\u16F0\u17E0-\u17E9\u17F0-\u17F9\u1810-\u1819\u1946-\u194F\u19D0-\u19DA\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\u2070\u2074-\u2079\u2080-\u2089\u2150-\u2182\u2185-\u2189\u2460-\u249B\u24EA-\u24FF\u2776-\u2793\u2CFD\u3007\u3021-\u3029\u3038-\u303A\u3192-\u3195\u3220-\u3229\u3248-\u324F\u3251-\u325F\u3280-\u3289\u32B1-\u32BF\uA620-\uA629\uA6E6-\uA6EF\uA830-\uA835\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19';
// const pN = `[${_pN}]`

var _pNd = '0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19';
var pNd = '[' + _pNd + ']';

var _pL = 'A-Za-z\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC';
var pL = '[' + _pL + ']';
var pL_regexp = new RegExp(pL);

var _pSc = '$\xA2-\xA5\u058F\u060B\u09F2\u09F3\u09FB\u0AF1\u0BF9\u0E3F\u17DB\u20A0-\u20B9\uA838\uFDFC\uFE69\uFF04\uFFE0\uFFE1\uFFE5\uFFE6';
var pSc = '[' + _pSc + ']';
var pSc_regexp = new RegExp(pSc);

var _pMn = '\u0300-\u036F\u0483-\u0487\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED\u0711\u0730-\u074A\u07A6-\u07B0\u07EB-\u07F3\u0816-\u0819\u081B-\u0823\u0825-\u0827\u0829-\u082D\u0859-\u085B\u08E4-\u08FE\u0900-\u0902\u093A\u093C\u0941-\u0948\u094D\u0951-\u0957\u0962\u0963\u0981\u09BC\u09C1-\u09C4\u09CD\u09E2\u09E3\u0A01\u0A02\u0A3C\u0A41\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A70\u0A71\u0A75\u0A81\u0A82\u0ABC\u0AC1-\u0AC5\u0AC7\u0AC8\u0ACD\u0AE2\u0AE3\u0B01\u0B3C\u0B3F\u0B41-\u0B44\u0B4D\u0B56\u0B62\u0B63\u0B82\u0BC0\u0BCD\u0C3E-\u0C40\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C62\u0C63\u0CBC\u0CBF\u0CC6\u0CCC\u0CCD\u0CE2\u0CE3\u0D41-\u0D44\u0D4D\u0D62\u0D63\u0DCA\u0DD2-\u0DD4\u0DD6\u0E31\u0E34-\u0E3A\u0E47-\u0E4E\u0EB1\u0EB4-\u0EB9\u0EBB\u0EBC\u0EC8-\u0ECD\u0F18\u0F19\u0F35\u0F37\u0F39\u0F71-\u0F7E\u0F80-\u0F84\u0F86\u0F87\u0F8D-\u0F97\u0F99-\u0FBC\u0FC6\u102D-\u1030\u1032-\u1037\u1039\u103A\u103D\u103E\u1058\u1059\u105E-\u1060\u1071-\u1074\u1082\u1085\u1086\u108D\u109D\u135D-\u135F\u1712-\u1714\u1732-\u1734\u1752\u1753\u1772\u1773\u17B4\u17B5\u17B7-\u17BD\u17C6\u17C9-\u17D3\u17DD\u180B-\u180D\u18A9\u1920-\u1922\u1927\u1928\u1932\u1939-\u193B\u1A17\u1A18\u1A56\u1A58-\u1A5E\u1A60\u1A62\u1A65-\u1A6C\u1A73-\u1A7C\u1A7F\u1B00-\u1B03\u1B34\u1B36-\u1B3A\u1B3C\u1B42\u1B6B-\u1B73\u1B80\u1B81\u1BA2-\u1BA5\u1BA8\u1BA9\u1BAB\u1BE6\u1BE8\u1BE9\u1BED\u1BEF-\u1BF1\u1C2C-\u1C33\u1C36\u1C37\u1CD0-\u1CD2\u1CD4-\u1CE0\u1CE2-\u1CE8\u1CED\u1CF4\u1DC0-\u1DE6\u1DFC-\u1DFF\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2CEF-\u2CF1\u2D7F\u2DE0-\u2DFF\u302A-\u302D\u3099\u309A\uA66F\uA674-\uA67D\uA69F\uA6F0\uA6F1\uA802\uA806\uA80B\uA825\uA826\uA8C4\uA8E0-\uA8F1\uA926-\uA92D\uA947-\uA951\uA980-\uA982\uA9B3\uA9B6-\uA9B9\uA9BC\uAA29-\uAA2E\uAA31\uAA32\uAA35\uAA36\uAA43\uAA4C\uAAB0\uAAB2-\uAAB4\uAAB7\uAAB8\uAABE\uAABF\uAAC1\uAAEC\uAAED\uAAF6\uABE5\uABE8\uABED\uFB1E\uFE00-\uFE0F\uFE20-\uFE26';
var pMn = '[' + _pMn + ']';
var pMn_regexp = new RegExp(pMn);

var _InBasic_Latin = '\0-\x7F';
var _InLatin_1_Supplement = '\x80-\xFF';
var _InLatin_Extended_A = '\u0100-\u017F';
var _InLatin_Extended_Additional = '\u1E00-\u1EFF';
var _InLatin_Extended_B = '\u0180-\u024F';
var _InCombining_Diacritical_Marks = '\u0300-\u036F';

var latinLetterRegexp = new RegExp('[' + _InBasic_Latin + _InLatin_1_Supplement + _InLatin_Extended_A + _InLatin_Extended_Additional + _InLatin_Extended_B + _InCombining_Diacritical_Marks + ']');

/**
 * Helper method to determine if a character is a Latin-script letter or not.
 * For our purposes, combining marks should also return true since we assume
 * they have been added to a preceding Latin character.
 */
function isLatinLetter(letter) {
  // Combining marks are a subset of non-spacing-mark.
  if (!pL_regexp.test(letter) && !pMn_regexp.test(letter)) {
    return false;
  }

  return latinLetterRegexp.test(letter);
}

function isInvalidPunctuationSymbol(character) {
  return character === '%' || pSc_regexp.test(character);
}

// Copy-pasted from `PhoneNumberMatcher.js`.

var OPENING_PARENS = '(\\[\uFF08\uFF3B';
var CLOSING_PARENS = ')\\]\uFF09\uFF3D';
var NON_PARENS = '[^' + OPENING_PARENS + CLOSING_PARENS + ']';

var LEAD_CLASS = '[' + OPENING_PARENS + PLUS_CHARS + ']';

// Punctuation that may be at the start of a phone number - brackets and plus signs.
var LEAD_CLASS_LEADING = new RegExp('^' + LEAD_CLASS);

// Limit on the number of pairs of brackets in a phone number.
var BRACKET_PAIR_LIMIT = limit(0, 3);

/**
 * Pattern to check that brackets match. Opening brackets should be closed within a phone number.
 * This also checks that there is something inside the brackets. Having no brackets at all is also
 * fine.
 *
 * An opening bracket at the beginning may not be closed, but subsequent ones should be.  It's
 * also possible that the leading bracket was dropped, so we shouldn't be surprised if we see a
 * closing bracket first. We limit the sets of brackets in a phone number to four.
 */
var MATCHING_BRACKETS_ENTIRE = new RegExp('^' + "(?:[" + OPENING_PARENS + "])?" + "(?:" + NON_PARENS + "+" + "[" + CLOSING_PARENS + "])?" + NON_PARENS + "+" + "(?:[" + OPENING_PARENS + "]" + NON_PARENS + "+[" + CLOSING_PARENS + "])" + BRACKET_PAIR_LIMIT + NON_PARENS + "*" + '$');

/**
 * Matches strings that look like publication pages. Example:
 * <pre>Computing Complete Answers to Queries in the Presence of Limited Access Patterns.
 * Chen Li. VLDB J. 12(3): 211-227 (2003).</pre>
 *
 * The string "211-227 (2003)" is not a telephone number.
 */
var PUB_PAGES = /\d{1,5}-+\d{1,5}\s{0,4}\(\d{1,4}/;

function isValidCandidate(candidate, offset, text, leniency) {
	// Check the candidate doesn't contain any formatting
	// which would indicate that it really isn't a phone number.
	if (!MATCHING_BRACKETS_ENTIRE.test(candidate) || PUB_PAGES.test(candidate)) {
		return;
	}

	// If leniency is set to VALID or stricter, we also want to skip numbers that are surrounded
	// by Latin alphabetic characters, to skip cases like abc8005001234 or 8005001234def.
	if (leniency !== 'POSSIBLE') {
		// If the candidate is not at the start of the text,
		// and does not start with phone-number punctuation,
		// check the previous character.
		if (offset > 0 && !LEAD_CLASS_LEADING.test(candidate)) {
			var previousChar = text[offset - 1];
			// We return null if it is a latin letter or an invalid punctuation symbol.
			if (isInvalidPunctuationSymbol(previousChar) || isLatinLetter(previousChar)) {
				return false;
			}
		}

		var lastCharIndex = offset + candidate.length;
		if (lastCharIndex < text.length) {
			var nextChar = text[lastCharIndex];
			if (isInvalidPunctuationSymbol(nextChar) || isLatinLetter(nextChar)) {
				return false;
			}
		}
	}

	return true;
}

var _createClass$2 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$2(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Copy-pasted from `./parse.js`.
var VALID_PHONE_NUMBER$1 = '[' + PLUS_CHARS + ']{0,1}' + '(?:' + '[' + VALID_PUNCTUATION + ']*' + '[' + VALID_DIGITS + ']' + '){3,}' + '[' + VALID_PUNCTUATION + VALID_DIGITS + ']*';

var EXTN_PATTERNS_FOR_PARSING$1 = create_extension_pattern('parsing');

var WHITESPACE_IN_THE_BEGINNING_PATTERN = new RegExp('^[' + WHITESPACE + ']+');
var PUNCTUATION_IN_THE_END_PATTERN = new RegExp('[' + VALID_PUNCTUATION + ']+$');

/**
 * Extracts a parseable phone number including any opening brackets, etc.
 * @param  {string} text - Input.
 * @return {object} `{ ?number, ?startsAt, ?endsAt }`.
 */
var PhoneNumberSearch = function () {
	function PhoneNumberSearch(text) {
		var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
		var metadata = arguments[2];

		_classCallCheck$2(this, PhoneNumberSearch);

		this.state = 'NOT_READY';

		this.text = text;
		this.options = options;
		this.metadata = metadata;

		this.regexp = new RegExp(VALID_PHONE_NUMBER$1 +
		// Phone number extensions
		'(?:' + EXTN_PATTERNS_FOR_PARSING$1 + ')?', 'ig');

		// this.searching_from = 0
	}
	// Iteration tristate.


	_createClass$2(PhoneNumberSearch, [{
		key: 'find',
		value: function find() {
			var matches = this.regexp.exec(this.text);

			if (!matches) {
				return;
			}

			var number = matches[0];
			var startsAt = matches.index;

			number = number.replace(WHITESPACE_IN_THE_BEGINNING_PATTERN, '');
			startsAt += matches[0].length - number.length;
			// Fixes not parsing numbers with whitespace in the end.
			// Also fixes not parsing numbers with opening parentheses in the end.
			// https://github.com/catamphetamine/libphonenumber-js/issues/252
			number = number.replace(PUNCTUATION_IN_THE_END_PATTERN, '');

			number = parsePreCandidate(number);

			var result = this.parseCandidate(number, startsAt);

			if (result) {
				return result;
			}

			// Tail recursion.
			// Try the next one if this one is not a valid phone number.
			return this.find();
		}
	}, {
		key: 'parseCandidate',
		value: function parseCandidate(number, startsAt) {
			if (!isValidPreCandidate(number, startsAt, this.text)) {
				return;
			}

			// Don't parse phone numbers which are non-phone numbers
			// due to being part of something else (e.g. a UUID).
			// https://github.com/catamphetamine/libphonenumber-js/issues/213
			// Copy-pasted from Google's `PhoneNumberMatcher.js` (`.parseAndValidate()`).
			if (!isValidCandidate(number, startsAt, this.text, this.options.extended ? 'POSSIBLE' : 'VALID')) {
				return;
			}

			// // Prepend any opening brackets left behind by the
			// // `PHONE_NUMBER_START_PATTERN` regexp.
			// const text_before_number = text.slice(this.searching_from, startsAt)
			// const full_number_starts_at = text_before_number.search(BEFORE_NUMBER_DIGITS_PUNCTUATION)
			// if (full_number_starts_at >= 0)
			// {
			// 	number   = text_before_number.slice(full_number_starts_at) + number
			// 	startsAt = full_number_starts_at
			// }
			//
			// this.searching_from = matches.lastIndex

			var result = parse(number, this.options, this.metadata);

			if (!result.phone) {
				return;
			}

			result.startsAt = startsAt;
			result.endsAt = startsAt + number.length;

			return result;
		}
	}, {
		key: 'hasNext',
		value: function hasNext() {
			if (this.state === 'NOT_READY') {
				this.last_match = this.find();

				if (this.last_match) {
					this.state = 'READY';
				} else {
					this.state = 'DONE';
				}
			}

			return this.state === 'READY';
		}
	}, {
		key: 'next',
		value: function next() {
			// Check the state and find the next match as a side-effect if necessary.
			if (!this.hasNext()) {
				throw new Error('No next element');
			}

			// Don't retain that memory any longer than necessary.
			var result = this.last_match;
			this.last_match = null;
			this.state = 'NOT_READY';
			return result;
		}
	}]);

	return PhoneNumberSearch;
}();

/**
 * Leniency when finding potential phone numbers in text segments
 * The levels here are ordered in increasing strictness.
 */
var Leniency = {
  /**
   * Phone numbers accepted are "possible", but not necessarily "valid".
   */
  POSSIBLE: function POSSIBLE(number, candidate, metadata) {
    return true;
  },


  /**
   * Phone numbers accepted are "possible" and "valid".
   * Numbers written in national format must have their national-prefix
   * present if it is usually written for a number of this type.
   */
  VALID: function VALID(number, candidate, metadata) {
    if (!isValidNumber(number, metadata) || !containsOnlyValidXChars(number, candidate.toString(), metadata)) {
      return false;
    }

    // Skipped for simplicity.
    // return isNationalPrefixPresentIfRequired(number, metadata)
    return true;
  },


  /**
   * Phone numbers accepted are "valid" and
   * are grouped in a possible way for this locale. For example, a US number written as
   * "65 02 53 00 00" and "650253 0000" are not accepted at this leniency level, whereas
   * "650 253 0000", "650 2530000" or "6502530000" are.
   * Numbers with more than one '/' symbol in the national significant number
   * are also dropped at this level.
   *
   * Warning: This level might result in lower coverage especially for regions outside of
   * country code "+1". If you are not sure about which level to use,
   * email the discussion group libphonenumber-discuss@googlegroups.com.
   */
  STRICT_GROUPING: function STRICT_GROUPING(number, candidate, metadata) {
    var candidateString = candidate.toString();

    if (!isValidNumber(number, metadata) || !containsOnlyValidXChars(number, candidateString, metadata) || containsMoreThanOneSlashInNationalNumber(number, candidateString) || !isNationalPrefixPresentIfRequired(number, metadata)) {
      return false;
    }

    return checkNumberGroupingIsValid(number, candidate, metadata, allNumberGroupsRemainGrouped);
  },


  /**
   * Phone numbers accepted are {@linkplain PhoneNumberUtil#isValidNumber(PhoneNumber) valid} and
   * are grouped in the same way that we would have formatted it, or as a single block. For
   * example, a US number written as "650 2530000" is not accepted at this leniency level, whereas
   * "650 253 0000" or "6502530000" are.
   * Numbers with more than one '/' symbol are also dropped at this level.
   * <p>
   * Warning: This level might result in lower coverage especially for regions outside of country
   * code "+1". If you are not sure about which level to use, email the discussion group
   * libphonenumber-discuss@googlegroups.com.
   */
  EXACT_GROUPING: function EXACT_GROUPING(number, candidate, metadata) {
    var candidateString = candidate.toString();

    if (!isValidNumber(number, metadata) || !containsOnlyValidXChars(number, candidateString, metadata) || containsMoreThanOneSlashInNationalNumber(number, candidateString) || !isNationalPrefixPresentIfRequired(number, metadata)) {
      return false;
    }

    return checkNumberGroupingIsValid(number, candidate, metadata, allNumberGroupsAreExactlyPresent);
  }
};

function containsOnlyValidXChars(number, candidate, metadata) {
  // The characters 'x' and 'X' can be (1) a carrier code, in which case they always precede the
  // national significant number or (2) an extension sign, in which case they always precede the
  // extension number. We assume a carrier code is more than 1 digit, so the first case has to
  // have more than 1 consecutive 'x' or 'X', whereas the second case can only have exactly 1 'x'
  // or 'X'. We ignore the character if it appears as the last character of the string.
  for (var index = 0; index < candidate.length - 1; index++) {
    var charAtIndex = candidate.charAt(index);

    if (charAtIndex === 'x' || charAtIndex === 'X') {
      var charAtNextIndex = candidate.charAt(index + 1);

      if (charAtNextIndex === 'x' || charAtNextIndex === 'X') {
        // This is the carrier code case, in which the 'X's always precede the national
        // significant number.
        index++;
        if (util.isNumberMatch(number, candidate.substring(index)) != MatchType.NSN_MATCH) {
          return false;
        }
        // This is the extension sign case, in which the 'x' or 'X' should always precede the
        // extension number.
      } else if (parseDigits(candidate.substring(index)) !== number.ext) {
        return false;
      }
    }
  }

  return true;
}

function isNationalPrefixPresentIfRequired(number, _metadata) {
  // First, check how we deduced the country code. If it was written in international format, then
  // the national prefix is not required.
  if (number.getCountryCodeSource() != 'FROM_DEFAULT_COUNTRY') {
    return true;
  }

  var phoneNumberRegion = util.getRegionCodeForCountryCode(number.getCountryCode());

  var metadata = util.getMetadataForRegion(phoneNumberRegion);
  if (metadata == null) {
    return true;
  }

  // Check if a national prefix should be present when formatting this number.
  var nationalNumber = util.getNationalSignificantNumber(number);
  var formatRule = util.chooseFormattingPatternForNumber(metadata.numberFormats(), nationalNumber);

  // To do this, we check that a national prefix formatting rule was present
  // and that it wasn't just the first-group symbol ($1) with punctuation.
  if (formatRule && formatRule.getNationalPrefixFormattingRule().length > 0) {
    if (formatRule.getNationalPrefixOptionalWhenFormatting()) {
      // The national-prefix is optional in these cases, so we don't need to check if it was
      // present.
      return true;
    }

    if (PhoneNumberUtil.formattingRuleHasFirstGroupOnly(formatRule.getNationalPrefixFormattingRule())) {
      // National Prefix not needed for this number.
      return true;
    }

    // Normalize the remainder.
    var rawInputCopy = PhoneNumberUtil.normalizeDigitsOnly(number.getRawInput());

    // Check if we found a national prefix and/or carrier code at the start of the raw input, and
    // return the result.
    return util.maybeStripNationalPrefixAndCarrierCode(rawInputCopy, metadata, null);
  }

  return true;
}

function containsMoreThanOneSlashInNationalNumber(number, candidate) {
  var firstSlashInBodyIndex = candidate.indexOf('/');
  if (firstSlashInBodyIndex < 0) {
    // No slashes, this is okay.
    return false;
  }

  // Now look for a second one.
  var secondSlashInBodyIndex = candidate.indexOf('/', firstSlashInBodyIndex + 1);
  if (secondSlashInBodyIndex < 0) {
    // Only one slash, this is okay.
    return false;
  }

  // If the first slash is after the country calling code, this is permitted.
  var candidateHasCountryCode = number.getCountryCodeSource() === CountryCodeSource.FROM_NUMBER_WITH_PLUS_SIGN || number.getCountryCodeSource() === CountryCodeSource.FROM_NUMBER_WITHOUT_PLUS_SIGN;

  if (candidateHasCountryCode && PhoneNumberUtil.normalizeDigitsOnly(candidate.substring(0, firstSlashInBodyIndex)) === String(number.getCountryCode())) {
    // Any more slashes and this is illegal.
    return candidate.slice(secondSlashInBodyIndex + 1).indexOf('/') >= 0;
  }

  return true;
}

function checkNumberGroupingIsValid(number, candidate, metadata, checkGroups) {
  // TODO: Evaluate how this works for other locales (testing has been limited to NANPA regions)
  // and optimise if necessary.
  var normalizedCandidate = normalizeDigits(candidate, true /* keep non-digits */);
  var formattedNumberGroups = getNationalNumberGroups(metadata, number, null);
  if (checkGroups(metadata, number, normalizedCandidate, formattedNumberGroups)) {
    return true;
  }

  // If this didn't pass, see if there are any alternate formats, and try them instead.
  var alternateFormats = MetadataManager.getAlternateFormatsForCountry(number.getCountryCode());

  if (alternateFormats) {
    for (var _iterator = alternateFormats.numberFormats(), _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var alternateFormat = _ref;

      formattedNumberGroups = getNationalNumberGroups(metadata, number, alternateFormat);

      if (checkGroups(metadata, number, normalizedCandidate, formattedNumberGroups)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Helper method to get the national-number part of a number, formatted without any national
 * prefix, and return it as a set of digit blocks that would be formatted together.
 */
function getNationalNumberGroups(metadata, number, formattingPattern) {
  if (formattingPattern) {
    // We format the NSN only, and split that according to the separator.
    var nationalSignificantNumber = util.getNationalSignificantNumber(number);
    return util.formatNsnUsingPattern(nationalSignificantNumber, formattingPattern, 'RFC3966', metadata).split('-');
  }

  // This will be in the format +CC-DG;ext=EXT where DG represents groups of digits.
  var rfc3966Format = formatNumber(number, 'RFC3966', metadata);

  // We remove the extension part from the formatted string before splitting it into different
  // groups.
  var endIndex = rfc3966Format.indexOf(';');
  if (endIndex < 0) {
    endIndex = rfc3966Format.length;
  }

  // The country-code will have a '-' following it.
  var startIndex = rfc3966Format.indexOf('-') + 1;
  return rfc3966Format.slice(startIndex, endIndex).split('-');
}

function allNumberGroupsAreExactlyPresent(metadata, number, normalizedCandidate, formattedNumberGroups) {
  var candidateGroups = normalizedCandidate.split(NON_DIGITS_PATTERN);

  // Set this to the last group, skipping it if the number has an extension.
  var candidateNumberGroupIndex = number.hasExtension() ? candidateGroups.length - 2 : candidateGroups.length - 1;

  // First we check if the national significant number is formatted as a block.
  // We use contains and not equals, since the national significant number may be present with
  // a prefix such as a national number prefix, or the country code itself.
  if (candidateGroups.length == 1 || candidateGroups[candidateNumberGroupIndex].contains(util.getNationalSignificantNumber(number))) {
    return true;
  }

  // Starting from the end, go through in reverse, excluding the first group, and check the
  // candidate and number groups are the same.
  var formattedNumberGroupIndex = formattedNumberGroups.length - 1;
  while (formattedNumberGroupIndex > 0 && candidateNumberGroupIndex >= 0) {
    if (candidateGroups[candidateNumberGroupIndex] !== formattedNumberGroups[formattedNumberGroupIndex]) {
      return false;
    }
    formattedNumberGroupIndex--;
    candidateNumberGroupIndex--;
  }

  // Now check the first group. There may be a national prefix at the start, so we only check
  // that the candidate group ends with the formatted number group.
  return candidateNumberGroupIndex >= 0 && endsWith(candidateGroups[candidateNumberGroupIndex], formattedNumberGroups[0]);
}

function allNumberGroupsRemainGrouped(metadata, number, normalizedCandidate, formattedNumberGroups) {
  var fromIndex = 0;
  if (number.getCountryCodeSource() !== CountryCodeSource.FROM_DEFAULT_COUNTRY) {
    // First skip the country code if the normalized candidate contained it.
    var countryCode = String(number.getCountryCode());
    fromIndex = normalizedCandidate.indexOf(countryCode) + countryCode.length();
  }

  // Check each group of consecutive digits are not broken into separate groupings in the
  // {@code normalizedCandidate} string.
  for (var i = 0; i < formattedNumberGroups.length; i++) {
    // Fails if the substring of {@code normalizedCandidate} starting from {@code fromIndex}
    // doesn't contain the consecutive digits in formattedNumberGroups[i].
    fromIndex = normalizedCandidate.indexOf(formattedNumberGroups[i], fromIndex);
    if (fromIndex < 0) {
      return false;
    }
    // Moves {@code fromIndex} forward.
    fromIndex += formattedNumberGroups[i].length();
    if (i == 0 && fromIndex < normalizedCandidate.length()) {
      // We are at the position right after the NDC. We get the region used for formatting
      // information based on the country code in the phone number, rather than the number itself,
      // as we do not need to distinguish between different countries with the same country
      // calling code and this is faster.
      var region = util.getRegionCodeForCountryCode(number.getCountryCode());
      if (util.getNddPrefixForRegion(region, true) != null && Character.isDigit(normalizedCandidate.charAt(fromIndex))) {
        // This means there is no formatting symbol after the NDC. In this case, we only
        // accept the number if there is no formatting symbol at all in the number, except
        // for extensions. This is only important for countries with national prefixes.
        var nationalSignificantNumber = util.getNationalSignificantNumber(number);
        return startsWith(normalizedCandidate.slice(fromIndex - formattedNumberGroups[i].length), nationalSignificantNumber);
      }
    }
  }

  // The check here makes sure that we haven't mistakenly already used the extension to
  // match the last group of the subscriber number. Note the extension cannot have
  // formatting in-between digits.
  return normalizedCandidate.slice(fromIndex).contains(number.getExtension());
}

function parseDigits(string) {
  var result = '';

  // Using `.split('')` here instead of normal `for ... of`
  // because the importing application doesn't neccessarily include an ES6 polyfill.
  // The `.split('')` approach discards "exotic" UTF-8 characters
  // (the ones consisting of four bytes) but digits
  // (including non-European ones) don't fall into that range
  // so such "exotic" characters would be discarded anyway.
  for (var _iterator2 = string.split(''), _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
    var _ref2;

    if (_isArray2) {
      if (_i2 >= _iterator2.length) break;
      _ref2 = _iterator2[_i2++];
    } else {
      _i2 = _iterator2.next();
      if (_i2.done) break;
      _ref2 = _i2.value;
    }

    var character = _ref2;

    var digit = parseDigit(character);
    if (digit) {
      result += digit;
    }
  }

  return result;
}

var _extends$4 = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass$3 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$3(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Patterns used to extract phone numbers from a larger phone-number-like pattern. These are
 * ordered according to specificity. For example, white-space is last since that is frequently
 * used in numbers, not just to separate two numbers. We have separate patterns since we don't
 * want to break up the phone-number-like text on more than one different kind of symbol at one
 * time, although symbols of the same type (e.g. space) can be safely grouped together.
 *
 * Note that if there is a match, we will always check any text found up to the first match as
 * well.
 */
var INNER_MATCHES = [
// Breaks on the slash - e.g. "651-234-2345/332-445-1234"
'\\/+(.*)/',

// Note that the bracket here is inside the capturing group, since we consider it part of the
// phone number. Will match a pattern like "(650) 223 3345 (754) 223 3321".
'(\\([^(]*)',

// Breaks on a hyphen - e.g. "12345 - 332-445-1234 is my number."
// We require a space on either side of the hyphen for it to be considered a separator.
'(?:' + pZ + '-|-' + pZ + ')' + pZ + '*(.+)',

// Various types of wide hyphens. Note we have decided not to enforce a space here, since it's
// possible that it's supposed to be used to break two numbers without spaces, and we haven't
// seen many instances of it used within a number.
'[\u2012-\u2015\uFF0D]' + pZ + '*(.+)',

// Breaks on a full stop - e.g. "12345. 332-445-1234 is my number."
'\\.+' + pZ + '*([^.]+)',

// Breaks on space - e.g. "3324451234 8002341234"
pZ + '+(' + PZ + '+)'];

// Limit on the number of leading (plus) characters.
var leadLimit = limit(0, 2);

// Limit on the number of consecutive punctuation characters.
var punctuationLimit = limit(0, 4);

/* The maximum number of digits allowed in a digit-separated block. As we allow all digits in a
 * single block, set high enough to accommodate the entire national number and the international
 * country code. */
var digitBlockLimit = MAX_LENGTH_FOR_NSN + MAX_LENGTH_COUNTRY_CODE;

// Limit on the number of blocks separated by punctuation.
// Uses digitBlockLimit since some formats use spaces to separate each digit.
var blockLimit = limit(0, digitBlockLimit);

/* A punctuation sequence allowing white space. */
var punctuation = '[' + VALID_PUNCTUATION + ']' + punctuationLimit;

// A digits block without punctuation.
var digitSequence = pNd + limit(1, digitBlockLimit);

/**
 * Phone number pattern allowing optional punctuation.
 * The phone number pattern used by `find()`, similar to
 * VALID_PHONE_NUMBER, but with the following differences:
 * <ul>
 *   <li>All captures are limited in order to place an upper bound to the text matched by the
 *       pattern.
 * <ul>
 *   <li>Leading punctuation / plus signs are limited.
 *   <li>Consecutive occurrences of punctuation are limited.
 *   <li>Number of digits is limited.
 * </ul>
 *   <li>No whitespace is allowed at the start or end.
 *   <li>No alpha digits (vanity numbers such as 1-800-SIX-FLAGS) are currently supported.
 * </ul>
 */
var PATTERN = '(?:' + LEAD_CLASS + punctuation + ')' + leadLimit + digitSequence + '(?:' + punctuation + digitSequence + ')' + blockLimit + '(?:' + create_extension_pattern('matching') + ')?';

// Regular expression of trailing characters that we want to remove.
// We remove all characters that are not alpha or numerical characters.
// The hash character is retained here, as it may signify
// the previous block was an extension.
//
// // Don't know what does '&&' mean here.
// const UNWANTED_END_CHAR_PATTERN = new RegExp(`[[\\P{N}&&\\P{L}]&&[^#]]+$`)
//
var UNWANTED_END_CHAR_PATTERN = new RegExp('[^' + _pN + _pL + '#]+$');

var MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || Math.pow(2, 53) - 1;

/**
 * A stateful class that finds and extracts telephone numbers from {@linkplain CharSequence text}.
 * Instances can be created using the {@linkplain PhoneNumberUtil#findNumbers factory methods} in
 * {@link PhoneNumberUtil}.
 *
 * <p>Vanity numbers (phone numbers using alphabetic digits such as <tt>1-800-SIX-FLAGS</tt> are
 * not found.
 *
 * <p>This class is not thread-safe.
 */

var PhoneNumberMatcher = function () {

  /**
   * Creates a new instance. See the factory methods in {@link PhoneNumberUtil} on how to obtain a
   * new instance.
   *
   * @param util  the phone number util to use
   * @param text  the character sequence that we will search, null for no text
   * @param country  the country to assume for phone numbers not written in international format
   *     (with a leading plus, or with the international dialing prefix of the specified region).
   *     May be null or "ZZ" if only numbers with a leading plus should be
   *     considered.
   * @param leniency  the leniency to use when evaluating candidate phone numbers
   * @param maxTries  the maximum number of invalid numbers to try before giving up on the text.
   *     This is to cover degenerate cases where the text has a lot of false positives in it. Must
   *     be {@code >= 0}.
   */

  /** The iteration tristate. */
  function PhoneNumberMatcher() {
    var text = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var metadata = arguments[2];

    _classCallCheck$3(this, PhoneNumberMatcher);

    this.state = 'NOT_READY';
    this.searchIndex = 0;

    options = _extends$4({}, options, {
      leniency: options.leniency || options.extended ? 'POSSIBLE' : 'VALID',
      maxTries: options.maxTries || MAX_SAFE_INTEGER
    });

    if (!options.leniency) {
      throw new TypeError('`Leniency` not supplied');
    }

    if (options.maxTries < 0) {
      throw new TypeError('`maxTries` not supplied');
    }

    this.text = text;
    this.options = options;
    this.metadata = metadata;

    /** The degree of validation requested. */
    this.leniency = Leniency[options.leniency];

    if (!this.leniency) {
      throw new TypeError('Unknown leniency: ' + options.leniency + '.');
    }

    /** The maximum number of retries after matching an invalid number. */
    this.maxTries = options.maxTries;

    this.PATTERN = new RegExp(PATTERN, 'ig');
  }

  /**
   * Attempts to find the next subsequence in the searched sequence on or after {@code searchIndex}
   * that represents a phone number. Returns the next match, null if none was found.
   *
   * @param index  the search index to start searching at
   * @return  the phone number match found, null if none can be found
   */


  /** The next index to start searching at. Undefined in {@link State#DONE}. */


  _createClass$3(PhoneNumberMatcher, [{
    key: 'find',
    value: function find() // (index)
    {
      // // Reset the regular expression.
      // this.PATTERN.lastIndex = index

      var matches = void 0;
      while (this.maxTries > 0 && (matches = this.PATTERN.exec(this.text)) !== null) {
        var candidate = matches[0];
        var offset = matches.index;

        candidate = parsePreCandidate(candidate);

        if (isValidPreCandidate(candidate, offset, this.text)) {
          var match =
          // Try to come up with a valid match given the entire candidate.
          this.parseAndVerify(candidate, offset, this.text)
          // If that failed, try to find an "inner match" -
          // there might be a phone number within this candidate.
          || this.extractInnerMatch(candidate, offset, this.text);

          if (match) {
            if (this.options.v2) {
              var phoneNumber = new PhoneNumber(match.country, match.phone, this.metadata.metadata);
              if (match.ext) {
                phoneNumber.ext = match.ext;
              }
              return {
                startsAt: match.startsAt,
                endsAt: match.endsAt,
                number: phoneNumber
              };
            }
            return match;
          }
        }

        this.maxTries--;
      }
    }

    /**
     * Attempts to extract a match from `candidate`
     * if the whole candidate does not qualify as a match.
     */

  }, {
    key: 'extractInnerMatch',
    value: function extractInnerMatch(candidate, offset, text) {
      for (var _iterator = INNER_MATCHES, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var innerMatchPattern = _ref;

        var isFirstMatch = true;
        var matches = void 0;
        var possibleInnerMatch = new RegExp(innerMatchPattern, 'g');
        while ((matches = possibleInnerMatch.exec(candidate)) !== null && this.maxTries > 0) {
          if (isFirstMatch) {
            // We should handle any group before this one too.
            var _group = trimAfterFirstMatch(UNWANTED_END_CHAR_PATTERN, candidate.slice(0, matches.index));

            var _match = this.parseAndVerify(_group, offset, text);
            if (_match) {
              return _match;
            }

            this.maxTries--;
            isFirstMatch = false;
          }

          var group = trimAfterFirstMatch(UNWANTED_END_CHAR_PATTERN, matches[1]);

          // Java code does `groupMatcher.start(1)` here,
          // but there's no way in javascript to get a group match start index,
          // therefore using the overall match start index `matches.index`.
          var match = this.parseAndVerify(group, offset + matches.index, text);
          if (match) {
            return match;
          }

          this.maxTries--;
        }
      }
    }

    /**
     * Parses a phone number from the `candidate` using `parseNumber` and
     * verifies it matches the requested `leniency`. If parsing and verification succeed,
     * a corresponding `PhoneNumberMatch` is returned, otherwise this method returns `null`.
     *
     * @param candidate  the candidate match
     * @param offset  the offset of {@code candidate} within {@link #text}
     * @return  the parsed and validated phone number match, or null
     */

  }, {
    key: 'parseAndVerify',
    value: function parseAndVerify(candidate, offset, text) {
      if (!isValidCandidate(candidate, offset, text, this.options.leniency)) {
        return;
      }

      var number = parse(candidate, {
        extended: true,
        defaultCountry: this.options.defaultCountry
      }, this.metadata.metadata);

      if (!number.possible) {
        return;
      }

      if (this.leniency(number, candidate, this.metadata.metadata)) {
        // // We used parseAndKeepRawInput to create this number,
        // // but for now we don't return the extra values parsed.
        // // TODO: stop clearing all values here and switch all users over
        // // to using rawInput() rather than the rawString() of PhoneNumberMatch.
        // number.clearCountryCodeSource()
        // number.clearRawInput()
        // number.clearPreferredDomesticCarrierCode()

        var result = {
          startsAt: offset,
          endsAt: offset + candidate.length,
          country: number.country,
          phone: number.phone
        };

        if (number.ext) {
          result.ext = number.ext;
        }

        return result;
      }
    }
  }, {
    key: 'hasNext',
    value: function hasNext() {
      if (this.state === 'NOT_READY') {
        this.lastMatch = this.find(); // (this.searchIndex)

        if (this.lastMatch) {
          // this.searchIndex = this.lastMatch.endsAt
          this.state = 'READY';
        } else {
          this.state = 'DONE';
        }
      }

      return this.state === 'READY';
    }
  }, {
    key: 'next',
    value: function next() {
      // Check the state and find the next match as a side-effect if necessary.
      if (!this.hasNext()) {
        throw new Error('No next element');
      }

      // Don't retain that memory any longer than necessary.
      var result = this.lastMatch;
      this.lastMatch = null;
      this.state = 'NOT_READY';
      return result;
    }
  }]);

  return PhoneNumberMatcher;
}();

var _createClass$4 = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck$4(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Used in phone number format template creation.
// Could be any digit, I guess.
var DUMMY_DIGIT = '9';
// I don't know why is it exactly `15`
var LONGEST_NATIONAL_PHONE_NUMBER_LENGTH = 15;
// Create a phone number consisting only of the digit 9 that matches the
// `number_pattern` by applying the pattern to the "longest phone number" string.
var LONGEST_DUMMY_PHONE_NUMBER = repeat$1(DUMMY_DIGIT, LONGEST_NATIONAL_PHONE_NUMBER_LENGTH);

// The digits that have not been entered yet will be represented by a \u2008,
// the punctuation space.
var DIGIT_PLACEHOLDER = 'x'; // '\u2008' (punctuation space)
var DIGIT_PLACEHOLDER_MATCHER = new RegExp(DIGIT_PLACEHOLDER);

// A pattern that is used to match character classes in regular expressions.
// An example of a character class is "[1-4]".
var CREATE_CHARACTER_CLASS_PATTERN = function CREATE_CHARACTER_CLASS_PATTERN() {
	return (/\[([^\[\]])*\]/g
	);
};

// Any digit in a regular expression that actually denotes a digit. For
// example, in the regular expression "80[0-2]\d{6,10}", the first 2 digits
// (8 and 0) are standalone digits, but the rest are not.
// Two look-aheads are needed because the number following \\d could be a
// two-digit number, since the phone number can be as long as 15 digits.
var CREATE_STANDALONE_DIGIT_PATTERN = function CREATE_STANDALONE_DIGIT_PATTERN() {
	return (/\d(?=[^,}][^,}])/g
	);
};

// A pattern that is used to determine if a `format` is eligible
// to be used by the "as you type formatter".
// It is eligible when the `format` contains groups of the dollar sign
// followed by a single digit, separated by valid phone number punctuation.
// This prevents invalid punctuation (such as the star sign in Israeli star numbers)
// getting into the output of the "as you type formatter".
var ELIGIBLE_FORMAT_PATTERN = new RegExp('^' + '[' + VALID_PUNCTUATION + ']*' + '(\\$\\d[' + VALID_PUNCTUATION + ']*)+' + '$');

// This is the minimum length of the leading digits of a phone number
// to guarantee the first "leading digits pattern" for a phone number format
// to be preemptive.
var MIN_LEADING_DIGITS_LENGTH = 3;

var VALID_INCOMPLETE_PHONE_NUMBER = '[' + PLUS_CHARS + ']{0,1}' + '[' + VALID_PUNCTUATION + VALID_DIGITS + ']*';

var VALID_INCOMPLETE_PHONE_NUMBER_PATTERN = new RegExp('^' + VALID_INCOMPLETE_PHONE_NUMBER + '$', 'i');

var AsYouType = function () {

	/**
  * @param {string} [country_code] - The default country used for parsing non-international phone numbers.
  * @param {Object} metadata
  */
	function AsYouType(country_code, metadata) {
		_classCallCheck$4(this, AsYouType);

		this.options = {};

		this.metadata = new Metadata(metadata);

		if (country_code && this.metadata.hasCountry(country_code)) {
			this.default_country = country_code;
		}

		this.reset();
	}
	// Not setting `options` to a constructor argument
	// not to break backwards compatibility
	// for older versions of the library.


	_createClass$4(AsYouType, [{
		key: 'input',
		value: function input(text) {
			// Parse input

			var extracted_number = extract_formatted_phone_number(text) || '';

			// Special case for a lone '+' sign
			// since it's not considered a possible phone number.
			if (!extracted_number) {
				if (text && text.indexOf('+') >= 0) {
					extracted_number = '+';
				}
			}

			// Validate possible first part of a phone number
			if (!VALID_INCOMPLETE_PHONE_NUMBER_PATTERN.test(extracted_number)) {
				return this.current_output;
			}

			return this.process_input(parseIncompletePhoneNumber(extracted_number));
		}
	}, {
		key: 'process_input',
		value: function process_input(input) {
			// If an out of position '+' sign detected
			// (or a second '+' sign),
			// then just drop it from the input.
			if (input[0] === '+') {
				if (!this.parsed_input) {
					this.parsed_input += '+';

					// If a default country was set
					// then reset it because an explicitly international
					// phone number is being entered
					this.reset_countriness();
				}

				input = input.slice(1);
			}

			// Raw phone number
			this.parsed_input += input;

			// // Reset phone number validation state
			// this.valid = false

			// Add digits to the national number
			this.national_number += input;

			// TODO: Deprecated: rename `this.national_number`
			// to `this.nationalNumber` and remove `.getNationalNumber()`.

			// Try to format the parsed input

			if (this.is_international()) {
				if (!this.countryCallingCode) {
					// No need to format anything
					// if there's no national phone number.
					// (e.g. just the country calling code)
					if (!this.national_number) {
						// Return raw phone number
						return this.parsed_input;
					}

					// If one looks at country phone codes
					// then he can notice that no one country phone code
					// is ever a (leftmost) substring of another country phone code.
					// So if a valid country code is extracted so far
					// then it means that this is the country code.

					// If no country phone code could be extracted so far,
					// then just return the raw phone number,
					// because it has no way of knowing
					// how to format the phone number so far.
					if (!this.extract_country_calling_code()) {
						// Return raw phone number
						return this.parsed_input;
					}

					// Initialize country-specific data
					this.initialize_phone_number_formats_for_this_country_calling_code();
					this.reset_format();
					this.determine_the_country();
				}
				// `this.country` could be `undefined`,
				// for instance, when there is ambiguity
				// in a form of several different countries
				// each corresponding to the same country phone code
				// (e.g. NANPA: USA, Canada, etc),
				// and there's not enough digits entered
				// to reliably determine the country
				// the phone number belongs to.
				// Therefore, in cases of such ambiguity,
				// each time something is input,
				// try to determine the country
				// (if it's not determined yet).
				else if (!this.country) {
						this.determine_the_country();
					}
			} else {
				// Some national prefixes are substrings of other national prefixes
				// (for the same country), therefore try to extract national prefix each time
				// because a longer national prefix might be available at some point in time.

				var previous_national_prefix = this.national_prefix;
				this.national_number = this.national_prefix + this.national_number;

				// Possibly extract a national prefix
				this.extract_national_prefix();

				if (this.national_prefix !== previous_national_prefix) {
					// National number has changed
					// (due to another national prefix been extracted)
					// therefore national number has changed
					// therefore reset all previous formatting data.
					// (and leading digits matching state)
					this.matching_formats = undefined;
					this.reset_format();
				}
			}

			// if (!this.should_format())
			// {
			// 	return this.format_as_non_formatted_number()
			// }

			if (!this.national_number) {
				return this.format_as_non_formatted_number();
			}

			// Check the available phone number formats
			// based on the currently available leading digits.
			this.match_formats_by_leading_digits();

			// Format the phone number (given the next digits)
			var formatted_national_phone_number = this.format_national_phone_number(input);

			// If the phone number could be formatted,
			// then return it, possibly prepending with country phone code
			// (for international phone numbers only)
			if (formatted_national_phone_number) {
				return this.full_phone_number(formatted_national_phone_number);
			}

			// If the phone number couldn't be formatted,
			// then just fall back to the raw phone number.
			return this.format_as_non_formatted_number();
		}
	}, {
		key: 'format_as_non_formatted_number',
		value: function format_as_non_formatted_number() {
			// Strip national prefix for incorrectly inputted international phones.
			if (this.is_international() && this.countryCallingCode) {
				return '+' + this.countryCallingCode + this.national_number;
			}

			return this.parsed_input;
		}
	}, {
		key: 'format_national_phone_number',
		value: function format_national_phone_number(next_digits) {
			// Format the next phone number digits
			// using the previously chosen phone number format.
			//
			// This is done here because if `attempt_to_format_complete_phone_number`
			// was placed before this call then the `template`
			// wouldn't reflect the situation correctly (and would therefore be inconsistent)
			//
			var national_number_formatted_with_previous_format = void 0;
			if (this.chosen_format) {
				national_number_formatted_with_previous_format = this.format_next_national_number_digits(next_digits);
			}

			// See if the input digits can be formatted properly already. If not,
			// use the results from format_next_national_number_digits(), which does formatting
			// based on the formatting pattern chosen.

			var formatted_number = this.attempt_to_format_complete_phone_number();

			// Just because a phone number doesn't have a suitable format
			// that doesn't mean that the phone is invalid
			// because phone number formats only format phone numbers,
			// they don't validate them and some (rare) phone numbers
			// are meant to stay non-formatted.
			if (formatted_number) {
				return formatted_number;
			}

			// For some phone number formats national prefix

			// If the previously chosen phone number format
			// didn't match the next (current) digit being input
			// (leading digits pattern didn't match).
			if (this.choose_another_format()) {
				// And a more appropriate phone number format
				// has been chosen for these `leading digits`,
				// then format the national phone number (so far)
				// using the newly selected phone number pattern.

				// Will return `undefined` if it couldn't format
				// the supplied national number
				// using the selected phone number pattern.

				return this.reformat_national_number();
			}

			// If could format the next (current) digit
			// using the previously chosen phone number format
			// then return the formatted number so far.

			// If no new phone number format could be chosen,
			// and couldn't format the supplied national number
			// using the selected phone number pattern,
			// then it will return `undefined`.

			return national_number_formatted_with_previous_format;
		}
	}, {
		key: 'reset',
		value: function reset() {
			// Input stripped of non-phone-number characters.
			// Can only contain a possible leading '+' sign and digits.
			this.parsed_input = '';

			this.current_output = '';

			// This contains the national prefix that has been extracted. It contains only
			// digits without formatting.
			this.national_prefix = '';

			this.national_number = '';
			this.carrierCode = '';

			this.reset_countriness();

			this.reset_format();

			// this.valid = false

			return this;
		}
	}, {
		key: 'reset_country',
		value: function reset_country() {
			if (this.is_international()) {
				this.country = undefined;
			} else {
				this.country = this.default_country;
			}
		}
	}, {
		key: 'reset_countriness',
		value: function reset_countriness() {
			this.reset_country();

			if (this.default_country && !this.is_international()) {
				this.metadata.country(this.default_country);
				this.countryCallingCode = this.metadata.countryCallingCode();

				this.initialize_phone_number_formats_for_this_country_calling_code();
			} else {
				this.metadata.country(undefined);
				this.countryCallingCode = undefined;

				// "Available formats" are all formats available for the country.
				// "Matching formats" are only formats eligible for the national number being entered.
				this.available_formats = [];
				this.matching_formats = undefined;
			}
		}
	}, {
		key: 'reset_format',
		value: function reset_format() {
			this.chosen_format = undefined;
			this.template = undefined;
			this.partially_populated_template = undefined;
			this.last_match_position = -1;
		}

		// Format each digit of national phone number (so far)
		// using the newly selected phone number pattern.

	}, {
		key: 'reformat_national_number',
		value: function reformat_national_number() {
			// Format each digit of national phone number (so far)
			// using the selected phone number pattern.
			return this.format_next_national_number_digits(this.national_number);
		}
	}, {
		key: 'initialize_phone_number_formats_for_this_country_calling_code',
		value: function initialize_phone_number_formats_for_this_country_calling_code() {
			// Get all "eligible" phone number formats for this country
			this.available_formats = this.metadata.formats().filter(function (format$$1) {
				return ELIGIBLE_FORMAT_PATTERN.test(format$$1.internationalFormat());
			});

			this.matching_formats = undefined;
		}
	}, {
		key: 'match_formats_by_leading_digits',
		value: function match_formats_by_leading_digits() {
			var leading_digits = this.national_number;

			// "leading digits" pattern list starts with a
			// "leading digits" pattern fitting a maximum of 3 leading digits.
			// So, after a user inputs 3 digits of a national (significant) phone number
			// this national (significant) number can already be formatted.
			// The next "leading digits" pattern is for 4 leading digits max,
			// and the "leading digits" pattern after it is for 5 leading digits max, etc.

			// This implementation is different from Google's
			// in that it searches for a fitting format
			// even if the user has entered less than
			// `MIN_LEADING_DIGITS_LENGTH` digits of a national number.
			// Because some leading digits patterns already match for a single first digit.
			var index_of_leading_digits_pattern = leading_digits.length - MIN_LEADING_DIGITS_LENGTH;
			if (index_of_leading_digits_pattern < 0) {
				index_of_leading_digits_pattern = 0;
			}

			// "Available formats" are all formats available for the country.
			// "Matching formats" are only formats eligible for the national number being entered.

			// If at least `MIN_LEADING_DIGITS_LENGTH` digits of a national number are available
			// then format matching starts narrowing down the list of possible formats
			// (only previously matched formats are considered for next digits).
			var available_formats = this.had_enough_leading_digits && this.matching_formats || this.available_formats;
			this.had_enough_leading_digits = this.should_format();

			this.matching_formats = available_formats.filter(function (format$$1) {
				var leading_digits_patterns_count = format$$1.leadingDigitsPatterns().length;

				// If this format is not restricted to a certain
				// leading digits pattern then it fits.
				if (leading_digits_patterns_count === 0) {
					return true;
				}

				var leading_digits_pattern_index = Math.min(index_of_leading_digits_pattern, leading_digits_patterns_count - 1);
				var leading_digits_pattern = format$$1.leadingDigitsPatterns()[leading_digits_pattern_index];

				// Brackets are required for `^` to be applied to
				// all or-ed (`|`) parts, not just the first one.
				return new RegExp('^(' + leading_digits_pattern + ')').test(leading_digits);
			});

			// If there was a phone number format chosen
			// and it no longer holds given the new leading digits then reset it.
			// The test for this `if` condition is marked as:
			// "Reset a chosen format when it no longer holds given the new leading digits".
			// To construct a valid test case for this one can find a country
			// in `PhoneNumberMetadata.xml` yielding one format for 3 `<leadingDigits>`
			// and yielding another format for 4 `<leadingDigits>` (Australia in this case).
			if (this.chosen_format && this.matching_formats.indexOf(this.chosen_format) === -1) {
				this.reset_format();
			}
		}
	}, {
		key: 'should_format',
		value: function should_format() {
			// Start matching any formats at all when the national number
			// entered so far is at least 3 digits long,
			// otherwise format matching would give false negatives
			// like when the digits entered so far are `2`
			// and the leading digits pattern is `21` –
			// it's quite obvious in this case that the format could be the one
			// but due to the absence of further digits it would give false negative.
			//
			// Presumably the limitation of "3 digits min"
			// is imposed to exclude false matches,
			// e.g. when there are two different formats
			// each one fitting one or two leading digits being input.
			// But for this case I would propose a specific `if/else` condition.
			//
			return this.national_number.length >= MIN_LEADING_DIGITS_LENGTH;
		}

		// Check to see if there is an exact pattern match for these digits. If so, we
		// should use this instead of any other formatting template whose
		// `leadingDigitsPattern` also matches the input.

	}, {
		key: 'attempt_to_format_complete_phone_number',
		value: function attempt_to_format_complete_phone_number() {
			for (var _iterator = this.matching_formats, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();;) {
				var _ref;

				if (_isArray) {
					if (_i >= _iterator.length) break;
					_ref = _iterator[_i++];
				} else {
					_i = _iterator.next();
					if (_i.done) break;
					_ref = _i.value;
				}

				var format$$1 = _ref;

				var matcher = new RegExp('^(?:' + format$$1.pattern() + ')$');

				if (!matcher.test(this.national_number)) {
					continue;
				}

				if (!this.is_format_applicable(format$$1)) {
					continue;
				}

				// To leave the formatter in a consistent state
				this.reset_format();
				this.chosen_format = format$$1;

				var formatted_number = format_national_number_using_format(this.national_number, format$$1, this.is_international(), this.national_prefix !== '', this.metadata);

				// Special handling for NANPA countries for AsYouType formatter.
				// Copied from Google's `libphonenumber`:
				// https://github.com/googlei18n/libphonenumber/blob/66986dbbe443ee8450e2b54dcd44ac384b3bbee8/java/libphonenumber/src/com/google/i18n/phonenumbers/AsYouTypeFormatter.java#L535-L573
				if (this.national_prefix && this.countryCallingCode === '1') {
					formatted_number = '1 ' + formatted_number;
				}

				// Set `this.template` and `this.partially_populated_template`.
				//
				// `else` case doesn't ever happen
				// with the current metadata,
				// but just in case.
				//
				/* istanbul ignore else */
				if (this.create_formatting_template(format$$1)) {
					// Populate `this.partially_populated_template`
					this.reformat_national_number();
				} else {
					// Prepend `+CountryCode` in case of an international phone number
					var full_number = this.full_phone_number(formatted_number);
					this.template = full_number.replace(/[\d\+]/g, DIGIT_PLACEHOLDER);
					this.partially_populated_template = full_number;
				}

				return formatted_number;
			}
		}

		// Prepends `+CountryCode` in case of an international phone number

	}, {
		key: 'full_phone_number',
		value: function full_phone_number(formatted_national_number) {
			if (this.is_international()) {
				return '+' + this.countryCallingCode + ' ' + formatted_national_number;
			}

			return formatted_national_number;
		}

		// Extracts the country calling code from the beginning
		// of the entered `national_number` (so far),
		// and places the remaining input into the `national_number`.

	}, {
		key: 'extract_country_calling_code',
		value: function extract_country_calling_code() {
			var _extractCountryCallin = extractCountryCallingCode(this.parsed_input, this.default_country, this.metadata.metadata),
			    countryCallingCode = _extractCountryCallin.countryCallingCode,
			    number = _extractCountryCallin.number;

			if (!countryCallingCode) {
				return;
			}

			this.countryCallingCode = countryCallingCode;

			// Sometimes people erroneously write national prefix
			// as part of an international number, e.g. +44 (0) ....
			// This violates the standards for international phone numbers,
			// so "As You Type" formatter assumes no national prefix
			// when parsing a phone number starting from `+`.
			// Even if it did attempt to filter-out that national prefix
			// it would look weird for a user trying to enter a digit
			// because from user's perspective the keyboard "wouldn't be working".
			this.national_number = number;

			this.metadata.chooseCountryByCountryCallingCode(countryCallingCode);
			return this.metadata.selectedCountry() !== undefined;
		}
	}, {
		key: 'extract_national_prefix',
		value: function extract_national_prefix() {
			this.national_prefix = '';

			if (!this.metadata.selectedCountry()) {
				return;
			}

			// Only strip national prefixes for non-international phone numbers
			// because national prefixes can't be present in international phone numbers.
			// Otherwise, while forgiving, it would parse a NANPA number `+1 1877 215 5230`
			// first to `1877 215 5230` and then, stripping the leading `1`, to `877 215 5230`,
			// and then it would assume that's a valid number which it isn't.
			// So no forgiveness for grandmas here.
			// The issue asking for this fix:
			// https://github.com/catamphetamine/libphonenumber-js/issues/159

			var _strip_national_prefi = strip_national_prefix_and_carrier_code(this.national_number, this.metadata),
			    potential_national_number = _strip_national_prefi.number,
			    carrierCode = _strip_national_prefi.carrierCode;

			if (carrierCode) {
				this.carrierCode = carrierCode;
			}

			// We require that the NSN remaining after stripping the national prefix and
			// carrier code be long enough to be a possible length for the region.
			// Otherwise, we don't do the stripping, since the original number could be
			// a valid short number.
			if (!this.metadata.possibleLengths() || this.is_possible_number(this.national_number) && !this.is_possible_number(potential_national_number)) {
				// Verify the parsed national (significant) number for this country
				//
				// If the original number (before stripping national prefix) was viable,
				// and the resultant number is not, then prefer the original phone number.
				// This is because for some countries (e.g. Russia) the same digit could be both
				// a national prefix and a leading digit of a valid national phone number,
				// like `8` is the national prefix for Russia and both
				// `8 800 555 35 35` and `800 555 35 35` are valid numbers.
				if (matches_entirely(this.national_number, this.metadata.nationalNumberPattern()) && !matches_entirely(potential_national_number, this.metadata.nationalNumberPattern())) {
					return;
				}
			}

			this.national_prefix = this.national_number.slice(0, this.national_number.length - potential_national_number.length);
			this.national_number = potential_national_number;

			return this.national_prefix;
		}
	}, {
		key: 'is_possible_number',
		value: function is_possible_number(number) {
			var validation_result = check_number_length_for_type(number, undefined, this.metadata);
			switch (validation_result) {
				case 'IS_POSSIBLE':
					return true;
				// case 'IS_POSSIBLE_LOCAL_ONLY':
				// 	return !this.is_international()
				default:
					return false;
			}
		}
	}, {
		key: 'choose_another_format',
		value: function choose_another_format() {
			// When there are multiple available formats, the formatter uses the first
			// format where a formatting template could be created.
			for (var _iterator2 = this.matching_formats, _isArray2 = Array.isArray(_iterator2), _i2 = 0, _iterator2 = _isArray2 ? _iterator2 : _iterator2[Symbol.iterator]();;) {
				var _ref2;

				if (_isArray2) {
					if (_i2 >= _iterator2.length) break;
					_ref2 = _iterator2[_i2++];
				} else {
					_i2 = _iterator2.next();
					if (_i2.done) break;
					_ref2 = _i2.value;
				}

				var format$$1 = _ref2;

				// If this format is currently being used
				// and is still possible, then stick to it.
				if (this.chosen_format === format$$1) {
					return;
				}

				// If this `format` is suitable for "as you type",
				// then extract the template from this format
				// and use it to format the phone number being input.

				if (!this.is_format_applicable(format$$1)) {
					continue;
				}

				if (!this.create_formatting_template(format$$1)) {
					continue;
				}

				this.chosen_format = format$$1;

				// With a new formatting template, the matched position
				// using the old template needs to be reset.
				this.last_match_position = -1;

				return true;
			}

			// No format matches the phone number,
			// therefore set `country` to `undefined`
			// (or to the default country).
			this.reset_country();

			// No format matches the national phone number entered
			this.reset_format();
		}
	}, {
		key: 'is_format_applicable',
		value: function is_format_applicable(format$$1) {
			// If national prefix is mandatory for this phone number format
			// and the user didn't input the national prefix
			// then this phone number format isn't suitable.
			if (!this.is_international() && !this.national_prefix && format$$1.nationalPrefixIsMandatoryWhenFormatting()) {
				return false;
			}
			// If this format doesn't use national prefix
			// but the user did input national prefix
			// then this phone number format isn't suitable.
			if (this.national_prefix && !format$$1.usesNationalPrefix() && !format$$1.nationalPrefixIsOptionalWhenFormatting()) {
				return false;
			}
			return true;
		}
	}, {
		key: 'create_formatting_template',
		value: function create_formatting_template(format$$1) {
			// The formatter doesn't format numbers when numberPattern contains '|', e.g.
			// (20|3)\d{4}. In those cases we quickly return.
			// (Though there's no such format in current metadata)
			/* istanbul ignore if */
			if (format$$1.pattern().indexOf('|') >= 0) {
				return;
			}

			// Get formatting template for this phone number format
			var template = this.get_template_for_phone_number_format_pattern(format$$1);

			// If the national number entered is too long
			// for any phone number format, then abort.
			if (!template) {
				return;
			}

			// This one is for national number only
			this.partially_populated_template = template;

			// For convenience, the public `.template` property
			// contains the whole international number
			// if the phone number being input is international:
			// 'x' for the '+' sign, 'x'es for the country phone code,
			// a spacebar and then the template for the formatted national number.
			if (this.is_international()) {
				this.template = DIGIT_PLACEHOLDER + repeat$1(DIGIT_PLACEHOLDER, this.countryCallingCode.length) + ' ' + template;
			}
			// For local numbers, replace national prefix
			// with a digit placeholder.
			else {
					this.template = template.replace(/\d/g, DIGIT_PLACEHOLDER);
				}

			// This one is for the full phone number
			return this.template;
		}

		// Generates formatting template for a phone number format

	}, {
		key: 'get_template_for_phone_number_format_pattern',
		value: function get_template_for_phone_number_format_pattern(format$$1) {
			// A very smart trick by the guys at Google
			var number_pattern = format$$1.pattern()
			// Replace anything in the form of [..] with \d
			.replace(CREATE_CHARACTER_CLASS_PATTERN(), '\\d')
			// Replace any standalone digit (not the one in `{}`) with \d
			.replace(CREATE_STANDALONE_DIGIT_PATTERN(), '\\d');

			// This match will always succeed,
			// because the "longest dummy phone number"
			// has enough length to accomodate any possible
			// national phone number format pattern.
			var dummy_phone_number_matching_format_pattern = LONGEST_DUMMY_PHONE_NUMBER.match(number_pattern)[0];

			// If the national number entered is too long
			// for any phone number format, then abort.
			if (this.national_number.length > dummy_phone_number_matching_format_pattern.length) {
				return;
			}

			// Prepare the phone number format
			var number_format = this.get_format_format(format$$1);

			// Get a formatting template which can be used to efficiently format
			// a partial number where digits are added one by one.

			// Below `strict_pattern` is used for the
			// regular expression (with `^` and `$`).
			// This wasn't originally in Google's `libphonenumber`
			// and I guess they don't really need it
			// because they're not using "templates" to format phone numbers
			// but I added `strict_pattern` after encountering
			// South Korean phone number formatting bug.
			//
			// Non-strict regular expression bug demonstration:
			//
			// this.national_number : `111111111` (9 digits)
			//
			// number_pattern : (\d{2})(\d{3,4})(\d{4})
			// number_format : `$1 $2 $3`
			// dummy_phone_number_matching_format_pattern : `9999999999` (10 digits)
			//
			// '9999999999'.replace(new RegExp(/(\d{2})(\d{3,4})(\d{4})/g), '$1 $2 $3') = "99 9999 9999"
			//
			// template : xx xxxx xxxx
			//
			// But the correct template in this case is `xx xxx xxxx`.
			// The template was generated incorrectly because of the
			// `{3,4}` variability in the `number_pattern`.
			//
			// The fix is, if `this.national_number` has already sufficient length
			// to satisfy the `number_pattern` completely then `this.national_number` is used
			// instead of `dummy_phone_number_matching_format_pattern`.

			var strict_pattern = new RegExp('^' + number_pattern + '$');
			var national_number_dummy_digits = this.national_number.replace(/\d/g, DUMMY_DIGIT);

			// If `this.national_number` has already sufficient length
			// to satisfy the `number_pattern` completely then use it
			// instead of `dummy_phone_number_matching_format_pattern`.
			if (strict_pattern.test(national_number_dummy_digits)) {
				dummy_phone_number_matching_format_pattern = national_number_dummy_digits;
			}

			// Generate formatting template for this phone number format
			return dummy_phone_number_matching_format_pattern
			// Format the dummy phone number according to the format
			.replace(new RegExp(number_pattern), number_format)
			// Replace each dummy digit with a DIGIT_PLACEHOLDER
			.replace(new RegExp(DUMMY_DIGIT, 'g'), DIGIT_PLACEHOLDER);
		}
	}, {
		key: 'format_next_national_number_digits',
		value: function format_next_national_number_digits(digits) {
			// Using `.split('')` to iterate through a string here
			// to avoid requiring `Symbol.iterator` polyfill.
			// `.split('')` is generally not safe for Unicode,
			// but in this particular case for `digits` it is safe.
			// for (const digit of digits)
			for (var _iterator3 = digits.split(''), _isArray3 = Array.isArray(_iterator3), _i3 = 0, _iterator3 = _isArray3 ? _iterator3 : _iterator3[Symbol.iterator]();;) {
				var _ref3;

				if (_isArray3) {
					if (_i3 >= _iterator3.length) break;
					_ref3 = _iterator3[_i3++];
				} else {
					_i3 = _iterator3.next();
					if (_i3.done) break;
					_ref3 = _i3.value;
				}

				var digit = _ref3;

				// If there is room for more digits in current `template`,
				// then set the next digit in the `template`,
				// and return the formatted digits so far.

				// If more digits are entered than the current format could handle
				if (this.partially_populated_template.slice(this.last_match_position + 1).search(DIGIT_PLACEHOLDER_MATCHER) === -1) {
					// Reset the current format,
					// so that the new format will be chosen
					// in a subsequent `this.choose_another_format()` call
					// later in code.
					this.chosen_format = undefined;
					this.template = undefined;
					this.partially_populated_template = undefined;
					return;
				}

				this.last_match_position = this.partially_populated_template.search(DIGIT_PLACEHOLDER_MATCHER);
				this.partially_populated_template = this.partially_populated_template.replace(DIGIT_PLACEHOLDER_MATCHER, digit);
			}

			// Return the formatted phone number so far.
			return cut_stripping_dangling_braces(this.partially_populated_template, this.last_match_position + 1);

			// The old way which was good for `input-format` but is not so good
			// for `react-phone-number-input`'s default input (`InputBasic`).
			// return close_dangling_braces(this.partially_populated_template, this.last_match_position + 1)
			// 	.replace(DIGIT_PLACEHOLDER_MATCHER_GLOBAL, ' ')
		}
	}, {
		key: 'is_international',
		value: function is_international() {
			return this.parsed_input && this.parsed_input[0] === '+';
		}
	}, {
		key: 'get_format_format',
		value: function get_format_format(format$$1) {
			if (this.is_international()) {
				return changeInternationalFormatStyle(format$$1.internationalFormat());
			}

			// If national prefix formatting rule is set
			// for this phone number format
			if (format$$1.nationalPrefixFormattingRule()) {
				// If the user did input the national prefix
				// (or if the national prefix formatting rule does not require national prefix)
				// then maybe make it part of the phone number template
				if (this.national_prefix || !format$$1.usesNationalPrefix()) {
					// Make the national prefix part of the phone number template
					return format$$1.format().replace(FIRST_GROUP_PATTERN, format$$1.nationalPrefixFormattingRule());
				}
			}
			// Special handling for NANPA countries for AsYouType formatter.
			// Copied from Google's `libphonenumber`:
			// https://github.com/googlei18n/libphonenumber/blob/66986dbbe443ee8450e2b54dcd44ac384b3bbee8/java/libphonenumber/src/com/google/i18n/phonenumbers/AsYouTypeFormatter.java#L535-L573
			else if (this.countryCallingCode === '1' && this.national_prefix === '1') {
					return '1 ' + format$$1.format();
				}

			return format$$1.format();
		}

		// Determines the country of the phone number
		// entered so far based on the country phone code
		// and the national phone number.

	}, {
		key: 'determine_the_country',
		value: function determine_the_country() {
			this.country = find_country_code(this.countryCallingCode, this.national_number, this.metadata);
		}
	}, {
		key: 'getNumber',
		value: function getNumber() {
			if (!this.countryCallingCode || !this.national_number) {
				return undefined;
			}
			var phoneNumber = new PhoneNumber(this.country || this.countryCallingCode, this.national_number, this.metadata.metadata);
			if (this.carrierCode) {
				phoneNumber.carrierCode = this.carrierCode;
			}
			// Phone number extensions are not supported by "As You Type" formatter.
			return phoneNumber;
		}
	}, {
		key: 'getNationalNumber',
		value: function getNationalNumber() {
			return this.national_number;
		}
	}, {
		key: 'getTemplate',
		value: function getTemplate() {
			if (!this.template) {
				return;
			}

			var index = -1;

			var i = 0;
			while (i < this.parsed_input.length) {
				index = this.template.indexOf(DIGIT_PLACEHOLDER, index + 1);
				i++;
			}

			return cut_stripping_dangling_braces(this.template, index + 1);
		}
	}]);

	return AsYouType;
}();


function strip_dangling_braces(string) {
	var dangling_braces = [];
	var i = 0;
	while (i < string.length) {
		if (string[i] === '(') {
			dangling_braces.push(i);
		} else if (string[i] === ')') {
			dangling_braces.pop();
		}
		i++;
	}

	var start = 0;
	var cleared_string = '';
	dangling_braces.push(string.length);
	for (var _iterator4 = dangling_braces, _isArray4 = Array.isArray(_iterator4), _i4 = 0, _iterator4 = _isArray4 ? _iterator4 : _iterator4[Symbol.iterator]();;) {
		var _ref4;

		if (_isArray4) {
			if (_i4 >= _iterator4.length) break;
			_ref4 = _iterator4[_i4++];
		} else {
			_i4 = _iterator4.next();
			if (_i4.done) break;
			_ref4 = _i4.value;
		}

		var index = _ref4;

		cleared_string += string.slice(start, index);
		start = index + 1;
	}

	return cleared_string;
}

function cut_stripping_dangling_braces(string, cut_before_index) {
	if (string[cut_before_index] === ')') {
		cut_before_index++;
	}
	return strip_dangling_braces(string.slice(0, cut_before_index));
}

// Repeats a string (or a symbol) N times.
// http://stackoverflow.com/questions/202605/repeat-string-javascript
function repeat$1(string, times) {
	if (times < 1) {
		return '';
	}

	var result = '';

	while (times > 1) {
		if (times & 1) {
			result += string;
		}

		times >>= 1;
		string += string;
	}

	return result + string;
}

function parsePhoneNumber$1()
{
	var parameters = Array.prototype.slice.call(arguments);
	parameters.push(metadata);
	return parsePhoneNumber.apply(this, parameters)
}

// Deprecated.
function PhoneNumberSearch$1(text, options)
{
	PhoneNumberSearch.call(this, text, options, metadata);
}

// Deprecated.
PhoneNumberSearch$1.prototype = Object.create(PhoneNumberSearch.prototype, {});
PhoneNumberSearch$1.prototype.constructor = PhoneNumberSearch$1;

function PhoneNumberMatcher$1(text, options)
{
	PhoneNumberMatcher.call(this, text, options, metadata);
}

PhoneNumberMatcher$1.prototype = Object.create(PhoneNumberMatcher.prototype, {});
PhoneNumberMatcher$1.prototype.constructor = PhoneNumberMatcher$1;

function AsYouType$1(country)
{
	AsYouType.call(this, country, metadata);
}

AsYouType$1.prototype = Object.create(AsYouType.prototype, {});
AsYouType$1.prototype.constructor = AsYouType$1;

var isTouch = 'ontouchstart' in window || navigator.msMaxTouchPoints > 0;
var eventNames = isTouch ? ['touchstart', 'click'] : ['click'];
var instances = [];
function processDirectiveArguments(bindingValue) {
    var isFunction = typeof bindingValue === 'function';
    if (!isFunction && typeof bindingValue !== 'object') {
        throw new Error('v-click-outside: Binding value must be a function or an object');
    }
    return {
        handler: isFunction ? bindingValue : bindingValue.handler,
        middleware: bindingValue.middleware || (function (isClickOutside) { return isClickOutside; }),
        events: bindingValue.events || eventNames,
    };
}
function onEvent(_a) {
    var el = _a.el, event = _a.event, handler = _a.handler, middleware = _a.middleware;
    var isClickOutside = event.target !== el && !el.contains(event.target);
    if (!isClickOutside) {
        return;
    }
    if (middleware(event, el)) {
        handler(event, el);
    }
}
function bind$1(el, _a) {
    var value = _a.value;
    var _b = processDirectiveArguments(value), handler = _b.handler, middleware = _b.middleware, events = _b.events;
    var instance = {
        el: el,
        eventHandlers: events.map(function (eventName) { return ({
            event: eventName,
            handler: function (event) { return onEvent({ event: event, el: el, handler: handler, middleware: middleware }); },
        }); }),
    };
    instance.eventHandlers.forEach(function (eventHandler) { return document.addEventListener(eventHandler.event, eventHandler.handler); });
    instances.push(instance);
}
function update(el, _a) {
    var value = _a.value;
    var _b = processDirectiveArguments(value), handler = _b.handler, middleware = _b.middleware, events = _b.events;
    var instance = instances.find(function (i) { return i.el === el; });
    if (instance) {
        instance.eventHandlers.forEach(function (eventHandler) {
            return document.removeEventListener(eventHandler.event, eventHandler.handler);
        });
        instance.eventHandlers = events.map(function (eventName) { return ({
            event: eventName,
            handler: function (event) { return onEvent({ event: event, el: el, handler: handler, middleware: middleware }); },
        }); });
        instance.eventHandlers.forEach(function (eventHandler) { return document.addEventListener(eventHandler.event, eventHandler.handler); });
    }
}
function unbind(el) {
    var instance = instances.find(function (i) { return i.el === el; });
    if (instance) {
        instance.eventHandlers.forEach(function (_a) {
            var event = _a.event, handler = _a.handler;
            return document.removeEventListener(event, handler);
        });
    }
}
var clickOuside = { bind: bind$1, update: update, unbind: unbind, instances: instances };
// Note: This is to disable the directive on server side, there should be a better way.
//       https://github.com/ndelvalle/v-click-outside/issues/22
var clickOutside = (typeof window !== 'undefined' ? clickOuside : {});

var createListItem = function (h, cca2, country) {
    var listItem = h('li', {
        "class": {
            active: false
        },
        key: cca2,
        on: {
            click: function () {
                if (listItem.context) {
                    listItem.context.$parent.$emit('update:country', country);
                    listItem.context.$parent.$emit('update:visible', false);
                }
            }
        },
        style: {
            borderBottom: '1px solid rgba(96,125,139,.2)'
        }
    }, [
        h('span', {
            "class": {
                flag: true
            },
            domProps: {
                innerHTML: country.flag
            }
        }),
        h('span', {
            style: {
                flexDirection: 'column'
            }
        }, [
            h('span', {
                domProps: {
                    innerHTML: country.name.common + " (+" + country.callingCode + ")"
                },
                style: {
                    color: 'rgba(96,125,139,.6)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexGrow: 1
                }
            }),
            h('span', {
                domProps: {
                    innerHTML: country.name.native
                },
                style: {
                    color: 'rgba(96,125,139,.6)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexGrow: 1
                }
            })
        ])
    ]);
    if (listItem.context && listItem.data && (listItem.key === listItem.context.selected.cca2)) {
        Object.assign(listItem.data["class"], { active: true });
    }
    return listItem;
};
var CountryList = Vue.extend({
    created: function () {
        if (this.selected) {
            this.filter = typeof this.selected.name !== 'undefined' ? this.selected.name.common : '';
        }
    },
    data: function () {
        return {
            filter: ''
        };
    },
    directives: {
        'click-outside': clickOutside
    },
    methods: {
        onClickOutside: function () {
            if (this.visible) {
                this.$parent.$emit('update:visible', false);
            }
        }
    },
    props: ['countries', 'selected', 'visible'],
    render: function (h) {
        var _this = this;
        return h('div', {
            "class": {
                'list-wrapper': true
            },
            directives: [
                {
                    arg: '',
                    expression: '',
                    modifiers: {},
                    name: 'click-outside',
                    oldValue: this.visible,
                    value: this.onClickOutside
                }
            ]
        }, [
            h('span', {
                style: {
                    display: 'flex'
                }
            }, [
                h('input', {
                    attrs: {
                        placeholder: this.filter.length === 0 ? 'Search Countries...' : '',
                        type: 'text'
                    },
                    domProps: {
                        value: this.filter
                    },
                    key: 'list-input',
                    on: {
                        input: function (event) {
                            if (event.target) {
                                var value_1 = event.target.value;
                                _this.$nextTick(function () {
                                    _this.filter = value_1;
                                });
                            }
                        }
                    },
                    style: {
                        flexGrow: 5
                    }
                }),
                h('span', {
                    "class": {
                        clearable: true
                    },
                    domProps: {
                        innerHTML: 'X'
                    },
                    on: {
                        click: function () {
                            _this.$parent.$emit('update:country', {});
                            _this.filter = '';
                        }
                    }
                })
            ]),
            h('transition-group', {
                attrs: {
                    name: 'list'
                },
                key: 'list-items',
                ref: 'list',
                tag: 'ul'
            }, Object.keys(this.countries).filter(function (cca2) {
                var country = _this.countries[cca2];
                var filter = _this.filter.toLowerCase();
                switch (true) {
                    case !filter.length:
                    case cca2.toLowerCase().includes(filter):
                    case country.name.common.toLowerCase().includes(filter):
                    case country.name.official.toLowerCase().includes(filter):
                        return true;
                    default:
                        return false;
                }
            })
                .reduce(function (list, cca2) { return list.concat([createListItem(h, cca2, _this.countries[cca2])]); }, []))
        ]);
    },
    watch: {
        visible: {
            immediate: true,
            handler: function (isVisible) {
                if (isVisible) {
                    var activeElement = document.querySelector('li.active');
                    if (activeElement) {
                        if (this.selected) {
                            this.filter = this.selected.name.common;
                        }
                        var $el = this.$refs.list.$el;
                        $el.scrollTo(0, activeElement.offsetTop);
                    }
                }
            }
        }
    }
});

var AW = {
	cca2: "AW",
	flag: "🇦🇼",
	name: {
		common: "Aruba",
		official: "Aruba",
		native: "Aruba"
	},
	callingCode: "297"
};
var AF = {
	cca2: "AF",
	flag: "🇦🇫",
	name: {
		common: "Afghanistan",
		official: "Islamic Republic of Afghanistan",
		native: "جمهوری اسلامی افغانستان"
	},
	callingCode: "93"
};
var AO = {
	cca2: "AO",
	flag: "🇦🇴",
	name: {
		common: "Angola",
		official: "Republic of Angola",
		native: "República de Angola"
	},
	callingCode: "244"
};
var AI = {
	cca2: "AI",
	flag: "🇦🇮",
	name: {
		common: "Anguilla",
		official: "Anguilla",
		native: "Anguilla"
	},
	callingCode: "1"
};
var AX = {
	cca2: "AX",
	flag: "🇦🇽",
	name: {
		common: "Åland Islands",
		official: "Åland Islands",
		native: "Landskapet Åland"
	},
	callingCode: "358"
};
var AL = {
	cca2: "AL",
	flag: "🇦🇱",
	name: {
		common: "Albania",
		official: "Republic of Albania",
		native: "Republika e Shqipërisë"
	},
	callingCode: "355"
};
var AD = {
	cca2: "AD",
	flag: "🇦🇩",
	name: {
		common: "Andorra",
		official: "Principality of Andorra",
		native: "Principat d'Andorra"
	},
	callingCode: "376"
};
var AE = {
	cca2: "AE",
	flag: "🇦🇪",
	name: {
		common: "United Arab Emirates",
		official: "United Arab Emirates",
		native: "الإمارات العربية المتحدة"
	},
	callingCode: "971"
};
var AR = {
	cca2: "AR",
	flag: "🇦🇷",
	name: {
		common: "Argentina",
		official: "Argentine Republic",
		native: "Argentine Republic"
	},
	callingCode: "54"
};
var AM = {
	cca2: "AM",
	flag: "🇦🇲",
	name: {
		common: "Armenia",
		official: "Republic of Armenia",
		native: "Հայաստանի Հանրապետություն"
	},
	callingCode: "374"
};
var AS = {
	cca2: "AS",
	flag: "🇦🇸",
	name: {
		common: "American Samoa",
		official: "American Samoa",
		native: "American Samoa"
	},
	callingCode: "1"
};
var AG = {
	cca2: "AG",
	flag: "🇦🇬",
	name: {
		common: "Antigua and Barbuda",
		official: "Antigua and Barbuda",
		native: "Antigua and Barbuda"
	},
	callingCode: "1"
};
var AU = {
	cca2: "AU",
	flag: "🇦🇺",
	name: {
		common: "Australia",
		official: "Commonwealth of Australia",
		native: "Commonwealth of Australia"
	},
	callingCode: "61"
};
var AT = {
	cca2: "AT",
	flag: "🇦🇹",
	name: {
		common: "Austria",
		official: "Republic of Austria",
		native: "Republik Österreich"
	},
	callingCode: "43"
};
var AZ = {
	cca2: "AZ",
	flag: "🇦🇿",
	name: {
		common: "Azerbaijan",
		official: "Republic of Azerbaijan",
		native: "Azərbaycan Respublikası"
	},
	callingCode: "994"
};
var BI = {
	cca2: "BI",
	flag: "🇧🇮",
	name: {
		common: "Burundi",
		official: "Republic of Burundi",
		native: "République du Burundi"
	},
	callingCode: "257"
};
var BE = {
	cca2: "BE",
	flag: "🇧🇪",
	name: {
		common: "Belgium",
		official: "Kingdom of Belgium",
		native: "Königreich Belgien"
	},
	callingCode: "32"
};
var BJ = {
	cca2: "BJ",
	flag: "🇧🇯",
	name: {
		common: "Benin",
		official: "Republic of Benin",
		native: "République du Bénin"
	},
	callingCode: "229"
};
var BF = {
	cca2: "BF",
	flag: "🇧🇫",
	name: {
		common: "Burkina Faso",
		official: "Burkina Faso",
		native: "République du Burkina"
	},
	callingCode: "226"
};
var BD = {
	cca2: "BD",
	flag: "🇧🇩",
	name: {
		common: "Bangladesh",
		official: "People's Republic of Bangladesh",
		native: "বাংলাদেশ গণপ্রজাতন্ত্রী"
	},
	callingCode: "880"
};
var BG = {
	cca2: "BG",
	flag: "🇧🇬",
	name: {
		common: "Bulgaria",
		official: "Republic of Bulgaria",
		native: "Република България"
	},
	callingCode: "359"
};
var BH = {
	cca2: "BH",
	flag: "🇧🇭",
	name: {
		common: "Bahrain",
		official: "Kingdom of Bahrain",
		native: "مملكة البحرين"
	},
	callingCode: "973"
};
var BS = {
	cca2: "BS",
	flag: "🇧🇸",
	name: {
		common: "Bahamas",
		official: "Commonwealth of the Bahamas",
		native: "Commonwealth of the Bahamas"
	},
	callingCode: "1"
};
var BA = {
	cca2: "BA",
	flag: "🇧🇦",
	name: {
		common: "Bosnia and Herzegovina",
		official: "Bosnia and Herzegovina",
		native: "Bosna i Hercegovina"
	},
	callingCode: "387"
};
var BL = {
	cca2: "BL",
	flag: "🇧🇱",
	name: {
		common: "Saint Barthélemy",
		official: "Collectivity of Saint Barthélemy",
		native: "Collectivité de Saint-Barthélemy"
	},
	callingCode: "590"
};
var SH = {
	cca2: "SH",
	flag: "🇸🇭",
	name: {
		common: "Saint Helena, Ascension and Tristan da Cunha",
		official: "Saint Helena, Ascension and Tristan da Cunha",
		native: "Saint Helena, Ascension and Tristan da Cunha"
	},
	callingCode: "290"
};
var BY = {
	cca2: "BY",
	flag: "🇧🇾",
	name: {
		common: "Belarus",
		official: "Republic of Belarus",
		native: "Рэспубліка Беларусь"
	},
	callingCode: "375"
};
var BZ = {
	cca2: "BZ",
	flag: "🇧🇿",
	name: {
		common: "Belize",
		official: "Belize",
		native: "Belize"
	},
	callingCode: "501"
};
var BM = {
	cca2: "BM",
	flag: "🇧🇲",
	name: {
		common: "Bermuda",
		official: "Bermuda",
		native: "Bermuda"
	},
	callingCode: "1"
};
var BO = {
	cca2: "BO",
	flag: "🇧🇴",
	name: {
		common: "Bolivia",
		official: "Plurinational State of Bolivia",
		native: "Wuliwya Suyu"
	},
	callingCode: "591"
};
var BQ = {
	cca2: "BQ",
	flag: "",
	name: {
		common: "Caribbean Netherlands",
		official: "Bonaire, Sint Eustatius and Saba",
		native: "Bonaire, Sint Eustatius en Saba"
	},
	callingCode: "599"
};
var BR = {
	cca2: "BR",
	flag: "🇧🇷",
	name: {
		common: "Brazil",
		official: "Federative Republic of Brazil",
		native: "República Federativa do Brasil"
	},
	callingCode: "55"
};
var BB = {
	cca2: "BB",
	flag: "🇧🇧",
	name: {
		common: "Barbados",
		official: "Barbados",
		native: "Barbados"
	},
	callingCode: "1"
};
var BN = {
	cca2: "BN",
	flag: "🇧🇳",
	name: {
		common: "Brunei",
		official: "Nation of Brunei, Abode of Peace",
		native: "Nation of Brunei, Abode Damai"
	},
	callingCode: "673"
};
var BT = {
	cca2: "BT",
	flag: "🇧🇹",
	name: {
		common: "Bhutan",
		official: "Kingdom of Bhutan",
		native: "འབྲུག་རྒྱལ་ཁབ་"
	},
	callingCode: "975"
};
var BW = {
	cca2: "BW",
	flag: "🇧🇼",
	name: {
		common: "Botswana",
		official: "Republic of Botswana",
		native: "Republic of Botswana"
	},
	callingCode: "267"
};
var CF = {
	cca2: "CF",
	flag: "🇨🇫",
	name: {
		common: "Central African Republic",
		official: "Central African Republic",
		native: "République centrafricaine"
	},
	callingCode: "236"
};
var CA = {
	cca2: "CA",
	flag: "🇨🇦",
	name: {
		common: "Canada",
		official: "Canada",
		native: "Canada"
	},
	callingCode: "1"
};
var CC = {
	cca2: "CC",
	flag: "🇨🇨",
	name: {
		common: "Cocos (Keeling) Islands",
		official: "Territory of the Cocos (Keeling) Islands",
		native: "Territory of the Cocos (Keeling) Islands"
	},
	callingCode: "61"
};
var CH = {
	cca2: "CH",
	flag: "🇨🇭",
	name: {
		common: "Switzerland",
		official: "Swiss Confederation",
		native: "Confédération suisse"
	},
	callingCode: "41"
};
var CL = {
	cca2: "CL",
	flag: "🇨🇱",
	name: {
		common: "Chile",
		official: "Republic of Chile",
		native: "República de Chile"
	},
	callingCode: "56"
};
var CN = {
	cca2: "CN",
	flag: "🇨🇳",
	name: {
		common: "China",
		official: "People's Republic of China",
		native: "中华人民共和国"
	},
	callingCode: "86"
};
var CI = {
	cca2: "CI",
	flag: "🇨🇮",
	name: {
		common: "Ivory Coast",
		official: "Republic of Côte d'Ivoire",
		native: "République de Côte d'Ivoire"
	},
	callingCode: "225"
};
var CM = {
	cca2: "CM",
	flag: "🇨🇲",
	name: {
		common: "Cameroon",
		official: "Republic of Cameroon",
		native: "Republic of Cameroon"
	},
	callingCode: "237"
};
var CD = {
	cca2: "CD",
	flag: "🇨🇩",
	name: {
		common: "DR Congo",
		official: "Democratic Republic of the Congo",
		native: "République démocratique du Congo"
	},
	callingCode: "243"
};
var CG = {
	cca2: "CG",
	flag: "🇨🇬",
	name: {
		common: "Republic of the Congo",
		official: "Republic of the Congo",
		native: "République du Congo"
	},
	callingCode: "242"
};
var CK = {
	cca2: "CK",
	flag: "🇨🇰",
	name: {
		common: "Cook Islands",
		official: "Cook Islands",
		native: "Cook Islands"
	},
	callingCode: "682"
};
var CO = {
	cca2: "CO",
	flag: "🇨🇴",
	name: {
		common: "Colombia",
		official: "Republic of Colombia",
		native: "República de Colombia"
	},
	callingCode: "57"
};
var KM = {
	cca2: "KM",
	flag: "🇰🇲",
	name: {
		common: "Comoros",
		official: "Union of the Comoros",
		native: "الاتحاد القمري"
	},
	callingCode: "269"
};
var CV = {
	cca2: "CV",
	flag: "🇨🇻",
	name: {
		common: "Cape Verde",
		official: "Republic of Cabo Verde",
		native: "República de Cabo Verde"
	},
	callingCode: "238"
};
var CR = {
	cca2: "CR",
	flag: "🇨🇷",
	name: {
		common: "Costa Rica",
		official: "Republic of Costa Rica",
		native: "República de Costa Rica"
	},
	callingCode: "506"
};
var CU = {
	cca2: "CU",
	flag: "🇨🇺",
	name: {
		common: "Cuba",
		official: "Republic of Cuba",
		native: "República de Cuba"
	},
	callingCode: "53"
};
var CW = {
	cca2: "CW",
	flag: "🇨🇼",
	name: {
		common: "Curaçao",
		official: "Country of Curaçao",
		native: "Country of Curaçao"
	},
	callingCode: "599"
};
var CX = {
	cca2: "CX",
	flag: "🇨🇽",
	name: {
		common: "Christmas Island",
		official: "Territory of Christmas Island",
		native: "Territory of Christmas Island"
	},
	callingCode: "61"
};
var KY = {
	cca2: "KY",
	flag: "🇰🇾",
	name: {
		common: "Cayman Islands",
		official: "Cayman Islands",
		native: "Cayman Islands"
	},
	callingCode: "1"
};
var CY = {
	cca2: "CY",
	flag: "🇨🇾",
	name: {
		common: "Cyprus",
		official: "Republic of Cyprus",
		native: "Δημοκρατία της Κύπρος"
	},
	callingCode: "357"
};
var CZ = {
	cca2: "CZ",
	flag: "🇨🇿",
	name: {
		common: "Czechia",
		official: "Czech Republic",
		native: "česká republika"
	},
	callingCode: "420"
};
var DE = {
	cca2: "DE",
	flag: "🇩🇪",
	name: {
		common: "Germany",
		official: "Federal Republic of Germany",
		native: "Bundesrepublik Deutschland"
	},
	callingCode: "49"
};
var DJ = {
	cca2: "DJ",
	flag: "🇩🇯",
	name: {
		common: "Djibouti",
		official: "Republic of Djibouti",
		native: "جمهورية جيبوتي"
	},
	callingCode: "253"
};
var DM = {
	cca2: "DM",
	flag: "🇩🇲",
	name: {
		common: "Dominica",
		official: "Commonwealth of Dominica",
		native: "Commonwealth of Dominica"
	},
	callingCode: "1"
};
var DK = {
	cca2: "DK",
	flag: "🇩🇰",
	name: {
		common: "Denmark",
		official: "Kingdom of Denmark",
		native: "Kongeriget Danmark"
	},
	callingCode: "45"
};
var DO = {
	cca2: "DO",
	flag: "🇩🇴",
	name: {
		common: "Dominican Republic",
		official: "Dominican Republic",
		native: "República Dominicana"
	},
	callingCode: "1"
};
var DZ = {
	cca2: "DZ",
	flag: "🇩🇿",
	name: {
		common: "Algeria",
		official: "People's Democratic Republic of Algeria",
		native: "الجمهورية الديمقراطية الشعبية الجزائرية"
	},
	callingCode: "213"
};
var EC = {
	cca2: "EC",
	flag: "🇪🇨",
	name: {
		common: "Ecuador",
		official: "Republic of Ecuador",
		native: "República del Ecuador"
	},
	callingCode: "593"
};
var EG = {
	cca2: "EG",
	flag: "🇪🇬",
	name: {
		common: "Egypt",
		official: "Arab Republic of Egypt",
		native: "جمهورية مصر العربية"
	},
	callingCode: "20"
};
var ER = {
	cca2: "ER",
	flag: "🇪🇷",
	name: {
		common: "Eritrea",
		official: "State of Eritrea",
		native: "دولة إرتريا"
	},
	callingCode: "291"
};
var EH = {
	cca2: "EH",
	flag: "🇪🇭",
	name: {
		common: "Western Sahara",
		official: "Sahrawi Arab Democratic Republic",
		native: "Sahrawi Arab Democratic Republic"
	},
	callingCode: "212"
};
var ES = {
	cca2: "ES",
	flag: "🇪🇸",
	name: {
		common: "Spain",
		official: "Kingdom of Spain",
		native: "Reino de España"
	},
	callingCode: "34"
};
var EE = {
	cca2: "EE",
	flag: "🇪🇪",
	name: {
		common: "Estonia",
		official: "Republic of Estonia",
		native: "Eesti Vabariik"
	},
	callingCode: "372"
};
var ET = {
	cca2: "ET",
	flag: "🇪🇹",
	name: {
		common: "Ethiopia",
		official: "Federal Democratic Republic of Ethiopia",
		native: "የኢትዮጵያ ፌዴራላዊ ዲሞክራሲያዊ ሪፐብሊክ"
	},
	callingCode: "251"
};
var FI = {
	cca2: "FI",
	flag: "🇫🇮",
	name: {
		common: "Finland",
		official: "Republic of Finland",
		native: "Suomen tasavalta"
	},
	callingCode: "358"
};
var FJ = {
	cca2: "FJ",
	flag: "🇫🇯",
	name: {
		common: "Fiji",
		official: "Republic of Fiji",
		native: "Republic of Fiji"
	},
	callingCode: "679"
};
var FK = {
	cca2: "FK",
	flag: "🇫🇰",
	name: {
		common: "Falkland Islands",
		official: "Falkland Islands",
		native: "Falkland Islands"
	},
	callingCode: "500"
};
var FR = {
	cca2: "FR",
	flag: "🇫🇷",
	name: {
		common: "France",
		official: "French Republic",
		native: "République française"
	},
	callingCode: "33"
};
var FO = {
	cca2: "FO",
	flag: "🇫🇴",
	name: {
		common: "Faroe Islands",
		official: "Faroe Islands",
		native: "Færøerne"
	},
	callingCode: "298"
};
var FM = {
	cca2: "FM",
	flag: "🇫🇲",
	name: {
		common: "Micronesia",
		official: "Federated States of Micronesia",
		native: "Federated States of Micronesia"
	},
	callingCode: "691"
};
var GA = {
	cca2: "GA",
	flag: "🇬🇦",
	name: {
		common: "Gabon",
		official: "Gabonese Republic",
		native: "République gabonaise"
	},
	callingCode: "241"
};
var GB = {
	cca2: "GB",
	flag: "🇬🇧",
	name: {
		common: "United Kingdom",
		official: "United Kingdom of Great Britain and Northern Ireland",
		native: "United Kingdom of Great Britain and Northern Ireland"
	},
	callingCode: "44"
};
var GE = {
	cca2: "GE",
	flag: "🇬🇪",
	name: {
		common: "Georgia",
		official: "Georgia",
		native: "საქართველო"
	},
	callingCode: "995"
};
var GG = {
	cca2: "GG",
	flag: "🇬🇬",
	name: {
		common: "Guernsey",
		official: "Bailiwick of Guernsey",
		native: "Bailiwick of Guernsey"
	},
	callingCode: "44"
};
var GH = {
	cca2: "GH",
	flag: "🇬🇭",
	name: {
		common: "Ghana",
		official: "Republic of Ghana",
		native: "Republic of Ghana"
	},
	callingCode: "233"
};
var GI = {
	cca2: "GI",
	flag: "🇬🇮",
	name: {
		common: "Gibraltar",
		official: "Gibraltar",
		native: "Gibraltar"
	},
	callingCode: "350"
};
var GN = {
	cca2: "GN",
	flag: "🇬🇳",
	name: {
		common: "Guinea",
		official: "Republic of Guinea",
		native: "République de Guinée"
	},
	callingCode: "224"
};
var GP = {
	cca2: "GP",
	flag: "🇬🇵",
	name: {
		common: "Guadeloupe",
		official: "Guadeloupe",
		native: "Guadeloupe"
	},
	callingCode: "590"
};
var GM = {
	cca2: "GM",
	flag: "🇬🇲",
	name: {
		common: "Gambia",
		official: "Republic of the Gambia",
		native: "Republic of the Gambia"
	},
	callingCode: "220"
};
var GW = {
	cca2: "GW",
	flag: "🇬🇼",
	name: {
		common: "Guinea-Bissau",
		official: "Republic of Guinea-Bissau",
		native: "República da Guiné-Bissau"
	},
	callingCode: "245"
};
var GQ = {
	cca2: "GQ",
	flag: "🇬🇶",
	name: {
		common: "Equatorial Guinea",
		official: "Republic of Equatorial Guinea",
		native: "République de la Guinée Équatoriale"
	},
	callingCode: "240"
};
var GR = {
	cca2: "GR",
	flag: "🇬🇷",
	name: {
		common: "Greece",
		official: "Hellenic Republic",
		native: "Ελληνική Δημοκρατία"
	},
	callingCode: "30"
};
var GD = {
	cca2: "GD",
	flag: "🇬🇩",
	name: {
		common: "Grenada",
		official: "Grenada",
		native: "Grenada"
	},
	callingCode: "1"
};
var GL = {
	cca2: "GL",
	flag: "🇬🇱",
	name: {
		common: "Greenland",
		official: "Greenland",
		native: "Kalaallit Nunaat"
	},
	callingCode: "299"
};
var GT = {
	cca2: "GT",
	flag: "🇬🇹",
	name: {
		common: "Guatemala",
		official: "Republic of Guatemala",
		native: "República de Guatemala"
	},
	callingCode: "502"
};
var GF = {
	cca2: "GF",
	flag: "🇬🇫",
	name: {
		common: "French Guiana",
		official: "Guiana",
		native: "Guyane"
	},
	callingCode: "594"
};
var GU = {
	cca2: "GU",
	flag: "🇬🇺",
	name: {
		common: "Guam",
		official: "Guam",
		native: "Guåhån"
	},
	callingCode: "1"
};
var GY = {
	cca2: "GY",
	flag: "🇬🇾",
	name: {
		common: "Guyana",
		official: "Co-operative Republic of Guyana",
		native: "Co-operative Republic of Guyana"
	},
	callingCode: "592"
};
var HK = {
	cca2: "HK",
	flag: "🇭🇰",
	name: {
		common: "Hong Kong",
		official: "Hong Kong Special Administrative Region of the People's Republic of China",
		native: "Hong Kong Special Administrative Region of the People's Republic of China"
	},
	callingCode: "852"
};
var HN = {
	cca2: "HN",
	flag: "🇭🇳",
	name: {
		common: "Honduras",
		official: "Republic of Honduras",
		native: "República de Honduras"
	},
	callingCode: "504"
};
var HR = {
	cca2: "HR",
	flag: "🇭🇷",
	name: {
		common: "Croatia",
		official: "Republic of Croatia",
		native: "Republika Hrvatska"
	},
	callingCode: "385"
};
var HT = {
	cca2: "HT",
	flag: "🇭🇹",
	name: {
		common: "Haiti",
		official: "Republic of Haiti",
		native: "République d'Haïti"
	},
	callingCode: "509"
};
var HU = {
	cca2: "HU",
	flag: "🇭🇺",
	name: {
		common: "Hungary",
		official: "Hungary",
		native: "Magyarország"
	},
	callingCode: "36"
};
var ID = {
	cca2: "ID",
	flag: "🇮🇩",
	name: {
		common: "Indonesia",
		official: "Republic of Indonesia",
		native: "Republik Indonesia"
	},
	callingCode: "62"
};
var IM = {
	cca2: "IM",
	flag: "🇮🇲",
	name: {
		common: "Isle of Man",
		official: "Isle of Man",
		native: "Isle of Man"
	},
	callingCode: "44"
};
var IN = {
	cca2: "IN",
	flag: "🇮🇳",
	name: {
		common: "India",
		official: "Republic of India",
		native: "Republic of India"
	},
	callingCode: "91"
};
var IO = {
	cca2: "IO",
	flag: "🇮🇴",
	name: {
		common: "British Indian Ocean Territory",
		official: "British Indian Ocean Territory",
		native: "British Indian Ocean Territory"
	},
	callingCode: "246"
};
var IE = {
	cca2: "IE",
	flag: "🇮🇪",
	name: {
		common: "Ireland",
		official: "Republic of Ireland",
		native: "Republic of Ireland"
	},
	callingCode: "353"
};
var IR = {
	cca2: "IR",
	flag: "🇮🇷",
	name: {
		common: "Iran",
		official: "Islamic Republic of Iran",
		native: "جمهوری اسلامی ایران"
	},
	callingCode: "98"
};
var IQ = {
	cca2: "IQ",
	flag: "🇮🇶",
	name: {
		common: "Iraq",
		official: "Republic of Iraq",
		native: "جمهورية العراق"
	},
	callingCode: "964"
};
var IS = {
	cca2: "IS",
	flag: "🇮🇸",
	name: {
		common: "Iceland",
		official: "Iceland",
		native: "Ísland"
	},
	callingCode: "354"
};
var IL = {
	cca2: "IL",
	flag: "🇮🇱",
	name: {
		common: "Israel",
		official: "State of Israel",
		native: "دولة إسرائيل"
	},
	callingCode: "972"
};
var IT = {
	cca2: "IT",
	flag: "🇮🇹",
	name: {
		common: "Italy",
		official: "Italian Republic",
		native: "Repubblica italiana"
	},
	callingCode: "39"
};
var JM = {
	cca2: "JM",
	flag: "🇯🇲",
	name: {
		common: "Jamaica",
		official: "Jamaica",
		native: "Jamaica"
	},
	callingCode: "1"
};
var JE = {
	cca2: "JE",
	flag: "🇯🇪",
	name: {
		common: "Jersey",
		official: "Bailiwick of Jersey",
		native: "Bailiwick of Jersey"
	},
	callingCode: "44"
};
var JO = {
	cca2: "JO",
	flag: "🇯🇴",
	name: {
		common: "Jordan",
		official: "Hashemite Kingdom of Jordan",
		native: "المملكة الأردنية الهاشمية"
	},
	callingCode: "962"
};
var JP = {
	cca2: "JP",
	flag: "🇯🇵",
	name: {
		common: "Japan",
		official: "Japan",
		native: "日本"
	},
	callingCode: "81"
};
var KZ = {
	cca2: "KZ",
	flag: "🇰🇿",
	name: {
		common: "Kazakhstan",
		official: "Republic of Kazakhstan",
		native: "Қазақстан Республикасы"
	},
	callingCode: "7"
};
var KE = {
	cca2: "KE",
	flag: "🇰🇪",
	name: {
		common: "Kenya",
		official: "Republic of Kenya",
		native: "Republic of Kenya"
	},
	callingCode: "254"
};
var KG = {
	cca2: "KG",
	flag: "🇰🇬",
	name: {
		common: "Kyrgyzstan",
		official: "Kyrgyz Republic",
		native: "Кыргыз Республикасы"
	},
	callingCode: "996"
};
var KH = {
	cca2: "KH",
	flag: "🇰🇭",
	name: {
		common: "Cambodia",
		official: "Kingdom of Cambodia",
		native: "ព្រះរាជាណាចក្រកម្ពុជា"
	},
	callingCode: "855"
};
var KI = {
	cca2: "KI",
	flag: "🇰🇮",
	name: {
		common: "Kiribati",
		official: "Independent and Sovereign Republic of Kiribati",
		native: "Independent and Sovereign Republic of Kiribati"
	},
	callingCode: "686"
};
var KN = {
	cca2: "KN",
	flag: "🇰🇳",
	name: {
		common: "Saint Kitts and Nevis",
		official: "Federation of Saint Christopher and Nevisa",
		native: "Federation of Saint Christopher and Nevisa"
	},
	callingCode: "1"
};
var KR = {
	cca2: "KR",
	flag: "🇰🇷",
	name: {
		common: "South Korea",
		official: "Republic of Korea",
		native: "한국"
	},
	callingCode: "82"
};
var XK = {
	cca2: "XK",
	flag: "🇽🇰",
	name: {
		common: "Kosovo",
		official: "Republic of Kosovo",
		native: "Republika e Kosovës"
	},
	callingCode: "383"
};
var KW = {
	cca2: "KW",
	flag: "🇰🇼",
	name: {
		common: "Kuwait",
		official: "State of Kuwait",
		native: "دولة الكويت"
	},
	callingCode: "965"
};
var LA = {
	cca2: "LA",
	flag: "🇱🇦",
	name: {
		common: "Laos",
		official: "Lao People's Democratic Republic",
		native: "ສາທາລະນະ ຊາທິປະໄຕ ຄົນລາວ ຂອງ"
	},
	callingCode: "856"
};
var LB = {
	cca2: "LB",
	flag: "🇱🇧",
	name: {
		common: "Lebanon",
		official: "Lebanese Republic",
		native: "الجمهورية اللبنانية"
	},
	callingCode: "961"
};
var LR = {
	cca2: "LR",
	flag: "🇱🇷",
	name: {
		common: "Liberia",
		official: "Republic of Liberia",
		native: "Republic of Liberia"
	},
	callingCode: "231"
};
var LY = {
	cca2: "LY",
	flag: "🇱🇾",
	name: {
		common: "Libya",
		official: "State of Libya",
		native: "الدولة ليبيا"
	},
	callingCode: "218"
};
var LC = {
	cca2: "LC",
	flag: "🇱🇨",
	name: {
		common: "Saint Lucia",
		official: "Saint Lucia",
		native: "Saint Lucia"
	},
	callingCode: "1"
};
var LI = {
	cca2: "LI",
	flag: "🇱🇮",
	name: {
		common: "Liechtenstein",
		official: "Principality of Liechtenstein",
		native: "Fürstentum Liechtenstein"
	},
	callingCode: "423"
};
var LK = {
	cca2: "LK",
	flag: "🇱🇰",
	name: {
		common: "Sri Lanka",
		official: "Democratic Socialist Republic of Sri Lanka",
		native: "ශ්‍රී ලංකා ප්‍රජාතාන්ත්‍රික සමාජවාදී ජනරජය"
	},
	callingCode: "94"
};
var LS = {
	cca2: "LS",
	flag: "🇱🇸",
	name: {
		common: "Lesotho",
		official: "Kingdom of Lesotho",
		native: "Kingdom of Lesotho"
	},
	callingCode: "266"
};
var LT = {
	cca2: "LT",
	flag: "🇱🇹",
	name: {
		common: "Lithuania",
		official: "Republic of Lithuania",
		native: "Lietuvos Respublikos"
	},
	callingCode: "370"
};
var LU = {
	cca2: "LU",
	flag: "🇱🇺",
	name: {
		common: "Luxembourg",
		official: "Grand Duchy of Luxembourg",
		native: "Großherzogtum Luxemburg"
	},
	callingCode: "352"
};
var LV = {
	cca2: "LV",
	flag: "🇱🇻",
	name: {
		common: "Latvia",
		official: "Republic of Latvia",
		native: "Latvijas Republikas"
	},
	callingCode: "371"
};
var MO = {
	cca2: "MO",
	flag: "🇲🇴",
	name: {
		common: "Macau",
		official: "Macao Special Administrative Region of the People's Republic of China",
		native: "Região Administrativa Especial de Macau da República Popular da China"
	},
	callingCode: "853"
};
var MF = {
	cca2: "MF",
	flag: "🇲🇫",
	name: {
		common: "Saint Martin",
		official: "Saint Martin",
		native: "Saint-Martin"
	},
	callingCode: "590"
};
var MA = {
	cca2: "MA",
	flag: "🇲🇦",
	name: {
		common: "Morocco",
		official: "Kingdom of Morocco",
		native: "المملكة المغربية"
	},
	callingCode: "212"
};
var MC = {
	cca2: "MC",
	flag: "🇲🇨",
	name: {
		common: "Monaco",
		official: "Principality of Monaco",
		native: "Principauté de Monaco"
	},
	callingCode: "377"
};
var MD = {
	cca2: "MD",
	flag: "🇲🇩",
	name: {
		common: "Moldova",
		official: "Republic of Moldova",
		native: "Republica Moldova"
	},
	callingCode: "373"
};
var MG = {
	cca2: "MG",
	flag: "🇲🇬",
	name: {
		common: "Madagascar",
		official: "Republic of Madagascar",
		native: "République de Madagascar"
	},
	callingCode: "261"
};
var MV = {
	cca2: "MV",
	flag: "🇲🇻",
	name: {
		common: "Maldives",
		official: "Republic of the Maldives",
		native: "ދިވެހިރާއްޖޭގެ ޖުމްހޫރިއްޔާ"
	},
	callingCode: "960"
};
var MX = {
	cca2: "MX",
	flag: "🇲🇽",
	name: {
		common: "Mexico",
		official: "United Mexican States",
		native: "Estados Unidos Mexicanos"
	},
	callingCode: "52"
};
var MH = {
	cca2: "MH",
	flag: "🇲🇭",
	name: {
		common: "Marshall Islands",
		official: "Republic of the Marshall Islands",
		native: "Republic of the Marshall Islands"
	},
	callingCode: "692"
};
var MK = {
	cca2: "MK",
	flag: "🇲🇰",
	name: {
		common: "Macedonia",
		official: "Republic of Macedonia",
		native: "Република Македонија"
	},
	callingCode: "389"
};
var ML = {
	cca2: "ML",
	flag: "🇲🇱",
	name: {
		common: "Mali",
		official: "Republic of Mali",
		native: "République du Mali"
	},
	callingCode: "223"
};
var MT = {
	cca2: "MT",
	flag: "🇲🇹",
	name: {
		common: "Malta",
		official: "Republic of Malta",
		native: "Repubblika ta ' Malta"
	},
	callingCode: "356"
};
var MM = {
	cca2: "MM",
	flag: "🇲🇲",
	name: {
		common: "Myanmar",
		official: "Republic of the Union of Myanmar",
		native: "ပြည်ထောင်စု သမ္မတ မြန်မာနိုင်ငံတော်"
	},
	callingCode: "95"
};
var ME = {
	cca2: "ME",
	flag: "🇲🇪",
	name: {
		common: "Montenegro",
		official: "Montenegro",
		native: "Црна Гора"
	},
	callingCode: "382"
};
var MN = {
	cca2: "MN",
	flag: "🇲🇳",
	name: {
		common: "Mongolia",
		official: "Mongolia",
		native: "Монгол улс"
	},
	callingCode: "976"
};
var MP = {
	cca2: "MP",
	flag: "🇲🇵",
	name: {
		common: "Northern Mariana Islands",
		official: "Commonwealth of the Northern Mariana Islands",
		native: "Commonwealth of the Northern Mariana Islands"
	},
	callingCode: "1"
};
var MZ = {
	cca2: "MZ",
	flag: "🇲🇿",
	name: {
		common: "Mozambique",
		official: "Republic of Mozambique",
		native: "República de Moçambique"
	},
	callingCode: "258"
};
var MR = {
	cca2: "MR",
	flag: "🇲🇷",
	name: {
		common: "Mauritania",
		official: "Islamic Republic of Mauritania",
		native: "الجمهورية الإسلامية الموريتانية"
	},
	callingCode: "222"
};
var MS = {
	cca2: "MS",
	flag: "🇲🇸",
	name: {
		common: "Montserrat",
		official: "Montserrat",
		native: "Montserrat"
	},
	callingCode: "1"
};
var MQ = {
	cca2: "MQ",
	flag: "🇲🇶",
	name: {
		common: "Martinique",
		official: "Martinique",
		native: "Martinique"
	},
	callingCode: "596"
};
var MU = {
	cca2: "MU",
	flag: "🇲🇺",
	name: {
		common: "Mauritius",
		official: "Republic of Mauritius",
		native: "Republic of Mauritius"
	},
	callingCode: "230"
};
var MW = {
	cca2: "MW",
	flag: "🇲🇼",
	name: {
		common: "Malawi",
		official: "Republic of Malawi",
		native: "Republic of Malawi"
	},
	callingCode: "265"
};
var MY = {
	cca2: "MY",
	flag: "🇲🇾",
	name: {
		common: "Malaysia",
		official: "Malaysia",
		native: "Malaysia"
	},
	callingCode: "60"
};
var YT = {
	cca2: "YT",
	flag: "🇾🇹",
	name: {
		common: "Mayotte",
		official: "Department of Mayotte",
		native: "Département de Mayotte"
	},
	callingCode: "262"
};
var NA = {
	cca2: "NA",
	flag: "🇳🇦",
	name: {
		common: "Namibia",
		official: "Republic of Namibia",
		native: "Republiek van Namibië"
	},
	callingCode: "264"
};
var NC = {
	cca2: "NC",
	flag: "🇳🇨",
	name: {
		common: "New Caledonia",
		official: "New Caledonia",
		native: "Nouvelle-Calédonie"
	},
	callingCode: "687"
};
var NE = {
	cca2: "NE",
	flag: "🇳🇪",
	name: {
		common: "Niger",
		official: "Republic of Niger",
		native: "République du Niger"
	},
	callingCode: "227"
};
var NF = {
	cca2: "NF",
	flag: "🇳🇫",
	name: {
		common: "Norfolk Island",
		official: "Territory of Norfolk Island",
		native: "Territory of Norfolk Island"
	},
	callingCode: "672"
};
var NG = {
	cca2: "NG",
	flag: "🇳🇬",
	name: {
		common: "Nigeria",
		official: "Federal Republic of Nigeria",
		native: "Federal Republic of Nigeria"
	},
	callingCode: "234"
};
var NI = {
	cca2: "NI",
	flag: "🇳🇮",
	name: {
		common: "Nicaragua",
		official: "Republic of Nicaragua",
		native: "República de Nicaragua"
	},
	callingCode: "505"
};
var NU = {
	cca2: "NU",
	flag: "🇳🇺",
	name: {
		common: "Niue",
		official: "Niue",
		native: "Niuē"
	},
	callingCode: "683"
};
var NL = {
	cca2: "NL",
	flag: "🇳🇱",
	name: {
		common: "Netherlands",
		official: "Netherlands",
		native: "Nederland"
	},
	callingCode: "31"
};
var NO = {
	cca2: "NO",
	flag: "🇳🇴",
	name: {
		common: "Norway",
		official: "Kingdom of Norway",
		native: "Kongeriket Noreg"
	},
	callingCode: "47"
};
var NP = {
	cca2: "NP",
	flag: "🇳🇵",
	name: {
		common: "Nepal",
		official: "Federal Democratic Republic of Nepal",
		native: "नेपाल संघीय लोकतान्त्रिक गणतन्त्र"
	},
	callingCode: "977"
};
var NR = {
	cca2: "NR",
	flag: "🇳🇷",
	name: {
		common: "Nauru",
		official: "Republic of Nauru",
		native: "Republic of Nauru"
	},
	callingCode: "674"
};
var NZ = {
	cca2: "NZ",
	flag: "🇳🇿",
	name: {
		common: "New Zealand",
		official: "New Zealand",
		native: "New Zealand"
	},
	callingCode: "64"
};
var OM = {
	cca2: "OM",
	flag: "🇴🇲",
	name: {
		common: "Oman",
		official: "Sultanate of Oman",
		native: "سلطنة عمان"
	},
	callingCode: "968"
};
var PK = {
	cca2: "PK",
	flag: "🇵🇰",
	name: {
		common: "Pakistan",
		official: "Islamic Republic of Pakistan",
		native: "Islamic Republic of Pakistan"
	},
	callingCode: "92"
};
var PA = {
	cca2: "PA",
	flag: "🇵🇦",
	name: {
		common: "Panama",
		official: "Republic of Panama",
		native: "República de Panamá"
	},
	callingCode: "507"
};
var PN = {
	cca2: "PN",
	flag: "🇵🇳",
	name: {
		common: "Pitcairn Islands",
		official: "Pitcairn Group of Islands",
		native: "Pitcairn Group of Islands"
	},
	callingCode: 64
};
var PE = {
	cca2: "PE",
	flag: "🇵🇪",
	name: {
		common: "Peru",
		official: "Republic of Peru",
		native: "Piruw Suyu"
	},
	callingCode: "51"
};
var PH = {
	cca2: "PH",
	flag: "🇵🇭",
	name: {
		common: "Philippines",
		official: "Republic of the Philippines",
		native: "Republic of the Philippines"
	},
	callingCode: "63"
};
var PW = {
	cca2: "PW",
	flag: "🇵🇼",
	name: {
		common: "Palau",
		official: "Republic of Palau",
		native: "Republic of Palau"
	},
	callingCode: "680"
};
var PG = {
	cca2: "PG",
	flag: "🇵🇬",
	name: {
		common: "Papua New Guinea",
		official: "Independent State of Papua New Guinea",
		native: "Independent State of Papua New Guinea"
	},
	callingCode: "675"
};
var PL = {
	cca2: "PL",
	flag: "🇵🇱",
	name: {
		common: "Poland",
		official: "Republic of Poland",
		native: "Rzeczpospolita Polska"
	},
	callingCode: "48"
};
var PR = {
	cca2: "PR",
	flag: "🇵🇷",
	name: {
		common: "Puerto Rico",
		official: "Commonwealth of Puerto Rico",
		native: "Commonwealth of Puerto Rico"
	},
	callingCode: "1"
};
var KP = {
	cca2: "KP",
	flag: "🇰🇵",
	name: {
		common: "North Korea",
		official: "Democratic People's Republic of Korea",
		native: "조선 민주주의 인민 공화국"
	},
	callingCode: "850"
};
var PT = {
	cca2: "PT",
	flag: "🇵🇹",
	name: {
		common: "Portugal",
		official: "Portuguese Republic",
		native: "República português"
	},
	callingCode: "351"
};
var PY = {
	cca2: "PY",
	flag: "🇵🇾",
	name: {
		common: "Paraguay",
		official: "Republic of Paraguay",
		native: "Tetã Paraguái"
	},
	callingCode: "595"
};
var PS = {
	cca2: "PS",
	flag: "🇵🇸",
	name: {
		common: "Palestine",
		official: "State of Palestine",
		native: "دولة فلسطين"
	},
	callingCode: "970"
};
var PF = {
	cca2: "PF",
	flag: "🇵🇫",
	name: {
		common: "French Polynesia",
		official: "French Polynesia",
		native: "Polynésie française"
	},
	callingCode: "689"
};
var QA = {
	cca2: "QA",
	flag: "🇶🇦",
	name: {
		common: "Qatar",
		official: "State of Qatar",
		native: "دولة قطر"
	},
	callingCode: "974"
};
var RE = {
	cca2: "RE",
	flag: "🇷🇪",
	name: {
		common: "Réunion",
		official: "Réunion Island",
		native: "Ile de la Réunion"
	},
	callingCode: "262"
};
var RO = {
	cca2: "RO",
	flag: "🇷🇴",
	name: {
		common: "Romania",
		official: "Romania",
		native: "România"
	},
	callingCode: "40"
};
var RU = {
	cca2: "RU",
	flag: "🇷🇺",
	name: {
		common: "Russia",
		official: "Russian Federation",
		native: "Российская Федерация"
	},
	callingCode: "7"
};
var RW = {
	cca2: "RW",
	flag: "🇷🇼",
	name: {
		common: "Rwanda",
		official: "Republic of Rwanda",
		native: "Republic of Rwanda"
	},
	callingCode: "250"
};
var SA = {
	cca2: "SA",
	flag: "🇸🇦",
	name: {
		common: "Saudi Arabia",
		official: "Kingdom of Saudi Arabia",
		native: "المملكة العربية السعودية"
	},
	callingCode: "966"
};
var SD = {
	cca2: "SD",
	flag: "🇸🇩",
	name: {
		common: "Sudan",
		official: "Republic of the Sudan",
		native: "جمهورية السودان"
	},
	callingCode: "249"
};
var SN = {
	cca2: "SN",
	flag: "🇸🇳",
	name: {
		common: "Senegal",
		official: "Republic of Senegal",
		native: "République du Sénégal"
	},
	callingCode: "221"
};
var SG = {
	cca2: "SG",
	flag: "🇸🇬",
	name: {
		common: "Singapore",
		official: "Republic of Singapore",
		native: "新加坡共和国"
	},
	callingCode: "65"
};
var GS = {
	cca2: "GS",
	flag: "🇬🇸",
	name: {
		common: "South Georgia",
		official: "South Georgia and the South Sandwich Islands",
		native: "South Georgia and the South Sandwich Islands"
	},
	callingCode: 500
};
var SJ = {
	cca2: "SJ",
	flag: "🇸🇯",
	name: {
		common: "Svalbard and Jan Mayen",
		official: "Svalbard og Jan Mayen",
		native: "Svalbard og Jan Mayen"
	},
	callingCode: "47"
};
var SB = {
	cca2: "SB",
	flag: "🇸🇧",
	name: {
		common: "Solomon Islands",
		official: "Solomon Islands",
		native: "Solomon Islands"
	},
	callingCode: "677"
};
var SL = {
	cca2: "SL",
	flag: "🇸🇱",
	name: {
		common: "Sierra Leone",
		official: "Republic of Sierra Leone",
		native: "Republic of Sierra Leone"
	},
	callingCode: "232"
};
var SV = {
	cca2: "SV",
	flag: "🇸🇻",
	name: {
		common: "El Salvador",
		official: "Republic of El Salvador",
		native: "República de El Salvador"
	},
	callingCode: "503"
};
var SM = {
	cca2: "SM",
	flag: "🇸🇲",
	name: {
		common: "San Marino",
		official: "Most Serene Republic of San Marino",
		native: "Serenissima Repubblica di San Marino"
	},
	callingCode: "378"
};
var SO = {
	cca2: "SO",
	flag: "🇸🇴",
	name: {
		common: "Somalia",
		official: "Federal Republic of Somalia",
		native: "Jamhuuriyadda Federaalka Soomaaliya"
	},
	callingCode: "252"
};
var PM = {
	cca2: "PM",
	flag: "🇵🇲",
	name: {
		common: "Saint Pierre and Miquelon",
		official: "Saint Pierre and Miquelon",
		native: "Collectivité territoriale de Saint-Pierre-et-Miquelon"
	},
	callingCode: "508"
};
var RS = {
	cca2: "RS",
	flag: "🇷🇸",
	name: {
		common: "Serbia",
		official: "Republic of Serbia",
		native: "Република Србија"
	},
	callingCode: "381"
};
var SS = {
	cca2: "SS",
	flag: "🇸🇸",
	name: {
		common: "South Sudan",
		official: "Republic of South Sudan",
		native: "Republic of South Sudan"
	},
	callingCode: "211"
};
var ST = {
	cca2: "ST",
	flag: "🇸🇹",
	name: {
		common: "São Tomé and Príncipe",
		official: "Democratic Republic of São Tomé and Príncipe",
		native: "República Democrática do São Tomé e Príncipe"
	},
	callingCode: "239"
};
var SR = {
	cca2: "SR",
	flag: "🇸🇷",
	name: {
		common: "Suriname",
		official: "Republic of Suriname",
		native: "Republiek Suriname"
	},
	callingCode: "597"
};
var SK = {
	cca2: "SK",
	flag: "🇸🇰",
	name: {
		common: "Slovakia",
		official: "Slovak Republic",
		native: "Slovenská republika"
	},
	callingCode: "421"
};
var SI = {
	cca2: "SI",
	flag: "🇸🇮",
	name: {
		common: "Slovenia",
		official: "Republic of Slovenia",
		native: "Republika Slovenija"
	},
	callingCode: "386"
};
var SE = {
	cca2: "SE",
	flag: "🇸🇪",
	name: {
		common: "Sweden",
		official: "Kingdom of Sweden",
		native: "Konungariket Sverige"
	},
	callingCode: "46"
};
var SZ = {
	cca2: "SZ",
	flag: "🇸🇿",
	name: {
		common: "Swaziland",
		official: "Kingdom of Swaziland",
		native: "Kingdom of Swaziland"
	},
	callingCode: "268"
};
var SX = {
	cca2: "SX",
	flag: "🇸🇽",
	name: {
		common: "Sint Maarten",
		official: "Sint Maarten",
		native: "Sint Maarten"
	},
	callingCode: "1"
};
var SC = {
	cca2: "SC",
	flag: "🇸🇨",
	name: {
		common: "Seychelles",
		official: "Republic of Seychelles",
		native: "Repiblik Sesel"
	},
	callingCode: "248"
};
var SY = {
	cca2: "SY",
	flag: "🇸🇾",
	name: {
		common: "Syria",
		official: "Syrian Arab Republic",
		native: "الجمهورية العربية السورية"
	},
	callingCode: "963"
};
var TC = {
	cca2: "TC",
	flag: "🇹🇨",
	name: {
		common: "Turks and Caicos Islands",
		official: "Turks and Caicos Islands",
		native: "Turks and Caicos Islands"
	},
	callingCode: "1"
};
var TD = {
	cca2: "TD",
	flag: "🇹🇩",
	name: {
		common: "Chad",
		official: "Republic of Chad",
		native: "جمهورية تشاد"
	},
	callingCode: "235"
};
var TG = {
	cca2: "TG",
	flag: "🇹🇬",
	name: {
		common: "Togo",
		official: "Togolese Republic",
		native: "République togolaise"
	},
	callingCode: "228"
};
var TH = {
	cca2: "TH",
	flag: "🇹🇭",
	name: {
		common: "Thailand",
		official: "Kingdom of Thailand",
		native: "ราชอาณาจักรไทย"
	},
	callingCode: "66"
};
var TJ = {
	cca2: "TJ",
	flag: "🇹🇯",
	name: {
		common: "Tajikistan",
		official: "Republic of Tajikistan",
		native: "Республика Таджикистан"
	},
	callingCode: "992"
};
var TK = {
	cca2: "TK",
	flag: "🇹🇰",
	name: {
		common: "Tokelau",
		official: "Tokelau",
		native: "Tokelau"
	},
	callingCode: "690"
};
var TM = {
	cca2: "TM",
	flag: "🇹🇲",
	name: {
		common: "Turkmenistan",
		official: "Turkmenistan",
		native: "Туркменистан"
	},
	callingCode: "993"
};
var TL = {
	cca2: "TL",
	flag: "🇹🇱",
	name: {
		common: "Timor-Leste",
		official: "Democratic Republic of Timor-Leste",
		native: "República Democrática de Timor-Leste"
	},
	callingCode: "670"
};
var TO = {
	cca2: "TO",
	flag: "🇹🇴",
	name: {
		common: "Tonga",
		official: "Kingdom of Tonga",
		native: "Kingdom of Tonga"
	},
	callingCode: "676"
};
var TT = {
	cca2: "TT",
	flag: "🇹🇹",
	name: {
		common: "Trinidad and Tobago",
		official: "Republic of Trinidad and Tobago",
		native: "Republic of Trinidad and Tobago"
	},
	callingCode: "1"
};
var TN = {
	cca2: "TN",
	flag: "🇹🇳",
	name: {
		common: "Tunisia",
		official: "Tunisian Republic",
		native: "الجمهورية التونسية"
	},
	callingCode: "216"
};
var TR = {
	cca2: "TR",
	flag: "🇹🇷",
	name: {
		common: "Turkey",
		official: "Republic of Turkey",
		native: "Türkiye Cumhuriyeti"
	},
	callingCode: "90"
};
var TV = {
	cca2: "TV",
	flag: "🇹🇻",
	name: {
		common: "Tuvalu",
		official: "Tuvalu",
		native: "Tuvalu"
	},
	callingCode: "688"
};
var TW = {
	cca2: "TW",
	flag: "🇹🇼",
	name: {
		common: "Taiwan",
		official: "Republic of China (Taiwan)",
		native: "中華民國"
	},
	callingCode: "886"
};
var TZ = {
	cca2: "TZ",
	flag: "🇹🇿",
	name: {
		common: "Tanzania",
		official: "United Republic of Tanzania",
		native: "United Republic of Tanzania"
	},
	callingCode: "255"
};
var UG = {
	cca2: "UG",
	flag: "🇺🇬",
	name: {
		common: "Uganda",
		official: "Republic of Uganda",
		native: "Republic of Uganda"
	},
	callingCode: "256"
};
var UA$1 = {
	cca2: "UA",
	flag: "🇺🇦",
	name: {
		common: "Ukraine",
		official: "Ukraine",
		native: "Україна"
	},
	callingCode: "380"
};
var UY = {
	cca2: "UY",
	flag: "🇺🇾",
	name: {
		common: "Uruguay",
		official: "Oriental Republic of Uruguay",
		native: "República Oriental del Uruguay"
	},
	callingCode: "598"
};
var US = {
	cca2: "US",
	flag: "🇺🇸",
	name: {
		common: "United States",
		official: "United States of America",
		native: "United States of America"
	},
	callingCode: "1"
};
var UZ = {
	cca2: "UZ",
	flag: "🇺🇿",
	name: {
		common: "Uzbekistan",
		official: "Republic of Uzbekistan",
		native: "O'zbekiston Respublikasi"
	},
	callingCode: "998"
};
var VA = {
	cca2: "VA",
	flag: "🇻🇦",
	name: {
		common: "Vatican City",
		official: "Vatican City State",
		native: "Stato della Città del Vaticano"
	},
	callingCode: "39"
};
var VC = {
	cca2: "VC",
	flag: "🇻🇨",
	name: {
		common: "Saint Vincent and the Grenadines",
		official: "Saint Vincent and the Grenadines",
		native: "Saint Vincent and the Grenadines"
	},
	callingCode: "1"
};
var VE = {
	cca2: "VE",
	flag: "🇻🇪",
	name: {
		common: "Venezuela",
		official: "Bolivarian Republic of Venezuela",
		native: "República Bolivariana de Venezuela"
	},
	callingCode: "58"
};
var VG = {
	cca2: "VG",
	flag: "🇻🇬",
	name: {
		common: "British Virgin Islands",
		official: "Virgin Islands",
		native: "Virgin Islands"
	},
	callingCode: "1"
};
var VI = {
	cca2: "VI",
	flag: "🇻🇮",
	name: {
		common: "United States Virgin Islands",
		official: "Virgin Islands of the United States",
		native: "Virgin Islands of the United States"
	},
	callingCode: "1"
};
var VN = {
	cca2: "VN",
	flag: "🇻🇳",
	name: {
		common: "Vietnam",
		official: "Socialist Republic of Vietnam",
		native: "Cộng hòa xã hội chủ nghĩa Việt Nam"
	},
	callingCode: "84"
};
var VU = {
	cca2: "VU",
	flag: "🇻🇺",
	name: {
		common: "Vanuatu",
		official: "Republic of Vanuatu",
		native: "Ripablik blong Vanuatu"
	},
	callingCode: "678"
};
var WF = {
	cca2: "WF",
	flag: "🇼🇫",
	name: {
		common: "Wallis and Futuna",
		official: "Territory of the Wallis and Futuna Islands",
		native: "Territoire des îles Wallis et Futuna"
	},
	callingCode: "681"
};
var WS = {
	cca2: "WS",
	flag: "🇼🇸",
	name: {
		common: "Samoa",
		official: "Independent State of Samoa",
		native: "Independent State of Samoa"
	},
	callingCode: "685"
};
var YE = {
	cca2: "YE",
	flag: "🇾🇪",
	name: {
		common: "Yemen",
		official: "Republic of Yemen",
		native: "الجمهورية اليمنية"
	},
	callingCode: "967"
};
var ZA = {
	cca2: "ZA",
	flag: "🇿🇦",
	name: {
		common: "South Africa",
		official: "Republic of South Africa",
		native: "Republiek van Suid-Afrika"
	},
	callingCode: "27"
};
var ZM = {
	cca2: "ZM",
	flag: "🇿🇲",
	name: {
		common: "Zambia",
		official: "Republic of Zambia",
		native: "Republic of Zambia"
	},
	callingCode: "260"
};
var ZW = {
	cca2: "ZW",
	flag: "🇿🇼",
	name: {
		common: "Zimbabwe",
		official: "Republic of Zimbabwe",
		native: "Republic of Zimbabwe"
	},
	callingCode: "263"
};
var Countries = {
	AW: AW,
	AF: AF,
	AO: AO,
	AI: AI,
	AX: AX,
	AL: AL,
	AD: AD,
	AE: AE,
	AR: AR,
	AM: AM,
	AS: AS,
	AG: AG,
	AU: AU,
	AT: AT,
	AZ: AZ,
	BI: BI,
	BE: BE,
	BJ: BJ,
	BF: BF,
	BD: BD,
	BG: BG,
	BH: BH,
	BS: BS,
	BA: BA,
	BL: BL,
	SH: SH,
	BY: BY,
	BZ: BZ,
	BM: BM,
	BO: BO,
	BQ: BQ,
	BR: BR,
	BB: BB,
	BN: BN,
	BT: BT,
	BW: BW,
	CF: CF,
	CA: CA,
	CC: CC,
	CH: CH,
	CL: CL,
	CN: CN,
	CI: CI,
	CM: CM,
	CD: CD,
	CG: CG,
	CK: CK,
	CO: CO,
	KM: KM,
	CV: CV,
	CR: CR,
	CU: CU,
	CW: CW,
	CX: CX,
	KY: KY,
	CY: CY,
	CZ: CZ,
	DE: DE,
	DJ: DJ,
	DM: DM,
	DK: DK,
	DO: DO,
	DZ: DZ,
	EC: EC,
	EG: EG,
	ER: ER,
	EH: EH,
	ES: ES,
	EE: EE,
	ET: ET,
	FI: FI,
	FJ: FJ,
	FK: FK,
	FR: FR,
	FO: FO,
	FM: FM,
	GA: GA,
	GB: GB,
	GE: GE,
	GG: GG,
	GH: GH,
	GI: GI,
	GN: GN,
	GP: GP,
	GM: GM,
	GW: GW,
	GQ: GQ,
	GR: GR,
	GD: GD,
	GL: GL,
	GT: GT,
	GF: GF,
	GU: GU,
	GY: GY,
	HK: HK,
	HN: HN,
	HR: HR,
	HT: HT,
	HU: HU,
	ID: ID,
	IM: IM,
	IN: IN,
	IO: IO,
	IE: IE,
	IR: IR,
	IQ: IQ,
	IS: IS,
	IL: IL,
	IT: IT,
	JM: JM,
	JE: JE,
	JO: JO,
	JP: JP,
	KZ: KZ,
	KE: KE,
	KG: KG,
	KH: KH,
	KI: KI,
	KN: KN,
	KR: KR,
	XK: XK,
	KW: KW,
	LA: LA,
	LB: LB,
	LR: LR,
	LY: LY,
	LC: LC,
	LI: LI,
	LK: LK,
	LS: LS,
	LT: LT,
	LU: LU,
	LV: LV,
	MO: MO,
	MF: MF,
	MA: MA,
	MC: MC,
	MD: MD,
	MG: MG,
	MV: MV,
	MX: MX,
	MH: MH,
	MK: MK,
	ML: ML,
	MT: MT,
	MM: MM,
	ME: ME,
	MN: MN,
	MP: MP,
	MZ: MZ,
	MR: MR,
	MS: MS,
	MQ: MQ,
	MU: MU,
	MW: MW,
	MY: MY,
	YT: YT,
	NA: NA,
	NC: NC,
	NE: NE,
	NF: NF,
	NG: NG,
	NI: NI,
	NU: NU,
	NL: NL,
	NO: NO,
	NP: NP,
	NR: NR,
	NZ: NZ,
	OM: OM,
	PK: PK,
	PA: PA,
	PN: PN,
	PE: PE,
	PH: PH,
	PW: PW,
	PG: PG,
	PL: PL,
	PR: PR,
	KP: KP,
	PT: PT,
	PY: PY,
	PS: PS,
	PF: PF,
	QA: QA,
	RE: RE,
	RO: RO,
	RU: RU,
	RW: RW,
	SA: SA,
	SD: SD,
	SN: SN,
	SG: SG,
	GS: GS,
	SJ: SJ,
	SB: SB,
	SL: SL,
	SV: SV,
	SM: SM,
	SO: SO,
	PM: PM,
	RS: RS,
	SS: SS,
	ST: ST,
	SR: SR,
	SK: SK,
	SI: SI,
	SE: SE,
	SZ: SZ,
	SX: SX,
	SC: SC,
	SY: SY,
	TC: TC,
	TD: TD,
	TG: TG,
	TH: TH,
	TJ: TJ,
	TK: TK,
	TM: TM,
	TL: TL,
	TO: TO,
	TT: TT,
	TN: TN,
	TR: TR,
	TV: TV,
	TW: TW,
	TZ: TZ,
	UG: UG,
	UA: UA$1,
	UY: UY,
	US: US,
	UZ: UZ,
	VA: VA,
	VC: VC,
	VE: VE,
	VG: VG,
	VI: VI,
	VN: VN,
	VU: VU,
	WF: WF,
	WS: WS,
	YE: YE,
	ZA: ZA,
	ZM: ZM,
	ZW: ZW
};

var Rippler = /** @class */ (function () {
    function Rippler(event) {
        this.transition = 450;
        var style = getComputedStyle(map.get('el')).borderWidth;
        if (style) {
            this.targetBorder = parseInt(style.replace('px', ''), 10);
        }
        this.initGeometry(event.clientX, event.clientY);
        this.initDomElements();
        this.initRippleStyles();
        this.initRippleContainerStyles();
        if (map.get('el').style && map.get('el').style.position) {
            this.storedTargetPosition = ((map.get('el').style.position).length > 0) ? map.get('el').style.position : getComputedStyle(map.get('el')).position;
        }
        if (this.storedTargetPosition && this.storedTargetPosition !== 'relative') {
            this.storedTargetPosition = 'relative';
        }
        this.rippleContainer.appendChild(this.ripple);
        map.get('el').appendChild(this.rippleContainer);
        this.ripple.style.marginLeft = this.dx + "px";
        this.ripple.style.marginTop = this.dy + "px";
        this.updateRippleContainerStyles();
        this.startRipple();
        if (event.type === 'mousedown') {
            map.get('el').addEventListener('mouseup', this.clearRipple, false);
        }
        else {
            this.clearRipple();
        }
    }
    Rippler.prototype.initGeometry = function (clientX, clientY) {
        this.rect = map.get('el').getBoundingClientRect();
        this.left = this.rect.left;
        this.top = this.rect.top;
        this.width = map.get('el').offsetWidth;
        this.height = map.get('el').offsetHeight;
        this.dx = clientX - this.left;
        this.dy = clientY - this.top;
        this.maxX = Math.max(this.dx, this.width - this.dx);
        this.maxY = Math.max(this.dy, this.height - this.dy);
        this.style = window.getComputedStyle(map.get('el'));
        this.radius = Math.sqrt((this.maxX * this.maxX) + (this.maxY * this.maxY));
        this.border = (this.targetBorder > 0) ? this.targetBorder : 0;
    };
    Rippler.prototype.initDomElements = function () {
        this.ripple = document.createElement('div');
        this.rippleContainer = document.createElement('div');
        this.ripple.className = 'ripple';
        this.rippleContainer.className = 'ripple-container';
    };
    Rippler.prototype.initRippleStyles = function () {
        this.ripple.style.marginTop = '0px';
        this.ripple.style.marginLeft = '0px';
        this.ripple.style.width = '1px';
        this.ripple.style.height = '1px';
        this.ripple.style.transition = 'all ' + this.transition + 'ms cubic-bezier(0.4, 0, 0.2, 1)';
        this.ripple.style.borderRadius = '50%';
        this.ripple.style.pointerEvents = 'none';
        this.ripple.style.position = 'relative';
        this.ripple.style.zIndex = '9999';
        this.ripple.style.backgroundColor = 'rgba(0, 0, 0, 0.35)';
    };
    Rippler.prototype.initRippleContainerStyles = function () {
        this.rippleContainer.style.position = 'absolute';
        this.rippleContainer.style.left = 0 - this.border + 'px';
        this.rippleContainer.style.top = 0 - this.border + 'px';
        this.rippleContainer.style.height = '0';
        this.rippleContainer.style.width = '0';
        this.rippleContainer.style.pointerEvents = 'none';
        this.rippleContainer.style.overflow = 'hidden';
        this.rippleContainer.style.display = 'flex';
        this.rippleContainer.style.flexDirection = 'row';
    };
    Rippler.prototype.updateRippleContainerStyles = function () {
        this.rippleContainer.style.width = this.width + "px";
        this.rippleContainer.style.height = this.height + "px";
        this.rippleContainer.style.borderTopLeftRadius = this.style.borderTopLeftRadius;
        this.rippleContainer.style.borderTopRightRadius = this.style.borderTopRightRadius;
        this.rippleContainer.style.borderBottomLeftRadius = this.style.borderBottomLeftRadius;
        this.rippleContainer.style.borderBottomRightRadius = this.style.borderBottomRightRadius;
        this.rippleContainer.style.direction = 'ltr';
    };
    Rippler.prototype.startRipple = function () {
        var _this = this;
        setTimeout(function () {
            _this.ripple.style.width = _this.radius * 2 + 'px';
            _this.ripple.style.height = _this.radius * 2 + 'px';
            _this.ripple.style.marginLeft = _this.dx - _this.radius + 'px';
            _this.ripple.style.marginTop = _this.dy - _this.radius + 'px';
        }, 0);
    };
    Rippler.prototype.clearRipple = function () {
        setTimeout(function () {
            var el = document.querySelector('.ripple');
            if (el) {
                el.style.backgroundColor = 'rgba(0, 0, 0, 0)';
            }
        }, 250);
        setTimeout(function () {
            var els = document.querySelectorAll('.ripple-container');
            Array.prototype.slice.call(els, 0, els.length - (els.length === 1 ? 0 : 1)).forEach(function (el) {
                if (el.parentNode) {
                    map.get('el').removeChild(el);
                }
            });
        }, 850);
        map.get('el').removeEventListener('mouseup', this.clearRipple, false);
    };
    return Rippler;
}());
var map = new Map();
var bind$2 = function (el) {
    map.set('el', el);
    el.addEventListener('mousedown', function (event) {
        new Rippler(event);
    });
};
var ripple = { bind: bind$2 };

var countries$1 = Countries;
var VuePhoneInput = Vue.extend({
    // beforeMount (): void {
    //   if (!this.disableExternalLookup && process.env.VUE_APP_IP_API_URL) {
    //     fetch(process.env.VUE_APP_IP_API_URL)
    //       .then((response: Response) => response.json())
    //       .then((data: LookupResponse) => {
    //         this.country = data.countryCode
    //       })
    //   } else {
    //     // const lang = getLanguage()
    //   }
    // },
    components: {
        'country-list': CountryList
    },
    computed: {
        asYouType: function () {
            return new AsYouType$1(this.country);
        },
        isValid: function () {
            if ((this.asYouType !== undefined) && (typeof this.asYouType.getNumber === 'function')) {
                return this.asYouType.getNumber() ? this.asYouType.getNumber().isValid() : false;
            }
            return false;
        },
        phoneNumber: function () {
            try {
                return parsePhoneNumber$1(this.value, this.country);
            }
            catch (e) {
                return undefined;
            }
        }
    },
    created: function () {
        var _this = this;
        this.$on('update:country', function (country) {
            _this.country = country;
        });
        this.$on('update:visible', function (visible) {
            _this.menuOpen = visible;
        });
    },
    data: function () {
        return {
            menuOpen: false,
            country: {}
        };
    },
    destroyed: function () {
        this.$off('update:country');
        this.$off('update:visible');
    },
    directives: {
        'v-ripple': ripple
    },
    props: {
        allowedCountries: {
            type: Array,
            required: false,
            "default": function () { return []; }
        },
        defaultCountry: {
            type: String,
            required: false,
            "default": function () { return 'US'; }
        },
        disableExternalLookup: {
            type: Boolean,
            required: false,
            "default": true
        },
        hideFlags: {
            type: Boolean,
            required: false,
            "default": false
        },
        name: {
            type: String,
            required: false,
            "default": 'phone_number'
        },
        placeholder: {
            type: String,
            required: false,
            "default": 'Enter Phone Number'
        },
        preferredCountries: {
            type: Array,
            required: false
        },
        value: {
            type: String
        }
    },
    render: function (h) {
        var _this = this;
        var self = this;
        var asYouType = function () {
            return new AsYouType$1(self.country);
        };
        var innerChildren = [];
        innerChildren.push(h('transition', {
            attrs: {
                name: 'arrow-indicator'
            }
        }, [
            h('span', {
                "class": {
                    'arrow-indicator': true,
                    'open': this.menuOpen
                },
                on: {
                    click: function () {
                        _this.menuOpen = !_this.menuOpen;
                    }
                },
                style: {
                    flexGrow: 1,
                    textAlign: 'center'
                }
            }, [
                h('svg', {
                    attrs: {
                        width: '8px',
                        height: '6px',
                    }
                }, [
                    h('polygon', {
                        attrs: {
                            points: '0,0 8,3 0,6'
                        }
                    })
                ])
            ])
        ]));
        if (!this.hideFlags) {
            innerChildren.push(h('span', {
                domProps: {
                    innerHTML: this.country.flag
                },
                on: {
                    click: function () {
                        _this.menuOpen = !_this.menuOpen;
                    }
                },
                style: {
                    flexGrow: 1,
                    textAlign: 'center'
                }
            }));
        }
        innerChildren.push(h('country-list', {
            attrs: {
                name: 'slide-fade'
            },
            props: {
                countries: Object.keys(countries$1).filter(function (cca2) {
                    return !_this.allowedCountries.length || _this.allowedCountries.map(function (allowed) { return allowed.toLowerCase(); }).includes(cca2.toLowerCase());
                }).reduce(function (obj, cca2) {
                    var _a;
                    return Object.assign(obj, (_a = {}, _a[cca2] = countries$1[cca2], _a));
                }, {}),
                selected: this.country,
                visible: self.menuOpen
            },
            style: {
                display: self.menuOpen ? 'inline-block' : 'none'
            }
        }));
        innerChildren.push(h('input', {
            attrs: {
                name: self.name,
                placeholder: self.placeholder,
                type: 'tel'
            },
            "class": {
                'is-valid': self.phoneNumber ? self.phoneNumber.isValid() : false
            },
            domProps: {
                value: asYouType().input(self.value)
            },
            on: {
                input: function (event) {
                    if (event.target) {
                        var value = event.target.value;
                        self.$emit('input', value);
                    }
                }
            },
            style: {
                alignSelf: 'center',
                flexGrow: 4
            }
        }));
        return h('div', {
            "class": {
                'vue-phone-input__wrapper': true
            },
            directives: [
                {
                    arg: '',
                    expression: '',
                    modifiers: {},
                    name: 'v-ripple',
                    oldValue: undefined,
                    value: undefined
                }
            ]
        }, [
            h('div', {
                style: {
                    display: 'flex'
                }
            }, innerChildren)
        ]);
    }
});

var VuePhoneInput$1 = function (v) {
    v.component('vue-phone-input', VuePhoneInput);
};

module.exports = VuePhoneInput$1;
