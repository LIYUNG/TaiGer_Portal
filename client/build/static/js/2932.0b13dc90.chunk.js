"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[2932],{50099:function(e,t,n){var a=n(35531),s=n(27853),r=n(84531),i=n(78932),l=n(66621),o=n(47313),d=n(58050),c=n(72880),h=n(88815),u=n(29678),m=n.n(u),p=n(54991),x=n(12401),Z=n(46417),f=function(e){(0,i.Z)(n,e);var t=(0,l.Z)(n);function n(){var e;(0,s.Z)(this,n);for(var a=arguments.length,r=new Array(a),i=0;i<a;i++)r[i]=arguments[i];return(e=t.call.apply(t,[this].concat(r))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,r.Z)(n,[{key:"render",value:function(){var e,t,n,s,r,i=this,l=[];return this.state.isOption&&(n=(0,Z.jsx)("div",{className:"card-header-right",children:(0,Z.jsxs)(d.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,Z.jsx)(d.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,Z.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,Z.jsxs)(d.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,Z.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){i.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,Z.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,Z.jsxs)("a",{href:x.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,Z.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){i.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,Z.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,Z.jsxs)("a",{href:x.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,Z.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,Z.jsx)("i",{className:"feather icon-refresh-cw"}),(0,Z.jsx)("a",{href:x.Z.BLANK_LINK,children:" Reload "})]}),(0,Z.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,Z.jsx)("i",{className:"feather icon-trash"}),(0,Z.jsx)("a",{href:x.Z.BLANK_LINK,children:" Remove "})]})]})]})})),s=(0,Z.jsxs)(c.Z.Header,{children:[(0,Z.jsx)(c.Z.Title,{as:"h5",children:this.props.title}),n]}),this.state.fullCard&&(l=[].concat((0,a.Z)(l),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(l=[].concat((0,a.Z)(l),["card-load"]),t=(0,Z.jsx)("div",{className:"card-loader",children:(0,Z.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(l=[].concat((0,a.Z)(l),["d-none"])),this.props.cardClass&&(l=[].concat((0,a.Z)(l),[this.props.cardClass])),r=(0,Z.jsxs)(c.Z,{className:l.join(" "),style:e,children:[s,(0,Z.jsx)(h.Z,{in:!this.state.collapseCard,children:(0,Z.jsx)("div",{children:(0,Z.jsx)(c.Z.Body,{children:this.props.children})})}),t]}),(0,Z.jsx)(p.Z,{children:r})}}]),n}(o.Component);t.Z=m()(f)},2932:function(e,t,n){n.r(t);var a=n(18489),s=n(27853),r=n(84531),i=n(78932),l=n(66621),o=n(47313),d=n(44030),c=n(63849),h=n(31616),u=n(72880),m=n(83109),p=n(93298),x=n(64212),Z=n(54991),f=n(94611),j=n(86450),g=n(51426),C=n(46417),w=function(e){(0,i.Z)(n,e);var t=(0,l.Z)(n);function n(){var e;(0,s.Z)(this,n);for(var r=arguments.length,i=new Array(r),l=0;l<r;l++)i[l]=arguments[l];return(e=t.call.apply(t,[this].concat(i))).state={error:null,timeouterror:null,unauthorizederror:null,role:"",isLoaded:!1,data:null,success:!1,user:{},changed_personaldata:!1,personaldata:{firstname:e.props.user.firstname,lastname:e.props.user.lastname},credentials:{current_password:"",new_password:"",new_password_again:""},updateconfirmed:!1,updatecredentialconfirmed:!1},e.handleChange_PersonalData=function(t){var n=(0,a.Z)({},e.state.personaldata);n[t.target.id]=t.target.value,e.setState((function(e){return(0,a.Z)((0,a.Z)({},e),{},{changed_personaldata:!0,personaldata:n})}))},e.handleSubmit_PersonalData=function(t,n){(0,g.pA)(n).then((function(t){var n=t.data,s=n.data,r=n.success;r?e.setState((function(e){return(0,a.Z)((0,a.Z)({},e),{},{isLoaded:!0,personaldata:s,success:r,changed_personaldata:!1,updateconfirmed:!0})})):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})}))},e.handleChange_Credentials=function(t){var n=(0,a.Z)({},e.state.credentials);n[t.target.id]=t.target.value,e.setState((function(e){return(0,a.Z)((0,a.Z)({},e),{},{credentials:n})}))},e.handleSubmit_Credentials=function(t,n,s){n.new_password===n.new_password_again?n.new_password.length<8?alert("New password should have at least 8 characters."):(0,g.eX)(n,s,n.current_password).then((function(t){var n=t.data.success;n?e.setState((function(e){return(0,a.Z)((0,a.Z)({},e),{},{isLoaded:!0,success:n,updatecredentialconfirmed:!0})})):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){alert(t),e.setState({isLoaded:!0})})):alert("New password not matched")},e.onHide=function(){e.setState({updateconfirmed:!1})},e.onHideCredential=function(){e.setState({updateconfirmed:!1})},e.setmodalhide=function(){window.location.reload(!0)},e.setmodalhideUpdateCredentials=function(){(0,g.kS)().then((function(e){window.location.reload(!0)}),(function(e){}))},e}return(0,r.Z)(n,[{key:"componentDidMount",value:function(){this.setState((function(e){return(0,a.Z)((0,a.Z)({},e),{},{isLoaded:!0,success:!0})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.unauthorizederror,a=t.timeouterror,s=t.isLoaded;if(a)return(0,C.jsx)("div",{children:(0,C.jsx)(f.Z,{})});if(n)return(0,C.jsx)("div",{children:(0,C.jsx)(j.Z,{})});var r={position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"};return s?(0,C.jsxs)(Z.Z,{children:[(0,C.jsx)(c.Z,{children:(0,C.jsxs)(h.Z,{children:[(0,C.jsxs)(u.Z,{className:"my-4 mx-0",bg:"dark",text:"white",children:[(0,C.jsx)(u.Z.Header,{children:(0,C.jsx)(u.Z.Title,{className:"my-0 mx-0 text-light",children:"Personal Data"})}),(0,C.jsx)(u.Z.Body,{children:(0,C.jsxs)(c.Z,{children:[(0,C.jsxs)(h.Z,{children:[(0,C.jsxs)(m.Z.Group,{controlId:"firstname",children:[(0,C.jsx)(m.Z.Label,{className:"my-0 mx-0 text-light",children:"Firstname"}),(0,C.jsx)(m.Z.Control,{type:"text",placeholder:"First name",autoComplete:"nope",defaultValue:this.state.personaldata.firstname,onChange:function(t){return e.handleChange_PersonalData(t)}})]}),(0,C.jsx)("br",{}),(0,C.jsxs)(m.Z.Group,{className:"mb-2",children:[(0,C.jsx)(m.Z.Label,{className:"my-0 mx-0 text-light",children:"Email"}),(0,C.jsx)("p",{className:"text-primary",children:this.props.user.email})]})]}),(0,C.jsxs)(h.Z,{md:6,children:[(0,C.jsxs)(m.Z.Group,{controlId:"lastname",children:[(0,C.jsx)(m.Z.Label,{className:"my-0 mx-0 text-light",children:"Lastname"}),(0,C.jsx)(m.Z.Control,{type:"text",placeholder:"Last name",defaultValue:this.state.personaldata.lastname,onChange:function(t){return e.handleChange_PersonalData(t)}})]}),(0,C.jsx)("br",{}),(0,C.jsx)("br",{}),(0,C.jsx)(p.Z,{variant:"primary",disabled:""===this.state.personaldata.firstname||""===this.state.personaldata.lastname||!this.state.changed_personaldata,onClick:function(t){return e.handleSubmit_PersonalData(t,e.state.personaldata)},children:"Update"})]})]})})]}),!s&&(0,C.jsx)("div",{style:r,children:(0,C.jsx)(d.Z,{animation:"border",role:"status",children:(0,C.jsx)("span",{className:"visually-hidden"})})})]})}),(0,C.jsx)(c.Z,{children:(0,C.jsxs)(h.Z,{md:6,children:[(0,C.jsxs)(u.Z,{className:"my-4 mx-0",bg:"dark",text:"white",children:[(0,C.jsx)(u.Z.Header,{children:(0,C.jsx)(u.Z.Title,{className:"my-0 mx-0 text-light",children:"Login"})}),(0,C.jsxs)(u.Z.Body,{children:[(0,C.jsx)(c.Z,{className:"my-0 mx-0",children:(0,C.jsx)(h.Z,{children:(0,C.jsxs)(m.Z.Group,{controlId:"current_password",children:[(0,C.jsx)(m.Z.Label,{className:"my-0 mx-0 text-light",children:"Current Password"}),(0,C.jsx)(m.Z.Control,{type:"password",onChange:function(t){return e.handleChange_Credentials(t)}})]})})}),(0,C.jsx)(c.Z,{className:"my-4 mx-0",children:(0,C.jsx)(h.Z,{children:(0,C.jsxs)(m.Z.Group,{controlId:"new_password",children:[(0,C.jsx)(m.Z.Label,{className:"my-0 mx-0 text-light",children:"New Password"}),(0,C.jsx)(m.Z.Control,{type:"password",onChange:function(t){return e.handleChange_Credentials(t)}})]})})}),(0,C.jsx)(c.Z,{className:"my-0 mx-0",children:(0,C.jsxs)(h.Z,{children:[(0,C.jsxs)(m.Z.Group,{controlId:"new_password_again",children:[(0,C.jsx)(m.Z.Label,{className:"my-0 mx-0 text-light",children:"Enter New Password Again"}),(0,C.jsx)(m.Z.Control,{type:"password",onChange:function(t){return e.handleChange_Credentials(t)}})]}),(0,C.jsx)("br",{}),(0,C.jsx)(p.Z,{disabled:""===this.state.credentials.current_password||""===this.state.credentials.new_password||""===this.state.credentials.new_password_again,variant:"primary",onClick:function(t){return e.handleSubmit_Credentials(t,e.state.credentials,e.props.user.email)},children:"Submit"})]})})]})]}),!s&&(0,C.jsx)("div",{style:r,children:(0,C.jsx)(d.Z,{animation:"border",role:"status",children:(0,C.jsx)("span",{className:"visually-hidden"})})})]})}),(0,C.jsxs)(x.Z,{show:this.state.updateconfirmed,onHide:this.onHide,size:"sm","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,C.jsx)(x.Z.Header,{children:(0,C.jsx)(x.Z.Title,{id:"contained-modal-title-vcenter",children:"Update Success"})}),(0,C.jsx)(x.Z.Body,{children:"Personal Data is updated successfully!"}),(0,C.jsx)(x.Z.Footer,{children:(0,C.jsx)(p.Z,{onClick:this.setmodalhide,children:"Close"})})]}),(0,C.jsxs)(x.Z,{show:this.state.updatecredentialconfirmed,onHide:this.onHideCredential,size:"sm","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,C.jsx)(x.Z.Header,{children:(0,C.jsx)(x.Z.Title,{id:"contained-modal-title-vcenter",children:"Update Credentials Successfully"})}),(0,C.jsx)(x.Z.Body,{children:"Credentials are updated successfully! Please login again."}),(0,C.jsx)(x.Z.Footer,{children:(0,C.jsx)(p.Z,{onClick:function(t){return e.setmodalhideUpdateCredentials(t)},children:"Ok"})})]})]}):(0,C.jsx)("div",{style:r,children:(0,C.jsx)(d.Z,{animation:"border",role:"status",children:(0,C.jsx)("span",{className:"visually-hidden"})})})}}]),n}(o.Component);t.default=w},94611:function(e,t,n){var a=n(27853),s=n(84531),r=n(78932),i=n(66621),l=n(47313),o=n(63849),d=n(31616),c=n(50099),h=n(54991),u=n(46417),m=function(e){(0,r.Z)(n,e);var t=(0,i.Z)(n);function n(){return(0,a.Z)(this,n),t.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){return(0,u.jsx)(h.Z,{children:(0,u.jsx)(o.Z,{children:(0,u.jsx)(d.Z,{children:(0,u.jsx)(c.Z,{children:"Time out error. Please login again!"})})})})}}]),n}(l.Component);t.Z=m},86450:function(e,t,n){var a=n(27853),s=n(84531),r=n(78932),i=n(66621),l=n(47313),o=n(63849),d=n(31616),c=n(50099),h=n(54991),u=n(46417),m=function(e){(0,r.Z)(n,e);var t=(0,i.Z)(n);function n(){return(0,a.Z)(this,n),t.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){return(0,u.jsx)(h.Z,{children:(0,u.jsx)(o.Z,{children:(0,u.jsx)(d.Z,{children:(0,u.jsx)(c.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),n}(l.Component);t.Z=m},88815:function(e,t,n){var a,s=n(1368),r=n(38321),i=n(46123),l=n.n(i),o=n(46988),d=n(47313),c=n(67557),h=n(59498),u=n(31207),m=n(6280),p=["onEnter","onEntering","onEntered","onExit","onExiting","className","children","dimension","getDimensionValue"],x={height:["marginTop","marginBottom"],width:["marginLeft","marginRight"]};function Z(e,t){var n=t["offset"+e[0].toUpperCase()+e.slice(1)],a=x[e];return n+parseInt((0,o.Z)(t,a[0]),10)+parseInt((0,o.Z)(t,a[1]),10)}var f=((a={})[c.Wj]="collapse",a[c.Ix]="collapsing",a[c.d0]="collapsing",a[c.cn]="collapse show",a),j={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1,getDimensionValue:Z},g=d.forwardRef((function(e,t){var n=e.onEnter,a=e.onEntering,i=e.onEntered,o=e.onExit,x=e.onExiting,j=e.className,g=e.children,C=e.dimension,w=void 0===C?"height":C,v=e.getDimensionValue,y=void 0===v?Z:v,N=(0,r.Z)(e,p),_="function"===typeof w?w():w,b=(0,d.useMemo)((function(){return(0,u.Z)((function(e){e.style[_]="0"}),n)}),[_,n]),L=(0,d.useMemo)((function(){return(0,u.Z)((function(e){var t="scroll"+_[0].toUpperCase()+_.slice(1);e.style[_]=e[t]+"px"}),a)}),[_,a]),S=(0,d.useMemo)((function(){return(0,u.Z)((function(e){e.style[_]=null}),i)}),[_,i]),E=(0,d.useMemo)((function(){return(0,u.Z)((function(e){e.style[_]=y(_,e)+"px",(0,m.Z)(e)}),o)}),[o,y,_]),k=(0,d.useMemo)((function(){return(0,u.Z)((function(e){e.style[_]=null}),x)}),[_,x]);return d.createElement(c.ZP,(0,s.Z)({ref:t,addEndListener:h.Z},N,{"aria-expanded":N.role?N.in:null,onEnter:b,onEntering:L,onEntered:S,onExit:E,onExiting:k}),(function(e,t){return d.cloneElement(g,(0,s.Z)({},t,{className:l()(j,g.props.className,f[e],"width"===_&&"width")}))}))}));g.defaultProps=j,t.Z=g}}]);