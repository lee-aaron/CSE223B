use std::process::Command;

fn main() -> anyhow::Result<()> {
  let mut cmd = Command::new("./avax/cmds/get-uris.sh");

  let output = cmd.output()?.stdout;
  let uris : serde_json::Value = serde_json::from_str(std::str::from_utf8(&output)?)?;

  println!("uris: {:?}", uris["uris"]);

  Ok(())
}