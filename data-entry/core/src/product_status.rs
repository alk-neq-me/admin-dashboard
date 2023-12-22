use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub enum ProductStatus {
    Draft,
    Pending,
    Published
}

impl ToString for ProductStatus {
    fn to_string(&self) -> String {
        match self {
            ProductStatus::Draft => String::from("Draft"),
            ProductStatus::Pending => String::from("Pending"),
            ProductStatus::Published => String::from("Published"),
        }
    }
}

impl Default for ProductStatus {
    fn default() -> Self {
        ProductStatus::Draft
    }
}
