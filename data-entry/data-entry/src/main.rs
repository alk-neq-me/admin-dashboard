use core::{self, product::Product, excel::export_excel, parser::parse};
use std::path::Path;

fn main() {
    let p1 = Product::builder()
        .set_title("New Product")
        .build();

    let products = vec![p1];

    let mut file = Path::new("csv_files").join("products");
    file.set_extension("csv");

    // export_excel(&products, &file);

    parse().unwrap();
}
