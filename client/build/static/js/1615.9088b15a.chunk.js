"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[1615],{61615:function(e,n,r){r.r(n);var i=r(35531),a=r(27853),t=r(84531),c=r(78932),s=r(38128),o=r(47313),l=r(63849),d=r(31616),u=r(65832),h=r(93298),f=r(62396),m=r(54991),x=r(12401),p=r(46417),Z=function(e){(0,c.Z)(r,e);var n=(0,s.Z)(r);function r(){var e;(0,a.Z)(this,r);for(var t=arguments.length,c=new Array(t),s=0;s<t;s++)c[s]=arguments[s];return(e=n.call.apply(n,[this].concat(c))).state={isBasic:!1,isMultiTarget:[],accordionKey:1},e.targetHandler=function(n){e.state.isMultiTarget.some((function(e){return e===n}))?e.setState((function(e){return{isMultiTarget:e.isMultiTarget.filter((function(e){return e!==n}))}})):e.setState((function(e){return{isMultiTarget:[].concat((0,i.Z)(e.isMultiTarget),[n])}}))},e.multiTargetHandler=function(){["target1","target2"].map((function(n){return e.targetHandler(n),!1}))},e}return(0,t.Z)(r,[{key:"render",value:function(){var e=this,n=this.state,r=n.isBasic,i=n.isMultiTarget,a=n.accordionKey;return(0,p.jsx)(m.Z,{children:(0,p.jsxs)(l.Z,{children:[(0,p.jsxs)(d.Z,{sm:12,children:[(0,p.jsx)("h5",{children:"Basic Collapse"}),(0,p.jsx)("hr",{}),(0,p.jsxs)(u.Z,{children:[(0,p.jsxs)(u.Z.Header,{children:[(0,p.jsx)(h.Z,{href:x.Z.BLANK_LINK,onClick:function(){return e.setState({isBasic:!r})},"aria-controls":"basic-collapse","aria-expanded":r,children:"Collapse Link"}),(0,p.jsx)(h.Z,{onClick:function(){return e.setState({isBasic:!r})},children:"Collapse Button"})]}),(0,p.jsx)(f.Z,{in:this.state.isBasic,children:(0,p.jsx)("div",{id:"basic-collapse",children:(0,p.jsx)(u.Z.Body,{children:(0,p.jsx)(u.Z.Text,{children:"Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident."})})})})]})]}),(0,p.jsxs)(d.Z,{sm:12,children:[(0,p.jsx)("h5",{children:"Multiple Targets"}),(0,p.jsx)("hr",{}),(0,p.jsx)(h.Z,{onClick:function(){return e.targetHandler("target1")},"aria-controls":"target1","aria-expanded":i.some((function(e){return"target1"===e})),children:"Toggle first element"}),(0,p.jsx)(h.Z,{onClick:function(){return e.targetHandler("target2")},"aria-controls":"target2","aria-expanded":i.some((function(e){return"target2"===e})),children:"Toggle second element"}),(0,p.jsx)(h.Z,{onClick:this.multiTargetHandler,children:"Toggle both elements"}),(0,p.jsxs)(l.Z,{children:[(0,p.jsx)(d.Z,{children:(0,p.jsx)(u.Z,{className:"mt-2",children:(0,p.jsx)(f.Z,{in:i.some((function(e){return"target1"===e})),children:(0,p.jsxs)("div",{id:"target1",children:[(0,p.jsx)(u.Z.Header,{as:"h5",children:"First Element"}),(0,p.jsx)(u.Z.Body,{children:(0,p.jsx)(u.Z.Text,{children:"Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident."})})]})})})}),(0,p.jsx)(d.Z,{children:(0,p.jsx)(u.Z,{className:"mt-2",children:(0,p.jsx)(f.Z,{in:i.some((function(e){return"target2"===e})),children:(0,p.jsxs)("div",{id:"target2",children:[(0,p.jsx)(u.Z.Header,{as:"h5",children:"Second Element"}),(0,p.jsx)(u.Z.Body,{children:(0,p.jsx)(u.Z.Text,{children:"Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident."})})]})})})})]})]}),(0,p.jsxs)(d.Z,{sm:12,className:"accordion",children:[(0,p.jsx)("h5",{children:"Accordion Example"}),(0,p.jsx)("hr",{}),(0,p.jsxs)(u.Z,{className:"mt-2",children:[(0,p.jsx)(u.Z.Header,{children:(0,p.jsx)(u.Z.Title,{as:"h5",children:(0,p.jsx)("a",{href:x.Z.BLANK_LINK,onClick:function(){return e.setState({accordionKey:1!==a?1:0})},"aria-controls":"accordion1","aria-expanded":1===a,children:"Collapsible Group Item #1"})})}),(0,p.jsx)(f.Z,{in:1===this.state.accordionKey,children:(0,p.jsx)("div",{id:"accordion1",children:(0,p.jsx)(u.Z.Body,{children:(0,p.jsx)(u.Z.Text,{children:"Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS."})})})})]}),(0,p.jsxs)(u.Z,{className:"mt-2",children:[(0,p.jsx)(u.Z.Header,{children:(0,p.jsx)(u.Z.Title,{as:"h5",children:(0,p.jsx)("a",{href:x.Z.BLANK_LINK,onClick:function(){return e.setState({accordionKey:2!==a?2:0})},"aria-controls":"accordion2","aria-expanded":2===a,children:"Collapsible Group Item #2"})})}),(0,p.jsx)(f.Z,{in:2===this.state.accordionKey,children:(0,p.jsx)("div",{id:"accordion2",children:(0,p.jsx)(u.Z.Body,{children:(0,p.jsx)(u.Z.Text,{children:"Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS."})})})})]}),(0,p.jsxs)(u.Z,{className:"mt-2",children:[(0,p.jsx)(u.Z.Header,{children:(0,p.jsx)(u.Z.Title,{as:"h5",children:(0,p.jsx)("a",{href:x.Z.BLANK_LINK,onClick:function(){return e.setState({accordionKey:3!==a?3:0})},"aria-controls":"accordion3","aria-expanded":3===a,children:"Collapsible Group Item #3"})})}),(0,p.jsx)(f.Z,{in:3===this.state.accordionKey,children:(0,p.jsx)("div",{id:"accordion3",children:(0,p.jsx)(u.Z.Body,{children:(0,p.jsx)(u.Z.Text,{children:"Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS."})})})})]})]})]})})}}]),r}(o.Component);n.default=Z},65832:function(e,n,r){r.d(n,{Z:function(){return H}});var i=r(18489),a=r(83738),t=r(46123),c=r.n(t),s=r(47313),o=r(68524),l=r(28864),d=r(96205),u=r(46417),h=["bsPrefix","className","variant","as"],f=s.forwardRef((function(e,n){var r=e.bsPrefix,t=e.className,s=e.variant,l=e.as,d=void 0===l?"img":l,f=(0,a.Z)(e,h),m=(0,o.vE)(r,"card-img");return(0,u.jsx)(d,(0,i.Z)({ref:n,className:c()(s?"".concat(m,"-").concat(s):m,t)},f))}));f.displayName="CardImg";var m=f,x=r(15614),p=["bsPrefix","className","as"],Z=s.forwardRef((function(e,n){var r=e.bsPrefix,t=e.className,l=e.as,d=void 0===l?"div":l,h=(0,a.Z)(e,p),f=(0,o.vE)(r,"card-header"),m=(0,s.useMemo)((function(){return{cardHeaderBsPrefix:f}}),[f]);return(0,u.jsx)(x.Z.Provider,{value:m,children:(0,u.jsx)(d,(0,i.Z)((0,i.Z)({ref:n},h),{},{className:c()(t,f)}))})}));Z.displayName="CardHeader";var g=Z,b=["bsPrefix","className","bg","text","border","body","children","as"],j=(0,d.Z)("h5"),v=(0,d.Z)("h6"),y=(0,l.Z)("card-body"),N=(0,l.Z)("card-title",{Component:j}),w=(0,l.Z)("card-subtitle",{Component:v}),C=(0,l.Z)("card-link",{Component:"a"}),k=(0,l.Z)("card-text",{Component:"p"}),E=(0,l.Z)("card-footer"),T=(0,l.Z)("card-img-overlay"),B=s.forwardRef((function(e,n){var r=e.bsPrefix,t=e.className,s=e.bg,l=e.text,d=e.border,h=e.body,f=e.children,m=e.as,x=void 0===m?"div":m,p=(0,a.Z)(e,b),Z=(0,o.vE)(r,"card");return(0,u.jsx)(x,(0,i.Z)((0,i.Z)({ref:n},p),{},{className:c()(t,Z,s&&"bg-".concat(s),l&&"text-".concat(l),d&&"border-".concat(d)),children:h?(0,u.jsx)(y,{children:f}):f}))}));B.displayName="Card",B.defaultProps={body:!1};var H=Object.assign(B,{Img:m,Title:N,Subtitle:w,Body:y,Link:C,Text:k,Header:g,Footer:E,ImgOverlay:T})},15614:function(e,n,r){var i=r(47313).createContext(null);i.displayName="CardHeaderContext",n.Z=i},62396:function(e,n,r){r.d(n,{Z:function(){return N}});var i=r(18489),a=r(83738),t=r(36222),c=r(46123),s=r.n(c),o=r(46988),l=r(47313),d=r(22752),u=r(59498);var h,f=function(){for(var e=arguments.length,n=new Array(e),r=0;r<e;r++)n[r]=arguments[r];return n.filter((function(e){return null!=e})).reduce((function(e,n){if("function"!==typeof n)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===e?n:function(){for(var r=arguments.length,i=new Array(r),a=0;a<r;a++)i[a]=arguments[a];e.apply(this,i),n.apply(this,i)}}),null)},m=r(6280),x=r(75879),p=r(46417),Z=["onEnter","onEntering","onEntered","onExit","onExiting","className","children","dimension","getDimensionValue"],g={height:["marginTop","marginBottom"],width:["marginLeft","marginRight"]};function b(e,n){var r=n["offset".concat(e[0].toUpperCase()).concat(e.slice(1))],i=g[e];return r+parseInt((0,o.Z)(n,i[0]),10)+parseInt((0,o.Z)(n,i[1]),10)}var j=(h={},(0,t.Z)(h,d.Wj,"collapse"),(0,t.Z)(h,d.Ix,"collapsing"),(0,t.Z)(h,d.d0,"collapsing"),(0,t.Z)(h,d.cn,"collapse show"),h),v={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1,getDimensionValue:b},y=l.forwardRef((function(e,n){var r=e.onEnter,t=e.onEntering,c=e.onEntered,o=e.onExit,d=e.onExiting,h=e.className,g=e.children,v=e.dimension,y=void 0===v?"height":v,N=e.getDimensionValue,w=void 0===N?b:N,C=(0,a.Z)(e,Z),k="function"===typeof y?y():y,E=(0,l.useMemo)((function(){return f((function(e){e.style[k]="0"}),r)}),[k,r]),T=(0,l.useMemo)((function(){return f((function(e){var n="scroll".concat(k[0].toUpperCase()).concat(k.slice(1));e.style[k]="".concat(e[n],"px")}),t)}),[k,t]),B=(0,l.useMemo)((function(){return f((function(e){e.style[k]=null}),c)}),[k,c]),H=(0,l.useMemo)((function(){return f((function(e){e.style[k]="".concat(w(k,e),"px"),(0,m.Z)(e)}),o)}),[o,w,k]),A=(0,l.useMemo)((function(){return f((function(e){e.style[k]=null}),d)}),[k,d]);return(0,p.jsx)(x.Z,(0,i.Z)((0,i.Z)({ref:n,addEndListener:u.Z},C),{},{"aria-expanded":C.role?C.in:null,onEnter:E,onEntering:T,onEntered:B,onExit:H,onExiting:A,childRef:g.ref,children:function(e,n){return l.cloneElement(g,(0,i.Z)((0,i.Z)({},n),{},{className:s()(h,g.props.className,j[e],"width"===k&&"collapse-horizontal")}))}}))}));y.defaultProps=v;var N=y},96205:function(e,n,r){var i=r(18489),a=r(47313),t=r(46123),c=r.n(t),s=r(46417);n.Z=function(e){return a.forwardRef((function(n,r){return(0,s.jsx)("div",(0,i.Z)((0,i.Z)({},n),{},{ref:r,className:c()(n.className,e)}))}))}}}]);