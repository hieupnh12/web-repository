package com.app.product_warehourse.service;

import com.app.product_warehourse.dto.request.AuthenticationRequest;
import com.app.product_warehourse.dto.response.AuthenticationResponse;
import com.app.product_warehourse.entity.Account;
import com.app.product_warehourse.entity.Permission;
import com.app.product_warehourse.entity.Role;
import com.app.product_warehourse.exception.AppException;
import com.app.product_warehourse.exception.ErrorCode;
import com.app.product_warehourse.repository.AccountRepository;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
@Slf4j
public class AuthenticationService {
    AccountRepository accountRepository;
    PasswordEncoder passwordEncoder;

    @NonFinal
    @Value("${jwt.signerKey}")
    protected   String SIGNER_KEY;

    @NonFinal
    @Value("${jwt.valid-duration}")
    protected   Long VALID_DURATION;

    @NonFinal
    @Value("${jwt.refreshable-duration}")
    protected   Long REFRESHABLE_DURATION;

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        Account account = (Account) accountRepository.findByUserName(request.getUsername())
                .orElseThrow(() -> new AppException(ErrorCode.STAFF_NOT_EXIST));

        boolean authenticated = passwordEncoder.matches(request.getPassword(), account.getPassword());

        if (!authenticated)
            throw new AppException(ErrorCode.UNAUTHENTICATED);

        var token = generateToken(account);
        return   AuthenticationResponse.builder()
                .token(token)
                .build();
    }

    private String generateToken(Account account) {
        JWSHeader jwsHeader = new JWSHeader(JWSAlgorithm.HS512);

        JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
                .subject(account.getUserName())
                .issuer("sinh.com")
                .issueTime(new Date())
                .expirationTime(new Date(
                        Instant.now().plus(VALID_DURATION, ChronoUnit.SECONDS).toEpochMilli()
                ))
                .jwtID(UUID.randomUUID().toString())
                .claim("scope", buildScope(account))
                .build();
        Payload payload = new Payload(jwtClaimsSet.toJSONObject());

        JWSObject jwsObject = new JWSObject(jwsHeader, payload);

        try {
            jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
            return jwsObject.serialize();
        } catch (JOSEException e) {
            log.error("Cannot creat token", e);
            throw new RuntimeException(e);
        }
    }

    private String buildScope(Account account) {
        StringJoiner stringJoiner = new StringJoiner(" ");
        Role role = account.getRole();

        if (role != null) {
            String roleName = role.getName().toUpperCase().replace(" ", "_");
            stringJoiner.add("ROLE_" + roleName);

            if (!CollectionUtils.isEmpty(role.getPermissions())) {
                for (Permission permission : role.getPermissions()) {
                    String functionName = permission.getFunctions().getFunctionName(); // Lấy tên chức năng

                    if (permission.isCanView()) stringJoiner.add(functionName + "_VIEW");
                    if (permission.isCanCreate()) stringJoiner.add(functionName + "_CREATE");
                    if (permission.isCanUpdate()) stringJoiner.add(functionName + "_UPDATE");
                    if (permission.isCanDelete()) stringJoiner.add(functionName + "_DELETE");
                }
            }
        }

        return stringJoiner.toString();
    }

    //    private SignedJWT verifyToken(String token, boolean isRefresh) throws ParseException, JOSEException {
//
//        JWSVerifier verifier = new MACVerifier(SIGNER_KEY.getBytes());
//
//        SignedJWT signedJWT = SignedJWT.parse(token);
//
//        Date  expiryTime = (isRefresh)
//                ? new Date(signedJWT.getJWTClaimsSet().getIssueTime()
//                .toInstant().plus(REFRESHABLE_DURATION, ChronoUnit.SECONDS).toEpochMilli())
//                : signedJWT.getJWTClaimsSet().getExpirationTime();
//
//        var  verify = signedJWT.verify(verifier);
//        if(!(verify && expiryTime.after(new Date())))
//            throw new AppException(ErrorCode.UNAUTHENTICATED);
//
//        if(invalidatedTokenRepository
//                .existsById(signedJWT.getJWTClaimsSet().getJWTID()))
//            throw new AppException(ErrorCode.UNAUTHENTICATED);
//        return signedJWT;
//    }

}
