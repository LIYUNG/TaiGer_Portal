"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[9656],{50099:function(e,t,n){var s=n(35531),i=n(27853),r=n(84531),a=n(78932),d=n(66621),o=n(47313),l=n(58050),c=n(72880),u=n(88815),h=n(29678),p=n.n(h),x=n(54991),m=n(12401),f=n(46417),j=function(e){(0,a.Z)(n,e);var t=(0,d.Z)(n);function n(){var e;(0,i.Z)(this,n);for(var s=arguments.length,r=new Array(s),a=0;a<s;a++)r[a]=arguments[a];return(e=t.call.apply(t,[this].concat(r))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,r.Z)(n,[{key:"render",value:function(){var e,t,n,i,r,a=this,d=[];return this.state.isOption&&(n=(0,f.jsx)("div",{className:"card-header-right",children:(0,f.jsxs)(l.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,f.jsx)(l.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,f.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,f.jsxs)(l.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,f.jsxs)(l.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){a.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,f.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,f.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,f.jsxs)(l.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){a.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,f.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,f.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,f.jsxs)(l.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,f.jsx)("i",{className:"feather icon-refresh-cw"}),(0,f.jsx)("a",{href:m.Z.BLANK_LINK,children:" Reload "})]}),(0,f.jsxs)(l.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,f.jsx)("i",{className:"feather icon-trash"}),(0,f.jsx)("a",{href:m.Z.BLANK_LINK,children:" Remove "})]})]})]})})),i=(0,f.jsxs)(c.Z.Header,{children:[(0,f.jsx)(c.Z.Title,{as:"h5",children:this.props.title}),n]}),this.state.fullCard&&(d=[].concat((0,s.Z)(d),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(d=[].concat((0,s.Z)(d),["card-load"]),t=(0,f.jsx)("div",{className:"card-loader",children:(0,f.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(d=[].concat((0,s.Z)(d),["d-none"])),this.props.cardClass&&(d=[].concat((0,s.Z)(d),[this.props.cardClass])),r=(0,f.jsxs)(c.Z,{className:d.join(" "),style:e,children:[i,(0,f.jsx)(u.Z,{in:!this.state.collapseCard,children:(0,f.jsx)("div",{children:(0,f.jsx)(c.Z.Body,{children:this.props.children})})}),t]}),(0,f.jsx)(x.Z,{children:r})}}]),n}(o.Component);t.Z=p()(j)},29656:function(e,t,n){n.r(t),n.d(t,{default:function(){return L}});var s=n(35531),i=n(18489),r=n(27853),a=n(84531),d=n(78932),o=n(66621),l=n(47313),c=n(44030),u=n(63849),h=n(31616),p=n(72880),x=n(465),m=n(64212),f=n(93298),j=n(54991),_=n(94611),Z=n(86450),g=n(3394),v=n(51767),F=n(57864),y=n(37062),N=n(5958),C=n(46417),b=function(e){(0,d.Z)(n,e);var t=(0,o.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var s=arguments.length,i=new Array(s),a=0;a<s;a++)i[a]=arguments[a];return(e=t.call.apply(t,[this].concat(i))).handleAsFinalFileThread=function(t,n,s,i){e.props.handleAsFinalFile(t,n,s,i)},e}return(0,a.Z)(n,[{key:"render",value:function(){var e=this,t=new Date,n=function(e,t){return t.isFinalVersion?(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(g.cfq,{size:24,color:"limegreen",title:"Complete"})}):void 0!==t.latest_message_left_by_id&&""!==t.latest_message_left_by_id||"Student"===e.role?e._id.toString()===t.latest_message_left_by_id?(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(F.znh,{size:24,color:"lightgray",title:"Waiting feedback"})}):(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(N.XYE,{size:24,color:"red",title:"New Message"})}):(0,C.jsx)("td",{className:"mb-1 text-info",children:(0,C.jsx)(F.znh,{size:24,color:"lightgray",title:"Waiting feedback"})})},s=C.Fragment,i=(0,C.jsx)(C.Fragment,{}),r=C.Fragment,a=(0,C.jsx)(C.Fragment,{});return s=this.props.student.generaldocs_threads&&this.props.student.generaldocs_threads.map((function(s,i){return(0,C.jsxs)("tr",{children:[(0,C.jsx)("td",{}),(0,C.jsx)("td",{children:(0,C.jsx)(y.Z,{to:"/student-database/"+e.props.student._id+"/CV_ML_RL",style:{textDecoration:"none"},children:(0,C.jsx)("p",{className:"text-light",children:(0,C.jsxs)("b",{children:[e.props.student.firstname," ",e.props.student.lastname]})})})}),("Admin"===e.props.role||"Editor"===e.props.role||"Agent"===e.props.role)&&(s.isFinalVersion?(0,C.jsx)("td",{children:(0,C.jsx)(F.OwP,{size:24,color:"red",title:"Un do Final Version",style:{cursor:"pointer"},onClick:function(){return e.handleAsFinalFileThread(s.doc_thread_id._id,e.props.student._id,null,s.doc_thread_id.file_type)}})}):(0,C.jsx)("td",{children:(0,C.jsx)(F.bzc,{size:24,style:{cursor:"pointer"},title:"Set as final version",onClick:function(){return e.handleAsFinalFileThread(s.doc_thread_id._id,e.props.student._id,null,s.doc_thread_id.file_type)}})})),n(e.props.user,s),(0,C.jsx)("td",{children:(0,C.jsx)(y.Z,{to:"/document-modification/"+s.doc_thread_id._id,style:{textDecoration:"none"},className:"text-info",children:s.doc_thread_id.file_type})}),(0,C.jsx)("td",{children:(0,v.Ny)(s.updatedAt)}),(0,C.jsx)("td",{children:!s.isFinalVersion&&(0,v.Vb)(s.updatedAt,t)}),(0,C.jsx)("td",{}),(0,C.jsx)("td",{})]},i)})),r=this.props.student.applications&&this.props.student.applications.map((function(s,i){return s.doc_modification_thread.map((function(i,r){return(0,C.jsx)("tr",{children:"O"===s.decided&&(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("td",{}),(0,C.jsx)("td",{children:(0,C.jsx)(y.Z,{to:"/student-database/"+e.props.student._id+"/CV_ML_RL",style:{textDecoration:"none"},children:(0,C.jsx)("p",{className:"text-light",children:(0,C.jsxs)("b",{children:[e.props.student.firstname," ",e.props.student.lastname]})})})}),("Admin"===e.props.role||"Editor"===e.props.role||"Agent"===e.props.role)&&(i.isFinalVersion?(0,C.jsx)("td",{children:(0,C.jsx)(F.OwP,{size:24,color:"red",title:"Un do Final Version",style:{cursor:"pointer"},onClick:function(){return e.handleAsFinalFileThread(i.doc_thread_id._id,e.props.student._id,s.programId._id,i.doc_thread_id.file_type)}})}):(0,C.jsx)("td",{children:(0,C.jsx)(F.bzc,{size:24,style:{cursor:"pointer"},title:"Set as final version",onClick:function(){return e.handleAsFinalFileThread(i.doc_thread_id._id,e.props.student._id,s.programId._id,i.doc_thread_id.file_type)}})})),n(e.props.user,i),(0,C.jsx)("td",{children:(0,C.jsxs)(y.Z,{to:"/document-modification/"+i.doc_thread_id._id,style:{textDecoration:"none"},className:"text-info",children:[i.doc_thread_id.file_type," - ",s.programId.school," - ",s.programId.program_name]})}),(0,C.jsx)("td",{children:(0,v.Ny)(i.updatedAt)}),(0,C.jsx)("td",{children:!i.isFinalVersion&&(0,v.Vb)(i.updatedAt,t)}),(0,C.jsxs)("td",{children:[e.props.student.application_preference&&e.props.student.application_preference.expected_application_date&&e.props.student.application_preference.expected_application_date+"-",s.programId.application_deadline]}),(0,C.jsx)("td",{children:"O"===s.closed?"-":s.programId.application_deadline?e.props.student.application_preference&&e.props.student.application_preference.expected_application_date&&(0,v.Vb)(t,e.props.student.application_preference.expected_application_date+"-"+s.programId.application_deadline):"-"})]})},r)}))})),(0,C.jsxs)(C.Fragment,{children:[i,a,s,r]})}}]),n}(l.Component),A=b,S=n(51426),w=function(e){(0,d.Z)(n,e);var t=(0,o.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var a=arguments.length,d=new Array(a),o=0;o<a;o++)d[o]=arguments[o];return(e=t.call.apply(t,[this].concat(d))).state={error:null,timeouterror:null,unauthorizederror:null,isLoaded:!1,data:null,success:!1,students:null,doc_thread_id:"",student_id:"",program_id:"",SetAsFinalFileModel:!1,status:""},e.closeSetAsFinalFileModelWindow=function(){e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{SetAsFinalFileModel:!1})}))},e.ConfirmSetAsFinalFileHandler=function(){e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{isLoaded:!1})})),(0,S.lk)(e.state.doc_thread_id,e.state.student_id,e.state.program_id).then((function(t){var n=t.data,r=n.data,a=n.success,d=(0,s.Z)(e.state.students),o=e.state.students.findIndex((function(e){return e._id.toString()===r._id.toString()}));d[o]=r,a?e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{docName:"",isLoaded:!0,students:d,success:a,SetAsFinalFileModel:!1})})):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({error:t})}))},e.handleAsFinalFile=function(t,n,s,r){e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{doc_thread_id:t,student_id:n,program_id:s,docName:r,SetAsFinalFileModel:!0})}))},e}return(0,a.Z)(n,[{key:"componentDidMount",value:function(){var e=this;(0,S.sK)().then((function(t){var n=t.data,s=n.data,i=n.success;i?e.setState({isLoaded:!0,students:s,success:i}):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.unauthorizederror,s=t.timeouterror,i=t.isLoaded;if(s)return(0,C.jsx)("div",{children:(0,C.jsx)(_.Z,{})});if(n)return(0,C.jsx)("div",{children:(0,C.jsx)(Z.Z,{})});var r={position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"};if(!i&&!this.state.students)return(0,C.jsx)("div",{style:r,children:(0,C.jsx)(c.Z,{animation:"border",role:"status",children:(0,C.jsx)("span",{className:"visually-hidden"})})});var a=this.state.students.map((function(t,n){return(0,C.jsx)(A,{role:e.props.user.role,user:e.props.user,student:t,isDashboard:!0,handleAsFinalFile:e.handleAsFinalFile},n)}));return(0,C.jsxs)(j.Z,{children:[(0,C.jsx)(u.Z,{className:"sticky-top",children:(0,C.jsx)(h.Z,{children:(0,C.jsx)(p.Z,{className:"mb-2 mx-0",bg:"dark",text:"light",children:(0,C.jsx)(p.Z.Header,{children:(0,C.jsx)(p.Z.Title,{className:"my-0 mx-0 text-light",children:"CV ML RL Overview"})})})})}),(0,C.jsx)(u.Z,{children:(0,C.jsx)(h.Z,{children:(0,C.jsxs)(x.Z,{responsive:!0,bordered:!0,hover:!0,className:"my-0 mx-0",variant:"dark",text:"light",children:[(0,C.jsx)("thead",{children:(0,C.jsxs)("tr",{children:[(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)("th",{}),(0,C.jsx)("th",{children:"First-, Last Name"}),("Admin"===this.props.user.role||"Editor"===this.props.user.role||"Agent"===this.props.user.role)&&(0,C.jsx)("th",{children:"Action"})]}),window.cvmlrllist.map((function(e,t){return(0,C.jsx)("th",{children:e.name},t)}))]})}),(0,C.jsx)("tbody",{children:a})]})})}),(0,C.jsxs)(m.Z,{show:this.state.SetAsFinalFileModel,onHide:this.closeSetAsFinalFileModelWindow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,C.jsx)(m.Z.Header,{children:(0,C.jsx)(m.Z.Title,{id:"contained-modal-title-vcenter",children:"Warning"})}),(0,C.jsxs)(m.Z.Body,{children:["Do you want to set ",this.state.docName," as final for student?"]}),(0,C.jsxs)(m.Z.Footer,{children:[(0,C.jsx)(f.Z,{disabled:!i,onClick:this.ConfirmSetAsFinalFileHandler,children:"Yes"}),(0,C.jsx)(f.Z,{onClick:this.closeSetAsFinalFileModelWindow,children:"No"}),!i&&(0,C.jsx)("div",{style:r,children:(0,C.jsx)(c.Z,{animation:"border",role:"status",children:(0,C.jsx)("span",{className:"visually-hidden"})})})]})]})]})}}]),n}(l.Component),L=w},94611:function(e,t,n){var s=n(27853),i=n(84531),r=n(78932),a=n(66621),d=n(47313),o=n(63849),l=n(31616),c=n(50099),u=n(54991),h=n(46417),p=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,s.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(o.Z,{children:(0,h.jsx)(l.Z,{children:(0,h.jsx)(c.Z,{children:"Time out error. Please login again!"})})})})}}]),n}(d.Component);t.Z=p},86450:function(e,t,n){var s=n(27853),i=n(84531),r=n(78932),a=n(66621),d=n(47313),o=n(63849),l=n(31616),c=n(50099),u=n(54991),h=n(46417),p=function(e){(0,r.Z)(n,e);var t=(0,a.Z)(n);function n(){return(0,s.Z)(this,n),t.apply(this,arguments)}return(0,i.Z)(n,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(o.Z,{children:(0,h.jsx)(l.Z,{children:(0,h.jsx)(c.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),n}(d.Component);t.Z=p},51767:function(e,t,n){n.d(t,{Ny:function(){return p},Vb:function(){return x},_3:function(){return f},vE:function(){return h},xL:function(){return j}});n(47313);var s=n(57864),i=n(3394),r=n(58821),a=n(46417),d=(0,a.jsx)(i.cfq,{size:18,color:"limegreen",title:"Valid Document"}),o=(0,a.jsx)(s.LHV,{size:18,color:"red",title:"Invalid Document"}),l=(0,a.jsx)(s.QRz,{size:18,color:"orange",title:"Uploaded successfully"}),c=(0,a.jsx)(s.znh,{size:18,color:"lightgray",title:"No Document uploaded"}),u=(0,a.jsx)(r.pZ2,{size:18,color:"lightgray",title:"Not needed"}),h=(0,a.jsxs)(a.Fragment,{children:[(0,a.jsx)("p",{className:"text-muted",children:" "}),(0,a.jsxs)("p",{className:"text-info",children:[d,": The document is valid and can be used in the application."]}),(0,a.jsxs)("p",{className:"text-info",children:[o,": The document is invalid and cannot be used in the application. Please properly scan a new one."]}),(0,a.jsxs)("p",{className:"text-info",children:[l,": The document is uploaded. Your agent will check it as soon as possible."]}),(0,a.jsxs)("p",{className:"text-info",children:[c,": Please upload the copy of the document."]}),(0,a.jsxs)("p",{className:"text-info",children:[u,": This document is not needed."]})," "]}),p=function(e){return new Date(e).toLocaleDateString()+", "+new Date(e).toLocaleTimeString()},x=function(e,t){var n=new Date(e),s=new Date(t).getTime()-n.getTime();return Math.round(s/864e5).toString()},m=function(e,t){var n=t-e;return Array.from({length:n},(function(t,n){return n+e}))},f=function(){return(0,a.jsx)(a.Fragment,{children:m(1950,2050).map((function(e,t){return(0,a.jsx)("option",{value:e,children:e},t)}))})},j=function(){return(0,a.jsx)(a.Fragment,{children:m(2022,2050).map((function(e,t){return(0,a.jsx)("option",{value:e,children:e},t)}))})}}}]);