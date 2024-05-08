use wasm_bindgen::prelude::*;
use dicom_object::{mem::InMemDicomObject, open_file, DefaultDicomObject};
use dicom_encoding::transfer_syntax::explicit_le::ExplicitVRLittleEndian;
use dicom_encoding::encode::EncodeTo;
use dicom_core::{DataElement, VR};
use std::io::{Cursor, Write};
use dicom_dictionary_std::StandardDataDictionary;
use serde_json::{Value, json};

#[wasm_bindgen]
pub fn get_dicom(buffer: &[u8], tags: Box<[JsValue]>) -> Result<JsValue, JsValue> {
    let cursor = Cursor::new(buffer);
    let obj = DefaultDicomObject::from_reader(cursor)
        .map_err(|e| e.to_string())?;

    let mut result = serde_json::Map::new();

    for tag in tags.iter() {
        if let Some(tag_name) = tag.as_string() {
            let value = obj.element_by_name(&tag_name)
                .map_err(|e| e.to_string())?
                .to_str()
                .map_err(|e| e.to_string())?;
            result.insert(tag_name, json!(value));
        }
    }

    Ok(JsValue::from_serde(&result).map_err(|e| e.to_string())?)
}

#[wasm_bindgen]
pub fn modify_patient_name(buffer: &[u8]) -> Result<Vec<u8>, JsValue> {
    let cursor = Cursor::new(buffer);
    let dict = StandardDataDictionary::default();
    let ts = ExplicitVRLittleEndian;

    // Decode the DICOM object from the buffer
    let mut obj = InMemDicomObject::open_file(cursor, &dict, &ts)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    // Modify 'PatientName'
    if let Some(elem) = obj.element_mut("PatientName").ok() {
        elem.set_string("mi gallo joe").map_err(|e| JsValue::from_str(&e.to_string()))?;
    }

    // Serialize the modified DICOM object back to bytes
    let mut buf = Vec::new();
    obj.write_to(&mut buf, &ts)
        .map_err(|e| JsValue::from_str(&e.to_string()))?;

    Ok(buf)
}


// use std::fs::File;
// use std::io::{self, Read};
// use std::io::Cursor;
// use dicom_object::DefaultDicomObject;
// use dicom_object::InMemDicomObject;
// use dicom_dictionary_std::tags;

// fn main() -> io::Result<()> {
//     let file_path = "./image-00000.dcm";
//     let buffer = read_file_to_buffer(file_path)?;
//     let _ = print_dicom_data(&buffer);
//     Ok(())
// }

// fn read_file_to_buffer(file_path: &str) -> io::Result<Vec<u8>> {
//     let mut file = File::open(file_path)?;
//     let mut buffer = Vec::new();
//     file.read_to_end(&mut buffer)?;
//     Ok(buffer)
// }

// fn print_dicom_data(buffer: &[u8]) -> Result<String, String> {
//     let cursor = Cursor::new(buffer);
//     let obj = DefaultDicomObject::from_reader(cursor)
//         .map_err(|e| e.to_string())?;

//     let mut mem_obj = InMemDicomObject::new_empty();

//     for element in obj.into_iter() {
//         mem_obj.put(element);
//     }

//     let _ = mem_obj.update_value_at(tags::PATIENT_NAME, |e| {
//         let v = e.primitive_mut().unwrap();
//         *v = "Alejandro Mendoza".into();
//     });

//     let patient_name = mem_obj.element_by_name("PatientName")
//         .map_err(|e| e.to_string())?
//         .to_str()
//         .map_err(|e| e.to_string())?;

//     println!("{}", patient_name);

//     Ok(patient_name.to_string())
// }