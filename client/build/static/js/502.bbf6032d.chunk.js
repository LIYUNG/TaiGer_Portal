"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[502],{84637:function(e,t,n){n.r(t);var s=n(18489),i=n(35531),r=n(27853),o=n(84531),a=n(78932),l=n(38128),d=n(47313),c=n(44030),u=n(63849),h=n(31616),p=n(65832),f=n(93298),Z=n(67203),x=n(47939),m=n(94395),_=n(54991),v=n(26454),j=n(31974),S=(n(94611),n(86450),n(29021),n(51767)),y=n(66417),C=n(51426),D=n(46417),g=function(e){(0,a.Z)(n,e);var t=(0,l.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var o=arguments.length,a=new Array(o),l=0;l<o;l++)a[l]=arguments[l];return(e=t.call.apply(t,[this].concat(a))).state={error:null,isLoaded:!1,data:null,success:!1,documentlists:[],doc_id_toBeDelete:"",doc_title_toBeDelete:"",doc_title:"",category:"",SetDeleteDocModel:!1,isEdit:!1,expand:!0,editorState:"",accordionKeys:!Object.keys(window.checklist)||"Editor"!==e.props.user.role&&"Agent"!==e.props.user.role?[0]:new Array(Object.keys(window.checklist).length).fill().map((function(e,t){return t})),res_status:0},e.singleExpandtHandler=function(t){var n=(0,i.Z)(e.state.accordionKeys);n[t]=n[t]!==t?t:-1,e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{accordionKeys:n})}))},e.AllCollapsetHandler=function(){var t=Object.keys(window.checklist);e.setState((function(n){return(0,s.Z)((0,s.Z)({},n),{},{expand:!1,accordionKeys:!t||"Editor"!==e.props.user.role&&"Agent"!==e.props.user.role?[-1]:new Array(t.length).fill().map((function(e,t){return-1}))})}))},e.AllExpandtHandler=function(){var t=Object.keys(window.checklist);e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{expand:!0,accordionKeys:t&&new Array(t.length).fill().map((function(e,t){return t}))})}))},e.handleChange_doc_title=function(t){var n=t.target.value;e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{doc_title:n})}))},e.handleClick=function(){e.setState((function(t){return(0,s.Z)((0,s.Z)({},t),{},{isEdit:!e.state.isEdit})}))},e.handleClickAdd=function(e){e.preventDefault()},e.handleChange_category=function(t){t.preventDefault();var n=t.target.value;e.setState({category:n})},e.handleDeleteDoc=function(t){(0,C.V0)(e.state.doc_id_toBeDelete).then((function(t){var n=t.data.success,s=t.status;if(n){var r=(0,i.Z)(e.state.documentlists),o=r.findIndex((function(t){return t._id.toString()===e.state.doc_id_toBeDelete}));o>-1&&r.splice(o,1),e.setState({success:n,documentlists:r,SetDeleteDocModel:!1,isEdit:!1,isLoaded:!0,res_status:s})}else e.setState({isLoaded:!0,res_status:s})}),(function(t){e.setState({error:t})}))},e.openDeleteDocModalWindow=function(t){e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{doc_id_toBeDelete:t._id,doc_title_toBeDelete:t.title,SetDeleteDocModel:!0})}))},e.closeDeleteDocModalWindow=function(t){e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{SetDeleteDocModel:!1})}))},e.handleClickCancel=function(t){e.setState((function(t){return(0,s.Z)((0,s.Z)({},t),{},{isEdit:!e.state.isEdit})}))},e.handleClickSave=function(t,n){t.preventDefault();var r=JSON.stringify(n),o={title:e.state.doc_title,category:e.state.category,prop:e.props.item,text:r};(0,C.p8)(o).then((function(t){var n=t.data,s=n.success,r=n.data,o=t.status;if(s){var a=(0,i.Z)(e.state.documentlists);a.push(r),e.setState({success:s,documentlists:a,editorState:"",isEdit:!e.state.isEdit,isLoaded:!0,res_status:o})}else e.setState({isLoaded:!0,res_status:o})}),(function(t){e.setState({error:t})})),e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{in_edit_mode:!1})}))},e}return(0,o.Z)(n,[{key:"componentDidMount",value:function(){var e=this;(0,C.kB)().then((function(t){var n=t.data,s=n.data,i=n.success,r=t.status;i?e.setState({isLoaded:!0,documentlists:s,success:i,res_status:r}):e.setState({isLoaded:!0,res_status:r})}),(function(t){e.setState({isLoaded:!0,error:!0})}))}},{key:"render",value:function(){var e=this;if("Admin"!==this.props.user.role&&"Editor"!==this.props.user.role&&"Agent"!==this.props.user.role)return(0,D.jsx)(m.Z,{to:"/dashboard/default"});var t=this.state,n=t.res_status,s=t.isLoaded;if(!s)return(0,D.jsx)("div",{style:S.nT,children:(0,D.jsx)(c.Z,{animation:"border",role:"status",children:(0,D.jsx)("span",{className:"visually-hidden"})})});if(n>=400)return(0,D.jsx)(y.Z,{res_status:n});var i=Object.keys(window.documentlist),r=function(t){var n={};return n["".concat(t)]=e.state.documentlists.filter((function(e){return e.category===t})),n["".concat(t)].map((function(t,n){return(0,D.jsx)(v.Z,{idx:n,path:"/docs/search",document:t,role:e.props.user.role,openDeleteDocModalWindow:e.openDeleteDocModalWindow},n)}))};return(0,D.jsxs)(_.Z,{children:[(0,D.jsx)(u.Z,{className:"sticky-top ",children:(0,D.jsx)(h.Z,{children:(0,D.jsx)(p.Z,{className:"mb-2 mx-0",bg:"dark",text:"light",children:(0,D.jsx)(p.Z.Header,{text:"dark",children:(0,D.jsx)(p.Z.Title,{children:(0,D.jsxs)(u.Z,{children:[(0,D.jsx)(h.Z,{className:"my-0 mx-0 text-light",children:"All Documentations"}),(0,D.jsx)(h.Z,{md:{span:2,offset:0},children:this.state.expand?(0,D.jsx)(f.Z,{size:"sm",onClick:function(){return e.AllCollapsetHandler()},children:"Collaspse"}):(0,D.jsx)(f.Z,{size:"sm",onClick:function(){return e.AllExpandtHandler()},children:"Expand"})})]})})})})})}),(0,D.jsx)(u.Z,{children:(0,D.jsx)(h.Z,{sm:12,children:(0,D.jsx)(p.Z,{className:"mb-2 mx-0",children:this.state.isEdit?(0,D.jsx)(D.Fragment,{children:(0,D.jsxs)(p.Z.Body,{children:[(0,D.jsx)(u.Z,{children:(0,D.jsx)(h.Z,{children:(0,D.jsx)(Z.Z.Group,{controlId:"decided",children:(0,D.jsxs)(Z.Z.Control,{as:"select",onChange:function(t){return e.handleChange_category(t)},children:[(0,D.jsx)("option",{value:"",children:"Select Document Category"}),S.XA.map((function(e,t){return(0,D.jsx)("option",{value:e.key,children:e.value},t)}))]})})})})," ",(0,D.jsx)(u.Z,{children:(0,D.jsx)(h.Z,{children:(0,D.jsx)(Z.Z.Group,{controlId:"doc_title",className:"mb-4",children:(0,D.jsx)(Z.Z.Control,{type:"text",placeholder:"title",defaultValue:"",onChange:function(t){return e.handleChange_doc_title(t)}})})})}),(0,D.jsx)(j.Z,{category:this.state.category,doc_title:this.state.doc_title,editorState:this.state.editorState,handleClickSave:this.handleClickSave,handleClickCancel:this.handleClickCancel,role:this.props.role})]})}):(0,D.jsxs)(p.Z.Body,{children:[i.map((function(e,t){return(0,D.jsxs)(u.Z,{className:"mb-4",children:[(0,D.jsxs)("h5",{children:["- ",window.documentlist["".concat(e)]]}),r(e)]},t)})),("Admin"===this.props.user.role||"Agent"===this.props.user.role)&&(0,D.jsx)(f.Z,{onClick:this.handleClick,children:"Add"})]})})})}),(0,D.jsxs)(x.Z,{show:this.state.SetDeleteDocModel,onHide:this.closeDeleteDocModalWindow,"aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,D.jsx)(x.Z.Header,{children:(0,D.jsx)(x.Z.Title,{id:"contained-modal-title-vcenter",children:"Warning"})}),(0,D.jsxs)(x.Z.Body,{children:["Do you want to delete documentation of title:"," ",this.state.doc_title_toBeDelete,"?"]}),(0,D.jsxs)(x.Z.Footer,{children:[(0,D.jsx)(f.Z,{disabled:!s,onClick:this.handleDeleteDoc,children:"Yes"}),(0,D.jsx)(f.Z,{onClick:this.closeDeleteDocModalWindow,children:"No"})]})]})]})}}]),n}(d.Component);t.default=g},26454:function(e,t,n){var s=n(18489),i=n(27853),r=n(84531),o=n(78932),a=n(38128),l=n(47313),d=n(52500),c=n(44030),u=n(63849),h=n(31616),p=n(37062),f=(n(85463),n(4901)),Z=(n(43636),n(51767)),x=n(66417),m=n(51426),_=n(46417),v=function(e){(0,o.Z)(n,e);var t=(0,a.Z)(n);function n(){var e;(0,i.Z)(this,n);for(var r=arguments.length,o=new Array(r),a=0;a<r;a++)o[a]=arguments[a];return(e=t.call.apply(t,[this].concat(o))).state={timeouterror:null,unauthorizederror:null,student:e.props.student,deleteFileWarningModel:!1,SetAsFinalFileModel:!1,Requirements_Modal:!1,in_edit_mode:!1,student_id:"",doc_thread_id:"",applicationId:"",editorState:null,ConvertedContent:"",isLoaded:!1,requirements:"",file:"",isThreadExisted:!1,res_status:0},e.handleClickEdit=function(t){t.preventDefault(),e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{in_edit_mode:!0})}))},e.handleClickCancel=function(t){e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{in_edit_mode:!1})}))},e.handleClickSave=function(t,n){t.preventDefault();var i=JSON.stringify((0,d.convertToRaw)(n.getCurrentContent())),r={prop:e.props.item,text:i};(0,m.Pd)(r).then((function(t){var s=t.data,i=s.success,r=(s.data,t.status);i?e.setState({success:i,editorState:n,isLoaded:!0,res_status:r}):e.setState({isLoaded:!0,res_status:r})}),(function(t){e.setState({error:t})})),e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{in_edit_mode:!1})}))},e.handleEditorChange=function(t){e.setState((function(e){return(0,s.Z)((0,s.Z)({},e),{},{editorState:t})}))},e}return(0,r.Z)(n,[{key:"componentDidMount",value:function(){var e=null;if(this.props.message){var t=(0,d.convertFromRaw)(JSON.parse(this.props.message));e=d.EditorState.createWithContent(t)}else e=d.EditorState.createEmpty();this.setState((function(t){return(0,s.Z)((0,s.Z)({},t),{},{editorState:e,ConvertedContent:e,isLoaded:!0})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.res_status;t.error;return t.isLoaded||this.state.student?n>=400?(0,_.jsx)(x.Z,{res_status:n}):(0,_.jsx)(_.Fragment,{children:(0,_.jsx)(u.Z,{children:(0,_.jsxs)(h.Z,{sm:10,children:[(0,_.jsx)(f.apv,{size:24,color:"red",title:"Delete",style:{cursor:"pointer"},onClick:function(){return e.props.openDeleteDocModalWindow(e.props.document)}}),this.props.idx,". ",(0,_.jsx)(p.Z,{to:"".concat(this.props.path,"/").concat(this.props.document._id),children:this.props.document.title})]})})}):(0,_.jsx)("div",{style:Z.nT,children:(0,_.jsx)(c.Z,{animation:"border",role:"status",children:(0,_.jsx)("span",{className:"visually-hidden"})})})}}]),n}(l.Component);t.Z=v}}]);