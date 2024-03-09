// ** Icon imports
import Login from 'mdi-material-ui/Login'
import Table from 'mdi-material-ui/Table'
import CubeOutline from 'mdi-material-ui/CubeOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import FormatLetterCase from 'mdi-material-ui/FormatLetterCase'
import AccountCogOutline from 'mdi-material-ui/AccountCogOutline'
import CreditCardOutline from 'mdi-material-ui/CreditCardOutline'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import AlertCircleOutline from 'mdi-material-ui/AlertCircleOutline'
import GoogleCirclesExtended from 'mdi-material-ui/GoogleCirclesExtended'
import { isAccessible } from 'src/api/auth/authApi'

const navigation = () => {
  let array = []

  if (isAccessible('SSDS_P_DASHBOARD') === true) {
    array.push({
      title: 'Dashboard',
      icon: HomeOutline,
      path: '/'
    })
  }
  if (isAccessible('SSDS_P_AM') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Lịch hẹn',
      path: '/manage/appointment_master'
    })
  }
  if (isAccessible('SSDS_P_CONFIG') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Cấu hình',
      path: '/manage/config'
    })
  }
  if (isAccessible('SSDS_P_CATEGORY') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Danh mục',
      path: '/manage/category'
    })
  }
  if (isAccessible('SSDS_P_SCA_ANSWER') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Tư vấn khách hàng',
      path: '/manage/feedback'
    })
  }
  if (isAccessible('SSDS_P_EQUIPMENT') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Loại thiết bị',
      path: '/manage/equipment'
    })
  }
  if (isAccessible('SSDS_P_BRANCH') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Chi nhánh',
      path: '/manage/branch'
    })
  }
  if (isAccessible('SSDS_P_SCA_FORM') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Bộ câu hỏi khảo sát',
      path: '/manage/scaForm'
    })
  }
  if (isAccessible('SSDS_P_SERVICE') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Dịch vụ',
      path: '/manage/service'
    })
  }
  if (isAccessible('SSDS_P_ACCOUNT') === true) {
    array.push({
      icon: CubeOutline,
      title: 'Người dùng',
      path: '/manage/user'
    })
  }


  // Nếu muốn enable authorization thì bỏ comment dòng dưới
   return array

  // return [
  //   {
  //     title: 'Dashboard',
  //     icon: HomeOutline,
  //     path: '/'
  //   },
    
  //   {
  //     title: 'Template Dashboard',
  //     icon: HomeOutline,
  //     path: '/template_dashboard' 
  //   },
    
  //   // {
  //   //   title: 'Account Settings',
  //   //   icon: AccountCogOutline,
  //   //   path: '/account-settings'
  //   // },
  //   // {
  //   //   sectionTitle: 'Pages'
  //   // },
  //   // {
  //   //   title: 'Login',
  //   //   icon: Login,
  //   //   path: '/pages/login',
  //   //   openInNewTab: true
  //   // },
  //   // {
  //   //   title: 'Register',
  //   //   icon: AccountPlusOutline,
  //   //   path: '/pages/register',
  //   //   openInNewTab: true
  //   // },
  //   // {
  //   //   title: 'Error',
  //   //   icon: AlertCircleOutline,
  //   //   path: '/pages/error',
  //   //   openInNewTab: true
  //   // },
  //   // {
  //   //   sectionTitle: 'User Interface'
  //   // },
  //   // {
  //   //   title: 'Typography',
  //   //   icon: FormatLetterCase,
  //   //   path: '/typography'
  //   // },
  //   // {
  //   //   title: 'Icons',
  //   //   path: '/icons',
  //   //   icon: GoogleCirclesExtended
  //   // },
  //   // {
  //   //   title: 'Cards',
  //   //   icon: CreditCardOutline,
  //   //   path: '/cards'
  //   // },
    
  //   // {
  //   //   title: 'Tables',
  //   //   icon: Table,
  //   //   path: '/tables'
  //   // },
  //   // {
  //   //   icon: CubeOutline,
  //   //   title: 'Form Layouts',
  //   //   path: '/form-layouts'
  //   // },
  //   {
  //     sectionTitle: 'Quản lý'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Tư vấn khách hàng',
  //     path: '/manage/feedback'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Lịch hẹn',
  //     path: '/manage/appointment_master'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Loại thiết bị',
  //     path: '/manage/equipment'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Danh mục',
  //     path: '/manage/category'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Cấu hình',
  //     path: '/manage/config'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Chi nhánh',
  //     path: '/manage/branch'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Bộ câu hỏi tư vấn',
  //     path: '/manage/scaForm'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Dịch vụ',
  //     path: '/manage/service'
  //   },
  //   {
  //     icon: CubeOutline,
  //     title: 'Người dùng',
  //     path: '/manage/user'
  //   }
  // ]
}

export default navigation
