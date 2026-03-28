package com.medicnote.backend.mapper;

import com.medicnote.backend.dto.response.PrescriptionItemResponseDTO;
import com.medicnote.backend.entity.PrescriptionItem;

import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface PrescriptionItemMapper {

    PrescriptionItemResponseDTO toDTO(PrescriptionItem item);

    List<PrescriptionItemResponseDTO> toDTOList(List<PrescriptionItem> items);
}