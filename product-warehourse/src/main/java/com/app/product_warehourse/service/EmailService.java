package com.app.product_warehourse.service;

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
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }
}
