package com.app.product_warehourse.service;

import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class EmailService   {
    JavaMailSender mailSender;

    public void sendPasswordResetEmail(String to, String resetLink) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            helper.setTo(to);
            helper.setSubject("Khôi phục mật khẩu");
            helper.setText(
                    "Nhấn vào liên kết sau để đặt lại mật khẩu: <a href=\"" + resetLink + "\">Đặt lại mật khẩu</a>",
                    true
            );
            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Lỗi khi gửi email đặt lại mật khẩu cho {}: {}", to, e.getMessage());
            throw new AppException(ErrorCode.TOKEN_STILL_VALID);
        }
    }
    public void sendUserNamePassword(String to, String userName, String password) {
        MimeMessage message = mailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("THÔNG TIN TÀI KHOẢN TRUY CẬP HỆ THỐNG");
            String content =
                    "<html>" +
                            "<body style=\"font-family: Arial, sans-serif; line-height: 1.8; color: #333;\">" +
                            "<p>Xin chào quý khách,</p>" +

                            "<p>Hệ thống xin gửi đến quý khách thông tin tài khoản truy cập:</p>" +

                            "<table style=\"border-collapse: collapse; border: 1px solid #ddd;\">" +
                            "<tr>" +
                            "<td style=\"padding: 8px 12px; border: 1px solid #ddd;\"><strong>Tên đăng nhập</strong></td>" +
                            "<td style=\"padding: 8px 12px; border: 1px solid #ddd;\">" + userName + "</td>" +
                            "</tr>" +
                            "<tr>" +
                            "<td style=\"padding: 8px 12px; border: 1px solid #ddd;\"><strong>Mật khẩu</strong></td>" +
                            "<td style=\"padding: 8px 12px; border: 1px solid #ddd;\">" + password + "</td>" +
                            "</tr>" +
                            "</table>" +

                            "<p><strong>Lưu ý:</strong> Vì lý do bảo mật, quý khách vui lòng thay đổi mật khẩu ngay sau lần đăng nhập đầu tiên.</p>" +

                            "<p>Nếu có bất kỳ thắc mắc hoặc cần hỗ trợ, xin vui lòng liên hệ bộ phận Hỗ trợ Kỹ thuật qua email: <a href=\"mailto:sinhnnde180169@gmail.com\">sinhnnde180169@gmail.com</a></p>" +

                            "<p>Trân trọng,<br/>Đội ngũ Hỗ trợ Kỹ thuật</p>" +
                            "</body>" +
                            "</html>";
            helper.setText(content, true); // true: gửi nội dung HTML
            mailSender.send(message);
        } catch (MessagingException e) {
            log.error("Lỗi khi gửi email cho {}: {}", to, e.getMessage());
            throw new AppException(ErrorCode.TOKEN_STILL_VALID);
        }
    }
}
