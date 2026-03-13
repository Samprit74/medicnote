package com.medicnote.backend.seeding;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.medicnote.backend.Entity.DoctorEntity;
import com.medicnote.backend.repository.DoctorRepo;

@Component
public class doctorSeeding implements CommandLineRunner{

	@Autowired
	private DoctorRepo doctorRepo;
	
	@Override
	public void run(String... args) throws Exception {
		
		if(doctorRepo.count()==0) {
			List<DoctorEntity> doc=List.of(
					 new DoctorEntity(null, "Dr.Ravi Kumar", "Cardiologist"),
					    new DoctorEntity(null, "Dr.Arun Prakash", "Neurologist"),
					    new DoctorEntity(null, "Dr.Meena Lakshmi", "Dermatologist"),
					    new DoctorEntity(null, "Dr.Karthik Raj", "Orthopedic")
					);
			doctorRepo.saveAll(doc);
			System.out.println("Doctor Seeding success");
		}
		else {
			System.out.println("Doctor seeding already Done");
		}
	}

}
