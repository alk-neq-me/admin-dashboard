#![allow(unused)]

use std::path::Path;

use core::{parser, excel};
use core::error::Error;
use core::product::Product;

use chrono::{DateTime, Utc, Duration};
use dotenv::dotenv;


/**
* =TEXT(NOW(), "yyyy-mm-ddThh:mm:ss.000000000Z")    :: for iso date fromat  -> zero 9 words
* =TRUE()                                           :: for boolean type
* =FALSE()                                          :: for boolean type
*/

fn main() -> Result<(), Error> {
    dotenv().ok();

    let p1 = Product::builder()
        // .set_id(Some("6592852d67615710332551e6"))
        .set_id(None)

        .set_title("New Product")
        .set_brand_name("New brand")

        .set_overview(None)
        .set_specification(None)
        .set_description(None)
        
        // Sales
        .set_sales_name(Some("Gigi"))
        .set_sales_start_date(Some(Utc::now()))
        .set_sales_end_date(Some(Utc::now() + Duration::hours(24)))
        .set_sales_discount(Some(24.5))

        .build();

    let products = vec![p1];

    let mut file = Path::new("csv_files").join("products");
    file.set_extension("csv");

    excel::export_excel(&products, &file)?;

    // parser::parse()?;

    Ok(())
}
