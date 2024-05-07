use wasm_bindgen::prelude::*;
use std::io::Cursor;
use dicom_object::DefaultDicomObject;

#[wasm_bindgen]
pub fn get_dicom(buffer: &[u8]) -> Result<String, JsValue> {
    let cursor = Cursor::new(buffer);
    let obj = DefaultDicomObject::from_reader(cursor)
        .map_err(|e| e.to_string())?;

    let patient_name = obj.element_by_name("PatientName")
        .map_err(|e| e.to_string())?
        .to_str()
        .map_err(|e| e.to_string())?;

    let patient_id = obj.element_by_name("PatientID")
        .map_err(|e| e.to_string())?
        .to_str()
        .map_err(|e| e.to_string())?;
    
    let modality = obj.element_by_name("Modality")
        .map_err(|e| e.to_string())?
        .to_str()
        .map_err(|e| e.to_string())?;
    
    let image_type = obj.element_by_name("ImageType")
        .map_err(|e| e.to_string())?
        .to_str()
        .map_err(|e| e.to_string())?;
    
    let study_description = obj.element_by_name("StudyDescription")
        .map_err(|e| e.to_string())?
        .to_str()
        .map_err(|e| e.to_string())?;
        
    let pixel_data = obj.element_by_name("PixelData")
        .map_err(|e| e.to_string())?
        .to_str()
        .map_err(|e| e.to_string())?;

    let result_text = format!(r#"{{"name": "{}", "modality": "{}", "id": "{}", "studydescription": "{}", "imagetype": "{}", "pixeldata": "{}"}}"#, patient_name, modality, patient_id, study_description, image_type, pixel_data);
    Ok(result_text)
}