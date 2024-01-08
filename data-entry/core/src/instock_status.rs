use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum InstockStatus {
    Available,
    OutOfStock,
    AskForStock,
    Discontinued
}

impl ToString for InstockStatus {
    fn to_string(&self) -> String {
        match self {
            InstockStatus::Available => String::from("Available"),
            InstockStatus::OutOfStock => String::from("OutOfStock"),
            InstockStatus::AskForStock => String::from("AskForStock"),
            InstockStatus::Discontinued => String::from("Discontinued")
        }
    }
}

impl Default for InstockStatus {
    fn default() -> Self {
        InstockStatus::AskForStock
    }
}
