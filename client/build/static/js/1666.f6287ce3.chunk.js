"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[1666],{50099:function(e,t,n){var r=n(35531),a=n(27853),s=n(84531),i=n(78932),o=n(66621),d=n(47313),c=n(58050),l=n(72880),u=n(88815),h=n(29678),p=n.n(h),f=n(54991),m=n(12401),v=n(46417),g=function(e){(0,i.Z)(n,e);var t=(0,o.Z)(n);function n(){var e;(0,a.Z)(this,n);for(var r=arguments.length,s=new Array(r),i=0;i<r;i++)s[i]=arguments[i];return(e=t.call.apply(t,[this].concat(s))).state={isOption:e.props.isOption,fullCard:!1,collapseCard:!1,loadCard:!1,cardRemove:!1},e.cardReloadHandler=function(){e.setState({loadCard:!0}),setInterval((function(){e.setState({loadCard:!1})}),3e3)},e.cardRemoveHandler=function(){e.setState({cardRemove:!0})},e}return(0,s.Z)(n,[{key:"render",value:function(){var e,t,n,a,s,i=this,o=[];return this.state.isOption&&(n=(0,v.jsx)("div",{className:"card-header-right",children:(0,v.jsxs)(c.Z,{alignRight:!0,className:"btn-group card-option",children:[(0,v.jsx)(c.Z.Toggle,{id:"dropdown-basic",className:"btn-icon",children:(0,v.jsx)("i",{className:"feather icon-more-horizontal"})}),(0,v.jsxs)(c.Z.Menu,{as:"ul",className:"list-unstyled card-option",children:[(0,v.jsxs)(c.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){i.setState((function(e){return{fullCard:!e.fullCard}}))},children:[(0,v.jsx)("i",{className:this.state.fullCard?"feather icon-minimize":"feather icon-maximize"}),(0,v.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.fullCard?"Restore":"Maximize"," "]})]}),(0,v.jsxs)(c.Z.Item,{as:"li",className:"dropdown-item",onClick:function(){i.setState((function(e){return{collapseCard:!e.collapseCard}}))},children:[(0,v.jsx)("i",{className:this.state.collapseCard?"feather icon-plus":"feather icon-minus"}),(0,v.jsxs)("a",{href:m.Z.BLANK_LINK,children:[" ",this.state.collapseCard?"Expand":"Collapse"," "]})]}),(0,v.jsxs)(c.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardReloadHandler,children:[(0,v.jsx)("i",{className:"feather icon-refresh-cw"}),(0,v.jsx)("a",{href:m.Z.BLANK_LINK,children:" Reload "})]}),(0,v.jsxs)(c.Z.Item,{as:"li",className:"dropdown-item",onClick:this.cardRemoveHandler,children:[(0,v.jsx)("i",{className:"feather icon-trash"}),(0,v.jsx)("a",{href:m.Z.BLANK_LINK,children:" Remove "})]})]})]})})),a=(0,v.jsxs)(l.Z.Header,{children:[(0,v.jsx)(l.Z.Title,{as:"h5",children:this.props.title}),n]}),this.state.fullCard&&(o=[].concat((0,r.Z)(o),["full-card"]),e={position:"fixed",top:0,left:0,right:0,width:this.props.windowWidth,height:this.props.windowHeight}),this.state.loadCard&&(o=[].concat((0,r.Z)(o),["card-load"]),t=(0,v.jsx)("div",{className:"card-loader",children:(0,v.jsx)("i",{className:"pct-loader1 anim-rotate"})})),this.state.cardRemove&&(o=[].concat((0,r.Z)(o),["d-none"])),this.props.cardClass&&(o=[].concat((0,r.Z)(o),[this.props.cardClass])),s=(0,v.jsxs)(l.Z,{className:o.join(" "),style:e,children:[a,(0,v.jsx)(u.Z,{in:!this.state.collapseCard,children:(0,v.jsx)("div",{children:(0,v.jsx)(l.Z.Body,{children:this.props.children})})}),t]}),(0,v.jsx)(f.Z,{children:s})}}]),n}(d.Component);t.Z=p()(g)},11032:function(e,t,n){n.r(t);var r=n(36222),a=n(18489),s=n(27853),i=n(84531),o=n(78932),d=n(66621),c=n(47313),l=n(44030),u=n(63849),h=n(31616),p=n(32441),f=n(95364),m=n(54991),v=n(86801),g=n(51767),x=n(51426),Z=n(94611),j=n(86450),b=n(46417),y=function(e){(0,o.Z)(n,e);var t=(0,d.Z)(n);function n(){var e;(0,s.Z)(this,n);for(var i=arguments.length,o=new Array(i),d=0;d<i;d++)o[d]=arguments[d];return(e=t.call.apply(t,[this].concat(o))).state={error:null,timeouterror:null,unauthorizederror:null,modalShow:!1,agent_list:[],editor_list:[],isLoaded:!1,students:[],updateAgentList:{},updateEditorList:{},success:!1,isArchivPage:!0},e.editAgent=function(t){(0,x.j8)().then((function(n){var s=n.data.data,i=t.agents,o=s.reduce((function(e,t){var n=t._id;return(0,a.Z)((0,a.Z)({},e),{},(0,r.Z)({},n,!!i&&i.indexOf(n)>-1))}),{});e.setState({agent_list:s,updateAgentList:o})}),(function(e){}))},e.editEditor=function(t){(0,x.TB)().then((function(n){var s=n.data.data,i=t.editors,o=s.reduce((function(e,t){var n=t._id;return(0,a.Z)((0,a.Z)({},e),{},(0,r.Z)({},n,!!i&&i.indexOf(n)>-1))}),{});e.setState({editor_list:s,updateEditorList:o})}),(function(e){}))},e.handleChangeAgentlist=function(t){var n=t.target,s=n.value,i=n.checked;e.setState((function(e){return{updateAgentList:(0,a.Z)((0,a.Z)({},e.updateAgentList),{},(0,r.Z)({},s,i))}}))},e.handleChangeEditorlist=function(t){var n=t.target,s=n.value,i=n.checked;e.setState((function(e){return{updateEditorList:(0,a.Z)((0,a.Z)({},e.updateEditorList),{},(0,r.Z)({},s,i))}}))},e.submitUpdateAgentlist=function(t,n){e.UpdateAgentlist(t,n)},e.submitUpdateEditorlist=function(t,n){e.UpdateEditorlist(t,n)},e.UpdateAgentlist=function(t,n){(0,x.u)(t,n).then((function(t){e.setState({updateAgentList:[],isLoaded:!1})}),(function(e){alert("UpdateAgentlist is failed.")}))},e.UpdateEditorlist=function(t,n){(0,x.OJ)(t,n).then((function(t){e.setState({updateEditorList:[],isLoaded:!1})}),(function(e){alert("UpdateEditorlist is failed.")}))},e.updateStudentArchivStatus=function(t,n){(0,x.EQ)(t,n).then((function(t){var n=t.data,r=n.data,a=n.success;e.setState({isLoaded:!0,students:r,success:a})}),(function(t){e.setState({isLoaded:!0,error:t})}))},e}return(0,i.Z)(n,[{key:"componentDidMount",value:function(){var e=this;(0,x.aj)().then((function(t){var n=t.data,r=n.data,a=n.success;a?e.setState({isLoaded:!0,students:r,success:a}):401===t.status||500===t.status?e.setState({isLoaded:!0,timeouterror:!0}):403===t.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(t){e.setState({isLoaded:!0,error:t})}))}},{key:"componentDidUpdate",value:function(e,t){var n=this;!1===this.state.isLoaded&&(0,x.aj)().then((function(e){var t=e.data,r=t.data,a=t.success;a?n.setState({isLoaded:!0,students:r,success:a}):alert(e.data.message)}),(function(e){n.setState({isLoaded:!0,error:!0})}))}},{key:"render",value:function(){var e=this.state,t=e.unauthorizederror,n=e.timeouterror,r=e.isLoaded;if(n)return(0,b.jsx)("div",{children:(0,b.jsx)(Z.Z,{})});if(t)return(0,b.jsx)("div",{children:(0,b.jsx)(j.Z,{})});var a={position:"fixed",top:"40%",left:"50%",transform:"translate(-50%, -50%)"};return r||this.state.data?this.state.success?(0,b.jsx)(m.Z,{children:(0,b.jsx)(u.Z,{children:(0,b.jsxs)(h.Z,{children:[(0,b.jsx)(p.Z,{defaultActiveKey:"w",id:"uncontrolled-tab-example",children:(0,b.jsx)(f.Z,{eventKey:"w",title:"My Closed Student",children:"Admin"===this.props.user.role||"Agent"===this.props.user.role||"Editor"===this.props.user.role?(0,b.jsx)(v.Z,{role:this.props.user.role,students:this.state.students,editAgent:this.state.editAgent,editEditor:this.state.editEditor,agent_list:this.state.agent_list,editor_list:this.state.editor_list,updateAgentList:this.state.updateAgentList,handleChangeAgentlist:this.handleChangeAgentlist,submitUpdateAgentlist:this.submitUpdateAgentlist,updateEditorList:this.state.updateEditorList,handleChangeEditorlist:this.handleChangeEditorlist,submitUpdateEditorlist:this.submitUpdateEditorlist,updateStudentArchivStatus:this.updateStudentArchivStatus,isArchivPage:this.state.isArchivPage,SYMBOL_EXPLANATION:g.vE}):(0,b.jsx)(b.Fragment,{})})}),!r&&(0,b.jsx)("div",{style:a,children:(0,b.jsx)(l.Z,{animation:"border",role:"status",children:(0,b.jsx)("span",{className:"visually-hidden"})})})]})})}):void 0:(0,b.jsx)("div",{style:a,children:(0,b.jsx)(l.Z,{animation:"border",role:"status",children:(0,b.jsx)("span",{className:"visually-hidden"})})})}}]),n}(c.Component);t.default=y},86801:function(e,t,n){n.d(t,{Z:function(){return v}});var r=n(27853),a=n(84531),s=n(78932),i=n(66621),o=n(47313),d=n(465),c=n(1590),l=n(58050),u=n(37062),h=n(46417),p=function(e){(0,s.Z)(n,e);var t=(0,i.Z)(n);function n(){var e;(0,r.Z)(this,n);for(var a=arguments.length,s=new Array(a),i=0;i<a;i++)s[i]=arguments[i];return(e=t.call.apply(t,[this].concat(s))).state={showAgentPage:!1,showEditorPage:!1,showProgramPage:!1,showFilePage:!1},e.setProgramModalhide=function(){e.setState({showProgramPage:!1})},e.startEditingProgram=function(){e.setState({showProgramPage:!0})},e.updateStudentArchivStatus=function(t,n){e.props.updateStudentArchivStatus(t,n)},e}return(0,a.Z)(n,[{key:"render",value:function(){var e=this;return(0,h.jsx)(h.Fragment,{children:(0,h.jsxs)("tr",{children:[(0,h.jsx)("td",{children:(0,h.jsxs)(c.Z,{size:"sm",className:"mx-0",title:"Option",variant:"primary",id:"dropdown-variants-".concat(this.props.student._id),children:[this.props.isDashboard?(0,h.jsx)(l.Z.Item,{eventKey:"5",onSelect:function(){return e.updateStudentArchivStatus(e.props.student._id,!0)},children:"Move to Archiv"}):(0,h.jsx)(h.Fragment,{}),this.props.isArchivPage?(0,h.jsx)(l.Z.Item,{eventKey:"6",onSelect:function(){return e.updateStudentArchivStatus(e.props.student._id,!1)},children:"Move to Active"}):(0,h.jsx)(h.Fragment,{})]},this.props.student._id)}),(0,h.jsxs)("td",{children:[(0,h.jsxs)(u.Z,{to:"/student-database/"+this.props.student._id+"/background",className:"text-info",style:{textDecoration:"none"},children:[this.props.student.firstname,", ",this.props.student.lastname]}),(0,h.jsx)("br",{}),this.props.student.email]}),(0,h.jsxs)("td",{children:[(0,h.jsx)("b",{children:this.props.student.academic_background.university.attended_university}),(0,h.jsx)("br",{}),this.props.student.academic_background.university.attended_university_program]}),(0,h.jsxs)("td",{children:[this.props.student.academic_background.language.english_certificate,(0,h.jsx)("br",{}),this.props.student.academic_background.language.german_certificate]}),(0,h.jsxs)("td",{children:[this.props.student.academic_background.language.english_score,(0,h.jsx)("br",{}),this.props.student.academic_background.language.german_score]}),(0,h.jsxs)("td",{children:[this.props.student.academic_background.language.english_test_date,(0,h.jsx)("br",{}),this.props.student.academic_background.language.german_test_date]})]})})}}]),n}(o.Component),f=p,m=(n(45110),function(e){(0,s.Z)(n,e);var t=(0,i.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,a.Z)(n,[{key:"render",value:function(){var e=this,t=(0,h.jsx)("tbody",{children:this.props.students.map((function(t,n){return(0,h.jsx)(f,{role:e.props.role,student:t,updateStudentArchivStatus:e.props.updateStudentArchivStatus,isDashboard:e.props.isDashboard,isArchivPage:e.props.isArchivPage},n)}))}),n=Object.values(window.academic_background_header);return(0,h.jsx)(h.Fragment,{children:(0,h.jsxs)(d.Z,{responsive:!0,bordered:!0,hover:!0,className:"my-0 mx-0",variant:"dark",text:"light",children:[(0,h.jsx)("thead",{children:(0,h.jsxs)("tr",{children:[(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)("th",{}),(0,h.jsxs)("th",{children:["First-, Last Name ",(0,h.jsx)("br",{})," Email"]})]}),n.map((function(e,t){return(0,h.jsx)("th",{children:e},t)}))]})}),t]})})}}]),n}(o.Component)),v=m},94611:function(e,t,n){var r=n(27853),a=n(84531),s=n(78932),i=n(66621),o=n(47313),d=n(63849),c=n(31616),l=n(50099),u=n(54991),h=n(46417),p=function(e){(0,s.Z)(n,e);var t=(0,i.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,a.Z)(n,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(c.Z,{children:(0,h.jsx)(l.Z,{children:"Time out error. Please login again!"})})})})}}]),n}(o.Component);t.Z=p},86450:function(e,t,n){var r=n(27853),a=n(84531),s=n(78932),i=n(66621),o=n(47313),d=n(63849),c=n(31616),l=n(50099),u=n(54991),h=n(46417),p=function(e){(0,s.Z)(n,e);var t=(0,i.Z)(n);function n(){return(0,r.Z)(this,n),t.apply(this,arguments)}return(0,a.Z)(n,[{key:"render",value:function(){return(0,h.jsx)(u.Z,{children:(0,h.jsx)(d.Z,{children:(0,h.jsx)(c.Z,{children:(0,h.jsx)(l.Z,{children:"\u8acb\u8ddf\u60a8\u7684TaiGer\u9867\u554f\u806f\u7e6b"})})})})}}]),n}(o.Component);t.Z=p},51767:function(e,t,n){n.d(t,{Ny:function(){return p},Vb:function(){return f},_3:function(){return v},vE:function(){return h},xL:function(){return g}});n(47313);var r=n(57864),a=n(3394),s=n(58821),i=n(46417),o=(0,i.jsx)(a.cfq,{size:18,color:"limegreen",title:"Valid Document"}),d=(0,i.jsx)(r.LHV,{size:18,color:"red",title:"Invalid Document"}),c=(0,i.jsx)(r.QRz,{size:18,color:"orange",title:"Uploaded successfully"}),l=(0,i.jsx)(r.znh,{size:18,color:"lightgray",title:"No Document uploaded"}),u=(0,i.jsx)(s.pZ2,{size:18,color:"lightgray",title:"Not needed"}),h=(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("p",{className:"text-muted",children:" "}),(0,i.jsxs)("p",{className:"text-info",children:[o,": The document is valid and can be used in the application."]}),(0,i.jsxs)("p",{className:"text-info",children:[d,": The document is invalid and cannot be used in the application. Please properly scan a new one."]}),(0,i.jsxs)("p",{className:"text-info",children:[c,": The document is uploaded. Your agent will check it as soon as possible."]}),(0,i.jsxs)("p",{className:"text-info",children:[l,": Please upload the copy of the document."]}),(0,i.jsxs)("p",{className:"text-info",children:[u,": This document is not needed."]})," "]}),p=function(e){return new Date(e).toLocaleDateString()+", "+new Date(e).toLocaleTimeString()},f=function(e,t){var n=new Date(e),r=new Date(t).getTime()-n.getTime();return Math.round(r/864e5).toString()},m=function(e,t){var n=t-e;return Array.from({length:n},(function(t,n){return n+e}))},v=function(){return(0,i.jsx)(i.Fragment,{children:m(1950,2050).map((function(e,t){return(0,i.jsx)("option",{value:e,children:e},t)}))})},g=function(){return(0,i.jsx)(i.Fragment,{children:m(2022,2050).map((function(e,t){return(0,i.jsx)("option",{value:e,children:e},t)}))})}},60576:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){for(var e=arguments.length,t=Array(e),n=0;n<e;n++)t[n]=arguments[n];function r(){for(var e=arguments.length,n=Array(e),r=0;r<e;r++)n[r]=arguments[r];var a=null;return t.forEach((function(e){if(null==a){var t=e.apply(void 0,n);null!=t&&(a=t)}})),a}return(0,s.default)(r)};var r,a=n(62865),s=(r=a)&&r.__esModule?r:{default:r};e.exports=t.default},62865:function(e,t){Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){function t(t,n,r,a,s,i){var o=a||"<<anonymous>>",d=i||r;if(null==n[r])return t?new Error("Required "+s+" `"+d+"` was not specified in `"+o+"`."):null;for(var c=arguments.length,l=Array(c>6?c-6:0),u=6;u<c;u++)l[u-6]=arguments[u];return e.apply(void 0,[n,r,o,s,d].concat(l))}var n=t.bind(null,!1);return n.isRequired=t.bind(null,!0),n},e.exports=t.default},72880:function(e,t,n){n.d(t,{Z:function(){return C}});var r=n(1368),a=n(38321),s=n(46123),i=n.n(s),o=n(47313),d=n(68524),c=n(28864),l=n(96205),u=n(85348),h=["bsPrefix","className","variant","as"],p=o.forwardRef((function(e,t){var n=e.bsPrefix,s=e.className,c=e.variant,l=e.as,u=void 0===l?"img":l,p=(0,a.Z)(e,h),f=(0,d.vE)(n,"card-img");return o.createElement(u,(0,r.Z)({ref:t,className:i()(c?f+"-"+c:f,s)},p))}));p.displayName="CardImg",p.defaultProps={variant:null};var f=p,m=["bsPrefix","className","bg","text","border","body","children","as"],v=(0,l.Z)("h5"),g=(0,l.Z)("h6"),x=(0,c.Z)("card-body"),Z=(0,c.Z)("card-title",{Component:v}),j=(0,c.Z)("card-subtitle",{Component:g}),b=(0,c.Z)("card-link",{Component:"a"}),y=(0,c.Z)("card-text",{Component:"p"}),N=(0,c.Z)("card-header"),_=(0,c.Z)("card-footer"),A=(0,c.Z)("card-img-overlay"),E=o.forwardRef((function(e,t){var n=e.bsPrefix,s=e.className,c=e.bg,l=e.text,h=e.border,p=e.body,f=e.children,v=e.as,g=void 0===v?"div":v,Z=(0,a.Z)(e,m),j=(0,d.vE)(n,"card"),b=(0,o.useMemo)((function(){return{cardHeaderBsPrefix:j+"-header"}}),[j]);return o.createElement(u.Z.Provider,{value:b},o.createElement(g,(0,r.Z)({ref:t},Z,{className:i()(s,j,c&&"bg-"+c,l&&"text-"+l,h&&"border-"+h)}),p?o.createElement(x,null,f):f))}));E.displayName="Card",E.defaultProps={body:!1},E.Img=f,E.Title=Z,E.Subtitle=j,E.Body=x,E.Link=b,E.Text=y,E.Header=N,E.Footer=_,E.ImgOverlay=A;var C=E},85348:function(e,t,n){var r=n(47313).createContext(null);r.displayName="CardContext",t.Z=r},1590:function(e,t,n){var r=n(1368),a=n(38321),s=n(47313),i=n(75192),o=n.n(i),d=n(58050),c=n(1683),l=n(38388),u=["title","children","bsPrefix","rootCloseEvent","variant","size","menuAlign","menuRole","renderMenuOnMount","disabled","href","id"],h={id:o().any,href:o().string,onClick:o().func,title:o().node.isRequired,disabled:o().bool,menuAlign:l.r,menuRole:o().string,renderMenuOnMount:o().bool,rootCloseEvent:o().string,bsPrefix:o().string,variant:o().string,size:o().string},p=s.forwardRef((function(e,t){var n=e.title,i=e.children,o=e.bsPrefix,h=e.rootCloseEvent,p=e.variant,f=e.size,m=e.menuAlign,v=e.menuRole,g=e.renderMenuOnMount,x=e.disabled,Z=e.href,j=e.id,b=(0,a.Z)(e,u);return s.createElement(d.Z,(0,r.Z)({ref:t},b),s.createElement(c.Z,{id:j,href:Z,size:f,variant:p,disabled:x,childBsPrefix:o},n),s.createElement(l.Z,{align:m,role:v,renderOnMount:g,rootCloseEvent:h},i))}));p.displayName="DropdownButton",p.propTypes=h,t.Z=p},22868:function(e,t,n){var r,a=n(1368),s=n(38321),i=n(46123),o=n.n(i),d=n(47313),c=n(67557),l=n(59498),u=n(6280),h=["className","children"],p=((r={})[c.d0]="show",r[c.cn]="show",r),f=d.forwardRef((function(e,t){var n=e.className,r=e.children,i=(0,s.Z)(e,h),f=(0,d.useCallback)((function(e){(0,u.Z)(e),i.onEnter&&i.onEnter(e)}),[i]);return d.createElement(c.ZP,(0,a.Z)({ref:t,addEndListener:l.Z},i,{onEnter:f}),(function(e,t){return d.cloneElement(r,(0,a.Z)({},t,{className:o()("fade",n,r.props.className,p[e])}))}))}));f.defaultProps={in:!1,timeout:300,mountOnEnter:!1,unmountOnExit:!1,appear:!1},f.displayName="Fade",t.Z=f},63849:function(e,t,n){var r=n(1368),a=n(38321),s=n(46123),i=n.n(s),o=n(47313),d=n(68524),c=["bsPrefix","className","noGutters","as"],l=["xl","lg","md","sm","xs"],u=o.forwardRef((function(e,t){var n=e.bsPrefix,s=e.className,u=e.noGutters,h=e.as,p=void 0===h?"div":h,f=(0,a.Z)(e,c),m=(0,d.vE)(n,"row"),v=m+"-cols",g=[];return l.forEach((function(e){var t,n=f[e];delete f[e];var r="xs"!==e?"-"+e:"";null!=(t=null!=n&&"object"===typeof n?n.cols:n)&&g.push(""+v+r+"-"+t)})),o.createElement(p,(0,r.Z)({ref:t},f,{className:i().apply(void 0,[s,m,u&&"no-gutters"].concat(g))}))}));u.displayName="Row",u.defaultProps={noGutters:!1},t.Z=u},96205:function(e,t,n){var r=n(1368),a=n(47313),s=n(46123),i=n.n(s);t.Z=function(e){return a.forwardRef((function(t,n){return a.createElement("div",(0,r.Z)({},t,{ref:n,className:i()(t.className,e)}))}))}},94360:function(e,t,n){function r(e,t){return r=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},r(e,t)}function a(e,t){e.prototype=Object.create(t.prototype),e.prototype.constructor=e,r(e,t)}n.d(t,{Z:function(){return a}})}}]);