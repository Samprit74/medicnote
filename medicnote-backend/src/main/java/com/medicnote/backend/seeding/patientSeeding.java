package com.medicnote.backend.seeding;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.medicnote.backend.Entity.patientEntity;
import com.medicnote.backend.repository.patientRepo;

@Component
public class patientSeeding implements CommandLineRunner{

	@Autowired
	private patientRepo patientRepo;
	
	@Override
	public void run(String... args) throws Exception {
		
		if(patientRepo.count()==0) {
		List<patientEntity> patient = List.of(
				 new patientEntity(null, "Arun Kumar", 25, "Male"),
				    new patientEntity(null, "Priya Sharma", 29, "Female"),
				    new patientEntity(null, "Rahul Verma", 32, "Male"),
				    new patientEntity(null, "Sneha Reddy", 27, "Female"),
				    new patientEntity(null, "Karthik Raj", 35, "Male"),
				    new patientEntity(null, "Meena Lakshmi", 31, "Female"),
				    new patientEntity(null, "Vijay Kumar", 40, "Male"),
				    new patientEntity(null, "Anitha Devi", 26, "Female"),
				    new patientEntity(null, "Suresh Babu", 38, "Male"),
				    new patientEntity(null, "Divya Nair", 24, "Female")
				);
		patientRepo.saveAll(patient);
		System.out.println("patient successfully seeded");
		}else {
			System.out.println("Data already exist");
		}
	}

	
}
