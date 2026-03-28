package com.medicnote.backend.service;

import com.medicnote.backend.dto.auth.AuthRequest;
import com.medicnote.backend.dto.auth.AuthResponse;
import com.medicnote.backend.dto.auth.RegisterRequest;

public interface AuthService {

    String register(RegisterRequest request);

    AuthResponse login(AuthRequest request);
}