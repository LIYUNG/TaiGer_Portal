"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[8979],{28979:function(e,t,i){i.d(t,{Z:function(){return N}});var r=i(18489),s=i(27853),n=i(84531),a=i(78932),d=i(66621),o=i(47313),l=i(94611),c=i(86450),p=i(37062),h=i(44030),u=i(88815),m=i(72880),x=i(63849),f=i(31616),_=i(93298),g=i(64212),j=i(51426),Z=i(57864),F=i(3394),y=i(51767),v=i(46417),S=function(e){(0,a.Z)(i,e);var t=(0,d.Z)(i);function i(){var e;(0,s.Z)(this,i);for(var r=arguments.length,n=new Array(r),a=0;a<r;a++)n[a]=arguments[a];return(e=t.call.apply(t,[this].concat(n))).handleAsFinalFileThread=function(t){e.props.handleAsFinalFile(e.props.thread.doc_thread_id._id,e.props.student._id,e.props.program_id,t)},e.handleDeleteFileThread=function(){e.props.onDeleteFileThread(e.props.thread.doc_thread_id._id,e.props.application,e.props.student._id)},e.handleDeleteProgramSpecificFileThread=function(){e.props.onDeleteProgramSpecificThread(e.props.thread.doc_thread_id._id,e.props.program_id,e.props.student._id)},e}return(0,n.Z)(i,[{key:"render",value:function(){var e,t,i,r=this;return this.props.application?(i=this.props.application.programId.school+" - "+this.props.application.programId.program_name,t=this.props.student.firstname+" - "+this.props.student.lastname+" "+i+" "+this.props.thread.doc_thread_id.file_type):t=this.props.student.firstname+" - "+this.props.student.lastname+" "+this.props.thread.doc_thread_id.file_type,e=(0,v.jsx)(v.Fragment,{children:(0,v.jsxs)(x.Z,{children:[(0,v.jsx)(f.Z,{md:1,children:"Student"===this.props.role||"Guest"===this.props.role?this.props.thread.isFinalVersion&&(0,v.jsx)(F.cfq,{size:24,color:"limegreen",title:"Final Version"}):this.props.thread.isFinalVersion?(0,v.jsx)(v.Fragment,{children:(0,v.jsx)(F.cfq,{size:24,color:"limegreen",title:"Final Version"})}):(0,v.jsx)(Z.bzc,{size:24,color:"white",style:{cursor:"pointer"},title:"Set as final version",onClick:function(){return r.handleAsFinalFileThread(t)}})}),(0,v.jsx)(f.Z,{md:1,children:this.props.thread.isFinalVersion?"Student"===this.props.role||"Guest"===this.props.role?(0,v.jsx)("p",{children:"Closed"}):(0,v.jsx)(Z.OwP,{size:24,color:"red",title:"Un do Final Version",style:{cursor:"pointer"},onClick:function(){return r.handleAsFinalFileThread(t)}}):(0,v.jsx)(v.Fragment,{})}),(0,v.jsx)(f.Z,{md:6,children:(0,v.jsx)(p.Z,{to:"/document-modification/"+this.props.thread.doc_thread_id._id,className:"text-info",style:{textDecoration:"none"},children:t})}),(0,v.jsx)(f.Z,{md:2,children:(0,v.jsx)("p",{className:"text-light",children:(0,y.Ny)(this.props.thread.doc_thread_id.updatedAt)})}),"Student"===this.props.role||"Guest"===this.props.role?(0,v.jsx)(v.Fragment,{}):(0,v.jsx)(f.Z,{md:1,children:(0,v.jsx)(_.Z,{size:"sm",style:{cursor:"pointer"},title:"Delete",variant:"danger",onClick:this.handleDeleteFileThread,children:(0,v.jsx)(Z.VPh,{size:20})})})]})}),(0,v.jsx)(v.Fragment,{children:e})}}]),i}(o.Component),T=S,C=function(e){(0,a.Z)(i,e);var t=(0,d.Z)(i);function i(){return(0,s.Z)(this,i),t.apply(this,arguments)}return(0,n.Z)(i,[{key:"render",value:function(){var e,t=this;return e=null===this.props.application?this.props.student.generaldocs_threads?this.props.student.generaldocs_threads.map((function(e){return(0,v.jsx)(T,{thread:e,student:t.props.student,application:t.props.application,onFormSubmit:t.props.onFormSubmit,onTrashClick:t.props.onTrashClick,onDeleteProgramSpecificThread:t.props.onDeleteProgramSpecificThread,onDeleteFileThread:t.props.onDeleteFileThread,handleAsFinalFile:t.props.handleAsFinalFile,role:t.props.role},e._id)})):"":this.props.application&&this.props.application.doc_modification_thread?this.props.application.doc_modification_thread.map((function(e){return(0,v.jsx)(T,{thread:e,application:t.props.application,program_id:t.props.application.programId._id,student:t.props.student,onTrashClick:t.props.onTrashClick,onDeleteProgramSpecificThread:t.props.onDeleteProgramSpecificThread,handleAsFinalFile:t.props.handleAsFinalFile,onDeleteFileThread:t.props.onDeleteFileThread,role:t.props.role},e._id)})):"",(0,v.jsx)(v.Fragment,{children:e})}}]),i}(o.Component),I=C,L=i(83109),M=function(e){(0,a.Z)(i,e);var t=(0,d.Z)(i);function i(){return(0,s.Z)(this,i),t.apply(this,arguments)}return(0,n.Z)(i,[{key:"render",value:function(){var e,t=this,i=this.props.student.firstname+"-"+this.props.student.lastname+" "+this.props.category;return e="General"===this.props.filetype?(0,v.jsx)(L.Z,{children:(0,v.jsx)(L.Z.Group,{controlId:"formFile",className:"mb-3",children:(0,v.jsxs)(L.Z.Control,{as:"select",onChange:function(e){return t.props.handleSelect(e)},value:this.props.category,children:[(0,v.jsx)("option",{value:"",children:"Please Select"}),(0,v.jsx)("option",{value:"CV",children:"CV"}),(0,v.jsx)("option",{value:"RL_A",children:"RL (Referee A)"}),(0,v.jsx)("option",{value:"RL_B",children:"RL (Referee B)"}),(0,v.jsx)("option",{value:"RL_C",children:"RL (Referee C)"}),(0,v.jsx)("option",{value:"Others",children:"Others"})]})})}):(0,v.jsx)(L.Z,{children:(0,v.jsx)(L.Z.Group,{controlId:"formFile",className:"mb-3",children:(0,v.jsxs)(L.Z.Control,{as:"select",onChange:function(e){return t.props.handleSelect(e)},value:this.props.category,children:[(0,v.jsx)("option",{value:"",children:"Please Select"}),(0,v.jsx)("option",{value:"ML",children:"ML"}),(0,v.jsx)("option",{value:"Essay",children:"Essay"}),(0,v.jsx)("option",{value:"Scholarship_Form",children:"Scholarship Form"}),(0,v.jsx)("option",{value:"RL_A",children:"RL (Referee A)"}),(0,v.jsx)("option",{value:"RL_B",children:"RL (Referee B)"}),(0,v.jsx)("option",{value:"RL_C",children:"RL (Referee C)"}),(0,v.jsx)("option",{value:"Others",children:"Others"})]})})}),(0,v.jsxs)(x.Z,{className:"my-2",children:[(0,v.jsx)(f.Z,{md:6,children:e}),(0,v.jsx)(f.Z,{md:1,children:"General"===this.props.filetype?(0,v.jsx)(_.Z,{variant:"primary",onClick:function(e){return t.props.handleCreateGeneralMessageThread(e,t.props.student._id,t.props.category,i)},children:"Create"}):(0,v.jsx)(_.Z,{variant:"primary",onClick:function(e){return t.props.handleCreateProgramSpecificMessageThread(e,t.props.student._id,t.props.application.programId._id,t.props.category,i)},children:"Create"})})]})}}]),i}(o.Component),D=M,q=function(e){(0,a.Z)(i,e);var t=(0,d.Z)(i);function i(){var e;(0,s.Z)(this,i);for(var r=arguments.length,n=new Array(r),a=0;a<r;a++)n[a]=arguments[a];return(e=t.call.apply(t,[this].concat(n))).state={category:""},e.handleCreateGeneralMessageThread=function(t,i,r,s){t.preventDefault(),e.state.category?(e.props.initGeneralFileThread(t,i,r,s),e.setState({category:""})):alert("Please select file type")},e.handleCreateProgramSpecificMessageThread=function(t,i,r,s,n){t.preventDefault(),e.state.category?(e.props.initProgramSpecificFileThread(t,i,r,s,n),e.setState({category:""})):alert("Please select file type")},e.handleSelect=function(t){t.preventDefault(),e.setState({category:t.target.value})},e}return(0,n.Z)(i,[{key:"render",value:function(){return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(I,{student:this.props.student,onDeleteFileThread:this.props.onDeleteFileThread,handleAsFinalFile:this.props.handleAsFinalFile,role:this.props.role,application:this.props.application}),"Student"===this.props.role||"Guest"===this.props.role?(0,v.jsx)(v.Fragment,{}):(!this.props.application||this.props.application&&"O"!==this.props.application.closed)&&(0,v.jsx)(D,{role:this.props.role,student:this.props.student,handleSelect:this.handleSelect,handleCreateGeneralMessageThread:this.handleCreateGeneralMessageThread,handleCreateProgramSpecificMessageThread:this.handleCreateProgramSpecificMessageThread,category:this.state.category,filetype:this.props.filetype,application:this.props.application})]})}}]),i}(o.Component),R=q,b=i(83708),A=function(e){(0,a.Z)(i,e);var t=(0,d.Z)(i);function i(){var e;(0,s.Z)(this,i);for(var n=arguments.length,a=new Array(n),d=0;d<n;d++)a[d]=arguments[d];return(e=t.call.apply(t,[this].concat(a))).state={timeouterror:null,unauthorizederror:null,student:e.props.student,deleteFileWarningModel:!1,SetAsFinalFileModel:!1,Requirements_Modal:!1,studentId:"",student_id:"",doc_thread_id:"",applicationId:"",docName:"",isLoaded:!1,requirements:"",file:"",isThreadExisted:!1},e.closeSetAsFinalFileModelWindow=function(){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{SetAsFinalFileModel:!1})}))},e.openRequirements_ModalWindow=function(t){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{Requirements_Modal:!0,requirements:t})}))},e.close_Requirements_ModalWindow=function(){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{Requirements_Modal:!1,requirements:""})}))},e.closeDocExistedWindow=function(){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{isThreadExisted:!1})}))},e.closeWarningWindow=function(){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{deleteFileWarningModel:!1})}))},e.ConfirmDeleteDiscussionThreadHandler=function(){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{isLoaded:!1})})),null==e.state.program_id?(0,j.Rh)(e.state.doc_thread_id,e.state.student_id).then((function(t){var i=t.data,s=i.data,n=i.success;n?e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{studentId:"",program_id:"",docName:"",isLoaded:!0,student:s,success:n,deleteFileWarningModel:!1})})):(alert(t.data.message),e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{studentId:"",program_id:"",docName:"",isLoaded:!0,success:n,deleteFileWarningModel:!1})})))}),(function(t){e.setState({error:t})})):(0,j.vI)(e.state.doc_thread_id,e.state.program_id,e.state.student_id).then((function(t){var i=t.data,s=i.data,n=i.success;n?e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{studentId:"",program_id:"",docName:"",isLoaded:!0,student:s,success:n,deleteFileWarningModel:!1})})):(alert(t.data.message),e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{studentId:"",program_id:"",docName:"",isLoaded:!0,success:n,deleteFileWarningModel:!1})})))}),(function(t){e.setState({error:t})}))},e.ConfirmSetAsFinalFileHandler=function(){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{isLoaded:!1})})),(0,j.lk)(e.state.doc_thread_id,e.state.student_id,e.state.program_id).then((function(t){var i=t.data,s=i.data,n=i.success;n?e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{studentId:"",applicationId:"",docName:"",isLoaded:!0,student:s,success:n,SetAsFinalFileModel:!1})})):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({error:t})}))},e.handleAsFinalFile=function(t,i,s,n){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{doc_thread_id:t,student_id:i,program_id:s,docName:n,SetAsFinalFileModel:!0})}))},e.onDeleteFileThread=function(t,i,s){e.setState((function(e){return(0,r.Z)((0,r.Z)({},e),{},{doc_thread_id:t,program_id:i?i.programId._id:null,student_id:s,deleteFileWarningModel:!0})}))},e.initProgramSpecificFileThread=function(t,i,r,s,n){t.preventDefault(),(0,j.ep)(i,r,s).then((function(t){var i=t.data,r=i.data,s=i.success;s?e.setState({isLoaded:!0,student:r,success:s,file:""}):400===t.status?e.setState({isLoaded:!0,docName:n,isThreadExisted:!0}):401===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})})).catch((function(t){e.setState({error:t})}))},e.initGeneralFileThread=function(t,i,r,s){t.preventDefault(),(0,j.ZS)(i,r).then((function(t){var i=t.data,r=i.data,n=i.success;n?e.setState({isLoaded:!0,student:r,success:n,file:""}):400===t.status?e.setState({isLoaded:!0,docName:s,isThreadExisted:!0}):401===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})})).catch((function(t){e.setState({error:t})}))},e}return(0,n.Z)(i,[{key:"componentDidMount",value:function(){this.setState((function(e){return{isLoaded:!0}}))}},{key:"render",value:function(){var e=this,t=this.state,i=t.timeouterror,r=t.unauthorizederror,s=t.error,n=t.isLoaded;if(s)return(0,v.jsx)("div",{children:"Error: your session is timeout! Please refresh the page and Login"});if(i)return(0,v.jsx)("div",{children:(0,v.jsx)(l.Z,{})});if(r)return(0,v.jsx)("div",{children:(0,v.jsx)(c.Z,{})});var a={position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"};if(!n&&!this.state.student)return(0,v.jsx)("div",{style:a,children:(0,v.jsx)(h.Z,{animation:"border",role:"status",children:(0,v.jsx)("span",{className:"visually-hidden"})})});var d=(0,b.qz)(this.state.student);return(0,v.jsxs)(v.Fragment,{children:[(0,v.jsx)(u.Z,{in:this.props.accordionKeys[this.props.idx]===this.props.idx,children:(0,v.jsx)("div",{id:"accordion1",children:(0,v.jsxs)(m.Z.Body,{children:[(0,v.jsx)(x.Z,{className:"mb-4 mx-0",children:(0,v.jsx)(f.Z,{md:8,children:(0,v.jsx)("b",{className:"text-light",children:"General Documents (CV, Recommendation Letters)"})})}),d&&(0,v.jsx)(m.Z,{className:"my-2 mx-0",bg:"danger",text:"light",children:(0,v.jsx)(m.Z.Body,{children:(0,v.jsxs)("p",{className:"text-light my-0",children:["The following general documents are not started yet:"," ",-1===this.state.student.generaldocs_threads.findIndex((function(e){return"CV"===e.doc_thread_id.file_type}))&&(0,v.jsx)("li",{children:(0,v.jsx)("b",{children:"CV"})})," ",this.state.student.generaldocs_threads.filter((function(e){return e.doc_thread_id.file_type.includes("RL")})).length<2&&(0,v.jsx)("li",{children:(0,v.jsxs)("b",{children:["RL x"," ",2-this.state.student.generaldocs_threads.filter((function(e){return e.doc_thread_id.file_type.includes("RL")})).length]})})]})})}),(0,v.jsx)(R,{onDeleteFileThread:this.onDeleteFileThread,handleAsFinalFile:this.handleAsFinalFile,role:this.props.role,student:this.state.student,filetype:"General",initGeneralFileThread:this.initGeneralFileThread,initProgramSpecificFileThread:this.initProgramSpecificFileThread,application:null}),(0,v.jsx)("hr",{}),this.state.student.applications&&this.state.student.applications.map((function(t,i){return(0,v.jsxs)("div",{children:[(void 0!==t.decided&&"O"===t.decided&&void 0!==t.programId.ml_required&&"yes"===t.programId.ml_required&&-1===t.doc_modification_thread.findIndex((function(e){return"ML"===e.doc_thread_id.file_type}))||void 0!==t.decided&&"O"===t.decided&&void 0!==t.programId.essay_required&&"yes"===t.programId.essay_required&&-1===t.doc_modification_thread.findIndex((function(e){return"Essay"===e.doc_thread_id.file_type})))&&(0,v.jsx)(m.Z,{className:"my-2 mx-0",bg:"danger",text:"light",children:(0,v.jsxs)(m.Z.Body,{children:["The followings application documents are not started yet:"," ",void 0!==t.programId.ml_required&&"yes"===t.programId.ml_required&&-1===t.doc_modification_thread.findIndex((function(e){return"ML"===e.doc_thread_id.file_type}))&&""!==t.programId.ml_requirements&&(0,v.jsx)("li",{children:(0,v.jsx)("b",{children:"ML"})}),void 0!==t.programId.essay_required&&"yes"===t.programId.essay_required&&-1===t.doc_modification_thread.findIndex((function(e){return"Essay"===e.doc_thread_id.file_type}))&&(0,v.jsx)("li",{children:(0,v.jsx)("b",{children:"Essay"})})]})}),void 0!==t.decided&&"O"===t.decided?(0,v.jsxs)(v.Fragment,{children:[(0,v.jsxs)(x.Z,{className:"mb-2 mx-0",children:[(0,v.jsx)(f.Z,{md:4,children:(0,v.jsx)(p.Z,{to:"/programs/"+t.programId._id,style:{textDecoration:"none"},className:"text-info",children:(0,v.jsxs)("b",{children:[t.programId.school," - ",t.programId.program_name]})})}),(0,v.jsxs)(f.Z,{md:2,children:[void 0!==t.programId.ml_required&&"yes"===t.programId.ml_required?(0,v.jsx)(v.Fragment,{children:(0,v.jsx)(_.Z,{size:"sm",title:"Comments",variant:"secondary",onClick:function(){return e.openRequirements_ModalWindow(t.programId.ml_requirements)},children:"ML"})}):(0,v.jsx)(v.Fragment,{})," ",void 0!==t.programId.rl_required&&"yes"===t.programId.rl_required?(0,v.jsx)(v.Fragment,{children:(0,v.jsx)(_.Z,{size:"sm",title:"Comments",variant:"secondary",onClick:function(){return e.openRequirements_ModalWindow(t.programId.ml_requirements)},children:"RL"})}):(0,v.jsx)(v.Fragment,{})," ",void 0!==t.programId.essay_required&&"yes"===t.programId.essay_required?(0,v.jsx)(v.Fragment,{children:(0,v.jsx)(_.Z,{size:"sm",title:"Comments",variant:"light",onClick:function(){return e.openRequirements_ModalWindow(t.programId.essay_requirements)},children:"Essay"})}):(0,v.jsx)(v.Fragment,{})]}),(0,v.jsx)(f.Z,{children:(0,v.jsxs)("p",{className:"text-light",children:["Deadline:"," ",t.programId.application_deadline?e.state.student.application_preference&&e.state.student.application_preference.expected_application_date?e.state.student.application_preference.expected_application_date+"-"+t.programId.application_deadline:t.programId.application_deadline:"-"]})}),(0,v.jsx)(f.Z,{children:(0,v.jsxs)("p",{className:"text-light",children:["Status:"," ","O"===t.closed?"Closed":"Open"]})})]}),(0,v.jsx)(R,{onDeleteFileThread:e.onDeleteFileThread,handleAsFinalFile:e.handleAsFinalFile,role:e.props.role,student:e.state.student,application:t,filetype:"ProgramSpecific",initGeneralFileThread:e.initGeneralFileThread,initProgramSpecificFileThread:e.initProgramSpecificFileThread}),(0,v.jsx)("hr",{})]}):(0,v.jsx)(v.Fragment,{})]},i)}))]})})})," ",!n&&(0,v.jsx)("div",{style:a,children:(0,v.jsx)(h.Z,{animation:"border",role:"status",children:(0,v.jsx)("span",{className:"visually-hidden"})})}),(0,v.jsxs)(g.Z,{show:this.state.deleteFileWarningModel,onHide:this.closeWarningWindow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,v.jsx)(g.Z.Header,{children:(0,v.jsx)(g.Z.Title,{id:"contained-modal-title-vcenter",children:"Warning"})}),(0,v.jsxs)(g.Z.Body,{children:["Do you want to delete ",this.state.applicationId,"?"]}),(0,v.jsxs)(g.Z.Footer,{children:[(0,v.jsx)(_.Z,{disabled:!n,onClick:this.ConfirmDeleteDiscussionThreadHandler,children:"Yes"}),(0,v.jsx)(_.Z,{onClick:this.closeWarningWindow,children:"No"}),!n&&(0,v.jsx)("div",{style:a,children:(0,v.jsx)(h.Z,{animation:"border",role:"status",children:(0,v.jsx)("span",{className:"visually-hidden"})})})]})]}),(0,v.jsxs)(g.Z,{show:this.state.SetAsFinalFileModel,onHide:this.closeSetAsFinalFileModelWindow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,v.jsx)(g.Z.Header,{children:(0,v.jsx)(g.Z.Title,{id:"contained-modal-title-vcenter",children:"Warning"})}),(0,v.jsxs)(g.Z.Body,{children:["Do you want to set ",this.state.docName," as final for student?"]}),(0,v.jsxs)(g.Z.Footer,{children:[(0,v.jsx)(_.Z,{disabled:!n,onClick:this.ConfirmSetAsFinalFileHandler,children:"Yes"}),(0,v.jsx)(_.Z,{onClick:this.closeSetAsFinalFileModelWindow,children:"No"}),!n&&(0,v.jsx)("div",{style:a,children:(0,v.jsx)(h.Z,{animation:"border",role:"status",children:(0,v.jsx)("span",{className:"visually-hidden"})})})]})]}),(0,v.jsxs)(g.Z,{show:this.state.Requirements_Modal,onHide:this.close_Requirements_ModalWindow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,v.jsx)(g.Z.Header,{children:(0,v.jsx)(g.Z.Title,{id:"contained-modal-title-vcenter",children:"Special Requirements"})}),(0,v.jsx)(g.Z.Body,{children:this.state.requirements}),(0,v.jsxs)(g.Z.Footer,{children:[(0,v.jsx)(_.Z,{onClick:this.close_Requirements_ModalWindow,children:"Close"}),!n&&(0,v.jsx)("div",{style:a,children:(0,v.jsx)(h.Z,{animation:"border",role:"status",children:(0,v.jsx)("span",{className:"visually-hidden"})})})]})]}),(0,v.jsxs)(g.Z,{show:this.state.isThreadExisted,onHide:this.closeDocExistedWindow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,v.jsx)(g.Z.Header,{children:(0,v.jsx)(g.Z.Title,{id:"contained-modal-title-vcenter",children:"Attention"})}),(0,v.jsxs)(g.Z.Body,{children:[this.state.docName," is already existed"]}),(0,v.jsx)(g.Z.Footer,{children:(0,v.jsx)(_.Z,{onClick:this.closeDocExistedWindow,children:"Close"})})]})]})}}]),i}(o.Component),N=A}}]);