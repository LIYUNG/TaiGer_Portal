"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[2635],{50099:function(e,t,s){var n=s(35531),r=s(27853),i=s(84531),o=s(78932),a=s(66621),l=s(47313),d=s(58050),u=s(72880),c=s(88815),p=s(29678),f=s.n(p),h=s(54991),m=s(12401),x=s(46417),j=function(e){(0,o.Z)(s,e);var t=(0,a.Z)(s);function s(){var e;(0,r.Z)(this,s);for(var n=arguments.length,i=new Array(n),o=0;o<n;o++)i[o]=arguments[o];return(e=t.call.apply(t,[this].concat(i))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,i.Z)(s,[{key:"render",value:function(){var e,t,s,r,i,o=this,a=[];return this.state.isOption&&(s=(0,x.jsx)("div",{className:"card-header-right",children:(0,x.jsxs)(d.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,x.jsx)(d.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,x.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,x.jsxs)(d.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){o.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,x.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,x.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){o.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,x.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,x.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,x.jsx)("i",{className:"feather icon-refresh-cw"}),(0,x.jsx)("a",{href:m.Z.BLANK_LINK,children:" Reload "})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,x.jsx)("i",{className:"feather icon-trash"}),(0,x.jsx)("a",{href:m.Z.BLANK_LINK,children:" Remove "})]})]})]})})),r=(0,x.jsxs)(u.Z.Header,{children:[(0,x.jsx)(u.Z.Title,{as:"h5",children:this.props.title}),s]}),this.state.fullCard&&(a=[].concat((0,n.Z)(a),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(a=[].concat((0,n.Z)(a),["card-load"]),t=(0,x.jsx)("div",{className:"card-loader",children:(0,x.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(a=[].concat((0,n.Z)(a),["d-none"])),this.props.cardClass&&(a=[].concat((0,n.Z)(a),[this.props.cardClass])),i=(0,x.jsxs)(u.Z,{className:a.join(" "),style:e,children:[r,(0,x.jsx)(c.Z,{in:!this.state.collapseCard,children:(0,x.jsx)("div",{children:(0,x.jsx)(u.Z.Body,{children:this.props.children})})}),t]}),(0,x.jsx)(h.Z,{children:i})}}]),s}(l.Component);t.Z=f()(j)},82635:function(e,t,s){s.r(t),s.d(t,{default:function(){return G}});var n=s(18489),r=s(35531),i=s(27853),o=s(84531),a=s(78932),l=s(66621),d=s(47313),u=s(44030),c=s(63849),p=s(72880),f=s(465),h=s(54991),m=s(37062),x=s(3394),j=s(57864),g=s(58821),v=s(46417),Z=function(e){(0,a.Z)(s,e);var t=(0,l.Z)(s);function s(){var e;(0,i.Z)(this,s);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={student:e.props.student,student_id:"",docName:"",file:""},e.handleGeneralDocSubmit=function(t,s,n){t.preventDefault(),e.props.SubmitGeneralFile(t,s,n)},e}return(0,o.Z)(s,[{key:"render",value:function(){for(var e=this,t=(Object.values(window.profile_list),Object.keys(window.profile_list)),s={},n={},r={},i={},o=0;o<t.length;o++)s[t[o]]="missing",n[t[o]]="",r[t[o]]="",i[t[o]]="";if(this.props.student.profile)for(var a=0;a<this.props.student.profile.length;a++)"uploaded"===this.props.student.profile[a].status?s[this.props.student.profile[a].name]="uploaded":"accepted"===this.props.student.profile[a].status?s[this.props.student.profile[a].name]="accepted":"rejected"===this.props.student.profile[a].status?s[this.props.student.profile[a].name]="rejected":"notneeded"===this.props.student.profile[a].status?s[this.props.student.profile[a].name]="notneeded":"missing"===this.props.student.profile[a].status&&(s[this.props.student.profile[a].name]="missing"),n[this.props.student.profile[a].name]=this.props.student.profile[a].feedback?this.props.student.profile[a].feedback:"",r[this.props.student.profile[a].name]=new Date(this.props.student.profile[a].updatedAt).toLocaleDateString(),i[this.props.student.profile[a].name]=new Date(this.props.student.profile[a].updatedAt).toLocaleTimeString();for(var l,d=Object.keys(window.profile_list),u={background:"red"},c={background:"green"},p="Complete",f=0;f<d.length;f++)if("uploaded"===s[d[f]]||"rejected"===s[d[f]]||"missing"===s[d[f]]){c=u,p="Incomplete";break}return l=d.map((function(t,n){return"uploaded"===s[t]?(0,v.jsx)("td",{children:(0,v.jsx)(m.Z,{to:"/student-database/"+e.props.student._id+"/profile",style:{textDecoration:"none"},className:"text-info",children:(0,v.jsx)(j.QRz,{size:24,color:"orange",title:"Uploaded successfully"})})},n):"accepted"===s[t]?(0,v.jsx)("td",{children:(0,v.jsx)(m.Z,{to:"/student-database/"+e.props.student._id+"/profile",style:{textDecoration:"none"},className:"text-info",children:(0,v.jsx)(x.cfq,{size:24,color:"limegreen",title:"Valid Document"})})},n):"rejected"===s[t]?(0,v.jsx)("td",{children:(0,v.jsx)(m.Z,{to:"/student-database/"+e.props.student._id+"/profile",style:{textDecoration:"none"},className:"text-info",children:(0,v.jsx)(j.LHV,{size:24,color:"red",title:"Invalid Document"})})},n):"notneeded"===s[t]?(0,v.jsx)("td",{children:(0,v.jsx)(m.Z,{to:"/student-database/"+e.props.student._id+"/profile",style:{textDecoration:"none"},className:"text-info",children:(0,v.jsx)(g.pZ2,{size:24,color:"lightgray",title:"Not needed"})})},n):(0,v.jsx)("td",{children:(0,v.jsx)(m.Z,{to:"/student-database/"+e.props.student._id+"/profile",style:{textDecoration:"none"},className:"text-info",children:(0,v.jsx)(j.znh,{size:24,color:"lightgray",title:"No Document uploaded"})})},n)})),(0,v.jsx)(v.Fragment,{children:(0,v.jsxs)("tr",{children:[(0,v.jsx)("td",{style:c,title:p,children:(0,v.jsxs)(m.Z,{to:"/student-database/"+this.props.student._id+"/profile",style:{textDecoration:"none"},className:"text-light",children:[this.props.student.firstname," ",this.props.student.lastname]})}),l]})})}}]),s}(d.Component),F=Z,y=s(88815),b=s(31616),w=s(75828),N=s(60257),D=s(46090),S=s(3735),L=s(59931),k=function(e){(0,a.Z)(s,e);var t=(0,l.Z)(s);function s(){var e;(0,i.Z)(this,s);for(var n=arguments.length,r=new Array(n),o=0;o<n;o++)r[o]=arguments[o];return(e=t.call.apply(t,[this].concat(r))).state={student:e.props.student,student_id:"",docName:"",file:""},e.handleGeneralDocSubmit=function(t,s,n){t.preventDefault(),e.props.SubmitGeneralFile(t,s,n)},e}return(0,o.Z)(s,[{key:"render",value:function(){for(var e,t=this,s=Object.values(window.profile_list),n=Object.keys(window.profile_list),r={},i={},o={},a={},l=0;l<n.length;l++)r[n[l]]="missing",i[n[l]]="",o[n[l]]="",a[n[l]]="";if(this.props.student.profile)for(var d=0;d<this.props.student.profile.length;d++)"uploaded"===this.props.student.profile[d].status?r[this.props.student.profile[d].name]="uploaded":"accepted"===this.props.student.profile[d].status?r[this.props.student.profile[d].name]="accepted":"rejected"===this.props.student.profile[d].status?r[this.props.student.profile[d].name]="rejected":"notneeded"===this.props.student.profile[d].status?r[this.props.student.profile[d].name]="notneeded":"missing"===this.props.student.profile[d].status&&(r[this.props.student.profile[d].name]="missing"),i[this.props.student.profile[d].name]=this.props.student.profile[d].feedback?this.props.student.profile[d].feedback:"",o[this.props.student.profile[d].name]=new Date(this.props.student.profile[d].updatedAt).toLocaleDateString(),a[this.props.student.profile[d].name]=new Date(this.props.student.profile[d].updatedAt).toLocaleTimeString();return e=n.map((function(e,n){return"uploaded"===r[e]?(0,v.jsx)(w.Z,{role:t.props.role,isLoaded:t.props.isLoaded,docName:s[n],date:o[e],time:a[e],k:e,student_id:t.props.student._id,onDownloadFilefromstudent:t.props.onDownloadFilefromstudent,onDeleteFilefromstudent:t.props.onDeleteFilefromstudent,onUpdateProfileFilefromstudent:t.props.onUpdateProfileFilefromstudent,SubmitGeneralFile:t.props.SubmitGeneralFile},n+1):"accepted"===r[e]?(0,v.jsx)(N.Z,{role:t.props.role,isLoaded:t.props.isLoaded,docName:s[n],date:o[e],time:a[e],k:e,student_id:t.props.student._id,onDownloadFilefromstudent:t.props.onDownloadFilefromstudent,onDeleteFilefromstudent:t.props.onDeleteFilefromstudent,onUpdateProfileFilefromstudent:t.props.onUpdateProfileFilefromstudent,SubmitGeneralFile:t.props.SubmitGeneralFile,deleteFileWarningModel:t.props.deleteFileWarningModel},n+1):"rejected"===r[e]?(0,v.jsx)(D.Z,{role:t.props.role,isLoaded:t.props.isLoaded,docName:s[n],date:o[e],time:a[e],k:e,message:i[e],student_id:t.props.student._id,onDownloadFilefromstudent:t.props.onDownloadFilefromstudent,onDeleteFilefromstudent:t.props.onDeleteFilefromstudent,onUpdateProfileFilefromstudent:t.props.onUpdateProfileFilefromstudent,SubmitGeneralFile:t.props.SubmitGeneralFile,deleteFileWarningModel:t.props.deleteFileWarningModel},n+1):"notneeded"===r[e]?("Admin"===t.props.role||"Agent"===t.props.role)&&(0,v.jsx)(S.Z,{role:t.props.role,isLoaded:t.props.isLoaded,docName:s[n],date:o[e],time:a[e],k:e,student_id:t.props.student._id,onDownloadFilefromstudent:t.props.onDownloadFilefromstudent,onDeleteFilefromstudent:t.props.onDeleteFilefromstudent,onUpdateProfileFilefromstudent:t.props.onUpdateProfileFilefromstudent,SubmitGeneralFile:t.props.SubmitGeneralFile,deleteFileWarningModel:t.props.deleteFileWarningModel},n+1):(0,v.jsx)(L.Z,{role:t.props.role,isLoaded:t.props.isLoaded,docName:s[n],date:o[e],time:a[e],k:e,message:i[e],student_id:t.props.student._id,onDownloadFilefromstudent:t.props.onDownloadFilefromstudent,onDeleteFilefromstudent:t.props.onDeleteFilefromstudent,onUpdateProfileFilefromstudent:t.props.onUpdateProfileFilefromstudent,SubmitGeneralFile:t.props.SubmitGeneralFile,handleGeneralDocSubmit:t.handleGeneralDocSubmit},n+1)})),(0,v.jsx)(v.Fragment,{children:(0,v.jsxs)(p.Z,{className:"mb-2 mx-0",bg:"dark",text:"light",children:[(0,v.jsx)(p.Z.Header,{onClick:function(){return t.props.singleExpandtHandler(t.props.idx)},children:(0,v.jsxs)(p.Z.Title,{"aria-controls":"accordion"+this.props.idx,"aria-expanded":this.props.accordionKeys[this.props.idx]===this.props.idx,className:"my-0 mx-0 text-light",children:[this.state.student.firstname," ,",this.state.student.lastname]})}),(0,v.jsx)(y.Z,{in:this.props.accordionKeys[this.props.idx]===this.props.idx,children:(0,v.jsxs)("div",{id:"accordion1",children:[(0,v.jsx)(c.Z,{children:(0,v.jsxs)(f.Z,{responsive:!0,className:"my-0 mx-0",variant:"dark",text:"light",children:[(0,v.jsx)("thead",{children:(0,v.jsxs)("tr",{children:[(0,v.jsx)("th",{children:"Status"}),(0,v.jsx)("th",{children:"File Name:"}),(0,v.jsx)("th",{}),(0,v.jsx)("th",{}),(0,v.jsx)("th",{children:"Feedback"}),(0,v.jsx)("th",{}),(0,v.jsx)("th",{children:"Delete"})]})}),(0,v.jsx)("tbody",{children:e})]})}),(0,v.jsx)(c.Z,{children:(0,v.jsx)(b.Z,{className:"md-4",children:this.props.SYMBOL_EXPLANATION})}),(0,v.jsx)(c.Z,{})]})})]},this.props.idx)})}}]),s}(d.Component),_=k,C=s(51767),A=s(94611),M=s(86450),P=s(51426),z=function(e){(0,a.Z)(s,e);var t=(0,l.Z)(s);function s(){var e;(0,i.Z)(this,s);for(var o=arguments.length,a=new Array(o),l=0;l<o;l++)a[l]=arguments[l];return(e=t.call.apply(t,[this].concat(a))).state={error:null,timeouterror:null,unauthorizederror:null,isLoaded:!1,data:null,success:!1,students:null,file:"",student_id:"",status:"",category:"",feedback:"",expand:!1,CommentModel:!1,accordionKeys:!e.props.user.students||"Editor"!==e.props.user.role&&"Agent"!==e.props.user.role?[0]:new Array(e.props.user.students.length).fill().map((function(e,t){return t}))},e.singleExpandtHandler=function(t){var s=(0,r.Z)(e.state.accordionKeys);s[t]=s[t]!==t?t:-1,e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{accordionKeys:s})}))},e.AllCollapsetHandler=function(){e.setState((function(t){return(0,n.Z)((0,n.Z)({},t),{},{expand:!1,accordionKeys:"Editor"===e.props.user.role||"Agent"===e.props.user.role?new Array(e.props.user.students.length).fill().map((function(e,t){return-1})):[-1]})}))},e.AllExpandtHandler=function(){e.setState((function(t){return(0,n.Z)((0,n.Z)({},t),{},{expand:!0,accordionKeys:"Editor"===e.props.user.role||"Agent"===e.props.user.role?new Array(e.props.user.students.length).fill().map((function(e,t){return t})):[0]})}))},e.onUpdateProfileFilefromstudent=function(t,s,i,o){var a=e.state.students.findIndex((function(e){return e._id===s})),l=(0,r.Z)(e.state.students);(0,P.dn)(t,s,i,o).then((function(t){l[a]=t.data.data;var s=t.data.success;s?e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{students:l,success:s,isLoaded:!0})})):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:t})}))},e.onDeleteFilefromstudent=function(t,s){var i=e.state.students.findIndex((function(e){return e._id===s})),o=e.state.students.find((function(e){return e._id===s})).profile.findIndex((function(e){return e.name===t})),a=(0,r.Z)(e.state.students);(0,P._I)(t,s).then((function(t){var s=t.data,r=s.data,l=s.success;a[i].profile[o]=r,l?e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{student_id:"",category:"",isLoaded:!0,students:a,success:l,deleteFileWarningModel:!1})})):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})}))},e.SubmitGeneralFile=function(t,s,n){e.onSubmitGeneralFile(t,t.target.files[0],s,n)},e.onSubmitGeneralFile=function(t,s,i,o){t.preventDefault();var a=new FormData;a.append("file",s);var l=e.state.students.findIndex((function(e){return e._id===o}));e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{isLoaded:!1})})),(0,P.HQ)(i,o,a).then((function(t){var s=(0,r.Z)(e.state.students),i=t.data,o=i.data,a=i.success;s[l]=o,a?e.setState((function(e){return(0,n.Z)((0,n.Z)({},e),{},{students:s,success:a,category:"",isLoaded:!0,file:""})})):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:t})}))},e}return(0,o.Z)(s,[{key:"componentDidMount",value:function(){var e=this;(0,P.sK)().then((function(t){var s=t.data,n=s.data,r=s.success;r?e.setState({isLoaded:!0,students:n,success:r}):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:!0})}))}},{key:"onDownloadFilefromstudent",value:function(e,t,s){var n=this;e.preventDefault(),(0,P.w3)(t,s).then((function(e){if(200===e.status){var t=e.headers["content-disposition"].split('"')[1],s=e.data;if(0===s.size)return;var r=t.split(".");if("pdf"===(r=r.pop())){var i=window.URL.createObjectURL(new Blob([s],{type:"application/pdf"}));window.open(i)}else{var o=window.URL.createObjectURL(new Blob([s])),a=document.createElement("a");a.href=o,a.setAttribute("download",t),document.body.appendChild(a),a.click(),a.parentNode.removeChild(a)}}else 401===e.status||500===e.status?n.setState({isLoaded:!0,timeouterror:!0}):403===e.status&&n.setState({isLoaded:!0,unauthorizederror:!0})}),(function(e){alert("The file is not available.")}))}},{key:"render",value:function(){var e=this,t=this.state,s=t.unauthorizederror,n=t.timeouterror,r=t.isLoaded;if(n)return(0,v.jsx)("div",{children:(0,v.jsx)(A.Z,{})});if(s)return(0,v.jsx)("div",{children:(0,v.jsx)(M.Z,{})});var i=Object.values(window.profile_list),o={position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},a={transform:"rotate(360deg)",textAlign:"left",verticalAlign:"left",overflowWrap:"break-word"};if(!r&&!this.state.students)return(0,v.jsx)("div",{style:o,children:(0,v.jsx)(u.Z,{animation:"border",role:"status",children:(0,v.jsx)("span",{className:"visually-hidden"})})});var l=this.state.students.map((function(t,s){return(0,v.jsx)(F,{idx:s,student:t,accordionKeys:e.state.accordionKeys,singleExpandtHandler:e.singleExpandtHandler,role:e.props.user.role,user:e.props.user,documentslist2:e.props.documentslist2,documentslist:e.props.documentslist,onDownloadFilefromstudent:e.onDownloadFilefromstudent,SubmitGeneralFile:e.SubmitGeneralFile,onUpdateProfileFilefromstudent:e.onUpdateProfileFilefromstudent,onDeleteFilefromstudent:e.onDeleteFilefromstudent,SYMBOL_EXPLANATION:C.vE,isLoaded:r,CommentModel:e.state.CommentModel,rejectProfileFileModel:e.state.rejectProfileFileModel,acceptProfileFileModel:e.state.acceptProfileFileModel},s)})),d=this.state.students.map((function(t,s){return(0,v.jsx)(_,{idx:s,student:t,accordionKeys:e.state.accordionKeys,singleExpandtHandler:e.singleExpandtHandler,role:e.props.user.role,user:e.props.user,documentslist2:e.props.documentslist2,documentslist:e.props.documentslist,onDownloadFilefromstudent:e.onDownloadFilefromstudent,SubmitGeneralFile:e.SubmitGeneralFile,onUpdateProfileFilefromstudent:e.onUpdateProfileFilefromstudent,onDeleteFilefromstudent:e.onDeleteFilefromstudent,SYMBOL_EXPLANATION:C.vE,isLoaded:r,deleteFileWarningModel:e.state.deleteFileWarningModel,CommentModel:e.state.CommentModel,rejectProfileFileModel:e.state.rejectProfileFileModel,acceptProfileFileModel:e.state.acceptProfileFileModel},s)}));return(0,v.jsxs)(h.Z,{children:[(0,v.jsx)(c.Z,{className:"sticky-top",children:(0,v.jsx)(p.Z,{className:"mb-2 mx-0",bg:"dark",text:"light",children:(0,v.jsx)(p.Z.Header,{children:(0,v.jsx)(p.Z.Title,{className:"my-0 mx-0 text-light",children:"Base Documents"})})})}),(0,v.jsxs)(c.Z,{children:["Admin"===this.props.user.role||"Agent"===this.props.user.role||"Editor"===this.props.user.role?(0,v.jsx)(p.Z,{className:"mb-2 mx-0",bg:"dark",text:"light",children:(0,v.jsx)(p.Z.Body,{children:(0,v.jsxs)(f.Z,{responsive:!0,hover:!0,className:"my-0 mx-0",text:"light",children:[(0,v.jsx)("thead",{children:(0,v.jsxs)("tr",{className:"my-0 mx-0 text-light",children:[(0,v.jsx)(v.Fragment,{children:(0,v.jsx)("th",{style:a,children:"First-, Last Name"})}),i.map((function(e,t){return(0,v.jsx)("th",{style:a,children:e},t)}))]})}),(0,v.jsx)("tbody",{children:l})]})})}):(0,v.jsx)(v.Fragment,{children:d}),!r&&(0,v.jsx)("div",{style:o,children:(0,v.jsx)(u.Z,{animation:"border",role:"status",children:(0,v.jsx)("span",{className:"visually-hidden"})})})]})]})}}]),s}(d.Component),G=z},94611:function(e,t,s){var n=s(27853),r=s(84531),i=s(78932),o=s(66621),a=s(47313),l=s(63849),d=s(31616),u=s(50099),c=s(54991),p=s(46417),f=function(e){(0,i.Z)(s,e);var t=(0,o.Z)(s);function s(){return(0,n.Z)(this,s),t.apply(this,arguments)}return(0,r.Z)(s,[{key:"render",value:function(){return(0,p.jsx)(c.Z,{children:(0,p.jsx)(l.Z,{children:(0,p.jsx)(d.Z,{children:(0,p.jsx)(u.Z,{children:"Time out error. Please login again!"})})})})}}]),s}(a.Component);t.Z=f},86450:function(e,t,s){var n=s(27853),r=s(84531),i=s(78932),o=s(66621),a=s(47313),l=s(63849),d=s(31616),u=s(50099),c=s(54991),p=s(46417),f=function(e){(0,i.Z)(s,e);var t=(0,o.Z)(s);function s(){return(0,n.Z)(this,s),t.apply(this,arguments)}return(0,r.Z)(s,[{key:"render",value:function(){return(0,p.jsx)(c.Z,{children:(0,p.jsx)(l.Z,{children:(0,p.jsx)(d.Z,{children:(0,p.jsx)(u.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),s}(a.Component);t.Z=f},51767:function(e,t,s){s.d(t,{Ny:function(){return m},Ue:function(){return f},Vb:function(){return x},XA:function(){return h},_3:function(){return g},vE:function(){return p},xL:function(){return v}});s(47313);var n=s(57864),r=s(3394),i=s(58821),o=s(46417),a=(0,o.jsx)(r.cfq,{size:18,color:"limegreen",title:"Valid Document"}),l=(0,o.jsx)(n.LHV,{size:18,color:"red",title:"Invalid Document"}),d=(0,o.jsx)(n.QRz,{size:18,color:"orange",title:"Uploaded successfully"}),u=(0,o.jsx)(n.znh,{size:18,color:"lightgray",title:"No Document uploaded"}),c=(0,o.jsx)(i.pZ2,{size:18,color:"lightgray",title:"Not needed"}),p=(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)("p",{className:"text-muted",children:" "}),(0,o.jsxs)("p",{className:"text-info",children:[a,": The document is valid and can be used in the application."]}),(0,o.jsxs)("p",{className:"text-info",children:[l,": The document is invalid and cannot be used in the application. Please properly scan a new one."]}),(0,o.jsxs)("p",{className:"text-info",children:[d,": The document is uploaded. Your agent will check it as soon as possible."]}),(0,o.jsxs)("p",{className:"text-info",children:[u,": Please upload the copy of the document."]}),(0,o.jsxs)("p",{className:"text-info",children:[c,": This document is not needed."]})," "]}),f=[{key:"ee",value:"Eletrical/Electronics Engineering"},{key:"cs",value:"Computer Science"},{key:"mgm",value:"Business/Management"},{key:"dsbi",value:"Data Science/Business Intelligence"},{key:"me",value:"Mechanical Engineering"},{key:"mtl",value:"Materials Science"}],h=[{key:"application",value:"Application"},{key:"base-documents",value:"Base-documents"},{key:"cv-ml-rl",value:"CV/ML/RL"},{key:"portal-instruction",value:"Portal-Instruction"},{key:"certification",value:"Certification"},{key:"uniassist",value:"Uni-Assist"},{key:"visa",value:"Visa"}],m=function(e){return new Date(e).toLocaleDateString()+", "+new Date(e).toLocaleTimeString()},x=function(e,t){var s=new Date(e),n=new Date(t).getTime()-s.getTime();return Math.round(n/864e5).toString()},j=function(e,t){var s=t-e;return Array.from({length:s},(function(t,s){return s+e}))},g=function(){return(0,o.jsx)(o.Fragment,{children:j(1950,2050).map((function(e,t){return(0,o.jsx)("option",{value:e,children:e},t)}))})},v=function(){return(0,o.jsx)(o.Fragment,{children:j(2022,2050).map((function(e,t){return(0,o.jsx)("option",{value:e,children:e},t)}))})}}}]);