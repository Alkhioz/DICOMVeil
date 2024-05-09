use wasm_bindgen::prelude::*;
use std::io::Cursor;
use dicom_object::FileDicomObject;
use dicom_dictionary_std::tags;
use dicom_core::ops::AttributeOp;
use dicom_core::ops::AttributeAction;
use dicom_core::ops::ApplyOp;

#[wasm_bindgen]
pub fn modify_patient_name(buffer: &[u8]) -> Result<Vec<u8>, String> {
    let cursor = Cursor::new(buffer);
    let mut obj = FileDicomObject::from_reader(cursor)
        .map_err(|e| e.to_string())?;
    let _ = obj.apply(AttributeOp::new(
        tags::PATIENT_NAME,
        AttributeAction::SetStr("AlejandroMendoza".into()),
    ));
    let mut outbuffer = Vec::new();
    let outcursor = Cursor::new(&mut outbuffer);
    let _ = obj.write_all(outcursor);
    Ok(outbuffer)
}