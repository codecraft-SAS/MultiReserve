package com.epw.multireserve.service;

import com.epw.multireserve.dto.AuthResponse;
import com.epw.multireserve.dto.LoginRequest;
import com.epw.multireserve.dto.RegisterRequest;

public interface AuthService {

    AuthResponse register(
            RegisterRequest request);

    AuthResponse login(
            LoginRequest request);
}