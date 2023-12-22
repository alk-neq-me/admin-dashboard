use rand::{thread_rng, RngCore};


pub fn get_pk() -> String {
    let mut bytes = [0; 24/2];
    thread_rng().fill_bytes(&mut bytes);

    hex::encode(&bytes)
}
