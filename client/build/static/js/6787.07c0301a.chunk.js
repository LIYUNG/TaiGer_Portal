/*! For license information please see 6787.07c0301a.chunk.js.LICENSE.txt */
(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[6787],{57027:function(t,e,r){var o=r(95234).default;function n(){"use strict";t.exports=n=function(){return e},t.exports.__esModule=!0,t.exports.default=t.exports;var e={},r=Object.prototype,a=r.hasOwnProperty,i="function"==typeof Symbol?Symbol:{},l=i.iterator||"@@iterator",s=i.asyncIterator||"@@asyncIterator",c=i.toStringTag||"@@toStringTag";function u(t,e,r){return Object.defineProperty(t,e,{value:r,enumerable:!0,configurable:!0,writable:!0}),t[e]}try{u({},"")}catch(Z){u=function(t,e,r){return t[e]=r}}function h(t,e,r,o){var n=e&&e.prototype instanceof f?e:f,a=Object.create(n.prototype),i=new T(o||[]);return a._invoke=function(t,e,r){var o="suspendedStart";return function(n,a){if("executing"===o)throw new Error("Generator is already running");if("completed"===o){if("throw"===n)throw a;return _()}for(r.method=n,r.arg=a;;){var i=r.delegate;if(i){var l=L(i,r);if(l){if(l===d)continue;return l}}if("next"===r.method)r.sent=r._sent=r.arg;else if("throw"===r.method){if("suspendedStart"===o)throw o="completed",r.arg;r.dispatchException(r.arg)}else"return"===r.method&&r.abrupt("return",r.arg);o="executing";var s=p(t,e,r);if("normal"===s.type){if(o=r.done?"completed":"suspendedYield",s.arg===d)continue;return{value:s.arg,done:r.done}}"throw"===s.type&&(o="completed",r.method="throw",r.arg=s.arg)}}}(t,r,i),a}function p(t,e,r){try{return{type:"normal",arg:t.call(e,r)}}catch(Z){return{type:"throw",arg:Z}}}e.wrap=h;var d={};function f(){}function g(){}function v(){}var m={};u(m,l,(function(){return this}));var y=Object.getPrototypeOf,C=y&&y(y(D([])));C&&C!==r&&a.call(C,l)&&(m=C);var w=v.prototype=f.prototype=Object.create(m);function b(t){["next","throw","return"].forEach((function(e){u(t,e,(function(t){return this._invoke(e,t)}))}))}function E(t,e){function r(n,i,l,s){var c=p(t[n],t,i);if("throw"!==c.type){var u=c.arg,h=u.value;return h&&"object"==o(h)&&a.call(h,"__await")?e.resolve(h.__await).then((function(t){r("next",t,l,s)}),(function(t){r("throw",t,l,s)})):e.resolve(h).then((function(t){u.value=t,l(u)}),(function(t){return r("throw",t,l,s)}))}s(c.arg)}var n;this._invoke=function(t,o){function a(){return new e((function(e,n){r(t,o,e,n)}))}return n=n?n.then(a,a):a()}}function L(t,e){var r=t.iterator[e.method];if(void 0===r){if(e.delegate=null,"throw"===e.method){if(t.iterator.return&&(e.method="return",e.arg=void 0,L(t,e),"throw"===e.method))return d;e.method="throw",e.arg=new TypeError("The iterator does not provide a 'throw' method")}return d}var o=p(r,t.iterator,e.arg);if("throw"===o.type)return e.method="throw",e.arg=o.arg,e.delegate=null,d;var n=o.arg;return n?n.done?(e[t.resultName]=n.value,e.next=t.nextLoc,"return"!==e.method&&(e.method="next",e.arg=void 0),e.delegate=null,d):n:(e.method="throw",e.arg=new TypeError("iterator result is not an object"),e.delegate=null,d)}function k(t){var e={tryLoc:t[0]};1 in t&&(e.catchLoc=t[1]),2 in t&&(e.finallyLoc=t[2],e.afterLoc=t[3]),this.tryEntries.push(e)}function x(t){var e=t.completion||{};e.type="normal",delete e.arg,t.completion=e}function T(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(k,this),this.reset(!0)}function D(t){if(t){var e=t[l];if(e)return e.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,o=function e(){for(;++r<t.length;)if(a.call(t,r))return e.value=t[r],e.done=!1,e;return e.value=void 0,e.done=!0,e};return o.next=o}}return{next:_}}function _(){return{value:void 0,done:!0}}return g.prototype=v,u(w,"constructor",v),u(v,"constructor",g),g.displayName=u(v,c,"GeneratorFunction"),e.isGeneratorFunction=function(t){var e="function"==typeof t&&t.constructor;return!!e&&(e===g||"GeneratorFunction"===(e.displayName||e.name))},e.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,v):(t.__proto__=v,u(t,c,"GeneratorFunction")),t.prototype=Object.create(w),t},e.awrap=function(t){return{__await:t}},b(E.prototype),u(E.prototype,s,(function(){return this})),e.AsyncIterator=E,e.async=function(t,r,o,n,a){void 0===a&&(a=Promise);var i=new E(h(t,r,o,n),a);return e.isGeneratorFunction(r)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},b(w),u(w,c,"Generator"),u(w,l,(function(){return this})),u(w,"toString",(function(){return"[object Generator]"})),e.keys=function(t){var e=[];for(var r in t)e.push(r);return e.reverse(),function r(){for(;e.length;){var o=e.pop();if(o in t)return r.value=o,r.done=!1,r}return r.done=!0,r}},e.values=D,T.prototype={constructor:T,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(x),!t)for(var e in this)"t"===e.charAt(0)&&a.call(this,e)&&!isNaN(+e.slice(1))&&(this[e]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var e=this;function r(r,o){return i.type="throw",i.arg=t,e.next=r,o&&(e.method="next",e.arg=void 0),!!o}for(var o=this.tryEntries.length-1;o>=0;--o){var n=this.tryEntries[o],i=n.completion;if("root"===n.tryLoc)return r("end");if(n.tryLoc<=this.prev){var l=a.call(n,"catchLoc"),s=a.call(n,"finallyLoc");if(l&&s){if(this.prev<n.catchLoc)return r(n.catchLoc,!0);if(this.prev<n.finallyLoc)return r(n.finallyLoc)}else if(l){if(this.prev<n.catchLoc)return r(n.catchLoc,!0)}else{if(!s)throw new Error("try statement without catch or finally");if(this.prev<n.finallyLoc)return r(n.finallyLoc)}}}},abrupt:function(t,e){for(var r=this.tryEntries.length-1;r>=0;--r){var o=this.tryEntries[r];if(o.tryLoc<=this.prev&&a.call(o,"finallyLoc")&&this.prev<o.finallyLoc){var n=o;break}}n&&("break"===t||"continue"===t)&&n.tryLoc<=e&&e<=n.finallyLoc&&(n=null);var i=n?n.completion:{};return i.type=t,i.arg=e,n?(this.method="next",this.next=n.finallyLoc,d):this.complete(i)},complete:function(t,e){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&e&&(this.next=e),d},finish:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.finallyLoc===t)return this.complete(r.completion,r.afterLoc),x(r),d}},catch:function(t){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc===t){var o=r.completion;if("throw"===o.type){var n=o.arg;x(r)}return n}}throw new Error("illegal catch attempt")},delegateYield:function(t,e,r){return this.delegate={iterator:D(t),resultName:e,nextLoc:r},"next"===this.method&&(this.arg=void 0),d}},e}t.exports=n,t.exports.__esModule=!0,t.exports.default=t.exports},95234:function(t){function e(r){return t.exports=e="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},t.exports.__esModule=!0,t.exports.default=t.exports,e(r)}t.exports=e,t.exports.__esModule=!0,t.exports.default=t.exports},78994:function(t,e,r){var o=r(57027)();t.exports=o;try{regeneratorRuntime=o}catch(n){"object"===typeof globalThis?globalThis.regeneratorRuntime=o:Function("r","regeneratorRuntime = r")(o)}},36787:function(t,e,r){"use strict";r.d(e,{kL:function(){return F}});var o=r(6148),n=r(89472),a=r(35531),i=r(18489),l=r(27853),s=r(84531),c=r(78932),u=r(38128),h=r(33032),p=r(83738),d=r(23430),f=r(78994),g=r(47313),v=["onLoad","onError"];function m(t){var e,r,o,n=t.chartVersion,a=void 0===n?"current":n,i=t.chartPackages,l=void 0===i?["corechart","controls"]:i,s=t.chartLanguage,c=void 0===s?"en":s,u=t.mapsApiKey,h=(0,g.useState)(null),p=(0,d.Z)(h,2),f=p[0],v=p[1],m=(0,g.useState)(!1),y=(0,d.Z)(m,2),C=y[0],w=y[1];return e="https://www.gstatic.com/charts/loader.js",r=function(){var t=null===window||void 0===window?void 0:window.google;t&&(t.charts.load(a,{packages:l,language:c,mapsApiKey:u}),t.charts.setOnLoadCallback((function(){v(t)})))},o=function(){w(!0)},(0,g.useEffect)((function(){if(document){var t=document.querySelector('script[src="'.concat(e,'"]'));if(!(null===t||void 0===t?void 0:t.dataset.loaded)){var n=t||document.createElement("script");t||(n.src=e);var a=function(){n.dataset.loaded="1",null===r||void 0===r||r()};return n.addEventListener("load",a),o&&n.addEventListener("error",o),t||document.head.append(n),function(){n.removeEventListener("load",a),o&&n.removeEventListener("error",o)}}null===r||void 0===r||r()}}),[]),[f,C]}function y(t){var e=t.onLoad,r=t.onError,o=m((0,p.Z)(t,v)),n=(0,d.Z)(o,2),a=n[0],i=n[1];return(0,g.useEffect)((function(){a&&e&&e(a)}),[a]),(0,g.useEffect)((function(){i&&r&&r()}),[i]),null}var C,w={legend_toggle:!1,options:{},legendToggle:!1,getChartWrapper:function(){},spreadSheetQueryParameters:{headers:1,gid:1},rootProps:{},chartWrapperParams:{}},b=0,E=function(){return"reactgooglegraph-".concat(b+=1)},L=["#3366CC","#DC3912","#FF9900","#109618","#990099","#3B3EAC","#0099C6","#DD4477","#66AA00","#B82E2E","#316395","#994499","#22AA99","#AAAA11","#6633CC","#E67300","#8B0707","#329262","#5574A6","#3B3EAC"],k=function(){var t=(0,h.Z)(f.mark((function t(e,r){var o,n=arguments;return f.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return o=n.length>2&&void 0!==n[2]?n[2]:{},t.abrupt("return",new Promise((function(t,n){var a="".concat(o.headers?"headers=".concat(o.headers):"headers=0"),i="".concat(o.query?"&tq=".concat(encodeURIComponent(o.query)):""),l="".concat(o.gid?"&gid=".concat(o.gid):""),s="".concat(o.sheet?"&sheet=".concat(o.sheet):""),c="".concat(o.access_token?"&access_token=".concat(o.access_token):""),u="".concat(a).concat(l).concat(s).concat(i).concat(c),h="".concat(r,"/gviz/tq?").concat(u);new e.visualization.Query(h).send((function(e){e.isError()?n("Error in query:  ".concat(e.getMessage()," ").concat(e.getDetailedMessage())):t(e.getDataTable())}))})));case 2:case"end":return t.stop()}}),t)})));return function(e,r){return t.apply(this,arguments)}}(),x=g.createContext(w),T=x.Provider,D=x.Consumer,_=function(t){var e=t.children,r=t.value;return g.createElement(T,{value:r},e)},Z=function(t){var e=t.render;return g.createElement(D,null,(function(t){return e(t)}))},z="#CCCCCC",W=function(t){(0,c.Z)(r,t);var e=(0,u.Z)(r);function r(){var t;(0,l.Z)(this,r);for(var o=arguments.length,s=new Array(o),c=0;c<o;c++)s[c]=arguments[c];return(t=e.call.apply(e,[this].concat(s))).state={hiddenColumns:[]},t.listenToLegendToggle=function(){var e=t.props,r=e.google,o=e.googleChartWrapper;r.visualization.events.addListener(o,"select",(function(){var e=o.getChart().getSelection(),r=o.getDataTable();if(0!==e.length&&!e[0].row&&r){var n=e[0].column,l=t.getColumnID(r,n);t.state.hiddenColumns.includes(l)?t.setState((function(t){return(0,i.Z)((0,i.Z)({},t),{},{hiddenColumns:(0,a.Z)(t.hiddenColumns.filter((function(t){return t!==l})))})})):t.setState((function(t){return(0,i.Z)((0,i.Z)({},t),{},{hiddenColumns:[].concat((0,a.Z)(t.hiddenColumns),[l])})}))}}))},t.applyFormatters=function(e,r){var o,i=t.props.google,l=(0,n.Z)(r);try{for(l.s();!(o=l.n()).done;){var s=o.value;switch(s.type){case"ArrowFormat":new i.visualization.ArrowFormat(s.options).format(e,s.column);break;case"BarFormat":new i.visualization.BarFormat(s.options).format(e,s.column);break;case"ColorFormat":var c,u=new i.visualization.ColorFormat(s.options),h=s.ranges,p=(0,n.Z)(h);try{for(p.s();!(c=p.n()).done;){var d=c.value;u.addRange.apply(u,(0,a.Z)(d))}}catch(f){p.e(f)}finally{p.f()}u.format(e,s.column);break;case"DateFormat":new i.visualization.DateFormat(s.options).format(e,s.column);break;case"NumberFormat":new i.visualization.NumberFormat(s.options).format(e,s.column);break;case"PatternFormat":new i.visualization.PatternFormat(s.options).format(e,s.column)}}}catch(f){l.e(f)}finally{l.f()}},t.getColumnID=function(t,e){return t.getColumnId(e)||t.getColumnLabel(e)},t.draw=function(){var e=(0,h.Z)(f.mark((function e(r){var o,n,i,l,s,c,u,h,p,d,g,v,m,y,C,w,b,E,L,x,T,D,_,Z,z;return f.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(o=r.data,n=r.diffdata,i=r.rows,l=r.columns,s=r.options,c=r.legend_toggle,u=r.legendToggle,h=r.chartType,p=r.formatters,d=r.spreadSheetUrl,g=r.spreadSheetQueryParameters,v=t.props,m=v.google,y=v.googleChartWrapper,w=null,n&&(b=m.visualization.arrayToDataTable(n.old),E=m.visualization.arrayToDataTable(n.new),w=m.visualization[h].prototype.computeDiff(b,E)),null===o){e.next=8;break}C=Array.isArray(o)?m.visualization.arrayToDataTable(o):new m.visualization.DataTable(o),e.next=19;break;case 8:if(!i||!l){e.next=12;break}C=m.visualization.arrayToDataTable([l].concat((0,a.Z)(i))),e.next=19;break;case 12:if(!d){e.next=18;break}return e.next=15,k(m,d,g);case 15:C=e.sent,e.next=19;break;case 18:C=m.visualization.arrayToDataTable([]);case 19:for(L=C.getNumberOfColumns(),x=0;x<L;x+=1)T=t.getColumnID(C,x),t.state.hiddenColumns.includes(T)&&(D=C.getColumnLabel(x),_=C.getColumnId(x),Z=C.getColumnType(x),C.removeColumn(x),C.addColumn({label:D,id:_,type:Z}));return z=y.getChart(),"Timeline"===y.getChartType()&&z&&z.clearChart(),y.setChartType(h),y.setOptions(s||{}),y.setDataTable(C),y.draw(),null!==t.props.googleChartDashboard&&t.props.googleChartDashboard.draw(C),w&&(y.setDataTable(w),y.draw()),p&&(t.applyFormatters(C,p),y.setDataTable(C),y.draw()),!0!==u&&!0!==c||t.grayOutHiddenColumns({options:s}),e.abrupt("return");case 32:case"end":return e.stop()}}),e)})));return function(t){return e.apply(this,arguments)}}(),t.grayOutHiddenColumns=function(e){var r=e.options,o=t.props.googleChartWrapper,n=o.getDataTable();if(n){var a=n.getNumberOfColumns();if(!1!==t.state.hiddenColumns.length>0){var l=Array.from({length:a-1}).map((function(e,o){var a=t.getColumnID(n,o+1);return t.state.hiddenColumns.includes(a)?z:r&&r.colors?r.colors[o]:L[o]}));o.setOptions((0,i.Z)((0,i.Z)({},r),{},{colors:l})),o.draw()}}},t.onResize=function(){t.props.googleChartWrapper.draw()},t}return(0,s.Z)(r,[{key:"componentDidMount",value:function(){this.draw(this.props),window.addEventListener("resize",this.onResize),(this.props.legend_toggle||this.props.legendToggle)&&this.listenToLegendToggle()}},{key:"componentWillUnmount",value:function(){var t=this.props,e=t.google,r=t.googleChartWrapper;window.removeEventListener("resize",this.onResize),e.visualization.events.removeAllListeners(r),"Timeline"===r.getChartType()&&r.getChart()&&r.getChart().clearChart()}},{key:"componentDidUpdate",value:function(){this.draw(this.props)}},{key:"render",value:function(){return null}}]),r}(g.Component),P=function(t){(0,c.Z)(r,t);var e=(0,u.Z)(r);function r(){return(0,l.Z)(this,r),e.apply(this,arguments)}return(0,s.Z)(r,[{key:"componentDidMount",value:function(){}},{key:"componentWillUnmount",value:function(){}},{key:"shouldComponentUpdate",value:function(){return!1}},{key:"render",value:function(){var t=this.props,e=t.google,r=t.googleChartWrapper,o=t.googleChartDashboard;return g.createElement(Z,{render:function(t){return g.createElement(W,Object.assign({},t,{google:e,googleChartWrapper:r,googleChartDashboard:o}))}})}}]),r}(g.Component),S=function(t){(0,c.Z)(r,t);var e=(0,u.Z)(r);function r(){return(0,l.Z)(this,r),e.apply(this,arguments)}return(0,s.Z)(r,[{key:"shouldComponentUpdate",value:function(){return!1}},{key:"listenToEvents",value:function(t){var e=this,r=t.chartEvents,o=t.google,a=t.googleChartWrapper;if(r){o.visualization.events.removeAllListeners(a);var i,l=(0,n.Z)(r);try{var s=function(){var t=i.value;c=e;var r=t.eventName,n=t.callback;o.visualization.events.addListener(a,r,(function(){for(var t=arguments.length,e=new Array(t),r=0;r<t;r++)e[r]=arguments[r];n({chartWrapper:a,props:c.props,google:o,eventArgs:e})}))};for(l.s();!(i=l.n()).done;){var c;s()}}catch(u){l.e(u)}finally{l.f()}}}},{key:"render",value:function(){var t=this,e=this.props,r=e.google,o=e.googleChartWrapper;return g.createElement(Z,{render:function(e){return t.listenToEvents({chartEvents:e.chartEvents||null,google:r,googleChartWrapper:o}),null}})}}]),r}(g.Component),I=0,A=function(t){(0,c.Z)(r,t);var e=(0,u.Z)(r);function r(){for(var t,a,s=arguments.length,c=new Array(s),u=0;u<s;u++)c[u]=arguments[u];return(0,l.Z)(this,r),t=e.call(this),a=(0,o.Z)(t),t.state={googleChartWrapper:null,googleChartDashboard:null,googleChartControls:null,googleChartEditor:null,isReady:!1},t.graphID=null,t.dashboard_ref=g.createRef(),t.toolbar_ref=g.createRef(),t.getGraphID=function(){var e,r=t.props,o=r.graphID,n=r.graph_id;return e=o||n?o&&!n?o:n&&!o?n:o:t.graphID?t.graphID:E(),t.graphID=e,t.graphID},t.getControlID=function(t,e){return I+=1,"undefined"===typeof t?"googlechart-control-".concat(e,"-").concat(I):t},t.addControls=function(e,r){var a=t.props,l=a.google,s=a.controls,c=s?s.map((function(e,r){var o=e.controlID,n=e.controlType,a=e.options,s=e.controlWrapperParams,c=t.getControlID(o,r);return{controlProp:e,control:new l.visualization.ControlWrapper((0,i.Z)({containerId:c,controlType:n,options:a},s))}})):null;if(!c)return null;r.bind(c.map((function(t){return t.control})),e);var u,h=(0,n.Z)(c);try{var p=function(){var r,a=u.value,i=a.control,s=a.controlProp.controlEvents,c=void 0===s?[]:s,h=(0,n.Z)(c);try{var p=function(){var n=r.value;d=(0,o.Z)(t);var a=n.callback,s=n.eventName;l.visualization.events.removeListener(i,s,a),l.visualization.events.addListener(i,s,(function(){for(var t=arguments.length,r=new Array(t),o=0;o<t;o++)r[o]=arguments[o];a({chartWrapper:e,controlWrapper:i,props:d.props,google:l,eventArgs:r})}))};for(h.s();!(r=h.n()).done;)p()}catch(f){h.e(f)}finally{h.f()}};for(h.s();!(u=h.n()).done;){var d;p()}}catch(f){h.e(f)}finally{h.f()}return c},t.renderChart=function(){var e=t.props,r=e.width,o=e.height,n=e.options,a=e.style,l=e.className,s=e.rootProps,c=e.google,u=(0,i.Z)({height:o||n&&n.height,width:r||n&&n.width},a);return g.createElement("div",Object.assign({id:t.getGraphID(),style:u,className:l},s),t.state.isReady&&null!==t.state.googleChartWrapper?g.createElement(g.Fragment,null,g.createElement(P,{googleChartWrapper:t.state.googleChartWrapper,google:c,googleChartDashboard:t.state.googleChartDashboard}),g.createElement(S,{googleChartWrapper:t.state.googleChartWrapper,google:c})):null)},t.renderControl=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(t){return!0};return a.state.isReady&&null!==a.state.googleChartControls?g.createElement(g.Fragment,null,a.state.googleChartControls.filter((function(e){var r=e.controlProp,o=e.control;return t({control:o,controlProp:r})})).map((function(t){var e=t.control;t.controlProp;return g.createElement("div",{key:e.getContainerId(),id:e.getContainerId()})}))):null},t.renderToolBar=function(){return t.props.toolbarItems?g.createElement("div",{ref:t.toolbar_ref}):null},t}return(0,s.Z)(r,[{key:"componentDidMount",value:function(){var t=this.props,e=t.options,r=t.google,o=t.chartType,n=t.chartWrapperParams,a=t.toolbarItems,l=t.getChartEditor,s=t.getChartWrapper,c=(0,i.Z)({chartType:o,options:e,containerId:this.getGraphID()},n),u=new r.visualization.ChartWrapper(c);u.setOptions(e||{}),s&&s(u,r);var h=new r.visualization.Dashboard(this.dashboard_ref),p=this.addControls(u,h);a&&r.visualization.drawToolbar(this.toolbar_ref.current,a);var d=null;l&&l({chartEditor:d=new r.visualization.ChartEditor,chartWrapper:u,google:r}),this.setState({googleChartEditor:d,googleChartControls:p,googleChartDashboard:h,googleChartWrapper:u,isReady:!0})}},{key:"componentDidUpdate",value:function(){if(this.state.googleChartWrapper&&this.state.googleChartDashboard&&this.state.googleChartControls){var t=this.props.controls;if(t)for(var e=0;e<t.length;e+=1){var r=t[e],o=r.controlType,n=r.options,a=r.controlWrapperParams;a&&"state"in a&&this.state.googleChartControls[e].control.setState(a.state),this.state.googleChartControls[e].control.setOptions(n),this.state.googleChartControls[e].control.setControlType(o)}}}},{key:"shouldComponentUpdate",value:function(t,e){return this.state.isReady!==e.isReady||t.controls!==this.props.controls}},{key:"render",value:function(){var t=this.props,e=t.width,r=t.height,o=t.options,n=t.style,a=(0,i.Z)({height:r||o&&o.height,width:e||o&&o.width},n);return this.props.render?g.createElement("div",{ref:this.dashboard_ref,style:a},g.createElement("div",{ref:this.toolbar_ref,id:"toolbar"}),this.props.render({renderChart:this.renderChart,renderControl:this.renderControl,renderToolbar:this.renderToolBar})):g.createElement("div",{ref:this.dashboard_ref,style:a},this.renderControl((function(t){return"bottom"!==t.controlProp.controlPosition})),this.renderChart(),this.renderControl((function(t){return"bottom"===t.controlProp.controlPosition})),this.renderToolBar())}}]),r}(g.Component),F=function(t){(0,c.Z)(r,t);var e=(0,u.Z)(r);function r(){var t;(0,l.Z)(this,r);for(var o=arguments.length,n=new Array(o),a=0;a<o;a++)n[a]=arguments[a];return(t=e.call.apply(e,[this].concat(n)))._isMounted=!1,t.state={loadingStatus:"loading",google:null},t.onLoad=function(e){if(t.props.onLoad&&t.props.onLoad(e),t.isFullyLoaded(e))t.onSuccess(e);else var r=setInterval((function(){var e=window.google;t._isMounted?e&&t.isFullyLoaded(e)&&(clearInterval(r),t.onSuccess(e)):clearInterval(r)}),1e3)},t.onSuccess=function(e){t.setState({loadingStatus:"ready",google:e})},t.onError=function(){t.setState({loadingStatus:"errored"})},t}return(0,s.Z)(r,[{key:"render",value:function(){var t=this.props,e=t.chartLanguage,r=t.chartPackages,o=t.chartVersion,n=t.mapsApiKey,a=t.loader,i=t.errorElement;return g.createElement(_,{value:this.props},"ready"===this.state.loadingStatus&&null!==this.state.google?g.createElement(A,Object.assign({},this.props,{google:this.state.google})):"errored"===this.state.loadingStatus&&i?i:a,g.createElement(y,{chartLanguage:e,chartPackages:r,chartVersion:o,mapsApiKey:n,onLoad:this.onLoad,onError:this.onError}))}},{key:"componentDidMount",value:function(){this._isMounted=!0}},{key:"componentWillUnmount",value:function(){this._isMounted=!1}},{key:"isFullyLoaded",value:function(t){var e=this.props,r=e.controls,o=e.toolbarItems,n=e.getChartEditor;return t&&t.visualization&&t.visualization.ChartWrapper&&t.visualization.Dashboard&&(!r||t.visualization.ChartWrapper)&&(!n||t.visualization.ChartEditor)&&(!o||t.visualization.drawToolbar)}}]),r}(g.Component);F.defaultProps=w,function(t){t.annotation="annotation",t.annotationText="annotationText",t.certainty="certainty",t.emphasis="emphasis",t.interval="interval",t.scope="scope",t.style="style",t.tooltip="tooltip",t.domain="domain"}(C||(C={}))},33032:function(t,e,r){"use strict";function o(t,e,r,o,n,a,i){try{var l=t[a](i),s=l.value}catch(c){return void r(c)}l.done?e(s):Promise.resolve(s).then(o,n)}function n(t){return function(){var e=this,r=arguments;return new Promise((function(n,a){var i=t.apply(e,r);function l(t){o(i,n,a,l,s,"next",t)}function s(t){o(i,n,a,l,s,"throw",t)}l(void 0)}))}}r.d(e,{Z:function(){return n}})}}]);