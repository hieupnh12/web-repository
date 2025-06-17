package com.app.product_warehourse.controller;

import com.app.product_warehourse.dto.request.*;
import com.app.product_warehourse.dto.response.AuthenticationResponse;
import com.app.product_warehourse.dto.response.CheckTokenResponse;
import com.app.product_warehourse.service.AuthenticationService;
import com.app.product_warehourse.service.PasswordResetService;
import com.nimbusds.jose.JOSEException;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.text.ParseException;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationController {
    AuthenticationService authenticationService;
    PasswordResetService passwordResetService;
    
    @PostMapping("/login")
    public ApiResponse<AuthenticationResponse> authenticate(@RequestBody AuthenticationRequest request) {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.authenticate(request))
                .build();
    }
    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestBody LogoutRequest request) throws ParseException, JOSEException {
 authenticationService.logout(request);
        return ApiResponse.<Void>builder()
                .build();
    }

    @PostMapping("/valid")
    public ApiResponse<CheckTokenResponse> validate(@RequestBody CheckTokenRequest request) throws ParseException, JOSEException {
        var result = authenticationService.checkTokenValid(request);
        return ApiResponse.<CheckTokenResponse>builder()
                .result(result)
                .build();
    }
    @PostMapping("/refresh")
    public ApiResponse<AuthenticationResponse> refreshToken(@RequestBody RefreshRequest request) throws ParseException, JOSEException {
        return ApiResponse.<AuthenticationResponse>builder()
                .result(authenticationService.refreshToken(request))
                .build();
    }

    @PostMapping("/forgot")
    public ApiResponse<String> initiatePasswordReset(@RequestBody ConfirmEmailRequest request) throws ParseException, JOSEException {
            passwordResetService.initiatePasswordReset(request);
            return ApiResponse.<String>builder()
                    .message("Email khôi phục đã được gửi!")
                    .build();

    }

    @PostMapping("/reset")
    public ApiResponse<String> resetPassword(@RequestBody PasswordResetRequest request) {
            passwordResetService.resetPassword(request);
            return ApiResponse.<String>builder()
                    .message("Đặt lại mật khẩu thành công!")
                    .build();

    }

}
