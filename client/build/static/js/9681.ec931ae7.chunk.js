"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[9681],{99681:function(t,e,s){s.r(e);var r=s(27853),a=s(84531),n=s(78932),u=s(66621),i=s(47313),o=s(44030),d=s(30626),l=s(94611),c=s(86450),h=s(51426),f=s(46417),p=function(t){(0,n.Z)(s,t);var e=(0,u.Z)(s);function s(){var t;(0,r.Z)(this,s);for(var a=arguments.length,n=new Array(a),u=0;u<a;u++)n[u]=arguments[u];return(t=e.call.apply(e,[this].concat(n))).state={timeouterror:null,unauthorizederror:null,isLoaded:!1,student:null,success:!1,error:null},t}return(0,a.Z)(s,[{key:"componentDidMount",value:function(){var t=this;(0,h.u6)(this.props.match.params.student_id).then((function(e){var s=e.data,r=s.data,a=s.success;a?t.setState({isLoaded:!0,student:r,success:a}):401===e.status||500===e.status?t.setState({isLoaded:!0,timeouterror:!0}):403===e.status&&t.setState({isLoaded:!0,unauthorizederror:!0})}),(function(e){t.setState({isLoaded:!0,error:!0})}))}},{key:"render",value:function(){var t=this.state,e=t.unauthorizederror,s=t.timeouterror,r=t.isLoaded;if(s)return(0,f.jsx)("div",{children:(0,f.jsx)(l.Z,{})});if(e)return(0,f.jsx)("div",{children:(0,f.jsx)(c.Z,{})});return r||this.state.student?(0,f.jsx)(d.Z,{isLoaded:r,role:this.props.user.role,student:this.state.student}):(0,f.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,f.jsx)(o.Z,{animation:"border",role:"status",children:(0,f.jsx)("span",{className:"visually-hidden"})})})}}]),s}(i.Component);e.default=p}}]);