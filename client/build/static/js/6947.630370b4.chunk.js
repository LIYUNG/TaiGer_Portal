"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[6947],{50099:function(e,t,r){var n=r(35531),s=r(27853),a=r(84531),i=r(78932),o=r(38128),c=r(47313),d=r(73158),l=r(65832),u=r(62396),h=r(29678),p=r.n(h),f=r(54991),m=r(12401),Z=r(46417),x=function(e){(0,i.Z)(r,e);var t=(0,o.Z)(r);function r(){var e;(0,s.Z)(this,r);for(var n=arguments.length,a=new Array(n),i=0;i<n;i++)a[i]=arguments[i];return(e=t.call.apply(t,[this].concat(a))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,a.Z)(r,[{key:"render",value:function(){var e,t,r,s,a,i=this,o=[];return this.state.isOption&&(r=(0,Z.jsx)("div",{className:"card-header-right",children:(0,Z.jsxs)(d.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,Z.jsx)(d.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,Z.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,Z.jsxs)(d.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,Z.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){i.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,Z.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,Z.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,Z.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){i.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,Z.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,Z.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,Z.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,Z.jsx)("i",{className:"feather icon-refresh-cw"}),(0,Z.jsx)("a",{href:m.Z.BLANK_LINK,children:" Reload "})]}),(0,Z.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,Z.jsx)("i",{className:"feather icon-trash"}),(0,Z.jsx)("a",{href:m.Z.BLANK_LINK,children:" Remove "})]})]})]})})),s=(0,Z.jsxs)(l.Z.Header,{children:[(0,Z.jsx)(l.Z.Title,{as:"h5",children:this.props.title}),r]}),this.state.fullCard&&(o=[].concat((0,n.Z)(o),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(o=[].concat((0,n.Z)(o),["card-load"]),t=(0,Z.jsx)("div",{className:"card-loader",children:(0,Z.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(o=[].concat((0,n.Z)(o),["d-none"])),this.props.cardClass&&(o=[].concat((0,n.Z)(o),[this.props.cardClass])),a=(0,Z.jsxs)(l.Z,{className:o.join(" "),style:e,children:[s,(0,Z.jsx)(u.Z,{in:!this.state.collapseCard,children:(0,Z.jsx)("div",{children:(0,Z.jsx)(l.Z.Body,{children:this.props.children})})}),t]}),(0,Z.jsx)(f.Z,{children:a})}}]),r}(c.Component);t.Z=p()(x)},26947:function(e,t,r){r.r(t),r.d(t,{default:function(){return k}});var n=r(27853),s=r(84531),a=r(78932),i=r(38128),o=r(47313),c=r(44030),d=r(65832),l=r(94611),u=r(86450),h=r(29021),p=r(31616),f=r(465),m=r(51426),Z=r(46417),x=function(e){(0,a.Z)(r,e);var t=(0,i.Z)(r);function r(){return(0,n.Z)(this,r),t.apply(this,arguments)}return(0,s.Z)(r,[{key:"render",value:function(){var e=this.props.interviews.map((function(e,t){return(0,Z.jsx)(Z.Fragment,{children:(0,Z.jsxs)("tr",{children:[e.program_id.school," ",e.program_id.program_name]})})}));return(0,Z.jsx)(Z.Fragment,{children:(0,Z.jsx)(p.Z,{children:(0,Z.jsx)(f.Z,{size:"sm",children:(0,Z.jsx)("tbody",{children:e})})})})}}]),r}(o.Component),v=x,j=function(e){(0,a.Z)(r,e);var t=(0,i.Z)(r);function r(){var e;(0,n.Z)(this,r);for(var s=arguments.length,a=new Array(s),i=0;i<s;i++)a[i]=arguments[i];return(e=t.call.apply(t,[this].concat(a))).state={error:null,timeouterror:null,unauthorizederror:null,pagenotfounderror:null,role:"",isLoaded:!1,interviews:[],success:!1,academic_background:{},updateconfirmed:!1},e}return(0,s.Z)(r,[{key:"componentDidMount",value:function(){var e=this;(0,m.LU)().then((function(t){var r=t.data,n=r.data,s=r.success;s?e.setState({isLoaded:!0,interviews:n,success:s}):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status?e.setState({isLoaded:!0,unauthorizederror:!0}):400===t.status&&e.setState({isLoaded:!0,pagenotfounderror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})})),this.setState({isLoaded:!0})}},{key:"render",value:function(){var e=this.state,t=e.pagenotfounderror,r=e.unauthorizederror,n=e.timeouterror,s=e.isLoaded;return n?(0,Z.jsx)("div",{children:(0,Z.jsx)(l.Z,{})}):r?(0,Z.jsx)("div",{children:(0,Z.jsx)(u.Z,{})}):t?(0,Z.jsx)("div",{children:(0,Z.jsx)(h.Z,{})}):s?(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(d.Z,{className:"mt-0",children:(0,Z.jsx)(d.Z.Header,{children:(0,Z.jsx)(d.Z.Title,{children:"Interview Training page "})})}),(0,Z.jsx)(d.Z,{className:"mt-0",children:(0,Z.jsx)(d.Z.Body,{children:(0,Z.jsx)(v,{interviews:this.state.interviews})})})]}):(0,Z.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,Z.jsx)(c.Z,{animation:"border",role:"status",children:(0,Z.jsx)("span",{className:"visually-hidden"})})})}}]),r}(o.Component),g=j,y=r(63849),N=r(76935),w=r(93298),C=function(e){(0,a.Z)(r,e);var t=(0,i.Z)(r);function r(){var e;(0,n.Z)(this,r);for(var s=arguments.length,a=new Array(s),i=0;i<s;i++)a[i]=arguments[i];return(e=t.call.apply(t,[this].concat(a))).state={error:null,role:"",isLoaded:!1,data:null,students:[],success:!1,academic_background:{},updateconfirmed:!1,unauthorizederror:null},e}return(0,s.Z)(r,[{key:"componentDidMount",value:function(){var e=this;(0,m.fT)().then((function(t){var r=t.data,n=r.data,s=r.success;s?e.setState({isLoaded:!0,students:n,success:s}):401===t.status||500===t.status?e.setState({isLoaded:!0,error:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})})),this.setState({isLoaded:!0})}},{key:"render",value:function(){var e=this,t=this.state,r=t.error,n=t.isLoaded;if(r)return(0,Z.jsx)("div",{children:"Error: your session is timeout! Please refresh the page and Login"});if(!n&&0===this.state.students.length)return(0,Z.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,Z.jsx)(c.Z,{animation:"border",role:"status",children:(0,Z.jsx)("span",{className:"visually-hidden"})})});var s=this.state.students.map((function(e,t){return e.applications.map((function(e,t){return(0,Z.jsxs)("option",{value:e.programId._id,children:[e.programId.school," - ",e.programId.program_name]})}))}));return(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(p.Z,{md:9,children:(0,Z.jsx)(N.Z,{children:(0,Z.jsx)(N.Z.Group,{controlId:"formFile",className:"mb-3",children:(0,Z.jsxs)(N.Z.Control,{as:"select",onChange:function(t){return e.props.handleSelect(t)},value:this.props.program_id,children:[(0,Z.jsx)("option",{value:"",children:"Please Select"}),s]})})})}),(0,Z.jsx)(p.Z,{md:3,children:(0,Z.jsx)(w.Z,{onClick:function(t){return e.props.handleSubmit(t)},children:"Submit"})})]})}}]),r}(o.Component),L=C,S=function(e){(0,a.Z)(r,e);var t=(0,i.Z)(r);function r(){var e;(0,n.Z)(this,r);for(var s=arguments.length,a=new Array(s),i=0;i<s;i++)a[i]=arguments[i];return(e=t.call.apply(t,[this].concat(a))).state={error:null,program_id:"",role:"",isLoaded:!1,category:null,interviews:[],success:!1,academic_background:{},updateconfirmed:!1,unauthorizederror:null},e.handleSelect=function(t){t.preventDefault(),e.setState({program_id:t.target.value})},e.handleSubmit=function(t){t.preventDefault(),(0,m.Ax)(e.state.program_id,e.props.user._id).then((function(t){var r=t.data,n=r.data,s=r.success;s?e.setState({isLoaded:!0,interviews:n,success:s}):401===t.status||500===t.status?e.setState({isLoaded:!0,error:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})}))},e}return(0,s.Z)(r,[{key:"componentDidMount",value:function(){var e=this;(0,m.mi)().then((function(t){var r=t.data,n=r.data,s=r.success;s?e.setState({isLoaded:!0,interviews:n,success:s}):401===t.status||500===t.status?e.setState({isLoaded:!0,error:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})})),this.setState({isLoaded:!0})}},{key:"render",value:function(){var e=this.state,t=e.error,r=e.isLoaded;return t?(0,Z.jsx)("div",{children:"Error: your session is timeout! Please refresh the page and Login"}):r||this.state.interviews?(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(d.Z,{className:"mt-0",children:(0,Z.jsx)(d.Z.Header,{children:(0,Z.jsx)(d.Z.Title,{children:"Student interview page"})})}),(0,Z.jsxs)(d.Z,{className:"mt-0",children:[(0,Z.jsx)(d.Z.Header,{children:(0,Z.jsx)(d.Z.Title,{children:"Open interviews"})}),(0,Z.jsx)(d.Z.Body,{children:(0,Z.jsx)(v,{interviews:this.state.interviews})})]}),(0,Z.jsx)(d.Z,{className:"mt-0",children:(0,Z.jsx)(d.Z.Body,{children:(0,Z.jsx)(y.Z,{children:(0,Z.jsx)(L,{program_id:this.state.program_id,handleSelect:this.handleSelect,handleSubmit:this.handleSubmit})})})})]}):(0,Z.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,Z.jsx)(c.Z,{animation:"border",role:"status",children:(0,Z.jsx)("span",{className:"visually-hidden"})})})}}]),r}(o.Component),b=S,_=r(54991),E=function(e){(0,a.Z)(r,e);var t=(0,i.Z)(r);function r(){return(0,n.Z)(this,r),t.apply(this,arguments)}return(0,s.Z)(r,[{key:"render",value:function(){return(0,Z.jsxs)(_.Z,{children:["Student"===this.props.user.role&&(0,Z.jsx)(Z.Fragment,{children:(0,Z.jsx)(b,{user:this.props.user})}),("Editor"===this.props.user.role||"Agent"===this.props.user.role||"Admin"===this.props.user.role)&&(0,Z.jsx)(Z.Fragment,{children:(0,Z.jsx)(g,{user:this.props.user})})]})}}]),r}(o.Component),k=E},29021:function(e,t,r){var n=r(27853),s=r(84531),a=r(78932),i=r(38128),o=r(47313),c=r(63849),d=r(31616),l=r(65832),u=r(54991),h=r(46417),p=function(e){(0,a.Z)(r,e);var t=(0,i.Z)(r);function r(){return(0,n.Z)(this,r),t.apply(this,arguments)}return(0,s.Z)(r,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(c.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(l.Z,{children:(0,h.jsx)(l.Z.Body,{children:(0,h.jsx)("h4",{children:"Page Not Found!"})})})})})})}}]),r}(o.Component);t.Z=p},94611:function(e,t,r){var n=r(27853),s=r(84531),a=r(78932),i=r(38128),o=r(47313),c=r(63849),d=r(31616),l=r(50099),u=r(54991),h=r(46417),p=function(e){(0,a.Z)(r,e);var t=(0,i.Z)(r);function r(){return(0,n.Z)(this,r),t.apply(this,arguments)}return(0,s.Z)(r,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(c.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(l.Z,{children:"Time out error. Please login again!"})})})})}}]),r}(o.Component);t.Z=p},86450:function(e,t,r){var n=r(27853),s=r(84531),a=r(78932),i=r(38128),o=r(47313),c=r(63849),d=r(31616),l=r(50099),u=r(54991),h=r(46417),p=function(e){(0,a.Z)(r,e);var t=(0,i.Z)(r);function r(){return(0,n.Z)(this,r),t.apply(this,arguments)}return(0,s.Z)(r,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(c.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(l.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),r}(o.Component);t.Z=p},62396:function(e,t,r){r.d(t,{Z:function(){return w}});var n=r(18489),s=r(83738),a=r(36222),i=r(46123),o=r.n(i),c=r(46988),d=r(47313),l=r(22752),u=r(59498);var h,p=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return t.filter((function(e){return null!=e})).reduce((function(e,t){if("function"!==typeof t)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===e?t:function(){for(var r=arguments.length,n=new Array(r),s=0;s<r;s++)n[s]=arguments[s];e.apply(this,n),t.apply(this,n)}}),null)},f=r(6280),m=r(75879),Z=r(46417),x=["onEnter","onEntering","onEntered","onExit","onExiting","className","children","dimension","getDimensionValue"],v={height:["marginTop","marginBottom"],width:["marginLeft","marginRight"]};function j(e,t){var r=t["offset".concat(e[0].toUpperCase()).concat(e.slice(1))],n=v[e];return r+parseInt((0,c.Z)(t,n[0]),10)+parseInt((0,c.Z)(t,n[1]),10)}var g=(h={},(0,a.Z)(h,l.Wj,"collapse"),(0,a.Z)(h,l.Ix,"collapsing"),(0,a.Z)(h,l.d0,"collapsing"),(0,a.Z)(h,l.cn,"collapse show"),h),y={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1,getDimensionValue:j},N=d.forwardRef((function(e,t){var r=e.onEnter,a=e.onEntering,i=e.onEntered,c=e.onExit,l=e.onExiting,h=e.className,v=e.children,y=e.dimension,N=void 0===y?"height":y,w=e.getDimensionValue,C=void 0===w?j:w,L=(0,s.Z)(e,x),S="function"===typeof N?N():N,b=(0,d.useMemo)((function(){return p((function(e){e.style[S]="0"}),r)}),[S,r]),_=(0,d.useMemo)((function(){return p((function(e){var t="scroll".concat(S[0].toUpperCase()).concat(S.slice(1));e.style[S]="".concat(e[t],"px")}),a)}),[S,a]),E=(0,d.useMemo)((function(){return p((function(e){e.style[S]=null}),i)}),[S,i]),k=(0,d.useMemo)((function(){return p((function(e){e.style[S]="".concat(C(S,e),"px"),(0,f.Z)(e)}),c)}),[c,C,S]),I=(0,d.useMemo)((function(){return p((function(e){e.style[S]=null}),l)}),[S,l]);return(0,Z.jsx)(m.Z,(0,n.Z)((0,n.Z)({ref:t,addEndListener:u.Z},L),{},{"aria-expanded":L.role?L.in:null,onEnter:b,onEntering:_,onEntered:E,onExit:k,onExiting:I,childRef:v.ref,children:function(e,t){return d.cloneElement(v,(0,n.Z)((0,n.Z)({},t),{},{className:o()(h,v.props.className,g[e],"width"===S&&"collapse-horizontal")}))}}))}));N.defaultProps=y;var w=N},465:function(e,t,r){var n=r(18489),s=r(83738),a=r(46123),i=r.n(a),o=r(47313),c=r(68524),d=r(46417),l=["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"],u=o.forwardRef((function(e,t){var r=e.bsPrefix,a=e.className,o=e.striped,u=e.bordered,h=e.borderless,p=e.hover,f=e.size,m=e.variant,Z=e.responsive,x=(0,s.Z)(e,l),v=(0,c.vE)(r,"table"),j=i()(a,v,m&&"".concat(v,"-").concat(m),f&&"".concat(v,"-").concat(f),o&&"".concat(v,"-").concat("string"===typeof o?"striped-".concat(o):"striped"),u&&"".concat(v,"-bordered"),h&&"".concat(v,"-borderless"),p&&"".concat(v,"-hover")),g=(0,d.jsx)("table",(0,n.Z)((0,n.Z)({},x),{},{className:j,ref:t}));if(Z){var y="".concat(v,"-responsive");return"string"===typeof Z&&(y="".concat(y,"-").concat(Z)),(0,d.jsx)("div",{className:y,children:g})}return g}));t.Z=u}}]);