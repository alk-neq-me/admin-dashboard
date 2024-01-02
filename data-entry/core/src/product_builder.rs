use chrono::{DateTime, Utc};

use crate::instock_status::InstockStatus;
use crate::price_unit::PriceUnit;
use crate::product::Product;
use crate::product_status::ProductStatus;
use crate::utils::get_pk;


pub struct ProductBuilder {
    pub id: Option<String>,
    pub status: ProductStatus,
    pub title: Option<String>,
    pub price: Option<f32>,
    pub overview: Option<String>,
    pub market_price: Option<f32>,
    pub categories: Option<String>,
    pub price_unit: PriceUnit,
    pub images: Option<String>,
    pub warranty: Option<i32>,
    pub description: Option<String>,
    pub quantity: Option<i32>,
    pub specification: Option<String>,
    pub discount: Option<i32>,
    pub instock_status: InstockStatus,
    pub dealer_price: Option<i32>,
    pub brand_name: Option<String>,

    pub sales_name: Option<String>,
    pub sales_start_date: Option<DateTime<Utc>>,
    pub sales_end_date: Option<DateTime<Utc>>,
    pub sales_is_active: Option<bool>,
    pub sales_discount: Option<f32>,
    pub sales_description: Option<String>,
}

impl Default for ProductBuilder {
    fn default() -> Self {
        let id = Some(get_pk());

        ProductBuilder {
            id,
            status: ProductStatus::default(),
            title: Some(String::from("New product from exel")),
            overview: Some(String::from("<h1>Product overview</h1>")),
            description: Some(String::from("<h1>Description</h1>")),
            specification: Some(String::from("spec_1: value_1\nspec_2: value_2")),
            price: Some(0.0),
            market_price: Some(0.0),
            categories: None,
            price_unit: PriceUnit::default(),
            images: None,
            warranty: Some(0),
            quantity: Some(1),
            discount: Some(0),
            instock_status: InstockStatus::default(),
            dealer_price: Some(0),
            brand_name: None,

            sales_name: None,
            sales_start_date: None,
            sales_end_date: None,
            sales_is_active: None,
            sales_description: None,
            sales_discount: None
        }
    }
}


impl ProductBuilder {
    pub fn set_id(&mut self, id: Option<&str>) -> &mut Self {
        self.id = id.map(String::from);
        self
    }

    pub fn set_status(&mut self, status: ProductStatus) -> &mut Self {
        self.status = status;
        self
    }

    pub fn set_title(&mut self, title: &str) -> &mut Self {
        self.title = Some(String::from(title));
        self
    }

    pub fn set_price(&mut self, price: f32) -> &mut Self {
        self.price = Some(price);
        self
    }

    pub fn set_overview(&mut self, overview_opt: Option<&str>) -> &mut Self {
        self.overview = overview_opt.map(String::from);
        self
    }
    
    pub fn set_market_price(&mut self, price: f32) -> &mut Self {
        self.market_price = Some(price);
        self
    }

    pub fn set_categories(&mut self, categories_opt: Option<&[&str]>) -> &mut Self {
        self.categories = categories_opt.map(|categories| categories.join("\n"));
        self
    }

    pub fn set_price_unit(&mut self, unit: PriceUnit) -> &mut Self {
        self.price_unit = unit;
        self
    }

    pub fn set_images(&mut self, images: &str) -> &mut Self {
        self.images = Some(String::from(images));
        self
    }

    pub fn set_warranty(&mut self, warranty: i32) -> &mut Self {
        self.warranty = Some(warranty);
        self
    }

    pub fn set_description(&mut self, description: Option<&str>) -> &mut Self {
        self.description = description.map(String::from);
        self
    }

    pub fn set_quantity(&mut self, quantity: i32) -> &mut Self {
        self.quantity = Some(quantity);
        self
    }

    pub fn set_specification(&mut self, specs_opt: Option<&[&str]>) -> &mut Self {
        self.specification = specs_opt.map(|specs| specs.join("\n"));
        self
    }

    pub fn set_discount(&mut self, discount: i32) -> &mut Self {
        self.discount = Some(discount);
        self
    }

    pub fn set_instock_status(&mut self, status: InstockStatus) -> &mut Self {
        self.instock_status = status;
        self
    }

    pub fn set_dealer_price(&mut self, dealer_price: i32) -> &mut Self {
        self.dealer_price = Some(dealer_price);
        self
    }

    pub fn set_brand_name(&mut self, brand: &str) -> &mut Self {
        self.brand_name = Some(String::from(brand));
        self
    }

    pub fn set_sales_name(&mut self, name: Option<&str>) -> &mut Self {
        self.sales_name = name.map(String::from);
        self
    }

    pub fn set_sales_start_date(&mut self, date: Option<DateTime<Utc>>) -> &mut Self {
        self.sales_start_date = date;
        self
    }

    pub fn set_sales_end_date(&mut self, date: Option<DateTime<Utc>>) -> &mut Self {
        self.sales_end_date = date;
        self
    }

    pub fn set_sales_is_active(&mut self, is_active: Option<bool>) -> &mut Self {
        self.sales_is_active = is_active;
        self
    }

    pub fn set_sales_description(&mut self, description: Option<&str>) -> &mut Self {
        self.sales_description = description.map(String::from);
        self
    }

    pub fn set_sales_discount(&mut self, discount: Option<f32>) -> &mut Self {
        self.sales_discount = discount;
        self
    }


    pub fn build(&mut self) -> Product {
        Product::new(
            self.id.clone(),
            self.status.clone(),
            self.title.clone().expect("title is required"),
            self.price.expect("price is required"),
            self.overview.clone(),
            self.market_price.expect("market_price is required"),
            self.categories.clone(),
            self.price_unit.clone(),
            self.images.clone(),
            self.warranty.expect("warranty is required"),
            self.description.clone(),
            self.quantity.expect("quantity is required"),
            self.specification.clone(),
            self.discount.expect("discount is required"),
            self.instock_status.clone(),
            self.dealer_price.expect("dealer_price is required"),
            self.brand_name.clone().expect("brand_name is required"),

            self.sales_name.clone(),
            self.sales_start_date.clone(),
            self.sales_end_date.clone(),
            self.sales_is_active.clone(),
            self.sales_description.clone(),
            self.sales_discount.clone(),
        )
    }
}
