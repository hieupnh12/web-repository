package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.AuthenticationRequest;
import com.app.product_warehourse.dto.request.CheckTokenRequest;
import com.app.product_warehourse.dto.request.LogoutRequest;
import com.app.product_warehourse.dto.request.RefreshRequest;
import com.app.product_warehourse.dto.response.AuthenticationResponse;
import com.app.product_warehourse.dto.response.CheckTokenResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.InvalidToken;
import com.app.product_warehourse.entity.Permission;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.repository.AccountRepository;
import com.app.product_warehourse.repository.InvalidTokenRepository;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jose.crypto.MACVerifier;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.experimental.NonFinal;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    AccountRepository accountRepository;
    PasswordEncoder passwordEncoder;
    InvalidTokenRepository invalidTokenRepository;
    RedisTemplate<String, String> redisTemplate;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected   String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected   Long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected  Long REFRESHABLE_DURATION;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        var account = accountRepository.findByUserName(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        if (!account.getStatus()) {
            throw new AppException(ErrorCode.ACCOUNT_INACTIVE);
        }
        boolean authenticated = passwordEncoder.matches(request.getPassword(), account.getPassword());

        if (!authenticated)
            throw new AppException(ErrorCode.AUTHENTICATED_PASSWORD);

        var token = generateToken(account);
        return   AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    private String generateToken(Account account) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        String jwtId = UUID.randomUUID().toString();
        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUserName())
                .issuer("sinh.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(jwtId)
                .claim("scope", buildScope(account))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            String token = jwsObject.serialize();
            redisTemplate.opsForValue().set(
                    "jwt:" + account.getUserName(),
                    jwtId,
                    VALID_DURATION,
                    TimeUnit.SECONDS
            );
            return token;
        } catch (JOSEException e) {
            log.error("Cannot creat token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(Account account) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        Role role = account.getRole();

        if (role != null) {
            String roleName = role.getRoleName().toUpperCase().replace(" ", "_");
            stringJoiner.add("ROLE_" + roleName);

            if (!CollectionUtils.isEmpty(role.getPermissions())) {
                for (Permission permission : role.getPermissions()) {
                    String functionName = permission.getFunctions()
                            .getFunctionName()
                            .replace(" ", "_"); // << thêm dòng này

                    if (permission.isCanView()) stringJoiner.add(functionName + "_VIEW");
                    if (permission.isCanCreate()) stringJoiner.add(functionName + "_CREATE");
                    if (permission.isCanUpdate()) stringJoiner.add(functionName + "_UPDATE");
                    if (permission.isCanDelete()) stringJoiner.add(functionName + "_DELETE");
                }
            }
        }

        return stringJoiner.toString();
    }

        private SignedJWT verifyToken(String token, boolean isRefresh) throws ParseException, JOSEException {

        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());

        SignedJWT signedJWT = SignedJWT.parse(token);

        Date  expiryTime = (isRefresh)
                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
                : signedJWT.getJWTClaimsSet().getExpirationTime();

        var  verify = signedJWT.verify(verifier);
        if(!(verify && expiryTime.after(new Date())))
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        if(invalidTokenRepository
                .existsById(signedJWT.getJWTClaimsSet().getJWTID()))
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        return signedJWT;
    }

    public void logout(LogoutRequest request) throws ParseException, JOSEException {
        try {
            var signToken = verifyToken(request.getToken(), true);

            String jit = signToken.getJWTClaimsSet().getJWTID();
            Date expiryTime = signToken.getJWTClaimsSet().getExpirationTime();

            InvalidToken invalidToken = InvalidToken.builder()
                    .id(jit)
                    .expiryTime(expiryTime)
                    .build();

            invalidTokenRepository.save(invalidToken);
            String username = signToken.getJWTClaimsSet().getSubject();
            redisTemplate.delete("jwt:" + username);
        } catch (AppException e) {
            log.info("Token already expired");
        }


    }


    public CheckTokenResponse checkTokenValid(CheckTokenRequest request) throws JOSEException, ParseException {
        var  token = request.getToken();

        boolean isValid = true;

        try {
            verifyToken(token, false);
        } catch (AppException e) {
            isValid = false;
        }
        return CheckTokenResponse.builder()
                .valid(isValid)
                .build();


    }

    public AuthenticationResponse refreshToken(RefreshRequest request) throws ParseException, JOSEException {
        var signedJWT = verifyToken(request.getToken(), true);

        var jit = signedJWT.getJWTClaimsSet().getJWTID();
        var expiryTime = signedJWT.getJWTClaimsSet().getExpirationTime();

        InvalidToken invalidToken = InvalidToken.builder()
                .id(jit)
                .expiryTime(expiryTime)
                .build();

        invalidTokenRepository.save(invalidToken);

        var username = signedJWT.getJWTClaimsSet().getSubject();
        redisTemplate.delete("jwt:" + username);
        var account = accountRepository.findByUserName(username).orElseThrow(
                () -> new AppException(ErrorCode.ACCOUNT_NOT_EXIST));
        if (!account.getStatus()) {
            throw new AppException(ErrorCode.ACCOUNT_INACTIVE);
        }
        var token = generateToken(account);
        return   AuthenticationResponse.builder()
                .token(token)
                .build();
    }

}
