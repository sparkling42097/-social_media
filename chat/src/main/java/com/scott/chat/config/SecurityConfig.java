package com.scott.chat.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import com.scott.chat.security.CustomAuthenticationFailureHandler;
import com.scott.chat.security.CustomAuthenticationSuccessHandler;
import com.scott.chat.security.OAuth2LoginSuccessHandler;
import com.scott.chat.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    @Autowired
    private CustomUserDetailsService userDetailsService;
    
    @Autowired
    private CustomAuthenticationSuccessHandler authenticationSuccessHandler;
    
    @Autowired
    private CustomAuthenticationFailureHandler authenticationFailureHandler;
    
    
    
    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;

    public SecurityConfig(OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler) {
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        .csrf().disable()
        .authorizeHttpRequests(authorize -> authorize
            .requestMatchers(
                "/login", 
                "/login_submit", 
                "/loginpage",
                "/registerpage",
                "/reg_submit",
                "/forgotPassword",
                "/reset-password/**",
                "/api/token/**",
                "/webjars/**", 
                "/css/**", 
                "/js/**",
                "/images/**",
                "/ws/**" // 允許 WebSocket 連線
            ).permitAll()
            .requestMatchers("/main").authenticated() //只有main要驗證
            .anyRequest().authenticated()//所有頁面都要驗證
        )
        .formLogin(form -> form
            .loginPage("/loginpage")
            .usernameParameter("email")
            .passwordParameter("password")
            .loginProcessingUrl("/login")
            .successHandler(authenticationSuccessHandler)  // 使用自定義成功處理器
            .failureHandler(authenticationFailureHandler)  // 使用自定義失敗處理器
            .permitAll()
        )
        .oauth2Login(oauth2 -> oauth2
                .loginPage("/loginpage")
                .defaultSuccessUrl("/main", true)
                .successHandler(oAuth2LoginSuccessHandler)
                .permitAll()
        )
        .logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/loginpage")
            .deleteCookies("JSESSIONID")//刪除Cookies
            .invalidateHttpSession(true)//刪除Session
            .permitAll()
        )
        .sessionManagement(session -> session
            .maximumSessions(1) // 限制同時登錄的會話數
            .maxSessionsPreventsLogin(false) // 允許新登錄擠掉舊會話
        );
    return http.build();
    }
}














