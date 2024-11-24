import { appConfig } from '../config';
import admissions from '../i18n/zh-TW/admissions.json';
import auth from '../i18n/zh-TW/auth.json';
import common from '../i18n/zh-TW/common.json';
import courses from '../i18n/zh-TW/courses.json';
import cvmlrl from '../i18n/zh-TW/cvmlrl.json';
import customerCenter from '../i18n/zh-TW/customerCenter.json';
import dashboard from '../i18n/zh-TW/dashboard.json';
import documents from '../i18n/zh-TW/documents.json';
import interviews from '../i18n/zh-TW/interviews.json';
import programList from '../i18n/zh-TW/programList.json';
import uniassist from '../i18n/zh-TW/uniassist.json';
import portalManagement from '../i18n/zh-TW/portalManagement.json';
import survey from '../i18n/zh-TW/survey.json';
import visa from '../i18n/zh-TW/visa.json';

export const translation_zh_TW = {
  auth: auth,
  common: common,
  customerCenter: customerCenter,
  dashboard: dashboard,
  documents: documents,
  programList: programList,
  logs: {
    'User Logs': '使用者紀錄'
  },
  tickets: {
    'Do you want to delete this ticket?': '您想刪除這個客服請求嗎？'
  },
  backgroundProfile: {},
  admissions: admissions,
  cvmlrl: cvmlrl,
  courses: courses,
  uniassist: uniassist,
  interviews: interviews,
  portalManagement: portalManagement,
  survey: survey,
  visa: visa,
  translation: {
    'No Editors Students': '無編輯之學生',
    'Interview Time': '面試時間',
    'Your timezone local time': '您所在時區時間',
    'Interview Program': '面試學程',
    Overview: '總攬',
    'Active Student List': '申請中學生名單',
    'Programs Update Status': '學程更新狀況',
    'Decided Programs Update Status': '已確定申請學程更新狀況',
    'Do you want to delete': '您想要刪除',
    'Do you want to cancel this meeting?': '您想要取消這次會議嗎?',
    [`Please fill our ${appConfig.companyName} template and attach the filled template and reply in English in this discussion. Any process question`]: `請填好我們的 ${appConfig.companyName} Template，並在這個討論串夾帶在和您的 Editor 討論。回覆時請用 英語(English) 好讓外籍顧問方便溝通。有任何流程疑問`,
    'Tell me about your result': '請告訴我們您的申請結果',
    'Have you received the interview invitation from this program?':
      '您是否收到此學程的面試邀請通知？若有的話請告知我們，我們會盡速安排與 TaiGer 面試官做模擬面試',
    'Change your result': '更改申請結果',
    'New agent is assigned to you': '新的顧問已指派給您。',

    'Last update at': '最後更新於',
    'Application Preference From Survey': '根據問卷的申請科系偏好',
    'Academic Background Survey': '學術背景問卷',
    'Application Preference': '申請科系偏好',
    'Languages Test and Certificates': '語言考試語檢定',
    'Do you need English Test': '您需要英語檢定嗎',
    'GRE Test passed ?': 'GRE 考試通過嗎 ?',
    'GMAT Test passed ?': 'GMAT 考試通過嗎 ?',
    'Do you need GMAT Test': '您需要 GMAT 考試嗎',
    'Do you need GRE Test': '您需要 GRE 考試嗎',
    'The following program needs uni-assist process, please check if paid, uploaded document and upload VPD here':
      '以下學程需要額外處理 Uni-Assist，請確認是否上傳文件、付款並上傳 VPD 文件於此處',
    'Instructions: Follow the documentations in':
      '請依照指示，完成Uni-Assist帳號密碼以及上傳資料',
    'Based on the applications, Uni-Assist is NOT needed':
      '根據您的欲申請的學程， 您並不需要處理 Uni-Assist 第三方學歷認證流程。',
    'Course Analysis explanation button': '點我詳細解說',
    'New feedback from your Editor': '您有來自編輯的新回復',
    'New tasks are assigned to you': '有新的任務指派給你',
    'It looks like you did not decide programs': '您仍有科系尚未決定',
    'Some of Base Documents are rejected': '你有上傳的文件不合格',
    'Some of Base Documents are still missing': '你有缺少文件',
    Attention: '注意',
    Instructions: '說明',
    Requirements: '要求',
    'Do you want to set the application of': '您確定要設定此申請',
    'Do you want to reset the result of the application of':
      '您確定要重設申請結果嗎？',
    'Please finish it as soon as possible': '請您盡速處理以下事項',
    'Expected English Test Date': '預計英語檢定考試日期',
    'Expected German Test Date': '預計德語檢定考試日期',
    'Check uploaded base documents': '請確認學生上傳的文件',
    'No Enough Program Decided Tasks': '尚未選足申請學校數量',
    'Please select enough programs for': '請選擇足夠的學程給',
    'CV Not Assigned Yet': 'CV 尚未指派給學生',
    'The followings information are still missing':
      '請盡速填好以下問卷問題，這將會影響Agent處理您的申請進度',
    'Your language skills and certificates information are still missing or not up-to-date':
      '請盡速更新您的語言檢定資訊，這將會影響Agent了解您的申請時程',
    'Considering universities outside Germany?': '考慮德國以外的學校嗎？',
    'High School': '高中',
    'High School graduate status': '高中畢業狀態',
    'High School Name (English)': '高中名稱 (英語)',
    'High School already graduated': '高中畢業',
    'High School Graduate Year': '高中畢業年份',
    'Expected High School Graduate Year': '預計高中畢業年份',
    'High School Graduate leaved Year': '肄業高中年份',
    'Expected Application Year': '預計要入學的年度',
    'Expected Application Semester': '預計要入學的學期',
    'University Name': '大學名稱',
    'University Name (Bachelor degree)': '大學名稱 (學士)',
    'University Name (Second degree)': '大學名稱 (第二學位)',
    'Program Name': '科系名稱',
    'Program Name / Not study yet': '科系名稱 / 尚未就讀',
    'Already Bachelor graduated ?': '已大學畢業 ?',
    'Graduated Year': '畢業年份',
    'Expected Graduate Year': '預計畢業年',
    'Exchange Student Experience ?': '大學交換學生經驗 ?',
    'Internship Experience ?': '實習經驗 ?',
    'Full-Time Job Experience ?': '正職工作經驗 ?',
    'My GPA': '我的 GPA 成績',
    'My Second Degree GPA': '我的第二學位 GPA 成績',
    'Passing Score GPA of your university program': '貴校及格成績GPA',
    'Highest Score GPA of your university program': '貴校滿分成績GPA',
    'Second Degree highest Score GPA of your university program':
      '第二學位滿分成績GPA',
    'Second Degree passing Score GPA of your university program':
      '第二學位及格成績GPA',
    Explanation: '說明',
    'About Higest GPA / Lowest passed GPA and my GPA, please follow this:':
      '關於滿分成績GPA / 及格成績GPA GPA 和我的 GPA, 請參見',
    'Corresponding German GPA System': '對應到德制 GPA 分數',
    'Considering private universities': '考慮私立大學',
    'Considering private universities? (Tuition Fee: ~15000 EURO/year)':
      '考慮私立大學? (學費約: ~15000 歐元 / 年)',
    'English Passed ? (IELTS 6.5 / TOEFL 88)':
      '通過英語檢定？(IELTS 6.5 / TOEFL 88)',
    'English Certificate': '英語檢定',
    'German Passed ? (Set Not need if applying English taught programs.)':
      '通過德語檢定？( 若申請英語學程，請選擇 Not Needed )',
    'German Certificate': '德語檢定',
    'German Test Score': '德語檢定成績',
    'GRE Test ? (At least V145 Q160 )': 'GRE 考試通過？( 至少 V145 Q160 )',
    'GRE Test': 'GRE 考試',
    'GRE Test Score': 'GRE 考試成績',
    'GMAT Test': 'GMAT 考試',
    'GMAT Test ? (At least 600 )': 'GMAT 考試通過？( 至少 600 分)',
    'GMAT Test Score': 'GMAT 考試成績',
    'No Agent assigned': '尚無指派顧問',
    'No Editor assigned': '尚無指派編輯',
    Trainer: '模擬面試官',
    'Change Trainer': '更換模擬面試官',
    'No Trainer Assigned': '尚無模擬面試官',
    'Assign Trainer': '指派模擬面試官',
    'Already have an account': '您已經有帳號',
    'Confirmation Email sent': '確認信 Email 已寄出',
    'The new activation link is sent to the following address':
      '新的啟用連結已寄到以下的 Email 地址',
    'Please provide the email that you provided to us before':
      '請提供您之前提供給我們的 email',
    'Reset Login Password': '重設密碼',
    'Password reset email is already sent to your give email address':
      '密碼重設 Email 已寄出至您的 Email 地址',
    'Please have a check': '請上去上看',
    'Enter New Password': '輸入新密碼',
    'Enter New Password Again': '再次輸入新密碼',
    'Reset Password': '重設密碼',
    'Current Password': '目前密碼',
    'Assign Agents': '指派顧問',
    'Assign Editors': '指派編輯',
    'Created At': '建立時間',
    'Email Address': 'Email 地址',
    'First Name': '名',
    'High School Name': '高中名稱',
    'Last Name': '姓',
    'Add New Program': '新增科系',
    'Add New User': '新增使用者',
    'Please register and provide credentials': '請註冊帳號密碼並更新至此',
    'My Students Application Overview': '我的學生申請總攬',
    'My Active Student Overview': '我的學生總攬',
    'My Archived Students': '我的過往學生',
    'All Students Applications Overview': '所有學生申請總攬',
    Others: '其他',
    'Target Degree Programs': '預計申請學位',
    'Target Application Subjects': '預計申請學科',
    'Target Program Language': '學程教學語言',
    'Please Select': '請選擇',
    'Only English': '僅英語',
    'Only German': '僅德語',
    'German and/or English': '英語德語皆可',
    'Target Application Fields': '預計申請領域',
    'Read More': '讀我更多'
  }
};
