package com.app.product_warehourse.configuration;

import org.springframework.http.HttpMethod;
import org.springframework.web.filter.CorsFilter;


import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.spec.SecretKeySpec;

@Configuration
//@EnableWebSecurity
//@EnableMethodSecurity
public class SecurityConfig {

//    private final String[]  PUBLIC_ENDPOINTS =
//            {"/users", "auth/token", "auth/introspect", "auth/logout", "auth/refresh"
//            };

//
//
//    private CustomJwtDecoder customJwtDecoder;
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity)
//            throws Exception {
//        httpSecurity
//                .cors(Customizer.withDefaults())
//                .authorizeHttpRequests(requests ->
//                        requests.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTS).permitAll()
//
//                                .anyRequest().authenticated());
//
//        httpSecurity.oauth2ResourceServer(oauth2 ->
//                oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(customJwtDecoder)
//                                .jwtAuthenticationConverter(jwtConverter()))
//                        .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
//        );
//
//
//        httpSecurity.csrf(AbstractHttpConfigurer::disable);
//
//        return httpSecurity.build();
//
//        //     .requestMatchers(HttpMethod.GET, "/users")
//        //           .hasRole(Role.ADMIN.name())
//    }


    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(true); // <== QUAN TRỌNG nếu có gửi cookie/token
        config.addAllowedOrigin("http://localhost:3000"); // không có path
        config.addAllowedHeader("*"); // hoặc chi tiết: "Authorization", "Content-Type"
        config.addAllowedMethod("*");

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}

//    @Bean
//    JwtAuthenticationConverter jwtConverter() {
//        JwtGrantedAuthoritiesConverter grantedAuthoritiesConverter = new JwtGrantedAuthoritiesConverter();
//        grantedAuthoritiesConverter.setAuthorityPrefix("");
//
//        JwtAuthenticationConverter converter = new JwtAuthenticationConverter();
//        converter.setJwtGrantedAuthoritiesConverter(grantedAuthoritiesConverter);
//        return converter;
//    }



//    @Bean
//    PasswordEncoder passwordEncoder() {
//        return new BCryptPasswordEncoder(10);
//    }
//}
