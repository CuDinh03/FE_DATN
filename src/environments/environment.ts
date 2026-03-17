export const environment = {
  production: false,
  /** Base URL for Spring Boot API (DATN backend). */
  apiUrl: 'http://localhost:9091/api',
  /** Bật để dùng dữ liệu giả lập (không cần backend) cho test luồng giỏ hàng / thanh toán / đơn hàng. */
  useMockData: false,
  firebaseConfig : {
    apiKey: "AIzaSyCtc5TaHiDgPVPyOpXdO0XtfE7dY6lJsEE",
    authDomain: "uploadimg-84016.firebaseapp.com",
    projectId: "uploadimg-84016",
    storageBucket: "uploadimg-84016.appspot.com",
    messagingSenderId: "510250322912",
    appId: "1:510250322912:web:6c348ee7bfd9d012b1b985",
    measurementId: "G-LC0NQDMHMN"
  }
}
