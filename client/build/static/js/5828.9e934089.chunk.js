"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[5828],{50099:function(n,i,e){var t=e(35531),a=e(27853),r=e(84531),s=e(78932),o=e(66621),c=e(47313),l=e(58050),u=e(72880),d=e(88815),p=e(29678),f=e.n(p),h=e(54991),g=e(12401),m=e(46417),_=function(n){(0,s.Z)(e,n);var i=(0,o.Z)(e);function e(){var n;(0,a.Z)(this,e);for(var t=arguments.length,r=new Array(t),s=0;s<t;s++)r[s]=arguments[s];return(n=i.call.apply(i,[this].concat(r))).state={isOption:n.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},n.cardReloadHandler=function(){n.setState({loadCard:!0}),setInterval((function(){n.setState({loadCard:!1})}),3e3)},n.cardRemoveHandler=function(){n.setState({cardRemove:!0})},n}return(0,r.Z)(e,[{key:"render",value:function(){var n,i,e,a,r,s=this,o=[];return this.state.isOption&&(e=(0,m.jsx)("div",{className:"card-header-right",children:(0,m.jsxs)(l.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,m.jsx)(l.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,m.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,m.jsxs)(l.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,m.jsxs)(l.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){s.setState((function(n){return{fullCard:!n.fullCard}}))},children:[(0,m.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,m.jsxs)("a",{href:g.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,m.jsxs)(l.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){s.setState((function(n){return{collapseCard:!n.collapseCard}}))},children:[(0,m.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,m.jsxs)("a",{href:g.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,m.jsxs)(l.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,m.jsx)("i",{className:"feather icon-refresh-cw"}),(0,m.jsx)("a",{href:g.Z.BLANK_LINK,children:" Reload "})]}),(0,m.jsxs)(l.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,m.jsx)("i",{className:"feather icon-trash"}),(0,m.jsx)("a",{href:g.Z.BLANK_LINK,children:" Remove "})]})]})]})})),a=(0,m.jsxs)(u.Z.Header,{children:[(0,m.jsx)(u.Z.Title,{as:"h5",children:this.props.title}),e]}),this.state.fullCard&&(o=[].concat((0,t.Z)(o),["full-card"]),n={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(o=[].concat((0,t.Z)(o),["card-load"]),i=(0,m.jsx)("div",{className:"card-loader",children:(0,m.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(o=[].concat((0,t.Z)(o),["d-none"])),this.props.cardClass&&(o=[].concat((0,t.Z)(o),[this.props.cardClass])),r=(0,m.jsxs)(u.Z,{className:o.join(" "),style:n,children:[a,(0,m.jsx)(d.Z,{in:!this.state.collapseCard,children:(0,m.jsx)("div",{children:(0,m.jsx)(u.Z.Body,{children:this.props.children})})}),i]}),(0,m.jsx)(h.Z,{children:r})}}]),e}(c.Component);i.Z=f()(_)},94611:function(n,i,e){var t=e(27853),a=e(84531),r=e(78932),s=e(66621),o=e(47313),c=e(63849),l=e(31616),u=e(50099),d=e(54991),p=e(46417),f=function(n){(0,r.Z)(e,n);var i=(0,s.Z)(e);function e(){return(0,t.Z)(this,e),i.apply(this,arguments)}return(0,a.Z)(e,[{key:"render",value:function(){return(0,p.jsx)(d.Z,{children:(0,p.jsx)(c.Z,{children:(0,p.jsx)(l.Z,{children:(0,p.jsx)(u.Z,{children:"Time out error. Please login again!"})})})})}}]),e}(o.Component);i.Z=f},86450:function(n,i,e){var t=e(27853),a=e(84531),r=e(78932),s=e(66621),o=e(47313),c=e(63849),l=e(31616),u=e(50099),d=e(54991),p=e(46417),f=function(n){(0,r.Z)(e,n);var i=(0,s.Z)(e);function e(){return(0,t.Z)(this,e),i.apply(this,arguments)}return(0,a.Z)(e,[{key:"render",value:function(){return(0,p.jsx)(d.Z,{children:(0,p.jsx)(c.Z,{children:(0,p.jsx)(l.Z,{children:(0,p.jsx)(u.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),e}(o.Component);i.Z=f},83708:function(n,i,e){e.d(i,{EL:function(){return a},En:function(){return k},H6:function(){return x},HU:function(){return u},S:function(){return r},_$:function(){return Z},_D:function(){return s},aH:function(){return f},aT:function(){return y},bX:function(){return C},c9:function(){return w},d0:function(){return D},dJ:function(){return p},dh:function(){return t},el:function(){return m},kF:function(){return N},pM:function(){return c},qz:function(){return d},sc:function(){return v},ti:function(){return l},x8:function(){return o},y2:function(){return g},y3:function(){return I},yd:function(){return _},ye:function(){return j},ys:function(){return h}});var t=function(n){return!(!n||!n.language)&&"O"===n.language.english_isPassed},a=function(n){return!(!n||!n.language)&&"O"===n.language.german_isPassed},r=function(n){return!(!n||!n.university)&&!(!n.language||!(n.language.english_isPassed&&"-"!==n.language.english_isPassed||n.language.german_isPassed&&"-"!==n.language.german_isPassed))},s=function(n){return!(!n||!n.university)&&!!(n.university.attended_high_school&&n.university.attended_university&&n.university.attended_university_program)},o=function(n,i){if("O"===i.closed)return"CLOSE";if(!i.programId.application_deadline)return"No Data";if(i.programId.application_deadline.includes("olling"))return"Rolling";var e="<TBD>";if(n.application_preference&&""!==n.application_preference.expected_application_date&&(e=parseInt(n.application_preference.expected_application_date)),!i.programId.application_deadline)return"".concat(e,"-<TBD>");var t=i.programId.semester,a=parseInt(i.programId.application_deadline.split("-")[0]),r=parseInt(i.programId.application_deadline.split("-")[1]);return void 0===t?"Err":("WS"===t&&a>9&&(e-=1),"SS"===t&&a>3&&(e-=1),"".concat(e,"-").concat(a,"-").concat(r))},c=function(n){return!!n&&!(!n.expected_application_date||!n.expected_application_semester)},l=function(n){for(var i=0;i<n.length;i+=1)if(void 0===n[i].agents||0===n[i].agents.length)return!1;return!0},u=function(n){for(var i=0;i<n.length;i+=1)if(void 0===n[i].editors||0===n[i].editors.length)return!1;return!0},d=function(n){if(!n.applications)return!1;if(0===n.applications.length)return!1;for(var i=0;i<n.applications.length;i+=1)if(!n.applications[i].decided||void 0!==n.applications[i].decided&&"-"===n.applications[i].decided)return!1;return!0},p=function(n){if(!n.applications)return!0;if(0===n.applications.length)return!0;for(var i=0;i<n.applications.length;i+=1)if(!n.applications[i].decided||void 0!==n.applications[i].decided&&"-"===n.applications[i].decided)return!1;return!0},f=function(n){return 0===n.applying_program_count||void 0===n.applying_program_count},h=function(n){for(var i=0;i<n.length;i+=1)if(n[i].applications.length<n[i].applying_program_count)return!0;return!1},g=function(n){return void 0===n.applications?0:n.applications.filter((function(n){return"O"===n.decided})).length},m=function(n){return void 0===n.applications?0:n.applications.filter((function(n){return"O"===n.closed})).length},_=function(n){if(void 0===n.applications)return!1;if(0===n.applying_program_count)return!1;if(n.applications.length<n.applying_program_count)return!1;if(!n.applications||0===n.applications.length)return!1;for(var i=0;i<n.applications.length;i+=1)if(!n.applications[i].decided||void 0!==n.applications[i].decided&&"O"!==n.applications[i].decided)return!1;return!0},v=function(n,i){if(void 0===i.applications)return!1;if(0===i.applications.length)return!1;for(var e=0;e<n.length;e+=1)for(var t=0;t<i.applications.length;t+=1)if(!i.applications[t].closed||void 0!==i.applications[t].closed&&"O"!==i.applications[t].closed)return!1;return!0},x=function(n){return!!n.programId.uni_assist&&!!n.programId.uni_assist.includes("Yes")},j=function(n){if(void 0===n.applications)return!1;for(var i=0;i<n.applications.length;i+=1)if("O"===n.applications[i].decided&&n.applications[i].programId.uni_assist&&(n.applications[i].programId.uni_assist.includes("VPD")||n.applications[i].programId.uni_assist.includes("Full")))return!0;return!1},y=function(n){var i=0;if(void 0===n.applications)return i;for(var e=0;e<n.applications.length;e+=1)if("O"===n.applications[e].decided&&n.applications[e].programId.uni_assist&&(n.applications[e].programId.uni_assist.includes("VPD")||n.applications[e].programId.uni_assist.includes("Full"))){if(!n.applications[e].uni_assist)continue;if(n.applications[e].uni_assist&&"notneeded"===n.applications[e].uni_assist.status)continue;!n.applications[e].uni_assist||"uploaded"!==n.applications[e].uni_assist.status&&""===n.applications[e].uni_assist.vpd_file_path&&null!==n.applications[e].uni_assist.vpd_file_path||(i+=1)}return i},Z=function(n){var i=0;if(void 0===n.applications)return i;for(var e=0;e<n.applications.length;e+=1)if("O"===n.applications[e].decided&&n.applications[e].programId.uni_assist&&(n.applications[e].programId.uni_assist.includes("VPD")||n.applications[e].programId.uni_assist.includes("Full"))){if(!n.applications[e].uni_assist)continue;if(n.applications[e].uni_assist&&"notneeded"===n.applications[e].uni_assist.status)continue;i+=1}return i},I=function(n){for(var i=0;i<n.doc_modification_thread.length;i+=1)if(!n.doc_modification_thread[i].isFinalVersion)return!1;return!0},C=function(n){return!!n.generaldocs_threads&&(-1!==n.generaldocs_threads.findIndex((function(n){return"CV"===n.doc_thread_id.file_type}))&&!!n.generaldocs_threads.find((function(n){return"CV"===n.doc_thread_id.file_type})).isFinalVersion)},N=function(n){for(var i=0;i<n.doc_modification_thread.length;i+=1)if(!n.doc_modification_thread[i].isFinalVersion)return!1;return!(n.programId.uni_assist&&n.programId.uni_assist.includes("Yes")&&(!n.uni_assist||"uploaded"!==n.uni_assist.status))},k=function(n){return"O"===n.closed},w=function(n){if(void 0===n.applications)return!1;for(var i=0;i<n.applications.length;i+=1)if("O"===n.applications[i].decided&&n.applications[i].programId.uni_assist&&(n.applications[i].programId.uni_assist.includes("VPD")||n.applications[i].programId.uni_assist.includes("Full"))){if(!n.applications[i].uni_assist)return!1;if(n.applications[i].uni_assist&&"notneeded"===n.applications[i].uni_assist.status)continue;if(n.applications[i].uni_assist&&("uploaded"!==n.applications[i].uni_assist.status||""===n.applications[i].uni_assist.vpd_file_path))return!1}return!0},D=function(n){return-1===n.generaldocs_threads.findIndex((function(n){return"CV"===n.doc_thread_id.file_type}))}},51767:function(n,i,e){e.d(i,{Ny:function(){return g},Ue:function(){return f},Vb:function(){return m},XA:function(){return h},_3:function(){return v},vE:function(){return p},xL:function(){return x}});e(47313);var t=e(57864),a=e(3394),r=e(58821),s=e(46417),o=(0,s.jsx)(a.cfq,{size:18,color:"limegreen",title:"Valid Document"}),c=(0,s.jsx)(t.LHV,{size:18,color:"red",title:"Invalid Document"}),l=(0,s.jsx)(t.QRz,{size:18,color:"orange",title:"Uploaded successfully"}),u=(0,s.jsx)(t.znh,{size:18,color:"lightgray",title:"No Document uploaded"}),d=(0,s.jsx)(r.pZ2,{size:18,color:"lightgray",title:"Not needed"}),p=(0,s.jsxs)(s.Fragment,{children:[(0,s.jsx)("p",{className:"text-muted",children:" "}),(0,s.jsxs)("p",{className:"text-info",children:[o,": The document is valid and can be used in the application."]}),(0,s.jsxs)("p",{className:"text-info",children:[c,": The document is invalid and cannot be used in the application. Please properly scan a new one."]}),(0,s.jsxs)("p",{className:"text-info",children:[l,": The document is uploaded. Your agent will check it as soon as possible."]}),(0,s.jsxs)("p",{className:"text-info",children:[u,": Please upload the copy of the document."]}),(0,s.jsxs)("p",{className:"text-info",children:[d,": This document is not needed."]})," "]}),f=[{key:"ee",value:"Eletrical/Electronics Engineering"},{key:"cs",value:"Computer Science"},{key:"mgm",value:"Business/Management"},{key:"dsbi",value:"Data Science/Business Intelligence"},{key:"me",value:"Mechanical Engineering"},{key:"mtl",value:"Materials Science"}],h=[{key:"application",value:"Application"},{key:"base-documents",value:"Base-documents"},{key:"cv-ml-rl",value:"CV/ML/RL"},{key:"portal-instruction",value:"Portal-Instruction"},{key:"certification",value:"Certification"},{key:"uniassist",value:"Uni-Assist"},{key:"visa",value:"Visa"}],g=function(n){return new Date(n).toLocaleDateString()+", "+new Date(n).toLocaleTimeString()},m=function(n,i){var e=new Date(n),t=new Date(i).getTime()-e.getTime();return Math.round(t/864e5).toString()},_=function(n,i){var e=i-n;return Array.from({length:e},(function(i,e){return e+n}))},v=function(){return(0,s.jsx)(s.Fragment,{children:_(1950,2050).map((function(n,i){return(0,s.jsx)("option",{value:n,children:n},i)}))})},x=function(){return(0,s.jsx)(s.Fragment,{children:_(2022,2050).map((function(n,i){return(0,s.jsx)("option",{value:n,children:n},i)}))})}}}]);