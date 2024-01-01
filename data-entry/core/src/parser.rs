use polars::{io::{csv::CsvReader, SerReader}, error::PolarsResult};


pub fn parse() -> PolarsResult<()> {
    let df = CsvReader::from_path("./csv_files/products.csv")?
        .has_header(true)
        .finish()?;

    let json = serde_json::to_value(&df).unwrap();

    println!("{:?}", json);
    Ok(())
}
