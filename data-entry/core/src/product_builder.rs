use crate::instock_status::InstockStatus;
use crate::price_unit::PriceUnit;
use crate::product::Product;
use crate::product_status::ProductStatus;
use crate::utils::get_pk;


#[derive(Default)]
pub struct ProductBuilder {
    pub id: Option<String>,
    pub status: ProductStatus,
    pub title: Option<String>,
    pub r#type: Option<String>,
    pub price: Option<f32>,
    pub overview: Option<String>,
    pub features: Option<String>,
    pub market_price: Option<f32>,
    pub categories: Option<String>,
    pub price_unit: PriceUnit,
    pub images: Option<String>,
    pub warranty: Option<i32>,
    pub description: Option<String>,
    pub sales_category: Option<String>,
    pub quantity: Option<i32>,
    pub specification: Option<String>,
    pub discount: Option<i32>,
    pub instock_status: InstockStatus,
    pub dealer_price: Option<i32>,
    pub colors: Option<String>,
    pub brand_name: Option<String>,
}

impl ProductBuilder {
    pub fn set_status(&mut self, status: ProductStatus) -> &mut Self {
        self.status = status;
        self
    }

    pub fn set_title(&mut self, title: &str) -> &mut Self {
        self.title = Some(String::from(title));
        self
    }

    pub fn set_type(&mut self, type_: &str) -> &mut Self {
        self.r#type = Some(String::from(type_));
        self
    }

    pub fn set_price_unit(&mut self, unit: PriceUnit) -> &mut Self {
        self.price_unit = unit;
        self
    }

    // overview
    // features
    // market_price

    pub fn set_categories(&mut self, categories: &[&str]) -> &mut Self {
        self.categories = Some(categories.join("\n"));
        self
    }

    // price_unit
    // images
    // warranty
    // description
    // sales_category
    // quantity

    pub fn set_specification(&mut self, specs: &[&str]) -> &mut Self {
        self.specification = Some(specs.join("\n "));
        self
    }

    //  ...fields

    pub fn set_colors(&mut self, colors: &[&str]) -> &mut Self {
        self.colors = Some(colors.join("\n "));
        self
    }

    pub fn set_brand_name(&mut self, brand: &str) -> &mut Self {
        self.brand_name = Some(String::from(brand));
        self
    }


    pub fn build(&mut self) -> Product {
        let pk = get_pk();

        Product::new(
            self.id.clone().unwrap_or(pk),
            self.status.clone(),
            self.title.clone().unwrap(), 
            self.r#type.clone().unwrap(), 
            self.price.unwrap(), 
            self.overview.clone().unwrap(), 
            self.features.clone().unwrap(), 
            self.market_price.clone().unwrap(), 
            self.categories.clone().unwrap(), 
            self.price_unit.clone(), 
            self.images.clone().unwrap(), 
            self.warranty.clone().unwrap(), 
            self.description.clone().unwrap(),
            self.sales_category.clone().unwrap(), 
            self.quantity.unwrap(), 
            self.specification.clone().unwrap(), 
            self.discount.clone().unwrap(), 
            self.instock_status.clone(), 
            self.dealer_price.unwrap(), 
            self.colors.clone().unwrap(), 
            self.brand_name.clone().unwrap()
        )
    }
}
