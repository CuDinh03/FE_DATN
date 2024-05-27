  export interface KhachHangDto {
  id: string; // UUID của khách hàng
  ma: string; // Mã của khách hàng
  ten: string; // Tên của khách hàng
  idTaiKhoan: string; // UUID của tài khoản liên kết với khách hàng
  email: string; // Địa chỉ email của khách hàng
  sdt: string; // Số điện thoại của khách hàng
  gioiTinh: boolean; // Giới tính của khách hàng (true: Nam, false: Nữ)
  ngaySinh: Date; // Ngày sinh của khách hàng
  diaChi: string; // Địa chỉ của khách hàng
  ngaySua: Date; // Ngày cập nhật thông tin khách hàng
  ngayTao: Date; // Ngày tạo khách hàng
  trangThai: boolean; // Trạng thái của khách hàng (hoạt động, không hoạt động, ...)
}

