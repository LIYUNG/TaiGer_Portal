"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[263],{50099:function(e,r,n){var t=n(35531),s=n(27853),i=n(84531),a=n(78932),o=n(66621),l=n(47313),d=n(58050),c=n(72880),u=n(88815),h=n(29678),m=n.n(h),f=n(54991),p=n(12401),x=n(46417),g=function(e){(0,a.Z)(n,e);var r=(0,o.Z)(n);function n(){var e;(0,s.Z)(this,n);for(var t=arguments.length,i=new Array(t),a=0;a<t;a++)i[a]=arguments[a];return(e=r.call.apply(r,[this].concat(i))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,i.Z)(n,[{key:"render",value:function(){var e,r,n,s,i,a=this,o=[];return this.state.isOption&&(n=(0,x.jsx)("div",{className:"card-header-right",children:(0,x.jsxs)(d.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,x.jsx)(d.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,x.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,x.jsxs)(d.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){a.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,x.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,x.jsxs)("a",{href:p.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){a.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,x.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,x.jsxs)("a",{href:p.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,x.jsx)("i",{className:"feather icon-refresh-cw"}),(0,x.jsx)("a",{href:p.Z.BLANK_LINK,children:" Reload "})]}),(0,x.jsxs)(d.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,x.jsx)("i",{className:"feather icon-trash"}),(0,x.jsx)("a",{href:p.Z.BLANK_LINK,children:" Remove "})]})]})]})})),s=(0,x.jsxs)(c.Z.Header,{children:[(0,x.jsx)(c.Z.Title,{as:"h5",children:this.props.title}),n]}),this.state.fullCard&&(o=[].concat((0,t.Z)(o),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(o=[].concat((0,t.Z)(o),["card-load"]),r=(0,x.jsx)("div",{className:"card-loader",children:(0,x.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(o=[].concat((0,t.Z)(o),["d-none"])),this.props.cardClass&&(o=[].concat((0,t.Z)(o),[this.props.cardClass])),i=(0,x.jsxs)(c.Z,{className:o.join(" "),style:e,children:[s,(0,x.jsx)(u.Z,{in:!this.state.collapseCard,children:(0,x.jsx)("div",{children:(0,x.jsx)(c.Z.Body,{children:this.props.children})})}),r]}),(0,x.jsx)(f.Z,{children:i})}}]),n}(l.Component);r.Z=m()(g)},30263:function(e,r,n){n.r(r),n.d(r,{default:function(){return G}});var t=n(27853),s=n(84531),i=n(78932),a=n(66621),o=n(47313),l=n(63849),d=n(31616),c=(n(50099),n(54991)),u=n(18489);function h(e,r){if(null==e)return{};var n,t,s=function(e,r){if(null==e)return{};var n,t,s={},i=Object.keys(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||(s[n]=e[n]);return s}(e,r);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(t=0;t<i.length;t++)n=i[t],r.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(s[n]=e[n])}return s}var m=n(35531),f=n(23430),p=n(45110),x=n(64212),g=n(83109),Z=n(44030),j=n(93298),v=n(94611),b=n(86450),C=n(51426),w=n(46417),y=function(e){(0,i.Z)(n,e);var r=(0,a.Z)(n);function n(e){var s;return(0,t.Z)(this,n),(s=r.call(this,e)).state={students:[],isLoaded:!1,timeouterror:null,unauthorizederror:null},s}return(0,s.Z)(n,[{key:"componentDidMount",value:function(){var e=this;(0,C.sK)().then((function(r){var n=r.data,t=n.data,s=n.success;s?e.setState({isLoaded:!0,students:t,success:s}):401===r.status||500===r.status?e.setState({isLoaded:!0,timeouterror:!0}):403===r.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(r){e.setState({isLoaded:!0,error:r})}))}},{key:"render",value:function(){var e=this,r=this.state,n=r.unauthorizederror,t=r.timeouterror,s=r.isLoaded;if(t)return(0,w.jsx)("div",{children:(0,w.jsx)(v.Z,{})});if(n)return(0,w.jsx)("div",{children:(0,w.jsx)(b.Z,{})});if(!s&&!this.state.students)return(0,w.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,w.jsx)(Z.Z,{animation:"border",role:"status",children:(0,w.jsx)("span",{className:"visually-hidden"})})});for(var i=[],a=0;a<this.props.uni_name.length;a++)i.push(this.props.uni_name[a]+" - "+this.props.program_name[a]);return(0,w.jsxs)(x.Z,{show:this.props.show,onHide:this.props.setModalHide,size:"lg","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,w.jsx)(x.Z.Header,{children:(0,w.jsxs)(x.Z.Title,{id:"contained-modal-title-vcenter",children:["Assign"," ",i.map((function(e){return(0,w.jsx)("h5",{children:e})}))," ","to"]})}),(0,w.jsxs)(x.Z.Body,{children:[(0,w.jsx)("h4",{children:"Student:"}),(0,w.jsx)("table",{children:(0,w.jsx)("tbody",{children:this.state.students.map((function(r){return(0,w.jsxs)("tr",{children:[(0,w.jsx)("th",{children:(0,w.jsx)("div",{children:(0,w.jsx)(g.Z.Group,{children:(0,w.jsx)(g.Z.Check,{custom:!0,type:"radio",name:"student_id",value:r._id,id:r._id,onChange:e.props.handleChange2})})})}),(0,w.jsx)("td",{children:(0,w.jsxs)("h4",{className:"mb-1",children:[r.firstname,", ",r.lastname]})})]},r._id)}))})})]}),(0,w.jsxs)(x.Z.Footer,{children:[(0,w.jsx)(j.Z,{onClick:function(r){return e.props.onSubmitAddToStudentProgramList(r)},children:"Assign"}),(0,w.jsx)(j.Z,{onClick:this.props.setModalHide,children:"Cancel"})]})]})}}]),n}(o.Component),S=n(37062),N=n(1590),_=n(58050),A=n(465),R=n(72880),k=n(65777),P=["indeterminate"];function z(e){var r=e.preGlobalFilteredRows,n=e.globalFilter,t=e.setGlobalFilter,s=(r.length,o.useState(n)),i=(0,f.Z)(s,2),a=i[0],l=i[1],d=(0,p.useAsyncDebounce)((function(e){t(e||void 0)}),200);return(0,w.jsxs)("span",{children:["Search:"," ",(0,w.jsx)("input",{value:a||"",onChange:function(e){l(e.target.value),d(e.target.value)},placeholder:" TUM, Management ...",style:{fontSize:"0.9rem",border:"0"}})]})}function F(e){var r=e.column,n=r.filterValue,t=r.preFilteredRows,s=r.setFilter,i=t.length;return(0,w.jsx)("input",{value:n||"",onChange:function(e){s(e.target.value||void 0)},placeholder:"Search ".concat(i," records...")})}function H(e){var r=e.column,n=r.filterValue,t=r.setFilter,s=r.preFilteredRows,i=r.id,a=o.useMemo((function(){var e=new Set;return s.forEach((function(r){e.add(r.values[i])})),(0,m.Z)(e.values())}),[i,s]);return(0,w.jsxs)("select",{value:n,onChange:function(e){t(e.target.value||void 0)},children:[(0,w.jsx)("option",{value:"",children:"All"}),a.map((function(e,r){return(0,w.jsx)("option",{value:e,children:e},r)}))]})}function I(e,r,n){return(0,k.Lu)(e,n,{keys:[function(e){return e.values[r]}]})}I.autoRemove=function(e){return!e};var L=o.forwardRef((function(e,r){var n=e.indeterminate,t=h(e,P),s=o.useRef(),i=r||s;return o.useEffect((function(){i.current.indeterminate=n}),[i,n]),(0,w.jsx)(w.Fragment,{children:(0,w.jsx)("input",(0,u.Z)({type:"checkbox",ref:i},t))})}));function T(e){var r=e.columns,n=e.data,t=e.userId,s=(0,o.useState)({success:!1,isloaded:!1,error:null,modalShowAssignWindow:!1,modalShowAssignSuccessWindow:!1}),i=(0,f.Z)(s,2),a=i[0],c=i[1],h=(0,o.useState)({programIds:[],schools:[],program_names:[]}),g=(0,f.Z)(h,2),Z=g[0],v=g[1],b=(0,o.useState)(""),R=(0,f.Z)(b,2),k=R[0],P=R[1],H=o.useMemo((function(){return{fuzzyText:I,text:function(e,r,n){return e.filter((function(e){var t=e.values[r];return void 0===t||String(t).toLowerCase().startsWith(String(n).toLowerCase())}))}}}),[]),T=o.useMemo((function(){return{Filter:F}}),[]),M=(0,p.useTable)({columns:r,data:n,defaultColumn:T,filterTypes:H},p.useFilters,p.useGlobalFilter,p.usePagination,p.useRowSelect,(function(e){e.visibleColumns.push((function(e){return[{id:"selection",Header:function(e){var r=e.getToggleAllRowsSelectedProps;return(0,w.jsx)("div",{children:(0,w.jsx)(L,(0,u.Z)({},r()))})},Cell:function(e){var r=e.row;return(0,w.jsx)("div",{children:(0,w.jsx)(L,(0,u.Z)({},r.getToggleRowSelectedProps()))})}}].concat((0,m.Z)(e))}))})),O=M.getTableProps,E=M.getTableBodyProps,G=M.headerGroups,W=M.page,B=M.prepareRow,K=M.state,D=M.visibleColumns,V=M.canPreviousPage,U=M.canNextPage,q=M.pageOptions,J=M.pageCount,Q=M.gotoPage,X=M.nextPage,Y=M.previousPage,$=M.setPageSize,ee=M.preGlobalFilteredRows,re=M.setGlobalFilter,ne=M.toggleAllRowsSelected,te=M.state,se=te.pageIndex,ie=te.pageSize,ae=te.selectedRowIds;(0,o.useEffect)((function(){var e=Object.keys(ae);v({programIds:e.map((function(e){return n[e]._id})),schools:e.map((function(e){return n[e].school})),program_names:e.map((function(e){return n[e].program_name}))})}),[ae]);var oe=function(){c((function(e){return(0,u.Z)((0,u.Z)({},e),{},{modalShowAssignSuccessWindow:!1})}))};return(0,w.jsxs)(w.Fragment,{children:[0!==Z.programIds.length&&(0,w.jsx)(w.Fragment,{children:(0,w.jsx)(N.Z,{size:"sm",title:"Option",variant:"primary",children:(0,w.jsx)(_.Z.Item,{eventKey:"2",onSelect:function(){c((function(e){return(0,u.Z)((0,u.Z)({},e),{},{modalShowAssignWindow:!0})}))},children:"Assign to student..."})})}),(0,w.jsxs)(A.Z,(0,u.Z)((0,u.Z)({className:"my-0 mx-2",variant:"dark",text:"light",responsive:!0,hover:!0},O()),{},{children:[(0,w.jsxs)("thead",{children:[G.map((function(e){return(0,w.jsx)("tr",(0,u.Z)((0,u.Z)({},e.getHeaderGroupProps()),{},{children:e.headers.map((function(e){return(0,w.jsxs)("th",(0,u.Z)((0,u.Z)({},e.getHeaderProps()),{},{children:[e.render("Header"),(0,w.jsx)("div",{children:e.canFilter?e.render("Filter"):null})]}))}))}))})),(0,w.jsx)("tr",{children:(0,w.jsx)("th",{colSpan:D.length,style:{textAlign:"left"},children:(0,w.jsx)(z,{preGlobalFilteredRows:ee,globalFilter:K.globalFilter,setGlobalFilter:re})})})]}),(0,w.jsx)("tbody",(0,u.Z)((0,u.Z)({},E()),{},{children:W.map((function(e,r){return B(e),(0,w.jsx)("tr",(0,u.Z)((0,u.Z)({},e.getRowProps()),{},{children:e.cells.map((function(r,n){return(0,w.jsx)("td",(0,u.Z)((0,u.Z)({},r.getCellProps()),{},{children:0===n?(0,w.jsx)(w.Fragment,{children:r.render("Cell")}):(0,w.jsx)(S.Z,{target:"_blank",to:"/programs/"+e.original._id,className:"text-info",style:{textDecoration:"none"},children:r.render("Cell")})}))}))}))}))}))]})),(0,w.jsx)("div",{className:"pagination",children:(0,w.jsxs)(l.Z,{children:[(0,w.jsx)(d.Z,{md:1,children:(0,w.jsx)(j.Z,{size:"sm",onClick:function(){return Q(0)},disabled:!V,children:"<<"})})," ",(0,w.jsx)(d.Z,{md:1,children:(0,w.jsx)(j.Z,{size:"sm",onClick:function(){return Y()},disabled:!V,children:"<"})})," ",(0,w.jsx)(d.Z,{md:1,children:(0,w.jsx)(j.Z,{size:"sm",onClick:function(){return X()},disabled:!U,children:">"})})," ",(0,w.jsx)(d.Z,{md:1,children:(0,w.jsx)(j.Z,{size:"sm",onClick:function(){return Q(J-1)},disabled:!U,children:">>"})})," ",(0,w.jsx)(d.Z,{md:2,children:(0,w.jsxs)("span",{className:"text-light",children:["Page"," ",(0,w.jsxs)("strong",{children:[se+1," of ",q.length]})," "]})}),(0,w.jsx)(d.Z,{md:4,children:(0,w.jsxs)("span",{className:"text-light",children:["| Go to page:"," ",(0,w.jsx)("input",{type:"number",defaultValue:se+1,onChange:function(e){var r=e.target.value?Number(e.target.value)-1:0;Q(r)},style:{width:"100px"}})]})})," ",(0,w.jsx)(d.Z,{md:2,children:(0,w.jsx)("select",{value:ie,onChange:function(e){$(Number(e.target.value))},children:[10,20,30,40,50].map((function(e){return(0,w.jsxs)("option",{value:e,children:["Show ",e]},e)}))})})]})}),(0,w.jsx)("div",{}),(0,w.jsx)(y,{userId:t,show:a.modalShowAssignWindow,setModalHide:function(){c((function(e){return(0,u.Z)((0,u.Z)({},e),{},{modalShowAssignWindow:!1})}))},uni_name:Z.schools,program_name:Z.program_names,handleChange2:function(e){var r=e.target.value;P(r)},onSubmitAddToStudentProgramList:function(e){e.preventDefault(),function(e){var r=e.student_id,n=e.program_ids;(0,C.Cn)(r,n).then((function(e){var r=e.data.success;r?(re([]),ne(!1),c((function(e){return(0,u.Z)((0,u.Z)({},e),{},{isLoaded:!0,modalShowAssignSuccessWindow:!0,modalShowAssignWindow:!1,success:r})}))):alert(e.data.message)}),(function(e){}))}({student_id:k,program_ids:Z.programIds})}}),(0,w.jsxs)(x.Z,{show:a.modalShowAssignSuccessWindow,onHide:oe,size:"m","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,w.jsx)(x.Z.Header,{children:(0,w.jsx)(x.Z.Title,{id:"contained-modal-title-vcenter",children:"Success"})}),(0,w.jsx)(x.Z.Body,{children:"Program(s) assigned to student successfully!"}),(0,w.jsx)(x.Z.Footer,{children:(0,w.jsx)(j.Z,{onClick:oe,children:"Close"})})]})]})}var M=function(e){var r=(0,o.useState)({success:!1,programs:null,isloaded:!1,error:null,unauthorizederror:null}),n=(0,f.Z)(r,2),t=n[0],s=n[1];(0,o.useEffect)((function(){(0,C.CV)().then((function(e){var r=e.data,n=r.data,t=r.success;t?s((function(e){return(0,u.Z)((0,u.Z)({},e),{},{success:t,programs:n,isloaded:!0})})):401===e.status||500===e.status?s((function(e){return(0,u.Z)((0,u.Z)({},e),{},{error:!0,isloaded:!0})})):403===e.status&&s((function(e){return(0,u.Z)((0,u.Z)({},e),{},{unauthorizederror:!0,isloaded:!0})}))}),(function(e){return s((function(r){return(0,u.Z)((0,u.Z)({},r),{},{error:e,isloaded:!0})}))}))}),[]);var i=o.useMemo((function(){return[{Header:"Program Database",columns:[{Header:"University",accessor:"school",Filter:H,filter:"includes"},{Header:"Program",accessor:"program_name",filter:"fuzzyText"},{Header:"Semester",accessor:"semester",Filter:H,filter:"includes"},{Header:"TOEFL",accessor:"toefl"},{Header:"IELTS",accessor:"ielts"},{Header:"Degree",accessor:"degree",Filter:H,filter:"includes"},{Header:"GRE/GMAT",accessor:"gre"},{Header:"Application Deadline",accessor:"application_deadline"},{Header:"Last Update",accessor:"updatedAt"}]}]}),[]);return t.error?(0,w.jsx)("div",{children:(0,w.jsx)(v.Z,{})}):t.unauthorizederror?(0,w.jsx)("div",{children:(0,w.jsx)(b.Z,{})}):t.isloaded||t.programs?(0,w.jsx)(R.Z,{className:"my-0 mx-0",bg:"dark",text:"white",children:(0,w.jsx)(T,{columns:i,data:t.programs,userId:e.userId})}):(0,w.jsx)("div",{style:{position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"},children:(0,w.jsx)(Z.Z,{animation:"border",role:"status",children:(0,w.jsx)("span",{className:"visually-hidden"})})})},O=n(94395),E=function(e){(0,i.Z)(n,e);var r=(0,a.Z)(n);function n(){return(0,t.Z)(this,n),r.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){return"Admin"!==this.props.user.role&&"Editor"!==this.props.user.role&&"Agent"!==this.props.user.role?(0,w.jsx)(O.Z,{to:"/dashboard/default"}):(0,w.jsx)(c.Z,{children:(0,w.jsx)(l.Z,{children:(0,w.jsx)(d.Z,{children:(0,w.jsx)(M,{role:this.props.user.role,userId:this.props.user._id})})})})}}]),n}(o.Component),G=E},94611:function(e,r,n){var t=n(27853),s=n(84531),i=n(78932),a=n(66621),o=n(47313),l=n(63849),d=n(31616),c=n(50099),u=n(54991),h=n(46417),m=function(e){(0,i.Z)(n,e);var r=(0,a.Z)(n);function n(){return(0,t.Z)(this,n),r.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(l.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(c.Z,{children:"Time out error. Please login again!"})})})})}}]),n}(o.Component);r.Z=m},86450:function(e,r,n){var t=n(27853),s=n(84531),i=n(78932),a=n(66621),o=n(47313),l=n(63849),d=n(31616),c=n(50099),u=n(54991),h=n(46417),m=function(e){(0,i.Z)(n,e);var r=(0,a.Z)(n);function n(){return(0,t.Z)(this,n),r.apply(this,arguments)}return(0,s.Z)(n,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(l.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(c.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),n}(o.Component);r.Z=m},1590:function(e,r,n){var t=n(1368),s=n(38321),i=n(47313),a=n(75192),o=n.n(a),l=n(58050),d=n(1683),c=n(38388),u=["title","children","bsPrefix","rootCloseEvent","variant","size","menuAlign","menuRole","renderMenuOnMount","disabled","href","id"],h={id:o().any,href:o().string,onClick:o().func,title:o().node.isRequired,disabled:o().bool,menuAlign:c.r,menuRole:o().string,renderMenuOnMount:o().bool,rootCloseEvent:o().string,bsPrefix:o().string,variant:o().string,size:o().string},m=i.forwardRef((function(e,r){var n=e.title,a=e.children,o=e.bsPrefix,h=e.rootCloseEvent,m=e.variant,f=e.size,p=e.menuAlign,x=e.menuRole,g=e.renderMenuOnMount,Z=e.disabled,j=e.href,v=e.id,b=(0,s.Z)(e,u);return i.createElement(l.Z,(0,t.Z)({ref:r},b),i.createElement(d.Z,{id:v,href:j,size:f,variant:m,disabled:Z,childBsPrefix:o},n),i.createElement(c.Z,{align:p,role:x,renderOnMount:g,rootCloseEvent:h},a))}));m.displayName="DropdownButton",m.propTypes=h,r.Z=m}}]);