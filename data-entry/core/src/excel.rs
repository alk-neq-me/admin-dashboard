use std::io::Cursor;
use std::fs::{self, File};
use std::path::Path;

use polars::io::{json::JsonReader, SerReader, csv::CsvWriter, SerWriter};
use serde::Serialize;


pub fn export_excel<T>(products: &Vec<T>, path: &Path) 
where
    T: Serialize
{
    let json = serde_json::to_string(&products).expect("Failed: could not serialize json");

    let cursor = Cursor::new(json);
    let mut df = JsonReader::new(cursor).finish().expect("Failed: could not convert DataFrame");

    println!("{}", df);

    let dir = path.parent().expect("Failed: must provide output dir.");

    if !dir.is_dir() { fs::create_dir(Path::new(dir)).expect("Failed: could not create dir."); }

    let mut file = File::create(path).expect("Failed: could not create csv");

    CsvWriter::new(&mut file).finish(&mut df).expect("Faield: could not write csv");
}
