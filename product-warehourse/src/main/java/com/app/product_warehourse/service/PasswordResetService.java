package com.app.product_warehourse.service;


import com.app.product_warehourse.dto.request.ConfirmEmailRequest;
import com.app.product_warehourse.dto.request.PasswordResetRequest;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.PasswordResetToken;
import com.app.product_warehourse.entity.Staff;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.PasswordResetTokenRepository;
import com.app.product_warehourse.repository.StaffRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class PasswordResetService {

    private static final long TOKEN_EXPIRY_SECONDS = 300;

    AccountRepository accountRepository;
    StaffRepository staffRepository;
    PasswordResetTokenRepository tokenRepository;
    EmailService emailService;
    PasswordEncoder passwordEncoder;

    public void initiatePasswordReset(ConfirmEmailRequest request) {
        // Tìm staff bằng email
        Staff staff = staffRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new AppException(ErrorCode.NOT_FOUND_EMAIL));

        // Lấy account liên kết
        Account account = staff.getAccount();
        if (account == null) {
            throw new AppException(ErrorCode.ACCOUNT_NOT_EXIST);
        }


        // Kiểm tra token hiện tại (nếu có)
        tokenRepository.findByAccount(account).ifPresent(existingToken -> {
            if (existingToken.isValid()) {
                // Nếu token còn sống, không cho tạo mới
                throw new AppException(ErrorCode.TOKEN_STILL_VALID);
            } else {
                // Nếu token hết hạn thì xóa
                tokenRepository.delete(existingToken);
            }
        });

        // Tạo token mới
        String token = UUID.randomUUID().toString();
        PasswordResetToken resetToken = PasswordResetToken.builder()
                .token(token)
                .account(account)
                .expiryTime(LocalDateTime.now().plusSeconds(TOKEN_EXPIRY_SECONDS))
                .build();
        tokenRepository.save(resetToken);


        // Gửi email chứa liên kết
        String resetLink = "http://localhost:3000/forgot-password?token=" + token;
        emailService.sendPasswordResetEmail(request.getEmail(), resetLink);
    }


    public void resetPassword(PasswordResetRequest request) throws AppException {
        // Tìm token
        PasswordResetToken resetToken = tokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));

        // Kiểm tra token hợp lệ
        if (!resetToken.isValid()) {
            tokenRepository.deleteById(resetToken.getId());
            throw new AppException(ErrorCode.EXPIRED_TOKEN);
        }

        // Cập nhật mật khẩu
        Account account = resetToken.getAccount();
        account.setPassword(passwordEncoder.encode(request.getNewPassword()));
        accountRepository.save(account);

        // Xóa token
        tokenRepository.deleteById(resetToken.getId());
    }
}
