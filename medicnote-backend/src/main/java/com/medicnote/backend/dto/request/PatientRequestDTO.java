package com.medicnote.backend.dto.request;

import jakarta.validation.constraints.*;

public class PatientRequestDTO {

    @NotBlank
    private String name;

    @Email
    @NotBlank
    private String email;

    @Min(0)
    private int age;

    @NotBlank
    private String phone;

    @NotBlank
    private String gender;

    @NotBlank
    private String address;

    public PatientRequestDTO() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
}