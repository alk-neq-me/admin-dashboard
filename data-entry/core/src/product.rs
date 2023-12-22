use serde::{Deserialize, Serialize};

use crate::price_unit::PriceUnit;
use crate::product_builder::ProductBuilder;
use crate::product_status::ProductStatus;
use crate::instock_status::InstockStatus;
use crate::utils::get_pk;


#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Product {
    id: String,
    status: ProductStatus,
    title: String,
    r#type: String,
    price: f32,
    overview: String,
    features: String,
    market_price: f32,
    categories: String,
    price_unit: PriceUnit,
    images: String,
    warranty: i32,
    description: String,
    sales_category: String,
    quantity: i32,
    specification: String,
    discount: i32,
    instock_status: InstockStatus,
    dealer_price: i32,
    colors: String,
    brand_name: String,
}

impl Product {
    pub fn new(
        id: String,
        status: ProductStatus,
        title: String,
        r#type: String,
        price: f32,
        overview: String,
        features: String,
        market_price: f32,
        categories: String,
        price_unit: PriceUnit,
        images: String,
        warranty: i32,
        description: String,
        sales_category: String,
        quantity: i32,
        specification: String,
        discount: i32,
        instock_status: InstockStatus,
        dealer_price: i32,
        colors: String,
        brand_name: String,
    ) -> Product {
        Product { id, title, r#type, price, overview, features, market_price, categories, price_unit, images, warranty, description, 
            sales_category, quantity, specification, discount, instock_status, dealer_price, colors, brand_name, status
        }
    }

    pub fn builder() -> ProductBuilder {
        let id = Some(get_pk());

        ProductBuilder {
            id,
            status: ProductStatus::default(),
            title: Some(String::default()),
            r#type: Some(String::default()),
            price: Some(0.0),
            overview: Some(String::from("<h1>Product overview</h1>")),
            features: Some(String::from("<h1>Product feature</h1>")),
            market_price: Some(0.0),
            categories: Some(String::default()),
            price_unit: PriceUnit::default(),
            images: Some(String::default()),
            warranty: Some(0),
            description: Some(String::from("<h1>Description</h1>")),
            sales_category: Some(String::default()),
            quantity: Some(1),
            specification: Some(String::default()),
            discount: Some(0),
            instock_status: InstockStatus::default(),
            dealer_price: Some(0),
            colors: Some(String::default()),
            brand_name: Some(String::default()),
        }
    }
}
