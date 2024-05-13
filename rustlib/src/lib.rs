use wasm_bindgen::prelude::*;
use std::io::Cursor;
use dicom_object::FileDicomObject;
use dicom_core::ops::AttributeOp;
use dicom_core::ops::AttributeAction;
use dicom_core::ops::ApplyOp;
use dicom_core::Tag;

const DELETEACTION: u8 = 0;
const UPDATEACTION: u8 = 1;

#[wasm_bindgen]
pub fn modify_tag_value(buffer: &[u8], modifications: &str) -> Result<Vec<u8>, String> {
    let mods: Vec<Modification> = serde_json::from_str(modifications)
        .map_err(|e| e.to_string())?;
    let cursor = Cursor::new(buffer);
    let mut obj = FileDicomObject::from_reader(cursor)
        .map_err(|e| e.to_string())?;
    for modif in mods {
        let tag = Tag(modif.group, modif.element);
        let _ = obj.apply(AttributeOp::new(
            tag,
            AttributeAction::SetStr(modif.value.into()),
        ))
        .map_err(|e| e.to_string())?;
    }
    let mut outbuffer = Vec::new();
    let outcursor = Cursor::new(&mut outbuffer);
    let _ = obj.write_all(outcursor);
    Ok(outbuffer)
}

#[wasm_bindgen]
pub fn remove_tag(buffer: &[u8], modifications: &str) -> Result<Vec<u8>, String> {
    let mods: Vec<Modification> = serde_json::from_str(modifications)
        .map_err(|e| e.to_string())?;
    let cursor = Cursor::new(buffer);
    let mut obj = FileDicomObject::from_reader(cursor)
        .map_err(|e| e.to_string())?;
    for modif in mods {
        let tag = Tag(modif.group, modif.element);
        let _ = obj.apply(AttributeOp::new(
            tag,
            AttributeAction::Remove,
        ))
        .map_err(|e| e.to_string())?;
    }
    let mut outbuffer = Vec::new();
    let outcursor = Cursor::new(&mut outbuffer);
    let _ = obj.write_all(outcursor);
    Ok(outbuffer)
}


#[wasm_bindgen]
pub fn remove_update_tag(buffer: &[u8], modifications: &str) -> Result<Vec<u8>, String> {
    let mods: Vec<Modification> = serde_json::from_str(modifications)
        .map_err(|e| e.to_string())?;
    let cursor = Cursor::new(buffer);
    let mut obj = FileDicomObject::from_reader(cursor)
        .map_err(|e| e.to_string())?;
    for modif in mods {
        let tag = Tag(modif.group, modif.element);
        if modif.operationtype == DELETEACTION {
            let _ = obj.apply(AttributeOp::new(
                tag,
                AttributeAction::Remove,
            ))
            .map_err(|e| e.to_string())?;
        } else if modif.operationtype == UPDATEACTION {
            let _ = obj.apply(AttributeOp::new(
                tag,
                AttributeAction::SetStr(modif.value.into()),
            ))
            .map_err(|e| e.to_string())?;
        }
    }
    let mut outbuffer = Vec::new();
    let outcursor = Cursor::new(&mut outbuffer);
    let _ = obj.write_all(outcursor);
    Ok(outbuffer)
}

#[wasm_bindgen]
pub fn get_tag_value(buffer: &[u8], tags: Vec<String>) -> Result<String, String> {
    let cursor = Cursor::new(buffer);
    let obj = FileDicomObject::from_reader(cursor)
        .map_err(|e| e.to_string())?;
    let mut results = Vec::new();
    for tag in tags.iter() {
        let tag_value = obj.element_by_name(&tag)
            .map_err(|e| e.to_string())?
            .to_str()
            .map_err(|e| e.to_string())?;
        results.push(TagValue { tag: tag.clone(), value: tag_value.into_owned() });
    }
    let jsonstring = serde_json::to_string(&results)
                .map_err(|e| e.to_string());
    Ok(jsonstring?)
}

#[derive(serde::Serialize)]
struct TagValue {
    tag: String,
    value: String,
}

#[derive(serde::Deserialize)]
struct Modification {
    operationtype: u8,
    group: u16,
    element: u16,
    value: String,
}