"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[8433],{50099:function(e,n,t){var i=t(35531),a=t(27853),s=t(84531),r=t(78932),o=t(38128),l=t(47313),d=t(73158),c=t(65832),u=t(62396),p=t(29678),h=t.n(p),f=t(54991),m=t(12401),x=t(46417),g=function(e){(0,r.Z)(t,e);var n=(0,o.Z)(t);function t(){var e;(0,a.Z)(this,t);for(var i=arguments.length,s=new Array(i),r=0;r<i;r++)s[r]=arguments[r];return(e=n.call.apply(n,[this].concat(s))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,s.Z)(t,[{key:"render",value:function(){var e,n,t,a,s,r=this,o=[];return this.state.isOption&&(t=(0,x.jsx)("div",{className:"card-header-right",children:(0,x.jsxs)(d.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,x.jsx)(d.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,x.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,x.jsxs)(d.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){r.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,x.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,x.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){r.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,x.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,x.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,x.jsx)("i",{className:"feather icon-refresh-cw"}),(0,x.jsx)("a",{href:m.Z.BLANK_LINK,children:" Reload "})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,x.jsx)("i",{className:"feather icon-trash"}),(0,x.jsx)("a",{href:m.Z.BLANK_LINK,children:" Remove "})]})]})]})})),a=(0,x.jsxs)(c.Z.Header,{children:[(0,x.jsx)(c.Z.Title,{as:"h5",children:this.props.title}),t]}),this.state.fullCard&&(o=[].concat((0,i.Z)(o),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(o=[].concat((0,i.Z)(o),["card-load"]),n=(0,x.jsx)("div",{className:"card-loader",children:(0,x.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(o=[].concat((0,i.Z)(o),["d-none"])),this.props.cardClass&&(o=[].concat((0,i.Z)(o),[this.props.cardClass])),s=(0,x.jsxs)(c.Z,{className:o.join(" "),style:e,children:[a,(0,x.jsx)(u.Z,{in:!this.state.collapseCard,children:(0,x.jsx)("div",{children:(0,x.jsx)(c.Z.Body,{children:this.props.children})})}),n]}),(0,x.jsx)(f.Z,{children:s})}}]),t}(l.Component);n.Z=h()(g)},58433:function(e,n,t){t.r(n),t.d(n,{default:function(){return L}});var i=t(27853),a=t(84531),s=t(78932),r=t(38128),o=t(47313),l=t(44030),d=t(35531),c=t(18489),u=t(93298),p=t(76935),h=t(63849),f=t(31616),m=t(65832),x=t(465),g=t(41965),j=t(37062),_=t(54991),v=t(57864),Z=t(51426),y=t(94611),N=t(86450),C=t(51767),b=t(83708),I=t(46417),w=function(e){(0,s.Z)(t,e);var n=(0,r.Z)(t);function t(){var e;(0,i.Z)(this,t);for(var a=arguments.length,s=new Array(a),r=0;r<a;r++)s[r]=arguments[r];return(e=n.call.apply(n,[this].concat(s))).state={error:null,timeouterror:null,unauthorizederror:null,student:e.props.student,applications:e.props.student.applications,isLoaded:e.props.isLoaded,student_id:null,program_id:null,success:!1,application_status_changed:!1,applying_program_count:e.props.student.applying_program_count,modalDeleteApplication:!1,modalUpdatedApplication:!1},e.handleChangeProgramCount=function(n){n.preventDefault();var t=n.target.value;e.setState((function(e){return(0,c.Z)((0,c.Z)({},e),{},{application_status_changed:!0,applying_program_count:t})}))},e.handleChange=function(n,t){n.preventDefault();var i=(0,d.Z)(e.state.applications);i[t][n.target.id]=n.target.value,e.setState((function(e){return(0,c.Z)((0,c.Z)({},e),{},{application_status_changed:!0,applications:i})}))},e.handleDelete=function(n,t,i){n.preventDefault(),e.setState((function(e){return(0,c.Z)((0,c.Z)({},e),{},{student_id:i,program_id:t,modalDeleteApplication:!0})}))},e.onHideModalDeleteApplication=function(){e.setState({modalDeleteApplication:!1})},e.onHideUpdatedApplicationWindow=function(){e.setState({modalUpdatedApplication:!1})},e.handleDeleteConfirm=function(n){n.preventDefault(),e.setState({isLoaded:!1}),(0,Z.Jr)(e.state.program_id,e.state.student_id).then((function(n){var t=n.data,i=t.data,a=t.success;a?e.setState({isLoaded:!0,student:i,success:a,modalDeleteApplication:!1}):401===n.status||500===n.status?e.setState({isLoaded:!0,timeouterror:!0}):403===n.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(n){e.setState({isLoaded:!0})}))},e.handleSubmit=function(n,t,i){n.preventDefault();for(var a=(0,d.Z)(e.state.applications),s=e.state.applying_program_count,r=0;r<a.length;r+=1)delete a[r].programId,delete a[r].doc_modification_thread;(0,Z.A3)(t,a,s).then((function(n){var t=n.data,i=t.data,a=t.success;a?e.setState({isLoaded:!0,student:i,success:a,application_status_changed:!1,modalUpdatedApplication:!0}):401===n.status||500===n.status?e.setState({isLoaded:!0,timeouterror:!0}):403===n.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(n){e.setState({isLoaded:!0})}))},e}return(0,a.Z)(t,[{key:"render",value:function(){var e=this,n=this.state,t=n.unauthorizederror,i=n.timeouterror,a=n.isLoaded;if(i)return(0,I.jsx)("div",{children:(0,I.jsx)(y.Z,{})});if(t)return(0,I.jsx)("div",{children:(0,I.jsx)(N.Z,{})});var s;if(!a&&!this.state.student)return(0,I.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,I.jsx)(l.Z,{animation:"border",role:"status",children:(0,I.jsx)("span",{className:"visually-hidden"})})});var r=new Date;return s=void 0===this.props.student.applications||0===this.props.student.applications.length?(0,I.jsx)(I.Fragment,{children:(0,I.jsxs)("tr",{children:["Student"!==this.props.role&&(0,I.jsx)("td",{}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1 text-danger",children:" No University"})}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1 text-danger",children:" No Program"})}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1 text-danger",children:" No Date"})}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1",children:" "})}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1",children:" "})}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1",children:" "})}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1",children:" "})}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1",children:" "})})]})}):this.state.student.applications.map((function(n,t){return(0,I.jsxs)("tr",{children:["Student"!==e.props.role&&(0,I.jsx)("td",{children:(0,I.jsx)(u.Z,{size:"sm",onClick:function(t){return e.handleDelete(t,n.programId._id,e.state.student._id)},children:(0,I.jsx)(v.YK6,{size:16})})}),(0,I.jsx)("td",{children:(0,I.jsx)(j.Z,{to:"/programs/"+n.programId._id,style:{textDecoration:"none"},children:(0,I.jsx)("p",{className:"mb-1 text-info",children:n.programId.school},t)})}),(0,I.jsx)("td",{children:(0,I.jsx)(j.Z,{to:"/programs/"+n.programId._id,style:{textDecoration:"none"},children:(0,I.jsx)("p",{className:"mb-1 text-info",children:n.programId.program_name},t)})}),(0,I.jsx)("td",{children:(0,I.jsx)(j.Z,{to:"/programs/"+n.programId._id,style:{textDecoration:"none"},children:(0,I.jsx)("p",{className:"mb-1 text-info",children:n.programId.semester},t)})}),(0,I.jsx)("td",{children:"O"===n.closed?(0,I.jsx)("p",{className:"mb-1 text-warning",children:"Close"},t):(0,I.jsx)("p",{className:"mb-1 text-info",children:(0,b.x8)(e.props.student,n)},t)}),(0,I.jsx)("td",{children:(0,I.jsx)(p.Z.Group,{controlId:"decided",children:(0,I.jsxs)(p.Z.Control,{as:"select",onChange:function(n){return e.handleChange(n,t)},defaultValue:n.decided,children:[(0,I.jsx)("option",{value:"-",children:"-"}),(0,I.jsx)("option",{value:"X",children:"No"}),(0,I.jsx)("option",{value:"O",children:"Yes"})]})})}),"O"===n.decided?(0,I.jsx)("td",{children:(0,I.jsx)(p.Z.Group,{controlId:"closed",children:(0,I.jsxs)(p.Z.Control,{as:"select",onChange:function(n){return e.handleChange(n,t)},disabled:!("-"!==n.decided&&"X"!==n.decided),defaultValue:n.closed,children:[(0,I.jsx)("option",{value:"-",children:"-"}),(0,I.jsx)("option",{value:"X",children:"No"}),(0,I.jsx)("option",{value:"O",children:"Yes"})]})})}):(0,I.jsx)("td",{}),"O"===n.closed?(0,I.jsx)("td",{children:(0,I.jsx)(p.Z.Group,{controlId:"admission",children:(0,I.jsxs)(p.Z.Control,{as:"select",onChange:function(n){return e.handleChange(n,t)},disabled:!("-"!==n.closed&&"X"!==n.closed),defaultValue:n.admission,children:[(0,I.jsx)("option",{value:"-",children:"-"}),(0,I.jsx)("option",{value:"X",children:"No"}),(0,I.jsx)("option",{value:"O",children:"Yes"})]})})}):(0,I.jsx)("td",{}),(0,I.jsx)("td",{children:(0,I.jsx)("p",{className:"mb-1 text-info",children:n.closed?"-":n.programId.application_deadline?e.props.student.application_preference&&e.props.student.application_preference.expected_application_date&&(0,C.Vb)(r,e.props.student.application_preference.expected_application_date+"-"+n.programId.application_deadline):"-"},t)})]},t)})),(0,I.jsxs)(_.Z,{children:[(0,I.jsx)(h.Z,{children:(0,I.jsx)(f.Z,{children:(0,I.jsx)(m.Z,{className:"my-2 mx-0",bg:"black",text:"light",children:(0,I.jsx)(m.Z.Header,{children:(0,I.jsxs)(m.Z.Title,{className:"my-0 mx-0 text-light",children:[this.props.student.firstname," ",this.props.student.lastname]})})})})}),(0,b.ys)([this.state.student])&&(0,I.jsx)(h.Z,{children:(0,I.jsx)(f.Z,{children:(0,I.jsx)(m.Z,{className:"mb-2 mx-0",bg:"danger",text:"light",children:(0,I.jsxs)(m.Z.Body,{children:[this.props.student.firstname," ",this.props.student.lastname," ","did not choose enough programs."]})})})}),"Admin"===this.props.role&&(0,b.aH)(this.state.student)&&(0,I.jsx)(h.Z,{children:(0,I.jsx)(f.Z,{children:(0,I.jsx)(m.Z,{className:"mb-2 mx-0",bg:"danger",text:"light",children:(0,I.jsx)(m.Z.Body,{children:"The number of student's applications is not specified! Please determine the number of the programs according to the contract"})})})}),(0,I.jsx)(h.Z,{children:(0,I.jsxs)(f.Z,{children:[(0,I.jsxs)(m.Z,{className:"my-0 mx-0",bg:"info",text:"white",children:[(0,I.jsxs)(h.Z,{bg:"info",children:[(0,I.jsx)(f.Z,{md:4,className:"mx-2 my-2",children:(0,I.jsx)("h4",{children:"Applying Program Count: "})}),"Admin"===this.props.role?(0,I.jsx)(f.Z,{md:2,className:"mx-2 my-1",children:(0,I.jsx)(p.Z.Group,{controlId:"applying_program_count",children:(0,I.jsxs)(p.Z.Control,{as:"select",defaultValue:this.state.student.applying_program_count,onChange:function(n){return e.handleChangeProgramCount(n)},children:[(0,I.jsx)("option",{value:"0",children:"Please Select"}),(0,I.jsx)("option",{value:"1",children:"1"}),(0,I.jsx)("option",{value:"2",children:"2"}),(0,I.jsx)("option",{value:"3",children:"3"}),(0,I.jsx)("option",{value:"4",children:"4"}),(0,I.jsx)("option",{value:"5",children:"5"}),(0,I.jsx)("option",{value:"6",children:"6"}),(0,I.jsx)("option",{value:"7",children:"7"}),(0,I.jsx)("option",{value:"8",children:"8"}),(0,I.jsx)("option",{value:"9",children:"9"}),(0,I.jsx)("option",{value:"10",children:"10"})]})})}):(0,I.jsx)(I.Fragment,{children:(0,I.jsx)(f.Z,{md:2,className:"mx-2 my-3",children:(0,I.jsx)("h4",{children:this.state.student.applying_program_count})})})]}),(0,I.jsx)(h.Z,{children:(0,I.jsx)(f.Z,{children:(0,I.jsxs)(x.Z,{size:"sm",responsive:!0,className:"my-0 mx-0",variant:"dark",text:"light",children:[(0,I.jsx)("thead",{children:(0,I.jsxs)("tr",{children:["Student"!==this.props.role&&(0,I.jsx)("th",{}),window.programstatuslist.map((function(e,n){return(0,I.jsx)("th",{children:e.name},n)}))]})}),(0,I.jsx)("tbody",{children:s})]})})})]}),(0,I.jsx)(h.Z,{className:"my-2 mx-0",children:(0,I.jsx)(u.Z,{size:"sm",disabled:!this.state.application_status_changed,onClick:function(n){return e.handleSubmit(n,e.state.student._id,e.state.applications)},children:"Update"})}),(0,I.jsxs)(g.Z,{show:this.state.modalDeleteApplication,onHide:this.onHideModalDeleteApplication,size:"m","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,I.jsx)(g.Z.Header,{children:(0,I.jsx)(g.Z.Title,{id:"contained-modal-title-vcenter",children:"Warning: Delete an application"})}),(0,I.jsx)(g.Z.Body,{children:"This will delete all message and editted files in discussion. Are you sure?"}),(0,I.jsxs)(g.Z.Footer,{children:[(0,I.jsx)(u.Z,{disabled:!this.state.isLoaded,onClick:this.handleDeleteConfirm,children:"Yes"}),(0,I.jsx)(u.Z,{onClick:this.onHideModalDeleteApplication,children:"Close"})]})]}),(0,I.jsxs)(g.Z,{show:this.state.modalUpdatedApplication,onHide:this.onHideUpdatedApplicationWindow,size:"m","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,I.jsx)(g.Z.Header,{children:(0,I.jsx)(g.Z.Title,{id:"contained-modal-title-vcenter",children:"Info:"})}),(0,I.jsx)(g.Z.Body,{children:"Applications status updated successfully!"}),(0,I.jsx)(g.Z.Footer,{children:(0,I.jsx)(u.Z,{onClick:this.onHideUpdatedApplicationWindow,children:"Close"})})]})]})})]})}}]),t}(o.Component),D=w,S=function(e){(0,s.Z)(t,e);var n=(0,r.Z)(t);function t(){var e;(0,i.Z)(this,t);for(var a=arguments.length,s=new Array(a),r=0;r<a;r++)s[r]=arguments[r];return(e=n.call.apply(n,[this].concat(s))).state={timeouterror:null,unauthorizederror:null,isLoaded:!1,student:null,success:!1,error:null},e}return(0,a.Z)(t,[{key:"componentDidMount",value:function(){var e=this;(0,Z.u6)(this.props.match.params.student_id).then((function(n){var t=n.data,i=t.data,a=t.success;a?e.setState({isLoaded:!0,student:i,success:a}):401===n.status||500===n.status?e.setState({isLoaded:!0,timeouterror:!0}):403===n.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(n){e.setState({isLoaded:!0,error:!0})}))}},{key:"render",value:function(){var e=this.state,n=e.unauthorizederror,t=e.timeouterror,i=e.isLoaded;if(t)return(0,I.jsx)("div",{children:(0,I.jsx)(y.Z,{})});if(n)return(0,I.jsx)("div",{children:(0,I.jsx)(N.Z,{})});return i||this.state.student?(0,I.jsx)(D,{isLoaded:i,role:this.props.user.role,student:this.state.student}):(0,I.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,I.jsx)(l.Z,{animation:"border",role:"status",children:(0,I.jsx)("span",{className:"visually-hidden"})})})}}]),t}(o.Component),L=S},94611:function(e,n,t){var i=t(27853),a=t(84531),s=t(78932),r=t(38128),o=t(47313),l=t(63849),d=t(31616),c=t(50099),u=t(54991),p=t(46417),h=function(e){(0,s.Z)(t,e);var n=(0,r.Z)(t);function t(){return(0,i.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return(0,p.jsx)(u.Z,{children:(0,p.jsx)(l.Z,{children:(0,p.jsx)(d.Z,{children:(0,p.jsx)(c.Z,{children:"Time out error. Please login again!"})})})})}}]),t}(o.Component);n.Z=h},86450:function(e,n,t){var i=t(27853),a=t(84531),s=t(78932),r=t(38128),o=t(47313),l=t(63849),d=t(31616),c=t(50099),u=t(54991),p=t(46417),h=function(e){(0,s.Z)(t,e);var n=(0,r.Z)(t);function t(){return(0,i.Z)(this,t),n.apply(this,arguments)}return(0,a.Z)(t,[{key:"render",value:function(){return(0,p.jsx)(u.Z,{children:(0,p.jsx)(l.Z,{children:(0,p.jsx)(d.Z,{children:(0,p.jsx)(c.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),t}(o.Component);n.Z=h},83708:function(e,n,t){t.d(n,{EL:function(){return a},En:function(){return I},H6:function(){return _},HU:function(){return c},S:function(){return s},_$:function(){return y},_D:function(){return r},aH:function(){return h},aT:function(){return Z},bX:function(){return C},c9:function(){return w},d0:function(){return D},dJ:function(){return p},dh:function(){return i},el:function(){return x},kF:function(){return b},pM:function(){return l},qz:function(){return u},sc:function(){return j},ti:function(){return d},x8:function(){return o},y2:function(){return m},y3:function(){return N},yd:function(){return g},ye:function(){return v},ys:function(){return f}});var i=function(e){return!(!e||!e.language)&&"O"===e.language.english_isPassed},a=function(e){return!(!e||!e.language)&&"O"===e.language.german_isPassed},s=function(e){return!(!e||!e.language)&&!(!e.language||!(e.language.english_isPassed&&"-"!==e.language.english_isPassed||e.language.german_isPassed&&"-"!==e.language.german_isPassed))},r=function(e){return!(!e||!e.university)&&!!(e.university.attended_high_school&&e.university.high_school_isGraduated&&"-"!==e.university.high_school_isGraduated&&e.university.attended_university&&e.university.attended_university_program)},o=function(e,n){if("O"===n.closed)return"CLOSE";if(!n.programId.application_deadline)return"No Data";if(n.programId.application_deadline.includes("olling"))return"Rolling";var t="<TBD>";if(e.application_preference&&""!==e.application_preference.expected_application_date&&(t=parseInt(e.application_preference.expected_application_date)),!n.programId.application_deadline)return"".concat(t,"-<TBD>");var i=n.programId.semester,a=parseInt(n.programId.application_deadline.split("-")[0]),s=parseInt(n.programId.application_deadline.split("-")[1]);return void 0===i?"Err":("WS"===i&&a>9&&(t-=1),"SS"===i&&a>3&&(t-=1),"".concat(t,"-").concat(a,"-").concat(s))},l=function(e){return!!e&&!(!e.expected_application_date||!e.expected_application_semester)},d=function(e){for(var n=0;n<e.length;n+=1)if(void 0===e[n].agents||0===e[n].agents.length)return!1;return!0},c=function(e){for(var n=0;n<e.length;n+=1)if(void 0===e[n].editors||0===e[n].editors.length)return!1;return!0},u=function(e){if(!e.applications)return!1;if(0===e.applications.length)return!1;for(var n=0;n<e.applications.length;n+=1)if(!e.applications[n].decided||void 0!==e.applications[n].decided&&"-"===e.applications[n].decided)return!1;return!0},p=function(e){if(!e.applications)return!0;if(0===e.applications.length)return!0;for(var n=0;n<e.applications.length;n+=1)if(!e.applications[n].decided||void 0!==e.applications[n].decided&&"-"===e.applications[n].decided)return!1;return!0},h=function(e){return 0===e.applying_program_count||void 0===e.applying_program_count},f=function(e){for(var n=0;n<e.length;n+=1)if(e[n].applications.length<e[n].applying_program_count)return!0;return!1},m=function(e){return void 0===e.applications?0:e.applications.filter((function(e){return"O"===e.decided})).length},x=function(e){return void 0===e.applications?0:e.applications.filter((function(e){return"O"===e.closed})).length},g=function(e){if(void 0===e.applications)return!1;if(0===e.applying_program_count)return!1;if(e.applications.length<e.applying_program_count)return!1;if(!e.applications||0===e.applications.length)return!1;for(var n=0;n<e.applications.length;n+=1)if(!e.applications[n].decided||void 0!==e.applications[n].decided&&"O"!==e.applications[n].decided)return!1;return!0},j=function(e,n){if(void 0===n.applications)return!1;if(0===n.applications.length)return!1;for(var t=0;t<e.length;t+=1)for(var i=0;i<n.applications.length;i+=1)if(!n.applications[i].closed||void 0!==n.applications[i].closed&&"O"!==n.applications[i].closed)return!1;return!0},_=function(e){return!!e.programId.uni_assist&&!!e.programId.uni_assist.includes("Yes")},v=function(e){if(void 0===e.applications)return!1;for(var n=0;n<e.applications.length;n+=1)if("O"===e.applications[n].decided&&e.applications[n].programId.uni_assist&&(e.applications[n].programId.uni_assist.includes("VPD")||e.applications[n].programId.uni_assist.includes("Full")))return!0;return!1},Z=function(e){var n=0;if(void 0===e.applications)return n;for(var t=0;t<e.applications.length;t+=1)if("O"===e.applications[t].decided&&e.applications[t].programId.uni_assist&&(e.applications[t].programId.uni_assist.includes("VPD")||e.applications[t].programId.uni_assist.includes("Full"))){if(!e.applications[t].uni_assist)continue;if(e.applications[t].uni_assist&&"notneeded"===e.applications[t].uni_assist.status)continue;!e.applications[t].uni_assist||"uploaded"!==e.applications[t].uni_assist.status&&""===e.applications[t].uni_assist.vpd_file_path&&null!==e.applications[t].uni_assist.vpd_file_path||(n+=1)}return n},y=function(e){var n=0;if(void 0===e.applications)return n;for(var t=0;t<e.applications.length;t+=1)if("O"===e.applications[t].decided&&e.applications[t].programId.uni_assist&&(e.applications[t].programId.uni_assist.includes("VPD")||e.applications[t].programId.uni_assist.includes("Full"))){if(!e.applications[t].uni_assist)continue;if(e.applications[t].uni_assist&&"notneeded"===e.applications[t].uni_assist.status)continue;n+=1}return n},N=function(e){for(var n=0;n<e.doc_modification_thread.length;n+=1)if(!e.doc_modification_thread[n].isFinalVersion)return!1;return!0},C=function(e){return!!e.generaldocs_threads&&(-1!==e.generaldocs_threads.findIndex((function(e){return"CV"===e.doc_thread_id.file_type}))&&!!e.generaldocs_threads.find((function(e){return"CV"===e.doc_thread_id.file_type})).isFinalVersion)},b=function(e){for(var n=0;n<e.doc_modification_thread.length;n+=1)if(!e.doc_modification_thread[n].isFinalVersion)return!1;return!(e.programId.uni_assist&&e.programId.uni_assist.includes("Yes")&&(!e.uni_assist||"uploaded"!==e.uni_assist.status))},I=function(e){return"O"===e.closed},w=function(e){if(void 0===e.applications)return!1;for(var n=0;n<e.applications.length;n+=1)if("O"===e.applications[n].decided&&e.applications[n].programId.uni_assist&&(e.applications[n].programId.uni_assist.includes("VPD")||e.applications[n].programId.uni_assist.includes("Full"))){if(!e.applications[n].uni_assist)return!1;if(e.applications[n].uni_assist&&"notneeded"===e.applications[n].uni_assist.status)continue;if(e.applications[n].uni_assist&&("uploaded"!==e.applications[n].uni_assist.status||""===e.applications[n].uni_assist.vpd_file_path))return!1}return!0},D=function(e){return-1===e.generaldocs_threads.findIndex((function(e){return"CV"===e.doc_thread_id.file_type}))}},62396:function(e,n,t){t.d(n,{Z:function(){return N}});var i=t(18489),a=t(83738),s=t(36222),r=t(46123),o=t.n(r),l=t(46988),d=t(47313),c=t(22752),u=t(59498);var p,h=function(){for(var e=arguments.length,n=new Array(e),t=0;t<e;t++)n[t]=arguments[t];return n.filter((function(e){return null!=e})).reduce((function(e,n){if("function"!==typeof n)throw new Error("Invalid Argument Type, must only provide functions, undefined, or null.");return null===e?n:function(){for(var t=arguments.length,i=new Array(t),a=0;a<t;a++)i[a]=arguments[a];e.apply(this,i),n.apply(this,i)}}),null)},f=t(6280),m=t(75879),x=t(46417),g=["onEnter","onEntering","onEntered","onExit","onExiting","className","children","dimension","getDimensionValue"],j={height:["marginTop","marginBottom"],width:["marginLeft","marginRight"]};function _(e,n){var t=n["offset".concat(e[0].toUpperCase()).concat(e.slice(1))],i=j[e];return t+parseInt((0,l.Z)(n,i[0]),10)+parseInt((0,l.Z)(n,i[1]),10)}var v=(p={},(0,s.Z)(p,c.Wj,"collapse"),(0,s.Z)(p,c.Ix,"collapsing"),(0,s.Z)(p,c.d0,"collapsing"),(0,s.Z)(p,c.cn,"collapse show"),p),Z={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1,getDimensionValue:_},y=d.forwardRef((function(e,n){var t=e.onEnter,s=e.onEntering,r=e.onEntered,l=e.onExit,c=e.onExiting,p=e.className,j=e.children,Z=e.dimension,y=void 0===Z?"height":Z,N=e.getDimensionValue,C=void 0===N?_:N,b=(0,a.Z)(e,g),I="function"===typeof y?y():y,w=(0,d.useMemo)((function(){return h((function(e){e.style[I]="0"}),t)}),[I,t]),D=(0,d.useMemo)((function(){return h((function(e){var n="scroll".concat(I[0].toUpperCase()).concat(I.slice(1));e.style[I]="".concat(e[n],"px")}),s)}),[I,s]),S=(0,d.useMemo)((function(){return h((function(e){e.style[I]=null}),r)}),[I,r]),L=(0,d.useMemo)((function(){return h((function(e){e.style[I]="".concat(C(I,e),"px"),(0,f.Z)(e)}),l)}),[l,C,I]),A=(0,d.useMemo)((function(){return h((function(e){e.style[I]=null}),c)}),[I,c]);return(0,x.jsx)(m.Z,(0,i.Z)((0,i.Z)({ref:n,addEndListener:u.Z},b),{},{"aria-expanded":b.role?b.in:null,onEnter:w,onEntering:D,onEntered:S,onExit:L,onExiting:A,childRef:j.ref,children:function(e,n){return d.cloneElement(j,(0,i.Z)((0,i.Z)({},n),{},{className:o()(p,j.props.className,v[e],"width"===I&&"collapse-horizontal")}))}}))}));y.defaultProps=Z;var N=y},465:function(e,n,t){var i=t(18489),a=t(83738),s=t(46123),r=t.n(s),o=t(47313),l=t(68524),d=t(46417),c=["bsPrefix","className","striped","bordered","borderless","hover","size","variant","responsive"],u=o.forwardRef((function(e,n){var t=e.bsPrefix,s=e.className,o=e.striped,u=e.bordered,p=e.borderless,h=e.hover,f=e.size,m=e.variant,x=e.responsive,g=(0,a.Z)(e,c),j=(0,l.vE)(t,"table"),_=r()(s,j,m&&"".concat(j,"-").concat(m),f&&"".concat(j,"-").concat(f),o&&"".concat(j,"-").concat("string"===typeof o?"striped-".concat(o):"striped"),u&&"".concat(j,"-bordered"),p&&"".concat(j,"-borderless"),h&&"".concat(j,"-hover")),v=(0,d.jsx)("table",(0,i.Z)((0,i.Z)({},g),{},{className:_,ref:n}));if(x){var Z="".concat(j,"-responsive");return"string"===typeof x&&(Z="".concat(Z,"-").concat(x)),(0,d.jsx)("div",{className:Z,children:v})}return v}));n.Z=u}}]);