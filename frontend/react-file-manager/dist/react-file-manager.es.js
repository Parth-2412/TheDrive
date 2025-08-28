import * as Je from "react";
import Pe, { useState as I, useRef as he, useEffect as se, createContext as Be, useContext as We, useLayoutEffect as Ko, useCallback as Kn, useMemo as pt } from "react";
function qo(n) {
  return n && n.__esModule && Object.prototype.hasOwnProperty.call(n, "default") ? n.default : n;
}
var et = { exports: {} }, Ye = {};
/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Qt;
function Go() {
  if (Qt) return Ye;
  Qt = 1;
  var n = Pe, e = Symbol.for("react.element"), t = Symbol.for("react.fragment"), o = Object.prototype.hasOwnProperty, r = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, s = { key: !0, ref: !0, __self: !0, __source: !0 };
  function i(a, c, d) {
    var f, p = {}, g = null, h = null;
    d !== void 0 && (g = "" + d), c.key !== void 0 && (g = "" + c.key), c.ref !== void 0 && (h = c.ref);
    for (f in c) o.call(c, f) && !s.hasOwnProperty(f) && (p[f] = c[f]);
    if (a && a.defaultProps) for (f in c = a.defaultProps, c) p[f] === void 0 && (p[f] = c[f]);
    return { $$typeof: e, type: a, key: g, ref: h, props: p, _owner: r.current };
  }
  return Ye.Fragment = t, Ye.jsx = i, Ye.jsxs = i, Ye;
}
var Ke = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var en;
function Jo() {
  return en || (en = 1, process.env.NODE_ENV !== "production" && (function() {
    var n = Pe, e = Symbol.for("react.element"), t = Symbol.for("react.portal"), o = Symbol.for("react.fragment"), r = Symbol.for("react.strict_mode"), s = Symbol.for("react.profiler"), i = Symbol.for("react.provider"), a = Symbol.for("react.context"), c = Symbol.for("react.forward_ref"), d = Symbol.for("react.suspense"), f = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), g = Symbol.for("react.lazy"), h = Symbol.for("react.offscreen"), m = Symbol.iterator, $ = "@@iterator";
    function A(u) {
      if (u === null || typeof u != "object")
        return null;
      var b = m && u[m] || u[$];
      return typeof b == "function" ? b : null;
    }
    var C = n.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
    function P(u) {
      {
        for (var b = arguments.length, z = new Array(b > 1 ? b - 1 : 0), Y = 1; Y < b; Y++)
          z[Y - 1] = arguments[Y];
        j("error", u, z);
      }
    }
    function j(u, b, z) {
      {
        var Y = C.ReactDebugCurrentFrame, ie = Y.getStackAddendum();
        ie !== "" && (b += "%s", z = z.concat([ie]));
        var ce = z.map(function(re) {
          return String(re);
        });
        ce.unshift("Warning: " + b), Function.prototype.apply.call(console[u], console, ce);
      }
    }
    var T = !1, v = !1, R = !1, F = !1, S = !1, y;
    y = Symbol.for("react.module.reference");
    function x(u) {
      return !!(typeof u == "string" || typeof u == "function" || u === o || u === s || S || u === r || u === d || u === f || F || u === h || T || v || R || typeof u == "object" && u !== null && (u.$$typeof === g || u.$$typeof === p || u.$$typeof === i || u.$$typeof === a || u.$$typeof === c || // This needs to include all possible module reference object
      // types supported by any Flight configuration anywhere since
      // we don't know which Flight build this will end up being used
      // with.
      u.$$typeof === y || u.getModuleId !== void 0));
    }
    function L(u, b, z) {
      var Y = u.displayName;
      if (Y)
        return Y;
      var ie = b.displayName || b.name || "";
      return ie !== "" ? z + "(" + ie + ")" : z;
    }
    function O(u) {
      return u.displayName || "Context";
    }
    function N(u) {
      if (u == null)
        return null;
      if (typeof u.tag == "number" && P("Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."), typeof u == "function")
        return u.displayName || u.name || null;
      if (typeof u == "string")
        return u;
      switch (u) {
        case o:
          return "Fragment";
        case t:
          return "Portal";
        case s:
          return "Profiler";
        case r:
          return "StrictMode";
        case d:
          return "Suspense";
        case f:
          return "SuspenseList";
      }
      if (typeof u == "object")
        switch (u.$$typeof) {
          case a:
            var b = u;
            return O(b) + ".Consumer";
          case i:
            var z = u;
            return O(z._context) + ".Provider";
          case c:
            return L(u, u.render, "ForwardRef");
          case p:
            var Y = u.displayName || null;
            return Y !== null ? Y : N(u.type) || "Memo";
          case g: {
            var ie = u, ce = ie._payload, re = ie._init;
            try {
              return N(re(ce));
            } catch {
              return null;
            }
          }
        }
      return null;
    }
    var M = Object.assign, Q = 0, J, Z, de, ne, w, E, _;
    function H() {
    }
    H.__reactDisabledLog = !0;
    function V() {
      {
        if (Q === 0) {
          J = console.log, Z = console.info, de = console.warn, ne = console.error, w = console.group, E = console.groupCollapsed, _ = console.groupEnd;
          var u = {
            configurable: !0,
            enumerable: !0,
            value: H,
            writable: !0
          };
          Object.defineProperties(console, {
            info: u,
            log: u,
            warn: u,
            error: u,
            group: u,
            groupCollapsed: u,
            groupEnd: u
          });
        }
        Q++;
      }
    }
    function X() {
      {
        if (Q--, Q === 0) {
          var u = {
            configurable: !0,
            enumerable: !0,
            writable: !0
          };
          Object.defineProperties(console, {
            log: M({}, u, {
              value: J
            }),
            info: M({}, u, {
              value: Z
            }),
            warn: M({}, u, {
              value: de
            }),
            error: M({}, u, {
              value: ne
            }),
            group: M({}, u, {
              value: w
            }),
            groupCollapsed: M({}, u, {
              value: E
            }),
            groupEnd: M({}, u, {
              value: _
            })
          });
        }
        Q < 0 && P("disabledDepth fell below zero. This is a bug in React. Please file an issue.");
      }
    }
    var W = C.ReactCurrentDispatcher, B;
    function G(u, b, z) {
      {
        if (B === void 0)
          try {
            throw Error();
          } catch (ie) {
            var Y = ie.stack.trim().match(/\n( *(at )?)/);
            B = Y && Y[1] || "";
          }
        return `
` + B + u;
      }
    }
    var ee = !1, D;
    {
      var ue = typeof WeakMap == "function" ? WeakMap : Map;
      D = new ue();
    }
    function k(u, b) {
      if (!u || ee)
        return "";
      {
        var z = D.get(u);
        if (z !== void 0)
          return z;
      }
      var Y;
      ee = !0;
      var ie = Error.prepareStackTrace;
      Error.prepareStackTrace = void 0;
      var ce;
      ce = W.current, W.current = null, V();
      try {
        if (b) {
          var re = function() {
            throw Error();
          };
          if (Object.defineProperty(re.prototype, "props", {
            set: function() {
              throw Error();
            }
          }), typeof Reflect == "object" && Reflect.construct) {
            try {
              Reflect.construct(re, []);
            } catch (Se) {
              Y = Se;
            }
            Reflect.construct(u, [], re);
          } else {
            try {
              re.call();
            } catch (Se) {
              Y = Se;
            }
            u.call(re.prototype);
          }
        } else {
          try {
            throw Error();
          } catch (Se) {
            Y = Se;
          }
          u();
        }
      } catch (Se) {
        if (Se && Y && typeof Se.stack == "string") {
          for (var oe = Se.stack.split(`
`), $e = Y.stack.split(`
`), pe = oe.length - 1, me = $e.length - 1; pe >= 1 && me >= 0 && oe[pe] !== $e[me]; )
            me--;
          for (; pe >= 1 && me >= 0; pe--, me--)
            if (oe[pe] !== $e[me]) {
              if (pe !== 1 || me !== 1)
                do
                  if (pe--, me--, me < 0 || oe[pe] !== $e[me]) {
                    var Ee = `
` + oe[pe].replace(" at new ", " at ");
                    return u.displayName && Ee.includes("<anonymous>") && (Ee = Ee.replace("<anonymous>", u.displayName)), typeof u == "function" && D.set(u, Ee), Ee;
                  }
                while (pe >= 1 && me >= 0);
              break;
            }
        }
      } finally {
        ee = !1, W.current = ce, X(), Error.prepareStackTrace = ie;
      }
      var Ue = u ? u.displayName || u.name : "", ze = Ue ? G(Ue) : "";
      return typeof u == "function" && D.set(u, ze), ze;
    }
    function ye(u, b, z) {
      return k(u, !1);
    }
    function Te(u) {
      var b = u.prototype;
      return !!(b && b.isReactComponent);
    }
    function je(u, b, z) {
      if (u == null)
        return "";
      if (typeof u == "function")
        return k(u, Te(u));
      if (typeof u == "string")
        return G(u);
      switch (u) {
        case d:
          return G("Suspense");
        case f:
          return G("SuspenseList");
      }
      if (typeof u == "object")
        switch (u.$$typeof) {
          case c:
            return ye(u.render);
          case p:
            return je(u.type, b, z);
          case g: {
            var Y = u, ie = Y._payload, ce = Y._init;
            try {
              return je(ce(ie), b, z);
            } catch {
            }
          }
        }
      return "";
    }
    var Oe = Object.prototype.hasOwnProperty, te = {}, ge = C.ReactDebugCurrentFrame;
    function Ce(u) {
      if (u) {
        var b = u._owner, z = je(u.type, u._source, b ? b.type : null);
        ge.setExtraStackFrame(z);
      } else
        ge.setExtraStackFrame(null);
    }
    function Re(u, b, z, Y, ie) {
      {
        var ce = Function.call.bind(Oe);
        for (var re in u)
          if (ce(u, re)) {
            var oe = void 0;
            try {
              if (typeof u[re] != "function") {
                var $e = Error((Y || "React class") + ": " + z + " type `" + re + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof u[re] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.");
                throw $e.name = "Invariant Violation", $e;
              }
              oe = u[re](b, re, Y, z, null, "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED");
            } catch (pe) {
              oe = pe;
            }
            oe && !(oe instanceof Error) && (Ce(ie), P("%s: type specification of %s `%s` is invalid; the type checker function must return `null` or an `Error` but returned a %s. You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument).", Y || "React class", z, re, typeof oe), Ce(null)), oe instanceof Error && !(oe.message in te) && (te[oe.message] = !0, Ce(ie), P("Failed %s type: %s", z, oe.message), Ce(null));
          }
      }
    }
    var ke = Array.isArray;
    function Ie(u) {
      return ke(u);
    }
    function yt(u) {
      {
        var b = typeof Symbol == "function" && Symbol.toStringTag, z = b && u[Symbol.toStringTag] || u.constructor.name || "Object";
        return z;
      }
    }
    function No(u) {
      try {
        return _t(u), !1;
      } catch {
        return !0;
      }
    }
    function _t(u) {
      return "" + u;
    }
    function Ht(u) {
      if (No(u))
        return P("The provided key is an unsupported type %s. This value must be coerced to a string before before using it here.", yt(u)), _t(u);
    }
    var Vt = C.ReactCurrentOwner, Po = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    }, Bt, Wt;
    function To(u) {
      if (Oe.call(u, "ref")) {
        var b = Object.getOwnPropertyDescriptor(u, "ref").get;
        if (b && b.isReactWarning)
          return !1;
      }
      return u.ref !== void 0;
    }
    function Ro(u) {
      if (Oe.call(u, "key")) {
        var b = Object.getOwnPropertyDescriptor(u, "key").get;
        if (b && b.isReactWarning)
          return !1;
      }
      return u.key !== void 0;
    }
    function Lo(u, b) {
      typeof u.ref == "string" && Vt.current;
    }
    function Oo(u, b) {
      {
        var z = function() {
          Bt || (Bt = !0, P("%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", b));
        };
        z.isReactWarning = !0, Object.defineProperty(u, "key", {
          get: z,
          configurable: !0
        });
      }
    }
    function ko(u, b) {
      {
        var z = function() {
          Wt || (Wt = !0, P("%s: `ref` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://reactjs.org/link/special-props)", b));
        };
        z.isReactWarning = !0, Object.defineProperty(u, "ref", {
          get: z,
          configurable: !0
        });
      }
    }
    var Ao = function(u, b, z, Y, ie, ce, re) {
      var oe = {
        // This tag allows us to uniquely identify this as a React Element
        $$typeof: e,
        // Built-in properties that belong on the element
        type: u,
        key: b,
        ref: z,
        props: re,
        // Record the component responsible for creating this element.
        _owner: ce
      };
      return oe._store = {}, Object.defineProperty(oe._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: !1
      }), Object.defineProperty(oe, "_self", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: Y
      }), Object.defineProperty(oe, "_source", {
        configurable: !1,
        enumerable: !1,
        writable: !1,
        value: ie
      }), Object.freeze && (Object.freeze(oe.props), Object.freeze(oe)), oe;
    };
    function zo(u, b, z, Y, ie) {
      {
        var ce, re = {}, oe = null, $e = null;
        z !== void 0 && (Ht(z), oe = "" + z), Ro(b) && (Ht(b.key), oe = "" + b.key), To(b) && ($e = b.ref, Lo(b, ie));
        for (ce in b)
          Oe.call(b, ce) && !Po.hasOwnProperty(ce) && (re[ce] = b[ce]);
        if (u && u.defaultProps) {
          var pe = u.defaultProps;
          for (ce in pe)
            re[ce] === void 0 && (re[ce] = pe[ce]);
        }
        if (oe || $e) {
          var me = typeof u == "function" ? u.displayName || u.name || "Unknown" : u;
          oe && Oo(re, me), $e && ko(re, me);
        }
        return Ao(u, oe, $e, ie, Y, Vt.current, re);
      }
    }
    var $t = C.ReactCurrentOwner, Yt = C.ReactDebugCurrentFrame;
    function De(u) {
      if (u) {
        var b = u._owner, z = je(u.type, u._source, b ? b.type : null);
        Yt.setExtraStackFrame(z);
      } else
        Yt.setExtraStackFrame(null);
    }
    var xt;
    xt = !1;
    function wt(u) {
      return typeof u == "object" && u !== null && u.$$typeof === e;
    }
    function Kt() {
      {
        if ($t.current) {
          var u = N($t.current.type);
          if (u)
            return `

Check the render method of \`` + u + "`.";
        }
        return "";
      }
    }
    function Mo(u) {
      return "";
    }
    var qt = {};
    function Io(u) {
      {
        var b = Kt();
        if (!b) {
          var z = typeof u == "string" ? u : u.displayName || u.name;
          z && (b = `

Check the top-level render call using <` + z + ">.");
        }
        return b;
      }
    }
    function Gt(u, b) {
      {
        if (!u._store || u._store.validated || u.key != null)
          return;
        u._store.validated = !0;
        var z = Io(b);
        if (qt[z])
          return;
        qt[z] = !0;
        var Y = "";
        u && u._owner && u._owner !== $t.current && (Y = " It was passed a child from " + N(u._owner.type) + "."), De(u), P('Each child in a list should have a unique "key" prop.%s%s See https://reactjs.org/link/warning-keys for more information.', z, Y), De(null);
      }
    }
    function Jt(u, b) {
      {
        if (typeof u != "object")
          return;
        if (Ie(u))
          for (var z = 0; z < u.length; z++) {
            var Y = u[z];
            wt(Y) && Gt(Y, b);
          }
        else if (wt(u))
          u._store && (u._store.validated = !0);
        else if (u) {
          var ie = A(u);
          if (typeof ie == "function" && ie !== u.entries)
            for (var ce = ie.call(u), re; !(re = ce.next()).done; )
              wt(re.value) && Gt(re.value, b);
        }
      }
    }
    function Do(u) {
      {
        var b = u.type;
        if (b == null || typeof b == "string")
          return;
        var z;
        if (typeof b == "function")
          z = b.propTypes;
        else if (typeof b == "object" && (b.$$typeof === c || // Note: Memo only checks outer props here.
        // Inner props are checked in the reconciler.
        b.$$typeof === p))
          z = b.propTypes;
        else
          return;
        if (z) {
          var Y = N(b);
          Re(z, u.props, "prop", Y, u);
        } else if (b.PropTypes !== void 0 && !xt) {
          xt = !0;
          var ie = N(b);
          P("Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?", ie || "Unknown");
        }
        typeof b.getDefaultProps == "function" && !b.getDefaultProps.isReactClassApproved && P("getDefaultProps is only used on classic React.createClass definitions. Use a static property named `defaultProps` instead.");
      }
    }
    function Uo(u) {
      {
        for (var b = Object.keys(u.props), z = 0; z < b.length; z++) {
          var Y = b[z];
          if (Y !== "children" && Y !== "key") {
            De(u), P("Invalid prop `%s` supplied to `React.Fragment`. React.Fragment can only have `key` and `children` props.", Y), De(null);
            break;
          }
        }
        u.ref !== null && (De(u), P("Invalid attribute `ref` supplied to `React.Fragment`."), De(null));
      }
    }
    var Xt = {};
    function Zt(u, b, z, Y, ie, ce) {
      {
        var re = x(u);
        if (!re) {
          var oe = "";
          (u === void 0 || typeof u == "object" && u !== null && Object.keys(u).length === 0) && (oe += " You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.");
          var $e = Mo();
          $e ? oe += $e : oe += Kt();
          var pe;
          u === null ? pe = "null" : Ie(u) ? pe = "array" : u !== void 0 && u.$$typeof === e ? (pe = "<" + (N(u.type) || "Unknown") + " />", oe = " Did you accidentally export a JSX literal instead of a component?") : pe = typeof u, P("React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: %s.%s", pe, oe);
        }
        var me = zo(u, b, z, ie, ce);
        if (me == null)
          return me;
        if (re) {
          var Ee = b.children;
          if (Ee !== void 0)
            if (Y)
              if (Ie(Ee)) {
                for (var Ue = 0; Ue < Ee.length; Ue++)
                  Jt(Ee[Ue], u);
                Object.freeze && Object.freeze(Ee);
              } else
                P("React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead.");
            else
              Jt(Ee, u);
        }
        if (Oe.call(b, "key")) {
          var ze = N(u), Se = Object.keys(b).filter(function(Yo) {
            return Yo !== "key";
          }), bt = Se.length > 0 ? "{key: someKey, " + Se.join(": ..., ") + ": ...}" : "{key: someKey}";
          if (!Xt[ze + bt]) {
            var Wo = Se.length > 0 ? "{" + Se.join(": ..., ") + ": ...}" : "{}";
            P(`A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`, bt, ze, Wo, ze), Xt[ze + bt] = !0;
          }
        }
        return u === o ? Uo(me) : Do(me), me;
      }
    }
    function _o(u, b, z) {
      return Zt(u, b, z, !0);
    }
    function Ho(u, b, z) {
      return Zt(u, b, z, !1);
    }
    var Vo = Ho, Bo = _o;
    Ke.Fragment = o, Ke.jsx = Vo, Ke.jsxs = Bo;
  })()), Ke;
}
var tn;
function Xo() {
  return tn || (tn = 1, process.env.NODE_ENV === "production" ? et.exports = Go() : et.exports = Jo()), et.exports;
}
var l = Xo(), qn = {
  color: void 0,
  size: void 0,
  className: void 0,
  style: void 0,
  attr: void 0
}, nn = Pe.createContext && /* @__PURE__ */ Pe.createContext(qn), Zo = ["attr", "size", "title"];
function Qo(n, e) {
  if (n == null) return {};
  var t = er(n, e), o, r;
  if (Object.getOwnPropertySymbols) {
    var s = Object.getOwnPropertySymbols(n);
    for (r = 0; r < s.length; r++)
      o = s[r], !(e.indexOf(o) >= 0) && Object.prototype.propertyIsEnumerable.call(n, o) && (t[o] = n[o]);
  }
  return t;
}
function er(n, e) {
  if (n == null) return {};
  var t = {};
  for (var o in n)
    if (Object.prototype.hasOwnProperty.call(n, o)) {
      if (e.indexOf(o) >= 0) continue;
      t[o] = n[o];
    }
  return t;
}
function rt() {
  return rt = Object.assign ? Object.assign.bind() : function(n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var o in t)
        Object.prototype.hasOwnProperty.call(t, o) && (n[o] = t[o]);
    }
    return n;
  }, rt.apply(this, arguments);
}
function on(n, e) {
  var t = Object.keys(n);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(n);
    e && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(n, r).enumerable;
    })), t.push.apply(t, o);
  }
  return t;
}
function st(n) {
  for (var e = 1; e < arguments.length; e++) {
    var t = arguments[e] != null ? arguments[e] : {};
    e % 2 ? on(Object(t), !0).forEach(function(o) {
      tr(n, o, t[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(n, Object.getOwnPropertyDescriptors(t)) : on(Object(t)).forEach(function(o) {
      Object.defineProperty(n, o, Object.getOwnPropertyDescriptor(t, o));
    });
  }
  return n;
}
function tr(n, e, t) {
  return e = nr(e), e in n ? Object.defineProperty(n, e, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : n[e] = t, n;
}
function nr(n) {
  var e = or(n, "string");
  return typeof e == "symbol" ? e : e + "";
}
function or(n, e) {
  if (typeof n != "object" || !n) return n;
  var t = n[Symbol.toPrimitive];
  if (t !== void 0) {
    var o = t.call(n, e);
    if (typeof o != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(n);
}
function Gn(n) {
  return n && n.map((e, t) => /* @__PURE__ */ Pe.createElement(e.tag, st({
    key: t
  }, e.attr), Gn(e.child)));
}
function q(n) {
  return (e) => /* @__PURE__ */ Pe.createElement(rr, rt({
    attr: st({}, n.attr)
  }, e), Gn(n.child));
}
function rr(n) {
  var e = (t) => {
    var {
      attr: o,
      size: r,
      title: s
    } = n, i = Qo(n, Zo), a = r || t.size || "1em", c;
    return t.className && (c = t.className), n.className && (c = (c ? c + " " : "") + n.className), /* @__PURE__ */ Pe.createElement("svg", rt({
      stroke: "currentColor",
      fill: "currentColor",
      strokeWidth: "0"
    }, t.attr, o, i, {
      className: c,
      style: st(st({
        color: n.color || t.color
      }, t.style), n.style),
      height: a,
      width: a,
      xmlns: "http://www.w3.org/2000/svg"
    }), s && /* @__PURE__ */ Pe.createElement("title", null, s), n.children);
  };
  return nn !== void 0 ? /* @__PURE__ */ Pe.createElement(nn.Consumer, null, (t) => e(t)) : e(qn);
}
function sr(n) {
  return q({ attr: { version: "1.1", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "M16 8c-0.020-1.045-0.247-2.086-0.665-3.038-0.417-0.953-1.023-1.817-1.766-2.53s-1.624-1.278-2.578-1.651c-0.953-0.374-1.978-0.552-2.991-0.531-1.013 0.020-2.021 0.24-2.943 0.646-0.923 0.405-1.758 0.992-2.449 1.712s-1.237 1.574-1.597 2.497c-0.361 0.923-0.533 1.914-0.512 2.895 0.020 0.981 0.234 1.955 0.627 2.847 0.392 0.892 0.961 1.7 1.658 2.368s1.523 1.195 2.416 1.543c0.892 0.348 1.851 0.514 2.799 0.493 0.949-0.020 1.89-0.227 2.751-0.608 0.862-0.379 1.642-0.929 2.287-1.604s1.154-1.472 1.488-2.335c0.204-0.523 0.342-1.069 0.415-1.622 0.019 0.001 0.039 0.002 0.059 0.002 0.552 0 1-0.448 1-1 0-0.028-0.001-0.056-0.004-0.083h0.004zM14.411 10.655c-0.367 0.831-0.898 1.584-1.55 2.206s-1.422 1.112-2.254 1.434c-0.832 0.323-1.723 0.476-2.608 0.454-0.884-0.020-1.759-0.215-2.56-0.57-0.801-0.354-1.526-0.867-2.125-1.495s-1.071-1.371-1.38-2.173c-0.31-0.801-0.457-1.66-0.435-2.512s0.208-1.694 0.551-2.464c0.342-0.77 0.836-1.468 1.441-2.044s1.321-1.029 2.092-1.326c0.771-0.298 1.596-0.438 2.416-0.416s1.629 0.202 2.368 0.532c0.74 0.329 1.41 0.805 1.963 1.387s0.988 1.27 1.272 2.011c0.285 0.74 0.418 1.532 0.397 2.32h0.004c-0.002 0.027-0.004 0.055-0.004 0.083 0 0.516 0.39 0.94 0.892 0.994-0.097 0.544-0.258 1.075-0.481 1.578z" }, child: [] }] })(n);
}
const Mt = ({ loading: n = !1, className: e }) => n ? /* @__PURE__ */ l.jsx("div", { className: `loader-container ${e}`, children: /* @__PURE__ */ l.jsx(sr, { className: "spinner" }) }) : null;
function Jn(n) {
  return q({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { fillRule: "evenodd", d: "M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z" }, child: [] }] })(n);
}
function Xn(n) {
  return q({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "m.5 3 .04.87a2 2 0 0 0-.342 1.311l.637 7A2 2 0 0 0 2.826 14H9v-1H2.826a1 1 0 0 1-.995-.91l-.637-7A1 1 0 0 1 2.19 4h11.62a1 1 0 0 1 .996 1.09L14.54 8h1.005l.256-2.819A2 2 0 0 0 13.81 3H9.828a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 6.172 1H2.5a2 2 0 0 0-2 2m5.672-1a1 1 0 0 1 .707.293L7.586 3H2.19q-.362.002-.683.12L1.5 2.98a1 1 0 0 1 1-.98z" }, child: [] }, { tag: "path", attr: { d: "M13.5 9a.5.5 0 0 1 .5.5V11h1.5a.5.5 0 1 1 0 1H14v1.5a.5.5 0 1 1-1 0V12h-1.5a.5.5 0 0 1 0-1H13V9.5a.5.5 0 0 1 .5-.5" }, child: [] }] })(n);
}
function Zn(n) {
  return q({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z" }, child: [] }] })(n);
}
function rn(n) {
  return q({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zM2.5 2a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zM1 10.5A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5zm6.5.5A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5zm1.5-.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 .5.5h3a.5.5 0 0 0 .5-.5v-3a.5.5 0 0 0-.5-.5z" }, child: [] }] })(n);
}
function Qn(n) {
  return q({ attr: { fill: "currentColor", viewBox: "0 0 16 16" }, child: [{ tag: "path", attr: { d: "M3.5 3.5c-.614-.884-.074-1.962.858-2.5L8 7.226 11.642 1c.932.538 1.472 1.616.858 2.5L8.81 8.61l1.556 2.661a2.5 2.5 0 1 1-.794.637L8 9.73l-1.572 2.177a2.5 2.5 0 1 1-.794-.637L7.19 8.61zm2.5 10a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0m7 0a1.5 1.5 0 1 0-3 0 1.5 1.5 0 0 0 3 0" }, child: [] }] })(n);
}
function eo(n) {
  return q({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "polyline", attr: { points: "23 4 23 10 17 10" }, child: [] }, { tag: "polyline", attr: { points: "1 20 1 14 7 14" }, child: [] }, { tag: "path", attr: { d: "M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" }, child: [] }] })(n);
}
function ir(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" }, child: [] }] })(n);
}
function ar(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, child: [] }] })(n);
}
function lr(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" }, child: [] }, { tag: "path", attr: { d: "M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" }, child: [] }] })(n);
}
function cr(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" }, child: [] }] })(n);
}
function dr(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" }, child: [] }] })(n);
}
function to(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" }, child: [] }, { tag: "path", attr: { d: "M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z" }, child: [] }] })(n);
}
function It(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zm-1-4-1.41-1.41L13 12.17V4h-2v8.17L8.41 9.59 7 11l5 5 5-5z" }, child: [] }] })(n);
}
function no(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0z" }, child: [] }, { tag: "path", attr: { d: "M18 15v3H6v-3H4v3c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-3h-2zM7 9l1.41 1.41L11 7.83V16h2V7.83l2.59 2.58L17 9l-5-5-5 5z" }, child: [] }] })(n);
}
function ur(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { fill: "none", d: "M0 0h24v24H0V0z" }, child: [] }, { tag: "path", attr: { d: "M10.02 6 8.61 7.41 13.19 12l-4.58 4.59L10.02 18l6-6-6-6z" }, child: [] }] })(n);
}
function oo(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { d: "M20.005 5.995h-1v2h1v8h-1v2h1c1.103 0 2-.897 2-2v-8c0-1.102-.898-2-2-2zm-14 4H15v4H6.005z" }, child: [] }, { tag: "path", attr: { d: "M17.005 17.995V4H20V2h-8v2h3.005v1.995h-11c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h11V20H12v2h8v-2h-2.995v-2.005zm-13-2v-8h11v8h-11z" }, child: [] }] })(n);
}
function fr(n) {
  return q({ attr: { viewBox: "0 0 24 24" }, child: [{ tag: "path", attr: { d: "M20 2H8c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h12c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2zM8 16V4h12l.002 12H8z" }, child: [] }, { tag: "path", attr: { d: "M4 8H2v12c0 1.103.897 2 2 2h12v-2H4V8zm8.933 3.519-1.726-1.726-1.414 1.414 3.274 3.274 5.702-6.84-1.538-1.282z" }, child: [] }] })(n);
}
function ro(n) {
  return q({ attr: { viewBox: "0 0 448 512" }, child: [{ tag: "path", attr: { d: "M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z" }, child: [] }] })(n);
}
function pr(n) {
  return q({ attr: { viewBox: "0 0 320 512" }, child: [{ tag: "path", attr: { d: "M310.6 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L242.7 256 73.4 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z" }, child: [] }] })(n);
}
function hr(n) {
  return q({ attr: { viewBox: "0 0 640 512" }, child: [{ tag: "path", attr: { d: "M128 0C92.7 0 64 28.7 64 64l0 224-44.8 0C8.6 288 0 296.6 0 307.2C0 349.6 34.4 384 76.8 384L320 384l0-96-192 0 0-224 320 0 0 32 64 0 0-32c0-35.3-28.7-64-64-64L128 0zM512 128l-112 0c-26.5 0-48 21.5-48 48l0 288c0 26.5 21.5 48 48 48l192 0c26.5 0 48-21.5 48-48l0-208-96 0c-17.7 0-32-14.3-32-32l0-96zm32 0l0 96 96 0-96-96z" }, child: [] }] })(n);
}
function it(n) {
  return q({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M64 144a48 48 0 1 0 0-96 48 48 0 1 0 0 96zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32L192 64zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32l288 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-288 0zM64 464a48 48 0 1 0 0-96 48 48 0 1 0 0 96zm48-208a48 48 0 1 0 -96 0 48 48 0 1 0 96 0z" }, child: [] }] })(n);
}
function sn(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464l256 0c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM192 272l0 128c0 6.5-3.9 12.3-9.9 14.8s-12.9 1.1-17.4-3.5L129.4 376 112 376c-8.8 0-16-7.2-16-16l0-48c0-8.8 7.2-16 16-16l17.4 0 35.3-35.3c4.6-4.6 11.5-5.9 17.4-3.5s9.9 8.3 9.9 14.8zm85.8-4c11.6 20 18.2 43.3 18.2 68s-6.6 48-18.2 68c-6.6 11.5-21.3 15.4-32.8 8.8s-15.4-21.3-8.8-32.8c7.5-12.9 11.8-27.9 11.8-44s-4.3-31.1-11.8-44c-6.6-11.5-2.7-26.2 8.8-32.8s26.2-2.7 32.8 8.8z" }, child: [] }] })(n);
}
function ve(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm97 289c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0L79 303c-9.4 9.4-9.4 24.6 0 33.9l48 48c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-31-31 31-31zM257 255c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l31 31-31 31c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l48-48c9.4-9.4 9.4-24.6 0-33.9l-48-48z" }, child: [] }] })(n);
}
function an(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm90.9 233.3c-8.1-10.5-23.2-12.3-33.7-4.2s-12.3 23.2-4.2 33.7L161.6 320l-44.5 57.3c-8.1 10.5-6.3 25.5 4.2 33.7s25.5 6.3 33.7-4.2L192 359.1l37.1 47.6c8.1 10.5 23.2 12.3 33.7 4.2s12.3-23.2 4.2-33.7L222.4 320l44.5-57.3c8.1-10.5 6.3-25.5-4.2-33.7s-25.5-6.3-33.7 4.2L192 280.9l-37.1-47.6z" }, child: [] }] })(n);
}
function Ct(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm96 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0zm69.2 46.9c-3-4.3-7.9-6.9-13.2-6.9s-10.2 2.6-13.2 6.9l-41.3 59.7-11.9-19.1c-2.9-4.7-8.1-7.5-13.6-7.5s-10.6 2.8-13.6 7.5l-40 64c-3.1 4.9-3.2 11.1-.4 16.2s8.2 8.2 14 8.2l48 0 32 0 40 0 72 0c6 0 11.4-3.3 14.2-8.6s2.4-11.6-1-16.5l-72-104z" }, child: [] }] })(n);
}
function mr(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm56 256c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0zm0 96c-13.3 0-24 10.7-24 24s10.7 24 24 24l144 0c13.3 0 24-10.7 24-24s-10.7-24-24-24l-144 0z" }, child: [] }] })(n);
}
function gr(n) {
  return q({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M64 464l48 0 0 48-48 0c-35.3 0-64-28.7-64-64L0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 304l-48 0 0-144-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16zM176 352l32 0c30.9 0 56 25.1 56 56s-25.1 56-56 56l-16 0 0 32c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-48 0-80c0-8.8 7.2-16 16-16zm32 80c13.3 0 24-10.7 24-24s-10.7-24-24-24l-16 0 0 48 16 0zm96-80l32 0c26.5 0 48 21.5 48 48l0 64c0 26.5-21.5 48-48 48l-32 0c-8.8 0-16-7.2-16-16l0-128c0-8.8 7.2-16 16-16zm32 128c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16l-16 0 0 96 16 0zm80-112c0-8.8 7.2-16 16-16l48 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 32 32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0 0 48c0 8.8-7.2 16-16 16s-16-7.2-16-16l0-64 0-64z" }, child: [] }] })(n);
}
function ln(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm72 208c-13.3 0-24 10.7-24 24l0 104 0 56c0 13.3 10.7 24 24 24s24-10.7 24-24l0-32 44 0c42 0 76-34 76-76s-34-76-76-76l-68 0zm68 104l-44 0 0-56 44 0c15.5 0 28 12.5 28 28s-12.5 28-28 28z" }, child: [] }] })(n);
}
function cn(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zM80 288c0-17.7 14.3-32 32-32l96 0c17.7 0 32 14.3 32 32l0 16 44.9-29.9c2-1.3 4.4-2.1 6.8-2.1c6.8 0 12.3 5.5 12.3 12.3l0 103.4c0 6.8-5.5 12.3-12.3 12.3c-2.4 0-4.8-.7-6.8-2.1L240 368l0 16c0 17.7-14.3 32-32 32l-96 0c-17.7 0-32-14.3-32-32l0-96z" }, child: [] }] })(n);
}
function dn(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M48 448L48 64c0-8.8 7.2-16 16-16l160 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm55 241.1c-3.8-12.7-17.2-19.9-29.9-16.1s-19.9 17.2-16.1 29.9l48 160c3 10.2 12.4 17.1 23 17.1s19.9-7 23-17.1l25-83.4 25 83.4c3 10.2 12.4 17.1 23 17.1s19.9-7 23-17.1l48-160c3.8-12.7-3.4-26.1-16.1-29.9s-26.1 3.4-29.9 16.1l-25 83.4-25-83.4c-3-10.2-12.4-17.1-23-17.1s-19.9 7-23 17.1l-25 83.4-25-83.4z" }, child: [] }] })(n);
}
function vr(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M64 464c-8.8 0-16-7.2-16-16L48 64c0-8.8 7.2-16 16-16l48 0c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16l48 0 0 80c0 17.7 14.3 32 32 32l80 0 0 288c0 8.8-7.2 16-16 16L64 464zM64 0C28.7 0 0 28.7 0 64L0 448c0 35.3 28.7 64 64 64l256 0c35.3 0 64-28.7 64-64l0-293.5c0-17-6.7-33.3-18.7-45.3L274.7 18.7C262.7 6.7 246.5 0 229.5 0L64 0zm48 112c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm0 64c0 8.8 7.2 16 16 16l32 0c8.8 0 16-7.2 16-16s-7.2-16-16-16l-32 0c-8.8 0-16 7.2-16 16zm-6.3 71.8L82.1 335.9c-1.4 5.4-2.1 10.9-2.1 16.4c0 35.2 28.8 63.7 64 63.7s64-28.5 64-63.7c0-5.5-.7-11.1-2.1-16.4l-23.5-88.2c-3.7-14-16.4-23.8-30.9-23.8l-14.8 0c-14.5 0-27.2 9.7-30.9 23.8zM128 336l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16z" }, child: [] }] })(n);
}
function at(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M320 464c8.8 0 16-7.2 16-16l0-288-80 0c-17.7 0-32-14.3-32-32l0-80L64 48c-8.8 0-16 7.2-16 16l0 384c0 8.8 7.2 16 16 16l256 0zM0 64C0 28.7 28.7 0 64 0L229.5 0c17 0 33.3 6.7 45.3 18.7l90.5 90.5c12 12 18.7 28.3 18.7 45.3L384 448c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64z" }, child: [] }] })(n);
}
function un(n) {
  return q({ attr: { viewBox: "0 0 576 512" }, child: [{ tag: "path", attr: { d: "M384 480l48 0c11.4 0 21.9-6 27.6-15.9l112-192c5.8-9.9 5.8-22.1 .1-32.1S555.5 224 544 224l-400 0c-11.4 0-21.9 6-27.6 15.9L48 357.1 48 96c0-8.8 7.2-16 16-16l117.5 0c4.2 0 8.3 1.7 11.3 4.7l26.5 26.5c21 21 49.5 32.8 79.2 32.8L416 144c8.8 0 16 7.2 16 16l0 32 48 0 0-32c0-35.3-28.7-64-64-64L298.5 96c-17 0-33.3-6.7-45.3-18.7L226.7 50.7c-12-12-28.3-18.7-45.3-18.7L64 32C28.7 32 0 60.7 0 96L0 416c0 35.3 28.7 64 64 64l23.7 0L384 480z" }, child: [] }] })(n);
}
function kt(n) {
  return q({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M104.6 48L64 48C28.7 48 0 76.7 0 112L0 384c0 35.3 28.7 64 64 64l96 0 0-48-96 0c-8.8 0-16-7.2-16-16l0-272c0-8.8 7.2-16 16-16l16 0c0 17.7 14.3 32 32 32l72.4 0C202 108.4 227.6 96 256 96l62 0c-7.1-27.6-32.2-48-62-48l-40.6 0C211.6 20.9 188.2 0 160 0s-51.6 20.9-55.4 48zM144 56a16 16 0 1 1 32 0 16 16 0 1 1 -32 0zM448 464l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L464 243.9 464 448c0 8.8-7.2 16-16 16zM256 512l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9l-67.9-67.9c-9-9-21.2-14.1-33.9-14.1L256 128c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64z" }, child: [] }] })(n);
}
const Qe = (n = () => {
}) => {
  const [e, t] = I(!1), o = he(null), r = (s) => {
    var i;
    (i = o.current) != null && i.contains(s.target) ? t(!1) : (t(!0), n(s, o));
  };
  return se(() => (document.addEventListener("click", r, !0), document.addEventListener("mousedown", r, !0), () => {
    document.removeEventListener("click", r, !0), document.removeEventListener("mousedown", r, !0);
  }), []), { ref: o, isClicked: e, setIsClicked: t };
}, so = Be(), yr = ({ children: n, layout: e }) => {
  const [t, o] = I(() => r(e));
  function r(s) {
    return ["list", "grid"].includes(s) ? s : "grid";
  }
  return /* @__PURE__ */ l.jsx(so.Provider, { value: { activeLayout: t, setActiveLayout: o }, children: n });
}, Ae = () => We(so), K = (n) => typeof n == "string", qe = () => {
  let n, e;
  const t = new Promise((o, r) => {
    n = o, e = r;
  });
  return t.resolve = n, t.reject = e, t;
}, fn = (n) => n == null ? "" : "" + n, $r = (n, e, t) => {
  n.forEach((o) => {
    e[o] && (t[o] = e[o]);
  });
}, xr = /###/g, pn = (n) => n && n.indexOf("###") > -1 ? n.replace(xr, ".") : n, hn = (n) => !n || K(n), Ge = (n, e, t) => {
  const o = K(e) ? e.split(".") : e;
  let r = 0;
  for (; r < o.length - 1; ) {
    if (hn(n)) return {};
    const s = pn(o[r]);
    !n[s] && t && (n[s] = new t()), Object.prototype.hasOwnProperty.call(n, s) ? n = n[s] : n = {}, ++r;
  }
  return hn(n) ? {} : {
    obj: n,
    k: pn(o[r])
  };
}, mn = (n, e, t) => {
  const {
    obj: o,
    k: r
  } = Ge(n, e, Object);
  if (o !== void 0 || e.length === 1) {
    o[r] = t;
    return;
  }
  let s = e[e.length - 1], i = e.slice(0, e.length - 1), a = Ge(n, i, Object);
  for (; a.obj === void 0 && i.length; )
    s = `${i[i.length - 1]}.${s}`, i = i.slice(0, i.length - 1), a = Ge(n, i, Object), a != null && a.obj && typeof a.obj[`${a.k}.${s}`] < "u" && (a.obj = void 0);
  a.obj[`${a.k}.${s}`] = t;
}, wr = (n, e, t, o) => {
  const {
    obj: r,
    k: s
  } = Ge(n, e, Object);
  r[s] = r[s] || [], r[s].push(t);
}, lt = (n, e) => {
  const {
    obj: t,
    k: o
  } = Ge(n, e);
  if (t && Object.prototype.hasOwnProperty.call(t, o))
    return t[o];
}, br = (n, e, t) => {
  const o = lt(n, t);
  return o !== void 0 ? o : lt(e, t);
}, io = (n, e, t) => {
  for (const o in e)
    o !== "__proto__" && o !== "constructor" && (o in n ? K(n[o]) || n[o] instanceof String || K(e[o]) || e[o] instanceof String ? t && (n[o] = e[o]) : io(n[o], e[o], t) : n[o] = e[o]);
  return n;
}, _e = (n) => n.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
var Cr = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "/": "&#x2F;"
};
const Sr = (n) => K(n) ? n.replace(/[&<>"'\/]/g, (e) => Cr[e]) : n;
class Er {
  constructor(e) {
    this.capacity = e, this.regExpMap = /* @__PURE__ */ new Map(), this.regExpQueue = [];
  }
  getRegExp(e) {
    const t = this.regExpMap.get(e);
    if (t !== void 0)
      return t;
    const o = new RegExp(e);
    return this.regExpQueue.length === this.capacity && this.regExpMap.delete(this.regExpQueue.shift()), this.regExpMap.set(e, o), this.regExpQueue.push(e), o;
  }
}
const Fr = [" ", ",", "?", "!", ";"], jr = new Er(20), Nr = (n, e, t) => {
  e = e || "", t = t || "";
  const o = Fr.filter((i) => e.indexOf(i) < 0 && t.indexOf(i) < 0);
  if (o.length === 0) return !0;
  const r = jr.getRegExp(`(${o.map((i) => i === "?" ? "\\?" : i).join("|")})`);
  let s = !r.test(n);
  if (!s) {
    const i = n.indexOf(t);
    i > 0 && !r.test(n.substring(0, i)) && (s = !0);
  }
  return s;
}, At = (n, e, t = ".") => {
  if (!n) return;
  if (n[e])
    return Object.prototype.hasOwnProperty.call(n, e) ? n[e] : void 0;
  const o = e.split(t);
  let r = n;
  for (let s = 0; s < o.length; ) {
    if (!r || typeof r != "object")
      return;
    let i, a = "";
    for (let c = s; c < o.length; ++c)
      if (c !== s && (a += t), a += o[c], i = r[a], i !== void 0) {
        if (["string", "number", "boolean"].indexOf(typeof i) > -1 && c < o.length - 1)
          continue;
        s += c - s + 1;
        break;
      }
    r = i;
  }
  return r;
}, Xe = (n) => n == null ? void 0 : n.replace("_", "-"), Pr = {
  type: "logger",
  log(n) {
    this.output("log", n);
  },
  warn(n) {
    this.output("warn", n);
  },
  error(n) {
    this.output("error", n);
  },
  output(n, e) {
    var t, o;
    (o = (t = console == null ? void 0 : console[n]) == null ? void 0 : t.apply) == null || o.call(t, console, e);
  }
};
class ct {
  constructor(e, t = {}) {
    this.init(e, t);
  }
  init(e, t = {}) {
    this.prefix = t.prefix || "i18next:", this.logger = e || Pr, this.options = t, this.debug = t.debug;
  }
  log(...e) {
    return this.forward(e, "log", "", !0);
  }
  warn(...e) {
    return this.forward(e, "warn", "", !0);
  }
  error(...e) {
    return this.forward(e, "error", "");
  }
  deprecate(...e) {
    return this.forward(e, "warn", "WARNING DEPRECATED: ", !0);
  }
  forward(e, t, o, r) {
    return r && !this.debug ? null : (K(e[0]) && (e[0] = `${o}${this.prefix} ${e[0]}`), this.logger[t](e));
  }
  create(e) {
    return new ct(this.logger, {
      prefix: `${this.prefix}:${e}:`,
      ...this.options
    });
  }
  clone(e) {
    return e = e || this.options, e.prefix = e.prefix || this.prefix, new ct(this.logger, e);
  }
}
var Ne = new ct();
class ht {
  constructor() {
    this.observers = {};
  }
  on(e, t) {
    return e.split(" ").forEach((o) => {
      this.observers[o] || (this.observers[o] = /* @__PURE__ */ new Map());
      const r = this.observers[o].get(t) || 0;
      this.observers[o].set(t, r + 1);
    }), this;
  }
  off(e, t) {
    if (this.observers[e]) {
      if (!t) {
        delete this.observers[e];
        return;
      }
      this.observers[e].delete(t);
    }
  }
  emit(e, ...t) {
    this.observers[e] && Array.from(this.observers[e].entries()).forEach(([r, s]) => {
      for (let i = 0; i < s; i++)
        r(...t);
    }), this.observers["*"] && Array.from(this.observers["*"].entries()).forEach(([r, s]) => {
      for (let i = 0; i < s; i++)
        r.apply(r, [e, ...t]);
    });
  }
}
class gn extends ht {
  constructor(e, t = {
    ns: ["translation"],
    defaultNS: "translation"
  }) {
    super(), this.data = e || {}, this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.options.ignoreJSONStructure === void 0 && (this.options.ignoreJSONStructure = !0);
  }
  addNamespaces(e) {
    this.options.ns.indexOf(e) < 0 && this.options.ns.push(e);
  }
  removeNamespaces(e) {
    const t = this.options.ns.indexOf(e);
    t > -1 && this.options.ns.splice(t, 1);
  }
  getResource(e, t, o, r = {}) {
    var d, f;
    const s = r.keySeparator !== void 0 ? r.keySeparator : this.options.keySeparator, i = r.ignoreJSONStructure !== void 0 ? r.ignoreJSONStructure : this.options.ignoreJSONStructure;
    let a;
    e.indexOf(".") > -1 ? a = e.split(".") : (a = [e, t], o && (Array.isArray(o) ? a.push(...o) : K(o) && s ? a.push(...o.split(s)) : a.push(o)));
    const c = lt(this.data, a);
    return !c && !t && !o && e.indexOf(".") > -1 && (e = a[0], t = a[1], o = a.slice(2).join(".")), c || !i || !K(o) ? c : At((f = (d = this.data) == null ? void 0 : d[e]) == null ? void 0 : f[t], o, s);
  }
  addResource(e, t, o, r, s = {
    silent: !1
  }) {
    const i = s.keySeparator !== void 0 ? s.keySeparator : this.options.keySeparator;
    let a = [e, t];
    o && (a = a.concat(i ? o.split(i) : o)), e.indexOf(".") > -1 && (a = e.split("."), r = t, t = a[1]), this.addNamespaces(t), mn(this.data, a, r), s.silent || this.emit("added", e, t, o, r);
  }
  addResources(e, t, o, r = {
    silent: !1
  }) {
    for (const s in o)
      (K(o[s]) || Array.isArray(o[s])) && this.addResource(e, t, s, o[s], {
        silent: !0
      });
    r.silent || this.emit("added", e, t, o);
  }
  addResourceBundle(e, t, o, r, s, i = {
    silent: !1,
    skipCopy: !1
  }) {
    let a = [e, t];
    e.indexOf(".") > -1 && (a = e.split("."), r = o, o = t, t = a[1]), this.addNamespaces(t);
    let c = lt(this.data, a) || {};
    i.skipCopy || (o = JSON.parse(JSON.stringify(o))), r ? io(c, o, s) : c = {
      ...c,
      ...o
    }, mn(this.data, a, c), i.silent || this.emit("added", e, t, o);
  }
  removeResourceBundle(e, t) {
    this.hasResourceBundle(e, t) && delete this.data[e][t], this.removeNamespaces(t), this.emit("removed", e, t);
  }
  hasResourceBundle(e, t) {
    return this.getResource(e, t) !== void 0;
  }
  getResourceBundle(e, t) {
    return t || (t = this.options.defaultNS), this.getResource(e, t);
  }
  getDataByLanguage(e) {
    return this.data[e];
  }
  hasLanguageSomeTranslations(e) {
    const t = this.getDataByLanguage(e);
    return !!(t && Object.keys(t) || []).find((r) => t[r] && Object.keys(t[r]).length > 0);
  }
  toJSON() {
    return this.data;
  }
}
var ao = {
  processors: {},
  addPostProcessor(n) {
    this.processors[n.name] = n;
  },
  handle(n, e, t, o, r) {
    return n.forEach((s) => {
      var i;
      e = ((i = this.processors[s]) == null ? void 0 : i.process(e, t, o, r)) ?? e;
    }), e;
  }
};
const lo = Symbol("i18next/PATH_KEY");
function Tr() {
  const n = [], e = /* @__PURE__ */ Object.create(null);
  let t;
  return e.get = (o, r) => {
    var s;
    return (s = t == null ? void 0 : t.revoke) == null || s.call(t), r === lo ? n : (n.push(r), t = Proxy.revocable(o, e), t.proxy);
  }, Proxy.revocable(/* @__PURE__ */ Object.create(null), e).proxy;
}
function zt(n, e) {
  const {
    [lo]: t
  } = n(Tr());
  return t.join((e == null ? void 0 : e.keySeparator) ?? ".");
}
const vn = {}, yn = (n) => !K(n) && typeof n != "boolean" && typeof n != "number";
class dt extends ht {
  constructor(e, t = {}) {
    super(), $r(["resourceStore", "languageUtils", "pluralResolver", "interpolator", "backendConnector", "i18nFormat", "utils"], e, this), this.options = t, this.options.keySeparator === void 0 && (this.options.keySeparator = "."), this.logger = Ne.create("translator");
  }
  changeLanguage(e) {
    e && (this.language = e);
  }
  exists(e, t = {
    interpolation: {}
  }) {
    const o = {
      ...t
    };
    if (e == null) return !1;
    const r = this.resolve(e, o);
    return (r == null ? void 0 : r.res) !== void 0;
  }
  extractFromKey(e, t) {
    let o = t.nsSeparator !== void 0 ? t.nsSeparator : this.options.nsSeparator;
    o === void 0 && (o = ":");
    const r = t.keySeparator !== void 0 ? t.keySeparator : this.options.keySeparator;
    let s = t.ns || this.options.defaultNS || [];
    const i = o && e.indexOf(o) > -1, a = !this.options.userDefinedKeySeparator && !t.keySeparator && !this.options.userDefinedNsSeparator && !t.nsSeparator && !Nr(e, o, r);
    if (i && !a) {
      const c = e.match(this.interpolator.nestingRegexp);
      if (c && c.length > 0)
        return {
          key: e,
          namespaces: K(s) ? [s] : s
        };
      const d = e.split(o);
      (o !== r || o === r && this.options.ns.indexOf(d[0]) > -1) && (s = d.shift()), e = d.join(r);
    }
    return {
      key: e,
      namespaces: K(s) ? [s] : s
    };
  }
  translate(e, t, o) {
    let r = typeof t == "object" ? {
      ...t
    } : t;
    if (typeof r != "object" && this.options.overloadTranslationOptionHandler && (r = this.options.overloadTranslationOptionHandler(arguments)), typeof r == "object" && (r = {
      ...r
    }), r || (r = {}), e == null) return "";
    typeof e == "function" && (e = zt(e, {
      ...this.options,
      ...r
    })), Array.isArray(e) || (e = [String(e)]);
    const s = r.returnDetails !== void 0 ? r.returnDetails : this.options.returnDetails, i = r.keySeparator !== void 0 ? r.keySeparator : this.options.keySeparator, {
      key: a,
      namespaces: c
    } = this.extractFromKey(e[e.length - 1], r), d = c[c.length - 1];
    let f = r.nsSeparator !== void 0 ? r.nsSeparator : this.options.nsSeparator;
    f === void 0 && (f = ":");
    const p = r.lng || this.language, g = r.appendNamespaceToCIMode || this.options.appendNamespaceToCIMode;
    if ((p == null ? void 0 : p.toLowerCase()) === "cimode")
      return g ? s ? {
        res: `${d}${f}${a}`,
        usedKey: a,
        exactUsedKey: a,
        usedLng: p,
        usedNS: d,
        usedParams: this.getUsedParamsDetails(r)
      } : `${d}${f}${a}` : s ? {
        res: a,
        usedKey: a,
        exactUsedKey: a,
        usedLng: p,
        usedNS: d,
        usedParams: this.getUsedParamsDetails(r)
      } : a;
    const h = this.resolve(e, r);
    let m = h == null ? void 0 : h.res;
    const $ = (h == null ? void 0 : h.usedKey) || a, A = (h == null ? void 0 : h.exactUsedKey) || a, C = ["[object Number]", "[object Function]", "[object RegExp]"], P = r.joinArrays !== void 0 ? r.joinArrays : this.options.joinArrays, j = !this.i18nFormat || this.i18nFormat.handleAsObject, T = r.count !== void 0 && !K(r.count), v = dt.hasDefaultValue(r), R = T ? this.pluralResolver.getSuffix(p, r.count, r) : "", F = r.ordinal && T ? this.pluralResolver.getSuffix(p, r.count, {
      ordinal: !1
    }) : "", S = T && !r.ordinal && r.count === 0, y = S && r[`defaultValue${this.options.pluralSeparator}zero`] || r[`defaultValue${R}`] || r[`defaultValue${F}`] || r.defaultValue;
    let x = m;
    j && !m && v && (x = y);
    const L = yn(x), O = Object.prototype.toString.apply(x);
    if (j && x && L && C.indexOf(O) < 0 && !(K(P) && Array.isArray(x))) {
      if (!r.returnObjects && !this.options.returnObjects) {
        this.options.returnedObjectHandler || this.logger.warn("accessing an object - but returnObjects options is not enabled!");
        const N = this.options.returnedObjectHandler ? this.options.returnedObjectHandler($, x, {
          ...r,
          ns: c
        }) : `key '${a} (${this.language})' returned an object instead of string.`;
        return s ? (h.res = N, h.usedParams = this.getUsedParamsDetails(r), h) : N;
      }
      if (i) {
        const N = Array.isArray(x), M = N ? [] : {}, Q = N ? A : $;
        for (const J in x)
          if (Object.prototype.hasOwnProperty.call(x, J)) {
            const Z = `${Q}${i}${J}`;
            v && !m ? M[J] = this.translate(Z, {
              ...r,
              defaultValue: yn(y) ? y[J] : void 0,
              joinArrays: !1,
              ns: c
            }) : M[J] = this.translate(Z, {
              ...r,
              joinArrays: !1,
              ns: c
            }), M[J] === Z && (M[J] = x[J]);
          }
        m = M;
      }
    } else if (j && K(P) && Array.isArray(m))
      m = m.join(P), m && (m = this.extendTranslation(m, e, r, o));
    else {
      let N = !1, M = !1;
      !this.isValidLookup(m) && v && (N = !0, m = y), this.isValidLookup(m) || (M = !0, m = a);
      const J = (r.missingKeyNoValueFallbackToKey || this.options.missingKeyNoValueFallbackToKey) && M ? void 0 : m, Z = v && y !== m && this.options.updateMissing;
      if (M || N || Z) {
        if (this.logger.log(Z ? "updateKey" : "missingKey", p, d, a, Z ? y : m), i) {
          const E = this.resolve(a, {
            ...r,
            keySeparator: !1
          });
          E && E.res && this.logger.warn("Seems the loaded translations were in flat JSON format instead of nested. Either set keySeparator: false on init or make sure your translations are published in nested format.");
        }
        let de = [];
        const ne = this.languageUtils.getFallbackCodes(this.options.fallbackLng, r.lng || this.language);
        if (this.options.saveMissingTo === "fallback" && ne && ne[0])
          for (let E = 0; E < ne.length; E++)
            de.push(ne[E]);
        else this.options.saveMissingTo === "all" ? de = this.languageUtils.toResolveHierarchy(r.lng || this.language) : de.push(r.lng || this.language);
        const w = (E, _, H) => {
          var X;
          const V = v && H !== m ? H : J;
          this.options.missingKeyHandler ? this.options.missingKeyHandler(E, d, _, V, Z, r) : (X = this.backendConnector) != null && X.saveMissing && this.backendConnector.saveMissing(E, d, _, V, Z, r), this.emit("missingKey", E, d, _, m);
        };
        this.options.saveMissing && (this.options.saveMissingPlurals && T ? de.forEach((E) => {
          const _ = this.pluralResolver.getSuffixes(E, r);
          S && r[`defaultValue${this.options.pluralSeparator}zero`] && _.indexOf(`${this.options.pluralSeparator}zero`) < 0 && _.push(`${this.options.pluralSeparator}zero`), _.forEach((H) => {
            w([E], a + H, r[`defaultValue${H}`] || y);
          });
        }) : w(de, a, y));
      }
      m = this.extendTranslation(m, e, r, h, o), M && m === a && this.options.appendNamespaceToMissingKey && (m = `${d}${f}${a}`), (M || N) && this.options.parseMissingKeyHandler && (m = this.options.parseMissingKeyHandler(this.options.appendNamespaceToMissingKey ? `${d}${f}${a}` : a, N ? m : void 0, r));
    }
    return s ? (h.res = m, h.usedParams = this.getUsedParamsDetails(r), h) : m;
  }
  extendTranslation(e, t, o, r, s) {
    var c, d;
    if ((c = this.i18nFormat) != null && c.parse)
      e = this.i18nFormat.parse(e, {
        ...this.options.interpolation.defaultVariables,
        ...o
      }, o.lng || this.language || r.usedLng, r.usedNS, r.usedKey, {
        resolved: r
      });
    else if (!o.skipInterpolation) {
      o.interpolation && this.interpolator.init({
        ...o,
        interpolation: {
          ...this.options.interpolation,
          ...o.interpolation
        }
      });
      const f = K(e) && (((d = o == null ? void 0 : o.interpolation) == null ? void 0 : d.skipOnVariables) !== void 0 ? o.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables);
      let p;
      if (f) {
        const h = e.match(this.interpolator.nestingRegexp);
        p = h && h.length;
      }
      let g = o.replace && !K(o.replace) ? o.replace : o;
      if (this.options.interpolation.defaultVariables && (g = {
        ...this.options.interpolation.defaultVariables,
        ...g
      }), e = this.interpolator.interpolate(e, g, o.lng || this.language || r.usedLng, o), f) {
        const h = e.match(this.interpolator.nestingRegexp), m = h && h.length;
        p < m && (o.nest = !1);
      }
      !o.lng && r && r.res && (o.lng = this.language || r.usedLng), o.nest !== !1 && (e = this.interpolator.nest(e, (...h) => (s == null ? void 0 : s[0]) === h[0] && !o.context ? (this.logger.warn(`It seems you are nesting recursively key: ${h[0]} in key: ${t[0]}`), null) : this.translate(...h, t), o)), o.interpolation && this.interpolator.reset();
    }
    const i = o.postProcess || this.options.postProcess, a = K(i) ? [i] : i;
    return e != null && (a != null && a.length) && o.applyPostProcessor !== !1 && (e = ao.handle(a, e, t, this.options && this.options.postProcessPassResolved ? {
      i18nResolved: {
        ...r,
        usedParams: this.getUsedParamsDetails(o)
      },
      ...o
    } : o, this)), e;
  }
  resolve(e, t = {}) {
    let o, r, s, i, a;
    return K(e) && (e = [e]), e.forEach((c) => {
      if (this.isValidLookup(o)) return;
      const d = this.extractFromKey(c, t), f = d.key;
      r = f;
      let p = d.namespaces;
      this.options.fallbackNS && (p = p.concat(this.options.fallbackNS));
      const g = t.count !== void 0 && !K(t.count), h = g && !t.ordinal && t.count === 0, m = t.context !== void 0 && (K(t.context) || typeof t.context == "number") && t.context !== "", $ = t.lngs ? t.lngs : this.languageUtils.toResolveHierarchy(t.lng || this.language, t.fallbackLng);
      p.forEach((A) => {
        var C, P;
        this.isValidLookup(o) || (a = A, !vn[`${$[0]}-${A}`] && ((C = this.utils) != null && C.hasLoadedNamespace) && !((P = this.utils) != null && P.hasLoadedNamespace(a)) && (vn[`${$[0]}-${A}`] = !0, this.logger.warn(`key "${r}" for languages "${$.join(", ")}" won't get resolved as namespace "${a}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!")), $.forEach((j) => {
          var R;
          if (this.isValidLookup(o)) return;
          i = j;
          const T = [f];
          if ((R = this.i18nFormat) != null && R.addLookupKeys)
            this.i18nFormat.addLookupKeys(T, f, j, A, t);
          else {
            let F;
            g && (F = this.pluralResolver.getSuffix(j, t.count, t));
            const S = `${this.options.pluralSeparator}zero`, y = `${this.options.pluralSeparator}ordinal${this.options.pluralSeparator}`;
            if (g && (t.ordinal && F.indexOf(y) === 0 && T.push(f + F.replace(y, this.options.pluralSeparator)), T.push(f + F), h && T.push(f + S)), m) {
              const x = `${f}${this.options.contextSeparator || "_"}${t.context}`;
              T.push(x), g && (t.ordinal && F.indexOf(y) === 0 && T.push(x + F.replace(y, this.options.pluralSeparator)), T.push(x + F), h && T.push(x + S));
            }
          }
          let v;
          for (; v = T.pop(); )
            this.isValidLookup(o) || (s = v, o = this.getResource(j, A, v, t));
        }));
      });
    }), {
      res: o,
      usedKey: r,
      exactUsedKey: s,
      usedLng: i,
      usedNS: a
    };
  }
  isValidLookup(e) {
    return e !== void 0 && !(!this.options.returnNull && e === null) && !(!this.options.returnEmptyString && e === "");
  }
  getResource(e, t, o, r = {}) {
    var s;
    return (s = this.i18nFormat) != null && s.getResource ? this.i18nFormat.getResource(e, t, o, r) : this.resourceStore.getResource(e, t, o, r);
  }
  getUsedParamsDetails(e = {}) {
    const t = ["defaultValue", "ordinal", "context", "replace", "lng", "lngs", "fallbackLng", "ns", "keySeparator", "nsSeparator", "returnObjects", "returnDetails", "joinArrays", "postProcess", "interpolation"], o = e.replace && !K(e.replace);
    let r = o ? e.replace : e;
    if (o && typeof e.count < "u" && (r.count = e.count), this.options.interpolation.defaultVariables && (r = {
      ...this.options.interpolation.defaultVariables,
      ...r
    }), !o) {
      r = {
        ...r
      };
      for (const s of t)
        delete r[s];
    }
    return r;
  }
  static hasDefaultValue(e) {
    const t = "defaultValue";
    for (const o in e)
      if (Object.prototype.hasOwnProperty.call(e, o) && t === o.substring(0, t.length) && e[o] !== void 0)
        return !0;
    return !1;
  }
}
class $n {
  constructor(e) {
    this.options = e, this.supportedLngs = this.options.supportedLngs || !1, this.logger = Ne.create("languageUtils");
  }
  getScriptPartFromCode(e) {
    if (e = Xe(e), !e || e.indexOf("-") < 0) return null;
    const t = e.split("-");
    return t.length === 2 || (t.pop(), t[t.length - 1].toLowerCase() === "x") ? null : this.formatLanguageCode(t.join("-"));
  }
  getLanguagePartFromCode(e) {
    if (e = Xe(e), !e || e.indexOf("-") < 0) return e;
    const t = e.split("-");
    return this.formatLanguageCode(t[0]);
  }
  formatLanguageCode(e) {
    if (K(e) && e.indexOf("-") > -1) {
      let t;
      try {
        t = Intl.getCanonicalLocales(e)[0];
      } catch {
      }
      return t && this.options.lowerCaseLng && (t = t.toLowerCase()), t || (this.options.lowerCaseLng ? e.toLowerCase() : e);
    }
    return this.options.cleanCode || this.options.lowerCaseLng ? e.toLowerCase() : e;
  }
  isSupportedCode(e) {
    return (this.options.load === "languageOnly" || this.options.nonExplicitSupportedLngs) && (e = this.getLanguagePartFromCode(e)), !this.supportedLngs || !this.supportedLngs.length || this.supportedLngs.indexOf(e) > -1;
  }
  getBestMatchFromCodes(e) {
    if (!e) return null;
    let t;
    return e.forEach((o) => {
      if (t) return;
      const r = this.formatLanguageCode(o);
      (!this.options.supportedLngs || this.isSupportedCode(r)) && (t = r);
    }), !t && this.options.supportedLngs && e.forEach((o) => {
      if (t) return;
      const r = this.getScriptPartFromCode(o);
      if (this.isSupportedCode(r)) return t = r;
      const s = this.getLanguagePartFromCode(o);
      if (this.isSupportedCode(s)) return t = s;
      t = this.options.supportedLngs.find((i) => {
        if (i === s) return i;
        if (!(i.indexOf("-") < 0 && s.indexOf("-") < 0) && (i.indexOf("-") > 0 && s.indexOf("-") < 0 && i.substring(0, i.indexOf("-")) === s || i.indexOf(s) === 0 && s.length > 1))
          return i;
      });
    }), t || (t = this.getFallbackCodes(this.options.fallbackLng)[0]), t;
  }
  getFallbackCodes(e, t) {
    if (!e) return [];
    if (typeof e == "function" && (e = e(t)), K(e) && (e = [e]), Array.isArray(e)) return e;
    if (!t) return e.default || [];
    let o = e[t];
    return o || (o = e[this.getScriptPartFromCode(t)]), o || (o = e[this.formatLanguageCode(t)]), o || (o = e[this.getLanguagePartFromCode(t)]), o || (o = e.default), o || [];
  }
  toResolveHierarchy(e, t) {
    const o = this.getFallbackCodes((t === !1 ? [] : t) || this.options.fallbackLng || [], e), r = [], s = (i) => {
      i && (this.isSupportedCode(i) ? r.push(i) : this.logger.warn(`rejecting language code not found in supportedLngs: ${i}`));
    };
    return K(e) && (e.indexOf("-") > -1 || e.indexOf("_") > -1) ? (this.options.load !== "languageOnly" && s(this.formatLanguageCode(e)), this.options.load !== "languageOnly" && this.options.load !== "currentOnly" && s(this.getScriptPartFromCode(e)), this.options.load !== "currentOnly" && s(this.getLanguagePartFromCode(e))) : K(e) && s(this.formatLanguageCode(e)), o.forEach((i) => {
      r.indexOf(i) < 0 && s(this.formatLanguageCode(i));
    }), r;
  }
}
const xn = {
  zero: 0,
  one: 1,
  two: 2,
  few: 3,
  many: 4,
  other: 5
}, wn = {
  select: (n) => n === 1 ? "one" : "other",
  resolvedOptions: () => ({
    pluralCategories: ["one", "other"]
  })
};
class Rr {
  constructor(e, t = {}) {
    this.languageUtils = e, this.options = t, this.logger = Ne.create("pluralResolver"), this.pluralRulesCache = {};
  }
  addRule(e, t) {
    this.rules[e] = t;
  }
  clearCache() {
    this.pluralRulesCache = {};
  }
  getRule(e, t = {}) {
    const o = Xe(e === "dev" ? "en" : e), r = t.ordinal ? "ordinal" : "cardinal", s = JSON.stringify({
      cleanedCode: o,
      type: r
    });
    if (s in this.pluralRulesCache)
      return this.pluralRulesCache[s];
    let i;
    try {
      i = new Intl.PluralRules(o, {
        type: r
      });
    } catch {
      if (!Intl)
        return this.logger.error("No Intl support, please use an Intl polyfill!"), wn;
      if (!e.match(/-|_/)) return wn;
      const c = this.languageUtils.getLanguagePartFromCode(e);
      i = this.getRule(c, t);
    }
    return this.pluralRulesCache[s] = i, i;
  }
  needsPlural(e, t = {}) {
    let o = this.getRule(e, t);
    return o || (o = this.getRule("dev", t)), (o == null ? void 0 : o.resolvedOptions().pluralCategories.length) > 1;
  }
  getPluralFormsOfKey(e, t, o = {}) {
    return this.getSuffixes(e, o).map((r) => `${t}${r}`);
  }
  getSuffixes(e, t = {}) {
    let o = this.getRule(e, t);
    return o || (o = this.getRule("dev", t)), o ? o.resolvedOptions().pluralCategories.sort((r, s) => xn[r] - xn[s]).map((r) => `${this.options.prepend}${t.ordinal ? `ordinal${this.options.prepend}` : ""}${r}`) : [];
  }
  getSuffix(e, t, o = {}) {
    const r = this.getRule(e, o);
    return r ? `${this.options.prepend}${o.ordinal ? `ordinal${this.options.prepend}` : ""}${r.select(t)}` : (this.logger.warn(`no plural rule found for: ${e}`), this.getSuffix("dev", t, o));
  }
}
const bn = (n, e, t, o = ".", r = !0) => {
  let s = br(n, e, t);
  return !s && r && K(t) && (s = At(n, t, o), s === void 0 && (s = At(e, t, o))), s;
}, St = (n) => n.replace(/\$/g, "$$$$");
class Lr {
  constructor(e = {}) {
    var t;
    this.logger = Ne.create("interpolator"), this.options = e, this.format = ((t = e == null ? void 0 : e.interpolation) == null ? void 0 : t.format) || ((o) => o), this.init(e);
  }
  init(e = {}) {
    e.interpolation || (e.interpolation = {
      escapeValue: !0
    });
    const {
      escape: t,
      escapeValue: o,
      useRawValueToEscape: r,
      prefix: s,
      prefixEscaped: i,
      suffix: a,
      suffixEscaped: c,
      formatSeparator: d,
      unescapeSuffix: f,
      unescapePrefix: p,
      nestingPrefix: g,
      nestingPrefixEscaped: h,
      nestingSuffix: m,
      nestingSuffixEscaped: $,
      nestingOptionsSeparator: A,
      maxReplaces: C,
      alwaysFormat: P
    } = e.interpolation;
    this.escape = t !== void 0 ? t : Sr, this.escapeValue = o !== void 0 ? o : !0, this.useRawValueToEscape = r !== void 0 ? r : !1, this.prefix = s ? _e(s) : i || "{{", this.suffix = a ? _e(a) : c || "}}", this.formatSeparator = d || ",", this.unescapePrefix = f ? "" : p || "-", this.unescapeSuffix = this.unescapePrefix ? "" : f || "", this.nestingPrefix = g ? _e(g) : h || _e("$t("), this.nestingSuffix = m ? _e(m) : $ || _e(")"), this.nestingOptionsSeparator = A || ",", this.maxReplaces = C || 1e3, this.alwaysFormat = P !== void 0 ? P : !1, this.resetRegExp();
  }
  reset() {
    this.options && this.init(this.options);
  }
  resetRegExp() {
    const e = (t, o) => (t == null ? void 0 : t.source) === o ? (t.lastIndex = 0, t) : new RegExp(o, "g");
    this.regexp = e(this.regexp, `${this.prefix}(.+?)${this.suffix}`), this.regexpUnescape = e(this.regexpUnescape, `${this.prefix}${this.unescapePrefix}(.+?)${this.unescapeSuffix}${this.suffix}`), this.nestingRegexp = e(this.nestingRegexp, `${this.nestingPrefix}((?:[^()"']+|"[^"]*"|'[^']*'|\\((?:[^()]|"[^"]*"|'[^']*')*\\))*?)${this.nestingSuffix}`);
  }
  interpolate(e, t, o, r) {
    var h;
    let s, i, a;
    const c = this.options && this.options.interpolation && this.options.interpolation.defaultVariables || {}, d = (m) => {
      if (m.indexOf(this.formatSeparator) < 0) {
        const P = bn(t, c, m, this.options.keySeparator, this.options.ignoreJSONStructure);
        return this.alwaysFormat ? this.format(P, void 0, o, {
          ...r,
          ...t,
          interpolationkey: m
        }) : P;
      }
      const $ = m.split(this.formatSeparator), A = $.shift().trim(), C = $.join(this.formatSeparator).trim();
      return this.format(bn(t, c, A, this.options.keySeparator, this.options.ignoreJSONStructure), C, o, {
        ...r,
        ...t,
        interpolationkey: A
      });
    };
    this.resetRegExp();
    const f = (r == null ? void 0 : r.missingInterpolationHandler) || this.options.missingInterpolationHandler, p = ((h = r == null ? void 0 : r.interpolation) == null ? void 0 : h.skipOnVariables) !== void 0 ? r.interpolation.skipOnVariables : this.options.interpolation.skipOnVariables;
    return [{
      regex: this.regexpUnescape,
      safeValue: (m) => St(m)
    }, {
      regex: this.regexp,
      safeValue: (m) => this.escapeValue ? St(this.escape(m)) : St(m)
    }].forEach((m) => {
      for (a = 0; s = m.regex.exec(e); ) {
        const $ = s[1].trim();
        if (i = d($), i === void 0)
          if (typeof f == "function") {
            const C = f(e, s, r);
            i = K(C) ? C : "";
          } else if (r && Object.prototype.hasOwnProperty.call(r, $))
            i = "";
          else if (p) {
            i = s[0];
            continue;
          } else
            this.logger.warn(`missed to pass in variable ${$} for interpolating ${e}`), i = "";
        else !K(i) && !this.useRawValueToEscape && (i = fn(i));
        const A = m.safeValue(i);
        if (e = e.replace(s[0], A), p ? (m.regex.lastIndex += i.length, m.regex.lastIndex -= s[0].length) : m.regex.lastIndex = 0, a++, a >= this.maxReplaces)
          break;
      }
    }), e;
  }
  nest(e, t, o = {}) {
    let r, s, i;
    const a = (c, d) => {
      const f = this.nestingOptionsSeparator;
      if (c.indexOf(f) < 0) return c;
      const p = c.split(new RegExp(`${f}[ ]*{`));
      let g = `{${p[1]}`;
      c = p[0], g = this.interpolate(g, i);
      const h = g.match(/'/g), m = g.match(/"/g);
      (((h == null ? void 0 : h.length) ?? 0) % 2 === 0 && !m || m.length % 2 !== 0) && (g = g.replace(/'/g, '"'));
      try {
        i = JSON.parse(g), d && (i = {
          ...d,
          ...i
        });
      } catch ($) {
        return this.logger.warn(`failed parsing options string in nesting for key ${c}`, $), `${c}${f}${g}`;
      }
      return i.defaultValue && i.defaultValue.indexOf(this.prefix) > -1 && delete i.defaultValue, c;
    };
    for (; r = this.nestingRegexp.exec(e); ) {
      let c = [];
      i = {
        ...o
      }, i = i.replace && !K(i.replace) ? i.replace : i, i.applyPostProcessor = !1, delete i.defaultValue;
      const d = /{.*}/.test(r[1]) ? r[1].lastIndexOf("}") + 1 : r[1].indexOf(this.formatSeparator);
      if (d !== -1 && (c = r[1].slice(d).split(this.formatSeparator).map((f) => f.trim()).filter(Boolean), r[1] = r[1].slice(0, d)), s = t(a.call(this, r[1].trim(), i), i), s && r[0] === e && !K(s)) return s;
      K(s) || (s = fn(s)), s || (this.logger.warn(`missed to resolve ${r[1]} for nesting ${e}`), s = ""), c.length && (s = c.reduce((f, p) => this.format(f, p, o.lng, {
        ...o,
        interpolationkey: r[1].trim()
      }), s.trim())), e = e.replace(r[0], s), this.regexp.lastIndex = 0;
    }
    return e;
  }
}
const Or = (n) => {
  let e = n.toLowerCase().trim();
  const t = {};
  if (n.indexOf("(") > -1) {
    const o = n.split("(");
    e = o[0].toLowerCase().trim();
    const r = o[1].substring(0, o[1].length - 1);
    e === "currency" && r.indexOf(":") < 0 ? t.currency || (t.currency = r.trim()) : e === "relativetime" && r.indexOf(":") < 0 ? t.range || (t.range = r.trim()) : r.split(";").forEach((i) => {
      if (i) {
        const [a, ...c] = i.split(":"), d = c.join(":").trim().replace(/^'+|'+$/g, ""), f = a.trim();
        t[f] || (t[f] = d), d === "false" && (t[f] = !1), d === "true" && (t[f] = !0), isNaN(d) || (t[f] = parseInt(d, 10));
      }
    });
  }
  return {
    formatName: e,
    formatOptions: t
  };
}, Cn = (n) => {
  const e = {};
  return (t, o, r) => {
    let s = r;
    r && r.interpolationkey && r.formatParams && r.formatParams[r.interpolationkey] && r[r.interpolationkey] && (s = {
      ...s,
      [r.interpolationkey]: void 0
    });
    const i = o + JSON.stringify(s);
    let a = e[i];
    return a || (a = n(Xe(o), r), e[i] = a), a(t);
  };
}, kr = (n) => (e, t, o) => n(Xe(t), o)(e);
class Ar {
  constructor(e = {}) {
    this.logger = Ne.create("formatter"), this.options = e, this.init(e);
  }
  init(e, t = {
    interpolation: {}
  }) {
    this.formatSeparator = t.interpolation.formatSeparator || ",";
    const o = t.cacheInBuiltFormats ? Cn : kr;
    this.formats = {
      number: o((r, s) => {
        const i = new Intl.NumberFormat(r, {
          ...s
        });
        return (a) => i.format(a);
      }),
      currency: o((r, s) => {
        const i = new Intl.NumberFormat(r, {
          ...s,
          style: "currency"
        });
        return (a) => i.format(a);
      }),
      datetime: o((r, s) => {
        const i = new Intl.DateTimeFormat(r, {
          ...s
        });
        return (a) => i.format(a);
      }),
      relativetime: o((r, s) => {
        const i = new Intl.RelativeTimeFormat(r, {
          ...s
        });
        return (a) => i.format(a, s.range || "day");
      }),
      list: o((r, s) => {
        const i = new Intl.ListFormat(r, {
          ...s
        });
        return (a) => i.format(a);
      })
    };
  }
  add(e, t) {
    this.formats[e.toLowerCase().trim()] = t;
  }
  addCached(e, t) {
    this.formats[e.toLowerCase().trim()] = Cn(t);
  }
  format(e, t, o, r = {}) {
    const s = t.split(this.formatSeparator);
    if (s.length > 1 && s[0].indexOf("(") > 1 && s[0].indexOf(")") < 0 && s.find((a) => a.indexOf(")") > -1)) {
      const a = s.findIndex((c) => c.indexOf(")") > -1);
      s[0] = [s[0], ...s.splice(1, a)].join(this.formatSeparator);
    }
    return s.reduce((a, c) => {
      var p;
      const {
        formatName: d,
        formatOptions: f
      } = Or(c);
      if (this.formats[d]) {
        let g = a;
        try {
          const h = ((p = r == null ? void 0 : r.formatParams) == null ? void 0 : p[r.interpolationkey]) || {}, m = h.locale || h.lng || r.locale || r.lng || o;
          g = this.formats[d](a, m, {
            ...f,
            ...r,
            ...h
          });
        } catch (h) {
          this.logger.warn(h);
        }
        return g;
      } else
        this.logger.warn(`there was no format function for ${d}`);
      return a;
    }, e);
  }
}
const zr = (n, e) => {
  n.pending[e] !== void 0 && (delete n.pending[e], n.pendingCount--);
};
class Mr extends ht {
  constructor(e, t, o, r = {}) {
    var s, i;
    super(), this.backend = e, this.store = t, this.services = o, this.languageUtils = o.languageUtils, this.options = r, this.logger = Ne.create("backendConnector"), this.waitingReads = [], this.maxParallelReads = r.maxParallelReads || 10, this.readingCalls = 0, this.maxRetries = r.maxRetries >= 0 ? r.maxRetries : 5, this.retryTimeout = r.retryTimeout >= 1 ? r.retryTimeout : 350, this.state = {}, this.queue = [], (i = (s = this.backend) == null ? void 0 : s.init) == null || i.call(s, o, r.backend, r);
  }
  queueLoad(e, t, o, r) {
    const s = {}, i = {}, a = {}, c = {};
    return e.forEach((d) => {
      let f = !0;
      t.forEach((p) => {
        const g = `${d}|${p}`;
        !o.reload && this.store.hasResourceBundle(d, p) ? this.state[g] = 2 : this.state[g] < 0 || (this.state[g] === 1 ? i[g] === void 0 && (i[g] = !0) : (this.state[g] = 1, f = !1, i[g] === void 0 && (i[g] = !0), s[g] === void 0 && (s[g] = !0), c[p] === void 0 && (c[p] = !0)));
      }), f || (a[d] = !0);
    }), (Object.keys(s).length || Object.keys(i).length) && this.queue.push({
      pending: i,
      pendingCount: Object.keys(i).length,
      loaded: {},
      errors: [],
      callback: r
    }), {
      toLoad: Object.keys(s),
      pending: Object.keys(i),
      toLoadLanguages: Object.keys(a),
      toLoadNamespaces: Object.keys(c)
    };
  }
  loaded(e, t, o) {
    const r = e.split("|"), s = r[0], i = r[1];
    t && this.emit("failedLoading", s, i, t), !t && o && this.store.addResourceBundle(s, i, o, void 0, void 0, {
      skipCopy: !0
    }), this.state[e] = t ? -1 : 2, t && o && (this.state[e] = 0);
    const a = {};
    this.queue.forEach((c) => {
      wr(c.loaded, [s], i), zr(c, e), t && c.errors.push(t), c.pendingCount === 0 && !c.done && (Object.keys(c.loaded).forEach((d) => {
        a[d] || (a[d] = {});
        const f = c.loaded[d];
        f.length && f.forEach((p) => {
          a[d][p] === void 0 && (a[d][p] = !0);
        });
      }), c.done = !0, c.errors.length ? c.callback(c.errors) : c.callback());
    }), this.emit("loaded", a), this.queue = this.queue.filter((c) => !c.done);
  }
  read(e, t, o, r = 0, s = this.retryTimeout, i) {
    if (!e.length) return i(null, {});
    if (this.readingCalls >= this.maxParallelReads) {
      this.waitingReads.push({
        lng: e,
        ns: t,
        fcName: o,
        tried: r,
        wait: s,
        callback: i
      });
      return;
    }
    this.readingCalls++;
    const a = (d, f) => {
      if (this.readingCalls--, this.waitingReads.length > 0) {
        const p = this.waitingReads.shift();
        this.read(p.lng, p.ns, p.fcName, p.tried, p.wait, p.callback);
      }
      if (d && f && r < this.maxRetries) {
        setTimeout(() => {
          this.read.call(this, e, t, o, r + 1, s * 2, i);
        }, s);
        return;
      }
      i(d, f);
    }, c = this.backend[o].bind(this.backend);
    if (c.length === 2) {
      try {
        const d = c(e, t);
        d && typeof d.then == "function" ? d.then((f) => a(null, f)).catch(a) : a(null, d);
      } catch (d) {
        a(d);
      }
      return;
    }
    return c(e, t, a);
  }
  prepareLoading(e, t, o = {}, r) {
    if (!this.backend)
      return this.logger.warn("No backend was added via i18next.use. Will not load resources."), r && r();
    K(e) && (e = this.languageUtils.toResolveHierarchy(e)), K(t) && (t = [t]);
    const s = this.queueLoad(e, t, o, r);
    if (!s.toLoad.length)
      return s.pending.length || r(), null;
    s.toLoad.forEach((i) => {
      this.loadOne(i);
    });
  }
  load(e, t, o) {
    this.prepareLoading(e, t, {}, o);
  }
  reload(e, t, o) {
    this.prepareLoading(e, t, {
      reload: !0
    }, o);
  }
  loadOne(e, t = "") {
    const o = e.split("|"), r = o[0], s = o[1];
    this.read(r, s, "read", void 0, void 0, (i, a) => {
      i && this.logger.warn(`${t}loading namespace ${s} for language ${r} failed`, i), !i && a && this.logger.log(`${t}loaded namespace ${s} for language ${r}`, a), this.loaded(e, i, a);
    });
  }
  saveMissing(e, t, o, r, s, i = {}, a = () => {
  }) {
    var c, d, f, p, g;
    if ((d = (c = this.services) == null ? void 0 : c.utils) != null && d.hasLoadedNamespace && !((p = (f = this.services) == null ? void 0 : f.utils) != null && p.hasLoadedNamespace(t))) {
      this.logger.warn(`did not save key "${o}" as the namespace "${t}" was not yet loaded`, "This means something IS WRONG in your setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!");
      return;
    }
    if (!(o == null || o === "")) {
      if ((g = this.backend) != null && g.create) {
        const h = {
          ...i,
          isUpdate: s
        }, m = this.backend.create.bind(this.backend);
        if (m.length < 6)
          try {
            let $;
            m.length === 5 ? $ = m(e, t, o, r, h) : $ = m(e, t, o, r), $ && typeof $.then == "function" ? $.then((A) => a(null, A)).catch(a) : a(null, $);
          } catch ($) {
            a($);
          }
        else
          m(e, t, o, r, a, h);
      }
      !e || !e[0] || this.store.addResource(e[0], t, o, r);
    }
  }
}
const Sn = () => ({
  debug: !1,
  initAsync: !0,
  ns: ["translation"],
  defaultNS: ["translation"],
  fallbackLng: ["dev"],
  fallbackNS: !1,
  supportedLngs: !1,
  nonExplicitSupportedLngs: !1,
  load: "all",
  preload: !1,
  simplifyPluralSuffix: !0,
  keySeparator: ".",
  nsSeparator: ":",
  pluralSeparator: "_",
  contextSeparator: "_",
  partialBundledLanguages: !1,
  saveMissing: !1,
  updateMissing: !1,
  saveMissingTo: "fallback",
  saveMissingPlurals: !0,
  missingKeyHandler: !1,
  missingInterpolationHandler: !1,
  postProcess: !1,
  postProcessPassResolved: !1,
  returnNull: !1,
  returnEmptyString: !0,
  returnObjects: !1,
  joinArrays: !1,
  returnedObjectHandler: !1,
  parseMissingKeyHandler: !1,
  appendNamespaceToMissingKey: !1,
  appendNamespaceToCIMode: !1,
  overloadTranslationOptionHandler: (n) => {
    let e = {};
    if (typeof n[1] == "object" && (e = n[1]), K(n[1]) && (e.defaultValue = n[1]), K(n[2]) && (e.tDescription = n[2]), typeof n[2] == "object" || typeof n[3] == "object") {
      const t = n[3] || n[2];
      Object.keys(t).forEach((o) => {
        e[o] = t[o];
      });
    }
    return e;
  },
  interpolation: {
    escapeValue: !0,
    format: (n) => n,
    prefix: "{{",
    suffix: "}}",
    formatSeparator: ",",
    unescapePrefix: "-",
    nestingPrefix: "$t(",
    nestingSuffix: ")",
    nestingOptionsSeparator: ",",
    maxReplaces: 1e3,
    skipOnVariables: !0
  },
  cacheInBuiltFormats: !0
}), En = (n) => {
  var e, t;
  return K(n.ns) && (n.ns = [n.ns]), K(n.fallbackLng) && (n.fallbackLng = [n.fallbackLng]), K(n.fallbackNS) && (n.fallbackNS = [n.fallbackNS]), ((t = (e = n.supportedLngs) == null ? void 0 : e.indexOf) == null ? void 0 : t.call(e, "cimode")) < 0 && (n.supportedLngs = n.supportedLngs.concat(["cimode"])), typeof n.initImmediate == "boolean" && (n.initAsync = n.initImmediate), n;
}, tt = () => {
}, Ir = (n) => {
  Object.getOwnPropertyNames(Object.getPrototypeOf(n)).forEach((t) => {
    typeof n[t] == "function" && (n[t] = n[t].bind(n));
  });
};
class Ze extends ht {
  constructor(e = {}, t) {
    if (super(), this.options = En(e), this.services = {}, this.logger = Ne, this.modules = {
      external: []
    }, Ir(this), t && !this.isInitialized && !e.isClone) {
      if (!this.options.initAsync)
        return this.init(e, t), this;
      setTimeout(() => {
        this.init(e, t);
      }, 0);
    }
  }
  init(e = {}, t) {
    this.isInitializing = !0, typeof e == "function" && (t = e, e = {}), e.defaultNS == null && e.ns && (K(e.ns) ? e.defaultNS = e.ns : e.ns.indexOf("translation") < 0 && (e.defaultNS = e.ns[0]));
    const o = Sn();
    this.options = {
      ...o,
      ...this.options,
      ...En(e)
    }, this.options.interpolation = {
      ...o.interpolation,
      ...this.options.interpolation
    }, e.keySeparator !== void 0 && (this.options.userDefinedKeySeparator = e.keySeparator), e.nsSeparator !== void 0 && (this.options.userDefinedNsSeparator = e.nsSeparator);
    const r = (d) => d ? typeof d == "function" ? new d() : d : null;
    if (!this.options.isClone) {
      this.modules.logger ? Ne.init(r(this.modules.logger), this.options) : Ne.init(null, this.options);
      let d;
      this.modules.formatter ? d = this.modules.formatter : d = Ar;
      const f = new $n(this.options);
      this.store = new gn(this.options.resources, this.options);
      const p = this.services;
      p.logger = Ne, p.resourceStore = this.store, p.languageUtils = f, p.pluralResolver = new Rr(f, {
        prepend: this.options.pluralSeparator,
        simplifyPluralSuffix: this.options.simplifyPluralSuffix
      }), this.options.interpolation.format && this.options.interpolation.format !== o.interpolation.format && this.logger.deprecate("init: you are still using the legacy format function, please use the new approach: https://www.i18next.com/translation-function/formatting"), d && (!this.options.interpolation.format || this.options.interpolation.format === o.interpolation.format) && (p.formatter = r(d), p.formatter.init && p.formatter.init(p, this.options), this.options.interpolation.format = p.formatter.format.bind(p.formatter)), p.interpolator = new Lr(this.options), p.utils = {
        hasLoadedNamespace: this.hasLoadedNamespace.bind(this)
      }, p.backendConnector = new Mr(r(this.modules.backend), p.resourceStore, p, this.options), p.backendConnector.on("*", (h, ...m) => {
        this.emit(h, ...m);
      }), this.modules.languageDetector && (p.languageDetector = r(this.modules.languageDetector), p.languageDetector.init && p.languageDetector.init(p, this.options.detection, this.options)), this.modules.i18nFormat && (p.i18nFormat = r(this.modules.i18nFormat), p.i18nFormat.init && p.i18nFormat.init(this)), this.translator = new dt(this.services, this.options), this.translator.on("*", (h, ...m) => {
        this.emit(h, ...m);
      }), this.modules.external.forEach((h) => {
        h.init && h.init(this);
      });
    }
    if (this.format = this.options.interpolation.format, t || (t = tt), this.options.fallbackLng && !this.services.languageDetector && !this.options.lng) {
      const d = this.services.languageUtils.getFallbackCodes(this.options.fallbackLng);
      d.length > 0 && d[0] !== "dev" && (this.options.lng = d[0]);
    }
    !this.services.languageDetector && !this.options.lng && this.logger.warn("init: no languageDetector is used and no lng is defined"), ["getResource", "hasResourceBundle", "getResourceBundle", "getDataByLanguage"].forEach((d) => {
      this[d] = (...f) => this.store[d](...f);
    }), ["addResource", "addResources", "addResourceBundle", "removeResourceBundle"].forEach((d) => {
      this[d] = (...f) => (this.store[d](...f), this);
    });
    const a = qe(), c = () => {
      const d = (f, p) => {
        this.isInitializing = !1, this.isInitialized && !this.initializedStoreOnce && this.logger.warn("init: i18next is already initialized. You should call init just once!"), this.isInitialized = !0, this.options.isClone || this.logger.log("initialized", this.options), this.emit("initialized", this.options), a.resolve(p), t(f, p);
      };
      if (this.languages && !this.isInitialized) return d(null, this.t.bind(this));
      this.changeLanguage(this.options.lng, d);
    };
    return this.options.resources || !this.options.initAsync ? c() : setTimeout(c, 0), a;
  }
  loadResources(e, t = tt) {
    var s, i;
    let o = t;
    const r = K(e) ? e : this.language;
    if (typeof e == "function" && (o = e), !this.options.resources || this.options.partialBundledLanguages) {
      if ((r == null ? void 0 : r.toLowerCase()) === "cimode" && (!this.options.preload || this.options.preload.length === 0)) return o();
      const a = [], c = (d) => {
        if (!d || d === "cimode") return;
        this.services.languageUtils.toResolveHierarchy(d).forEach((p) => {
          p !== "cimode" && a.indexOf(p) < 0 && a.push(p);
        });
      };
      r ? c(r) : this.services.languageUtils.getFallbackCodes(this.options.fallbackLng).forEach((f) => c(f)), (i = (s = this.options.preload) == null ? void 0 : s.forEach) == null || i.call(s, (d) => c(d)), this.services.backendConnector.load(a, this.options.ns, (d) => {
        !d && !this.resolvedLanguage && this.language && this.setResolvedLanguage(this.language), o(d);
      });
    } else
      o(null);
  }
  reloadResources(e, t, o) {
    const r = qe();
    return typeof e == "function" && (o = e, e = void 0), typeof t == "function" && (o = t, t = void 0), e || (e = this.languages), t || (t = this.options.ns), o || (o = tt), this.services.backendConnector.reload(e, t, (s) => {
      r.resolve(), o(s);
    }), r;
  }
  use(e) {
    if (!e) throw new Error("You are passing an undefined module! Please check the object you are passing to i18next.use()");
    if (!e.type) throw new Error("You are passing a wrong module! Please check the object you are passing to i18next.use()");
    return e.type === "backend" && (this.modules.backend = e), (e.type === "logger" || e.log && e.warn && e.error) && (this.modules.logger = e), e.type === "languageDetector" && (this.modules.languageDetector = e), e.type === "i18nFormat" && (this.modules.i18nFormat = e), e.type === "postProcessor" && ao.addPostProcessor(e), e.type === "formatter" && (this.modules.formatter = e), e.type === "3rdParty" && this.modules.external.push(e), this;
  }
  setResolvedLanguage(e) {
    if (!(!e || !this.languages) && !(["cimode", "dev"].indexOf(e) > -1)) {
      for (let t = 0; t < this.languages.length; t++) {
        const o = this.languages[t];
        if (!(["cimode", "dev"].indexOf(o) > -1) && this.store.hasLanguageSomeTranslations(o)) {
          this.resolvedLanguage = o;
          break;
        }
      }
      !this.resolvedLanguage && this.languages.indexOf(e) < 0 && this.store.hasLanguageSomeTranslations(e) && (this.resolvedLanguage = e, this.languages.unshift(e));
    }
  }
  changeLanguage(e, t) {
    this.isLanguageChangingTo = e;
    const o = qe();
    this.emit("languageChanging", e);
    const r = (a) => {
      this.language = a, this.languages = this.services.languageUtils.toResolveHierarchy(a), this.resolvedLanguage = void 0, this.setResolvedLanguage(a);
    }, s = (a, c) => {
      c ? this.isLanguageChangingTo === e && (r(c), this.translator.changeLanguage(c), this.isLanguageChangingTo = void 0, this.emit("languageChanged", c), this.logger.log("languageChanged", c)) : this.isLanguageChangingTo = void 0, o.resolve((...d) => this.t(...d)), t && t(a, (...d) => this.t(...d));
    }, i = (a) => {
      var f, p;
      !e && !a && this.services.languageDetector && (a = []);
      const c = K(a) ? a : a && a[0], d = this.store.hasLanguageSomeTranslations(c) ? c : this.services.languageUtils.getBestMatchFromCodes(K(a) ? [a] : a);
      d && (this.language || r(d), this.translator.language || this.translator.changeLanguage(d), (p = (f = this.services.languageDetector) == null ? void 0 : f.cacheUserLanguage) == null || p.call(f, d)), this.loadResources(d, (g) => {
        s(g, d);
      });
    };
    return !e && this.services.languageDetector && !this.services.languageDetector.async ? i(this.services.languageDetector.detect()) : !e && this.services.languageDetector && this.services.languageDetector.async ? this.services.languageDetector.detect.length === 0 ? this.services.languageDetector.detect().then(i) : this.services.languageDetector.detect(i) : i(e), o;
  }
  getFixedT(e, t, o) {
    const r = (s, i, ...a) => {
      let c;
      typeof i != "object" ? c = this.options.overloadTranslationOptionHandler([s, i].concat(a)) : c = {
        ...i
      }, c.lng = c.lng || r.lng, c.lngs = c.lngs || r.lngs, c.ns = c.ns || r.ns, c.keyPrefix !== "" && (c.keyPrefix = c.keyPrefix || o || r.keyPrefix);
      const d = this.options.keySeparator || ".";
      let f;
      return c.keyPrefix && Array.isArray(s) ? f = s.map((p) => (typeof p == "function" && (p = zt(p, {
        ...this.options,
        ...i
      })), `${c.keyPrefix}${d}${p}`)) : (typeof s == "function" && (s = zt(s, {
        ...this.options,
        ...i
      })), f = c.keyPrefix ? `${c.keyPrefix}${d}${s}` : s), this.t(f, c);
    };
    return K(e) ? r.lng = e : r.lngs = e, r.ns = t, r.keyPrefix = o, r;
  }
  t(...e) {
    var t;
    return (t = this.translator) == null ? void 0 : t.translate(...e);
  }
  exists(...e) {
    var t;
    return (t = this.translator) == null ? void 0 : t.exists(...e);
  }
  setDefaultNamespace(e) {
    this.options.defaultNS = e;
  }
  hasLoadedNamespace(e, t = {}) {
    if (!this.isInitialized)
      return this.logger.warn("hasLoadedNamespace: i18next was not initialized", this.languages), !1;
    if (!this.languages || !this.languages.length)
      return this.logger.warn("hasLoadedNamespace: i18n.languages were undefined or empty", this.languages), !1;
    const o = t.lng || this.resolvedLanguage || this.languages[0], r = this.options ? this.options.fallbackLng : !1, s = this.languages[this.languages.length - 1];
    if (o.toLowerCase() === "cimode") return !0;
    const i = (a, c) => {
      const d = this.services.backendConnector.state[`${a}|${c}`];
      return d === -1 || d === 0 || d === 2;
    };
    if (t.precheck) {
      const a = t.precheck(this, i);
      if (a !== void 0) return a;
    }
    return !!(this.hasResourceBundle(o, e) || !this.services.backendConnector.backend || this.options.resources && !this.options.partialBundledLanguages || i(o, e) && (!r || i(s, e)));
  }
  loadNamespaces(e, t) {
    const o = qe();
    return this.options.ns ? (K(e) && (e = [e]), e.forEach((r) => {
      this.options.ns.indexOf(r) < 0 && this.options.ns.push(r);
    }), this.loadResources((r) => {
      o.resolve(), t && t(r);
    }), o) : (t && t(), Promise.resolve());
  }
  loadLanguages(e, t) {
    const o = qe();
    K(e) && (e = [e]);
    const r = this.options.preload || [], s = e.filter((i) => r.indexOf(i) < 0 && this.services.languageUtils.isSupportedCode(i));
    return s.length ? (this.options.preload = r.concat(s), this.loadResources((i) => {
      o.resolve(), t && t(i);
    }), o) : (t && t(), Promise.resolve());
  }
  dir(e) {
    var r, s;
    if (e || (e = this.resolvedLanguage || (((r = this.languages) == null ? void 0 : r.length) > 0 ? this.languages[0] : this.language)), !e) return "rtl";
    try {
      const i = new Intl.Locale(e);
      if (i && i.getTextInfo) {
        const a = i.getTextInfo();
        if (a && a.direction) return a.direction;
      }
    } catch {
    }
    const t = ["ar", "shu", "sqr", "ssh", "xaa", "yhd", "yud", "aao", "abh", "abv", "acm", "acq", "acw", "acx", "acy", "adf", "ads", "aeb", "aec", "afb", "ajp", "apc", "apd", "arb", "arq", "ars", "ary", "arz", "auz", "avl", "ayh", "ayl", "ayn", "ayp", "bbz", "pga", "he", "iw", "ps", "pbt", "pbu", "pst", "prp", "prd", "ug", "ur", "ydd", "yds", "yih", "ji", "yi", "hbo", "men", "xmn", "fa", "jpr", "peo", "pes", "prs", "dv", "sam", "ckb"], o = ((s = this.services) == null ? void 0 : s.languageUtils) || new $n(Sn());
    return e.toLowerCase().indexOf("-latn") > 1 ? "ltr" : t.indexOf(o.getLanguagePartFromCode(e)) > -1 || e.toLowerCase().indexOf("-arab") > 1 ? "rtl" : "ltr";
  }
  static createInstance(e = {}, t) {
    return new Ze(e, t);
  }
  cloneInstance(e = {}, t = tt) {
    const o = e.forkResourceStore;
    o && delete e.forkResourceStore;
    const r = {
      ...this.options,
      ...e,
      isClone: !0
    }, s = new Ze(r);
    if ((e.debug !== void 0 || e.prefix !== void 0) && (s.logger = s.logger.clone(e)), ["store", "services", "language"].forEach((a) => {
      s[a] = this[a];
    }), s.services = {
      ...this.services
    }, s.services.utils = {
      hasLoadedNamespace: s.hasLoadedNamespace.bind(s)
    }, o) {
      const a = Object.keys(this.store.data).reduce((c, d) => (c[d] = {
        ...this.store.data[d]
      }, c[d] = Object.keys(c[d]).reduce((f, p) => (f[p] = {
        ...c[d][p]
      }, f), c[d]), c), {});
      s.store = new gn(a, r), s.services.resourceStore = s.store;
    }
    return s.translator = new dt(s.services, r), s.translator.on("*", (a, ...c) => {
      s.emit(a, ...c);
    }), s.init(r, t), s.translator.options = r, s.translator.backendConnector.services.utils = {
      hasLoadedNamespace: s.hasLoadedNamespace.bind(s)
    }, s;
  }
  toJSON() {
    return {
      options: this.options,
      store: this.store,
      language: this.language,
      languages: this.languages,
      resolvedLanguage: this.resolvedLanguage
    };
  }
}
const fe = Ze.createInstance();
fe.createInstance = Ze.createInstance;
fe.createInstance;
fe.dir;
fe.init;
fe.loadResources;
fe.reloadResources;
fe.use;
fe.changeLanguage;
fe.getFixedT;
fe.t;
fe.exists;
fe.setDefaultNamespace;
fe.hasLoadedNamespace;
fe.loadNamespaces;
fe.loadLanguages;
const Dr = "مجلد جديد", Ur = "رفع", _r = "لصق", Hr = "تغيير العرض", Vr = "تحديث", Br = "قص", Wr = "نسخ", Yr = "إعادة تسمية", Kr = "تنزيل", qr = "تم تحديد العنصر", Gr = "تم تحديد {{count}} عناصر", Jr = "إلغاء", Xr = "مسح التحديد", Zr = "تم", Qr = "إذا قمت بتغيير امتداد الملف، قد يصبح الملف غير قابل للاستخدام. هل أنت متأكد من أنك تريد تغييره؟", es = "لا", ts = "نعم", ns = "إغلاق", os = "نوع الملف غير مسموح به.", rs = "الملف موجود بالفعل.", ss = "أقصى حجم رفع هو", is = "اسحب الملفات للرفع", as = "اختيار ملف", ls = "فشل الرفع.", cs = "جاري الرفع", ds = "تم الرفع", us = "إزالة", fs = "إلغاء الرفع", ps = "معاينة", hs = "آسف! المعاينة غير متاحة لهذا الملف.", ms = "الصفحة الرئيسية", gs = "عرض المزيد من المجلدات", vs = "نقل إلى", ys = "هذا المجلد فارغ.", $s = "تحديد الكل", xs = "عرض", ws = "شبكة", bs = "قائمة", Cs = "فتح", Ss = "لا شيء هنا بعد", Es = "الاسم", Fs = "تاريخ التعديل", js = "الحجم", Ns = 'هل أنت متأكد أنك تريد حذف "{{fileName}}"؟', Ps = "هل أنت متأكد أنك تريد حذف هذه العناصر {{count}}؟", Ts = "{{percent}}% تم", Rs = "تم الإلغاء", Ls = 'لا يمكن أن يحتوي اسم الملف على أي من الحروف التالية: \\ / : * ? " < > |', Os = 'هذا الموقع يحتوي بالفعل على مجلد باسم "{{renameFile}}".', ks = "طي لوحة التنقل", As = "توسيع لوحة التنقل", zs = {
  newFolder: Dr,
  upload: Ur,
  paste: _r,
  changeView: Hr,
  refresh: Vr,
  cut: Br,
  copy: Wr,
  rename: Yr,
  download: Kr,
  delete: "حذف",
  itemSelected: qr,
  itemsSelected: Gr,
  cancel: Jr,
  clearSelection: Xr,
  completed: Zr,
  fileNameChangeWarning: Qr,
  no: es,
  yes: ts,
  close: ns,
  fileTypeNotAllowed: os,
  fileAlreadyExist: rs,
  maxUploadSize: ss,
  dragFileToUpload: is,
  chooseFile: as,
  uploadFail: ls,
  uploading: cs,
  uploaded: ds,
  remove: us,
  abortUpload: fs,
  preview: ps,
  previewUnavailable: hs,
  home: ms,
  showMoreFolder: gs,
  moveTo: vs,
  folderEmpty: ys,
  selectAll: $s,
  view: xs,
  grid: ws,
  list: bs,
  open: Cs,
  nothingHereYet: Ss,
  name: Es,
  modified: Fs,
  size: js,
  deleteItemConfirm: Ns,
  deleteItemsConfirm: Ps,
  percentDone: Ts,
  canceled: Rs,
  invalidFileName: Ls,
  folderExists: Os,
  collapseNavigationPane: ks,
  expandNavigationPane: As
}, Ms = "Neuer Ordner", Is = "Hochladen", Ds = "Einfügen", Us = "Ansicht ändern", _s = "Aktualisieren", Hs = "Ausschneiden", Vs = "Kopieren", Bs = "Umbenennen", Ws = "Herunterladen", Ys = "Element ausgewählt", Ks = "Elemente ausgewählt", qs = "Abbrechen", Gs = "Auswahl aufheben", Js = "Abgeschlossen", Xs = "Wenn Sie die Dateierweiterung ändern, kann die Datei unbrauchbar werden. Möchten Sie das wirklich tun?", Zs = "Nein", Qs = "Ja", ei = "Schließen", ti = "Dateityp nicht erlaubt.", ni = "Datei existiert bereits.", oi = "Maximale Uploadgröße ist", ri = "Dateien zum Hochladen ziehen", si = "Datei auswählen", ii = "Hochladen fehlgeschlagen.", ai = "Wird hochgeladen", li = "Hochgeladen", ci = "Entfernen", di = "Upload abbrechen", ui = "Vorschau", fi = "Leider ist keine Vorschau für diese Datei verfügbar.", pi = "Startseite", hi = "Mehr Ordner anzeigen", mi = "Verschieben nach", gi = "Dieser Ordner ist leer.", vi = "Alle auswählen", yi = "Ansicht", $i = "Raster", xi = "Liste", wi = "Öffnen", bi = "Hier ist noch nichts", Ci = "Name", Si = "Geändert", Ei = "Größe", Fi = 'Möchten Sie "{{fileName}}" wirklich löschen?', ji = "Möchten Sie diese {{count}} Elemente wirklich löschen?", Ni = "{{percent}}% erledigt", Pi = "Abgebrochen", Ti = 'Ein Dateiname darf keines der folgenden Zeichen enthalten: \\ / : * ? " < > |', Ri = 'In diesem Zielordner gibt es bereits einen Ordner namens "{{renameFile}}".', Li = "Navigationsbereich einklappen", Oi = "Navigationsbereich erweitern", ki = {
  newFolder: Ms,
  upload: Is,
  paste: Ds,
  changeView: Us,
  refresh: _s,
  cut: Hs,
  copy: Vs,
  rename: Bs,
  download: Ws,
  delete: "Löschen",
  itemSelected: Ys,
  itemsSelected: Ks,
  cancel: qs,
  clearSelection: Gs,
  completed: Js,
  fileNameChangeWarning: Xs,
  no: Zs,
  yes: Qs,
  close: ei,
  fileTypeNotAllowed: ti,
  fileAlreadyExist: ni,
  maxUploadSize: oi,
  dragFileToUpload: ri,
  chooseFile: si,
  uploadFail: ii,
  uploading: ai,
  uploaded: li,
  remove: ci,
  abortUpload: di,
  preview: ui,
  previewUnavailable: fi,
  home: pi,
  showMoreFolder: hi,
  moveTo: mi,
  folderEmpty: gi,
  selectAll: vi,
  view: yi,
  grid: $i,
  list: xi,
  open: wi,
  nothingHereYet: bi,
  name: Ci,
  modified: Si,
  size: Ei,
  deleteItemConfirm: Fi,
  deleteItemsConfirm: ji,
  percentDone: Ni,
  canceled: Pi,
  invalidFileName: Ti,
  folderExists: Ri,
  collapseNavigationPane: Li,
  expandNavigationPane: Oi
}, Ai = "New Folder", zi = "Upload", Mi = "Paste", Ii = "Change View", Di = "Refresh", Ui = "Cut", _i = "Copy", Hi = "Rename", Vi = "Download", Bi = "item selected", Wi = "items selected", Yi = "Cancel", Ki = "Clear Selection", qi = "Completed", Gi = "If you change a file name extension, the file might become unusable. Are you sure you want to change it?", Ji = "No", Xi = "Yes", Zi = "Close", Qi = "File type is not allowed.", ea = "File already exists.", ta = "Maximum upload size is", na = "Drag files to upload", oa = "Choose File", ra = "Upload failed.", sa = "Uploading", ia = "Uploaded", aa = "Remove", la = "Abort Upload", ca = "Preview", da = "Sorry! Preview is not available for this file.", ua = "Home", fa = "Show more folders", pa = "Move to", ha = "This folder is empty.", ma = "Select all", ga = "View", va = "Grid", ya = "List", $a = "Open", xa = "Nothing here yet", wa = "Name", ba = "Modified", Ca = "Size", Sa = 'Are you sure you want to delete "{{fileName}}"?', Ea = "Are you sure you want to delete these {{count}} items?", Fa = "{{percent}}% done", ja = "Canceled", Na = `A file name can't contain any of the following characters: \\ / : * ? " < > |`, Pa = 'This destination already contains a folder named "{{renameFile}}".', Ta = "Collapse Navigation Pane", Ra = "Expand Navigation Pane", La = {
  newFolder: Ai,
  upload: zi,
  paste: Mi,
  changeView: Ii,
  refresh: Di,
  cut: Ui,
  copy: _i,
  rename: Hi,
  download: Vi,
  delete: "Delete",
  itemSelected: Bi,
  itemsSelected: Wi,
  cancel: Yi,
  clearSelection: Ki,
  completed: qi,
  fileNameChangeWarning: Gi,
  no: Ji,
  yes: Xi,
  close: Zi,
  fileTypeNotAllowed: Qi,
  fileAlreadyExist: ea,
  maxUploadSize: ta,
  dragFileToUpload: na,
  chooseFile: oa,
  uploadFail: ra,
  uploading: sa,
  uploaded: ia,
  remove: aa,
  abortUpload: la,
  preview: ca,
  previewUnavailable: da,
  home: ua,
  showMoreFolder: fa,
  moveTo: pa,
  folderEmpty: ha,
  selectAll: ma,
  view: ga,
  grid: va,
  list: ya,
  open: $a,
  nothingHereYet: xa,
  name: wa,
  modified: ba,
  size: Ca,
  deleteItemConfirm: Sa,
  deleteItemsConfirm: Ea,
  percentDone: Fa,
  canceled: ja,
  invalidFileName: Na,
  folderExists: Pa,
  collapseNavigationPane: Ta,
  expandNavigationPane: Ra
}, Oa = "Nueva carpeta", ka = "Subir", Aa = "Pegar", za = "Cambiar vista", Ma = "Actualizar", Ia = "Cortar", Da = "Copiar", Ua = "Renombrar", _a = "Descargar", Ha = "elemento seleccionado", Va = "elementos seleccionados", Ba = "Cancelar", Wa = "Borrar selección", Ya = "Completado", Ka = "Si cambia la extensión del archivo, es posible que no funcione. ¿Está seguro de que desea cambiarla?", qa = "No", Ga = "Sí", Ja = "Cerrar", Xa = "Tipo de archivo no permitido.", Za = "El archivo ya existe.", Qa = "El tamaño máximo de subida es", el = "Arrastre archivos para subir", tl = "Elegir archivo", nl = "Error al subir.", ol = "Subiendo", rl = "Subido", sl = "Eliminar", il = "Cancelar subida", al = "Vista previa", ll = "¡Lo sentimos! No hay vista previa disponible para este archivo.", cl = "Inicio", dl = "Mostrar más carpetas", ul = "Mover a", fl = "Esta carpeta está vacía.", pl = "Seleccionar todo", hl = "Vista", ml = "Cuadrícula", gl = "Lista", vl = "Abrir", yl = "Nada por aquí aún", $l = "Nombre", xl = "Modificado", wl = "Tamaño", bl = '¿Está seguro de que desea eliminar "{{fileName}}"?', Cl = "¿Está seguro de que desea eliminar estos {{count}} elementos?", Sl = "{{percent}}% completado", El = "Cancelado", Fl = 'Un nombre de archivo no puede contener ninguno de los siguientes caracteres: \\ / : * ? " < > |', jl = 'Ya existe una carpeta llamada "{{renameFile}}" en este destino.', Nl = "Contraer panel de navegación", Pl = "Expandir panel de navegación", Tl = {
  newFolder: Oa,
  upload: ka,
  paste: Aa,
  changeView: za,
  refresh: Ma,
  cut: Ia,
  copy: Da,
  rename: Ua,
  download: _a,
  delete: "Eliminar",
  itemSelected: Ha,
  itemsSelected: Va,
  cancel: Ba,
  clearSelection: Wa,
  completed: Ya,
  fileNameChangeWarning: Ka,
  no: qa,
  yes: Ga,
  close: Ja,
  fileTypeNotAllowed: Xa,
  fileAlreadyExist: Za,
  maxUploadSize: Qa,
  dragFileToUpload: el,
  chooseFile: tl,
  uploadFail: nl,
  uploading: ol,
  uploaded: rl,
  remove: sl,
  abortUpload: il,
  preview: al,
  previewUnavailable: ll,
  home: cl,
  showMoreFolder: dl,
  moveTo: ul,
  folderEmpty: fl,
  selectAll: pl,
  view: hl,
  grid: ml,
  list: gl,
  open: vl,
  nothingHereYet: yl,
  name: $l,
  modified: xl,
  size: wl,
  deleteItemConfirm: bl,
  deleteItemsConfirm: Cl,
  percentDone: Sl,
  canceled: El,
  invalidFileName: Fl,
  folderExists: jl,
  collapseNavigationPane: Nl,
  expandNavigationPane: Pl
}, Rl = "Nouveau dossier", Ll = "Téléverser", Ol = "Coller", kl = "Changer la vue", Al = "Rafraîchir", zl = "Couper", Ml = "Copier", Il = "Renommer", Dl = "Télécharger", Ul = "élément sélectionné", _l = "éléments sélectionnés", Hl = "Annuler", Vl = "Effacer la sélection", Bl = "Terminé", Wl = "Si vous modifiez l'extension d'un fichier, celui-ci pourrait devenir inutilisable. Êtes-vous sûr de vouloir le modifier ?", Yl = "Non", Kl = "Oui", ql = "Fermer", Gl = "Type de fichier non autorisé.", Jl = "Le fichier existe déjà.", Xl = "La taille maximale de téléversement est", Zl = "Glissez les fichiers à téléverser", Ql = "Choisir un fichier", ec = "Échec du téléversement.", tc = "Téléversement en cours", nc = "Téléversé", oc = "Supprimer", rc = "Annuler le téléversement", sc = "Aperçu", ic = "Désolé ! L'aperçu n'est pas disponible pour ce fichier.", ac = "Accueil", lc = "Afficher plus de dossiers", cc = "Déplacer vers", dc = "Ce dossier est vide.", uc = "Tout sélectionner", fc = "Vue", pc = "Grille", hc = "Liste", mc = "Ouvrir", gc = "Rien ici pour le moment", vc = "Nom", yc = "Modifié", $c = "Taille", xc = 'Êtes-vous sûr de vouloir supprimer "{{fileName}}" ?', wc = "Êtes-vous sûr de vouloir supprimer ces {{count}} éléments ?", bc = "{{percent}}% terminé", Cc = "Annulé", Sc = 'Un nom de fichier ne peut pas contenir les caractères suivants : \\ / : * ? " < > |', Ec = 'Cette destination contient déjà un dossier nommé "{{renameFile}}".', Fc = "Réduire le panneau de navigation", jc = "Développer le panneau de navigation", Nc = {
  newFolder: Rl,
  upload: Ll,
  paste: Ol,
  changeView: kl,
  refresh: Al,
  cut: zl,
  copy: Ml,
  rename: Il,
  download: Dl,
  delete: "Supprimer",
  itemSelected: Ul,
  itemsSelected: _l,
  cancel: Hl,
  clearSelection: Vl,
  completed: Bl,
  fileNameChangeWarning: Wl,
  no: Yl,
  yes: Kl,
  close: ql,
  fileTypeNotAllowed: Gl,
  fileAlreadyExist: Jl,
  maxUploadSize: Xl,
  dragFileToUpload: Zl,
  chooseFile: Ql,
  uploadFail: ec,
  uploading: tc,
  uploaded: nc,
  remove: oc,
  abortUpload: rc,
  preview: sc,
  previewUnavailable: ic,
  home: ac,
  showMoreFolder: lc,
  moveTo: cc,
  folderEmpty: dc,
  selectAll: uc,
  view: fc,
  grid: pc,
  list: hc,
  open: mc,
  nothingHereYet: gc,
  name: vc,
  modified: yc,
  size: $c,
  deleteItemConfirm: xc,
  deleteItemsConfirm: wc,
  percentDone: bc,
  canceled: Cc,
  invalidFileName: Sc,
  folderExists: Ec,
  collapseNavigationPane: Fc,
  expandNavigationPane: jc
}, Pc = "תיקייה חדשה", Tc = "העלה", Rc = "הדבק", Lc = "שנה תצוגה", Oc = "רענן", kc = "גזור", Ac = "העתק", zc = "שנה שם", Mc = "הורד", Ic = "פריט נבחר", Dc = "פריטים נבחרו", Uc = "בטל", _c = "נקה בחירה", Hc = "הושלם", Vc = "אם תשנה את סיומת הקובץ, הקובץ עלול להפוך לבלתי שמיש. האם אתה בטוח שברצונך לשנות זאת?", Bc = "לא", Wc = "כן", Yc = "סגור", Kc = "סוג הקובץ אינו מורשה.", qc = "הקובץ כבר קיים.", Gc = "גודל העלאה מקסימלי הוא", Jc = "גרור קבצים להעלאה", Xc = "בחר קובץ", Zc = "ההעלאה נכשלה.", Qc = "מעלה...", ed = "הועלה", td = "הסר", nd = "בטל העלאה", od = "תצוגה מקדימה", rd = "מצטערים! אין תצוגה מקדימה זמינה לקובץ זה.", sd = "דף הבית", id = "הצג תיקיות נוספות", ad = "העבר ל", ld = "התיקייה ריקה.", cd = "בחר הכל", dd = "תצוגה", ud = "רשת", fd = "רשימה", pd = "פתח", hd = "אין כאן כלום עדיין", md = "שם", gd = "שונה", vd = "גודל", yd = 'האם אתה בטוח שברצונך למחוק את "{{fileName}}"?', $d = "האם אתה בטוח שברצונך למחוק את {{count}} הפריטים האלו?", xd = "{{percent}}% הושלמו", wd = "בוטל", bd = 'שם קובץ לא יכול להכיל את התווים הבאים: \\ / : * ? " < > |', Cd = 'כבר קיימת תיקייה בשם "{{renameFile}}" במיקום זה.', Sd = "כווץ את לוח הניווט", Ed = "הרחב את לוח הניווט", Fd = {
  newFolder: Pc,
  upload: Tc,
  paste: Rc,
  changeView: Lc,
  refresh: Oc,
  cut: kc,
  copy: Ac,
  rename: zc,
  download: Mc,
  delete: "מחק",
  itemSelected: Ic,
  itemsSelected: Dc,
  cancel: Uc,
  clearSelection: _c,
  completed: Hc,
  fileNameChangeWarning: Vc,
  no: Bc,
  yes: Wc,
  close: Yc,
  fileTypeNotAllowed: Kc,
  fileAlreadyExist: qc,
  maxUploadSize: Gc,
  dragFileToUpload: Jc,
  chooseFile: Xc,
  uploadFail: Zc,
  uploading: Qc,
  uploaded: ed,
  remove: td,
  abortUpload: nd,
  preview: od,
  previewUnavailable: rd,
  home: sd,
  showMoreFolder: id,
  moveTo: ad,
  folderEmpty: ld,
  selectAll: cd,
  view: dd,
  grid: ud,
  list: fd,
  open: pd,
  nothingHereYet: hd,
  name: md,
  modified: gd,
  size: vd,
  deleteItemConfirm: yd,
  deleteItemsConfirm: $d,
  percentDone: xd,
  canceled: wd,
  invalidFileName: bd,
  folderExists: Cd,
  collapseNavigationPane: Sd,
  expandNavigationPane: Ed
}, jd = "नया फ़ोल्डर", Nd = "अपलोड करें", Pd = "पेस्ट करें", Td = "दृश्य बदलें", Rd = "रिफ्रेश करें", Ld = "काटें", Od = "कॉपी करें", kd = "नाम बदलें", Ad = "डाउनलोड करें", zd = "आइटम चुना गया", Md = "आइटम्स चुने गए", Id = "रद्द करें", Dd = "चयन साफ़ करें", Ud = "पूर्ण हुआ", _d = "यदि आप फ़ाइल नाम एक्सटेंशन बदलते हैं, तो फ़ाइल अनुपयोगी हो सकती है। क्या आप वाकई इसे बदलना चाहते हैं?", Hd = "नहीं", Vd = "हाँ", Bd = "बंद करें", Wd = "फ़ाइल प्रकार की अनुमति नहीं है।", Yd = "फ़ाइल पहले से मौजूद है।", Kd = "अधिकतम अपलोड आकार है", qd = "अपलोड करने के लिए फ़ाइलें खींचें", Gd = "फ़ाइल चुनें", Jd = "अपलोड विफल रहा।", Xd = "अपलोड हो रहा है", Zd = "अपलोड हो गया", Qd = "हटाएं", eu = "अपलोड रोकें", tu = "पूर्वावलोकन", nu = "माफ़ कीजिए! इस फ़ाइल के लिए पूर्वावलोकन उपलब्ध नहीं है।", ou = "होम", ru = "और फ़ोल्डर दिखाएँ", su = "इसमें ले जाएँ", iu = "यह फ़ोल्डर खाली है।", au = "सभी का चयन करें", lu = "दृश्य", cu = "ग्रिड", du = "सूची", uu = "खोलें", fu = "यहाँ अभी कुछ नहीं है", pu = "नाम", hu = "परिवर्तित", mu = "आकार", gu = 'क्या आप वाकई "{{fileName}}" को हटाना चाहते हैं?', vu = "क्या आप वाकई इन {{count}} आइटम्स को हटाना चाहते हैं?", yu = "{{percent}}% पूर्ण", $u = "रद्द किया गया", xu = 'फ़ाइल नाम में निम्नलिखित वर्ण नहीं हो सकते: \\ / : * ? " < > |', wu = 'इस स्थान पर "{{renameFile}}" नाम का एक फ़ोल्डर पहले से मौजूद है।', bu = "नेविगेशन पैन को संकुचित करें", Cu = "नेविगेशन पैन को विस्तारित करें", Su = {
  newFolder: jd,
  upload: Nd,
  paste: Pd,
  changeView: Td,
  refresh: Rd,
  cut: Ld,
  copy: Od,
  rename: kd,
  download: Ad,
  delete: "हटाएं",
  itemSelected: zd,
  itemsSelected: Md,
  cancel: Id,
  clearSelection: Dd,
  completed: Ud,
  fileNameChangeWarning: _d,
  no: Hd,
  yes: Vd,
  close: Bd,
  fileTypeNotAllowed: Wd,
  fileAlreadyExist: Yd,
  maxUploadSize: Kd,
  dragFileToUpload: qd,
  chooseFile: Gd,
  uploadFail: Jd,
  uploading: Xd,
  uploaded: Zd,
  remove: Qd,
  abortUpload: eu,
  preview: tu,
  previewUnavailable: nu,
  home: ou,
  showMoreFolder: ru,
  moveTo: su,
  folderEmpty: iu,
  selectAll: au,
  view: lu,
  grid: cu,
  list: du,
  open: uu,
  nothingHereYet: fu,
  name: pu,
  modified: hu,
  size: mu,
  deleteItemConfirm: gu,
  deleteItemsConfirm: vu,
  percentDone: yu,
  canceled: $u,
  invalidFileName: xu,
  folderExists: wu,
  collapseNavigationPane: bu,
  expandNavigationPane: Cu
}, Eu = "Nuova cartella", Fu = "Carica", ju = "Incolla", Nu = "Cambia vista", Pu = "Ricarica", Tu = "Taglia", Ru = "Copia", Lu = "Rinomina", Ou = "Scarica", ku = "elemento selezionato", Au = "elementi selezionati", zu = "Annulla", Mu = "Pulisci selezione", Iu = "Completato", Du = "Se cambi l'estensione del file, potrebbe diventare inutilizzabile. Sei sicuro di volerlo fare?", Uu = "No", _u = "Sì", Hu = "Chiudi", Vu = "Tipo di file non consentito.", Bu = "Il file esiste già.", Wu = "La dimensione massima di caricamento è", Yu = "Trascina i file per caricarli", Ku = "Scegli file", qu = "Caricamento fallito.", Gu = "Caricamento in corso", Ju = "Caricato", Xu = "Rimuovi", Zu = "Annulla caricamento", Qu = "Anteprima", ef = "Spiacenti! L'anteprima non è disponibile per questo file.", tf = "Home", nf = "Mostra altre cartelle", of = "Sposta in", rf = "Questa cartella è vuota.", sf = "Seleziona tutto", af = "Vista", lf = "Griglia", cf = "Lista", df = "Apri", uf = "Niente qui per ora", ff = "Nome", pf = "Modificato", hf = "Dimensione", mf = 'Sei sicuro di voler eliminare "{{fileName}}"?', gf = "Sei sicuro di voler eliminare questi {{count}} elementi?", vf = "{{percent}}% completato", yf = "Annullato", $f = 'Un nome di file non può contenere nessuno dei seguenti caratteri: \\ / : * ? " < > |', xf = 'Questa destinazione contiene già una cartella chiamata "{{renameFile}}".', wf = "Comprimi pannello di navigazione", bf = "Espandi pannello di navigazione", Cf = {
  newFolder: Eu,
  upload: Fu,
  paste: ju,
  changeView: Nu,
  refresh: Pu,
  cut: Tu,
  copy: Ru,
  rename: Lu,
  download: Ou,
  delete: "Elimina",
  itemSelected: ku,
  itemsSelected: Au,
  cancel: zu,
  clearSelection: Mu,
  completed: Iu,
  fileNameChangeWarning: Du,
  no: Uu,
  yes: _u,
  close: Hu,
  fileTypeNotAllowed: Vu,
  fileAlreadyExist: Bu,
  maxUploadSize: Wu,
  dragFileToUpload: Yu,
  chooseFile: Ku,
  uploadFail: qu,
  uploading: Gu,
  uploaded: Ju,
  remove: Xu,
  abortUpload: Zu,
  preview: Qu,
  previewUnavailable: ef,
  home: tf,
  showMoreFolder: nf,
  moveTo: of,
  folderEmpty: rf,
  selectAll: sf,
  view: af,
  grid: lf,
  list: cf,
  open: df,
  nothingHereYet: uf,
  name: ff,
  modified: pf,
  size: hf,
  deleteItemConfirm: mf,
  deleteItemsConfirm: gf,
  percentDone: vf,
  canceled: yf,
  invalidFileName: $f,
  folderExists: xf,
  collapseNavigationPane: wf,
  expandNavigationPane: bf
}, Sf = "新しいフォルダー", Ef = "アップロード", Ff = "貼り付け", jf = "ビューを変更", Nf = "更新", Pf = "切り取り", Tf = "コピー", Rf = "名前変更", Lf = "ダウンロード", Of = "アイテムが選択されました", kf = "{{count}} アイテムが選択されました", Af = "キャンセル", zf = "選択をクリア", Mf = "完了", If = "ファイル拡張子を変更すると、ファイルが使えなくなる場合があります。本当に変更しますか？", Df = "いいえ", Uf = "はい", _f = "閉じる", Hf = "ファイルタイプは許可されていません。", Vf = "ファイルはすでに存在します。", Bf = "最大アップロードサイズは", Wf = "ファイルをドラッグしてアップロード", Yf = "ファイルを選択", Kf = "アップロード失敗。", qf = "アップロード中", Gf = "アップロード済み", Jf = "削除", Xf = "アップロード中止", Zf = "プレビュー", Qf = "申し訳ありません！このファイルのプレビューは利用できません。", ep = "ホーム", tp = "さらにフォルダーを表示", np = "移動先", op = "このフォルダーは空です。", rp = "すべて選択", sp = "ビュー", ip = "グリッド", ap = "リスト", lp = "開く", cp = "まだ何もありません", dp = "名前", up = "修正日", fp = "サイズ", pp = '"{{fileName}}" を削除してもよろしいですか？', hp = "{{count}} 件のアイテムを削除してもよろしいですか？", mp = "{{percent}}% 完了", gp = "キャンセルしました", vp = 'ファイル名には以下の文字を含めることはできません：\\ / : * ? " < > |', yp = 'この宛先には "{{renameFile}}" という名前のフォルダーがすでに存在します。', $p = "ナビゲーションペインを折りたたむ", xp = "ナビゲーションペインを展開", wp = {
  newFolder: Sf,
  upload: Ef,
  paste: Ff,
  changeView: jf,
  refresh: Nf,
  cut: Pf,
  copy: Tf,
  rename: Rf,
  download: Lf,
  delete: "削除",
  itemSelected: Of,
  itemsSelected: kf,
  cancel: Af,
  clearSelection: zf,
  completed: Mf,
  fileNameChangeWarning: If,
  no: Df,
  yes: Uf,
  close: _f,
  fileTypeNotAllowed: Hf,
  fileAlreadyExist: Vf,
  maxUploadSize: Bf,
  dragFileToUpload: Wf,
  chooseFile: Yf,
  uploadFail: Kf,
  uploading: qf,
  uploaded: Gf,
  remove: Jf,
  abortUpload: Xf,
  preview: Zf,
  previewUnavailable: Qf,
  home: ep,
  showMoreFolder: tp,
  moveTo: np,
  folderEmpty: op,
  selectAll: rp,
  view: sp,
  grid: ip,
  list: ap,
  open: lp,
  nothingHereYet: cp,
  name: dp,
  modified: up,
  size: fp,
  deleteItemConfirm: pp,
  deleteItemsConfirm: hp,
  percentDone: mp,
  canceled: gp,
  invalidFileName: vp,
  folderExists: yp,
  collapseNavigationPane: $p,
  expandNavigationPane: xp
}, bp = "새 폴더", Cp = "업로드", Sp = "붙여넣기", Ep = "보기 변경", Fp = "새로 고침", jp = "잘라내기", Np = "복사", Pp = "이름 바꾸기", Tp = "다운로드", Rp = "항목 선택됨", Lp = "개 항목 선택됨", Op = "취소", kp = "선택 지우기", Ap = "완료됨", zp = "파일 확장자를 변경하면 사용할 수 없게 될 수 있습니다. 정말로 변경하시겠습니까?", Mp = "아니오", Ip = "예", Dp = "닫기", Up = "허용되지 않는 파일 형식입니다.", _p = "파일이 이미 존재합니다.", Hp = "최대 업로드 크기", Vp = "업로드하려면 파일을 끌어오세요", Bp = "파일 선택", Wp = "업로드 실패", Yp = "업로드 중", Kp = "업로드 완료", qp = "제거", Gp = "업로드 중단", Jp = "미리보기", Xp = "죄송합니다! 이 파일은 미리보기를 제공하지 않습니다.", Zp = "홈", Qp = "더 많은 폴더 보기", eh = "이동", th = "이 폴더는 비어 있습니다.", nh = "전체 선택", oh = "보기", rh = "그리드", sh = "목록", ih = "열기", ah = "아직 아무것도 없습니다", lh = "이름", ch = "수정됨", dh = "크기", uh = '"{{fileName}}" 파일을 삭제하시겠습니까?', fh = "{{count}}개의 항목을 삭제하시겠습니까?", ph = "{{percent}}% 완료", hh = "취소됨", mh = '파일 이름에는 다음 문자를 사용할 수 없습니다: \\ / : * ? " < > |', gh = '해당 위치에 "{{renameFile}}" 폴더가 이미 있습니다.', vh = "탐색 창 축소", yh = "탐색 창 확장", $h = {
  newFolder: bp,
  upload: Cp,
  paste: Sp,
  changeView: Ep,
  refresh: Fp,
  cut: jp,
  copy: Np,
  rename: Pp,
  download: Tp,
  delete: "삭제",
  itemSelected: Rp,
  itemsSelected: Lp,
  cancel: Op,
  clearSelection: kp,
  completed: Ap,
  fileNameChangeWarning: zp,
  no: Mp,
  yes: Ip,
  close: Dp,
  fileTypeNotAllowed: Up,
  fileAlreadyExist: _p,
  maxUploadSize: Hp,
  dragFileToUpload: Vp,
  chooseFile: Bp,
  uploadFail: Wp,
  uploading: Yp,
  uploaded: Kp,
  remove: qp,
  abortUpload: Gp,
  preview: Jp,
  previewUnavailable: Xp,
  home: Zp,
  showMoreFolder: Qp,
  moveTo: eh,
  folderEmpty: th,
  selectAll: nh,
  view: oh,
  grid: rh,
  list: sh,
  open: ih,
  nothingHereYet: ah,
  name: lh,
  modified: ch,
  size: dh,
  deleteItemConfirm: uh,
  deleteItemsConfirm: fh,
  percentDone: ph,
  canceled: hh,
  invalidFileName: mh,
  folderExists: gh,
  collapseNavigationPane: vh,
  expandNavigationPane: yh
}, xh = "Nova pasta", wh = "Carregar", bh = "Colar", Ch = "Alterar visualização", Sh = "Atualizar", Eh = "Cortar", Fh = "Copiar", jh = "Renomear", Nh = "Baixar", Ph = "item selecionado", Th = "itens selecionados", Rh = "Cancelar", Lh = "Limpar seleção", Oh = "Concluído", kh = "Se você alterar a extensão do arquivo, ele pode se tornar inutilizável. Tem certeza de que deseja fazer isso?", Ah = "Não", zh = "Sim", Mh = "Fechar", Ih = "Tipo de arquivo não permitido.", Dh = "Arquivo já existe.", Uh = "Tamanho máximo de upload é", _h = "Arraste os arquivos para carregar", Hh = "Escolher arquivo", Vh = "Falha no upload.", Bh = "Carregando", Wh = "Carregado", Yh = "Remover", Kh = "Abortar upload", qh = "Visualizar", Gh = "Desculpe! Não há visualização disponível para este arquivo.", Jh = "Início", Xh = "Mostrar mais pastas", Zh = "Mover para", Qh = "Esta pasta está vazia.", em = "Selecionar tudo", tm = "Visualização", nm = "Grade", om = "Lista", rm = "Abrir", sm = "Nada aqui ainda", im = "Nome", am = "Modificado", lm = "Tamanho", cm = 'Tem certeza de que deseja excluir "{{fileName}}"?', dm = "Tem certeza de que deseja excluir esses {{count}} itens?", um = "{{percent}}% concluído", fm = "Cancelado", pm = 'Um nome de arquivo não pode conter nenhum dos seguintes caracteres: \\ / : * ? " < > |', hm = 'Já existe uma pasta com o nome "{{renameFile}}" neste local.', mm = "Recolher painel de navegação", gm = "Expandir painel de navegação", vm = {
  newFolder: xh,
  upload: wh,
  paste: bh,
  changeView: Ch,
  refresh: Sh,
  cut: Eh,
  copy: Fh,
  rename: jh,
  download: Nh,
  delete: "Excluir",
  itemSelected: Ph,
  itemsSelected: Th,
  cancel: Rh,
  clearSelection: Lh,
  completed: Oh,
  fileNameChangeWarning: kh,
  no: Ah,
  yes: zh,
  close: Mh,
  fileTypeNotAllowed: Ih,
  fileAlreadyExist: Dh,
  maxUploadSize: Uh,
  dragFileToUpload: _h,
  chooseFile: Hh,
  uploadFail: Vh,
  uploading: Bh,
  uploaded: Wh,
  remove: Yh,
  abortUpload: Kh,
  preview: qh,
  previewUnavailable: Gh,
  home: Jh,
  showMoreFolder: Xh,
  moveTo: Zh,
  folderEmpty: Qh,
  selectAll: em,
  view: tm,
  grid: nm,
  list: om,
  open: rm,
  nothingHereYet: sm,
  name: im,
  modified: am,
  size: lm,
  deleteItemConfirm: cm,
  deleteItemsConfirm: dm,
  percentDone: um,
  canceled: fm,
  invalidFileName: pm,
  folderExists: hm,
  collapseNavigationPane: mm,
  expandNavigationPane: gm
}, ym = "Новая папка", $m = "Загрузить", xm = "Вставить", wm = "Изменить вид", bm = "Обновить", Cm = "Вырезать", Sm = "Копировать", Em = "Переименовать", Fm = "Скачать", jm = "выбран элемент", Nm = "выбрано {{count}} элементов", Pm = "Отменить", Tm = "Очистить выбор", Rm = "Завершено", Lm = "Если вы измените расширение файла, файл может стать неисправным. Вы уверены, что хотите изменить его?", Om = "Нет", km = "Да", Am = "Закрыть", zm = "Тип файла не разрешен.", Mm = "Файл уже существует.", Im = "Максимальный размер загрузки:", Dm = "Перетащите файлы для загрузки", Um = "Выбрать файл", _m = "Загрузка не удалась.", Hm = "Загрузка", Vm = "Загружено", Bm = "Удалить", Wm = "Прервать загрузку", Ym = "Предпросмотр", Km = "Извините! Предпросмотр для этого файла недоступен.", qm = "Главная", Gm = "Показать больше папок", Jm = "Переместить в", Xm = "Эта папка пуста.", Zm = "Выбрать все", Qm = "Вид", e1 = "Сетка", t1 = "Список", n1 = "Открыть", o1 = "Здесь еще ничего нет", r1 = "Имя", s1 = "Изменено", i1 = "Размер", a1 = 'Вы уверены, что хотите удалить "{{fileName}}"?', l1 = "Вы уверены, что хотите удалить эти {{count}} элементы?", c1 = "{{percent}}% завершено", d1 = "Отменено", u1 = 'Имя файла не может содержать следующие символы: \\ / : * ? " < > |', f1 = 'В этом местоположении уже существует папка с именем "{{renameFile}}".', p1 = "Свернуть панель навигации", h1 = "Развернуть панель навигации", m1 = {
  newFolder: ym,
  upload: $m,
  paste: xm,
  changeView: wm,
  refresh: bm,
  cut: Cm,
  copy: Sm,
  rename: Em,
  download: Fm,
  delete: "Удалить",
  itemSelected: jm,
  itemsSelected: Nm,
  cancel: Pm,
  clearSelection: Tm,
  completed: Rm,
  fileNameChangeWarning: Lm,
  no: Om,
  yes: km,
  close: Am,
  fileTypeNotAllowed: zm,
  fileAlreadyExist: Mm,
  maxUploadSize: Im,
  dragFileToUpload: Dm,
  chooseFile: Um,
  uploadFail: _m,
  uploading: Hm,
  uploaded: Vm,
  remove: Bm,
  abortUpload: Wm,
  preview: Ym,
  previewUnavailable: Km,
  home: qm,
  showMoreFolder: Gm,
  moveTo: Jm,
  folderEmpty: Xm,
  selectAll: Zm,
  view: Qm,
  grid: e1,
  list: t1,
  open: n1,
  nothingHereYet: o1,
  name: r1,
  modified: s1,
  size: i1,
  deleteItemConfirm: a1,
  deleteItemsConfirm: l1,
  percentDone: c1,
  canceled: d1,
  invalidFileName: u1,
  folderExists: f1,
  collapseNavigationPane: p1,
  expandNavigationPane: h1
}, g1 = "Yeni Klasör", v1 = "Dosya Yükle", y1 = "Yapıştır", $1 = "Görünümü Değiştir", x1 = "Yenile", w1 = "Kes", b1 = "Kopyala", C1 = "Yeniden İsimlendir", S1 = "İndir", E1 = "öğe seçildi", F1 = "seçilen öğeler", j1 = "İptal", N1 = "Seçimi Temizle", P1 = "Tamamlandı", T1 = "Dosya adı aşağıdaki karakterlerden hiçbirini içeremez:", R1 = "Bir dosya adı uzantısını değiştirirseniz, dosya kullanılamaz hale gelebilir. Bunu değiştirmek istediğinizden emin misiniz?", L1 = "Hayır", O1 = "Evet", k1 = "Kapalı", A1 = "Dosya türüne izin verilmiyor.", z1 = "Dosya zaten mevcut.", M1 = "Maksimum yükleme boyutu", I1 = "Yüklemek için dosyaları sürükleyin", D1 = "Dosya Seç", U1 = "Yükleme hatası.", _1 = "Yükleniyor", H1 = "Yüklendi", V1 = "Kaldır", B1 = "Yüklemeyi İptal Et", W1 = "Görünüm", Y1 = "Üzgünüz! Bu dosya için önizleme mevcut değil.", K1 = "Ana Sayfa", q1 = "Daha fazla klasör göster", G1 = "Burya Taşı", J1 = "Bu klasör boş.", X1 = "Hepsini Seç", Z1 = "Görünüm", Q1 = "Izgara", e0 = "Liste", t0 = "Aç", n0 = "Henüz hiçbir şey yok", o0 = "Ad", r0 = "Değiştirilme Tarihi", s0 = "Boyut", i0 = '"{{fileName}}" dosyasını silmek istediğinizden emin misiniz?', a0 = "{{count}} öğeyi silmek istediğinizden emin misiniz?", l0 = "%{{percent}} tamamlandı", c0 = "İptal edildi", d0 = 'Bir dosya adı aşağıdaki karakterlerden hiçbirini içeremez: \\ / : * ? " < > |', u0 = 'Bu konumda "{{renameFile}}" adında bir klasör zaten var.', f0 = "Gezinti Panelini Daralt", p0 = "Gezinti Panelini Genişlet", h0 = {
  newFolder: g1,
  upload: v1,
  paste: y1,
  changeView: $1,
  refresh: x1,
  cut: w1,
  copy: b1,
  rename: C1,
  download: S1,
  delete: "Sil",
  itemSelected: E1,
  itemsSelected: F1,
  cancel: j1,
  clearSelection: N1,
  completed: P1,
  folderErrorMessage: T1,
  fileNameChangeWarning: R1,
  no: L1,
  yes: O1,
  close: k1,
  fileTypeNotAllowed: A1,
  fileAlreadyExist: z1,
  maxUploadSize: M1,
  dragFileToUpload: I1,
  chooseFile: D1,
  uploadFail: U1,
  uploading: _1,
  uploaded: H1,
  remove: V1,
  abortUpload: B1,
  preview: W1,
  previewUnavailable: Y1,
  home: K1,
  showMoreFolder: q1,
  moveTo: G1,
  folderEmpty: J1,
  selectAll: X1,
  view: Z1,
  grid: Q1,
  list: e0,
  open: t0,
  nothingHereYet: n0,
  name: o0,
  modified: r0,
  size: s0,
  deleteItemConfirm: i0,
  deleteItemsConfirm: a0,
  percentDone: l0,
  canceled: c0,
  invalidFileName: d0,
  folderExists: u0,
  collapseNavigationPane: f0,
  expandNavigationPane: p0
}, m0 = "Нова папка", g0 = "Завантажити", v0 = "Вставити", y0 = "Змінити вигляд", $0 = "Оновити", x0 = "Вирізати", w0 = "Копіювати", b0 = "Перейменувати", C0 = "Завантажити", S0 = "вибраний елемент", E0 = "вибрані елементи", F0 = "Скасувати", j0 = "Очистити вибір", N0 = "Завершено", P0 = "Якщо ви зміните розширення файлу, він може стати непридатним для використання. Ви впевнені, що хочете змінити його?", T0 = "Ні", R0 = "Так", L0 = "Закрити", O0 = "Тип файлу не дозволено.", k0 = "Файл уже існує.", A0 = "Максимальний розмір завантаження —", z0 = "Перетягніть файли для завантаження", M0 = "Вибрати файл", I0 = "Помилка завантаження.", D0 = "Завантаження", U0 = "Завантажено", _0 = "Видалити", H0 = "Скасувати завантаження", V0 = "Попередній перегляд", B0 = "На жаль! Попередній перегляд для цього файлу недоступний.", W0 = "Головна", Y0 = "Показати більше папок", K0 = "Перемістити до", q0 = "Ця папка порожня.", G0 = "Вибрати все", J0 = "Вигляд", X0 = "Сітка", Z0 = "Список", Q0 = "Відкрити", eg = "Тут ще нічого немає", tg = "Назва", ng = "Змінено", og = "Розмір", rg = 'Ви впевнені, що хочете видалити "{{fileName}}"?', sg = "Ви впевнені, що хочете видалити ці {{count}} елементи?", ig = "{{percent}}% завершено", ag = "Скасовано", lg = `Ім'я файлу не може містити такі символи: \\ / : * ? " < > |`, cg = 'У цьому місці вже існує папка з назвою "{{renameFile}}".', dg = "Згорнути панель навігації", ug = "Розгорнути панель навігації", fg = {
  newFolder: m0,
  upload: g0,
  paste: v0,
  changeView: y0,
  refresh: $0,
  cut: x0,
  copy: w0,
  rename: b0,
  download: C0,
  delete: "Видалити",
  itemSelected: S0,
  itemsSelected: E0,
  cancel: F0,
  clearSelection: j0,
  completed: N0,
  fileNameChangeWarning: P0,
  no: T0,
  yes: R0,
  close: L0,
  fileTypeNotAllowed: O0,
  fileAlreadyExist: k0,
  maxUploadSize: A0,
  dragFileToUpload: z0,
  chooseFile: M0,
  uploadFail: I0,
  uploading: D0,
  uploaded: U0,
  remove: _0,
  abortUpload: H0,
  preview: V0,
  previewUnavailable: B0,
  home: W0,
  showMoreFolder: Y0,
  moveTo: K0,
  folderEmpty: q0,
  selectAll: G0,
  view: J0,
  grid: X0,
  list: Z0,
  open: Q0,
  nothingHereYet: eg,
  name: tg,
  modified: ng,
  size: og,
  deleteItemConfirm: rg,
  deleteItemsConfirm: sg,
  percentDone: ig,
  canceled: ag,
  invalidFileName: lg,
  folderExists: cg,
  collapseNavigationPane: dg,
  expandNavigationPane: ug
}, pg = "نیا فولڈر", hg = "اپ لوڈ کریں", mg = "چسپاں کریں", gg = "دیکھنے کا طریقہ تبدیل کریں", vg = "تازہ کریں", yg = "کٹ کریں", $g = "کاپی کریں", xg = "نام تبدیل کریں", wg = "ڈاؤن لوڈ کریں", bg = "آئٹم منتخب کیا گیا", Cg = "{{count}} آئٹمز منتخب کی گئیں", Sg = "منسوخ کریں", Eg = "انتخاب صاف کریں", Fg = "مکمل ہوا", jg = "اگر آپ فائل کا ایکسٹینشن تبدیل کرتے ہیں، تو فائل ناقابل استعمال ہو سکتی ہے۔ کیا آپ واقعی اسے تبدیل کرنا چاہتے ہیں؟", Ng = "نہیں", Pg = "ہاں", Tg = "بند کریں", Rg = "فائل کی قسم کی اجازت نہیں ہے۔", Lg = "فائل پہلے سے موجود ہے۔", Og = "زیادہ سے زیادہ اپ لوڈ سائز ہے", kg = "اپ لوڈ کرنے کے لیے فائلز گھسیٹیں", Ag = "فائل منتخب کریں", zg = "اپ لوڈ میں ناکامی۔", Mg = "اپ لوڈ ہو رہا ہے", Ig = "اپ لوڈ ہو گیا", Dg = "ہٹائیں", Ug = "اپ لوڈ منسوخ کریں", _g = "پریویو", Hg = "معذرت! اس فائل کا پریویو دستیاب نہیں ہے۔", Vg = "ہوم", Bg = "مزید فولڈرز دکھائیں", Wg = "منتقل کریں", Yg = "یہ فولڈر خالی ہے۔", Kg = "سبھی منتخب کریں", qg = "دیکھیں", Gg = "گِریڈ", Jg = "فہرست", Xg = "کھولیں", Zg = "ابھی کچھ بھی نہیں ہے", Qg = "نام", e2 = "ترمیم شدہ", t2 = "سائز", n2 = 'کیا آپ واقعی "{{fileName}}" کو حذف کرنا چاہتے ہیں؟', o2 = "کیا آپ واقعی ان {{count}} آئٹمز کو حذف کرنا چاہتے ہیں؟", r2 = "{{percent}}% مکمل ہوا", s2 = "منسوخ کیا گیا", i2 = 'فائل کا نام درج ذیل میں سے کوئی بھی حرف نہیں رکھ سکتا: \\ / : * ? " < > |', a2 = 'اس منزل پر پہلے ہی "{{renameFile}}" کے نام کا فولڈر موجود ہے۔', l2 = "نیویگیشن پین کو بند کریں", c2 = "نیویگیشن پین کو کھولیں", d2 = {
  newFolder: pg,
  upload: hg,
  paste: mg,
  changeView: gg,
  refresh: vg,
  cut: yg,
  copy: $g,
  rename: xg,
  download: wg,
  delete: "حذف کریں",
  itemSelected: bg,
  itemsSelected: Cg,
  cancel: Sg,
  clearSelection: Eg,
  completed: Fg,
  fileNameChangeWarning: jg,
  no: Ng,
  yes: Pg,
  close: Tg,
  fileTypeNotAllowed: Rg,
  fileAlreadyExist: Lg,
  maxUploadSize: Og,
  dragFileToUpload: kg,
  chooseFile: Ag,
  uploadFail: zg,
  uploading: Mg,
  uploaded: Ig,
  remove: Dg,
  abortUpload: Ug,
  preview: _g,
  previewUnavailable: Hg,
  home: Vg,
  showMoreFolder: Bg,
  moveTo: Wg,
  folderEmpty: Yg,
  selectAll: Kg,
  view: qg,
  grid: Gg,
  list: Jg,
  open: Xg,
  nothingHereYet: Zg,
  name: Qg,
  modified: e2,
  size: t2,
  deleteItemConfirm: n2,
  deleteItemsConfirm: o2,
  percentDone: r2,
  canceled: s2,
  invalidFileName: i2,
  folderExists: a2,
  collapseNavigationPane: l2,
  expandNavigationPane: c2
}, u2 = "Thư mục mới", f2 = "Tải lên", p2 = "Dán", h2 = "Thay đổi chế độ xem", m2 = "Làm mới", g2 = "Cắt", v2 = "Sao chép", y2 = "Đổi tên", $2 = "Tải xuống", x2 = "mục đã chọn", w2 = "mục được chọn", b2 = "Hủy", C2 = "Xóa lựa chọn", S2 = "Hoàn thành", E2 = "Nếu bạn thay đổi phần mở rộng tên tệp, tệp có thể không sử dụng được. Bạn có chắc chắn muốn thay đổi không?", F2 = "Không", j2 = "Có", N2 = "Đóng", P2 = "Loại tệp không được phép.", T2 = "Tệp đã tồn tại.", R2 = "Kích thước tải lên tối đa là", L2 = "Kéo tệp vào để tải lên", O2 = "Chọn tệp", k2 = "Tải lên thất bại.", A2 = "Đang tải lên", z2 = "Đã tải lên", M2 = "Gỡ bỏ", I2 = "Hủy tải lên", D2 = "Xem trước", U2 = "Rất tiếc! Không thể xem trước tệp này.", _2 = "Trang chủ", H2 = "Hiển thị thêm thư mục", V2 = "Chuyển đến", B2 = "Thư mục này trống.", W2 = "Chọn tất cả", Y2 = "Chế độ xem", K2 = "Lưới", q2 = "Danh sách", G2 = "Mở", J2 = "Chưa có gì ở đây", X2 = "Tên", Z2 = "Đã chỉnh sửa", Q2 = "Kích thước", ev = 'Bạn có chắc muốn xóa "{{fileName}}"?', tv = "Bạn có chắc muốn xóa {{count}} mục này không?", nv = "Hoàn thành {{percent}}%", ov = "Đã hủy", rv = 'Tên tệp không được chứa các ký tự sau: \\ / : * ? " < > |', sv = 'Đã có thư mục tên "{{renameFile}}" tại vị trí này.', iv = "Thu gọn ngăn điều hướng", av = "Mở rộng ngăn điều hướng", lv = {
  newFolder: u2,
  upload: f2,
  paste: p2,
  changeView: h2,
  refresh: m2,
  cut: g2,
  copy: v2,
  rename: y2,
  download: $2,
  delete: "Xóa",
  itemSelected: x2,
  itemsSelected: w2,
  cancel: b2,
  clearSelection: C2,
  completed: S2,
  fileNameChangeWarning: E2,
  no: F2,
  yes: j2,
  close: N2,
  fileTypeNotAllowed: P2,
  fileAlreadyExist: T2,
  maxUploadSize: R2,
  dragFileToUpload: L2,
  chooseFile: O2,
  uploadFail: k2,
  uploading: A2,
  uploaded: z2,
  remove: M2,
  abortUpload: I2,
  preview: D2,
  previewUnavailable: U2,
  home: _2,
  showMoreFolder: H2,
  moveTo: V2,
  folderEmpty: B2,
  selectAll: W2,
  view: Y2,
  grid: K2,
  list: q2,
  open: G2,
  nothingHereYet: J2,
  name: X2,
  modified: Z2,
  size: Q2,
  deleteItemConfirm: ev,
  deleteItemsConfirm: tv,
  percentDone: nv,
  canceled: ov,
  invalidFileName: rv,
  folderExists: sv,
  collapseNavigationPane: iv,
  expandNavigationPane: av
}, cv = "新建文件夹", dv = "上传", uv = "粘贴", fv = "更改视图", pv = "刷新", hv = "剪切", mv = "复制", gv = "重命名", vv = "下载", yv = "已选择项", $v = "已选择{{count}}项", xv = "取消", wv = "清除选择", bv = "完成", Cv = "如果更改文件扩展名，文件可能会变得无法使用。您确定要更改吗？", Sv = "否", Ev = "是", Fv = "关闭", jv = "不允许的文件类型。", Nv = "文件已存在。", Pv = "最大上传大小为", Tv = "拖动文件上传", Rv = "选择文件", Lv = "上传失败。", Ov = "上传中", kv = "已上传", Av = "移除", zv = "取消上传", Mv = "预览", Iv = "抱歉！该文件无法预览。", Dv = "首页", Uv = "显示更多文件夹", _v = "移动到", Hv = "该文件夹为空。", Vv = "全选", Bv = "视图", Wv = "网格", Yv = "列表", Kv = "打开", qv = "这里暂时没有内容", Gv = "名称", Jv = "修改时间", Xv = "大小", Zv = '您确定要删除 "{{fileName}}" 吗？', Qv = "您确定要删除这些 {{count}} 项吗？", e4 = "{{percent}}% 完成", t4 = "已取消", n4 = '文件名不能包含以下字符：\\ / : * ? " < > |', o4 = '目标文件夹中已存在名为 "{{renameFile}}" 的文件夹。', r4 = "折叠导航窗格", s4 = "展开导航窗格", i4 = {
  newFolder: cv,
  upload: dv,
  paste: uv,
  changeView: fv,
  refresh: pv,
  cut: hv,
  copy: mv,
  rename: gv,
  download: vv,
  delete: "删除",
  itemSelected: yv,
  itemsSelected: $v,
  cancel: xv,
  clearSelection: wv,
  completed: bv,
  fileNameChangeWarning: Cv,
  no: Sv,
  yes: Ev,
  close: Fv,
  fileTypeNotAllowed: jv,
  fileAlreadyExist: Nv,
  maxUploadSize: Pv,
  dragFileToUpload: Tv,
  chooseFile: Rv,
  uploadFail: Lv,
  uploading: Ov,
  uploaded: kv,
  remove: Av,
  abortUpload: zv,
  preview: Mv,
  previewUnavailable: Iv,
  home: Dv,
  showMoreFolder: Uv,
  moveTo: _v,
  folderEmpty: Hv,
  selectAll: Vv,
  view: Bv,
  grid: Wv,
  list: Yv,
  open: Kv,
  nothingHereYet: qv,
  name: Gv,
  modified: Jv,
  size: Xv,
  deleteItemConfirm: Zv,
  deleteItemsConfirm: Qv,
  percentDone: e4,
  canceled: t4,
  invalidFileName: n4,
  folderExists: o4,
  collapseNavigationPane: r4,
  expandNavigationPane: s4
}, a4 = {
  ar: { translation: zs },
  de: { translation: ki },
  en: { translation: La },
  es: { translation: Tl },
  fr: { translation: Nc },
  he: { translation: Fd },
  hi: { translation: Su },
  it: { translation: Cf },
  ja: { translation: wp },
  ko: { translation: $h },
  pt: { translation: vm },
  ru: { translation: m1 },
  tr: { translation: h0 },
  uk: { translation: fg },
  ur: { translation: d2 },
  vi: { translation: lv },
  zh: { translation: i4 }
}, l4 = (n = "en") => {
  fe.isInitialized ? fe.changeLanguage(n) : fe.init({
    resources: a4,
    lng: n,
    fallbackLng: "en",
    interpolation: {
      escapeValue: !1
    }
  });
}, co = Be(() => (n) => n), c4 = ({ children: n, language: e }) => {
  const [t, o] = I(() => fe.t.bind(fe));
  return se(() => {
    l4(e), o(() => fe.t.bind(fe));
  }, [e]), /* @__PURE__ */ l.jsx(co.Provider, { value: t, children: n });
}, be = () => We(co), d4 = ({ setShowToggleViewMenu: n, onLayoutChange: e }) => {
  const t = Qe(() => {
    n(!1);
  }), { activeLayout: o, setActiveLayout: r } = Ae(), s = be(), i = [
    {
      key: "grid",
      name: s("grid"),
      icon: /* @__PURE__ */ l.jsx(Zn, { size: 18 })
    },
    {
      key: "list",
      name: s("list"),
      icon: /* @__PURE__ */ l.jsx(it, { size: 18 })
    }
  ], a = (c) => {
    r(c), e(c), n(!1);
  };
  return /* @__PURE__ */ l.jsx("div", { ref: t.ref, className: "toggle-view", role: "dropdown", children: /* @__PURE__ */ l.jsx("ul", { role: "menu", "aria-orientation": "vertical", children: i.map((c) => /* @__PURE__ */ l.jsxs(
    "li",
    {
      role: "menuitem",
      onClick: () => a(c.key),
      onKeyDown: () => a(c.key),
      children: [
        /* @__PURE__ */ l.jsx("span", { children: c.key === o && /* @__PURE__ */ l.jsx(ro, { size: 13 }) }),
        /* @__PURE__ */ l.jsx("span", { children: c.icon }),
        /* @__PURE__ */ l.jsx("span", { children: c.name })
      ]
    },
    c.key
  )) }) });
}, uo = Be(), u4 = ({ children: n, filesData: e, onError: t }) => {
  const [o, r] = I([]);
  se(() => {
    r(e);
  }, [e]);
  const s = (i) => i.isDirectory ? o.filter((a) => a.path === `${i.path}/${a.name}`) : [];
  return /* @__PURE__ */ l.jsx(uo.Provider, { value: { files: o, setFiles: r, getChildren: s, onError: t }, children: n });
}, mt = () => We(uo), f4 = (n, e = "name", t = "asc") => {
  const o = n.filter((c) => c.isDirectory), r = n.filter((c) => !c.isDirectory), s = (c, d) => {
    let f = 0;
    switch (e) {
      case "name":
        f = c.name.localeCompare(d.name);
        break;
      case "size":
        const p = c.size || 0, g = d.size || 0;
        f = p - g;
        break;
      case "modified":
        const h = c.updatedAt ? new Date(c.updatedAt).getTime() : 0, m = d.updatedAt ? new Date(d.updatedAt).getTime() : 0;
        f = h - m;
        break;
      default:
        f = c.name.localeCompare(d.name);
    }
    return t === "asc" ? f : -f;
  }, i = [...o].sort(s), a = [...r].sort(s);
  return [...i, ...a];
}, fo = Be(), p4 = ({ children: n, initialPath: e, onFolderChange: t }) => {
  const { files: o } = mt(), r = he(!1), [s, i] = I(""), [a, c] = I(null), [d, f] = I([]), [p, g] = I({ key: "name", direction: "asc" });
  return se(() => {
    Array.isArray(o) && o.length > 0 && (f(() => {
      const h = o.filter((m) => m.path === `${s}/${m.name}`);
      return f4(h, p.key, p.direction);
    }), c(() => o.find((h) => h.path === s) ?? null));
  }, [o, s, p]), se(() => {
    if (!r.current && Array.isArray(o) && o.length > 0) {
      const h = o.some((m) => m.path === e) ? e : "";
      i(h), t == null || t(h), r.current = !0;
    }
  }, [e, o]), /* @__PURE__ */ l.jsx(
    fo.Provider,
    {
      value: {
        currentPath: s,
        setCurrentPath: i,
        currentFolder: a,
        setCurrentFolder: c,
        currentPathFiles: d,
        setCurrentPathFiles: f,
        sortConfig: p,
        setSortConfig: g,
        onFolderChange: t
      },
      children: n
    }
  );
}, Fe = () => We(fo), Me = (n, e, ...t) => {
  try {
    if (typeof n == "function")
      n(...t);
    else
      throw new Error(
        `<FileManager /> Missing prop: Callback function "${e}" is required.`
      );
  } catch (o) {
    console.error(o.message);
  }
}, po = Be(), h4 = ({ children: n, onDownload: e, onSelect: t }) => {
  const [o, r] = I([]);
  se(() => {
    o.length && t && t(o);
  }, [o]);
  const s = () => {
    Me(e, "onDownload", o);
  };
  return /* @__PURE__ */ l.jsx(po.Provider, { value: { selectedFiles: o, setSelectedFiles: r, handleDownload: s }, children: n });
}, Le = () => We(po), ho = Be(), m4 = ({ children: n, onPaste: e, onCut: t, onCopy: o }) => {
  const [r, s] = I(null), { selectedFiles: i, setSelectedFiles: a } = Le(), c = (f) => {
    s({
      files: i,
      isMoving: f
    }), f ? t && t(i) : o && o(i);
  }, d = (f) => {
    if (f && !f.isDirectory) return;
    const p = r.files, g = r.isMoving ? "move" : "copy";
    Me(e, "onPaste", p, f, g), r.isMoving && s(null), a([]);
  };
  return /* @__PURE__ */ l.jsx(ho.Provider, { value: { clipBoard: r, setClipBoard: s, handleCutCopy: c, handlePasting: d }, children: n });
}, gt = () => We(ho), mo = ({ onLayoutChange: n, onRefresh: e, triggerAction: t, permissions: o }) => {
  var T;
  const [r, s] = I(!1), { currentFolder: i } = Fe(), { selectedFiles: a, setSelectedFiles: c, handleDownload: d } = Le(), { clipBoard: f, setClipBoard: p, handleCutCopy: g, handlePasting: h } = gt(), { activeLayout: m } = Ae(), $ = be(), A = [
    {
      icon: /* @__PURE__ */ l.jsx(Xn, { size: 17, strokeWidth: 0.3 }),
      text: $("newFolder"),
      permission: o.create,
      onClick: () => t.show("createFolder")
    },
    {
      icon: /* @__PURE__ */ l.jsx(no, { size: 18 }),
      text: $("upload"),
      permission: o.upload,
      onClick: () => t.show("uploadFile")
    },
    {
      icon: /* @__PURE__ */ l.jsx(kt, { size: 18 }),
      text: $("paste"),
      permission: !!f,
      onClick: P
    }
  ], C = [
    {
      icon: m === "grid" ? /* @__PURE__ */ l.jsx(Zn, { size: 16 }) : /* @__PURE__ */ l.jsx(it, { size: 16 }),
      title: $("changeView"),
      onClick: () => s((v) => !v)
    },
    {
      icon: /* @__PURE__ */ l.jsx(eo, { size: 16 }),
      title: $("refresh"),
      onClick: () => {
        Me(e, "onRefresh"), p(null);
      }
    }
  ];
  function P() {
    h(i);
  }
  const j = () => {
    d(), c([]);
  };
  return a.length > 0 ? /* @__PURE__ */ l.jsx("div", { className: "toolbar file-selected", children: /* @__PURE__ */ l.jsxs("div", { className: "file-action-container", children: [
    /* @__PURE__ */ l.jsxs("div", { children: [
      o.move && /* @__PURE__ */ l.jsxs("button", { className: "item-action file-action", onClick: () => g(!0), children: [
        /* @__PURE__ */ l.jsx(Qn, { size: 18 }),
        /* @__PURE__ */ l.jsx("span", { children: $("cut") })
      ] }),
      o.copy && /* @__PURE__ */ l.jsxs("button", { className: "item-action file-action", onClick: () => g(!1), children: [
        /* @__PURE__ */ l.jsx(Jn, { strokeWidth: 0.1, size: 17 }),
        /* @__PURE__ */ l.jsx("span", { children: $("copy") })
      ] }),
      ((T = f == null ? void 0 : f.files) == null ? void 0 : T.length) > 0 && /* @__PURE__ */ l.jsxs(
        "button",
        {
          className: "item-action file-action",
          onClick: P,
          children: [
            /* @__PURE__ */ l.jsx(kt, { size: 18 }),
            /* @__PURE__ */ l.jsx("span", { children: $("paste") })
          ]
        }
      ),
      a.length === 1 && o.rename && /* @__PURE__ */ l.jsxs(
        "button",
        {
          className: "item-action file-action",
          onClick: () => t.show("rename"),
          children: [
            /* @__PURE__ */ l.jsx(oo, { size: 19 }),
            /* @__PURE__ */ l.jsx("span", { children: $("rename") })
          ]
        }
      ),
      o.download && /* @__PURE__ */ l.jsxs("button", { className: "item-action file-action", onClick: j, children: [
        /* @__PURE__ */ l.jsx(It, { size: 19 }),
        /* @__PURE__ */ l.jsx("span", { children: $("download") })
      ] }),
      o.delete && /* @__PURE__ */ l.jsxs(
        "button",
        {
          className: "item-action file-action",
          onClick: () => t.show("delete"),
          children: [
            /* @__PURE__ */ l.jsx(to, { size: 19 }),
            /* @__PURE__ */ l.jsx("span", { children: $("delete") })
          ]
        }
      )
    ] }),
    /* @__PURE__ */ l.jsxs(
      "button",
      {
        className: "item-action file-action",
        title: $("clearSelection"),
        onClick: () => c([]),
        children: [
          /* @__PURE__ */ l.jsxs("span", { children: [
            a.length,
            " ",
            $(a.length > 1 ? "itemsSelected" : "itemSelected")
          ] }),
          /* @__PURE__ */ l.jsx(ar, { size: 18 })
        ]
      }
    )
  ] }) }) : /* @__PURE__ */ l.jsx("div", { className: "toolbar", children: /* @__PURE__ */ l.jsxs("div", { className: "fm-toolbar", children: [
    /* @__PURE__ */ l.jsx("div", { children: A.filter((v) => v.permission).map((v, R) => /* @__PURE__ */ l.jsxs("button", { className: "item-action", onClick: v.onClick, children: [
      v.icon,
      /* @__PURE__ */ l.jsx("span", { children: v.text })
    ] }, R)) }),
    /* @__PURE__ */ l.jsxs("div", { children: [
      C.map((v, R) => /* @__PURE__ */ l.jsxs("div", { className: "toolbar-left-items", children: [
        /* @__PURE__ */ l.jsx("button", { className: "item-action icon-only", title: v.title, onClick: v.onClick, children: v.icon }),
        R !== C.length - 1 && /* @__PURE__ */ l.jsx("div", { className: "item-separator" })
      ] }, R)),
      r && /* @__PURE__ */ l.jsx(
        d4,
        {
          setShowToggleViewMenu: s,
          onLayoutChange: n
        }
      )
    ] })
  ] }) });
};
mo.displayName = "Toolbar";
var g4 = process.env.NODE_ENV === "production";
function v4(n, e) {
  if (!g4) {
    if (n)
      return;
    var t = "Warning: " + e;
    typeof console < "u" && console.warn(t);
    try {
      throw Error(t);
    } catch {
    }
  }
}
/**
  * react-collapsed v4.2.0
  *
  * Copyright (c) 2019-2024, Rogin Farrer
  *
  * This source code is licensed under the MIT license found in the
  * LICENSE.md file in the root directory of this source tree.
  *
  * @license MIT
  */
var y4 = class extends Error {
  constructor(n) {
    super(`react-collapsed: ${n}`);
  }
}, ut = (...n) => v4(n[0], `[react-collapsed] -- ${n[1]}`);
function go(n) {
  const e = he(n);
  return se(() => {
    e.current = n;
  }), Kn((...t) => {
    var o;
    return (o = e.current) == null ? void 0 : o.call(e, ...t);
  }, []);
}
function $4(n, e, t) {
  const [o, r] = I(e), s = he(typeof n < "u"), i = s.current ? n : o, a = go(t), c = Kn(
    (d) => {
      const p = typeof d == "function" ? d(i) : d;
      s.current || r(p), a == null || a(p);
    },
    [a, i]
  );
  return se(() => {
    ut(
      !(s.current && n == null),
      "`isExpanded` state is changing from controlled to uncontrolled. useCollapse should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop."
    ), ut(
      !(!s.current && n != null),
      "`isExpanded` state is changing from uncontrolled to controlled. useCollapse should not switch from uncontrolled to controlled (or vice versa). Decide between using a controlled or uncontrolled collapse for the lifetime of the component. Check the `isExpanded` prop."
    );
  }, [n]), [i, c];
}
var x4 = "(prefers-reduced-motion: reduce)";
function w4() {
  const [n, e] = I(!1);
  return se(() => {
    if (typeof window > "u" || typeof window.matchMedia != "function")
      return;
    const t = window.matchMedia(x4);
    e(t.matches);
    const o = (r) => {
      e(r.matches);
    };
    if (t.addEventListener)
      return t.addEventListener("change", o), () => {
        t.removeEventListener("change", o);
      };
    if (t.addListener)
      return t.addListener(o), () => {
        t.removeListener(o);
      };
  }, []), n;
}
var b4 = Je.useId || (() => {
});
function C4() {
  return b4() ?? "";
}
var S4 = typeof window < "u" ? Je.useLayoutEffect : Je.useEffect, Et = !1, E4 = 0, Fn = () => ++E4;
function F4(n) {
  const e = n || (Et ? Fn() : null), [t, o] = Je.useState(e);
  return S4(() => {
    t === null && o(Fn());
  }, []), Je.useEffect(() => {
    Et === !1 && (Et = !0);
  }, []), t != null ? String(t) : void 0;
}
function j4(n) {
  const e = C4(), t = F4(n);
  return typeof n == "string" ? n : typeof e == "string" ? e : t;
}
function N4(n, e) {
  const t = performance.now(), o = {};
  function r() {
    o.id = requestAnimationFrame((s) => {
      s - t > e ? n() : r();
    });
  }
  return r(), o;
}
function jn(n) {
  n.id && cancelAnimationFrame(n.id);
}
function Nn(n) {
  return n != null && n.current ? n.current.scrollHeight : (ut(
    !0,
    "Was not able to find a ref to the collapse element via `getCollapseProps`. Ensure that the element exposes its `ref` prop. If it exposes the ref prop under a different name (like `innerRef`), use the `refKey` property to change it. Example:\n\nconst collapseProps = getCollapseProps({refKey: 'innerRef'})"
  ), 0);
}
function P4(n) {
  if (!n || typeof n == "string")
    return 0;
  const e = n / 36;
  return Math.round((4 + 15 * e ** 0.25 + e / 5) * 10);
}
function T4(n, e) {
  if (n != null)
    if (typeof n == "function")
      n(e);
    else
      try {
        n.current = e;
      } catch {
        throw new y4(`Cannot assign value "${e}" to ref "${n}"`);
      }
}
function Pn(...n) {
  return n.every((e) => e == null) ? null : (e) => {
    n.forEach((t) => {
      T4(t, e);
    });
  };
}
function R4(n) {
  let e = (t) => {
  };
  e = (t) => {
    if (!(t != null && t.current))
      return;
    const { paddingTop: o, paddingBottom: r } = window.getComputedStyle(t.current);
    ut(
      !(o && o !== "0px" || r && r !== "0px"),
      `Padding applied to the collapse element will cause the animation to break and not perform as expected. To fix, apply equivalent padding to the direct descendent of the collapse element. Example:

Before:   <div {...getCollapseProps({style: {padding: 10}})}>{children}</div>

After:   <div {...getCollapseProps()}>
             <div style={{padding: 10}}>
                 {children}
             </div>
          </div>`
    );
  }, se(() => {
    e(n);
  }, [n]);
}
var L4 = typeof window > "u" ? se : Ko;
function O4({
  duration: n,
  easing: e = "cubic-bezier(0.4, 0, 0.2, 1)",
  onTransitionStateChange: t = () => {
  },
  isExpanded: o,
  defaultExpanded: r = !1,
  hasDisabledAnimation: s,
  id: i,
  ...a
} = {}) {
  const c = go(t), d = j4(i ? `${i}` : void 0), [f, p] = $4(
    o,
    r
  ), g = he(f), [h, m] = I(!1), $ = w4(), A = s ?? $, C = he(), P = he(), j = he(null), [T, v] = I(null);
  R4(j);
  const R = `${a.collapsedHeight || 0}px`;
  function F(S) {
    if (!j.current)
      return;
    const y = j.current;
    for (const x in S) {
      const L = S[x];
      L ? y.style[x] = L : y.style.removeProperty(x);
    }
  }
  return L4(() => {
    if (!j.current || f === g.current)
      return;
    g.current = f;
    function y(O) {
      return A ? 0 : n ?? P4(O);
    }
    const x = (O) => `height ${y(O)}ms ${e}`, L = (O) => {
      function N() {
        f ? (F({
          height: "",
          overflow: "",
          transition: "",
          display: ""
        }), c("expandEnd")) : (F({ transition: "" }), c("collapseEnd")), m(!1);
      }
      P.current && jn(P.current), P.current = N4(N, O);
    };
    return m(!0), f ? C.current = requestAnimationFrame(() => {
      c("expandStart"), F({
        display: "block",
        overflow: "hidden",
        height: R
      }), C.current = requestAnimationFrame(() => {
        c("expanding");
        const O = Nn(j);
        L(y(O)), j.current && (j.current.style.transition = x(O), j.current.style.height = `${O}px`);
      });
    }) : C.current = requestAnimationFrame(() => {
      c("collapseStart");
      const O = Nn(j);
      L(y(O)), F({
        transition: x(O),
        height: `${O}px`
      }), C.current = requestAnimationFrame(() => {
        c("collapsing"), F({
          height: R,
          overflow: "hidden"
        });
      });
    }), () => {
      C.current && cancelAnimationFrame(C.current), P.current && jn(P.current);
    };
  }, [
    f,
    R,
    A,
    n,
    e,
    c
  ]), {
    isExpanded: f,
    setExpanded: p,
    getToggleProps(S) {
      const { disabled: y, onClick: x, refKey: L, ...O } = {
        refKey: "ref",
        onClick() {
        },
        disabled: !1,
        ...S
      }, N = T ? T.tagName === "BUTTON" : void 0, M = S == null ? void 0 : S[L || "ref"], Q = {
        id: `react-collapsed-toggle-${d}`,
        "aria-controls": `react-collapsed-panel-${d}`,
        "aria-expanded": f,
        onClick(de) {
          y || (x == null || x(de), p((ne) => !ne));
        },
        [L || "ref"]: Pn(M, v)
      }, J = {
        type: "button",
        disabled: y ? !0 : void 0
      }, Z = {
        "aria-disabled": y ? !0 : void 0,
        role: "button",
        tabIndex: y ? -1 : 0
      };
      return N === !1 ? { ...Q, ...Z, ...O } : N === !0 ? { ...Q, ...J, ...O } : {
        ...Q,
        ...J,
        ...Z,
        ...O
      };
    },
    getCollapseProps(S) {
      const { style: y, refKey: x } = { refKey: "ref", style: {}, ...S }, L = S == null ? void 0 : S[x || "ref"];
      return {
        id: `react-collapsed-panel-${d}`,
        "aria-hidden": !f,
        "aria-labelledby": `react-collapsed-toggle-${d}`,
        role: "region",
        ...S,
        [x || "ref"]: Pn(j, L),
        style: {
          boxSizing: "border-box",
          ...!h && !f ? {
            // collapsed and not animating
            display: R === "0px" ? "none" : "block",
            height: R,
            overflow: "hidden"
          } : {},
          // additional styles passed, e.g. getCollapseProps({style: {}})
          ...y
        }
      };
    }
  };
}
const k4 = ({ open: n, children: e }) => {
  const [t, o] = I(n), { getCollapseProps: r } = O4({
    isExpanded: t,
    duration: 500
  });
  return se(() => {
    o(n);
  }, [n, o]), /* @__PURE__ */ l.jsx(l.Fragment, { children: /* @__PURE__ */ l.jsx("div", { ...r(), children: e }) });
};
function A4(n) {
  return q({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M256 8C119.033 8 8 119.033 8 256s111.033 248 248 248 248-111.033 248-248S392.967 8 256 8zm0 48c110.532 0 200 89.451 200 200 0 110.532-89.451 200-200 200-110.532 0-200-89.451-200-200 0-110.532 89.451-200 200-200m140.204 130.267l-22.536-22.718c-4.667-4.705-12.265-4.736-16.97-.068L215.346 303.697l-59.792-60.277c-4.667-4.705-12.265-4.736-16.97-.069l-22.719 22.536c-4.705 4.667-4.736 12.265-.068 16.971l90.781 91.516c4.667 4.705 12.265 4.736 16.97.068l172.589-171.204c4.704-4.668 4.734-12.266.067-16.971z" }, child: [] }] })(n);
}
function z4(n) {
  return q({ attr: { viewBox: "0 0 384 512" }, child: [{ tag: "path", attr: { d: "M288 248v28c0 6.6-5.4 12-12 12H108c-6.6 0-12-5.4-12-12v-28c0-6.6 5.4-12 12-12h168c6.6 0 12 5.4 12 12zm-12 72H108c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h168c6.6 0 12-5.4 12-12v-28c0-6.6-5.4-12-12-12zm108-188.1V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V48C0 21.5 21.5 0 48 0h204.1C264.8 0 277 5.1 286 14.1L369.9 98c9 8.9 14.1 21.2 14.1 33.9zm-128-80V128h76.1L256 51.9zM336 464V176H232c-13.3 0-24-10.7-24-24V48H48v416h288z" }, child: [] }] })(n);
}
function Tn(n) {
  return q({ attr: { viewBox: "0 0 576 512" }, child: [{ tag: "path", attr: { d: "M527.9 224H480v-48c0-26.5-21.5-48-48-48H272l-64-64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h400c16.5 0 31.9-8.5 40.7-22.6l79.9-128c20-31.9-3-73.4-40.7-73.4zM48 118c0-3.3 2.7-6 6-6h134.1l64 64H426c3.3 0 6 2.7 6 6v42H152c-16.8 0-32.4 8.8-41.1 23.2L48 351.4zm400 282H72l77.2-128H528z" }, child: [] }] })(n);
}
function Rn(n) {
  return q({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M464 128H272l-54.63-54.63c-6-6-14.14-9.37-22.63-9.37H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zm0 272H48V112h140.12l54.63 54.63c6 6 14.14 9.37 22.63 9.37H464v224z" }, child: [] }] })(n);
}
const vo = ({ folder: n, onFileOpen: e }) => {
  const [t, o] = I(!1), [r, s] = I(!1), { currentPath: i, setCurrentPath: a, onFolderChange: c } = Fe(), d = () => {
    s(!0), e(n), a(n.path), c == null || c(n.path);
  }, f = (p) => {
    p.stopPropagation(), o((g) => !g);
  };
  return se(() => {
    s(i === n.path);
    const p = i.split("/");
    p.pop(), p.join("/") === n.path && o(!0);
  }, [i]), n.subDirectories.length > 0 ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsxs(
      "div",
      {
        className: `sb-folders-list-item ${r ? "active-list-item" : ""}`,
        onClick: d,
        children: [
          /* @__PURE__ */ l.jsx("span", { onClick: f, children: /* @__PURE__ */ l.jsx(
            lr,
            {
              size: 20,
              className: `folder-icon-default ${t ? "folder-rotate-down" : ""}`
            }
          ) }),
          /* @__PURE__ */ l.jsxs("div", { className: "sb-folder-details", children: [
            t || r ? /* @__PURE__ */ l.jsx(Tn, { size: 20, className: "folder-open-icon" }) : /* @__PURE__ */ l.jsx(Rn, { size: 17, className: "folder-close-icon" }),
            /* @__PURE__ */ l.jsx("span", { className: "sb-folder-name", title: n.name, children: n.name })
          ] })
        ]
      }
    ),
    /* @__PURE__ */ l.jsx(k4, { open: t, children: /* @__PURE__ */ l.jsx("div", { className: "folder-collapsible", children: n.subDirectories.map((p, g) => /* @__PURE__ */ l.jsx(vo, { folder: p, onFileOpen: e }, g)) }) })
  ] }) : /* @__PURE__ */ l.jsxs(
    "div",
    {
      className: `sb-folders-list-item ${r ? "active-list-item" : ""}`,
      onClick: d,
      children: [
        /* @__PURE__ */ l.jsx("span", { className: "non-expanable" }),
        /* @__PURE__ */ l.jsxs("div", { className: "sb-folder-details", children: [
          r ? /* @__PURE__ */ l.jsx(Tn, { size: 20, className: "folder-open-icon" }) : /* @__PURE__ */ l.jsx(Rn, { size: 17, className: "folder-close-icon" }),
          /* @__PURE__ */ l.jsx("span", { className: "sb-folder-name", title: n.name, children: n.name })
        ] })
      ]
    }
  );
}, M4 = (n) => n == null ? void 0 : n.split("/").slice(0, -1).join("/"), yo = ({ onFileOpen: n }) => {
  const [e, t] = I([]), { files: o } = mt(), r = be(), s = (i, a) => {
    var c;
    return a[i] ? (c = a[i]) == null ? void 0 : c.map((d) => ({
      ...d,
      subDirectories: s(d.path, a)
    })) : [];
  };
  return se(() => {
    if (Array.isArray(o)) {
      const i = o.filter((c) => c.isDirectory), a = Object.groupBy(i, ({ path: c }) => M4(c));
      t(() => s("", a));
    }
  }, [o]), /* @__PURE__ */ l.jsx("div", { className: "sb-folders-list", children: (e == null ? void 0 : e.length) > 0 ? /* @__PURE__ */ l.jsx(l.Fragment, { children: e == null ? void 0 : e.map((i, a) => /* @__PURE__ */ l.jsx(vo, { folder: i, onFileOpen: n }, a)) }) : /* @__PURE__ */ l.jsx("div", { className: "empty-nav-pane", children: r("nothingHereYet") }) });
};
yo.displayName = "NavigationPane";
var nt = { exports: {} }, ot = { exports: {} }, ae = {};
/** @license React v16.13.1
 * react-is.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var Ln;
function I4() {
  if (Ln) return ae;
  Ln = 1;
  var n = typeof Symbol == "function" && Symbol.for, e = n ? Symbol.for("react.element") : 60103, t = n ? Symbol.for("react.portal") : 60106, o = n ? Symbol.for("react.fragment") : 60107, r = n ? Symbol.for("react.strict_mode") : 60108, s = n ? Symbol.for("react.profiler") : 60114, i = n ? Symbol.for("react.provider") : 60109, a = n ? Symbol.for("react.context") : 60110, c = n ? Symbol.for("react.async_mode") : 60111, d = n ? Symbol.for("react.concurrent_mode") : 60111, f = n ? Symbol.for("react.forward_ref") : 60112, p = n ? Symbol.for("react.suspense") : 60113, g = n ? Symbol.for("react.suspense_list") : 60120, h = n ? Symbol.for("react.memo") : 60115, m = n ? Symbol.for("react.lazy") : 60116, $ = n ? Symbol.for("react.block") : 60121, A = n ? Symbol.for("react.fundamental") : 60117, C = n ? Symbol.for("react.responder") : 60118, P = n ? Symbol.for("react.scope") : 60119;
  function j(v) {
    if (typeof v == "object" && v !== null) {
      var R = v.$$typeof;
      switch (R) {
        case e:
          switch (v = v.type, v) {
            case c:
            case d:
            case o:
            case s:
            case r:
            case p:
              return v;
            default:
              switch (v = v && v.$$typeof, v) {
                case a:
                case f:
                case m:
                case h:
                case i:
                  return v;
                default:
                  return R;
              }
          }
        case t:
          return R;
      }
    }
  }
  function T(v) {
    return j(v) === d;
  }
  return ae.AsyncMode = c, ae.ConcurrentMode = d, ae.ContextConsumer = a, ae.ContextProvider = i, ae.Element = e, ae.ForwardRef = f, ae.Fragment = o, ae.Lazy = m, ae.Memo = h, ae.Portal = t, ae.Profiler = s, ae.StrictMode = r, ae.Suspense = p, ae.isAsyncMode = function(v) {
    return T(v) || j(v) === c;
  }, ae.isConcurrentMode = T, ae.isContextConsumer = function(v) {
    return j(v) === a;
  }, ae.isContextProvider = function(v) {
    return j(v) === i;
  }, ae.isElement = function(v) {
    return typeof v == "object" && v !== null && v.$$typeof === e;
  }, ae.isForwardRef = function(v) {
    return j(v) === f;
  }, ae.isFragment = function(v) {
    return j(v) === o;
  }, ae.isLazy = function(v) {
    return j(v) === m;
  }, ae.isMemo = function(v) {
    return j(v) === h;
  }, ae.isPortal = function(v) {
    return j(v) === t;
  }, ae.isProfiler = function(v) {
    return j(v) === s;
  }, ae.isStrictMode = function(v) {
    return j(v) === r;
  }, ae.isSuspense = function(v) {
    return j(v) === p;
  }, ae.isValidElementType = function(v) {
    return typeof v == "string" || typeof v == "function" || v === o || v === d || v === s || v === r || v === p || v === g || typeof v == "object" && v !== null && (v.$$typeof === m || v.$$typeof === h || v.$$typeof === i || v.$$typeof === a || v.$$typeof === f || v.$$typeof === A || v.$$typeof === C || v.$$typeof === P || v.$$typeof === $);
  }, ae.typeOf = j, ae;
}
var le = {};
/** @license React v16.13.1
 * react-is.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var On;
function D4() {
  return On || (On = 1, process.env.NODE_ENV !== "production" && (function() {
    var n = typeof Symbol == "function" && Symbol.for, e = n ? Symbol.for("react.element") : 60103, t = n ? Symbol.for("react.portal") : 60106, o = n ? Symbol.for("react.fragment") : 60107, r = n ? Symbol.for("react.strict_mode") : 60108, s = n ? Symbol.for("react.profiler") : 60114, i = n ? Symbol.for("react.provider") : 60109, a = n ? Symbol.for("react.context") : 60110, c = n ? Symbol.for("react.async_mode") : 60111, d = n ? Symbol.for("react.concurrent_mode") : 60111, f = n ? Symbol.for("react.forward_ref") : 60112, p = n ? Symbol.for("react.suspense") : 60113, g = n ? Symbol.for("react.suspense_list") : 60120, h = n ? Symbol.for("react.memo") : 60115, m = n ? Symbol.for("react.lazy") : 60116, $ = n ? Symbol.for("react.block") : 60121, A = n ? Symbol.for("react.fundamental") : 60117, C = n ? Symbol.for("react.responder") : 60118, P = n ? Symbol.for("react.scope") : 60119;
    function j(k) {
      return typeof k == "string" || typeof k == "function" || // Note: its typeof might be other than 'symbol' or 'number' if it's a polyfill.
      k === o || k === d || k === s || k === r || k === p || k === g || typeof k == "object" && k !== null && (k.$$typeof === m || k.$$typeof === h || k.$$typeof === i || k.$$typeof === a || k.$$typeof === f || k.$$typeof === A || k.$$typeof === C || k.$$typeof === P || k.$$typeof === $);
    }
    function T(k) {
      if (typeof k == "object" && k !== null) {
        var ye = k.$$typeof;
        switch (ye) {
          case e:
            var Te = k.type;
            switch (Te) {
              case c:
              case d:
              case o:
              case s:
              case r:
              case p:
                return Te;
              default:
                var je = Te && Te.$$typeof;
                switch (je) {
                  case a:
                  case f:
                  case m:
                  case h:
                  case i:
                    return je;
                  default:
                    return ye;
                }
            }
          case t:
            return ye;
        }
      }
    }
    var v = c, R = d, F = a, S = i, y = e, x = f, L = o, O = m, N = h, M = t, Q = s, J = r, Z = p, de = !1;
    function ne(k) {
      return de || (de = !0, console.warn("The ReactIs.isAsyncMode() alias has been deprecated, and will be removed in React 17+. Update your code to use ReactIs.isConcurrentMode() instead. It has the exact same API.")), w(k) || T(k) === c;
    }
    function w(k) {
      return T(k) === d;
    }
    function E(k) {
      return T(k) === a;
    }
    function _(k) {
      return T(k) === i;
    }
    function H(k) {
      return typeof k == "object" && k !== null && k.$$typeof === e;
    }
    function V(k) {
      return T(k) === f;
    }
    function X(k) {
      return T(k) === o;
    }
    function W(k) {
      return T(k) === m;
    }
    function B(k) {
      return T(k) === h;
    }
    function G(k) {
      return T(k) === t;
    }
    function ee(k) {
      return T(k) === s;
    }
    function D(k) {
      return T(k) === r;
    }
    function ue(k) {
      return T(k) === p;
    }
    le.AsyncMode = v, le.ConcurrentMode = R, le.ContextConsumer = F, le.ContextProvider = S, le.Element = y, le.ForwardRef = x, le.Fragment = L, le.Lazy = O, le.Memo = N, le.Portal = M, le.Profiler = Q, le.StrictMode = J, le.Suspense = Z, le.isAsyncMode = ne, le.isConcurrentMode = w, le.isContextConsumer = E, le.isContextProvider = _, le.isElement = H, le.isForwardRef = V, le.isFragment = X, le.isLazy = W, le.isMemo = B, le.isPortal = G, le.isProfiler = ee, le.isStrictMode = D, le.isSuspense = ue, le.isValidElementType = j, le.typeOf = T;
  })()), le;
}
var kn;
function $o() {
  return kn || (kn = 1, process.env.NODE_ENV === "production" ? ot.exports = I4() : ot.exports = D4()), ot.exports;
}
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/
var Ft, An;
function U4() {
  if (An) return Ft;
  An = 1;
  var n = Object.getOwnPropertySymbols, e = Object.prototype.hasOwnProperty, t = Object.prototype.propertyIsEnumerable;
  function o(s) {
    if (s == null)
      throw new TypeError("Object.assign cannot be called with null or undefined");
    return Object(s);
  }
  function r() {
    try {
      if (!Object.assign)
        return !1;
      var s = new String("abc");
      if (s[5] = "de", Object.getOwnPropertyNames(s)[0] === "5")
        return !1;
      for (var i = {}, a = 0; a < 10; a++)
        i["_" + String.fromCharCode(a)] = a;
      var c = Object.getOwnPropertyNames(i).map(function(f) {
        return i[f];
      });
      if (c.join("") !== "0123456789")
        return !1;
      var d = {};
      return "abcdefghijklmnopqrst".split("").forEach(function(f) {
        d[f] = f;
      }), Object.keys(Object.assign({}, d)).join("") === "abcdefghijklmnopqrst";
    } catch {
      return !1;
    }
  }
  return Ft = r() ? Object.assign : function(s, i) {
    for (var a, c = o(s), d, f = 1; f < arguments.length; f++) {
      a = Object(arguments[f]);
      for (var p in a)
        e.call(a, p) && (c[p] = a[p]);
      if (n) {
        d = n(a);
        for (var g = 0; g < d.length; g++)
          t.call(a, d[g]) && (c[d[g]] = a[d[g]]);
      }
    }
    return c;
  }, Ft;
}
var jt, zn;
function Dt() {
  if (zn) return jt;
  zn = 1;
  var n = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
  return jt = n, jt;
}
var Nt, Mn;
function xo() {
  return Mn || (Mn = 1, Nt = Function.call.bind(Object.prototype.hasOwnProperty)), Nt;
}
var Pt, In;
function _4() {
  if (In) return Pt;
  In = 1;
  var n = function() {
  };
  if (process.env.NODE_ENV !== "production") {
    var e = /* @__PURE__ */ Dt(), t = {}, o = /* @__PURE__ */ xo();
    n = function(s) {
      var i = "Warning: " + s;
      typeof console < "u" && console.error(i);
      try {
        throw new Error(i);
      } catch {
      }
    };
  }
  function r(s, i, a, c, d) {
    if (process.env.NODE_ENV !== "production") {
      for (var f in s)
        if (o(s, f)) {
          var p;
          try {
            if (typeof s[f] != "function") {
              var g = Error(
                (c || "React class") + ": " + a + " type `" + f + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + typeof s[f] + "`.This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`."
              );
              throw g.name = "Invariant Violation", g;
            }
            p = s[f](i, f, c, a, null, e);
          } catch (m) {
            p = m;
          }
          if (p && !(p instanceof Error) && n(
            (c || "React class") + ": type specification of " + a + " `" + f + "` is invalid; the type checker function must return `null` or an `Error` but returned a " + typeof p + ". You may have forgotten to pass an argument to the type checker creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and shape all require an argument)."
          ), p instanceof Error && !(p.message in t)) {
            t[p.message] = !0;
            var h = d ? d() : "";
            n(
              "Failed " + a + " type: " + p.message + (h ?? "")
            );
          }
        }
    }
  }
  return r.resetWarningCache = function() {
    process.env.NODE_ENV !== "production" && (t = {});
  }, Pt = r, Pt;
}
var Tt, Dn;
function H4() {
  if (Dn) return Tt;
  Dn = 1;
  var n = $o(), e = U4(), t = /* @__PURE__ */ Dt(), o = /* @__PURE__ */ xo(), r = /* @__PURE__ */ _4(), s = function() {
  };
  process.env.NODE_ENV !== "production" && (s = function(a) {
    var c = "Warning: " + a;
    typeof console < "u" && console.error(c);
    try {
      throw new Error(c);
    } catch {
    }
  });
  function i() {
    return null;
  }
  return Tt = function(a, c) {
    var d = typeof Symbol == "function" && Symbol.iterator, f = "@@iterator";
    function p(w) {
      var E = w && (d && w[d] || w[f]);
      if (typeof E == "function")
        return E;
    }
    var g = "<<anonymous>>", h = {
      array: C("array"),
      bigint: C("bigint"),
      bool: C("boolean"),
      func: C("function"),
      number: C("number"),
      object: C("object"),
      string: C("string"),
      symbol: C("symbol"),
      any: P(),
      arrayOf: j,
      element: T(),
      elementType: v(),
      instanceOf: R,
      node: x(),
      objectOf: S,
      oneOf: F,
      oneOfType: y,
      shape: O,
      exact: N
    };
    function m(w, E) {
      return w === E ? w !== 0 || 1 / w === 1 / E : w !== w && E !== E;
    }
    function $(w, E) {
      this.message = w, this.data = E && typeof E == "object" ? E : {}, this.stack = "";
    }
    $.prototype = Error.prototype;
    function A(w) {
      if (process.env.NODE_ENV !== "production")
        var E = {}, _ = 0;
      function H(X, W, B, G, ee, D, ue) {
        if (G = G || g, D = D || B, ue !== t) {
          if (c) {
            var k = new Error(
              "Calling PropTypes validators directly is not supported by the `prop-types` package. Use `PropTypes.checkPropTypes()` to call them. Read more at http://fb.me/use-check-prop-types"
            );
            throw k.name = "Invariant Violation", k;
          } else if (process.env.NODE_ENV !== "production" && typeof console < "u") {
            var ye = G + ":" + B;
            !E[ye] && // Avoid spamming the console because they are often not actionable except for lib authors
            _ < 3 && (s(
              "You are manually calling a React.PropTypes validation function for the `" + D + "` prop on `" + G + "`. This is deprecated and will throw in the standalone `prop-types` package. You may be seeing this warning due to a third-party PropTypes library. See https://fb.me/react-warning-dont-call-proptypes for details."
            ), E[ye] = !0, _++);
          }
        }
        return W[B] == null ? X ? W[B] === null ? new $("The " + ee + " `" + D + "` is marked as required " + ("in `" + G + "`, but its value is `null`.")) : new $("The " + ee + " `" + D + "` is marked as required in " + ("`" + G + "`, but its value is `undefined`.")) : null : w(W, B, G, ee, D);
      }
      var V = H.bind(null, !1);
      return V.isRequired = H.bind(null, !0), V;
    }
    function C(w) {
      function E(_, H, V, X, W, B) {
        var G = _[H], ee = J(G);
        if (ee !== w) {
          var D = Z(G);
          return new $(
            "Invalid " + X + " `" + W + "` of type " + ("`" + D + "` supplied to `" + V + "`, expected ") + ("`" + w + "`."),
            { expectedType: w }
          );
        }
        return null;
      }
      return A(E);
    }
    function P() {
      return A(i);
    }
    function j(w) {
      function E(_, H, V, X, W) {
        if (typeof w != "function")
          return new $("Property `" + W + "` of component `" + V + "` has invalid PropType notation inside arrayOf.");
        var B = _[H];
        if (!Array.isArray(B)) {
          var G = J(B);
          return new $("Invalid " + X + " `" + W + "` of type " + ("`" + G + "` supplied to `" + V + "`, expected an array."));
        }
        for (var ee = 0; ee < B.length; ee++) {
          var D = w(B, ee, V, X, W + "[" + ee + "]", t);
          if (D instanceof Error)
            return D;
        }
        return null;
      }
      return A(E);
    }
    function T() {
      function w(E, _, H, V, X) {
        var W = E[_];
        if (!a(W)) {
          var B = J(W);
          return new $("Invalid " + V + " `" + X + "` of type " + ("`" + B + "` supplied to `" + H + "`, expected a single ReactElement."));
        }
        return null;
      }
      return A(w);
    }
    function v() {
      function w(E, _, H, V, X) {
        var W = E[_];
        if (!n.isValidElementType(W)) {
          var B = J(W);
          return new $("Invalid " + V + " `" + X + "` of type " + ("`" + B + "` supplied to `" + H + "`, expected a single ReactElement type."));
        }
        return null;
      }
      return A(w);
    }
    function R(w) {
      function E(_, H, V, X, W) {
        if (!(_[H] instanceof w)) {
          var B = w.name || g, G = ne(_[H]);
          return new $("Invalid " + X + " `" + W + "` of type " + ("`" + G + "` supplied to `" + V + "`, expected ") + ("instance of `" + B + "`."));
        }
        return null;
      }
      return A(E);
    }
    function F(w) {
      if (!Array.isArray(w))
        return process.env.NODE_ENV !== "production" && (arguments.length > 1 ? s(
          "Invalid arguments supplied to oneOf, expected an array, got " + arguments.length + " arguments. A common mistake is to write oneOf(x, y, z) instead of oneOf([x, y, z])."
        ) : s("Invalid argument supplied to oneOf, expected an array.")), i;
      function E(_, H, V, X, W) {
        for (var B = _[H], G = 0; G < w.length; G++)
          if (m(B, w[G]))
            return null;
        var ee = JSON.stringify(w, function(ue, k) {
          var ye = Z(k);
          return ye === "symbol" ? String(k) : k;
        });
        return new $("Invalid " + X + " `" + W + "` of value `" + String(B) + "` " + ("supplied to `" + V + "`, expected one of " + ee + "."));
      }
      return A(E);
    }
    function S(w) {
      function E(_, H, V, X, W) {
        if (typeof w != "function")
          return new $("Property `" + W + "` of component `" + V + "` has invalid PropType notation inside objectOf.");
        var B = _[H], G = J(B);
        if (G !== "object")
          return new $("Invalid " + X + " `" + W + "` of type " + ("`" + G + "` supplied to `" + V + "`, expected an object."));
        for (var ee in B)
          if (o(B, ee)) {
            var D = w(B, ee, V, X, W + "." + ee, t);
            if (D instanceof Error)
              return D;
          }
        return null;
      }
      return A(E);
    }
    function y(w) {
      if (!Array.isArray(w))
        return process.env.NODE_ENV !== "production" && s("Invalid argument supplied to oneOfType, expected an instance of array."), i;
      for (var E = 0; E < w.length; E++) {
        var _ = w[E];
        if (typeof _ != "function")
          return s(
            "Invalid argument supplied to oneOfType. Expected an array of check functions, but received " + de(_) + " at index " + E + "."
          ), i;
      }
      function H(V, X, W, B, G) {
        for (var ee = [], D = 0; D < w.length; D++) {
          var ue = w[D], k = ue(V, X, W, B, G, t);
          if (k == null)
            return null;
          k.data && o(k.data, "expectedType") && ee.push(k.data.expectedType);
        }
        var ye = ee.length > 0 ? ", expected one of type [" + ee.join(", ") + "]" : "";
        return new $("Invalid " + B + " `" + G + "` supplied to " + ("`" + W + "`" + ye + "."));
      }
      return A(H);
    }
    function x() {
      function w(E, _, H, V, X) {
        return M(E[_]) ? null : new $("Invalid " + V + " `" + X + "` supplied to " + ("`" + H + "`, expected a ReactNode."));
      }
      return A(w);
    }
    function L(w, E, _, H, V) {
      return new $(
        (w || "React class") + ": " + E + " type `" + _ + "." + H + "` is invalid; it must be a function, usually from the `prop-types` package, but received `" + V + "`."
      );
    }
    function O(w) {
      function E(_, H, V, X, W) {
        var B = _[H], G = J(B);
        if (G !== "object")
          return new $("Invalid " + X + " `" + W + "` of type `" + G + "` " + ("supplied to `" + V + "`, expected `object`."));
        for (var ee in w) {
          var D = w[ee];
          if (typeof D != "function")
            return L(V, X, W, ee, Z(D));
          var ue = D(B, ee, V, X, W + "." + ee, t);
          if (ue)
            return ue;
        }
        return null;
      }
      return A(E);
    }
    function N(w) {
      function E(_, H, V, X, W) {
        var B = _[H], G = J(B);
        if (G !== "object")
          return new $("Invalid " + X + " `" + W + "` of type `" + G + "` " + ("supplied to `" + V + "`, expected `object`."));
        var ee = e({}, _[H], w);
        for (var D in ee) {
          var ue = w[D];
          if (o(w, D) && typeof ue != "function")
            return L(V, X, W, D, Z(ue));
          if (!ue)
            return new $(
              "Invalid " + X + " `" + W + "` key `" + D + "` supplied to `" + V + "`.\nBad object: " + JSON.stringify(_[H], null, "  ") + `
Valid keys: ` + JSON.stringify(Object.keys(w), null, "  ")
            );
          var k = ue(B, D, V, X, W + "." + D, t);
          if (k)
            return k;
        }
        return null;
      }
      return A(E);
    }
    function M(w) {
      switch (typeof w) {
        case "number":
        case "string":
        case "undefined":
          return !0;
        case "boolean":
          return !w;
        case "object":
          if (Array.isArray(w))
            return w.every(M);
          if (w === null || a(w))
            return !0;
          var E = p(w);
          if (E) {
            var _ = E.call(w), H;
            if (E !== w.entries) {
              for (; !(H = _.next()).done; )
                if (!M(H.value))
                  return !1;
            } else
              for (; !(H = _.next()).done; ) {
                var V = H.value;
                if (V && !M(V[1]))
                  return !1;
              }
          } else
            return !1;
          return !0;
        default:
          return !1;
      }
    }
    function Q(w, E) {
      return w === "symbol" ? !0 : E ? E["@@toStringTag"] === "Symbol" || typeof Symbol == "function" && E instanceof Symbol : !1;
    }
    function J(w) {
      var E = typeof w;
      return Array.isArray(w) ? "array" : w instanceof RegExp ? "object" : Q(E, w) ? "symbol" : E;
    }
    function Z(w) {
      if (typeof w > "u" || w === null)
        return "" + w;
      var E = J(w);
      if (E === "object") {
        if (w instanceof Date)
          return "date";
        if (w instanceof RegExp)
          return "regexp";
      }
      return E;
    }
    function de(w) {
      var E = Z(w);
      switch (E) {
        case "array":
        case "object":
          return "an " + E;
        case "boolean":
        case "date":
        case "regexp":
          return "a " + E;
        default:
          return E;
      }
    }
    function ne(w) {
      return !w.constructor || !w.constructor.name ? g : w.constructor.name;
    }
    return h.checkPropTypes = r, h.resetWarningCache = r.resetWarningCache, h.PropTypes = h, h;
  }, Tt;
}
var Rt, Un;
function V4() {
  if (Un) return Rt;
  Un = 1;
  var n = /* @__PURE__ */ Dt();
  function e() {
  }
  function t() {
  }
  return t.resetWarningCache = e, Rt = function() {
    function o(i, a, c, d, f, p) {
      if (p !== n) {
        var g = new Error(
          "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types"
        );
        throw g.name = "Invariant Violation", g;
      }
    }
    o.isRequired = o;
    function r() {
      return o;
    }
    var s = {
      array: o,
      bigint: o,
      bool: o,
      func: o,
      number: o,
      object: o,
      string: o,
      symbol: o,
      any: o,
      arrayOf: r,
      element: o,
      elementType: o,
      instanceOf: r,
      node: o,
      objectOf: r,
      oneOf: r,
      oneOfType: r,
      shape: r,
      exact: r,
      checkPropTypes: t,
      resetWarningCache: e
    };
    return s.PropTypes = s, s;
  }, Rt;
}
var _n;
function B4() {
  if (_n) return nt.exports;
  if (_n = 1, process.env.NODE_ENV !== "production") {
    var n = $o(), e = !0;
    nt.exports = /* @__PURE__ */ H4()(n.isElement, e);
  } else
    nt.exports = /* @__PURE__ */ V4()();
  return nt.exports;
}
var W4 = /* @__PURE__ */ B4();
const U = /* @__PURE__ */ qo(W4);
function Y4(n) {
  return q({ attr: { viewBox: "0 0 24 24", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M18 3a3 3 0 0 1 2.995 2.824l.005 .176v12a3 3 0 0 1 -2.824 2.995l-.176 .005h-12a3 3 0 0 1 -2.995 -2.824l-.005 -.176v-12a3 3 0 0 1 2.824 -2.995l.176 -.005h12zm0 2h-9v14h9a1 1 0 0 0 .993 -.883l.007 -.117v-12a1 1 0 0 0 -.883 -.993l-.117 -.007zm-2.293 4.293a1 1 0 0 1 .083 1.32l-.083 .094l-1.292 1.293l1.292 1.293a1 1 0 0 1 .083 1.32l-.083 .094a1 1 0 0 1 -1.32 .083l-.094 -.083l-2 -2a1 1 0 0 1 -.083 -1.32l.083 -.094l2 -2a1 1 0 0 1 1.414 0z" }, child: [] }] })(n);
}
function K4(n) {
  return q({ attr: { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, child: [{ tag: "path", attr: { d: "M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z" }, child: [] }, { tag: "path", attr: { d: "M9 4v16" }, child: [] }, { tag: "path", attr: { d: "M14 10l2 2l-2 2" }, child: [] }] })(n);
}
const Ut = ({ collapsibleNav: n, isNavigationPaneOpen: e, setNavigationPaneOpen: t }) => {
  const [o, r] = I([]), [s, i] = I([]), [a, c] = I([]), [d, f] = I(!1), { currentPath: p, setCurrentPath: g, onFolderChange: h } = Fe(), m = he(null), $ = he([]), A = he(null), C = Qe(() => {
    f(!1);
  }), P = be(), j = he(null);
  se(() => {
    r(() => {
      let S = "";
      return p == null ? void 0 : p.split("/").map((y) => ({
        name: y || P("home"),
        path: y === "" ? y : S += `/${y}`
      }));
    }), i([]), c([]);
  }, [p, P]);
  const T = (S) => {
    g(S), h == null || h(S);
  }, v = () => {
    var J;
    const S = m.current.clientWidth, y = getComputedStyle(m.current), x = parseFloat(y.paddingLeft), L = n ? 2 : 0, N = n ? ((J = j.current) == null ? void 0 : J.clientWidth) + 1 : 0, M = s.length > 0 ? 1 : 0, Q = parseFloat(y.gap) * (o.length + M + L);
    return S - (x + Q + N);
  }, R = () => {
    var L;
    const S = v(), y = $.current.reduce((O, N) => N ? O + N.clientWidth : O, 0), x = ((L = A.current) == null ? void 0 : L.clientWidth) || 0;
    return S - (y + x);
  }, F = () => m.current.scrollWidth > m.current.clientWidth;
  return se(() => {
    var S;
    if (F()) {
      const y = o[1], x = (S = $.current[1]) == null ? void 0 : S.clientWidth;
      c((L) => [...L, x]), i((L) => [...L, y]), r((L) => L.filter((O, N) => N !== 1));
    } else if (s.length > 0 && R() > a.at(-1)) {
      const y = [o[0], s.at(-1), ...o.slice(1)];
      r(y), i((x) => x.slice(0, -1)), c((x) => x.slice(0, -1));
    }
  }, [F]), /* @__PURE__ */ l.jsxs("div", { className: "bread-crumb-container", children: [
    /* @__PURE__ */ l.jsxs("div", { className: "breadcrumb", ref: m, children: [
      n && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx(
          "div",
          {
            ref: j,
            className: "nav-toggler",
            title: `${P(e ? "collapseNavigationPane" : "expandNavigationPane")}`,
            children: /* @__PURE__ */ l.jsx(
              "span",
              {
                className: "folder-name folder-name-btn",
                onClick: () => t((S) => !S),
                children: e ? /* @__PURE__ */ l.jsx(Y4, {}) : /* @__PURE__ */ l.jsx(K4, {})
              }
            )
          }
        ),
        /* @__PURE__ */ l.jsx("div", { className: "divider" })
      ] }),
      o.map((S, y) => /* @__PURE__ */ l.jsxs("div", { style: { display: "contents" }, children: [
        /* @__PURE__ */ l.jsxs(
          "span",
          {
            className: "folder-name",
            onClick: () => T(S.path),
            ref: (x) => $.current[y] = x,
            children: [
              y === 0 ? /* @__PURE__ */ l.jsx(ir, {}) : /* @__PURE__ */ l.jsx(ur, {}),
              S.name
            ]
          }
        ),
        (s == null ? void 0 : s.length) > 0 && y === 0 && /* @__PURE__ */ l.jsx(
          "button",
          {
            className: "folder-name folder-name-btn",
            onClick: () => f(!0),
            ref: A,
            title: P("showMoreFolder"),
            children: /* @__PURE__ */ l.jsx(dr, { size: 22, className: "hidden-folders" })
          }
        )
      ] }, y))
    ] }),
    d && /* @__PURE__ */ l.jsx("ul", { ref: C.ref, className: "hidden-folders-container", children: s.map((S, y) => /* @__PURE__ */ l.jsx(
      "li",
      {
        onClick: () => {
          T(S.path), f(!1);
        },
        children: S.name
      },
      y
    )) })
  ] });
};
Ut.displayName = "BreadCrumb";
Ut.propTypes = {
  isNavigationPaneOpen: U.bool.isRequired,
  setNavigationPaneOpen: U.func.isRequired
};
const ft = (n) => ({
  pdf: /* @__PURE__ */ l.jsx(gr, { size: n }),
  jpg: /* @__PURE__ */ l.jsx(Ct, { size: n }),
  jpeg: /* @__PURE__ */ l.jsx(Ct, { size: n }),
  png: /* @__PURE__ */ l.jsx(Ct, { size: n }),
  txt: /* @__PURE__ */ l.jsx(mr, { size: n }),
  doc: /* @__PURE__ */ l.jsx(dn, { size: n }),
  docx: /* @__PURE__ */ l.jsx(dn, { size: n }),
  mp4: /* @__PURE__ */ l.jsx(cn, { size: n }),
  webm: /* @__PURE__ */ l.jsx(cn, { size: n }),
  mp3: /* @__PURE__ */ l.jsx(sn, { size: n }),
  m4a: /* @__PURE__ */ l.jsx(sn, { size: n }),
  zip: /* @__PURE__ */ l.jsx(vr, { size: n }),
  ppt: /* @__PURE__ */ l.jsx(ln, { size: n }),
  pptx: /* @__PURE__ */ l.jsx(ln, { size: n }),
  xls: /* @__PURE__ */ l.jsx(an, { size: n }),
  xlsx: /* @__PURE__ */ l.jsx(an, { size: n }),
  exe: /* @__PURE__ */ l.jsx(hr, { size: n }),
  html: /* @__PURE__ */ l.jsx(ve, { size: n }),
  css: /* @__PURE__ */ l.jsx(ve, { size: n }),
  js: /* @__PURE__ */ l.jsx(ve, { size: n }),
  php: /* @__PURE__ */ l.jsx(ve, { size: n }),
  py: /* @__PURE__ */ l.jsx(ve, { size: n }),
  java: /* @__PURE__ */ l.jsx(ve, { size: n }),
  cpp: /* @__PURE__ */ l.jsx(ve, { size: n }),
  c: /* @__PURE__ */ l.jsx(ve, { size: n }),
  ts: /* @__PURE__ */ l.jsx(ve, { size: n }),
  jsx: /* @__PURE__ */ l.jsx(ve, { size: n }),
  tsx: /* @__PURE__ */ l.jsx(ve, { size: n }),
  json: /* @__PURE__ */ l.jsx(ve, { size: n }),
  xml: /* @__PURE__ */ l.jsx(ve, { size: n }),
  sql: /* @__PURE__ */ l.jsx(ve, { size: n }),
  csv: /* @__PURE__ */ l.jsx(ve, { size: n }),
  md: /* @__PURE__ */ l.jsx(ve, { size: n }),
  svg: /* @__PURE__ */ l.jsx(ve, { size: n })
}), wo = (n, e, t) => {
  if (t.find((o) => o.name === n)) {
    const r = n;
    let s = 0;
    const i = new RegExp(`${r} \\(\\d+\\)`);
    t.forEach((d) => {
      const f = d.isDirectory ? d.name : d.name.split(".").slice(0, -1).join(".");
      if (i.test(f)) {
        const p = f.split(`${r} (`).pop().slice(0, -1), g = parseInt(p);
        !isNaN(g) && g > s && (s = g);
      }
    });
    const a = ` (${++s})`;
    return r + a + "";
  } else
    return n;
}, bo = ({ nameInputRef: n, id: e, maxLength: t, value: o, onChange: r, onKeyDown: s, onClick: i, rows: a }) => /* @__PURE__ */ l.jsx(
  "textarea",
  {
    ref: n,
    id: e,
    className: "rename-file",
    maxLength: t,
    value: o,
    onChange: r,
    onKeyDown: s,
    onClick: i,
    rows: a
  }
), Co = ({ message: n, xPlacement: e, yPlacement: t }) => /* @__PURE__ */ l.jsx("p", { className: `error-tooltip ${e} ${t}`, children: n }), q4 = 220, G4 = ({ filesViewRef: n, file: e, onCreateFolder: t, triggerAction: o }) => {
  const [r, s] = I(e.name), [i, a] = I(!1), [c, d] = I(""), [f, p] = I("right"), [g, h] = I("bottom"), m = Qe((F) => {
    F.preventDefault(), F.stopPropagation();
  }), { currentFolder: $, currentPathFiles: A, setCurrentPathFiles: C } = Fe(), { activeLayout: P } = Ae(), j = be(), T = (F) => {
    s(F.target.value), a(!1);
  }, v = (F) => {
    if (F.stopPropagation(), F.key === "Enter") {
      F.preventDefault(), R();
      return;
    }
    if (F.key === "Escape") {
      F.preventDefault(), o.close(), C((y) => y.filter((x) => x.key !== e.key));
      return;
    }
    /[\\/:*?"<>|]/.test(F.key) ? (F.preventDefault(), d(j("invalidFileName")), a(!0)) : (a(!1), d(""));
  };
  se(() => {
    if (i) {
      const F = setTimeout(() => {
        a(!1), d("");
      }, 7e3);
      return () => clearTimeout(F);
    }
  }, [i]);
  function R() {
    var x, L;
    let F = r.trim();
    const S = A.filter((O) => !(O.key && O.key === e.key));
    if (S.find((O) => O.name.toLowerCase() === F.toLowerCase())) {
      d(j("folderExists", { renameFile: F })), a(!0), (x = m.ref.current) == null || x.focus(), (L = m.ref.current) == null || L.select(), m.setIsClicked(!1);
      return;
    }
    F === "" && (F = wo("New Folder", !0, S)), Me(t, "onCreateFolder", F, $), C((O) => O.filter((N) => N.key !== e.key)), o.close();
  }
  return se(() => {
    var F, S, y;
    if ((F = m.ref.current) == null || F.focus(), (S = m.ref.current) == null || S.select(), (y = m.ref) != null && y.current) {
      const N = n.current.getBoundingClientRect(), M = m.ref.current, Q = M.getBoundingClientRect();
      N.right - Q.left > 313 ? p("right") : p("left"), N.bottom - (Q.top + M.clientHeight) > 88 ? h("bottom") : h("top");
    }
  }, []), se(() => {
    m.isClicked && R();
  }, [m.isClicked]), /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsx(
      bo,
      {
        id: "newFolder",
        nameInputRef: m.ref,
        maxLength: q4,
        value: r,
        onChange: T,
        onKeyDown: v,
        onClick: (F) => F.stopPropagation(),
        ...P === "list" && { rows: 1 }
      }
    ),
    i && /* @__PURE__ */ l.jsx(
      Co,
      {
        message: c,
        xPlacement: f,
        yPlacement: g
      }
    )
  ] });
}, Ve = ({ onClick: n, onKeyDown: e, type: t = "primary", padding: o = "0.4rem 0.8rem", children: r }) => /* @__PURE__ */ l.jsx(
  "button",
  {
    onClick: n,
    onKeyDown: e,
    className: `fm-button fm-button-${t}`,
    style: { padding: o },
    children: r
  }
);
function J4(n) {
  return q({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "M85.57 446.25h340.86a32 32 0 0 0 28.17-47.17L284.18 82.58c-12.09-22.44-44.27-22.44-56.36 0L57.4 399.08a32 32 0 0 0 28.17 47.17z" }, child: [] }, { tag: "path", attr: { fill: "none", strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "32", d: "m250.26 195.39 5.74 122 5.73-121.95a5.74 5.74 0 0 0-5.79-6h0a5.74 5.74 0 0 0-5.68 5.95z" }, child: [] }, { tag: "path", attr: { d: "M256 397.25a20 20 0 1 1 20-20 20 20 0 0 1-20 20z" }, child: [] }] })(n);
}
const So = ({
  children: n,
  show: e,
  setShow: t,
  heading: o,
  dialogWidth: r = "25%",
  contentClassName: s = "",
  closeButton: i = !0
}) => {
  const a = he(null), c = be(), d = (f) => {
    f.key === "Escape" && t(!1);
  };
  return se(() => {
    e ? a.current.showModal() : a.current.close();
  }, [e]), /* @__PURE__ */ l.jsxs(
    "dialog",
    {
      ref: a,
      className: "fm-modal dialog",
      style: { width: r },
      onKeyDown: d,
      children: [
        /* @__PURE__ */ l.jsxs("div", { className: "fm-modal-header", children: [
          /* @__PURE__ */ l.jsx("span", { className: "fm-modal-heading", children: o }),
          i && /* @__PURE__ */ l.jsx(
            cr,
            {
              size: 18,
              onClick: () => t(!1),
              className: "close-icon",
              title: c("close")
            }
          )
        ] }),
        n
      ]
    }
  );
}, He = (n) => n.split(".").pop(), X4 = 220, Z4 = ({ filesViewRef: n, file: e, onRename: t, triggerAction: o }) => {
  const [r, s] = I(e == null ? void 0 : e.name), [i, a] = I(!1), [c, d] = I(!1), [f, p] = I(""), [g, h] = I("right"), [m, $] = I("bottom"), { currentPathFiles: A, setCurrentPathFiles: C } = Fe(), { activeLayout: P } = Ae(), j = be(), T = he(null), v = Qe((y) => {
    var x;
    (x = T.current) != null && x.contains(y.target) || (y.preventDefault(), y.stopPropagation());
  }), R = (y) => {
    if (y.stopPropagation(), y.key === "Enter") {
      y.preventDefault(), v.setIsClicked(!0);
      return;
    }
    if (y.key === "Escape") {
      y.preventDefault(), C(
        (L) => L.map((O) => (O.key === e.key && (O.isEditing = !1), O))
      ), o.close();
      return;
    }
    /[\\/:*?"<>|]/.test(y.key) ? (y.preventDefault(), p(j("invalidFileName")), d(!0)) : d(!1);
  };
  se(() => {
    if (c) {
      const y = setTimeout(() => {
        d(!1), p("");
      }, 7e3);
      return () => clearTimeout(y);
    }
  }, [c]);
  function F(y) {
    if (r === "" || r === e.name) {
      C(
        (x) => x.map((L) => (L.key === e.key && (L.isEditing = !1), L))
      ), o.close();
      return;
    } else if (A.some((x) => x.name === r)) {
      d(!0), p(j("folderExists", { renameFile: r })), v.setIsClicked(!1);
      return;
    } else if (!e.isDirectory && !y) {
      const x = He(e.name), L = He(r);
      if (x !== L) {
        a(!0);
        return;
      }
    }
    d(!1), Me(t, "onRename", e, r), C((x) => x.filter((L) => L.key !== e.key)), o.close();
  }
  const S = () => {
    var y, x, L, O, N, M;
    if ((x = (y = v.ref) == null ? void 0 : y.current) == null || x.focus(), e.isDirectory)
      (O = (L = v.ref) == null ? void 0 : L.current) == null || O.select();
    else {
      const Q = He(e.name), J = e.name.length - Q.length - 1;
      (M = (N = v.ref) == null ? void 0 : N.current) == null || M.setSelectionRange(0, J);
    }
  };
  return se(() => {
    var y;
    if (S(), (y = v.ref) != null && y.current) {
      const N = n.current.getBoundingClientRect(), M = v.ref.current, Q = M.getBoundingClientRect();
      N.right - Q.left > 313 ? h("right") : h("left"), N.bottom - (Q.top + M.clientHeight) > 88 ? $("bottom") : $("top");
    }
  }, []), se(() => {
    v.isClicked && F(!1), S();
  }, [v.isClicked]), /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
    /* @__PURE__ */ l.jsx(
      bo,
      {
        id: e.name,
        nameInputRef: v.ref,
        maxLength: X4,
        value: r,
        onChange: (y) => {
          s(y.target.value), d(!1);
        },
        onKeyDown: R,
        onClick: (y) => y.stopPropagation(),
        ...P === "list" && { rows: 1 }
      }
    ),
    c && /* @__PURE__ */ l.jsx(
      Co,
      {
        message: f,
        xPlacement: g,
        yPlacement: m
      }
    ),
    /* @__PURE__ */ l.jsx(
      So,
      {
        heading: j("rename"),
        show: i,
        setShow: a,
        dialogWidth: "25vw",
        closeButton: !1,
        children: /* @__PURE__ */ l.jsxs("div", { className: "fm-rename-folder-container", ref: T, children: [
          /* @__PURE__ */ l.jsx("div", { className: "fm-rename-folder-input", children: /* @__PURE__ */ l.jsxs("div", { className: "fm-rename-warning", children: [
            /* @__PURE__ */ l.jsx(J4, { size: 70, color: "orange" }),
            /* @__PURE__ */ l.jsx("div", { children: j("fileNameChangeWarning") })
          ] }) }),
          /* @__PURE__ */ l.jsxs("div", { className: "fm-rename-folder-action", children: [
            /* @__PURE__ */ l.jsx(
              Ve,
              {
                type: "secondary",
                onClick: () => {
                  C(
                    (y) => y.map((x) => (x.key === e.key && (x.isEditing = !1), x))
                  ), a(!1), o.close();
                },
                children: j("no")
              }
            ),
            /* @__PURE__ */ l.jsx(
              Ve,
              {
                type: "danger",
                onClick: () => {
                  a(!1), F(!0);
                },
                children: j("yes")
              }
            )
          ] })
        ] })
      }
    )
  ] });
}, vt = (n, e = 2) => {
  if (isNaN(n)) return "";
  const t = n / 1024, o = t / 1024, r = o / 1024;
  if (t < 1024)
    return `${t.toFixed(e)} KB`;
  if (o < 1024)
    return `${o.toFixed(e)} MB`;
  if (o >= 1024)
    return `${r.toFixed(e)} GB`;
}, Q4 = (n) => {
  if (!n || isNaN(Date.parse(n))) return "";
  n = new Date(n);
  let e = n.getHours();
  const t = n.getMinutes(), o = e >= 12 ? "PM" : "AM";
  e = e % 12, e = e || 12;
  const r = n.getMonth() + 1, s = n.getDate(), i = n.getFullYear();
  return `${r}/${s}/${i} ${e}:${t < 10 ? "0" + t : t} ${o}`;
}, Eo = ({ name: n, id: e, checked: t, onClick: o, onChange: r, className: s = "", title: i, disabled: a = !1 }) => /* @__PURE__ */ l.jsx(
  "input",
  {
    className: `fm-checkbox ${s}`,
    type: "checkbox",
    name: n,
    id: e,
    checked: t,
    onClick: o,
    onChange: r,
    title: i,
    disabled: a
  }
), Lt = 50, ey = ({
  index: n,
  file: e,
  onCreateFolder: t,
  onRename: o,
  enableFilePreview: r,
  onFileOpen: s,
  filesViewRef: i,
  selectedFileIndexes: a,
  triggerAction: c,
  handleContextMenu: d,
  setLastSelectedFile: f,
  draggable: p
}) => {
  var ye, Te, je, Oe;
  const [g, h] = I(!1), [m, $] = I(0), [A, C] = I("hidden"), [P, j] = I(""), [T, v] = I(null), { activeLayout: R } = Ae(), F = R === "grid" ? 48 : 20, S = ft(F), { setCurrentPath: y, currentPathFiles: x, onFolderChange: L } = Fe(), { setSelectedFiles: O } = Le(), { clipBoard: N, handleCutCopy: M, setClipBoard: Q, handlePasting: J } = gt(), Z = he(null), de = ft(Lt), ne = (N == null ? void 0 : N.isMoving) && N.files.find((te) => te.name === e.name && te.path === e.path), w = () => {
    s(e), e.isDirectory ? (y(e.path), L == null || L(e.path), O([])) : r && c.show("previewFile");
  }, E = (te, ge) => {
    if (a.length > 0 && te) {
      let Ce = !1, Re = a[0], ke = n;
      if (Re >= ke) {
        const yt = Re;
        Re = ke, ke = yt, Ce = !0;
      }
      const Ie = x.slice(Re, ke + 1);
      O(Ce ? Ie.reverse() : Ie);
    } else a.length > 0 && ge ? O((Ce) => {
      const Re = Ce.filter((ke) => ke.path !== e.path);
      return Ce.length === Re.length ? [...Ce, e] : Re;
    }) : O([e]);
  }, _ = (te) => {
    if (te.stopPropagation(), e.isEditing) return;
    E(te.shiftKey, te.ctrlKey);
    const ge = (/* @__PURE__ */ new Date()).getTime();
    if (ge - m < 300) {
      w();
      return;
    }
    $(ge);
  }, H = (te) => {
    te.key === "Enter" && (te.stopPropagation(), O([e]), w());
  }, V = (te) => {
    te.stopPropagation(), te.preventDefault(), !e.isEditing && (g || O([e]), f(e), d(te, !0));
  }, X = () => {
    C("visible");
  }, W = () => {
    !g && C("hidden");
  }, B = (te) => {
    te.target.checked ? O((ge) => [...ge, e]) : O((ge) => ge.filter((Ce) => Ce.name !== e.name && Ce.path !== e.path)), h(te.target.checked);
  }, G = (te) => {
    te.dataTransfer.setDragImage(Z.current, 30, 50), te.dataTransfer.effectAllowed = "copy", M(!0);
  }, ee = () => Q(null), D = (te) => {
    te.preventDefault(), g || !e.isDirectory ? te.dataTransfer.dropEffect = "none" : (v({ x: te.clientX, y: te.clientY + 12 }), te.dataTransfer.dropEffect = "copy", j("file-drop-zone"));
  }, ue = (te) => {
    te.currentTarget.contains(te.relatedTarget) || (j((ge) => ge && ""), v(null));
  }, k = (te) => {
    te.preventDefault(), !(g || !e.isDirectory) && (J(e), j((ge) => ge && ""), v(null));
  };
  return se(() => {
    h(a.includes(n)), C(a.includes(n) ? "visible" : "hidden");
  }, [a]), /* @__PURE__ */ l.jsxs(
    "div",
    {
      className: `file-item-container ${P} ${g || e.isEditing ? "file-selected" : ""} ${ne ? "file-moving" : ""}`,
      tabIndex: 0,
      title: e.name,
      onClick: _,
      onKeyDown: H,
      onContextMenu: V,
      onMouseOver: X,
      onMouseLeave: W,
      draggable: g && p,
      onDragStart: G,
      onDragEnd: ee,
      onDragEnter: D,
      onDragOver: D,
      onDragLeave: ue,
      onDrop: k,
      children: [
        /* @__PURE__ */ l.jsxs("div", { className: "file-item", children: [
          !e.isEditing && /* @__PURE__ */ l.jsx(
            Eo,
            {
              name: e.name,
              id: e.name,
              checked: g,
              className: `selection-checkbox ${A}`,
              onChange: B,
              onClick: (te) => te.stopPropagation()
            }
          ),
          e.isDirectory ? /* @__PURE__ */ l.jsx(un, { size: F }) : /* @__PURE__ */ l.jsx(l.Fragment, { children: S[(Te = (ye = e.name) == null ? void 0 : ye.split(".").pop()) == null ? void 0 : Te.toLowerCase()] ?? /* @__PURE__ */ l.jsx(at, { size: F }) }),
          e.isEditing ? /* @__PURE__ */ l.jsx("div", { className: `rename-file-container ${R}`, children: c.actionType === "createFolder" ? /* @__PURE__ */ l.jsx(
            G4,
            {
              filesViewRef: i,
              file: e,
              onCreateFolder: t,
              triggerAction: c
            }
          ) : /* @__PURE__ */ l.jsx(
            Z4,
            {
              filesViewRef: i,
              file: e,
              onRename: o,
              triggerAction: c
            }
          ) }) : /* @__PURE__ */ l.jsx("span", { className: "text-truncate file-name", children: e.name })
        ] }),
        R === "list" && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
          /* @__PURE__ */ l.jsx("div", { className: "modified-date", children: Q4(e.updatedAt) }),
          /* @__PURE__ */ l.jsx("div", { className: "size", children: (e == null ? void 0 : e.size) > 0 ? vt(e == null ? void 0 : e.size) : "" })
        ] }),
        T && /* @__PURE__ */ l.jsxs(
          "div",
          {
            style: {
              top: `${T.y}px`,
              left: `${T.x}px`
            },
            className: "drag-move-tooltip",
            children: [
              "Move to ",
              /* @__PURE__ */ l.jsx("span", { className: "drop-zone-file-name", children: e.name })
            ]
          }
        ),
        /* @__PURE__ */ l.jsx("div", { ref: Z, className: "drag-icon", children: e.isDirectory ? /* @__PURE__ */ l.jsx(un, { size: Lt }) : /* @__PURE__ */ l.jsx(l.Fragment, { children: de[(Oe = (je = e.name) == null ? void 0 : je.split(".").pop()) == null ? void 0 : Oe.toLowerCase()] ?? /* @__PURE__ */ l.jsx(at, { size: Lt }) }) })
      ]
    }
  );
}, ty = ({ subMenuRef: n, list: e, position: t = "right" }) => /* @__PURE__ */ l.jsx("ul", { ref: n, className: `sub-menu ${t}`, children: e == null ? void 0 : e.map((o) => /* @__PURE__ */ l.jsxs("li", { onClick: o.onClick, children: [
  /* @__PURE__ */ l.jsx("span", { className: "item-selected", children: o.selected && /* @__PURE__ */ l.jsx(ro, { size: 13 }) }),
  o.icon,
  /* @__PURE__ */ l.jsx("span", { children: o.title })
] }, o.title)) }), ny = ({ filesViewRef: n, contextMenuRef: e, menuItems: t, visible: o, clickPosition: r }) => {
  const [s, i] = I(0), [a, c] = I(0), [d, f] = I(null), [p, g] = I("right"), h = he(null), m = () => {
    const { clickX: C, clickY: P } = r, j = n.current, T = j.getBoundingClientRect(), v = j.offsetWidth - j.clientWidth, R = e.current.getBoundingClientRect(), F = R.width, S = R.height, y = C - T.left, x = T.width - (y + v) > F, L = !x, O = P - T.top, N = T.height - O > S, M = !N;
    x ? (i(`${y}px`), g("right")) : L && (i(`${y - F}px`), g("left")), N ? c(`${O + j.scrollTop}px`) : M && c(`${O + j.scrollTop - S}px`);
  }, $ = (C) => {
    C.preventDefault(), C.stopPropagation();
  }, A = (C) => {
    f(C);
  };
  if (se(() => {
    o && e.current ? m() : (c(0), i(0), f(null));
  }, [o]), o)
    return /* @__PURE__ */ l.jsx(
      "div",
      {
        ref: e,
        onContextMenu: $,
        onClick: (C) => C.stopPropagation(),
        className: `fm-context-menu ${a ? "visible" : "hidden"}`,
        style: {
          top: a,
          left: s
        },
        children: /* @__PURE__ */ l.jsx("div", { className: "file-context-menu-list", children: /* @__PURE__ */ l.jsx("ul", { children: t.filter((C) => !C.hidden).map((C, P) => {
          const j = C.hasOwnProperty("children"), T = d === P && j;
          return /* @__PURE__ */ l.jsxs("div", { children: [
            /* @__PURE__ */ l.jsxs(
              "li",
              {
                onClick: C.onClick,
                className: `${C.className ?? ""} ${T ? "active" : ""}`,
                onMouseOver: () => A(P),
                children: [
                  C.icon,
                  /* @__PURE__ */ l.jsx("span", { children: C.title }),
                  j && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
                    /* @__PURE__ */ l.jsx(pr, { size: 14, className: "list-expand-icon" }),
                    T && /* @__PURE__ */ l.jsx(
                      ty,
                      {
                        subMenuRef: h,
                        list: C.children,
                        position: p
                      }
                    )
                  ] })
                ]
              }
            ),
            C.divider && P !== t.filter((v) => !v.hidden).length - 1 && /* @__PURE__ */ l.jsx("div", { className: "divider" })
          ] }, C.title);
        }) }) })
      }
    );
};
function oy(n) {
  return q({ attr: { viewBox: "0 0 256 256", fill: "currentColor" }, child: [{ tag: "path", attr: { d: "M245,110.64A16,16,0,0,0,232,104H216V88a16,16,0,0,0-16-16H130.67L102.94,51.2a16.14,16.14,0,0,0-9.6-3.2H40A16,16,0,0,0,24,64V208h0a8,8,0,0,0,8,8H211.1a8,8,0,0,0,7.59-5.47l28.49-85.47A16.05,16.05,0,0,0,245,110.64ZM93.34,64,123.2,86.4A8,8,0,0,0,128,88h72v16H69.77a16,16,0,0,0-15.18,10.94L40,158.7V64Zm112,136H43.1l26.67-80H232Z" }, child: [] }] })(n);
}
const ry = (n, e, t, o, r) => {
  const [s, i] = I([]), [a, c] = I(!1), [d, f] = I(!1), [p, g] = I({ clickX: 0, clickY: 0 }), [h, m] = I(null), { clipBoard: $, setClipBoard: A, handleCutCopy: C, handlePasting: P } = gt(), { selectedFiles: j, setSelectedFiles: T, handleDownload: v } = Le(), { currentPath: R, setCurrentPath: F, currentPathFiles: S, setCurrentPathFiles: y, onFolderChange: x } = Fe(), { activeLayout: L, setActiveLayout: O } = Ae(), N = be(), M = () => {
    r(h), h.isDirectory ? (F(h.path), x == null || x(h.path), i([]), T([])) : e && t.show("previewFile"), c(!1);
  }, Q = (D) => {
    C(D), c(!1);
  }, J = () => {
    P(h), c(!1);
  }, Z = () => {
    c(!1), t.show("rename");
  }, de = () => {
    v(), c(!1);
  }, ne = () => {
    c(!1), t.show("delete");
  }, w = () => {
    c(!1), Me(n, "onRefresh"), A(null);
  }, E = () => {
    t.show("createFolder"), c(!1);
  }, _ = () => {
    c(!1), t.show("uploadFile");
  }, H = () => {
    T(S), c(!1);
  }, V = [
    {
      title: N("view"),
      icon: L === "grid" ? /* @__PURE__ */ l.jsx(rn, { size: 18 }) : /* @__PURE__ */ l.jsx(it, { size: 18 }),
      onClick: () => {
      },
      children: [
        {
          title: N("grid"),
          icon: /* @__PURE__ */ l.jsx(rn, { size: 18 }),
          selected: L === "grid",
          onClick: () => {
            O("grid"), c(!1);
          }
        },
        {
          title: N("list"),
          icon: /* @__PURE__ */ l.jsx(it, { size: 18 }),
          selected: L === "list",
          onClick: () => {
            O("list"), c(!1);
          }
        }
      ]
    },
    {
      title: N("refresh"),
      icon: /* @__PURE__ */ l.jsx(eo, { size: 18 }),
      onClick: w,
      divider: !0
    },
    {
      title: N("newFolder"),
      icon: /* @__PURE__ */ l.jsx(Xn, { size: 18 }),
      onClick: E,
      hidden: !o.create,
      divider: !o.upload
    },
    {
      title: N("upload"),
      icon: /* @__PURE__ */ l.jsx(no, { size: 18 }),
      onClick: _,
      divider: !0,
      hidden: !o.upload
    },
    {
      title: N("selectAll"),
      icon: /* @__PURE__ */ l.jsx(fr, { size: 18 }),
      onClick: H
    }
  ], X = [
    {
      title: N("open"),
      icon: h != null && h.isDirectory ? /* @__PURE__ */ l.jsx(oy, { size: 20 }) : /* @__PURE__ */ l.jsx(at, { size: 16 }),
      onClick: M,
      divider: !0
    },
    {
      title: N("cut"),
      icon: /* @__PURE__ */ l.jsx(Qn, { size: 19 }),
      onClick: () => Q(!0),
      divider: !(h != null && h.isDirectory) && !o.copy,
      hidden: !o.move
    },
    {
      title: N("copy"),
      icon: /* @__PURE__ */ l.jsx(Jn, { strokeWidth: 0.1, size: 17 }),
      onClick: () => Q(!1),
      divider: !(h != null && h.isDirectory),
      hidden: !o.copy
    },
    {
      title: N("paste"),
      icon: /* @__PURE__ */ l.jsx(kt, { size: 18 }),
      onClick: J,
      className: `${$ ? "" : "disable-paste"}`,
      hidden: !(h != null && h.isDirectory) || !o.move && !o.copy,
      divider: !0
    },
    {
      title: N("rename"),
      icon: /* @__PURE__ */ l.jsx(oo, { size: 19 }),
      onClick: Z,
      hidden: j.length > 1,
      hidden: !o.rename
    },
    {
      title: N("download"),
      icon: /* @__PURE__ */ l.jsx(It, { size: 18 }),
      onClick: de,
      hidden: !o.download
    },
    {
      title: N("delete"),
      icon: /* @__PURE__ */ l.jsx(to, { size: 19 }),
      onClick: ne,
      hidden: !o.delete
    }
  ], W = () => {
    y((D) => [
      ...D,
      {
        name: wo("New Folder", !0, D),
        isDirectory: !0,
        path: R,
        isEditing: !0,
        key: (/* @__PURE__ */ new Date()).valueOf()
      }
    ]);
  }, B = () => {
    y((D) => (D[s.at(-1)] ? D[s.at(-1)].isEditing = !0 : t.close(), D)), i([]), T([]);
  }, G = () => {
    i([]), T((D) => D.length > 0 ? [] : D);
  }, ee = (D, ue = !1) => {
    D.preventDefault(), g({ clickX: D.clientX, clickY: D.clientY }), f(ue), !ue && G(), c(!0);
  };
  return se(() => {
    if (t.isActive)
      switch (t.actionType) {
        case "createFolder":
          W();
          break;
        case "rename":
          B();
          break;
      }
  }, [t.isActive]), se(() => {
    i([]), T([]);
  }, [R]), se(() => {
    j.length > 0 ? i(() => j.map((D) => S.findIndex((ue) => ue.path === D.path))) : i([]);
  }, [j, S]), {
    emptySelecCtxItems: V,
    selecCtxItems: X,
    handleContextMenu: ee,
    unselectFiles: G,
    visible: a,
    setVisible: c,
    setLastSelectedFile: m,
    selectedFileIndexes: s,
    clickPosition: p,
    isSelectionCtx: d
  };
}, sy = ({ unselectFiles: n, onSort: e, sortConfig: t }) => {
  const [o, r] = I(!1), { selectedFiles: s, setSelectedFiles: i } = Le(), { currentPathFiles: a } = Fe(), c = pt(() => a.length > 0 && s.length === a.length, [s, a]), d = (p) => {
    p.target.checked ? (i(a), r(!0)) : n();
  }, f = (p) => {
    e && e(p);
  };
  return /* @__PURE__ */ l.jsxs(
    "div",
    {
      className: "files-header",
      onMouseOver: () => r(!0),
      onMouseLeave: () => r(!1),
      children: [
        /* @__PURE__ */ l.jsx("div", { className: "file-select-all", children: (o || c) && /* @__PURE__ */ l.jsx(
          Eo,
          {
            id: "selectAll",
            checked: c,
            onChange: d,
            title: "Select all",
            disabled: a.length === 0
          }
        ) }),
        /* @__PURE__ */ l.jsxs(
          "div",
          {
            className: `file-name ${(t == null ? void 0 : t.key) === "name" ? "active" : ""}`,
            onClick: () => f("name"),
            children: [
              "Name",
              (t == null ? void 0 : t.key) === "name" && /* @__PURE__ */ l.jsx("span", { className: "sort-indicator", children: t.direction === "asc" ? " ▲" : " ▼" })
            ]
          }
        ),
        /* @__PURE__ */ l.jsxs(
          "div",
          {
            className: `file-date ${(t == null ? void 0 : t.key) === "modified" ? "active" : ""}`,
            onClick: () => f("modified"),
            children: [
              "Modified",
              (t == null ? void 0 : t.key) === "modified" && /* @__PURE__ */ l.jsx("span", { className: "sort-indicator", children: t.direction === "asc" ? " ▲" : " ▼" })
            ]
          }
        ),
        /* @__PURE__ */ l.jsxs(
          "div",
          {
            className: `file-size ${(t == null ? void 0 : t.key) === "size" ? "active" : ""}`,
            onClick: () => f("size"),
            children: [
              "Size",
              (t == null ? void 0 : t.key) === "size" && /* @__PURE__ */ l.jsx("span", { className: "sort-indicator", children: t.direction === "asc" ? " ▲" : " ▼" })
            ]
          }
        )
      ]
    }
  );
}, Fo = ({
  onCreateFolder: n,
  onRename: e,
  onFileOpen: t,
  onRefresh: o,
  enableFilePreview: r,
  triggerAction: s,
  permissions: i
}) => {
  const { currentPathFiles: a, sortConfig: c, setSortConfig: d } = Fe(), f = he(null), { activeLayout: p } = Ae(), g = be(), {
    emptySelecCtxItems: h,
    selecCtxItems: m,
    handleContextMenu: $,
    unselectFiles: A,
    visible: C,
    setVisible: P,
    setLastSelectedFile: j,
    selectedFileIndexes: T,
    clickPosition: v,
    isSelectionCtx: R
  } = ry(o, r, s, i, t), F = Qe(() => P(!1)), S = (y) => {
    let x = "asc";
    c.key === y && c.direction === "asc" && (x = "desc"), d({ key: y, direction: x });
  };
  return /* @__PURE__ */ l.jsxs(
    "div",
    {
      ref: f,
      className: `files ${p}`,
      onContextMenu: $,
      onClick: A,
      children: [
        p === "list" && /* @__PURE__ */ l.jsx(sy, { unselectFiles: A, onSort: S, sortConfig: c }),
        (a == null ? void 0 : a.length) > 0 ? /* @__PURE__ */ l.jsx(l.Fragment, { children: a.map((y, x) => /* @__PURE__ */ l.jsx(
          ey,
          {
            index: x,
            file: y,
            onCreateFolder: n,
            onRename: e,
            onFileOpen: t,
            enableFilePreview: r,
            triggerAction: s,
            filesViewRef: f,
            selectedFileIndexes: T,
            handleContextMenu: $,
            setVisible: P,
            setLastSelectedFile: j,
            draggable: i.move
          },
          x
        )) }) : /* @__PURE__ */ l.jsx("div", { className: "empty-folder", children: g("folderEmpty") }),
        /* @__PURE__ */ l.jsx(
          ny,
          {
            filesViewRef: f,
            contextMenuRef: F.ref,
            menuItems: R ? m : h,
            visible: C,
            setVisible: P,
            clickPosition: v
          }
        )
      ]
    }
  );
};
Fo.displayName = "FileList";
const iy = ({ triggerAction: n, onDelete: e }) => {
  const [t, o] = I(""), { selectedFiles: r, setSelectedFiles: s } = Le(), i = be();
  se(() => {
    o(() => {
      if (r.length === 1)
        return i("deleteItemConfirm", { fileName: r[0].name });
      if (r.length > 1)
        return i("deleteItemsConfirm", { count: r.length });
    });
  }, [i]);
  const a = () => {
    e(r), s([]), n.close();
  };
  return /* @__PURE__ */ l.jsxs("div", { className: "file-delete-confirm", children: [
    /* @__PURE__ */ l.jsx("p", { className: "file-delete-confirm-text", children: t }),
    /* @__PURE__ */ l.jsxs("div", { className: "file-delete-confirm-actions", children: [
      /* @__PURE__ */ l.jsx(Ve, { type: "secondary", onClick: () => n.close(), children: i("cancel") }),
      /* @__PURE__ */ l.jsx(Ve, { type: "danger", onClick: a, children: i("delete") })
    ] })
  ] });
};
function ay(n) {
  return q({ attr: { viewBox: "0 0 1024 1024", fill: "currentColor", fillRule: "evenodd" }, child: [{ tag: "path", attr: { d: "M799.855 166.312c.023.007.043.018.084.059l57.69 57.69c.041.041.052.06.059.084a.118.118 0 0 1 0 .069c-.007.023-.018.042-.059.083L569.926 512l287.703 287.703c.041.04.052.06.059.083a.118.118 0 0 1 0 .07c-.007.022-.018.042-.059.083l-57.69 57.69c-.041.041-.06.052-.084.059a.118.118 0 0 1-.069 0c-.023-.007-.042-.018-.083-.059L512 569.926 224.297 857.629c-.04.041-.06.052-.083.059a.118.118 0 0 1-.07 0c-.022-.007-.042-.018-.083-.059l-57.69-57.69c-.041-.041-.052-.06-.059-.084a.118.118 0 0 1 0-.069c.007-.023.018-.042.059-.083L454.073 512 166.371 224.297c-.041-.04-.052-.06-.059-.083a.118.118 0 0 1 0-.07c.007-.022.018-.042.059-.083l57.69-57.69c.041-.041.06-.052.084-.059a.118.118 0 0 1 .069 0c.023.007.042.018.083.059L512 454.073l287.703-287.702c.04-.041.06-.052.083-.059a.118.118 0 0 1 .07 0Z" }, child: [] }] })(n);
}
function ly(n) {
  return q({ attr: { viewBox: "0 0 1024 1024" }, child: [{ tag: "path", attr: { d: "M518.3 459a8 8 0 0 0-12.6 0l-112 141.7a7.98 7.98 0 0 0 6.3 12.9h73.9V856c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V613.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 459z" }, child: [] }, { tag: "path", attr: { d: "M811.4 366.7C765.6 245.9 648.9 160 512.2 160S258.8 245.8 213 366.6C127.3 389.1 64 467.2 64 560c0 110.5 89.5 200 199.9 200H304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8h-40.1c-33.7 0-65.4-13.4-89-37.7-23.5-24.2-36-56.8-34.9-90.6.9-26.4 9.9-51.2 26.2-72.1 16.7-21.3 40.1-36.8 66.1-43.7l37.9-9.9 13.9-36.6c8.6-22.8 20.6-44.1 35.7-63.4a245.6 245.6 0 0 1 52.4-49.9c41.1-28.9 89.5-44.2 140-44.2s98.9 15.3 140 44.2c19.9 14 37.5 30.8 52.4 49.9 15.1 19.3 27.1 40.7 35.7 63.4l13.8 36.5 37.8 10C846.1 454.5 884 503.8 884 560c0 33.1-12.9 64.3-36.3 87.7a123.07 123.07 0 0 1-87.6 36.3H720c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h40.1C870.5 760 960 670.5 960 560c0-92.7-63.1-170.7-148.6-193.3z" }, child: [] }] })(n);
}
const cy = ({ percent: n = 0, isCanceled: e = !1, isCompleted: t = !1, error: o }) => {
  const r = be();
  return /* @__PURE__ */ l.jsxs("div", { role: "progressbar", className: "fm-progress", children: [
    !o && /* @__PURE__ */ l.jsx("div", { className: "fm-progress-bar", children: /* @__PURE__ */ l.jsx("div", { className: "fm-progress-bar-fill", style: { width: `${n}%` } }) }),
    e ? /* @__PURE__ */ l.jsx("span", { className: "fm-upload-canceled", children: r("canceled") }) : o ? /* @__PURE__ */ l.jsx("span", { className: "fm-upload-canceled", children: o }) : /* @__PURE__ */ l.jsx("div", { className: "fm-progress-status", children: /* @__PURE__ */ l.jsx("span", { children: t ? r("completed") : r("percentDone", { percent: n }) }) })
  ] });
};
function dy(n) {
  return q({ attr: { viewBox: "0 0 512 512" }, child: [{ tag: "path", attr: { d: "M256 388c-72.597 0-132-59.405-132-132 0-72.601 59.403-132 132-132 36.3 0 69.299 15.4 92.406 39.601L278 234h154V80l-51.698 51.702C348.406 99.798 304.406 80 256 80c-96.797 0-176 79.203-176 176s78.094 176 176 176c81.045 0 148.287-54.134 169.401-128H378.85c-18.745 49.561-67.138 84-122.85 84z" }, child: [] }] })(n);
}
const uy = ({
  index: n,
  fileData: e,
  setFiles: t,
  setIsUploading: o,
  fileUploadConfig: r,
  onFileUploaded: s,
  handleFileRemove: i
}) => {
  var F, S, y, x;
  const [a, c] = I(0), [d, f] = I(!1), [p, g] = I(!1), [h, m] = I(!1), $ = ft(33), A = he(), { onError: C } = mt(), P = be(), j = (L) => {
    c(0), o((N) => ({
      ...N,
      [n]: !1
    }));
    const O = {
      type: "upload",
      message: P("uploadFail"),
      response: {
        status: L.status,
        statusText: L.statusText,
        data: L.response
      }
    };
    t(
      (N) => N.map((M, Q) => n === Q ? {
        ...M,
        error: O.message
      } : M)
    ), m(!0), C(O, e.file);
  }, T = (L) => {
    if (!L.error)
      return new Promise((O, N) => {
        const M = new XMLHttpRequest();
        A.current = M, o((ne) => ({
          ...ne,
          [n]: !0
        })), M.upload.onprogress = (ne) => {
          if (ne.lengthComputable) {
            const w = Math.round(ne.loaded / ne.total * 100);
            c(w);
          }
        }, M.onload = () => {
          o((ne) => ({
            ...ne,
            [n]: !1
          })), M.status === 200 || M.status === 201 ? (f(!0), s(M.response), O(M.response)) : (N(M.statusText), j(M));
        }, M.onerror = () => {
          N(M.statusText), j(M);
        };
        const Q = (r == null ? void 0 : r.method) || "POST";
        M.open(Q, r == null ? void 0 : r.url, !0);
        const J = r == null ? void 0 : r.headers;
        for (let ne in J)
          M.setRequestHeader(ne, J[ne]);
        const Z = new FormData(), de = L == null ? void 0 : L.appendData;
        for (let ne in de)
          de[ne] && Z.append(ne, de[ne]);
        Z.append("file", L.file), M.send(Z);
      });
  };
  se(() => {
    A.current || T(e);
  }, []);
  const v = () => {
    A.current && (A.current.abort(), o((L) => ({
      ...L,
      [n]: !1
    })), g(!0), c(0));
  }, R = () => {
    e != null && e.file && (t(
      (L) => L.map((O, N) => n === N ? {
        ...O,
        error: !1
      } : O)
    ), T({ ...e, error: !1 }), g(!1), m(!1));
  };
  return e.removed ? null : /* @__PURE__ */ l.jsxs("li", { children: [
    /* @__PURE__ */ l.jsx("div", { className: "file-icon", children: $[He((F = e.file) == null ? void 0 : F.name)] ?? /* @__PURE__ */ l.jsx(at, { size: 33 }) }),
    /* @__PURE__ */ l.jsxs("div", { className: "file", children: [
      /* @__PURE__ */ l.jsxs("div", { className: "file-details", children: [
        /* @__PURE__ */ l.jsxs("div", { className: "file-info", children: [
          /* @__PURE__ */ l.jsx("span", { className: "file-name text-truncate", title: (S = e.file) == null ? void 0 : S.name, children: (y = e.file) == null ? void 0 : y.name }),
          /* @__PURE__ */ l.jsx("span", { className: "file-size", children: vt((x = e.file) == null ? void 0 : x.size) })
        ] }),
        d ? /* @__PURE__ */ l.jsx(A4, { title: P("uploaded"), className: "upload-success" }) : p || h ? /* @__PURE__ */ l.jsx(dy, { className: "retry-upload", title: "Retry", onClick: R }) : /* @__PURE__ */ l.jsx(
          "div",
          {
            className: "rm-file",
            title: `${e.error ? P("Remove") : P("abortUpload")}`,
            onClick: e.error ? () => i(n) : v,
            children: /* @__PURE__ */ l.jsx(ay, {})
          }
        )
      ] }),
      /* @__PURE__ */ l.jsx(
        cy,
        {
          percent: a,
          isCanceled: p,
          isCompleted: d,
          error: e.error
        }
      )
    ] })
  ] });
}, fy = ({
  fileUploadConfig: n,
  maxFileSize: e,
  acceptedFileTypes: t,
  onFileUploading: o,
  onFileUploaded: r
}) => {
  const [s, i] = I([]), [a, c] = I(!1), [d, f] = I({}), { currentFolder: p, currentPathFiles: g } = Fe(), { onError: h } = mt(), m = he(null), $ = be(), A = (R) => {
    R.key === "Enter" && m.current.click();
  }, C = (R) => {
    if (t && !t.includes(He(R.name)))
      return $("fileTypeNotAllowed");
    if (g.some(
      (y) => y.name.toLowerCase() === R.name.toLowerCase() && !y.isDirectory
    )) return $("fileAlreadyExist");
    if (e && R.size > e) return `${$("maxUploadSize")} ${vt(e, 0)}.`;
  }, P = (R) => {
    if (R = R.filter(
      (F) => !s.some((S) => S.file.name.toLowerCase() === F.name.toLowerCase())
    ), R.length > 0) {
      const F = R.map((S) => {
        const y = o(S, p), x = C(S);
        return x && h({ type: "upload", message: x }, S), {
          file: S,
          appendData: y,
          ...x && { error: x }
        };
      });
      i((S) => [...S, ...F]);
    }
  }, j = (R) => {
    R.preventDefault(), c(!1);
    const F = Array.from(R.dataTransfer.files);
    P(F);
  }, T = (R) => {
    const F = Array.from(R.target.files);
    P(F);
  }, v = (R) => {
    i((F) => {
      const S = F.map((y, x) => R === x ? {
        ...y,
        removed: !0
      } : y);
      return S.every((y) => !!y.removed) ? [] : S;
    });
  };
  return /* @__PURE__ */ l.jsxs("div", { className: `fm-upload-file ${s.length > 0 ? "file-selcted" : ""}`, children: [
    /* @__PURE__ */ l.jsxs("div", { className: "select-files", children: [
      /* @__PURE__ */ l.jsx(
        "div",
        {
          className: `draggable-file-input ${a ? "dragging" : ""}`,
          onDrop: j,
          onDragOver: (R) => R.preventDefault(),
          onDragEnter: () => c(!0),
          onDragLeave: () => c(!1),
          children: /* @__PURE__ */ l.jsxs("div", { className: "input-text", children: [
            /* @__PURE__ */ l.jsx(ly, { size: 30 }),
            /* @__PURE__ */ l.jsx("span", { children: $("dragFileToUpload") })
          ] })
        }
      ),
      /* @__PURE__ */ l.jsx("div", { className: "btn-choose-file", children: /* @__PURE__ */ l.jsxs(Ve, { padding: "0", onKeyDown: A, children: [
        /* @__PURE__ */ l.jsx("label", { htmlFor: "chooseFile", children: $("chooseFile") }),
        /* @__PURE__ */ l.jsx(
          "input",
          {
            ref: m,
            type: "file",
            id: "chooseFile",
            className: "choose-file-input",
            onChange: T,
            multiple: !0,
            accept: t
          }
        )
      ] }) })
    ] }),
    s.length > 0 && /* @__PURE__ */ l.jsxs("div", { className: "files-progress", children: [
      /* @__PURE__ */ l.jsx("div", { className: "heading", children: Object.values(d).some((R) => R) ? /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
        /* @__PURE__ */ l.jsx("h2", { children: $("uploading") }),
        /* @__PURE__ */ l.jsx(Mt, { loading: !0, className: "upload-loading" })
      ] }) : /* @__PURE__ */ l.jsx("h2", { children: $("completed") }) }),
      /* @__PURE__ */ l.jsx("ul", { children: s.map((R, F) => /* @__PURE__ */ l.jsx(
        uy,
        {
          index: F,
          fileData: R,
          setFiles: i,
          fileUploadConfig: n,
          setIsUploading: f,
          onFileUploaded: r,
          handleFileRemove: v
        },
        F
      )) })
    ] })
  ] });
}, Hn = ["jpg", "jpeg", "png"], Vn = ["mp4", "mov", "avi"], Bn = ["mp3", "wav", "m4a"], Wn = ["txt", "pdf"], py = ({ filePreviewPath: n, filePreviewComponent: e }) => {
  var $;
  const [t, o] = I(!0), [r, s] = I(!1), { selectedFiles: i } = Le(), a = ft(73), c = ($ = He(i[0].name)) == null ? void 0 : $.toLowerCase(), d = `${n}${i[0].path}`, f = be(), p = pt(
    () => e == null ? void 0 : e(i[0]),
    [e]
  ), g = () => {
    o(!1), s(!1);
  }, h = () => {
    o(!1), s(!0);
  }, m = () => {
    window.location.href = d;
  };
  return Pe.isValidElement(p) ? p : /* @__PURE__ */ l.jsxs("section", { className: `file-previewer ${c === "pdf" ? "pdf-previewer" : ""}`, children: [
    r || ![
      ...Hn,
      ...Vn,
      ...Bn,
      ...Wn
    ].includes(c) && /* @__PURE__ */ l.jsxs("div", { className: "preview-error", children: [
      /* @__PURE__ */ l.jsx("span", { className: "error-icon", children: a[c] ?? /* @__PURE__ */ l.jsx(z4, { size: 73 }) }),
      /* @__PURE__ */ l.jsx("span", { className: "error-msg", children: f("previewUnavailable") }),
      /* @__PURE__ */ l.jsxs("div", { className: "file-info", children: [
        /* @__PURE__ */ l.jsx("span", { className: "file-name", children: i[0].name }),
        i[0].size && /* @__PURE__ */ l.jsx("span", { children: "-" }),
        /* @__PURE__ */ l.jsx("span", { className: "file-size", children: vt(i[0].size) })
      ] }),
      /* @__PURE__ */ l.jsx(Ve, { onClick: m, padding: "0.45rem .9rem", children: /* @__PURE__ */ l.jsxs("div", { className: "download-btn", children: [
        /* @__PURE__ */ l.jsx(It, { size: 18 }),
        /* @__PURE__ */ l.jsx("span", { children: f("download") })
      ] }) })
    ] }),
    Hn.includes(c) && /* @__PURE__ */ l.jsxs(l.Fragment, { children: [
      /* @__PURE__ */ l.jsx(Mt, { isLoading: t }),
      /* @__PURE__ */ l.jsx(
        "img",
        {
          src: d,
          alt: "Preview Unavailable",
          className: `photo-popup-image ${t ? "img-loading" : ""}`,
          onLoad: g,
          onError: h,
          loading: "lazy"
        }
      )
    ] }),
    Vn.includes(c) && /* @__PURE__ */ l.jsx("video", { src: d, className: "video-preview", controls: !0, autoPlay: !0 }),
    Bn.includes(c) && /* @__PURE__ */ l.jsx("audio", { src: d, controls: !0, autoPlay: !0, className: "audio-preview" }),
    Wn.includes(c) && /* @__PURE__ */ l.jsx(l.Fragment, { children: /* @__PURE__ */ l.jsx(
      "iframe",
      {
        src: d,
        onLoad: g,
        onError: h,
        frameBorder: "0",
        className: `photo-popup-iframe ${t ? "img-loading" : ""}`
      }
    ) })
  ] });
}, Ot = (n) => n.toLowerCase(), xe = (n, e, t = !1) => {
  const o = he(/* @__PURE__ */ new Set([])), r = pt(() => new Set(n.map((c) => Ot(c))), [n]), s = (c) => {
    if (!c.repeat && (o.current.add(Ot(c.key)), r.isSubsetOf(o.current) && !t)) {
      c.preventDefault(), e(c);
      return;
    }
  }, i = (c) => {
    o.current.delete(Ot(c.key));
  }, a = () => {
    o.current.clear();
  };
  se(() => (window.addEventListener("keydown", s), window.addEventListener("keyup", i), window.addEventListener("blur", a), () => {
    window.removeEventListener("keydown", s), window.removeEventListener("keyup", i), window.removeEventListener("blur", a);
  }), [r, e, t]);
}, we = {
  createFolder: ["Alt", "Shift", "N"],
  uploadFiles: ["Control", "U"],
  cut: ["Control", "X"],
  copy: ["Control", "C"],
  paste: ["Control", "V"],
  rename: ["F2"],
  download: ["Control", "D"],
  delete: ["Delete"],
  selectAll: ["Control", "A"],
  jumpToFirst: ["Home"],
  jumpToLast: ["End"],
  listLayout: ["Control", "Shift", "!"],
  // Act as Ctrl + Shift + 1 but could cause problems for QWERTZ or DVORAK etc. keyborad layouts.
  gridLayout: ["Control", "Shift", "@"],
  // Act as Ctrl + Shift + 2 but could cause problems for QWERTZ or DVORAK etc. keyborad layouts.
  refresh: ["F5"],
  clearSelection: ["Escape"]
}, hy = (n, e, t) => {
  const { setClipBoard: o, handleCutCopy: r, handlePasting: s } = gt(), { currentFolder: i, currentPathFiles: a } = Fe(), { setSelectedFiles: c, handleDownload: d } = Le(), { setActiveLayout: f } = Ae(), p = () => {
    t.create && n.show("createFolder");
  }, g = () => {
    t.upload && n.show("uploadFile");
  }, h = () => {
    t.move && r(!0);
  }, m = () => {
    t.copy && r(!1);
  }, $ = () => {
    s(i);
  }, A = () => {
    t.rename && n.show("rename");
  }, C = () => {
    t.download && d();
  }, P = () => {
    t.delete && n.show("delete");
  }, j = () => {
    a.length > 0 && c([a[0]]);
  }, T = () => {
    a.length > 0 && c([a.at(-1)]);
  }, v = () => {
    c(a);
  }, R = () => {
    c((x) => x.length > 0 ? [] : x);
  }, F = () => {
    Me(e, "onRefresh"), o(null);
  }, S = () => {
    f("grid");
  }, y = () => {
    f("list");
  };
  xe(we.createFolder, p, n.isActive), xe(we.uploadFiles, g, n.isActive), xe(we.cut, h, n.isActive), xe(we.copy, m, n.isActive), xe(we.paste, $, n.isActive), xe(we.rename, A, n.isActive), xe(we.download, C, n.isActive), xe(we.delete, P, n.isActive), xe(we.jumpToFirst, j, n.isActive), xe(we.jumpToLast, T, n.isActive), xe(we.selectAll, v, n.isActive), xe(we.clearSelection, R, n.isActive), xe(we.refresh, F, n.isActive), xe(we.gridLayout, S, n.isActive), xe(we.listLayout, y, n.isActive);
}, my = ({
  fileUploadConfig: n,
  onFileUploading: e,
  onFileUploaded: t,
  onDelete: o,
  onRefresh: r,
  maxFileSize: s,
  filePreviewPath: i,
  filePreviewComponent: a,
  acceptedFileTypes: c,
  triggerAction: d,
  permissions: f
}) => {
  const [p, g] = I(null), { selectedFiles: h } = Le(), m = be();
  hy(d, r, f);
  const $ = {
    uploadFile: {
      title: m("upload"),
      component: /* @__PURE__ */ l.jsx(
        fy,
        {
          fileUploadConfig: n,
          maxFileSize: s,
          acceptedFileTypes: c,
          onFileUploading: e,
          onFileUploaded: t
        }
      ),
      width: "35%"
    },
    delete: {
      title: m("delete"),
      component: /* @__PURE__ */ l.jsx(iy, { triggerAction: d, onDelete: o }),
      width: "25%"
    },
    previewFile: {
      title: m("preview"),
      component: /* @__PURE__ */ l.jsx(
        py,
        {
          filePreviewPath: i,
          filePreviewComponent: a
        }
      ),
      width: "50%"
    }
  };
  if (se(() => {
    if (d.isActive) {
      const A = d.actionType;
      A === "previewFile" && ($[A].title = (h == null ? void 0 : h.name) ?? m("preview")), g($[A]);
    } else
      g(null);
  }, [d.isActive]), p)
    return /* @__PURE__ */ l.jsx(
      So,
      {
        heading: p.title,
        show: d.isActive,
        setShow: d.close,
        dialogWidth: p.width,
        children: p == null ? void 0 : p.component
      }
    );
}, gy = () => {
  const [n, e] = I(!1), [t, o] = I(null);
  return {
    isActive: n,
    actionType: t,
    show: (i) => {
      e(!0), o(i);
    },
    close: () => {
      e(!1), o(null);
    }
  };
}, vy = (n, e) => {
  const [t, o] = I({ col1: n, col2: e }), [r, s] = I(!1), i = he(null);
  return {
    containerRef: i,
    colSizes: t,
    setColSizes: o,
    isDragging: r,
    handleMouseDown: () => {
      s(!0);
    },
    handleMouseUp: () => {
      s(!1);
    },
    handleMouseMove: (f) => {
      if (!r) return;
      f.preventDefault();
      const g = i.current.getBoundingClientRect(), h = (f.clientX - g.left) / g.width * 100;
      h >= 15 && h <= 60 && o({ col1: h, col2: 100 - h });
    }
  };
}, yy = (n, e, t) => {
  const o = n[e];
  if (o && isNaN(Date.parse(o)))
    return new Error(
      `Invalid prop \`${e}\` supplied to \`${t}\`. Expected a valid date string (ISO 8601) but received \`${o}\`.`
    );
}, Yn = (n, e, t) => {
  const o = n[e];
  try {
    new URL(o);
    return;
  } catch {
    return new Error(
      `Invalid prop \`${e}\` supplied to \`${t}\`. Expected a valid URL but received \`${o}\`.`
    );
  }
}, $y = {
  create: !0,
  upload: !0,
  move: !0,
  copy: !0,
  rename: !0,
  download: !0,
  delete: !0
}, jo = ({
  files: n,
  fileUploadConfig: e,
  isLoading: t,
  onCreateFolder: o,
  onFileUploading: r = () => {
  },
  onFileUploaded: s = () => {
  },
  onCut: i,
  onCopy: a,
  onPaste: c,
  onRename: d,
  onDownload: f,
  onDelete: p = () => null,
  onLayoutChange: g = () => {
  },
  onRefresh: h,
  onFileOpen: m = () => {
  },
  onFolderChange: $ = () => {
  },
  onSelect: A,
  onError: C = () => {
  },
  layout: P = "grid",
  enableFilePreview: j = !0,
  maxFileSize: T,
  filePreviewPath: v,
  acceptedFileTypes: R,
  height: F = "600px",
  width: S = "100%",
  initialPath: y = "",
  filePreviewComponent: x,
  primaryColor: L = "#6155b4",
  fontFamily: O = "Nunito Sans, sans-serif",
  language: N = "en",
  permissions: M = {},
  collapsibleNav: Q = !1,
  defaultNavExpanded: J = !0
}) => {
  const [Z, de] = I(J), ne = gy(), { containerRef: w, colSizes: E, isDragging: _, handleMouseMove: H, handleMouseUp: V, handleMouseDown: X } = vy(20, 80), W = {
    "--file-manager-font-family": O,
    "--file-manager-primary-color": L,
    height: F,
    width: S
  }, B = pt(
    () => ({ ...$y, ...M }),
    [M]
  );
  return /* @__PURE__ */ l.jsxs("main", { className: "file-explorer", onContextMenu: (G) => G.preventDefault(), style: W, children: [
    /* @__PURE__ */ l.jsx(Mt, { loading: t }),
    /* @__PURE__ */ l.jsx(c4, { language: N, children: /* @__PURE__ */ l.jsx(u4, { filesData: n, onError: C, children: /* @__PURE__ */ l.jsx(p4, { initialPath: y, onFolderChange: $, children: /* @__PURE__ */ l.jsx(h4, { onDownload: f, onSelect: A, children: /* @__PURE__ */ l.jsx(m4, { onPaste: c, onCut: i, onCopy: a, children: /* @__PURE__ */ l.jsxs(yr, { layout: P, children: [
      /* @__PURE__ */ l.jsx(
        mo,
        {
          onLayoutChange: g,
          onRefresh: h,
          triggerAction: ne,
          permissions: B
        }
      ),
      /* @__PURE__ */ l.jsxs(
        "section",
        {
          ref: w,
          onMouseMove: H,
          onMouseUp: V,
          className: "files-container",
          children: [
            /* @__PURE__ */ l.jsxs(
              "div",
              {
                className: `navigation-pane ${Z ? "open" : "closed"}`,
                style: {
                  width: E.col1 + "%"
                },
                children: [
                  /* @__PURE__ */ l.jsx(yo, { onFileOpen: m }),
                  /* @__PURE__ */ l.jsx(
                    "div",
                    {
                      className: `sidebar-resize ${_ ? "sidebar-dragging" : ""}`,
                      onMouseDown: X
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ l.jsxs(
              "div",
              {
                className: "folders-preview",
                style: { width: (Z ? E.col2 : 100) + "%" },
                children: [
                  /* @__PURE__ */ l.jsx(
                    Ut,
                    {
                      collapsibleNav: Q,
                      isNavigationPaneOpen: Z,
                      setNavigationPaneOpen: de
                    }
                  ),
                  /* @__PURE__ */ l.jsx(
                    Fo,
                    {
                      onCreateFolder: o,
                      onRename: d,
                      onFileOpen: m,
                      onRefresh: h,
                      enableFilePreview: j,
                      triggerAction: ne,
                      permissions: B
                    }
                  )
                ]
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ l.jsx(
        my,
        {
          fileUploadConfig: e,
          onFileUploading: r,
          onFileUploaded: s,
          onDelete: p,
          onRefresh: h,
          maxFileSize: T,
          filePreviewPath: v,
          filePreviewComponent: x,
          acceptedFileTypes: R,
          triggerAction: ne,
          permissions: B
        }
      )
    ] }) }) }) }) }) })
  ] });
};
jo.displayName = "FileManager";
jo.propTypes = {
  files: U.arrayOf(
    U.shape({
      name: U.string.isRequired,
      isDirectory: U.bool.isRequired,
      path: U.string.isRequired,
      updatedAt: yy,
      size: U.number
    })
  ).isRequired,
  fileUploadConfig: U.shape({
    url: Yn,
    headers: U.objectOf(U.string),
    method: U.oneOf(["POST", "PUT"])
  }),
  isLoading: U.bool,
  onCreateFolder: U.func,
  onFileUploading: U.func,
  onFileUploaded: U.func,
  onRename: U.func,
  onDelete: U.func,
  onCut: U.func,
  onCopy: U.func,
  onPaste: U.func,
  onDownload: U.func,
  onLayoutChange: U.func,
  onRefresh: U.func,
  onFileOpen: U.func,
  onFolderChange: U.func,
  onSelect: U.func,
  onError: U.func,
  layout: U.oneOf(["grid", "list"]),
  maxFileSize: U.number,
  enableFilePreview: U.bool,
  filePreviewPath: Yn,
  acceptedFileTypes: U.string,
  height: U.oneOfType([U.string, U.number]),
  width: U.oneOfType([U.string, U.number]),
  initialPath: U.string,
  filePreviewComponent: U.func,
  primaryColor: U.string,
  fontFamily: U.string,
  language: U.string,
  permissions: U.shape({
    create: U.bool,
    upload: U.bool,
    move: U.bool,
    copy: U.bool,
    rename: U.bool,
    download: U.bool,
    delete: U.bool
  }),
  collapsibleNav: U.bool,
  defaultNavExpanded: U.bool
};
export {
  jo as FileManager
};
