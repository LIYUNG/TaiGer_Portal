"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[5266],{55266:function(e,a,n){n.r(a);var t=n(27853),r=n(84531),s=n(78932),o=n(38128),d=n(47313),c=n(44030),i=n(65832),l=n(54991),u=n(93105),f=n(51426),v=n(46417),m=function(e,a){console.log("drag started"),console.log("cardId: ".concat(e)),console.log("laneId: ".concat(a))},h=function(e,a,n){console.log("drag ended"),console.log("cardId: ".concat(e)),console.log("sourceLaneId: ".concat(a)),console.log("targetLaneId: ".concat(n))},g=function(e){console.log(e)},p=function(e,a){console.log(e),console.log(a)},b=function(e){(0,s.Z)(n,e);var a=(0,o.Z)(n);function n(){var e;(0,t.Z)(this,n);for(var r=arguments.length,s=new Array(r),o=0;o<r;o++)s[o]=arguments[o];return(e=a.call.apply(a,[this].concat(s))).state={error:null,isLoaded:!1,tasks:null,success:null},e.completeCard=function(){e.state.eventBus.publish({type:"ADD_CARD",laneId:"COMPLETED",card:{id:"Milk",title:"Buy Milk",label:"15 mins",description:"Use Headspace app"}}),e.state.eventBus.publish({type:"REMOVE_CARD",laneId:"PLANNED",cardId:"Milk"})},e.addCard=function(){e.state.eventBus.publish({type:"ADD_CARD",laneId:"BLOCKED",card:{id:"Ec2Error",title:"EC2 Instance Down",label:"30 mins",description:"Main EC2 instance down"}})},e.setEventBus=function(a){e.setState({eventBus:a})},e.handleCardAdd=function(e,a){console.log("New card added to lane ".concat(a)),console.dir(e)},e.shouldReceiveNewData=function(e){console.log("New card has been added"),console.log(e)},e}return(0,r.Z)(n,[{key:"componentDidMount",value:function(){var e=this;(0,f.pM)().then((function(a){var n=a.data,t=n.success,r=n.data;t?e.setState({success:t,tasks:r,isLoaded:!0}):alert(a.data.message)}),(function(a){e.setState({isLoaded:!1,error:a})}))}},{key:"render",value:function(){var e=this,a=this.state,n=a.error,t=a.isLoaded;if(n)return(0,v.jsx)("div",{children:"Error: your session is timeout! Please refresh the page and Login"});if(!t&&!this.state.tasks)return(0,v.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,v.jsx)(c.Z,{animation:"border",role:"status",children:(0,v.jsx)("span",{className:"visually-hidden"})})});var r=this.state.tasks.map((function(a,n){return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)(i.Z.Body,{children:[a.student_id.firstname," ",a.student_id.lastname]},n),(0,v.jsx)(u.ZP,{data:a,style:{backgroundColor:"transparent"},cardDraggable:!0,onDataChange:g,onCardAdd:e.handleCardAdd,eventBusHandle:e.setEventBus,handleDragStart:m,handleDragEnd:h,onCardClick:p})]})}));return(0,v.jsx)(l.Z,{children:r})}}]),n}(d.Component);a.default=b},65832:function(e,a,n){n.d(a,{Z:function(){return _}});var t=n(18489),r=n(83738),s=n(46123),o=n.n(s),d=n(47313),c=n(68524),i=n(28864),l=n(96205),u=n(46417),f=["bsPrefix","className","variant","as"],v=d.forwardRef((function(e,a){var n=e.bsPrefix,s=e.className,d=e.variant,i=e.as,l=void 0===i?"img":i,v=(0,r.Z)(e,f),m=(0,c.vE)(n,"card-img");return(0,u.jsx)(l,(0,t.Z)({ref:a,className:o()(d?"".concat(m,"-").concat(d):m,s)},v))}));v.displayName="CardImg";var m=v,h=n(15614),g=["bsPrefix","className","as"],p=d.forwardRef((function(e,a){var n=e.bsPrefix,s=e.className,i=e.as,l=void 0===i?"div":i,f=(0,r.Z)(e,g),v=(0,c.vE)(n,"card-header"),m=(0,d.useMemo)((function(){return{cardHeaderBsPrefix:v}}),[v]);return(0,u.jsx)(h.Z.Provider,{value:m,children:(0,u.jsx)(l,(0,t.Z)((0,t.Z)({ref:a},f),{},{className:o()(s,v)}))})}));p.displayName="CardHeader";var b=p,Z=["bsPrefix","className","bg","text","border","body","children","as"],x=(0,l.Z)("h5"),C=(0,l.Z)("h6"),y=(0,i.Z)("card-body"),N=(0,i.Z)("card-title",{Component:x}),k=(0,i.Z)("card-subtitle",{Component:C}),D=(0,i.Z)("card-link",{Component:"a"}),E=(0,i.Z)("card-text",{Component:"p"}),j=(0,i.Z)("card-footer"),I=(0,i.Z)("card-img-overlay"),P=d.forwardRef((function(e,a){var n=e.bsPrefix,s=e.className,d=e.bg,i=e.text,l=e.border,f=e.body,v=e.children,m=e.as,h=void 0===m?"div":m,g=(0,r.Z)(e,Z),p=(0,c.vE)(n,"card");return(0,u.jsx)(h,(0,t.Z)((0,t.Z)({ref:a},g),{},{className:o()(s,p,d&&"bg-".concat(d),i&&"text-".concat(i),l&&"border-".concat(l)),children:f?(0,u.jsx)(y,{children:v}):v}))}));P.displayName="Card",P.defaultProps={body:!1};var _=Object.assign(P,{Img:m,Title:N,Subtitle:k,Body:y,Link:D,Text:E,Header:b,Footer:j,ImgOverlay:I})},15614:function(e,a,n){var t=n(47313).createContext(null);t.displayName="CardHeaderContext",a.Z=t},96205:function(e,a,n){var t=n(18489),r=n(47313),s=n(46123),o=n.n(s),d=n(46417);a.Z=function(e){return r.forwardRef((function(a,n){return(0,d.jsx)("div",(0,t.Z)((0,t.Z)({},a),{},{ref:n,className:o()(a.className,e)}))}))}}}]);