use std::path::Path;

use data_entry::{excel::export_excel, product::Product, price_unit::PriceUnit};


const OUTPUT_DIR: &str = "cvs_files";


fn main() {
    let p1 = Product::builder()
        .set_title("New poduct from Rust 🦀!")
        .set_specification(&["Ram: good", "Ready to use: Yes"])
        .set_colors(&["White"])
        .set_price_unit(PriceUnit::SGD)
        .set_brand_name("Rust")
        .set_categories(&["Fav_Rust", "Next Rust"])
        .build();

    let products = vec![p1];

    let mut file = Path::new(OUTPUT_DIR).join("products");
    file.set_extension("csv");

    export_excel(&products, &file);
}
