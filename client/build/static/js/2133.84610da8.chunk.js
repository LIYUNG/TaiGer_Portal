"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[2133],{50099:function(e,n,t){var r=t(35531),a=t(27853),s=t(84531),i=t(78932),o=t(38128),c=t(47313),d=t(73158),l=t(65832),u=t(62396),h=t(29678),f=t.n(h),Z=t(54991),p=t(12401),m=t(46417),x=function(e){(0,i.Z)(t,e);var n=(0,o.Z)(t);function t(){var e;(0,a.Z)(this,t);for(var r=arguments.length,s=new Array(r),i=0;i<r;i++)s[i]=arguments[i];return(e=n.call.apply(n,[this].concat(s))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,s.Z)(t,[{key:"render",value:function(){var e,n,t,a,s,i=this,o=[];return this.state.isOption&&(t=(0,m.jsx)("div",{className:"card-header-right",children:(0,m.jsxs)(d.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,m.jsx)(d.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,m.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,m.jsxs)(d.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,m.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){i.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,m.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,m.jsxs)("a",{href:p.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,m.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){i.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,m.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,m.jsxs)("a",{href:p.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,m.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,m.jsx)("i",{className:"feather icon-refresh-cw"}),(0,m.jsx)("a",{href:p.Z.BLANK_LINK,children:" Reload "})]}),(0,m.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,m.jsx)("i",{className:"feather icon-trash"}),(0,m.jsx)("a",{href:p.Z.BLANK_LINK,children:" Remove "})]})]})]})})),a=(0,m.jsxs)(l.Z.Header,{children:[(0,m.jsx)(l.Z.Title,{as:"h5",children:this.props.title}),t]}),this.state.fullCard&&(o=[].concat((0,r.Z)(o),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(o=[].concat((0,r.Z)(o),["card-load"]),n=(0,m.jsx)("div",{className:"card-loader",children:(0,m.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(o=[].concat((0,r.Z)(o),["d-none"])),this.props.cardClass&&(o=[].concat((0,r.Z)(o),[this.props.cardClass])),s=(0,m.jsxs)(l.Z,{className:o.join(" "),style:e,children:[a,(0,m.jsx)(u.Z,{in:!this.state.collapseCard,children:(0,m.jsx)("div",{children:(0,m.jsx)(l.Z.Body,{children:this.props.children})})}),n]}),(0,m.jsx)(Z.Z,{children:s})}}]),t}(c.Component);n.Z=f()(x)},72133:function(e,n,t){t.r(n);var r=t(18489),a=t(27853),s=t(84531),i=t(78932),o=t(38128),c=t(47313),d=t(44030),l=t(54991),u=(t(51767),t(82423)),h=t(51426),f=t(46417),Z=function(e){(0,i.Z)(t,e);var n=(0,o.Z)(t);function t(){var e;(0,a.Z)(this,t);for(var s=arguments.length,i=new Array(s),o=0;o<s;o++)i[o]=arguments[o];return(e=n.call.apply(n,[this].concat(i))).state={error:null,role:"",isLoaded:!1,data:null,success:!1,academic_background:{},updateconfirmed:!1,res_status:0},e.handleChange_Academic=function(n){n.preventDefault();var t=(0,r.Z)({},e.state.academic_background.university);t[n.target.id]=n.target.value,e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{academic_background:(0,r.Z)((0,r.Z)({},e.academic_background),{},{university:t})})}))},e.handleChange_Language=function(n){n.preventDefault();var t=(0,r.Z)({},e.state.academic_background.language);t[n.target.id]=n.target.value,e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{academic_background:(0,r.Z)((0,r.Z)({},e.academic_background),{},{language:t})})}))},e.handleSubmit_AcademicBackground=function(n,t){n.preventDefault(),(0,h.zg)(t).then((function(n){var t=n.data,a=t.data,s=t.success,i=n.status;s?e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{isLoaded:!0,academic_background:(0,r.Z)((0,r.Z)({},e.academic_background),{},{university:a}),success:s,updateconfirmed:!0,res_status:i})})):e.setState({isLoaded:!0,res_status:i})}),(function(n){e.setState({isLoaded:!0,error:!0})}))},e.handleSubmit_Language=function(n,t){n.preventDefault(),(0,h.v2)(t).then((function(n){var t=n.data,a=t.data,s=t.success,i=n.status;s?e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{isLoaded:!0,academic_background:(0,r.Z)((0,r.Z)({},e.academic_background),{},{language:a}),success:s,updateconfirmed:!0,res_status:i})})):e.setState({isLoaded:!0,res_status:i})}),(function(n){e.setState({isLoaded:!0,error:!0})}))},e.Bayerische_Formel=function(e,n,t){return e-n!==0?(1+3*(e-t)/(e-n)).toFixed(2):0},e.onHide=function(){e.setState({updateconfirmed:!1})},e.setmodalhide=function(){e.setState({updateconfirmed:!1})},e}return(0,s.Z)(t,[{key:"componentDidMount",value:function(){var e=this;(0,h.Lz)(this.props.match.params.interview_id).then((function(n){var t=n.data,r=t.data,a=t.success,s=n.status;a?e.setState({isLoaded:!0,academic_background:r,success:a,res_status:s}):e.setState({isLoaded:!0,res_status:s})}),(function(n){e.setState({isLoaded:!0,error:!0})})),this.setState({isLoaded:!0})}},{key:"render",value:function(){var e=this.state,n=(e.error,e.spinner_style);return e.isLoaded?res_status>=400?(0,f.jsx)(u.Z,{res_status:res_status}):(0,f.jsxs)(l.Z,{children:["Student"===this.props.user.role&&(0,f.jsx)(f.Fragment,{children:"Book interview"}),"Editor"===this.props.user.role&&(0,f.jsx)(f.Fragment,{children:"Interview Training page"})]}):(0,f.jsx)("div",{style:n,children:(0,f.jsx)(d.Z,{animation:"border",role:"status",children:(0,f.jsx)("span",{className:"visually-hidden"})})})}}]),t}(c.Component);n.default=Z},82423:function(e,n,t){t.d(n,{Z:function(){return _}});var r=t(27853),a=t(84531),s=t(78932),i=t(38128),o=t(47313),c=t(63849),d=t(31616),l=t(50099),u=t(54991),h=t(29021),f=t(94611),Z=t(86450),p=(t(89351),t(46417)),m=function(e){(0,s.Z)(t,e);var n=(0,i.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return(0,p.jsx)(u.Z,{children:(0,p.jsx)(c.Z,{children:(0,p.jsx)(d.Z,{children:(0,p.jsx)(l.Z,{children:"Session is expired. Please refresh the page and login again."})})})})}}]),t}(o.Component),x=m,v=function(e){(0,s.Z)(t,e);var n=(0,i.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return(0,p.jsx)(u.Z,{children:(0,p.jsx)(c.Z,{children:(0,p.jsx)(d.Z,{children:(0,p.jsx)(l.Z,{children:"Too many requests. Please try later."})})})})}}]),t}(o.Component),g=v,j=function(e){(0,s.Z)(t,e);var n=(0,i.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return(0,p.jsx)(u.Z,{children:(0,p.jsx)(c.Z,{children:(0,p.jsx)(d.Z,{children:(0,p.jsx)(l.Z,{children:"The resource is locked and can not be changed."})})})})}}]),t}(o.Component),y=j,C=function(e){(0,s.Z)(t,e);var n=(0,i.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return 401===this.props.res_status?(0,p.jsx)(x,{}):403===this.props.res_status?(0,p.jsx)(Z.Z,{}):404===this.props.res_status?(0,p.jsx)(h.Z,{}):408===this.props.res_status?(0,p.jsx)(f.Z,{}):423===this.props.res_status?(0,p.jsx)(y,{}):429===this.props.res_status?(0,p.jsx)(g,{}):this.props.res_status>=500?(0,p.jsx)(u.Z,{children:(0,p.jsx)(c.Z,{children:(0,p.jsx)(d.Z,{children:(0,p.jsx)(l.Z,{children:"Server problem. Please try later."})})})}):void 0}}]),t}(o.Component),_=C},29021:function(e,n,t){var r=t(27853),a=t(84531),s=t(78932),i=t(38128),o=t(47313),c=t(63849),d=t(31616),l=t(65832),u=t(54991),h=t(46417),f=function(e){(0,s.Z)(t,e);var n=(0,i.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(c.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(l.Z,{children:(0,h.jsx)(l.Z.Body,{children:(0,h.jsx)("h4",{children:"Page Not Found!"})})})})})})}}]),t}(o.Component);n.Z=f},94611:function(e,n,t){var r=t(27853),a=t(84531),s=t(78932),i=t(38128),o=t(47313),c=t(63849),d=t(31616),l=t(50099),u=t(54991),h=t(46417),f=function(e){(0,s.Z)(t,e);var n=(0,i.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(c.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(l.Z,{children:"Time out error. Please login again!"})})})})}}]),t}(o.Component);n.Z=f},86450:function(e,n,t){var r=t(27853),a=t(84531),s=t(78932),i=t(38128),o=t(47313),c=t(63849),d=t(31616),l=t(50099),u=t(54991),h=t(46417),f=function(e){(0,s.Z)(t,e);var n=(0,i.Z)(t);function t(){return(0,r.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(c.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(l.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),t}(o.Component);n.Z=f},65832:function(e,n,t){t.d(n,{Z:function(){return S}});var r=t(18489),a=t(83738),s=t(46123),i=t.n(s),o=t(47313),c=t(68524),d=t(28864),l=t(96205),u=t(46417),h=["bsPrefix","className","variant","as"],f=o.forwardRef((function(e,n){var t=e.bsPrefix,s=e.className,o=e.variant,d=e.as,l=void 0===d?"img":d,f=(0,a.Z)(e,h),Z=(0,c.vE)(t,"card-img");return(0,u.jsx)(l,(0,r.Z)({ref:n,className:i()(o?"".concat(Z,"-").concat(o):Z,s)},f))}));f.displayName="CardImg";var Z=f,p=t(15614),m=["bsPrefix","className","as"],x=o.forwardRef((function(e,n){var t=e.bsPrefix,s=e.className,d=e.as,l=void 0===d?"div":d,h=(0,a.Z)(e,m),f=(0,c.vE)(t,"card-header"),Z=(0,o.useMemo)((function(){return{cardHeaderBsPrefix:f}}),[f]);return(0,u.jsx)(p.Z.Provider,{value:Z,children:(0,u.jsx)(l,(0,r.Z)((0,r.Z)({ref:n},h),{},{className:i()(s,f)}))})}));x.displayName="CardHeader";var v=x,g=["bsPrefix","className","bg","text","border","body","children","as"],j=(0,l.Z)("h5"),y=(0,l.Z)("h6"),C=(0,d.Z)("card-body"),_=(0,d.Z)("card-title",{Component:j}),b=(0,d.Z)("card-subtitle",{Component:y}),N=(0,d.Z)("card-link",{Component:"a"}),k=(0,d.Z)("card-text",{Component:"p"}),w=(0,d.Z)("card-footer"),L=(0,d.Z)("card-img-overlay"),E=o.forwardRef((function(e,n){var t=e.bsPrefix,s=e.className,o=e.bg,d=e.text,l=e.border,h=e.body,f=e.children,Z=e.as,p=void 0===Z?"div":Z,m=(0,a.Z)(e,g),x=(0,c.vE)(t,"card");return(0,u.jsx)(p,(0,r.Z)((0,r.Z)({ref:n},m),{},{className:i()(s,x,o&&"bg-".concat(o),d&&"text-".concat(d),l&&"border-".concat(l)),children:h?(0,u.jsx)(C,{children:f}):f}))}));E.displayName="Card",E.defaultProps={body:!1};var S=Object.assign(E,{Img:Z,Title:_,Subtitle:b,Body:C,Link:N,Text:k,Header:v,Footer:w,ImgOverlay:L})},15614:function(e,n,t){var r=t(47313).createContext(null);r.displayName="CardHeaderContext",n.Z=r},62396:function(e,n,t){t.d(n,{Z:function(){return _}});var r=t(18489),a=t(83738),s=t(36222),i=t(46123),o=t.n(i),c=t(46988),d=t(47313),l=t(22752),u=t(59498);var h,f=function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return n.filter((function(e){return null!=e})).reduce((function(e,n){if("function"!==typeof n)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===e?n:function(){for(var t=arguments.length,r=new Array(t),a=0;a<t;a++)r[a]=arguments[a];e.apply(this,r),n.apply(this,r)}}),null)},Z=t(6280),p=t(39776),m=t(46417),x=["onEnter","onEntering","onEntered","onExit","onExiting","className","children","dimension","getDimensionValue"],v={height:["marginTop","marginBottom"],width:["marginLeft","marginRight"]};function g(e,n){var t=n["offset".concat(e[0].toUpperCase()).concat(e.slice(1))],r=v[e];return t+parseInt((0,c.Z)(n,r[0]),10)+parseInt((0,c.Z)(n,r[1]),10)}var j=(h={},(0,s.Z)(h,l.Wj,"collapse"),(0,s.Z)(h,l.Ix,"collapsing"),(0,s.Z)(h,l.d0,"collapsing"),(0,s.Z)(h,l.cn,"collapse show"),h),y={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1,getDimensionValue:g},C=d.forwardRef((function(e,n){var t=e.onEnter,s=e.onEntering,i=e.onEntered,c=e.onExit,l=e.onExiting,h=e.className,v=e.children,y=e.dimension,C=void 0===y?"height":y,_=e.getDimensionValue,b=void 0===_?g:_,N=(0,a.Z)(e,x),k="function"===typeof C?C():C,w=(0,d.useMemo)((function(){return f((function(e){e.style[k]="0"}),t)}),[k,t]),L=(0,d.useMemo)((function(){return f((function(e){var n="scroll".concat(k[0].toUpperCase()).concat(k.slice(1));e.style[k]="".concat(e[n],"px")}),s)}),[k,s]),E=(0,d.useMemo)((function(){return f((function(e){e.style[k]=null}),i)}),[k,i]),S=(0,d.useMemo)((function(){return f((function(e){e.style[k]="".concat(b(k,e),"px"),(0,Z.Z)(e)}),c)}),[c,b,k]),I=(0,d.useMemo)((function(){return f((function(e){e.style[k]=null}),l)}),[k,l]);return(0,m.jsx)(p.Z,(0,r.Z)((0,r.Z)({ref:n,addEndListener:u.Z},N),{},{"aria-expanded":N.role?N.in:null,onEnter:w,onEntering:L,onEntered:E,onExit:S,onExiting:I,childRef:v.ref,children:function(e,n){return d.cloneElement(v,(0,r.Z)((0,r.Z)({},n),{},{className:o()(h,v.props.className,j[e],"width"===k&&"collapse-horizontal")}))}}))}));C.defaultProps=y;var _=C}}]);