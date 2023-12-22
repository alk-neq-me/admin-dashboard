use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum InstockStatus {
    InStock,
    OutOfStock,
    AskForStock
}

impl ToString for InstockStatus {
    fn to_string(&self) -> String {
        match self {
            InstockStatus::InStock => String::from("InStock"),
            InstockStatus::OutOfStock => String::from("OutOfStock"),
            InstockStatus::AskForStock => String::from("AskForStock")
        }
    }
}

impl Default for InstockStatus {
    fn default() -> Self {
        InstockStatus::AskForStock
    }
}
