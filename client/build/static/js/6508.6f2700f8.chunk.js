"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[6508],{44827:function(t,e,n){n.r(e),n.d(e,{default:function(){return L}});var s=n(35531),i=n(36222),r=n(18489),a=n(27853),o=n(84531),d=n(78932),l=n(38128),u=n(47313),c=n(44030),h=n(94395),p=n(54991),f=n(63849),g=n(31616),m=n(65832),x=n(465),v=n(93240),Z=n(46417),A=function(t){(0,d.Z)(n,t);var e=(0,l.Z)(n);function n(){return(0,a.Z)(this,n),e.apply(this,arguments)}return(0,o.Z)(n,[{key:"render",value:function(){var t=this,e=this.props.students.map((function(e,n){return(0,Z.jsx)(v.Z,{role:t.props.role,student:e,updateStudentArchivStatus:t.props.updateStudentArchivStatus,editAgent:t.props.editAgent,agent_list:t.props.agent_list,updateAgentList:t.props.updateAgentList,handleChangeAgentlist:t.props.handleChangeAgentlist,submitUpdateAgentlist:t.props.submitUpdateAgentlist},n)}));return(0,Z.jsx)(Z.Fragment,{children:(0,Z.jsx)(f.Z,{children:(0,Z.jsx)(g.Z,{mx:0,my:0,children:(0,Z.jsxs)(m.Z,{className:"my-0 mx-0  text-light",bg:"danger",text:"white",children:[(0,Z.jsx)(m.Z.Header,{children:(0,Z.jsx)(m.Z.Title,{className:"my-0 mx-0 text-light",children:"No Agents Students"})}),(0,Z.jsxs)(x.Z,{responsive:!0,variant:"dark",text:"light",className:"my-0 mx-0",size:"sm",children:[(0,Z.jsx)("thead",{children:(0,Z.jsxs)("tr",{children:[(0,Z.jsx)("th",{}),(0,Z.jsx)("th",{children:"First-, Last Name"}),(0,Z.jsx)("th",{children:"Email"})]})}),(0,Z.jsx)("tbody",{children:e})]})]})})})})}}]),n}(u.Component),j=A,_=n(82423),b=n(20688),y=n(51767),E=n(51426),C=function(t){(0,d.Z)(n,t);var e=(0,l.Z)(n);function n(){var t;(0,a.Z)(this,n);for(var o=arguments.length,d=new Array(o),l=0;l<o;l++)d[l]=arguments[l];return(t=e.call.apply(e,[this].concat(d))).state={error:null,agent_list:[],isLoaded:!1,students:[],updateAgentList:{},success:!1,isDashboard:!0,res_status:0,res_modal_message:"",res_modal_status:0},t.editAgent=function(e){(0,E.j8)().then((function(n){var s=n.data,a=s.data,o=s.success,d=n.status;if(o){var l=a,u=e.agents,c=l.reduce((function(t,e){var n=e._id;return(0,r.Z)((0,r.Z)({},t),{},(0,i.Z)({},n,!!u&&u.findIndex((function(t){return t._id===n}))>-1))}),{});t.setState((function(t){return(0,r.Z)((0,r.Z)({},t),{},{agent_list:l,updateAgentList:c,res_modal_status:d})}))}else{var h=n.data.message;t.setState((function(t){return(0,r.Z)((0,r.Z)({},t),{},{isLoaded:!0,res_modal_message:h,res_modal_status:d})}))}}),(function(t){}))},t.handleChangeAgentlist=function(e){var n=e.target,s=n.value,a=n.checked;t.setState((function(t){return{updateAgentList:(0,r.Z)((0,r.Z)({},t.updateAgentList),{},(0,i.Z)({},s,a))}}))},t.submitUpdateAgentlist=function(e,n,s){e.preventDefault(),t.UpdateAgentlist(e,n,s)},t.UpdateAgentlist=function(e,n,i){e.preventDefault(),(0,E.u)(n,i).then((function(e){var n=e.data,r=n.data,a=n.success,o=e.status;if(a){var d=(0,s.Z)(t.state.students),l=d.findIndex((function(t){return t._id===i}));d[l]=r,t.setState({isLoaded:!0,students:d,success:a,updateAgentList:[],res_status:o})}else t.setState({isLoaded:!0,res_status:o})}),(function(t){alert("UpdateAgentlist is failed.")}))},t.ConfirmError=function(){t.setState((function(t){return(0,r.Z)((0,r.Z)({},t),{},{res_modal_status:0,res_modal_message:""})}))},t}return(0,o.Z)(n,[{key:"componentDidMount",value:function(){var t=this;(0,E.sK)().then((function(e){var n=e.data,s=n.data,i=n.success,r=e.status;i?t.setState({isLoaded:!0,students:s,success:i,res_status:r}):t.setState({isLoaded:!0,res_status:r})}),(function(e){t.setState({isLoaded:!0,error:!0})}))}},{key:"componentDidUpdate",value:function(t,e){var n=this;!1===this.state.isLoaded&&(0,E.sK)().then((function(t){var e=t.data,s=e.data,i=e.success,r=t.status;i?n.setState({isLoaded:!0,students:s,success:i,res_status:r}):n.setState({isLoaded:!0,res_status:r})}),(function(t){n.setState({isLoaded:!0,error:!0})}))}},{key:"render",value:function(){if("Admin"!==this.props.user.role)return(0,Z.jsx)(h.Z,{to:"/dashboard/default"});var t=this.state,e=t.isLoaded,n=t.res_status,s=t.res_modal_status,i=t.res_modal_message;return e||this.state.data?n>=400?(0,Z.jsx)(_.Z,{res_status:n}):(0,Z.jsxs)(p.Z,{children:[!e&&(0,Z.jsx)("div",{style:y.nT,children:(0,Z.jsx)(c.Z,{animation:"border",role:"status",children:(0,Z.jsx)("span",{className:"visually-hidden"})})}),s>=400&&(0,Z.jsx)(b.Z,{ConfirmError:this.ConfirmError,res_modal_status:s,res_modal_message:i}),(0,Z.jsx)(j,{role:this.props.user.role,editAgent:this.editAgent,agent_list:this.state.agent_list,UpdateAgentlist:this.UpdateAgentlist,students:this.state.students,updateAgentList:this.state.updateAgentList,handleChangeAgentlist:this.handleChangeAgentlist,submitUpdateAgentlist:this.submitUpdateAgentlist,handleChangeEditorlist:this.handleChangeEditorlist,SYMBOL_EXPLANATION:y.vE,isDashboard:this.state.isDashboard})]}):(0,Z.jsx)("div",{style:y.nT,children:(0,Z.jsx)(c.Z,{animation:"border",role:"status",children:(0,Z.jsx)("span",{className:"visually-hidden"})})})}}]),n}(u.Component),L=C},93240:function(t,e,n){var s=n(27853),i=n(84531),r=n(78932),a=n(38128),o=n(47313),d=n(41251),l=n(73158),u=n(37062),c=n(89613),h=n(46417),p=function(t){(0,r.Z)(n,t);var e=(0,a.Z)(n);function n(){var t;(0,s.Z)(this,n);for(var i=arguments.length,r=new Array(i),a=0;a<i;a++)r[a]=arguments[a];return(t=e.call.apply(e,[this].concat(r))).state={showAgentPage:!1},t.setAgentModalhide=function(){t.setState({showAgentPage:!1})},t.startEditingAgent=function(e){t.props.editAgent(e),t.setState({subpage:1,showAgentPage:!0})},t.submitUpdateAgentlist=function(e,n,s){e.preventDefault(),t.setAgentModalhide(),t.props.submitUpdateAgentlist(e,n,s)},t}return(0,i.Z)(n,[{key:"render",value:function(){var t=this;return void 0===this.props.student.agents||0===this.props.student.agents.length?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)("tr",{children:["Admin"===this.props.role&&!this.props.isArchivPage&&(0,h.jsx)("td",{children:(0,h.jsx)(d.Z,{className:"my-0 mx-0",size:"sm",title:"Option",variant:"primary",id:"dropdown-variants-".concat(this.props.student._id),children:(0,h.jsx)(l.Z.Item,{eventKey:"1",onClick:function(){return t.startEditingAgent(t.props.student)},children:"Edit Agent"})},this.props.student._id)}),(0,h.jsx)("td",{children:(0,h.jsxs)(u.Z,{to:"/student-database/"+this.props.student._id+"/profile",className:"text-info",style:{textDecoration:"none"},children:[this.props.student.firstname,", ",this.props.student.lastname]})}),(0,h.jsx)("td",{children:this.props.student.email})]}),"Admin"===this.props.role&&(0,h.jsx)(h.Fragment,{children:(0,h.jsx)(c.Z,{student:this.props.student,agent_list:this.props.agent_list,show:this.state.showAgentPage,onHide:this.setAgentModalhide,setmodalhide:this.setAgentModalhide,updateAgentList:this.props.updateAgentList,handleChangeAgentlist:this.props.handleChangeAgentlist,submitUpdateAgentlist:this.submitUpdateAgentlist})})]}):(0,h.jsx)(h.Fragment,{})}}]),n}(o.Component);e.Z=p},89613:function(t,e,n){var s=n(27853),i=n(84531),r=n(78932),a=n(38128),o=n(47313),d=n(67203),l=n(47939),u=n(465),c=n(93298),h=n(46417),p=function(t){(0,r.Z)(n,t);var e=(0,a.Z)(n);function n(){return(0,s.Z)(this,n),e.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){var t=this,e=this.props.agent_list?this.props.agent_list.map((function(e,n){return(0,h.jsxs)("tr",{children:[(0,h.jsx)("td",{children:(0,h.jsx)(d.Z.Group,{children:(0,h.jsx)(d.Z.Check,{custom:!0,type:"checkbox",name:"agent_id",defaultChecked:!!t.props.student.agents&&t.props.student.agents.findIndex((function(t){return t._id===e._id}))>-1,onChange:function(e){return t.props.handleChangeAgentlist(e)},value:e._id,id:"agent"+n+1})})}),(0,h.jsx)("td",{children:(0,h.jsxs)("h5",{className:"my-0",children:[e.lastname," ",e.firstname]})})]},n+1)})):(0,h.jsx)("tr",{children:(0,h.jsx)("h5",{className:"my-1",children:" No Agent"})});return(0,h.jsxs)(l.Z,{show:this.props.show,onHide:this.props.onHide,size:"l","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,h.jsx)(l.Z.Header,{children:(0,h.jsxs)(l.Z.Title,{id:"contained-modal-title-vcenter",children:["Agent for ",this.props.student.firstname," -"," ",this.props.student.lastname," to"]})}),(0,h.jsx)(l.Z.Body,{children:(0,h.jsx)(u.Z,{size:"sm",children:(0,h.jsx)("tbody",{children:e})})}),(0,h.jsxs)(l.Z.Footer,{children:[(0,h.jsx)(c.Z,{onClick:function(e){return t.props.submitUpdateAgentlist(e,t.props.updateAgentList,t.props.student._id)},children:"Update"}),(0,h.jsx)(c.Z,{onClick:this.props.setmodalhide,children:"Cancel"})]})]})}}]),n}(o.Component);e.Z=p},62396:function(t,e,n){n.d(e,{Z:function(){return b}});var s=n(18489),i=n(83738),r=n(36222),a=n(46123),o=n.n(a),d=n(46988),l=n(47313),u=n(22752),c=n(59498);var h,p=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return e.filter((function(t){return null!=t})).reduce((function(t,e){if("function"!==typeof e)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===t?e:function(){for(var n=arguments.length,s=new Array(n),i=0;i<n;i++)s[i]=arguments[i];t.apply(this,s),e.apply(this,s)}}),null)},f=n(6280),g=n(39776),m=n(46417),x=["onEnter","onEntering","onEntered","onExit","onExiting","className","children","dimension","getDimensionValue"],v={height:["marginTop","marginBottom"],width:["marginLeft","marginRight"]};function Z(t,e){var n=e["offset".concat(t[0].toUpperCase()).concat(t.slice(1))],s=v[t];return n+parseInt((0,d.Z)(e,s[0]),10)+parseInt((0,d.Z)(e,s[1]),10)}var A=(h={},(0,r.Z)(h,u.Wj,"collapse"),(0,r.Z)(h,u.Ix,"collapsing"),(0,r.Z)(h,u.d0,"collapsing"),(0,r.Z)(h,u.cn,"collapse show"),h),j={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1,getDimensionValue:Z},_=l.forwardRef((function(t,e){var n=t.onEnter,r=t.onEntering,a=t.onEntered,d=t.onExit,u=t.onExiting,h=t.className,v=t.children,j=t.dimension,_=void 0===j?"height":j,b=t.getDimensionValue,y=void 0===b?Z:b,E=(0,i.Z)(t,x),C="function"===typeof _?_():_,L=(0,l.useMemo)((function(){return p((function(t){t.style[C]="0"}),n)}),[C,n]),w=(0,l.useMemo)((function(){return p((function(t){var e="scroll".concat(C[0].toUpperCase()).concat(C.slice(1));t.style[C]="".concat(t[e],"px")}),r)}),[C,r]),N=(0,l.useMemo)((function(){return p((function(t){t.style[C]=null}),a)}),[C,a]),k=(0,l.useMemo)((function(){return p((function(t){t.style[C]="".concat(y(C,t),"px"),(0,f.Z)(t)}),d)}),[d,y,C]),S=(0,l.useMemo)((function(){return p((function(t){t.style[C]=null}),u)}),[C,u]);return(0,m.jsx)(g.Z,(0,s.Z)((0,s.Z)({ref:e,addEndListener:c.Z},E),{},{"aria-expanded":E.role?E.in:null,onEnter:L,onEntering:w,onEntered:N,onExit:k,onExiting:S,childRef:v.ref,children:function(t,e){return l.cloneElement(v,(0,s.Z)((0,s.Z)({},e),{},{className:o()(h,v.props.className,A[t],"width"===C&&"collapse-horizontal")}))}}))}));_.defaultProps=j;var b=_},41251:function(t,e,n){n.d(e,{Z:function(){return x}});var s=n(18489),i=n(83738),r=n(47313),a=n(75192),o=n.n(a),d=n(73158),l=n(1683),u=n(38388),c=o().oneOf(["start","end"]),h=o().oneOfType([c,o().shape({sm:c}),o().shape({md:c}),o().shape({lg:c}),o().shape({xl:c}),o().shape({xxl:c}),o().object]),p=n(46417),f=["title","children","bsPrefix","rootCloseEvent","variant","size","menuRole","renderMenuOnMount","disabled","href","id","menuVariant","flip"],g={id:o().string,href:o().string,onClick:o().func,title:o().node.isRequired,disabled:o().bool,align:h,menuRole:o().string,renderMenuOnMount:o().bool,rootCloseEvent:o().string,menuVariant:o().oneOf(["dark"]),flip:o().bool,bsPrefix:o().string,variant:o().string,size:o().string},m=r.forwardRef((function(t,e){var n=t.title,r=t.children,a=t.bsPrefix,o=t.rootCloseEvent,c=t.variant,h=t.size,g=t.menuRole,m=t.renderMenuOnMount,x=t.disabled,v=t.href,Z=t.id,A=t.menuVariant,j=t.flip,_=(0,i.Z)(t,f);return(0,p.jsxs)(d.Z,(0,s.Z)((0,s.Z)({ref:e},_),{},{children:[(0,p.jsx)(l.Z,{id:Z,href:v,size:h,variant:c,disabled:x,childBsPrefix:a,children:n}),(0,p.jsx)(u.Z,{role:g,renderOnMount:m,rootCloseEvent:o,variant:A,flip:j,children:r})]}))}));m.displayName="DropdownButton",m.propTypes=g;var x=m},465:function(t,e,n){var s=n(18489),i=n(83738),r=n(46123),a=n.n(r),o=n(47313),d=n(68524),l=n(46417),u=["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"],c=o.forwardRef((function(t,e){var n=t.bsPrefix,r=t.className,o=t.striped,c=t.bordered,h=t.borderless,p=t.hover,f=t.size,g=t.variant,m=t.responsive,x=(0,i.Z)(t,u),v=(0,d.vE)(n,"table"),Z=a()(r,v,g&&"".concat(v,"-").concat(g),f&&"".concat(v,"-").concat(f),o&&"".concat(v,"-").concat("string"===typeof o?"striped-".concat(o):"striped"),c&&"".concat(v,"-bordered"),h&&"".concat(v,"-borderless"),p&&"".concat(v,"-hover")),A=(0,l.jsx)("table",(0,s.Z)((0,s.Z)({},x),{},{className:Z,ref:e}));if(m){var j="".concat(v,"-responsive");return"string"===typeof m&&(j="".concat(j,"-").concat(m)),(0,l.jsx)("div",{className:j,children:A})}return A}));e.Z=c}}]);