use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use crate::price_unit::PriceUnit;
use crate::product_builder::ProductBuilder;
use crate::product_status::ProductStatus;
use crate::instock_status::InstockStatus;


#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Product {
    id: Option<String>,
    title: String,
    status: ProductStatus,
    instock_status: InstockStatus,
    price_unit: PriceUnit,
    images: Option<String>,
    warranty: i32,
    quantity: i32,
    specification: Option<String>,
    price: f32,
    market_price: f32,
    dealer_price: i32,
    discount: i32,
    brand_name: String,
    categories: Option<String>,
    overview: Option<String>,
    description: Option<String>,

    #[serde(rename(serialize = "sales.name"))]
    sales_name: Option<String>,
    #[serde(rename(serialize = "sales.startDate"))]
    sales_start_date: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "sales.endDate"))]
    sales_end_date: Option<DateTime<Utc>>,
    #[serde(rename(serialize = "sales.isActive"))]
    sales_is_active: Option<bool>,
    #[serde(rename(serialize = "sales.discount"))]
    sales_discount: Option<f32>,
    #[serde(rename(serialize = "sales.description"))]
    sales_description: Option<String>,
}

impl Product {
    pub fn new(
        id: Option<String>,
        status: ProductStatus,
        title: String,
        price: f32,
        overview: Option<String>,
        market_price: f32,
        categories: Option<String>,
        price_unit: PriceUnit,
        images: Option<String>,
        warranty: i32,
        description: Option<String>,
        quantity: i32,
        specification: Option<String>,
        discount: i32,
        instock_status: InstockStatus,
        dealer_price: i32,
        brand_name: String,

        sales_name: Option<String>,
        sales_start_date: Option<DateTime<Utc>>,
        sales_end_date: Option<DateTime<Utc>>,
        sales_is_active: Option<bool>,
        sales_description: Option<String>,
        sales_discount: Option<f32>
    ) -> Product {
        Product { id, title, price, overview, market_price, categories, price_unit, images, warranty, description, 
            quantity, specification, discount, instock_status, dealer_price, brand_name, status,

            sales_name, sales_start_date, sales_end_date, sales_is_active, sales_description, sales_discount
        }
    }

    pub fn builder() -> ProductBuilder {
        ProductBuilder::default()
    }
}
