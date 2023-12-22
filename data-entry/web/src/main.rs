use rocket_dyn_templates::{Template, context};

#[macro_use] extern crate rocket;

#[cfg(test)] mod tests;


struct AppState {}


#[get("/")]
async fn index() -> String {
    String::from("Hello")
}


#[get("/hello")]
async fn tem() -> Template {
    Template::render("hello.html", context! { name: "marco" })
}


#[rocket::main]
async fn main() -> Result<(), rocket::Error> {
    let state = AppState {};

    rocket::build()
        .manage(state)
        .mount("/", routes![index, tem])
        .attach(Template::fairing())
        .launch()
        .await?;

    Ok(())
}
