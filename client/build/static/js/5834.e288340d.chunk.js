"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[5834],{50099:function(e,t,s){var i=s(35531),n=s(27853),r=s(84531),d=s(78932),a=s(38128),l=s(47313),o=s(73158),c=s(65832),p=s(62396),h=s(29678),u=s.n(h),x=s(54991),m=s(12401),_=s(46417),j=function(e){(0,d.Z)(s,e);var t=(0,a.Z)(s);function s(){var e;(0,n.Z)(this,s);for(var i=arguments.length,r=new Array(i),d=0;d<i;d++)r[d]=arguments[d];return(e=t.call.apply(t,[this].concat(r))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,r.Z)(s,[{key:"render",value:function(){var e,t,s,n,r,d=this,a=[];return this.state.isOption&&(s=(0,_.jsx)("div",{className:"card-header-right",children:(0,_.jsxs)(o.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,_.jsx)(o.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,_.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,_.jsxs)(o.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,_.jsxs)(o.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){d.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,_.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,_.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,_.jsxs)(o.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){d.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,_.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,_.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,_.jsxs)(o.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,_.jsx)("i",{className:"feather icon-refresh-cw"}),(0,_.jsx)("a",{href:m.Z.BLANK_LINK,children:" Reload "})]}),(0,_.jsxs)(o.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,_.jsx)("i",{className:"feather icon-trash"}),(0,_.jsx)("a",{href:m.Z.BLANK_LINK,children:" Remove "})]})]})]})})),n=(0,_.jsxs)(c.Z.Header,{children:[(0,_.jsx)(c.Z.Title,{as:"h5",children:this.props.title}),s]}),this.state.fullCard&&(a=[].concat((0,i.Z)(a),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(a=[].concat((0,i.Z)(a),["card-load"]),t=(0,_.jsx)("div",{className:"card-loader",children:(0,_.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(a=[].concat((0,i.Z)(a),["d-none"])),this.props.cardClass&&(a=[].concat((0,i.Z)(a),[this.props.cardClass])),r=(0,_.jsxs)(c.Z,{className:a.join(" "),style:e,children:[n,(0,_.jsx)(p.Z,{in:!this.state.collapseCard,children:(0,_.jsx)("div",{children:(0,_.jsx)(c.Z.Body,{children:this.props.children})})}),t]}),(0,_.jsx)(x.Z,{children:r})}}]),s}(l.Component);t.Z=u()(j)},85834:function(e,t,s){s.r(t),s.d(t,{default:function(){return I}});var i=s(35531),n=s(18489),r=s(27853),d=s(84531),a=s(78932),l=s(38128),o=s(47313),c=s(44030),p=s(63849),h=s(31616),u=s(65832),x=s(68611),m=s(65487),_=s(465),j=s(41965),f=s(93298),Z=s(54991),g=s(94611),F=s(86450),y=s(3394),v=s(51767),N=s(57864),A=s(37062),b=s(5958),C=s(46417),S=function(e){(0,a.Z)(s,e);var t=(0,l.Z)(s);function s(){var e;(0,r.Z)(this,s);for(var i=arguments.length,n=new Array(i),d=0;d<i;d++)n[d]=arguments[d];return(e=t.call.apply(t,[this].concat(n))).handleAsFinalFileThread=function(t,s,i,n){e.props.handleAsFinalFile(t,s,i,n)},e}return(0,d.Z)(s,[{key:"render",value:function(){var e=this,t=new Date,s=function(e,t){return t.isFinalVersion?(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(y.cfq,{size:24,color:"limegreen",title:"Complete"})}):void 0!==t.latest_message_left_by_id&&""!==t.latest_message_left_by_id||"Student"===e.role?e._id.toString()===t.latest_message_left_by_id?(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(N.znh,{size:24,color:"lightgray",title:"Waiting feedback"})}):(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(b.XYE,{size:24,color:"red",title:"New Message"})}):(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(N.znh,{size:24,color:"lightgray",title:"Waiting feedback"})})},i=C.Fragment,n=(0,C.jsx)(C.Fragment,{}),r=C.Fragment,d=(0,C.jsx)(C.Fragment,{});return i=this.props.student.generaldocs_threads&&this.props.student.generaldocs_threads.map((function(i,n){return(0,C.jsx)("tr",{children:!i.isFinalVersion&&(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("td",{}),(0,C.jsx)("td",{children:(0,C.jsx)(A.Z,{to:"/student-database/"+e.props.student._id+"/CV_ML_RL",style:{textDecoration:"none"},children:(0,C.jsx)("p",{className:"text-light",children:(0,C.jsxs)("b",{children:[e.props.student.firstname," ",e.props.student.lastname]})})})}),("Admin"===e.props.role||"Editor"===e.props.role||"Agent"===e.props.role)&&(i.isFinalVersion?(0,C.jsx)("td",{children:(0,C.jsx)(N.OwP,{size:24,color:"red",title:"Un do Final Version",style:{cursor:"pointer"},onClick:function(){return e.handleAsFinalFileThread(i.doc_thread_id._id,e.props.student._id,null,i.doc_thread_id.file_type)}})}):(0,C.jsx)("td",{children:(0,C.jsx)(N.bzc,{size:24,style:{cursor:"pointer"},title:"Set as final version",onClick:function(){return e.handleAsFinalFileThread(i.doc_thread_id._id,e.props.student._id,null,i.doc_thread_id.file_type)}})})),s(e.props.user,i),(0,C.jsx)("td",{children:(0,C.jsx)(A.Z,{to:"/document-modification/"+i.doc_thread_id._id,style:{textDecoration:"none"},className:"text-info",children:i.doc_thread_id.file_type})}),(0,C.jsx)("td",{children:(0,v.Ny)(i.updatedAt)}),(0,C.jsx)("td",{children:!i.isFinalVersion&&(0,v.Vb)(i.updatedAt,t)}),(0,C.jsx)("td",{}),(0,C.jsx)("td",{})]})},n)})),r=this.props.student.applications&&this.props.student.applications.map((function(i,n){return i.doc_modification_thread.map((function(n,r){return(0,C.jsx)("tr",{children:"O"===i.decided&&!n.isFinalVersion&&"O"!==i.closed&&(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("td",{}),(0,C.jsx)("td",{children:(0,C.jsx)(A.Z,{to:"/student-database/"+e.props.student._id+"/CV_ML_RL",style:{textDecoration:"none"},children:(0,C.jsx)("p",{className:"text-light",children:(0,C.jsxs)("b",{children:[e.props.student.firstname," ",e.props.student.lastname]})})})}),("Admin"===e.props.role||"Editor"===e.props.role||"Agent"===e.props.role)&&(n.isFinalVersion?(0,C.jsx)("td",{children:(0,C.jsx)(N.OwP,{size:24,color:"red",title:"Un do Final Version",style:{cursor:"pointer"},onClick:function(){return e.handleAsFinalFileThread(n.doc_thread_id._id,e.props.student._id,i.programId._id,n.doc_thread_id.file_type)}})}):(0,C.jsx)("td",{children:(0,C.jsx)(N.bzc,{size:24,style:{cursor:"pointer"},title:"Set as final version",onClick:function(){return e.handleAsFinalFileThread(n.doc_thread_id._id,e.props.student._id,i.programId._id,n.doc_thread_id.file_type)}})})),s(e.props.user,n),(0,C.jsx)("td",{children:(0,C.jsxs)(A.Z,{to:"/document-modification/"+n.doc_thread_id._id,style:{textDecoration:"none"},className:"text-info",children:[n.doc_thread_id.file_type," - ",i.programId.school," - ",i.programId.program_name]})}),(0,C.jsx)("td",{children:(0,v.Ny)(n.updatedAt)}),(0,C.jsx)("td",{children:!n.isFinalVersion&&(0,v.Vb)(n.updatedAt,t)}),(0,C.jsxs)("td",{children:[e.props.student.application_preference&&e.props.student.application_preference.expected_application_date&&e.props.student.application_preference.expected_application_date+"-",i.programId.application_deadline]}),(0,C.jsx)("td",{children:"O"===i.closed?"-":i.programId.application_deadline?e.props.student.application_preference&&e.props.student.application_preference.expected_application_date&&(0,v.Vb)(t,e.props.student.application_preference.expected_application_date+"-"+i.programId.application_deadline):"-"})]})},r)}))})),(0,C.jsxs)(C.Fragment,{children:[n,d,i,r]})}}]),s}(o.Component),w=S,k=function(e){(0,a.Z)(s,e);var t=(0,l.Z)(s);function s(){var e;(0,r.Z)(this,s);for(var i=arguments.length,n=new Array(i),d=0;d<i;d++)n[d]=arguments[d];return(e=t.call.apply(t,[this].concat(n))).handleAsFinalFileThread=function(t,s,i,n){e.props.handleAsFinalFile(t,s,i,n)},e}return(0,d.Z)(s,[{key:"render",value:function(){var e=this,t=(new Date,function(e,t){return t.isFinalVersion?(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(y.cfq,{size:24,color:"limegreen",title:"Complete"})}):void 0!==t.latest_message_left_by_id&&""!==t.latest_message_left_by_id||"Student"===e.role?e._id.toString()===t.latest_message_left_by_id?(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(N.znh,{size:24,color:"lightgray",title:"Waiting feedback"})}):(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(b.XYE,{size:24,color:"red",title:"New Message"})}):(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(N.znh,{size:24,color:"lightgray",title:"Waiting feedback"})})}),s=C.Fragment,i=(0,C.jsx)(C.Fragment,{}),n=C.Fragment,r=(0,C.jsx)(C.Fragment,{});return s=this.props.student.generaldocs_threads&&this.props.student.generaldocs_threads.map((function(s,i){return(0,C.jsx)("tr",{children:s.isFinalVersion&&(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("td",{}),(0,C.jsx)("td",{children:(0,C.jsx)(A.Z,{to:"/student-database/"+e.props.student._id+"/CV_ML_RL",style:{textDecoration:"none"},children:(0,C.jsx)("p",{className:"text-light",children:(0,C.jsxs)("b",{children:[e.props.student.firstname," ",e.props.student.lastname]})})})}),("Admin"===e.props.role||"Editor"===e.props.role||"Agent"===e.props.role)&&(s.isFinalVersion?(0,C.jsx)("td",{children:(0,C.jsx)(N.OwP,{size:24,color:"red",title:"Un do Final Version",style:{cursor:"pointer"},onClick:function(){return e.handleAsFinalFileThread(s.doc_thread_id._id,e.props.student._id,null,s.doc_thread_id.file_type)}})}):(0,C.jsx)("td",{children:(0,C.jsx)(N.bzc,{size:24,style:{cursor:"pointer"},title:"Set as final version",onClick:function(){return e.handleAsFinalFileThread(s.doc_thread_id._id,e.props.student._id,null,s.doc_thread_id.file_type)}})})),t(e.props.user,s),(0,C.jsx)("td",{children:(0,C.jsx)(A.Z,{to:"/document-modification/"+s.doc_thread_id._id,style:{textDecoration:"none"},className:"text-info",children:s.doc_thread_id.file_type})}),(0,C.jsx)("td",{children:(0,v.Ny)(s.updatedAt)}),(0,C.jsx)("td",{}),(0,C.jsx)("td",{children:"-"})]})},i)})),n=this.props.student.applications&&this.props.student.applications.map((function(s,i){return s.doc_modification_thread.map((function(i,n){return(0,C.jsx)("tr",{children:("O"===s.decided&&i.isFinalVersion||"O"===s.closed)&&(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("td",{}),(0,C.jsx)("td",{children:(0,C.jsx)(A.Z,{to:"/student-database/"+e.props.student._id+"/CV_ML_RL",style:{textDecoration:"none"},children:(0,C.jsx)("p",{className:"text-light",children:(0,C.jsxs)("b",{children:[e.props.student.firstname," ",e.props.student.lastname]})})})}),("Admin"===e.props.role||"Editor"===e.props.role||"Agent"===e.props.role)&&(i.isFinalVersion?(0,C.jsx)("td",{children:(0,C.jsx)(N.OwP,{size:24,color:"red",title:"Un do Final Version",style:{cursor:"pointer"},onClick:function(){return e.handleAsFinalFileThread(i.doc_thread_id._id,e.props.student._id,s.programId._id,i.doc_thread_id.file_type)}})}):(0,C.jsx)("td",{children:(0,C.jsx)(N.bzc,{size:24,style:{cursor:"pointer"},title:"Set as final version",onClick:function(){return e.handleAsFinalFileThread(i.doc_thread_id._id,e.props.student._id,s.programId._id,i.doc_thread_id.file_type)}})})),t(e.props.user,i),(0,C.jsx)("td",{children:(0,C.jsxs)(A.Z,{to:"/document-modification/"+i.doc_thread_id._id,style:{textDecoration:"none"},className:"text-info",children:[i.doc_thread_id.file_type," - ",s.programId.school," - ",s.programId.program_name]})}),(0,C.jsx)("td",{children:(0,v.Ny)(i.updatedAt)}),(0,C.jsxs)("td",{children:[e.props.student.application_preference&&e.props.student.application_preference.expected_application_date&&e.props.student.application_preference.expected_application_date+"-",s.programId.application_deadline]}),(0,C.jsx)("td",{children:"O"===s.closed?"CLOSE":"OPEN"})]})},n)}))})),(0,C.jsxs)(C.Fragment,{children:[i,r,s,n]})}}]),s}(o.Component),z=k,L=s(51426),V=function(e){(0,a.Z)(s,e);var t=(0,l.Z)(s);function s(){var e;(0,r.Z)(this,s);for(var d=arguments.length,a=new Array(d),l=0;l<d;l++)a[l]=arguments[l];return(e=t.call.apply(t,[this].concat(a))).state={error:null,timeouterror:null,unauthorizederror:null,isLoaded:!1,data:null,success:!1,students:null,doc_thread_id:"",student_id:"",program_id:"",SetAsFinalFileModel:!1,status:""},e.closeSetAsFinalFileModelWindow=function(){e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{SetAsFinalFileModel:!1})}))},e.ConfirmSetAsFinalFileHandler=function(){e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{isLoaded:!1})})),(0,L.lk)(e.state.doc_thread_id,e.state.student_id,e.state.program_id).then((function(t){var s=t.data,r=s.data,d=s.success,a=(0,i.Z)(e.state.students),l=e.state.students.findIndex((function(e){return e._id.toString()===r._id.toString()}));a[l]=r,d?e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{docName:"",isLoaded:!0,students:a,success:d,SetAsFinalFileModel:!1})})):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({error:t})}))},e.handleAsFinalFile=function(t,s,i,r){e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{doc_thread_id:t,student_id:s,program_id:i,docName:r,SetAsFinalFileModel:!0})}))},e}return(0,d.Z)(s,[{key:"componentDidMount",value:function(){var e=this;(0,L.sK)().then((function(t){var s=t.data,i=s.data,n=s.success;n?e.setState({isLoaded:!0,students:i,success:n}):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})}))}},{key:"render",value:function(){var e=this,t=this.state,s=t.unauthorizederror,i=t.timeouterror,n=t.isLoaded;if(i)return(0,C.jsx)("div",{children:(0,C.jsx)(g.Z,{})});if(s)return(0,C.jsx)("div",{children:(0,C.jsx)(F.Z,{})});var r={position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"};if(!n&&!this.state.students)return(0,C.jsx)("div",{style:r,children:(0,C.jsx)(c.Z,{animation:"border",role:"status",children:(0,C.jsx)("span",{className:"visually-hidden"})})});var d=this.state.students.map((function(t,s){return(0,C.jsx)(w,{role:e.props.user.role,user:e.props.user,student:t,isDashboard:!0,handleAsFinalFile:e.handleAsFinalFile},s)})),a=this.state.students.map((function(t,s){return(0,C.jsx)(z,{role:e.props.user.role,user:e.props.user,student:t,isDashboard:!0,handleAsFinalFile:e.handleAsFinalFile},s)}));return(0,C.jsxs)(Z.Z,{children:[(0,C.jsx)(p.Z,{className:"sticky-top",children:(0,C.jsx)(h.Z,{children:(0,C.jsx)(u.Z,{className:"mb-2 mx-0",bg:"dark",text:"light",children:(0,C.jsx)(u.Z.Header,{children:(0,C.jsx)(u.Z.Title,{className:"my-0 mx-0 text-light",children:"CV ML RL Overview"})})})})}),(0,C.jsx)(p.Z,{children:(0,C.jsx)(h.Z,{children:(0,C.jsxs)(x.Z,{defaultActiveKey:"open",fill:!0,justify:!0,children:[(0,C.jsx)(m.Z,{eventKey:"open",title:"Open",children:(0,C.jsxs)(_.Z,{responsive:!0,bordered:!0,hover:!0,className:"my-0 mx-0",variant:"dark",text:"light",size:"sm",children:[(0,C.jsx)("thead",{children:(0,C.jsxs)("tr",{children:[(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("th",{}),(0,C.jsx)("th",{children:"First-, Last Name"}),("Admin"===this.props.user.role||"Editor"===this.props.user.role||"Agent"===this.props.user.role)&&(0,C.jsx)("th",{children:"Action"})]}),window.cvmlrllist.map((function(e,t){return(0,C.jsx)("th",{children:e.name},t)}))]})}),(0,C.jsx)("tbody",{children:d})]})}),(0,C.jsx)(m.Z,{eventKey:"closed",title:"Closed",children:(0,C.jsxs)(_.Z,{responsive:!0,bordered:!0,hover:!0,className:"my-0 mx-0",variant:"dark",text:"light",size:"sm",children:[(0,C.jsx)("thead",{children:(0,C.jsxs)("tr",{children:[(0,C.jsx)("th",{}),(0,C.jsx)("th",{children:"First-, Last Name"}),("Admin"===this.props.user.role||"Editor"===this.props.user.role||"Agent"===this.props.user.role)&&(0,C.jsx)("th",{children:"Action"}),window.cvmlrlclosedlist.map((function(e,t){return(0,C.jsx)("th",{children:e.name},t)}))]})}),(0,C.jsx)("tbody",{children:a})]})})]})})}),(0,C.jsxs)(j.Z,{show:this.state.SetAsFinalFileModel,onHide:this.closeSetAsFinalFileModelWindow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,C.jsx)(j.Z.Header,{children:(0,C.jsx)(j.Z.Title,{id:"contained-modal-title-vcenter",children:"Warning"})}),(0,C.jsxs)(j.Z.Body,{children:["Do you want to set ",this.state.docName," as final for student?"]}),(0,C.jsxs)(j.Z.Footer,{children:[(0,C.jsx)(f.Z,{disabled:!n,onClick:this.ConfirmSetAsFinalFileHandler,children:"Yes"}),(0,C.jsx)(f.Z,{onClick:this.closeSetAsFinalFileModelWindow,children:"No"}),!n&&(0,C.jsx)("div",{style:r,children:(0,C.jsx)(c.Z,{animation:"border",role:"status",children:(0,C.jsx)("span",{className:"visually-hidden"})})})]})]})]})}}]),s}(o.Component),I=V},94611:function(e,t,s){var i=s(27853),n=s(84531),r=s(78932),d=s(38128),a=s(47313),l=s(63849),o=s(31616),c=s(50099),p=s(54991),h=s(46417),u=function(e){(0,r.Z)(s,e);var t=(0,d.Z)(s);function s(){return(0,i.Z)(this,s),t.apply(this,arguments)}return(0,n.Z)(s,[{key:"render",value:function(){return(0,h.jsx)(p.Z,{children:(0,h.jsx)(l.Z,{children:(0,h.jsx)(o.Z,{children:(0,h.jsx)(c.Z,{children:"Time out error. Please login again!"})})})})}}]),s}(a.Component);t.Z=u},86450:function(e,t,s){var i=s(27853),n=s(84531),r=s(78932),d=s(38128),a=s(47313),l=s(63849),o=s(31616),c=s(50099),p=s(54991),h=s(46417),u=function(e){(0,r.Z)(s,e);var t=(0,d.Z)(s);function s(){return(0,i.Z)(this,s),t.apply(this,arguments)}return(0,n.Z)(s,[{key:"render",value:function(){return(0,h.jsx)(p.Z,{children:(0,h.jsx)(l.Z,{children:(0,h.jsx)(o.Z,{children:(0,h.jsx)(c.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),s}(a.Component);t.Z=u}}]);