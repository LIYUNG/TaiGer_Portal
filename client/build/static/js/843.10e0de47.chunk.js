"use strict";(self.webpackChunkdatta_able_rv18_0_4=self.webpackChunkdatta_able_rv18_0_4||[]).push([[843],{30843:function(e,a,t){t.d(a,{Z:function(){return C}});var i=t(18489),n=t(27853),r=t(84531),s=t(78932),c=t(66621),d=t(47313),o=t(64212),l=t(93298),u=t(54991),h=t(51426),g=t(51767),p=t(94611),m=t(86450),_=t(63849),x=t(31616),j=t(72880),Z=t(83109),f=t(83708),b=t(46417),y=function(e){(0,s.Z)(t,e);var a=(0,c.Z)(t);function t(){var e;(0,n.Z)(this,t);for(var r=arguments.length,s=new Array(r),c=0;c<r;c++)s[c]=arguments[c];return(e=a.call.apply(a,[this].concat(s))).state={error:null,timeouterror:null,unauthorizederror:null,role:"",isLoaded:e.props.isLoaded,academic_background:e.props.academic_background,application_preference:e.props.application_preference,updateconfirmed:!1,changed_academic:!1,changed_language:!1,changed_application_preference:!1},e.handleChange_ApplicationPreference=function(a){a.preventDefault();var t=(0,i.Z)({},e.state.application_preference);t[a.target.id]=a.target.value,e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{changed_application_preference:!0,application_preference:t})}))},e.handleChange_Academic=function(a){a.preventDefault();var t=(0,i.Z)({},e.state.academic_background.university);t[a.target.id]=a.target.value,e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{changed_academic:!0,academic_background:(0,i.Z)((0,i.Z)({},e.academic_background),{},{university:t})})}))},e.handleChange_Language=function(a){a.preventDefault();var t=(0,i.Z)({},e.state.academic_background.language);t[a.target.id]=a.target.value,"english_certificate"===a.target.id&&("No"===a.target.value?t.english_score="":t.english_test_date=""),"german_certificate"===a.target.id&&("No"===a.target.value?t.german_score="":t.german_test_date=""),e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{changed_language:!0,academic_background:(0,i.Z)((0,i.Z)({},e.academic_background),{},{language:t})})}))},e.Bayerische_Formel=function(e,a,t){return e-a!==0?(1+3*(e-t)/(e-a)).toFixed(2):0},e.onHide=function(){e.setState({updateconfirmed:!1})},e.setmodalhide=function(){e.setState({updateconfirmed:!1})},e}return(0,r.Z)(t,[{key:"render",value:function(){var e=this,a=this.state,t=a.unauthorizederror,i=a.timeouterror;a.isLoaded;if(i)return(0,b.jsx)("div",{children:(0,b.jsx)(p.Z,{})});if(t)return(0,b.jsx)("div",{children:(0,b.jsx)(m.Z,{})});return(0,b.jsxs)(u.Z,{children:[(!(0,f._D)(this.props.academic_background)||!(0,f.pM)(this.props.application_preference))&&(0,b.jsx)(_.Z,{children:(0,b.jsx)(x.Z,{children:(0,b.jsx)(j.Z,{className:"my-2 mx-0",bg:"danger",text:"light",children:(0,b.jsxs)(j.Z.Body,{children:["The followings information are still missing:"," ",this.props.academic_background&&!this.props.academic_background.university.attended_high_school&&(0,b.jsx)("li",{children:(0,b.jsx)("b",{children:"High School Name"})}),this.props.application_preference&&!this.props.application_preference.expected_application_date&&(0,b.jsx)("li",{children:(0,b.jsx)("b",{children:"Expected Application Year"})}),this.props.application_preference&&!this.props.application_preference.expected_application_semester&&(0,b.jsx)("li",{children:(0,b.jsx)("b",{children:"Expected Application Semester"})})]})})})}),(0,b.jsx)(_.Z,{children:(0,b.jsxs)(x.Z,{children:[(0,b.jsxs)(j.Z,{className:"my-0 mx-0",bg:"dark",text:"white",children:[(0,b.jsx)(j.Z.Header,{children:(0,b.jsx)(j.Z.Title,{className:"my-0 mx-0 text-light",children:"Academic Background Surney"})}),(0,b.jsxs)(j.Z.Body,{children:[(0,b.jsx)(_.Z,{children:(0,b.jsx)("h4",{className:"my-2 mx-0 text-light",children:"High School"})}),(0,b.jsxs)(_.Z,{children:[(0,b.jsx)(x.Z,{md:6,children:(0,b.jsxs)(Z.Z.Group,{controlId:"attended_high_school",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"High School Name"}),(0,b.jsx)(Z.Z.Control,{type:"text",placeholder:"Taipei First Girls' High School",onChange:function(a){return e.handleChange_Academic(a)},defaultValue:this.state.academic_background.university&&this.state.academic_background.university.attended_high_school?this.state.academic_background.university.attended_high_school:""})]})}),(0,b.jsxs)(x.Z,{md:6,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"high_school_graduated_year",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"High School Gradate Year"}),(0,b.jsx)(Z.Z.Control,{type:"text",placeholder:"2022",defaultValue:this.state.academic_background.university&&this.state.academic_background.university.high_school_graduated_year?this.state.academic_background.university.high_school_graduated_year:"",onChange:function(a){return e.handleChange_Academic(a)}})]}),(0,b.jsx)("br",{})]})]}),(0,b.jsx)(_.Z,{children:(0,b.jsx)("h4",{className:"my-2 mx-0 text-light",children:"University"})}),(0,b.jsxs)(_.Z,{children:[(0,b.jsx)(x.Z,{md:6,children:(0,b.jsxs)(Z.Z.Group,{controlId:"attended_university",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"University Name"}),(0,b.jsx)(Z.Z.Control,{type:"text",placeholder:"National Taiwan University",onChange:function(a){return e.handleChange_Academic(a)},defaultValue:this.state.academic_background.university&&this.state.academic_background.university.attended_university?this.state.academic_background.university.attended_university:""})]})}),(0,b.jsxs)(x.Z,{md:6,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"attended_university_program",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Program (Put together if double major)"}),(0,b.jsx)(Z.Z.Control,{type:"text",placeholder:"B.Sc, Mechanical Engineering",defaultValue:this.state.academic_background.university&&this.state.academic_background.university.attended_university_program?this.state.academic_background.university.attended_university_program:"",onChange:function(a){return e.handleChange_Academic(a)}})]}),(0,b.jsx)("br",{})]})]}),(0,b.jsxs)(_.Z,{children:[(0,b.jsxs)(x.Z,{md:6,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"isGraduated",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Already graduated?"}),(0,b.jsxs)(Z.Z.Control,{as:"select",defaultValue:this.state.academic_background.university&&this.state.academic_background.university.isGraduated?this.state.academic_background.university.isGraduated:"-",onChange:function(a){return e.handleChange_Academic(a)},children:[(0,b.jsx)("option",{children:"-"}),(0,b.jsx)("option",{children:"Yes"}),(0,b.jsx)("option",{children:"No"})]})]}),(0,b.jsx)("br",{})]}),this.state.academic_background.university&&"-"!==this.state.academic_background.university.isGraduated&&(0,b.jsx)(x.Z,{md:6,children:(0,b.jsxs)(Z.Z.Group,{controlId:"expected_grad_date",children:[(0,b.jsxs)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:["No"===this.state.academic_background.university.isGraduated&&"Expected Graduate Year","Yes"===this.state.academic_background.university.isGraduated&&"Graduated Year"]}),(0,b.jsxs)(Z.Z.Control,{as:"select",value:this.state.academic_background.university&&this.state.academic_background.university.expected_grad_date?this.state.academic_background.university.expected_grad_date:"",onChange:function(a){return e.handleChange_Academic(a)},children:[(0,b.jsx)("option",{value:"",children:"Please Select"}),(0,b.jsx)(b.Fragment,{children:(0,g._3)()})]})]})})]}),(0,b.jsxs)(_.Z,{children:[(0,b.jsx)(x.Z,{md:6,children:(0,b.jsxs)(Z.Z.Group,{controlId:"Highest_GPA_Uni",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Highest Score GPA of your university program (TODO: add instruction)"}),(0,b.jsx)(Z.Z.Control,{type:"number",placeholder:"4.3",defaultValue:this.state.academic_background.university&&this.state.academic_background.university.Highest_GPA_Uni,onChange:function(a){return e.handleChange_Academic(a)}})]})}),(0,b.jsxs)(x.Z,{md:6,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"Passing_GPA_Uni",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Passing Score GPA of your university program (TODO: add instruction)"}),(0,b.jsx)(Z.Z.Control,{type:"number",placeholder:"1.7",defaultValue:this.state.academic_background.university&&this.state.academic_background.university.Passing_GPA_Uni,onChange:function(a){return e.handleChange_Academic(a)}})]}),(0,b.jsx)("br",{})]})]}),(0,b.jsxs)(_.Z,{children:[(0,b.jsx)(x.Z,{md:6,children:(0,b.jsxs)(Z.Z.Group,{controlId:"My_GPA_Uni",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"My GPA (TODO: add instruction)"}),(0,b.jsx)(Z.Z.Control,{type:"number",placeholder:"3.8",defaultValue:this.state.academic_background.university&&this.state.academic_background.university.My_GPA_Uni,onChange:function(a){return e.handleChange_Academic(a)}})]})}),(0,b.jsxs)(x.Z,{md:6,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"bayerische_formel",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Corresponding German GPA System:"}),(0,b.jsx)("p",{className:"text-info",children:this.state.academic_background.university&&this.state.academic_background.university.My_GPA_Uni&&this.state.academic_background.university.Passing_GPA_Uni&&this.state.academic_background.university.Highest_GPA_Uni?this.Bayerische_Formel(this.state.academic_background.university.Highest_GPA_Uni,this.state.academic_background.university.Passing_GPA_Uni,this.state.academic_background.university.My_GPA_Uni):0})]}),(0,b.jsx)("br",{})]})]}),(0,b.jsxs)(_.Z,{children:[(0,b.jsxs)(x.Z,{md:10,className:"my-0 mx-0 text-light",children:[(0,b.jsx)("br",{}),"Last update at:"," ",this.props.academic_background.university&&this.props.academic_background.university.updatedAt?(0,g.Ny)(this.props.academic_background.university.updatedAt):""]}),(0,b.jsxs)(x.Z,{md:2,children:[(0,b.jsx)("br",{}),(0,b.jsx)(l.Z,{variant:"primary",disabled:!this.state.changed_academic,onClick:function(a){return e.props.handleSubmit_AcademicBackground(a,e.state.academic_background.university)},children:"Update"}),(0,b.jsx)("br",{})]})]})]})]}),(0,b.jsxs)(j.Z,{className:"my-4 mx-0",bg:"dark",text:"white",children:[(0,b.jsx)(j.Z.Header,{children:(0,b.jsx)(j.Z.Title,{className:"my-0 mx-0 text-light",children:"Application Preference"})}),(0,b.jsxs)(j.Z.Body,{children:[(0,b.jsxs)(_.Z,{children:[(0,b.jsxs)(x.Z,{md:6,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"expected_application_date",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Expected Application Year"}),(0,b.jsxs)(Z.Z.Control,{as:"select",defaultValue:this.state.application_preference&&this.state.application_preference.expected_application_date?this.state.application_preference.expected_application_date:"",onChange:function(a){return e.handleChange_ApplicationPreference(a)},children:[(0,b.jsx)("option",{value:"",children:"Please Select"}),(0,b.jsx)(b.Fragment,{children:(0,g.xL)()})]})]}),(0,b.jsx)("br",{})]}),(0,b.jsxs)(x.Z,{md:6,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"expected_application_semester",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Expected Application Semester"}),(0,b.jsxs)(Z.Z.Control,{as:"select",defaultValue:this.state.application_preference&&this.state.application_preference.expected_application_semester?this.state.application_preference.expected_application_semester:"",onChange:function(a){return e.handleChange_ApplicationPreference(a)},children:[(0,b.jsx)("option",{value:"",children:"Please Select"}),(0,b.jsx)("option",{value:"WS",children:"Winter Semester (Semester begins on October)"}),(0,b.jsx)("option",{value:"SS",children:"Summer Semester (Semester begins on April)"}),(0,b.jsx)("option",{value:"WSSS",children:"Winter + Summer Semester"})]})]}),(0,b.jsx)("br",{})]})]}),(0,b.jsx)(_.Z,{children:(0,b.jsx)(x.Z,{md:6,children:(0,b.jsxs)(Z.Z,{children:[(0,b.jsxs)(Z.Z.Group,{controlId:"target_application_field",className:"my-0 mx-0",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Target Application Fields"}),(0,b.jsx)(Z.Z.Control,{type:"text",placeholder:"M.Sc. Data Science, MBA, etc.",defaultValue:this.state.application_preference&&this.state.application_preference.target_application_field?this.state.application_preference.target_application_field:"",onChange:function(a){return e.handleChange_ApplicationPreference(a)}})]}),(0,b.jsxs)(Z.Z.Group,{controlId:"application_outside_germany",className:"my-4 mx-0",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Considering universities outsid Germany?"}),(0,b.jsxs)(Z.Z.Control,{as:"select",defaultValue:this.state.application_preference&&this.state.application_preference.application_outside_germany?this.state.application_preference.application_outside_germany:"-",onChange:function(a){return e.handleChange_ApplicationPreference(a)},children:[(0,b.jsx)("option",{value:"-",children:"Please Select"}),(0,b.jsx)("option",{children:"Yes"}),(0,b.jsx)("option",{children:"No"})]})]}),(0,b.jsxs)(Z.Z.Group,{controlId:"considered_privat_universities",className:"my-0 mx-0",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Considering private universities? (Tuition Fee: ~15000 EURO/year)"}),(0,b.jsxs)(Z.Z.Control,{as:"select",defaultValue:this.state.application_preference&&this.state.application_preference.considered_privat_universities?this.state.application_preference.considered_privat_universities:"-",onChange:function(a){return e.handleChange_ApplicationPreference(a)},children:[(0,b.jsx)("option",{value:"-",children:"Please Select"}),(0,b.jsx)("option",{children:"Yes"}),(0,b.jsx)("option",{children:"No"})]})]})]})})})," ",(0,b.jsxs)(_.Z,{children:[(0,b.jsxs)(x.Z,{md:10,className:"my-0 mx-0 text-light",children:[(0,b.jsx)("br",{}),"Last update at:"," ",this.props.application_preference&&this.props.application_preference.updatedAt?(0,g.Ny)(this.props.application_preference.updatedAt):""]}),(0,b.jsxs)(x.Z,{md:2,children:[(0,b.jsx)("br",{}),(0,b.jsx)(l.Z,{variant:"primary",disabled:!this.state.changed_application_preference,onClick:function(a){return e.props.handleSubmit_ApplicationPreference(a,e.state.application_preference)},children:"Update"}),(0,b.jsx)("br",{})]})]})]})]}),(0,b.jsxs)(j.Z,{className:"my-4 mx-0",bg:"dark",text:"white",children:[(0,b.jsx)(j.Z.Header,{children:(0,b.jsx)(j.Z.Title,{className:"my-0 mx-0 text-light",children:"Languages"})}),(0,b.jsxs)(j.Z.Body,{children:[(0,b.jsxs)(_.Z,{children:[(0,b.jsx)(x.Z,{md:4,children:(0,b.jsxs)(Z.Z.Group,{controlId:"english_certificate",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"English Certificate"}),(0,b.jsxs)(Z.Z.Control,{as:"select",value:this.state.academic_background.language&&this.state.academic_background.language.english_certificate?this.state.academic_background.language.english_certificate:"",onChange:function(a){return e.handleChange_Language(a)},children:[(0,b.jsx)("option",{value:"No",children:"No"}),(0,b.jsx)("option",{value:"TOEFL",children:"TOEFL"}),(0,b.jsx)("option",{value:"IELTS",children:"IELTS"})]})]})}),(0,b.jsxs)(x.Z,{md:4,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"english_score",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"English Test Score"}),(0,b.jsx)(Z.Z.Control,{type:"text",placeholder:"(i.e. TOEFL: 94, or IELTS: 6.5) ",value:this.state.academic_background.language&&this.state.academic_background.language.english_score?this.state.academic_background.language.english_score:"",disabled:!(!this.state.academic_background.language||"No"!==this.state.academic_background.language.english_certificate),onChange:function(a){return e.handleChange_Language(a)}})]}),(0,b.jsx)("br",{})]}),(0,b.jsx)(x.Z,{md:4,children:(0,b.jsxs)(Z.Z.Group,{controlId:"english_test_date",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Expected Test Date"}),(0,b.jsx)(Z.Z.Control,{type:"date",value:this.state.academic_background.language&&this.state.academic_background.language.english_test_date?this.state.academic_background.language.english_test_date:"",disabled:!this.state.academic_background.language||"No"!==this.state.academic_background.language.english_certificate,placeholder:"Date of English Test",onChange:function(a){return e.handleChange_Language(a)}})]})})]}),(0,b.jsxs)(_.Z,{children:[(0,b.jsx)(x.Z,{md:4,children:(0,b.jsxs)(Z.Z.Group,{controlId:"german_certificate",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"German Certificate"}),(0,b.jsxs)(Z.Z.Control,{as:"select",value:this.state.academic_background.language&&this.state.academic_background.language.german_certificate?this.state.academic_background.language.german_certificate:"",onChange:function(a){return e.handleChange_Language(a)},children:[(0,b.jsx)("option",{value:"No",children:"No"}),(0,b.jsx)("option",{value:"Goethe Zertifikat A2",children:"Goethe Zertifikat A2"}),(0,b.jsx)("option",{value:"Goethe Zertifikat B1",children:"Goethe Zertifikat B1"}),(0,b.jsx)("option",{value:"Goethe Zertifikat B2",children:"Goethe Zertifikat B2"}),(0,b.jsx)("option",{value:"Goethe Zertifikat C1",children:"Goethe Zertifikat C1"}),(0,b.jsx)("option",{value:"TestDaF",children:"TestDaF"}),(0,b.jsx)("option",{value:"DSH",children:"DSH"})]})]})}),(0,b.jsxs)(x.Z,{md:4,children:[(0,b.jsxs)(Z.Z.Group,{controlId:"german_score",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"German Test Score"}),(0,b.jsx)(Z.Z.Control,{type:"text",placeholder:"(i.e. TestDaF: 4, or DSH: 2) ",value:this.state.academic_background.language&&this.state.academic_background.language.german_score?this.state.academic_background.language.german_score:"",disabled:!(!this.state.academic_background.language||"No"!==this.state.academic_background.language.german_certificate),onChange:function(a){return e.handleChange_Language(a)}})]}),(0,b.jsx)("br",{})]}),(0,b.jsx)(x.Z,{md:4,children:(0,b.jsxs)(Z.Z.Group,{controlId:"german_test_date",children:[(0,b.jsx)(Z.Z.Label,{className:"my-0 mx-0 text-light",children:"Expected Test Date"}),(0,b.jsx)(Z.Z.Control,{type:"date",value:this.state.academic_background.language&&this.state.academic_background.language.german_test_date?this.state.academic_background.language.german_test_date:"",disabled:!this.state.academic_background.language||"No"!==this.state.academic_background.language.german_certificate,placeholder:"Date of Germa Test",onChange:function(a){return e.handleChange_Language(a)}})]})})]}),(0,b.jsxs)(_.Z,{children:[(0,b.jsxs)(x.Z,{md:10,className:"my-0 mx-0 text-light",children:[(0,b.jsx)("br",{}),"Last update at:"," ",this.props.academic_background.language&&this.props.academic_background.language.updatedAt?(0,g.Ny)(this.props.academic_background.language.updatedAt):""]}),(0,b.jsxs)(x.Z,{md:2,children:[(0,b.jsx)("br",{}),(0,b.jsx)(l.Z,{variant:"primary",disabled:!this.state.changed_language,onClick:function(a){return e.props.handleSubmit_Language(a,e.state.academic_background.language)},children:"Update"}),(0,b.jsx)("br",{})]})]})]})]})]})})]})}}]),t}(d.Component),v=y,k=function(e){(0,s.Z)(t,e);var a=(0,c.Z)(t);function t(){var e;(0,n.Z)(this,t);for(var r=arguments.length,s=new Array(r),c=0;c<r;c++)s[c]=arguments[c];return(e=a.call.apply(a,[this].concat(s))).state={error:null,timeouterror:null,unauthorizederror:null,role:"",isLoaded:e.props.isLoaded,student_id:e.props.student_id,success:!1,academic_background:e.props.academic_background,application_preference:e.props.application_preference,updateconfirmed:!1,changed_academic:!1,changed_application_preference:!1,changed_language:!1},e.handleSubmit_AcademicBackground=function(a,t){a.preventDefault(),(0,h.zg)(t,e.state.student_id).then((function(a){var t=a.data,n=t.data,r=t.success;r?e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{changed_academic:!1,academic_background:(0,i.Z)((0,i.Z)({},e.academic_background),{},{university:n}),success:r,updateconfirmed:!0})})):401===a.status||500===a.status?e.setState({isLoaded:!0,timeouterror:!0}):403===a.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(a){e.setState({isLoaded:!0,error:!0})}))},e.handleSubmit_Language=function(a,t){a.preventDefault(),(0,h.v2)(t,e.state.student_id).then((function(a){var t=a.data,n=t.data,r=t.success;r?e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{isLoaded:!0,changed_language:!0,academic_background:(0,i.Z)((0,i.Z)({},e.academic_background),{},{language:n}),success:r,updateconfirmed:!0})})):401===a.status||500===a.status?e.setState({isLoaded:!0,timeouterror:!0}):403===a.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(a){e.setState({isLoaded:!0,error:!0})}))},e.handleSubmit_ApplicationPreference=function(a,t){a.preventDefault(),(0,h.a5)(t,e.state.student_id).then((function(a){var t=a.data,n=t.data,r=t.success;r?e.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{isLoaded:!0,changed_application_preference:!0,application_preference:n,success:r,updateconfirmed:!0})})):401===a.status||500===a.status?e.setState({isLoaded:!0,timeouterror:!0}):403===a.status&&e.setState({isLoaded:!0,unauthorizederror:!0})}),(function(a){e.setState({isLoaded:!0,error:!0})}))},e.onHide=function(){e.setState({updateconfirmed:!1})},e.setmodalhide=function(){e.setState({updateconfirmed:!1})},e}return(0,r.Z)(t,[{key:"componentDidMount",value:function(){var e=this;this.props.student_id||this.setState((function(a){return(0,i.Z)((0,i.Z)({},a),{},{academic_background:e.props.academic_background,student_id:e.props.user._id})}))}},{key:"componentDidUpdate",value:function(e){var a=this;e.academic_background!==this.props.academic_background&&this.setState((function(e){return(0,i.Z)((0,i.Z)({},e),{},{academic_background:a.props.academic_background})}))}},{key:"render",value:function(){var e=this.state,a=e.unauthorizederror,t=e.timeouterror;e.isLoaded;return t?(0,b.jsx)("div",{children:(0,b.jsx)(p.Z,{})}):a?(0,b.jsx)("div",{children:(0,b.jsx)(m.Z,{})}):(0,b.jsxs)(u.Z,{children:[(0,b.jsx)(v,{academic_background:this.state.academic_background,application_preference:this.state.application_preference,user:this.props.user,student_id:this.state.student_id,handleSubmit_AcademicBackground:this.handleSubmit_AcademicBackground,handleSubmit_Language:this.handleSubmit_Language,handleSubmit_ApplicationPreference:this.handleSubmit_ApplicationPreference})," ",(0,b.jsxs)(o.Z,{show:this.state.updateconfirmed,onHide:this.onHide,size:"sm","aria-labelledby":"contained-modal-title-vcenter",centered:!0,children:[(0,b.jsx)(o.Z.Header,{children:(0,b.jsx)(o.Z.Title,{id:"contained-modal-title-vcenter",children:"Update success"})}),(0,b.jsx)(o.Z.Body,{children:"Academic Background Surney is updated successfully!"}),(0,b.jsx)(o.Z.Footer,{children:(0,b.jsx)(l.Z,{onClick:this.setmodalhide,children:"Close"})})]})]})}}]),t}(d.Component),C=k}}]);