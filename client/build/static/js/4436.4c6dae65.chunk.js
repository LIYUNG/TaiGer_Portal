"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[4436],{54436:function(e,s,a){a.r(s),a.d(s,{default:function(){return f}});var t=a(33032),r=a(18489),n=a(23430),c=a(78994),i=a.n(c),l=(a(29234),a(54991)),u=a(47313),o=a(33219),d=a(51426),m=a(18329),p=a(19514),x=a(46417);function h(e){var s=u.useState(!1),a=(0,n.Z)(s,2),r=a[0],c=a[1],o=function(){var s=(0,t.Z)(i().mark((function s(a){var t;return i().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:return a.preventDefault(),c(!0),s.prev=2,s.next=5,(0,d.yf)({email:e.email});case 5:t=s.sent,t.data.success?c(!0):alert(t.data.message),s.next=12;break;case 10:s.prev=10,s.t0=s.catch(2);case 12:case"end":return s.stop()}}),s,null,[[2,10]])})));return function(e){return s.apply(this,arguments)}}();return r?(0,x.jsxs)(l.Z,{children:[(0,x.jsx)(m.Z,{}),(0,x.jsx)("div",{className:"auth-wrapper",children:(0,x.jsx)("div",{className:"auth-content",children:(0,x.jsx)("form",{children:(0,x.jsxs)("div",{className:"card-body text-center",children:[(0,x.jsx)("img",{className:"img-radius",src:p,alt:"Generic placeholder"}),(0,x.jsx)("p",{className:"mb-4"}),(0,x.jsx)("p",{className:"mb-2",children:"Confirmation Email sent"}),(0,x.jsx)("div",{className:"input-group mb-2",children:(0,x.jsx)("p",{className:"mb-0 text-success",children:"The new activation link is sent to the following address:"})}),(0,x.jsx)("p",{className:"mb-4 text-muted",children:e.email})]})})})})]}):(0,x.jsxs)(l.Z,{children:[(0,x.jsx)(m.Z,{}),(0,x.jsx)("div",{className:"auth-wrapper",children:(0,x.jsx)("div",{className:"auth-content",children:(0,x.jsx)("form",{onSubmit:o,children:(0,x.jsxs)("div",{className:"card-body text-center",children:[(0,x.jsx)("img",{className:"img-radius",src:p,alt:"Generic placeholder"}),(0,x.jsx)("p",{className:"mb-4"}),(0,x.jsx)("p",{className:"mb-4",children:"Account is not activated"}),(0,x.jsx)("div",{className:"input-group mb-4",children:(0,x.jsx)("p",{className:"mb-0 text-success",children:'Please click "Resend" to receive the new activation link in your email.'})}),(0,x.jsx)("button",{className:"btn btn-primary shadow-2 mb-4",onClick:function(e){return o(e)},children:"Resend"})]})})})})]})}function f(e){var s=e.setUserdata,a=(0,u.useState)(),c=(0,n.Z)(a,2),m=c[0],f=c[1],j=(0,u.useState)(),v=(0,n.Z)(j,2),b=v[0],N=v[1],w=(0,u.useState)(!0),g=(0,n.Z)(w,2),Z=g[0],k=g[1],y=(0,u.useState)(!1),S=(0,n.Z)(y,2),_=(S[0],S[1]),C=(0,u.useState)(!1),E=(0,n.Z)(C,2),G=E[0],P=E[1];(0,u.useEffect)((function(){}),[]);var D=function(e){try{e?400===e.status||401===e.status||500===e.status?k(!1):403===e.status?P(!0):s((function(s){return(0,r.Z)((0,r.Z)({},s),{},{success:e.data.success,data:e.data.data,isloaded:!0})})):(alert("Email or password not correct."),k(!1))}catch(a){}},R=function(){var e=(0,t.Z)(i().mark((function e(s){var a;return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:if(s.preventDefault(),!m||!1===/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(m)){e.next=18;break}if(b){e.next=6;break}alert("Password please!"),e.next=16;break;case 6:return e.prev=6,e.next=9,(0,d.x4)({email:m,password:b});case 9:a=e.sent,D(a),e.next=16;break;case 13:e.prev=13,e.t0=e.catch(6),alert("Server no response! Please try later.");case 16:e.next=19;break;case 18:alert("Email is not valid");case 19:case"end":return e.stop()}}),e,null,[[6,13]])})));return function(s){return e.apply(this,arguments)}}(),F=function(){var e=(0,t.Z)(i().mark((function e(s,a){return i().wrap((function(e){for(;;)switch(e.prev=e.next){case 0:s.preventDefault(),_(a),R(s);case 3:case"end":return e.stop()}}),e)})));return function(s,a){return e.apply(this,arguments)}}();return G?(0,x.jsx)(l.Z,{children:(0,x.jsx)(h,{email:m})}):(0,x.jsx)(l.Z,{children:(0,x.jsx)("div",{className:"auth-wrapper",children:(0,x.jsx)("div",{className:"auth-content",children:(0,x.jsx)("form",{children:(0,x.jsxs)("div",{className:"card-body text-center",children:[(0,x.jsx)("img",{className:"img-radius",src:p,alt:"Generic placeholder"}),(0,x.jsx)("p",{className:"mb-4"}),(0,x.jsx)("div",{className:"input-group mb-3",children:(0,x.jsx)("input",{type:"email",autoFocus:!0,className:"form-control",placeholder:"Email",onChange:function(e){return f(e.target.value)}})}),(0,x.jsx)("div",{className:"input-group mb-3",children:(0,x.jsx)("input",{type:"password",className:"form-control",placeholder:"password",onChange:function(e){return N(e.target.value)}})}),!Z&&(0,x.jsx)("p",{className:"mb-2 text-danger",children:"Email or password is not correct."}),(0,x.jsx)("button",{disabled:!m||!b,onClick:function(e){return F(e,!0)},type:"submit",className:"btn btn-success shadow-2 mb-2",children:"Login"}),(0,x.jsx)("p",{className:"mb-2 text-light",children:"Forgot password?"}),(0,x.jsx)(o.Z,{to:"/forgot-password",children:(0,x.jsx)("p",{className:"text-muted",children:"Reset"})}),(0,x.jsx)("p",{className:"mb-2 text-light",children:"New in TaiGer Portal?"}),(0,x.jsx)(o.Z,{to:"/sign-up",children:(0,x.jsx)("p",{className:"text-muted",children:"Sign up"})})]})})})})})}}}]);