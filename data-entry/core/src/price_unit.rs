use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum PriceUnit {
    USD,
    SGD,
    MMK,
    THB,
    KRW
}

impl ToString for PriceUnit {
    fn to_string(&self) -> String {
        match self {
            PriceUnit::USD => String::from("USD"),
            PriceUnit::SGD => String::from("SGD"),
            PriceUnit::MMK => String::from("MMK"),
            PriceUnit::THB => String::from("THB"),
            PriceUnit::KRW => String::from("KRW")
        }
    }
}

impl Default for PriceUnit {
    fn default() -> Self {
        PriceUnit::MMK
    }
}
