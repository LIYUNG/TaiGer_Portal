"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[3942],{63942:function(e,t,s){s.r(t),s.d(t,{default:function(){return ue}});var n=s(35531),i=s(18489),a=s(27853),r=s(84531),o=s(78932),d=s(38128),l=s(47313),c=s(44030),u=s(63849),p=s(65832),h=s(93298),f=s(31616),m=s(47939),g=s(37062),_=s(54991),x=s(62396),v=s(54972),Z=s(89351),j=s(33032),y=s(23430),S=s(78994),F=s.n(S),b=s(88195),C=s.n(b),k=s(82737),w=s.n(k),D=s(67989),L=s.n(D),N=s(1693),I=s.n(N),M=s(87606),A=s.n(M),E=s(60823),H=s.n(E),T=s(37417),O=s.n(T),V=s(68234),B=s.n(V),K=s(87366),R=s.n(K),q=s(44236),P=s.n(q),U=s(19893),z=s.n(U),G=s(28668),W=s.n(G),Y=s(51426),J=s(46417),$=function(e){var t,s=(0,l.useRef)(),n=(0,l.useState)(),i=(0,y.Z)(n,2);i[0],i[1];(0,l.useEffect)((function(){return s.current||a(),function(){s.current.destroy(),s.current=null}}),[e.editorState]);var a=function(){t=new(C())({holder:"".concat(e.holder),logLevel:"ERROR",data:e.editorState,onReady:function(){s.current=t},onChange:function(){var t=(0,j.Z)(F().mark((function t(s,n){return F().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:s.saver.save().then((function(t){e.handleEditorChange(t)}));case 1:case"end":return t.stop()}}),t)})));return function(e,s){return t.apply(this,arguments)}}(),readOnly:e.readOnly,autofocus:!0,minHeight:100,tools:{header:{class:w(),config:{placeholder:"Enter a header",levels:[2,3,4,5,6],defaultLevel:3},inlineToolbar:!0},list:{class:L(),inlineToolbar:!0},Marker:{class:z(),config:{colorCollections:["#000000","#FF0000","#00FF00","#0000FF","#999999","#00FFFF","#FF00FF","#800080","#FFF"],defaultColor:"#FFF",type:"marker"}},underline:P(),code:R(),table:{class:H(),inlineToolbar:!0,config:{rows:2,cols:3}},Color:{class:z(),config:{colorCollections:["#000000","#FF0000","#00FF00","#0000FF","#999999","#00FFFF","#FF00FF","#800080","#FFF"],type:"text"}},textAlign:W(),image:{class:A(),config:{uploader:{uploadByFile:function(t){return(0,j.Z)(F().mark((function s(){var n,i;return F().wrap((function(s){for(;;)switch(s.prev=s.next){case 0:if((n=new FormData).append("file",t),!e.thread){s.next=8;break}return s.next=5,(0,Y.cE)(e.thread._id.toString(),e.thread.student_id._id.toString(),n);case 5:i=s.sent,s.next=11;break;case 8:return s.next=10,(0,Y.Ix)(n);case 10:i=s.sent;case 11:return s.abrupt("return",{success:1,file:{url:i.data.data}});case 12:case"end":return s.stop()}}),s)})))()},uploadByUrl:function(e){return(0,j.Z)(F().mark((function t(){return F().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.abrupt("return",{success:1,file:{url:e}});case 1:case"end":return t.stop()}}),t)})))()}}}},elimiter:B(),embed:{class:I(),inlineToolbar:!1,config:{services:{youtube:!0,coub:!0}}},inlineCode:{class:O()}}})};return(0,J.jsx)(l.Fragment,{children:(0,J.jsx)("div",{id:"".concat(e.holder)})})},X=s(44416),Q=s(51767),ee=s(17947),te=function(e){(0,o.Z)(s,e);var t=(0,d.Z)(s);function s(){var e;(0,a.Z)(this,s);for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return(e=t.call.apply(t,[this].concat(i))).state={editorState:null,ConvertedContent:"",message_id:"",isLoaded:!1,deleteMessageModalShow:!1},e.onOpendeleteMessageModalShow=function(t,s,n){e.setState({message_id:s,deleteMessageModalShow:!0,createdAt:n})},e.onHidedeleteMessageModalShow=function(t){e.setState({message_id:"",createdAt:"",deleteMessageModalShow:!1})},e.onDeleteSingleMessage=function(t){t.preventDefault(),e.props.onDeleteSingleMessage(t,e.state.message_id)},e}return(0,r.Z)(s,[{key:"componentDidMount",value:function(){var e=this,t=null;if(this.props.message.message&&"{}"!==this.props.message.message)try{t=JSON.parse(this.props.message.message)}catch(s){t={time:new Date,blocks:[]}}else t={time:new Date,blocks:[]};this.setState((function(s){return(0,i.Z)((0,i.Z)({},s),{},{editorState:t,ConvertedContent:t,isLoaded:e.props.isLoaded})}))}},{key:"render",value:function(){var e=this;if(!this.state.isLoaded&&!this.state.editorState)return(0,J.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,J.jsx)(c.Z,{animation:"border",role:"status",children:(0,J.jsx)("span",{className:"visually-hidden"})})});var t=this.props.message.user_id?this.props.message.user_id.firstname:"Staff",s=this.props.message.user_id?this.props.message.user_id.lastname:"TaiGer",n=!!this.props.message.user_id&&this.props.message.user_id._id.toString()===this.props.user._id.toString(),a="".concat(t," ").concat(s),r=this.props.message.file.map((function(t,s){return(0,J.jsx)(p.Z,{className:"my-0 mx-0",children:(0,J.jsx)(p.Z.Body,{children:(0,J.jsxs)(u.Z,{children:[(0,J.jsx)(f.Z,{md:1,style:{height:"15%",width:"15%"},children:(0,J.jsx)("span",{children:(0,J.jsx)("a",{href:"".concat(Z._,"/api/document-threads/").concat(e.props.documentsthreadId,"/").concat(e.props.message._id.toString(),"/").concat(t.path.replace(/\\/g,"/").split("/")[2]),target:"_blank",children:(0,J.jsx)(X.a,(0,i.Z)({extension:t.name.split(".").pop()},X.j[t.name.split(".").pop()]))})})}),(0,J.jsx)(f.Z,{className:"my-4",style:{height:"15%"},children:(0,J.jsx)("a",{href:"".concat(Z._,"/api/document-threads/").concat(e.props.documentsthreadId,"/").concat(e.props.message._id.toString(),"/").concat(t.path.replace(/\\/g,"/").split("/")[2]),target:"_blank",children:t.name})})]})})},s)}));return(0,J.jsxs)(J.Fragment,{children:[(0,J.jsxs)(p.Z,{border:"primary",className:"mb-2 mx-0",children:[(0,J.jsx)(p.Z.Header,{as:"h5","aria-controls":"accordion"+this.props.idx,"aria-expanded":this.props.accordionKeys[this.props.idx]===this.props.idx,className:"ps-2 py-2 pe-0 ",children:(0,J.jsxs)(u.Z,{className:"my-0",children:[(0,J.jsx)(f.Z,{md:1,className:"px-1  pe-0 ",style:{height:"10%",width:"10%"},onClick:function(){return e.props.singleExpandtHandler(e.props.idx)},children:(0,J.jsx)(ee.Z,(0,i.Z)({},(0,Q.GZ)(a)))}),(0,J.jsx)(f.Z,{className:"ps-2 mx-2 mt-2",children:(0,J.jsxs)("p",{children:[(0,J.jsx)("b",{style:{cursor:"pointer"},className:"ps-0 my-1",onClick:function(){return e.props.singleExpandtHandler(e.props.idx)},children:a}),(0,J.jsxs)("span",{style:{float:"right"},children:[(0,Q.Ny)(this.props.message.createdAt),n&&(0,J.jsx)(v.tgW,{className:"mx-0",color:"red",title:"Delete this message and file",size:20,onClick:function(t){return e.onOpendeleteMessageModalShow(t,e.props.message._id.toString(),e.props.message.createdAt)},style:{cursor:"pointer"}})]})]})})]})}),(0,J.jsx)(x.Z,{in:this.props.accordionKeys[this.props.idx]===this.props.idx,children:(0,J.jsxs)(p.Z.Body,{children:[(0,J.jsx)($,{holder:"".concat(this.props.message._id.toString()),readOnly:!0,handleClickSave:this.props.handleClickSave,handleClickCancel:this.props.handleClickCancel,editorState:this.state.editorState}),r]})})]}),(0,J.jsxs)(m.Z,{show:this.state.deleteMessageModalShow,onHide:this.onHidedeleteMessageModalShow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,J.jsx)(m.Z.Header,{children:(0,J.jsx)(m.Z.Title,{id:"contained-modal-title-vcenter",children:"Warning"})}),(0,J.jsxs)(m.Z.Body,{children:["Do you wan to delete this message on"," ",(0,J.jsxs)("b",{children:[(0,Q.Ny)(this.state.createdAt),"?"]})]}),(0,J.jsxs)(m.Z.Footer,{children:[(0,J.jsx)(h.Z,{disabled:!this.props.isLoaded,variant:"danger",onClick:this.onDeleteSingleMessage,children:this.props.isLoaded?"Delete":"Pending"}),(0,J.jsx)(h.Z,{onClick:this.onHidedeleteMessageModalShow,children:"Cancel"})]})]})]})}}]),s}(l.Component),se=te,ne=function(e){(0,o.Z)(s,e);var t=(0,d.Z)(s);function s(){return(0,a.Z)(this,s),t.apply(this,arguments)}return(0,r.Z)(s,[{key:"render",value:function(){var e=this,t=this.props.thread.messages.map((function(t,s){return(0,J.jsx)(se,{documentsthreadId:e.props.documentsthreadId,accordionKeys:e.props.accordionKeys,singleExpandtHandler:e.props.singleExpandtHandler,id:t._id,idx:s,message:t,onTrashClick:e.props.onTrashClick,lastupdate:e.props.lastupdate,isLoaded:e.props.isLoaded,user:e.props.user,onDeleteSingleMessage:e.props.onDeleteSingleMessage},s)}));return(0,J.jsx)(J.Fragment,{children:t})}}]),s}(l.Component),ie=ne,ae=s(67203);var re=function(e){var t=(0,l.useState)({editorState:e.editorState}),s=(0,y.Z)(t,2),n=s[0],a=s[1];return(0,l.useEffect)((function(){a((function(t){return(0,i.Z)((0,i.Z)({},t),{},{editorState:e.editorState})}))}),[e.editorState]),(0,J.jsxs)(J.Fragment,{children:[(0,J.jsx)(u.Z,{style:{textDecoration:"none"},children:(0,J.jsx)(f.Z,{className:"my-0 mx-0",children:(0,J.jsx)($,{holder:"editorjs",thread:e.thread,readOnly:!1,handleEditorChange:function(e){a((function(t){return(0,i.Z)((0,i.Z)({},t),{},{editorState:e})}))},handleClickSave:e.handleClickSave,editorState:e.editorState,setStatedata:a})})}),(0,J.jsxs)(u.Z,{children:[(0,J.jsx)(f.Z,{md:8,children:(0,J.jsx)(ae.Z.Group,{controlId:"formFile",className:"mb-2",children:(0,J.jsx)(ae.Z.Control,{type:"file",onChange:function(t){return e.onFileChange(t)}})})}),(0,J.jsx)(f.Z,{className:"mt-2",md:4,children:"(max. 2MB)"})]}),(0,J.jsx)(u.Z,{children:(0,J.jsx)(f.Z,{className:"my-0 mx-0",children:(0,J.jsx)(h.Z,{disabled:!n.editorState.blocks||0===n.editorState.blocks.length||e.buttonDisabled,onClick:function(t){return e.handleClickSave(t,n.editorState)},children:"Save"})})})]})},oe=s(82423),de=s(20688),le=s(83708),ce=function(e){(0,o.Z)(s,e);var t=(0,d.Z)(s);function s(){var e;(0,a.Z)(this,s);for(var r=arguments.length,o=new Array(r),d=0;d<r;d++)o[d]=arguments[d];return(e=t.call.apply(t,[this].concat(o))).state={error:null,timeouterror:null,unauthorizederror:null,pagenotfounderror:null,file:null,isLoaded:!1,isSubmissionLoaded:!0,articles:[],isEdit:!1,thread:null,editFormOpen:!1,defaultStep:1,buttonDisabled:!1,editorState:{},expand:!0,SetAsFinalFileModel:!1,accordionKeys:[0],res_status:0,res_modal_status:0,res_modal_message:""},e.closeSetAsFinalFileModelWindow=function(){e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{SetAsFinalFileModel:!1})}))},e.onFileChange=function(t){t.preventDefault(),e.setState({file:t.target.files[0]})},e.handleEditorChange=function(t){e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{editorState:t})}))},e.onDownloadTemplate=function(e,t){e.preventDefault(),(0,Y.Bl)(t).then((function(e){var t=e.headers["content-disposition"].split('"')[1],s=e.data;if(0!==s.size){var n=t.split(".");if("pdf"===(n=n.pop())){var i=window.URL.createObjectURL(new Blob([s],{type:"application/pdf"}));window.open(i,"_blank").document.title=t}else{var a=window.URL.createObjectURL(new Blob([s])),r=document.createElement("a");r.href=a,r.setAttribute("download",t),document.body.appendChild(r),r.click(),r.parentNode.removeChild(r)}}}),(function(e){alert("The file is not available.")}))},e.handleTrashClick=function(t){e.deleteArticle(t)},e.ConfirmError=function(){e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{res_modal_status:0,res_modal_message:""})}))},e.deleteArticle=function(t){e.setState({articles:e.state.articles.filter((function(e){return e._id!==t}))}),(0,Y.oe)(t).then((function(t){var s=t.data.success,n=t.status;s||e.setState({isLoaded:!0,res_modal_status:n})}),(function(t){e.setState({isLoaded:!1,error:t})}))},e.singleExpandtHandler=function(t){var s=(0,n.Z)(e.state.accordionKeys);s[t]=s[t]!==t?t:-1,e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{accordionKeys:s})}))},e.AllCollapsetHandler=function(){e.setState((function(t){return(0,i.Z)((0,i.Z)({},t),{},{expand:!1,accordionKeys:new Array(e.state.thread.messages.length).fill().map((function(e,t){return-1}))})}))},e.AllExpandtHandler=function(){e.setState((function(t){return(0,i.Z)((0,i.Z)({},t),{},{expand:!0,accordionKeys:new Array(e.state.thread.messages.length).fill().map((function(e,t){return t}))})}))},e.getRequirement=function(t){return t.file_type.includes("Essay")?"yes"===t.program_id.essay_required?(0,J.jsx)("p",{children:e.state.thread.program_id.essay_requirements?e.state.thread.program_id.essay_requirements:"No"}):(0,J.jsx)("p",{children:"No"}):t.file_type.includes("ML")?"yes"===t.program_id.ml_required?(0,J.jsx)("p",{children:e.state.thread.program_id.ml_requirements?e.state.thread.program_id.ml_requirements:"No"}):(0,J.jsx)("p",{children:"No"}):t.file_type.includes("RL")?"yes"===t.program_id.rl_required?(0,J.jsx)("p",{children:e.state.thread.program_id.rl_requirements?e.state.thread.program_id.rl_requirements:"No"}):(0,J.jsx)("p",{children:"No"}):void 0},e.handleClickSave=function(t,s){t.preventDefault(),e.setState({buttonDisabled:!0});var a=JSON.stringify(s),r=new FormData;r.append("file",e.state.file),r.append("message",a),(0,Y.me)(e.state.documentsthreadId,e.state.thread.student_id._id,r).then((function(t){var s=t.data,i=s.success,a=s.data,r=t.status;if(i)e.setState({success:i,file:null,editorState:{},thread:a,isLoaded:!0,buttonDisabled:!1,accordionKeys:[].concat((0,n.Z)(e.state.accordionKeys),[a.messages.length-1]),res_modal_status:r});else{var o=t.data.message;e.setState({isLoaded:!0,buttonDisabled:!1,res_modal_message:o,res_modal_status:r})}}),(function(t){e.setState({error:t})})),e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{in_edit_mode:!1})}))},e.handleAsFinalFile=function(t,s,n){e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{doc_thread_id:t,student_id:s,program_id:n,SetAsFinalFileModel:!0})}))},e.ConfirmSetAsFinalFileHandler=function(t){t.preventDefault(),e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{isSubmissionLoaded:!1})}));var s=e.state.program_id?e.state.program_id._id.toString():void 0;(0,Y.lk)(e.state.doc_thread_id,e.state.student_id,s).then((function(t){var s=t.data,n=s.data,a=s.success,r=t.status;if(a)e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{isSubmissionLoaded:!0,thread:(0,i.Z)((0,i.Z)({},e.thread),{},{isFinalVersion:n.isFinalVersion,updatedAt:n.updatedAt}),success:a,SetAsFinalFileModel:!1,res_modal_status:r})}));else{var o=t.data.message;e.setState({isLoaded:!0,isSubmissionLoaded:!0,res_modal_message:o,res_modal_status:r})}}),(function(t){e.setState({error:t})}))},e.onDeleteSingleMessage=function(t,s){t.preventDefault(),e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{isLoaded:!1})})),(0,Y.vL)(e.state.documentsthreadId,s).then((function(t){var a=t.data.success,r=t.status;if(a){var o=(0,n.Z)(e.state.thread.messages),d=e.state.thread.messages.findIndex((function(e){return e._id.toString()===s}));-1!==d&&o.splice(d,1),e.setState((function(t){return(0,i.Z)((0,i.Z)({},t),{},{success:a,isLoaded:!0,thread:(0,i.Z)((0,i.Z)({},e.state.thread),{},{messages:o}),buttonDisabled:!1,res_modal_status:r})}))}else{var l=t.data.message;e.setState({isLoaded:!0,buttonDisabled:!1,res_modal_message:l,res_modal_status:r})}}),(function(t){e.setState({error:t})})),e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{in_edit_mode:!1})}))},e}return(0,r.Z)(s,[{key:"componentDidMount",value:function(){var e=this;(0,Y.vn)(this.props.match.params.documentsthreadId).then((function(t){var s=t.data,n=s.success,i=s.data,a=t.status;n?e.setState({success:n,thread:i,isLoaded:!0,documentsthreadId:e.props.match.params.documentsthreadId,file:null,accordionKeys:new Array(i.messages.length).fill().map((function(e,t){return t===i.messages.length-1?t:-1})),res_status:a}):e.setState({isLoaded:!0,res_status:a})}),(function(t){e.setState({isLoaded:!1,error:t})}))}},{key:"render",value:function(){var e=this,t=this.state,s=t.isLoaded,n=t.isSubmissionLoaded,i=t.res_status,a=t.res_modal_status,r=t.res_modal_message;if(!s&&!this.state.thread)return(0,J.jsx)("div",{style:Q.nT,children:(0,J.jsx)(c.Z,{animation:"border",role:"status",children:(0,J.jsx)("span",{className:"visually-hidden"})})});if(i>=400)return(0,J.jsx)(oe.Z,{res_status:i});var o,d=window.templatelist.find((function(t){return t.prop.includes(e.state.thread.file_type.split("_")[0])}));return o=this.state.thread.program_id?this.state.thread.student_id.firstname+" "+this.state.thread.student_id.lastname+" - "+this.state.thread.program_id.school+" "+this.state.thread.program_id.program_name+" "+this.state.thread.file_type:this.state.thread.student_id.firstname+" "+this.state.thread.student_id.lastname+" - "+this.state.thread.file_type,(0,J.jsxs)(_.Z,{children:[!s&&(0,J.jsx)("div",{style:Q.nT,children:(0,J.jsx)(c.Z,{animation:"border",role:"status",children:(0,J.jsx)("span",{className:"visually-hidden"})})}),(0,J.jsx)(u.Z,{children:(0,J.jsx)(p.Z,{className:"mb-2 mx-0",children:(0,J.jsx)(p.Z.Header,{children:(0,J.jsxs)(p.Z.Title,{as:"h5",children:[o," Discussion thread","   ",this.state.expand?(0,J.jsx)(h.Z,{className:"btn-sm float-right",onClick:function(){return e.AllCollapsetHandler()},children:"Collaspse"}):(0,J.jsx)(h.Z,{className:"btn-sm float-right",onClick:function(){return e.AllExpandtHandler()},children:"Expand"})]})})})}),this.state.thread.isFinalVersion&&(0,J.jsx)(u.Z,{className:"sticky-top",children:(0,J.jsx)(p.Z,{className:"mb-2 mx-0",bg:"success",text:"white",children:(0,J.jsx)(p.Z.Header,{children:(0,J.jsxs)(p.Z.Title,{as:"h5",className:"text-light",children:["Status: ",(0,J.jsx)("b",{children:"Close"})]})})})}),(0,J.jsx)(u.Z,{children:(0,J.jsx)(p.Z,{className:"mb-2 mx-0",children:(0,J.jsxs)(p.Z.Body,{children:[(0,J.jsxs)(f.Z,{children:[(0,J.jsx)("h5",{children:"Instruction"}),(0,J.jsx)("p",{children:"Please fill our TaiGer template and attach the filled template in this discussion."}),(0,J.jsxs)("p",{children:["Download template:"," ",d?(0,J.jsx)("b",{style:{cursor:"pointer"},onClick:function(t){return e.onDownloadTemplate(t,d.prop)},children:"Link"}):(0,J.jsx)(J.Fragment,{children:"Not available"})]})]}),(0,J.jsxs)(f.Z,{children:[(0,J.jsxs)("h6",{children:[(0,J.jsx)("b",{children:"Requirements:"}),("Agent"===this.props.user.role||"Admin"===this.props.user.role)&&this.state.thread.program_id&&(0,J.jsxs)(g.Z,{to:"/programs/".concat(this.state.thread.program_id._id.toString()),target:"_blank",children:[" ","[Update]"]})]}),this.state.thread.program_id?(0,J.jsx)(J.Fragment,{children:this.getRequirement(this.state.thread)}):(0,J.jsx)(J.Fragment,{children:(0,J.jsx)("p",{children:"No"})}),(0,J.jsxs)("h6",{children:[(0,J.jsx)("b",{children:"Deadline"}),("Agent"===this.props.user.role||"Admin"===this.props.user.role)&&this.state.thread.program_id&&(0,J.jsxs)(g.Z,{to:"/programs/".concat(this.state.thread.program_id._id.toString()),target:"_blank",children:[" ","[Update]"]})]}),this.state.thread.program_id&&(0,J.jsxs)("h6",{children:[this.state.thread.student_id.application_preference&&this.state.thread.student_id.application_preference.expected_application_date?this.state.thread.student_id.application_preference.expected_application_date+"-":"",this.state.thread.program_id.application_deadline]})]})]})})}),(0,J.jsx)(u.Z,{children:(0,J.jsx)(ie,{documentsthreadId:this.state.documentsthreadId,accordionKeys:this.state.accordionKeys,singleExpandtHandler:this.singleExpandtHandler,thread:this.state.thread,onTrashClick:this.handleTrashClick,isLoaded:this.state.isLoaded,user:this.props.user,onDeleteSingleMessage:this.onDeleteSingleMessage})}),!0!==this.props.user.archiv?(0,J.jsx)(u.Z,{children:(0,J.jsxs)(p.Z,{className:"my-0 mx-0",children:[(0,J.jsx)(p.Z.Header,{children:(0,J.jsxs)(p.Z.Title,{as:"h5",children:[this.props.user.firstname," ",this.props.user.lastname]})}),(0,J.jsx)(p.Z.Body,{children:this.state.thread.isFinalVersion?(0,J.jsx)(u.Z,{style:{textDecoration:"none"},children:(0,J.jsx)(f.Z,{className:"my-0 mx-0",children:"This discussion thread is close."})}):(0,J.jsx)(u.Z,{style:{textDecoration:"none"},children:(0,J.jsx)(f.Z,{className:"my-0 mx-0",children:(0,J.jsx)(re,{thread:this.state.thread,buttonDisabled:this.state.buttonDisabled,doc_title:"this.state.doc_title",editorState:this.state.editorState,handleClickSave:this.handleClickSave,file:this.state.file,onFileChange:this.onFileChange})})})})]})}):(0,J.jsx)(u.Z,{children:(0,J.jsx)(p.Z,{className:"my-0 mx-0",children:(0,J.jsx)(p.Z.Body,{children:(0,J.jsx)(u.Z,{style:{textDecoration:"none"},children:(0,J.jsx)(f.Z,{className:"my-0 mx-0",children:"You service is finished. Therefore, you are in read only mode."})})})})}),("Editor"===this.props.user.role||"Agent"===this.props.user.role||"Admin"===this.props.user.role)&&(this.state.thread.isFinalVersion?(0,J.jsx)(u.Z,{className:"mt-2",children:(0,le.je)(this.props.user,this.state.thread.student_id._id)&&(0,J.jsx)(h.Z,{variant:"danger",onClick:function(t){return e.handleAsFinalFile(e.state.thread._id,e.state.thread.student_id._id,e.state.thread.program_id,e.state.thread.isFinalVersion)},children:n?"Mark as open":(0,J.jsx)(c.Z,{animation:"border",role:"status",size:"sm",children:(0,J.jsx)("span",{className:"visually-hidden"})})})}):(0,J.jsx)(u.Z,{className:"mt-2",children:(0,le.je)(this.props.user,this.state.thread.student_id._id)&&(0,J.jsx)(h.Z,{variant:"success",onClick:function(t){return e.handleAsFinalFile(e.state.thread._id,e.state.thread.student_id._id,e.state.thread.program_id,e.state.thread.isFinalVersion)},children:n?"Mark as finished":(0,J.jsx)(c.Z,{animation:"border",role:"status",size:"sm",children:(0,J.jsx)("span",{className:"visually-hidden"})})})})),(0,J.jsxs)(m.Z,{show:this.state.SetAsFinalFileModel,onHide:this.closeSetAsFinalFileModelWindow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,J.jsx)(m.Z.Header,{children:(0,J.jsx)(m.Z.Title,{id:"contained-modal-title-vcenter",children:"Warning"})}),(0,J.jsxs)(m.Z.Body,{children:["Do you want to set ",o," as"," ",this.state.thread.isFinalVersion?"open":"final","?"]}),(0,J.jsxs)(m.Z.Footer,{children:[(0,J.jsx)(h.Z,{disabled:!s||!n,onClick:function(t){return e.ConfirmSetAsFinalFileHandler(t)},children:n?"Yes":(0,J.jsx)(c.Z,{animation:"border",role:"status",size:"sm",children:(0,J.jsx)("span",{className:"visually-hidden"})})}),(0,J.jsx)(h.Z,{onClick:this.closeSetAsFinalFileModelWindow,children:"No"})]})]}),a>=400&&(0,J.jsx)(de.Z,{ConfirmError:this.ConfirmError,res_modal_status:a,res_modal_message:r})]})}}]),s}(l.Component),ue=ce},83708:function(e,t,s){s.d(t,{A$:function(){return b},EL:function(){return a},En:function(){return w},H6:function(){return Z},HU:function(){return u},S:function(){return r},_$:function(){return S},_D:function(){return o},aH:function(){return f},aT:function(){return y},bX:function(){return C},c9:function(){return D},d0:function(){return L},dJ:function(){return h},dh:function(){return i},el:function(){return _},je:function(){return n},kF:function(){return k},pM:function(){return l},qz:function(){return p},sc:function(){return v},ti:function(){return c},x8:function(){return d},y2:function(){return g},y3:function(){return F},yd:function(){return x},ye:function(){return j},ys:function(){return m}});var n=function(e,t){return"Admin"===e.role||"Student"===e.role||"Guest"===e.role||!(!e.students||-1===e.students.findIndex((function(e){return e._id.toString()===t})))},i=function(e){return!(!e||!e.language)&&"O"===e.language.english_isPassed},a=function(e){return!(!e||!e.language)&&"O"===e.language.german_isPassed},r=function(e){return!(!e||!e.language)&&!(!e.language||!(e.language.english_isPassed&&"-"!==e.language.english_isPassed||e.language.german_isPassed&&"-"!==e.language.german_isPassed))},o=function(e){return!(!e||!e.university)&&!!(e.university.attended_high_school&&e.university.high_school_isGraduated&&"-"!==e.university.high_school_isGraduated&&e.university.attended_university&&e.university.attended_university_program)},d=function(e,t){if("O"===t.closed)return"CLOSE";if(!t.programId.application_deadline)return"No Data";if(t.programId.application_deadline.includes("olling"))return"Rolling";var s="<TBD>";if(e.application_preference&&""!==e.application_preference.expected_application_date&&(s=parseInt(e.application_preference.expected_application_date)),!t.programId.application_deadline)return"".concat(s,"-<TBD>");var n=t.programId.semester,i=parseInt(t.programId.application_deadline.split("-")[0]),a=parseInt(t.programId.application_deadline.split("-")[1]);return void 0===n?"Err":("WS"===n&&i>9&&(s-=1),"SS"===n&&i>3&&(s-=1),"".concat(s,"-").concat(i,"-").concat(a))},l=function(e){return!!e&&!(!e.expected_application_date||!e.expected_application_semester)},c=function(e){for(var t=0;t<e.length;t+=1)if(void 0===e[t].agents||0===e[t].agents.length)return!1;return!0},u=function(e){for(var t=0;t<e.length;t+=1)if(void 0===e[t].editors||0===e[t].editors.length)return!1;return!0},p=function(e){if(!e.applications)return!1;if(0===e.applications.length)return!1;for(var t=0;t<e.applications.length;t+=1)if(!e.applications[t].decided||void 0!==e.applications[t].decided&&"-"===e.applications[t].decided)return!1;return!0},h=function(e){if(!e.applications)return!0;if(0===e.applications.length)return!0;for(var t=0;t<e.applications.length;t+=1)if(!e.applications[t].decided||void 0!==e.applications[t].decided&&"-"===e.applications[t].decided)return!1;return!0},f=function(e){return 0===e.applying_program_count||void 0===e.applying_program_count},m=function(e){for(var t=0;t<e.length;t+=1)if(e[t].applications.length<e[t].applying_program_count)return!0;return!1},g=function(e){return void 0===e.applications?0:e.applications.filter((function(e){return"O"===e.decided})).length},_=function(e){return void 0===e.applications?0:e.applications.filter((function(e){return"O"===e.closed})).length},x=function(e){if(void 0===e.applications)return!1;if(0===e.applying_program_count)return!1;if(e.applications.length<e.applying_program_count)return!1;if(!e.applications||0===e.applications.length)return!1;for(var t=0;t<e.applications.length;t+=1)if(!e.applications[t].decided||void 0!==e.applications[t].decided&&"O"!==e.applications[t].decided)return!1;return!0},v=function(e,t){if(void 0===t.applications)return!1;if(0===t.applications.length)return!1;for(var s=0;s<e.length;s+=1)for(var n=0;n<t.applications.length;n+=1)if(!t.applications[n].closed||void 0!==t.applications[n].closed&&"O"!==t.applications[n].closed)return!1;return!0},Z=function(e){return!!e.programId.uni_assist&&!!e.programId.uni_assist.includes("Yes")},j=function(e){if(void 0===e.applications)return!1;for(var t=0;t<e.applications.length;t+=1)if("O"===e.applications[t].decided&&e.applications[t].programId.uni_assist&&(e.applications[t].programId.uni_assist.includes("VPD")||e.applications[t].programId.uni_assist.includes("FULL")))return!0;return!1},y=function(e){var t=0;if(void 0===e.applications)return t;for(var s=0;s<e.applications.length;s+=1)if("O"===e.applications[s].decided&&e.applications[s].programId.uni_assist&&(e.applications[s].programId.uni_assist.includes("VPD")||e.applications[s].programId.uni_assist.includes("FULL"))){if(!e.applications[s].uni_assist)continue;if(e.applications[s].uni_assist&&"notneeded"===e.applications[s].uni_assist.status)continue;!e.applications[s].uni_assist||"uploaded"!==e.applications[s].uni_assist.status&&""===e.applications[s].uni_assist.vpd_file_path&&null!==e.applications[s].uni_assist.vpd_file_path||(t+=1)}return t},S=function(e){var t=0;if(void 0===e.applications)return t;for(var s=0;s<e.applications.length;s+=1)if("O"===e.applications[s].decided&&e.applications[s].programId.uni_assist&&(e.applications[s].programId.uni_assist.includes("VPD")||e.applications[s].programId.uni_assist.includes("FULL"))){if(!e.applications[s].uni_assist)continue;if(e.applications[s].uni_assist&&"notneeded"===e.applications[s].uni_assist.status)continue;t+=1}return t},F=function(e){for(var t=0;t<e.doc_modification_thread.length;t+=1)if(!e.doc_modification_thread[t].isFinalVersion)return!1;return!0},b=function(e){return!!e.generaldocs_threads&&-1!==e.generaldocs_threads.findIndex((function(e){return"CV"===e.doc_thread_id.file_type}))},C=function(e){return!!e.generaldocs_threads&&(-1!==e.generaldocs_threads.findIndex((function(e){return"CV"===e.doc_thread_id.file_type}))&&!!e.generaldocs_threads.find((function(e){return"CV"===e.doc_thread_id.file_type})).isFinalVersion)},k=function(e){for(var t=0;t<e.doc_modification_thread.length;t+=1)if(!e.doc_modification_thread[t].isFinalVersion)return!1;return!(e.programId.uni_assist&&e.programId.uni_assist.includes("Yes")&&(!e.uni_assist||"uploaded"!==e.uni_assist.status))},w=function(e){return"O"===e.closed},D=function(e){if(void 0===e.applications)return!1;for(var t=0;t<e.applications.length;t+=1)if("O"===e.applications[t].decided&&e.applications[t].programId.uni_assist&&(e.applications[t].programId.uni_assist.includes("VPD")||e.applications[t].programId.uni_assist.includes("FULL"))){if(!e.applications[t].uni_assist)return!1;if(e.applications[t].uni_assist&&"notneeded"===e.applications[t].uni_assist.status)continue;if(e.applications[t].uni_assist&&("uploaded"!==e.applications[t].uni_assist.status||""===e.applications[t].uni_assist.vpd_file_path))return!1}return!0},L=function(e){return-1===e.generaldocs_threads.findIndex((function(e){return"CV"===e.doc_thread_id.file_type}))}}}]);