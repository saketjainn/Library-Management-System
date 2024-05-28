package com.project.library.management.config;

import com.project.library.management.entity.Role;
import com.project.library.management.filter.JwtAuthenticationFilter;
import com.project.library.management.service.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception{
            return http
                    .csrf(AbstractHttpConfigurer::disable)
                    .authorizeHttpRequests(
                            req->req.requestMatchers(
                                    "/auth/**", "/user/is-username-available","/api/v1/auth/**","/v2/api-docs","/v3/api-docs","/v3/api-docs/**","/swagger-resources","swagger-resources/**","/connfiguration/ui","configuration/security","/swagger-ui/**","/webjars/**","swagger-ui.html","admin/generate-report"
                                    )
                                    .permitAll()
                                    .requestMatchers("/admin/**").hasAnyRole(Role.ADMIN.name())
                                    .requestMatchers("/user/**").hasAnyRole(Role.USER.name(), Role.ADMIN.name())
                                    .anyRequest()
                                    .authenticated()
                    )
                    .userDetailsService(userDetailsServiceImpl)
                    .sessionManagement(session->session
                            .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                    )
                    .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                    .exceptionHandling(
                            e->e.accessDeniedHandler(
                                    (request, response, accessDeniedException)->response.setStatus(403)
                            )
                    )
                    .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

}
